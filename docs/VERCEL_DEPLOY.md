# Vercel 배포 가이드 (5분 완성)

## 🚀 1단계: GitHub에 코드 업로드

### 방법 A: GitHub Desktop 사용 (초보자 추천)
1. [GitHub Desktop](https://desktop.github.com/) 다운로드
2. GitHub 계정으로 로그인
3. File → Add Local Repository → pickme-app 폴더 선택
4. "Publish repository" 클릭
5. Repository name: `pickme-app`
6. ✅ Public 체크 해제 (Private로 유지)
7. Publish 클릭

### 방법 B: 터미널 사용
```bash
cd pickme-app

# Git 초기화
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: PickMe MVP"

# GitHub에 새 저장소 만들기 (웹에서 직접)
# 그 다음 아래 명령어 실행 (URL은 GitHub에서 복사)
git remote add origin https://github.com/yourusername/pickme-app.git
git branch -M main
git push -u origin main
```

---

## 🌐 2단계: Vercel 배포

### A. Vercel 계정 생성
1. [vercel.com](https://vercel.com) 접속
2. "Sign Up" → GitHub로 로그인
3. GitHub 연동 허용

### B. 프로젝트 Import
1. Dashboard → "Add New..." → "Project"
2. GitHub 저장소 목록에서 `pickme-app` 찾기
3. "Import" 클릭

### C. 설정
```
Framework Preset: Next.js (자동 감지됨)
Root Directory: ./ (기본값)
Build Command: npm run build (기본값)
Output Directory: .next (기본값)
Install Command: npm install (기본값)
```

**그대로 두고 아래로 스크롤!**

---

## 🔐 3단계: 환경 변수 설정

**중요!** 배포 전에 반드시 설정해야 합니다.

### A. Supabase 프로젝트 생성
1. [supabase.com](https://supabase.com) 접속
2. "Start your project" → GitHub로 로그인
3. "New project" 클릭
4. 설정:
   ```
   Name: pickme
   Database Password: (강력한 비밀번호 생성)
   Region: Northeast Asia (Seoul)
   ```
5. "Create new project" (2-3분 소요)

### B. Supabase 정보 복사
1. 프로젝트 생성 완료 후
2. Settings → API 클릭
3. 다음 정보 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...`

### C. 데이터베이스 스키마 생성
1. Supabase Dashboard → SQL Editor
2. "New query" 클릭
3. `/supabase/migrations/001_initial_schema.sql` 내용 복사
4. "Run" 클릭
5. ✅ Success 확인

### D. Naver API 키 발급
1. [developers.naver.com/apps](https://developers.naver.com/apps) 접속
2. "애플리케이션 등록" 클릭
3. 설정:
   ```
   애플리케이션 이름: PickMe
   사용 API: 검색
   환경 추가: WEB 설정
   서비스 URL: http://localhost:3000 (일단 임시)
   ```
4. 등록 완료 후:
   - **Client ID** 복사
   - **Client Secret** 복사

### E. Vercel에 환경 변수 입력
Vercel 배포 화면에서 아래로 스크롤:

**Environment Variables 섹션:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co
(Supabase Project URL)

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGci...
(Supabase anon key)

Name: NAVER_CLIENT_ID
Value: (Naver Client ID)

Name: NAVER_CLIENT_SECRET
Value: (Naver Client Secret)

Name: NEXT_PUBLIC_GA_ID (선택사항)
Value: G-XXXXXXXXXX
```

**모두 입력 후:**
- Environment: Production, Preview, Development 모두 체크
- "Deploy" 버튼 클릭!

---

## ⏰ 4단계: 배포 완료 (2-3분 소요)

배포 진행 상황을 실시간으로 볼 수 있습니다:
```
Building...  ████████████ 100%
Deploying... ████████████ 100%
✅ Success!
```

**배포 완료 후:**
1. "Visit" 버튼 클릭
2. 또는 자동 생성된 URL: `https://pickme-app-xxx.vercel.app`

---

## 🔧 5단계: Naver API 서비스 URL 업데이트

1. Naver Developers 다시 접속
2. 내 애플리케이션 → PickMe 선택
3. API 설정 → 서비스 환경 편집
4. 서비스 URL:
   ```
   https://pickme-app-xxx.vercel.app
   ```
   (실제 Vercel URL로 변경)
5. "수정" 클릭

---

## ✅ 테스트

1. Vercel URL 접속
2. "개인 선택 시작" 클릭
3. 항목 3개 추가
4. 투표 진행
5. 결과 확인

**모두 작동하면 성공! 🎉**

---

## 🌐 커스텀 도메인 (선택사항)

### A. 도메인 구매
- [가비아](https://www.gabia.com): ~₩15,000/년
- [Namecheap](https://www.namecheap.com): ~$10/년

### B. Vercel에 연결
1. Vercel Dashboard → 프로젝트 선택
2. Settings → Domains
3. 도메인 입력: `pickme.kr`
4. DNS 레코드 설정 (가비아 관리 페이지):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
5. 10분 후 `https://pickme.kr` 접속!

---

## 🐛 문제 해결

### 배포는 성공했는데 에러가 나요
1. Vercel Dashboard → 프로젝트 → Deployments
2. 최신 배포 클릭 → "Functions" 탭
3. 에러 로그 확인

**자주 발생하는 에러:**

#### 1. Supabase 연결 실패
```
Error: Invalid Supabase URL
```
**해결**: 환경 변수 다시 확인. URL 끝에 `/` 없어야 함.

#### 2. Naver API 에러
```
Error: 403 Forbidden
```
**해결**: Naver Developers에서 서비스 URL 업데이트 확인

#### 3. 빌드 실패
```
Error: Cannot find module 'xyz'
```
**해결**: 
```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 나면 해당 패키지 재설치
npm install xyz
```

---

## 🔄 업데이트 배포

코드 수정 후:

### GitHub Desktop
1. 변경사항 확인
2. Summary 입력: "기능 추가: XXX"
3. "Commit to main"
4. "Push origin"
5. → Vercel이 자동 배포!

### 터미널
```bash
git add .
git commit -m "기능 추가: XXX"
git push
```

**배포 시간**: 2-3분 소요

---

## 📊 모니터링

### Vercel Analytics (무료)
1. Vercel Dashboard → 프로젝트
2. "Analytics" 탭
3. 실시간 방문자, 페이지뷰 확인

### Google Analytics
1. [analytics.google.com](https://analytics.google.com) 접속
2. 속성 만들기
3. 추적 ID 복사: `G-XXXXXXXXXX`
4. Vercel 환경 변수에 추가:
   ```
   NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
   ```
5. 재배포 (git push)

---

## 🎉 완료!

이제 여러분의 PickMe가 전 세계에 공개되었습니다!

**다음 단계:**
1. [ ] URL 친구들에게 공유
2. [ ] 에브리타임/블라인드 홍보
3. [ ] 피드백 수집
4. [ ] 개선 및 재배포

**URL 공유 예시:**
```
🎯 AI 기반 선택 도우미 PickMe 런칭!

평점 말고, 내 취향으로!
CIKM 2025 논문 기반 알고리즘으로
3-4번 비교만으로 정확한 순위 도출

🔗 https://pickme-app-xxx.vercel.app

#선택장애 #맛집추천 #그룹투표
```

화이팅! 🚀
