// components/LimitReachedModal.tsx
'use client';

import { useRouter } from 'next/navigation';
import { X, Zap } from 'lucide-react';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  limitType: 'dailyVotes' | 'itemsPerVote' | 'roomsPerDay';
  current: number;
  limit: number;
}

export default function LimitReachedModal({
  isOpen,
  onClose,
  limitType,
  current,
  limit,
}: LimitReachedModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const messages = {
    dailyVotes: {
      title: '오늘의 투표 횟수 초과',
      description: `무료 플랜은 하루 ${limit}회까지 투표 가능합니다.`,
      benefit: '무제한 투표로 언제든 선택하세요!',
    },
    itemsPerVote: {
      title: '항목 개수 제한',
      description: `무료 플랜은 투표당 ${limit}개까지 가능합니다.`,
      benefit: '최대 50개 항목으로 정교한 순위를 만드세요!',
    },
    roomsPerDay: {
      title: '투표방 생성 제한',
      description: `무료 플랜은 하루 ${limit}개까지 생성 가능합니다.`,
      benefit: '무제한 투표방으로 자유롭게 사용하세요!',
    },
  };

  const message = messages[limitType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-slide-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {message.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6">
          {message.description}
          <br />
          <span className="text-sm">
            현재 {current} / {limit} 사용 중
          </span>
        </p>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Pro 플랜으로 업그레이드하면:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {message.benefit}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              광고 없이 깔끔하게
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              선호도 분석 리포트 제공
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/subscription')}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Pro로 업그레이드 (₩3,900/월)
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-all"
          >
            나중에 하기
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-4">
          7일 무료 체험 가능 · 언제든 취소 가능
        </p>
      </div>
    </div>
  );
}
