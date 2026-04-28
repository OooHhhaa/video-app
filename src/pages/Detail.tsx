import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { fetchVideoDetail, getDirectPlayUrl } from '../services/api';
import type { Video } from '../types';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(0);

  useEffect(() => {
    loadVideoDetail();
  }, [id]);

  const loadVideoDetail = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const detail = await fetchVideoDetail(id);
      setVideo(detail);
    } catch (error) {
      console.error('加载详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (video) {
      const playUrl = getDirectPlayUrl(video);
      navigate(`/player/${encodeURIComponent(video.id)}`, {
        state: { 
          video,
          playUrl,
          episodeIndex: selectedEpisode
        }
      });
    }
  };

  // 解析播放源
  const parsePlayUrls = (vodPlayUrl: string): { name: string; episodes: string[] }[] => {
    if (!vodPlayUrl) return [];
    
    const sources: { name: string; episodes: string[] }[] = [];
    const parts = vodPlayUrl.split('#');
    
    parts.forEach(part => {
      if (part.includes('$')) {
        const [name, urls] = part.split('$');
        const episodes = urls.split(',').filter(Boolean);
        sources.push({ name: name || '默认', episodes });
      }
    });
    
    return sources;
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!video) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState
          icon="error"
          title="加载失败"
          description="无法获取视频详情"
          action={{
            label: '返回首页',
            onClick: () => navigate('/')
          }}
        />
      </div>
    );
  }

  const playSources = parsePlayUrls(video.vod_play_url || video.vod_url || '');
  const currentSource = playSources[0];

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-12 left-4 z-50 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center touch-active"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 封面图 */}
      <div className="relative w-full aspect-video bg-ios-secondary">
        <img
          src={video.pic || 'https://via.placeholder.com/800x450/1C1C1E/8E8E93?text=No+Image'}
          alt={video.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* 播放按钮 */}
        <button
          onClick={handlePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-ios-blue/90 backdrop-blur-sm rounded-full flex items-center justify-center touch-active"
        >
          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      {/* 视频信息 */}
      <div className="px-4 py-4">
        <h1 className="text-xl font-bold text-ios-text">{video.name}</h1>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {video.type && (
            <span className="px-2 py-1 bg-ios-card rounded text-xs text-ios-text-secondary">
              {video.type}
            </span>
          )}
          {video.area && (
            <span className="px-2 py-1 bg-ios-card rounded text-xs text-ios-text-secondary">
              {video.area}
            </span>
          )}
          {video.year && (
            <span className="px-2 py-1 bg-ios-card rounded text-xs text-ios-text-secondary">
              {video.year}
            </span>
          )}
        </div>

        {/* 简介 */}
        {video.des && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-ios-text-secondary mb-2">简介</h2>
            <p className="text-sm text-ios-text leading-relaxed">
              {video.des}
            </p>
          </div>
        )}

        {/* 演员 */}
        {video.actor && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-ios-text-secondary mb-2">演员</h2>
            <p className="text-sm text-ios-text">
              {video.actor}
            </p>
          </div>
        )}

        {/* 导演 */}
        {video.director && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-ios-text-secondary mb-2">导演</h2>
            <p className="text-sm text-ios-text">
              {video.director}
            </p>
          </div>
        )}

        {/* 剧集列表 */}
        {currentSource && currentSource.episodes.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-ios-text-secondary mb-3">
              选集 ({currentSource.episodes.length}集)
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {currentSource.episodes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedEpisode(index)}
                  className={`py-2 rounded-lg text-sm font-medium touch-active transition-colors ${
                    selectedEpisode === index
                      ? 'bg-ios-blue text-white'
                      : 'bg-ios-card text-ios-text-secondary'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部播放按钮 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent safe-area-bottom">
        <button
          onClick={handlePlay}
          className="w-full py-4 bg-ios-blue text-white rounded-ios-lg text-base font-semibold touch-active flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          立即播放
        </button>
      </div>
    </div>
  );
}
