import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import type { Video } from '../types';
import { parseVideoUrl } from '../services/api';

export default function Player() {
  const { id: _id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const controlsTimeoutRef = useRef<number>();

  const video = location.state?.video as Video | undefined;
  const playUrl = location.state?.playUrl as string | undefined;

  useEffect(() => {
    if (!video || !playUrl) {
      navigate('/');
    }
  }, [video, playUrl, navigate]);

  useEffect(() => {
    // 自动播放
    const videoEl = videoRef.current;
    if (videoEl && playUrl) {
      // 如果是直链视频
      if (playUrl.startsWith('http') && !playUrl.includes('jx.jsonplayer')) {
        videoEl.src = playUrl;
        videoEl.play().catch(() => {});
      }
    }
  }, [playUrl]);

  const togglePlay = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.play();
    } else {
      videoEl.pause();
    }
  };

  const handleTimeUpdate = () => {
    const videoEl = videoRef.current;
    if (videoEl) {
      setCurrentTime(videoEl.currentTime);
      if (videoEl.buffered.length > 0) {
        setBuffered(videoEl.buffered.end(videoEl.buffered.length - 1));
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.currentTime = parseFloat(e.target.value);
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        setIsFullscreen(true);
        if (videoRef.current) {
          videoRef.current.style.maxHeight = '100vh';
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('全屏切换失败:', err);
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!video) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50"
    >
      {/* 返回按钮 */}
      <button
        onClick={() => navigate(-1)}
        className={`fixed top-12 left-4 z-50 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center touch-active transition-opacity ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 视频标题 */}
      <div className={`fixed top-12 right-4 left-20 z-50 transition-opacity ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        <h2 className="text-white text-sm font-medium truncate">{video.name}</h2>
      </div>

      {/* 播放器区域 */}
      <div 
        className="w-full h-full flex items-center justify-center bg-black"
        onClick={showControlsTemporarily}
      >
        {/* 使用iframe加载解析后的播放器 */}
        {playUrl && (
          <iframe
            src={parseVideoUrl(playUrl)}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            style={{ border: 'none' }}
          />
        )}
        
        {/* 备用原生video标签 */}
        <video
          ref={videoRef}
          className="hidden"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            const videoEl = videoRef.current;
            if (videoEl) {
              setDuration(videoEl.duration);
            }
          }}
          playsInline
        />
      </div>

      {/* 控制栏 */}
      <div className={`fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 safe-area-bottom transition-opacity ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* 进度条 */}
        <div className="relative h-1 bg-white/30 rounded-full mb-4 group">
          {/* 缓冲进度 */}
          <div 
            className="absolute h-full bg-white/30 rounded-full"
            style={{ width: `${(buffered / duration) * 100}%` }}
          />
          {/* 播放进度 */}
          <div 
            className="absolute h-full bg-ios-blue rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          {/* 拖动点 */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-ios-blue rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${(currentTime / duration) * 100}% - 6px)` }}
          />
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* 播放/暂停 */}
            <button onClick={togglePlay} className="touch-active">
              {isPlaying ? (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* 时间显示 */}
            <span className="text-white text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* 全屏 */}
            <button onClick={toggleFullscreen} className="touch-active">
              {isFullscreen ? (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
