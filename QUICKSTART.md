# PickMe 빠른 시작 가이드

## 1단계: 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Supabase 계정
- Naver Developers 계정 (맛집 검색 기능용)

## 2단계: Supabase 설정

1. https://supabase.com 접속 후 새 프로젝트 생성
2. SQL Editor에서 다음 파일 실행:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Settings > API에서 다음 정보 복사:
   - Project URL
   - anon public key

## 3단계: Naver API 설정

1. https://developers.naver.com/apps 접속
2. "애플리케이션 등록" 클릭
3. "검색" API 선택 후 등록
4. Client ID와 Client Secret 복사

## 4단계: 환경 변수 설정

`.env.local` 파일 생성:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Naver API
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret

# Google Analytics (선택)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 5단계: 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 6단계: 테스트

1. http://localhost:3000 접속
2. "개인 선택 시작" 클릭
3. 항목 3-5개 추가
4. 투표 시작!

## 문제 해결

### Supabase 연결 오류
- URL과 Key가 정확한지 확인
- Supabase 프로젝트가 active 상태인지 확인

### Naver API 오류
- Client ID/Secret 확인
- API 사용량 확인 (일일 25,000건 제한)

### 빌드 오류
```bash
# 캐시 삭제 후 재설치
rm -rf .next node_modules
npm install
npm run dev
```

## 다음 단계

- [ ] 카테고리 추가
- [ ] UI 커스터마이징
- [ ] 소셜 로그인 추가
- [ ] 프리미엄 기능 개발

## 도움이 필요하신가요?

- GitHub Issues: https://github.com/yourusername/pickme-app/issues
- Email: support@pickme.app
