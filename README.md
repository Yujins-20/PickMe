# PickMe - AI 기반 선택 도우미

> "평점 말고, 내 취향으로!" 
> CIKM 2025 논문 기반 똑똑한 선택 도우미

## 🎯 프로젝트 소개

PickMe는 Elo Rating과 GURO(Greedy Uncertainty Reduction Optimization) 알고리즘을 활용한 AI 기반 선택 도우미입니다. 최소한의 비교만으로 사용자의 선호도를 정확하게 파악하여 최적의 선택을 도와줍니다.

### 주요 기능

- **🧠 똑똑한 알고리즘**: Elo Rating + GURO active sampling
- **⚡ 빠른 결정**: 10개 중 선택하는데 3-4번의 비교만 필요
- **👥 그룹 투표**: 링크 공유만으로 친구들과 함께 의사결정
- **🍽️ 맛집 검색**: 네이버 API 연동으로 근처 맛집 자동 추천
- **📊 실시간 순위**: 비교할 때마다 실시간으로 업데이트되는 순위

## 🛠️ 기술 스택

### Frontend
- **Next.js 14** (React 18) - App Router
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링
- **Framer Motion** - 애니메이션
- **Zustand** - 상태 관리
- **React Hot Toast** - 알림

### Backend
- **Supabase** - Database (PostgreSQL)
- **Supabase Auth** - 인증 (선택사항)
- **Next.js API Routes** - 서버리스 API

### 알고리즘
- **Elo Rating System** - 페어와이즈 비교 기반 랭킹
- **GURO Sampler** - Active Learning 기반 최적 페어 선택

### 배포
- **Vercel** - 프론트엔드 호스팅
- **Supabase** - 데이터베이스 호스팅

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone https://github.com/yourusername/pickme-app.git
cd pickme-app
```

### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 3. 환경 변수 설정

`.env.example`을 복사하여 `.env.local` 파일 생성:

```bash
cp .env.example .env.local
```

다음 환경 변수를 설정:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Analytics (선택사항)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Naver API
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

### 4. Supabase 데이터베이스 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/001_initial_schema.sql` 실행
3. 프로젝트 URL과 anon key를 `.env.local`에 추가

### 5. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📱 주요 페이지

### 1. 홈페이지 (`/`)
- 카테고리 선택
- 개인/그룹 투표 선택
- 기능 소개

### 2. 투표 생성 (`/create`)
- 수동 항목 입력
- 네이버 맛집 검색 및 추가
- 투표방 생성

### 3. 투표방 (`/room/[code]`)
- 페어와이즈 비교
- 실시간 진행률
- 중간 순위 확인

### 4. 결과 페이지
- 최종 순위 표시
- 1-3등 포디엄
- 공유 및 재투표

## 🧪 알고리즘 설명

### Elo Rating System

체스 등급 시스템에서 사용되는 Elo Rating을 페어와이즈 비교에 적용:

```typescript
// 예상 점수 계산
expectedScore = 1 / (1 + 10^((ratingB - ratingA) / 400))

// 실제 결과 반영
newRating = oldRating + K * (actual - expected)
```

### GURO (Greedy Uncertainty Reduction Optimization)

정보 이득이 가장 높은 페어를 선택하는 active learning 전략:

```typescript
informationGain = uncertainty × closeness × balance

where:
- uncertainty: 항목의 불확실성 (비교 횟수가 적을수록 높음)
- closeness: 레이팅 유사도 (비슷한 레이팅일수록 높음)
- balance: 비교 균형도 (비교 횟수가 균등할수록 높음)
```

## 📊 데이터베이스 스키마

```sql
voting_rooms
- id (UUID, PK)
- room_code (VARCHAR, UNIQUE)
- title (VARCHAR)
- category (VARCHAR)
- status (ENUM: active, completed, archived)

voting_items
- id (UUID, PK)
- room_id (UUID, FK)
- name (VARCHAR)
- image_url (TEXT)
- rating (DECIMAL)
- comparisons (INTEGER)
- wins (INTEGER)
- losses (INTEGER)

comparisons
- id (UUID, PK)
- room_id (UUID, FK)
- winner_id (UUID, FK)
- loser_id (UUID, FK)
- created_at (TIMESTAMP)
```

## 🌐 API 라우트

### `/api/naver/search`
네이버 지역 검색 API 프록시

**Parameters:**
- `query`: 검색 쿼리
- `display`: 결과 개수 (기본: 10)
- `start`: 시작 위치 (기본: 1)

## 📈 배포

### Vercel 배포

1. GitHub에 푸시
2. [Vercel](https://vercel.com)에서 import
3. 환경 변수 설정
4. 배포 완료!

### 환경 변수 체크리스트

- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] NAVER_CLIENT_ID
- [ ] NAVER_CLIENT_SECRET
- [ ] NEXT_PUBLIC_GA_ID (선택사항)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

MIT License

## 📧 연락처

프로젝트 링크: [https://github.com/yourusername/pickme-app](https://github.com/yourusername/pickme-app)

---

Made with ❤️ by PickMe Team | Based on CIKM 2025 Research
# pickme-app
