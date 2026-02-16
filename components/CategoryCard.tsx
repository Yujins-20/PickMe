// components/CategoryCard.tsx
'use client';

import { Flame } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  popular?: boolean;
}

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="relative bg-white hover:bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-left group"
    >
      {category.popular && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          <Flame className="w-3 h-3" />
          <span>인기</span>
        </div>
      )}
      <div className="text-4xl mb-3">{category.icon}</div>
      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-red-500 transition-colors">
        {category.name}
      </h3>
      <p className="text-sm text-gray-600">{category.description}</p>
    </button>
  );
}
