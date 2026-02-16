// lib/subscription/plans.ts
// 프리미엄 플랜 정의

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    dailyVotes: number;
    roomsPerDay: number;
    itemsPerVote: number;
    historyDays: number;
  };
}

export const PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: '무료',
    price: 0,
    currency: 'KRW',
    interval: 'month',
    features: [
      '하루 3회 투표',
      '투표당 최대 10개 항목',
      '7일간 히스토리 보관',
      '광고 표시',
    ],
    limits: {
      dailyVotes: 3,
      roomsPerDay: 3,
      itemsPerVote: 10,
      historyDays: 7,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 3900,
    currency: 'KRW',
    interval: 'month',
    features: [
      '✅ 무제한 투표',
      '✅ 투표당 최대 50개 항목',
      '✅ 90일간 히스토리 보관',
      '✅ 광고 없음',
      '✅ 우선 지원',
      '✅ 고급 분석 (선호도 리포트)',
      '✅ 맞춤 카테고리 생성',
    ],
    limits: {
      dailyVotes: -1, // unlimited
      roomsPerDay: -1,
      itemsPerVote: 50,
      historyDays: 90,
    },
  },
  team: {
    id: 'team',
    name: 'Team',
    price: 9900,
    currency: 'KRW',
    interval: 'month',
    features: [
      '✅ Pro의 모든 기능',
      '✅ 팀 워크스페이스',
      '✅ 5명 멤버 포함',
      '✅ 브랜드 커스터마이징',
      '✅ API 액세스',
      '✅ 우선 순위 지원',
    ],
    limits: {
      dailyVotes: -1,
      roomsPerDay: -1,
      itemsPerVote: 100,
      historyDays: 365,
    },
  },
};

// 사용량 체크 함수
export function checkLimit(
  plan: SubscriptionPlan,
  type: keyof SubscriptionPlan['limits'],
  current: number
): { allowed: boolean; remaining: number } {
  const limit = plan.limits[type];
  
  if (limit === -1) {
    return { allowed: true, remaining: -1 };
  }
  
  return {
    allowed: current < limit,
    remaining: Math.max(0, limit - current),
  };
}
