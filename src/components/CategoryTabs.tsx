import { categoryNames } from '../services/api';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = ['all', 'movie', 'tv', 'anime', 'variety'];

export default function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="overflow-x-auto hide-scrollbar">
      <div className="flex gap-2 px-4 py-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all touch-active ${
              activeCategory === cat
                ? 'bg-ios-blue text-white'
                : 'bg-ios-card text-ios-text-secondary hover:bg-ios-secondary'
            }`}
          >
            {categoryNames[cat] || cat}
          </button>
        ))}
      </div>
    </div>
  );
}
