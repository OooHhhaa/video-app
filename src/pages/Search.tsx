import { useState, useEffect, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import VideoCard from '../components/VideoCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { searchVideos } from '../services/api';
import type { Video } from '../types';

const STORAGE_KEY = 'video_search_history';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 加载搜索历史
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHistory(JSON.parse(saved));
    }
    // 自动聚焦搜索框
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await searchVideos(query);
      if (response.code === 1 && response.list) {
        setVideos(response.list);
      }
      
      // 保存搜索历史
      const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('搜索失败:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // handleVideoClick unused but kept for future use
  // const handleVideoClick = (video: Video) => {
  //   navigate(`/detail/${video.id}`);
  // };

  return (
    <div className="h-full flex flex-col pt-12">
      {/* 顶部 */}
      <div className="px-4 pb-4 safe-area-top">
        <h1 className="text-2xl font-bold text-ios-text mb-4">搜索</h1>
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          onSearch={handleSearch}
        />
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 hide-scrollbar ios-scroll">
        {/* 搜索历史 */}
        {!hasSearched && history.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-ios-text-secondary">搜索历史</h2>
              <button
                onClick={clearHistory}
                className="text-xs text-ios-text-secondary hover:text-ios-red"
              >
                清空
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setKeyword(item);
                    handleSearch(item);
                  }}
                  className="px-3 py-1.5 bg-ios-card rounded-full text-sm text-ios-text-secondary touch-active hover:bg-ios-secondary"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 热门搜索 */}
        {!hasSearched && (
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-ios-text-secondary mb-3">热门搜索</h2>
            <div className="flex flex-wrap gap-2">
              {['流浪地球', '庆余年', '复仇者联盟', '斗破苍穹', '奔跑吧', '海贼王'].map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setKeyword(item);
                    handleSearch(item);
                  }}
                  className="px-3 py-1.5 bg-ios-card rounded-full text-sm text-ios-text-secondary touch-active hover:bg-ios-secondary"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 搜索结果 */}
        {loading && <Loading />}

        {!loading && hasSearched && videos.length === 0 && (
          <EmptyState
            icon="search"
            title="没有找到相关视频"
            description="换个关键词试试吧"
          />
        )}

        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-2 gap-3 py-4">
            {videos.map((video, index) => (
              <div key={`${video.id}-${index}`} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
