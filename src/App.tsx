import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TabBar from './components/TabBar';
import Home from './pages/Home';
import Category from './pages/Category';
import Search from './pages/Search';
import Detail from './pages/Detail';
import Player from './pages/Player';

function AppContent() {
  const location = useLocation();
  
  // 播放器页面不需要TabBar
  const isPlayerPage = location.pathname.startsWith('/player');
  
  // 获取当前激活的tab
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/' || path === '') return 'home';
    if (path === '/category') return 'category';
    if (path === '/search') return 'search';
    return '';
  };

  return (
    <div className="min-h-screen bg-ios-bg text-ios-text">
      <div className={`max-w-lg mx-auto ${isPlayerPage ? '' : 'h-screen overflow-hidden'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Category />} />
          <Route path="/search" element={<Search />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/player/:id" element={<Player />} />
        </Routes>
        
        {!isPlayerPage && <TabBar activeTab={getActiveTab()} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
