// components/ComparisonCard.tsx
'use client';

import { useState } from 'react';
import { ChevronRight, Shuffle } from 'lucide-react';
import { ComparisonPair } from '@/lib/algorithms/guro';

interface ComparisonCardProps {
  pair: ComparisonPair;
  onSelect: (winnerId: string, loserId: string) => void;
  onSkip?: () => void;
}

export default function ComparisonCard({ pair, onSelect, onSkip }: ComparisonCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (winnerId: string) => {
    setSelectedId(winnerId);

    // Animate selection
    setTimeout(() => {
      const loserId = winnerId === pair.itemA.id ? pair.itemB.id : pair.itemA.id;
      onSelect(winnerId, loserId);
      setSelectedId(null);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Question */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          어느 것이 더 좋나요?
        </h2>
        <p className="text-gray-600">클릭하여 선택하세요</p>
      </div>

      {/* Comparison Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Item A */}
        <button
          onClick={() => handleSelect(pair.itemA.id)}
          disabled={selectedId !== null}
          className={`
            relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6
            border-4 cursor-pointer disabled:cursor-not-allowed
            ${
              selectedId === pair.itemA.id
                ? 'border-green-500 scale-105'
                : selectedId === pair.itemB.id
                ? 'border-red-300 opacity-50'
                : 'border-transparent hover:border-red-200'
            }
          `}
        >
          <div className="aspect-square bg-gradient-to-br from-red-100 to-orange-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
            {pair.itemA.imageUrl ? (
              <img
                src={pair.itemA.imageUrl}
                alt={pair.itemA.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl">🍽️</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center">
            {pair.itemA.name}
          </h3>
          {selectedId === pair.itemA.id && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-20 rounded-2xl">
              <span className="text-6xl">✓</span>
            </div>
          )}
        </button>

        {/* Item B */}
        <button
          onClick={() => handleSelect(pair.itemB.id)}
          disabled={selectedId !== null}
          className={`
            relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6
            border-4 cursor-pointer disabled:cursor-not-allowed
            ${
              selectedId === pair.itemB.id
                ? 'border-green-500 scale-105'
                : selectedId === pair.itemA.id
                ? 'border-red-300 opacity-50'
                : 'border-transparent hover:border-red-200'
            }
          `}
        >
          <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
            {pair.itemB.imageUrl ? (
              <img
                src={pair.itemB.imageUrl}
                alt={pair.itemB.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl">🍴</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center">
            {pair.itemB.name}
          </h3>
          {selectedId === pair.itemB.id && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-20 rounded-2xl">
              <span className="text-6xl">✓</span>
            </div>
          )}
        </button>
      </div>

      {/* VS Badge */}
      <div className="flex justify-center -my-4 relative z-10">
        <div className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
          VS
        </div>
      </div>

      {/* Skip Button */}
      {onSkip && (
        <div className="text-center">
          <button
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 mx-auto"
          >
            <Shuffle className="w-4 h-4" />
            선택하기 어려워요 (다른 항목 보기)
          </button>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
        <p className="font-medium mb-1">💡 팁</p>
        <p>
          직관적으로 선택하세요. AI가 당신의 선호도를 학습합니다.
          어려운 선택일수록 더 정확한 순위가 만들어집니다!
        </p>
      </div>
    </div>
  );
}
