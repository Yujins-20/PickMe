#!/bin/bash
# setup.sh - PickMe 프로젝트 완전 자동 설정

echo "🚀 PickMe 프로젝트 설정을 시작합니다..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Node.js 버전 확인
echo "📦 Node.js 버전 확인 중..."
NODE_VERSION=$(node -v 2>&1)

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Node.js가 설치되어 있지 않습니다.${NC}"
    echo "Homebrew로 Node.js를 설치하시겠습니까? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Node.js 설치 중..."
        brew install node
    else
        echo "수동으로 설치해주세요: brew install node"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Node.js 버전: $NODE_VERSION${NC}"
fi

# npm 버전 확인
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ npm 버전: $NPM_VERSION${NC}"

# 기존 파일 정리
echo "🧹 기존 파일 정리 중..."
rm -rf node_modules
rm -f package-lock.json
rm -rf .next

# npm 캐시 클리어
echo "🗑️  npm 캐시 클리어 중..."
npm cache clean --force

# 의존성 설치
echo "📥 의존성 설치 중..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install 실패${NC}"
    echo "다음 명령어를 시도해보세요:"
    echo "  1. npm install --legacy-peer-deps"
    echo "  2. npm install --force"
    exit 1
fi

echo -e "${GREEN}✅ 의존성 설치 완료!${NC}"

# .env.local 파일 확인
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local 파일이 없습니다.${NC}"
    echo "📝 .env.local 파일을 생성하는 중..."
    cp .env.example .env.local
    echo -e "${YELLOW}⚠️  .env.local 파일을 열어서 API 키를 입력해주세요!${NC}"
    echo ""
    echo "필요한 항목:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  - NAVER_CLIENT_ID"
    echo "  - NAVER_CLIENT_SECRET"
    echo ""
fi

# 개발 서버 실행 여부 확인
echo ""
echo -e "${GREEN}✅ 설정 완료!${NC}"
echo ""
echo "다음 명령어로 개발 서버를 실행하세요:"
echo -e "${YELLOW}  npm run dev${NC}"
echo ""
echo "또는:"
echo -e "${YELLOW}  npx next dev${NC}"
echo ""
echo "브라우저에서 http://localhost:3000 을 열어주세요!"
echo ""

# 실행 여부 묻기
echo "지금 개발 서버를 실행하시겠습니까? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🚀 개발 서버 시작..."
    npm run dev
fi
