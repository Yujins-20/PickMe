// app/subscription/page.tsx
'use client';

import { useState } from 'react';
import { Check, Zap, Users, Crown } from 'lucide-react';
import { PLANS } from '@/lib/subscription/plans';
import toast from 'react-hot-toast';

export default function SubscriptionPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId,
          userId: 'temp_user_id' // Replace with actual user ID
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toast.error('결제 페이지로 이동하는 중 오류가 발생했습니다');
    } finally {
      setLoading(null);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Zap className="w-8 h-8 text-gray-500" />;
      case 'pro':
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 'team':
        return <Users className="w-8 h-8 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            당신에게 맞는 플랜을 선택하세요
          </h1>
          <p className="text-xl text-gray-600">
            더 많은 선택, 더 빠른 결정, 더 정확한 순위
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {Object.values(PLANS).map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-xl p-8 ${
                plan.id === 'pro'
                  ? 'border-4 border-yellow-400 relative'
                  : 'border border-gray-200'
              }`}
            >
              {plan.id === 'pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  인기 🔥
                </div>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-4">
                {getPlanIcon(plan.id)}
              </div>

              {/* Name */}
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                {plan.name}
              </h2>

              {/* Price */}
              <div className="text-center mb-6">
                {plan.price === 0 ? (
                  <div className="text-3xl font-bold text-gray-900">무료</div>
                ) : (
                  <>
                    <div className="text-4xl font-bold text-gray-900">
                      ₩{plan.price.toLocaleString()}
                    </div>
                    <div className="text-gray-600">/ 월</div>
                  </>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={plan.id === 'free' || loading === plan.id}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.id === 'free'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : plan.id === 'pro'
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } disabled:opacity-50`}
              >
                {loading === plan.id
                  ? '처리 중...'
                  : plan.id === 'free'
                  ? '현재 플랜'
                  : '시작하기'}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            <details className="group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                <span>언제든지 취소할 수 있나요?</span>
                <span className="transition group-open:rotate-180">⌄</span>
              </summary>
              <p className="mt-2 text-gray-600">
                네! 언제든지 취소 가능하며, 다음 결제 주기부터 청구되지 않습니다.
              </p>
            </details>

            <details className="group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                <span>무료 플랜으로 다시 돌아갈 수 있나요?</span>
                <span className="transition group-open:rotate-180">⌄</span>
              </summary>
              <p className="mt-2 text-gray-600">
                물론입니다. 구독을 취소하면 자동으로 무료 플랜으로 전환됩니다.
              </p>
            </details>

            <details className="group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                <span>환불 정책은 어떻게 되나요?</span>
                <span className="transition group-open:rotate-180">⌄</span>
              </summary>
              <p className="mt-2 text-gray-600">
                구독 후 7일 이내 전액 환불 가능합니다. 이후에는 비례 환불이 적용됩니다.
              </p>
            </details>

            <details className="group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                <span>팀 플랜은 몇 명까지 사용 가능한가요?</span>
                <span className="transition group-open:rotate-180">⌄</span>
              </summary>
              <p className="mt-2 text-gray-600">
                기본 5명 포함이며, 추가 멤버는 인당 월 ₩1,900입니다.
              </p>
            </details>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">기업용 맞춤 플랜</h2>
          <p className="text-lg mb-6 opacity-90">
            100명 이상의 대규모 조직을 위한 특별 플랜과 전담 지원
          </p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all">
            영업팀에 문의하기
          </button>
        </div>
      </div>
    </main>
  );
}
