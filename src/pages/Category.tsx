import { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { fetchVideosByCategory, categoryNames } from '../services/api';
import type { Video } from '../types';

interface CategoryPageProps {
  initialCategory?: string;
}

const allCategories = [
  { id: 'movie', name: '电影', icon: '🎬' },
  { id: 'tv', name: '电视剧', icon: '📺' },
  { id: 'anime', name: '动漫', icon: '🎭' },
  { id: 'variety', name: '综艺', icon: '🎪' },
];

export default function CategoryPage({ initialCategory }: CategoryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'movie');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadVideos(true);
  }, [selectedCategory]);

  const loadVideos = async (reset: boolean = false) => {
    if (loading) return;
    
    const currentPage = reset ? 1 : page;
    
    try {
      setLoading(true);
      const response = await fetchVideosByCategory(selectedCategory, currentPage);
      
      if (response.code === 1 && response.list) {
        setVideos(reset ? response.list : [...videos, ...response.list]);
        setPage(currentPage + 1);
        setHasMore(currentPage < response.pagecount);
      }
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 100 && hasMore && !loading) {
      loadVideos(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题 */}
      <div className="px-4 pt-12 pb-4 safe-area-top">
        <h1 className="text-2xl font-bold text-ios-text">分类</h1>
        <p className="text-sm text-ios-text-secondary mt-1">
          浏览 {categoryNames[selectedCategory]} 专区
        </p>
      </div>

      {/* 分类选择 */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {allCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setVideos([]);
              setPage(1);
              setHasMore(true);
            }}
            className={`flex items-center gap-3 p-4 rounded-ios-lg transition-all touch-active ${
              selectedCategory === cat.id
                ? 'bg-ios-blue text-white'
                : 'bg-ios-card text-ios-text-secondary'
            }`}
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="font-medium">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 视频列表 */}
      <div 
        className="flex-1 overflow-y-auto px-4 pb-20 mt-4 hide-scrollbar ios-scroll"
        onScroll={handleScroll}
      >
        {videos.length === 0 && !loading ? (
          <EmptyState
            icon="video"
            title="暂无视频"
            description="该分类下暂时没有视频内容"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 py-4">
            {videos.map((video, index) => (
              <div key={`${video.id}-${index}`} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        )}
        
        {loading && <Loading />}
        
        {!hasMore && videos.length > 0 && (
          <p className="text-center text-ios-text-secondary text-sm py-4">
            - 已加载全部 -
          </p>
        )}
      </div>
    </div>
  );
}
