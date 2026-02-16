// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Users, Sparkles, TrendingUp } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';

const categories = [
  {
    id: 'lunch',
    name: '점심 메뉴',
    icon: '🍱',
    description: '오늘 점심 뭐 먹지?',
    popular: true,
  },
  {
    id: 'dinner',
    name: '저녁 메뉴',
    icon: '🍽️',
    description: '저녁은 특별하게',
  },
  {
    id: 'cafe',
    name: '카페/디저트',
    icon: '☕',
    description: '달달한 여유',
  },
  {
    id: 'gathering',
    name: '회식 장소',
    icon: '🍻',
    description: '팀 회식 어디서?',
  },
  {
    id: 'weekend',
    name: '주말 활동',
    icon: '🎬',
    description: '영화, 전시, 나들이',
  },
  {
    id: 'custom',
    name: '직접 만들기',
    icon: '✨',
    description: '나만의 선택 만들기',
  },
];

export default function Home() {
  const router = useRouter();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'custom') {
      router.push('/create');
    } else {
      router.push(`/create?category=${categoryId}`);
    }
  };

  const handleJoinRoom = () => {
    const roomCode = prompt('방 코드를 입력하세요:');
    if (roomCode) {
      router.push(`/room/${roomCode.toUpperCase()}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="text-6xl mb-2">🎯</div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Pick<span className="text-red-500">Me</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            평점 말고, <span className="font-semibold text-red-500">내 취향</span>으로
          </p>
          <p className="text-lg text-gray-500">
            AI 기반 똑똑한 선택 도우미
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>CIKM 2025 논문 기반</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>19.6배 빠른 결정</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-in-up">
          <button
            onClick={() => router.push('/create')}
            className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Target className="w-5 h-5" />
            개인 선택 시작
          </button>
          <button
            onClick={handleJoinRoom}
            className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            그룹 투표 참여
          </button>
        </div>

        {/* Categories */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            어떤 선택이 필요하신가요?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategorySelect(category.id)}
              />
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            왜 PickMe인가요?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-bold text-lg mb-2">똑똑한 알고리즘</h3>
              <p className="text-gray-600 text-sm">
                Elo Rating 기반 GURO 알고리즘으로 최소 비교로 정확한 순위 도출
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-lg mb-2">빠른 결정</h3>
              <p className="text-gray-600 text-sm">
                10개 중 선택하는데 단 3-4번의 비교만으로 충분
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-bold text-lg mb-2">그룹 투표</h3>
              <p className="text-gray-600 text-sm">
                링크만 공유하면 친구들과 함께 쉽고 빠르게 결정
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-4xl mx-auto mt-20 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            이렇게 작동합니다
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">후보 입력</h4>
                <p className="text-gray-600 text-sm">
                  점심 메뉴, 맛집, 영화 등 선택할 항목들을 입력하거나 네이버에서 검색
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">간단한 비교</h4>
                <p className="text-gray-600 text-sm">
                  "A vs B 중 어느 것이 더 좋아?" 단 몇 번만 답변
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">AI가 순위 계산</h4>
                <p className="text-gray-600 text-sm">
                  당신의 선호도를 학습하여 정확한 순위 제공
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">최종 결정!</h4>
                <p className="text-gray-600 text-sm">
                  1등 항목을 선택하고 바로 길찾기 또는 예약
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-gray-500 text-sm">
          <p>Made with ❤️ by PickMe Team</p>
          <p className="mt-2">
            © 2024 PickMe. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
