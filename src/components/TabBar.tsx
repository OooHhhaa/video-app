import { useNavigate } from 'react-router-dom';

interface TabBarProps {
  activeTab: string;
}

const tabs = [
  { id: 'home', name: '首页', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'category', name: '分类', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { id: 'search', name: '搜索', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
];

export default function TabBar({ activeTab }: TabBarProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-ios-card border-t border-ios-border safe-area-bottom z-50">
      <div className="flex justify-around items-center h-14">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(`/${tab.id === 'home' ? '' : tab.id}`)}
            className={`flex flex-col items-center justify-center w-full h-full touch-active transition-colors ${
              activeTab === tab.id ? 'text-ios-blue' : 'text-ios-text-secondary'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={activeTab === tab.id ? 2 : 1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            <span className="text-[10px] mt-1 font-medium">{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
