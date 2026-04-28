import { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import CategoryTabs from '../components/CategoryTabs';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { fetchHomeVideos, fetchVideosByCategory } from '../services/api';
import type { Video } from '../types';

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadVideos(true);
  }, [category]);

  const loadVideos = async (reset: boolean = false) => {
    if (!reset && loading) return;
    
    const currentPage = reset ? 1 : page;
    
    try {
      setLoading(true);
      const response = category === 'all'
        ? await fetchHomeVideos(currentPage)
        : await fetchVideosByCategory(category, currentPage);
      
      if (response.code === 1 && response.list) {
        setVideos(reset ? response.list : [...videos, ...response.list]);
        setPage(currentPage + 1);
        setHasMore(currentPage < response.pagecount);
      }
    } catch (error) {
      console.error('加载视频失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory !== category) {
      setCategory(newCategory);
      setVideos([]);
      setPage(1);
      setHasMore(true);
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
        <h1 className="text-2xl font-bold text-ios-text">云影视频</h1>
        <p className="text-sm text-ios-text-secondary mt-1">发现精彩影视内容</p>
      </div>

      {/* 分类标签 */}
      <CategoryTabs activeCategory={category} onCategoryChange={handleCategoryChange} />

      {/* 视频列表 */}
      <div 
        className="flex-1 overflow-y-auto px-4 pb-20 hide-scrollbar ios-scroll"
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
        
        {loading && videos.length > 0 && (
          <div className="py-4">
            <Loading size="small" />
          </div>
        )}

        {!hasMore && videos.length > 0 && (
          <p className="text-center text-ios-text-secondary text-sm py-4">
            - 已加载全部 -
          </p>
        )}
      </div>
    </div>
  );
}
