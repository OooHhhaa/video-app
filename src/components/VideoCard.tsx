import { useNavigate } from 'react-router-dom';
import type { Video } from '../types';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/detail/${video.id}`)}
      className="bg-ios-card rounded-ios-lg overflow-hidden touch-active cursor-pointer transition-transform active:scale-[0.98]"
    >
      <div className="relative aspect-[3/4] bg-ios-secondary">
        <img
          src={video.pic || 'https://via.placeholder.com/300x400/1C1C1E/8E8E93?text=No+Image'}
          alt={video.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* 评分标签 */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs text-ios-green font-medium">
          HD
        </div>
        {/* 播放状态 */}
        {video.state === '1' && (
          <div className="absolute bottom-2 left-2 bg-ios-blue px-2 py-0.5 rounded text-xs font-medium">
            完结
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-ios-text line-clamp-2 leading-tight">
          {video.name}
        </h3>
        <p className="text-xs text-ios-text-secondary mt-1 line-clamp-1">
          {video.actor || video.type || '未知演员'}
        </p>
      </div>
    </div>
  );
}
