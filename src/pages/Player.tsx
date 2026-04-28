import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import type { Video } from '../types';
import { getDirectPlayUrl } from '../services/api';

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
  const [videoSrc, setVideoSrc] = useState('');
  const controlsTimeoutRef = useRef<number>();

  const video = location.state?.video as Video | undefined;
  const playUrl = location.state?.playUrl as string | undefined;

  useEffect(() => {
    if (!video || !playUrl) {
      navigate('/');
      return;
    }
    // 直接设置视频源
    const directUrl = getDirectPlayUrl(video);
    setVideoSrc(directUrl);
  }, [video, playUrl, navigate]);

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.src = videoSrc;
    }
  }, [videoSrc]);

  const togglePlay = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (videoEl.paused) {
      videoEl.play().catch(() => {});
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
    <div ref={containerRef} className="fixed inset-0 bg-black z-50">
      <button
        onClick={() => navigate(-1)}
        className={`fixed top-12 left-4 z-50 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center touch-active transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className={`fixed top-12 right-4 left-20 z-50 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-white text-sm font-medium truncate">{video.name}</h2>
      </div>

      <div className="w-full h-full flex items-center justify-center bg-black" onClick={showControlsTemporarily}>
        <video
          ref={videoRef}
          className="w-full h-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            const videoEl = videoRef.current;
            if (videoEl) setDuration(videoEl.duration);
          }}
          playsInline
        />
      </div>

      <div className={`fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 safe-area-bottom transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative h-1 bg-white/30 rounded-full mb-4 group">
          <div className="absolute h-full bg-white/30 rounded-full" style={{ width: `${duration ? (buffered / duration) * 100 : 0}%` }} />
          <div className="absolute h-full bg-ios-blue rounded-full" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
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
            <span className="text-white text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

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
  );
}
