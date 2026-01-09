# 흑백요리사 시즌2 예약 정보

캐치테이블에서 흑백요리사 시즌2 셰프들의 매장 예약 정보만 모아서 보여주는 웹사이트입니다.

사진 없이 예약 관련 정보만 깔끔하게 확인할 수 있습니다.

## 기능

- 셰프명, 매장명, 위치, 음식 종류
- 미쉐린 스타 / 빕구르망 표시
- 평점, 리뷰 수
- 가격대, 영업시간
- 예약 마감/오픈 정보
- 필터 (전체 / 예약 가능 / 미쉐린)
- 캐치테이블 예약 페이지 바로가기

## 실행 방법

### 1. 백엔드 서버

```bash
cd server
npm install
npm start
```

### 2. 프론트엔드

```bash
npm install
npm run dev
```

- 프론트엔드: http://localhost:5173/
- 백엔드: http://localhost:3001/

## 기술 스택

- Frontend: React, Vite
- Backend: Express, Puppeteer

## 참고

- Puppeteer로 캐치테이블을 스크래핑하므로 Chrome이 필요합니다
- 첫 로딩 시 1-2분 정도 소요됩니다
- 데이터는 5분간 캐시됩니다
