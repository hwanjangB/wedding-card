# Wedding Card

React + TypeScript + Vite 기반 모바일 청첩장 템플릿입니다.

## Features

- 메인 Hero (대표 사진 + D-day 카운트다운)
- 인사말 + 양가 부모님
- 캘린더 (Google / Apple 일정 추가)
- 갤러리 (Swiper 슬라이드 + 라이트박스)
- 오시는 길 (네이버 지도 + 카카오맵/네이버/티맵 길찾기)
- 연락처 바로걸기 (전화 + 문자)
- 축의금 계좌 (복사 기능)
- 참석 의사 RSVP (Firebase)
- 방명록 (Firebase 실시간)
- 카카오톡 공유 + 링크 복사
- 컨페티 축하 효과
- 테마 색상/폰트 커스터마이징 (data.json)

## Quick Start

```bash
# 1. 클론
git clone https://github.com/hwanjangB/wedding-card.git
cd wedding-card

# 2. 설정 파일 생성
cp data.template.json src/data.json
# src/data.json 에 개인 정보 입력

# 3. 환경변수 설정
cp .env.example .env
# .env 에 API 키 입력

# 4. 설치 및 실행
npm install
npm run dev
```

## Configuration

### data.json
모든 개인정보와 설정은 `src/data.json` 한 파일에서 관리합니다.
- 신랑/신부 정보, 양가 부모님, 계좌
- 결혼식 날짜, 장소, 교통 정보
- 갤러리 사진 목록
- 테마 색상, 폰트
- 카카오/네이버 Place ID

### .env
```
VITE_NAVER_MAP_CLIENT_ID=   # 네이버 클라우드 Maps Client ID
VITE_KAKAO_JS_KEY=          # 카카오 JavaScript 키
VITE_FIREBASE_API_KEY=      # Firebase 설정
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Scripts

```bash
npx tsx scripts/setup.ts          # data.json 기반 메타태그 자동 생성
npx tsx scripts/export-data.ts    # Firebase 방명록/RSVP 데이터 CSV 다운로드
```

## Deploy

GitHub Pages + GitHub Actions로 자동 배포됩니다.
`data.json`은 GitHub Secrets(`DATA_JSON`)에 저장되어 빌드 시 주입됩니다.

## Tech Stack

- React 19 + TypeScript
- Vite
- Firebase Firestore (방명록, RSVP)
- Swiper (갤러리)
- Naver Maps API
- Kakao SDK (공유)

## License

MIT
