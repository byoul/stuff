// 흑백요리사 출연 셰프들의 음식점 데이터
export const restaurants = [
  // ============ 시즌 1 (2024) ============

  // 안성재 - 흑수저 (우승)
  {
    id: 1,
    season: 1,
    chef: "안성재",
    team: "black",
    rank: "우승",
    restaurant: "모수 (Mosu)",
    category: "한식 파인다이닝",
    address: "서울 강남구 도산대로45길 6",
    lat: 37.5235,
    lng: 127.0380,
    phone: "02-793-5995",
    priceRange: "점심 15만원~ / 디너 25만원~",
    description: "미쉐린 2스타. 한국의 제철 식재료를 현대적으로 재해석한 파인다이닝. 안성재 셰프만의 섬세한 플레이팅과 깊은 맛의 조화.",
    signature: ["제철 코스", "한우 요리", "발효 요리"],
    openingHours: "화-토 12:00-15:00, 18:00-22:00 / 일,월 휴무",
    reservation: {
      type: "캐치테이블",
      url: "https://app.catchtable.co.kr/ct/shop/mosu",
      note: "예약 필수. 한 달 전 오픈, 빠르게 마감됨"
    },
    instagram: "@mosu_seoul"
  },
  {
    id: 2,
    season: 1,
    chef: "안성재",
    team: "black",
    rank: "우승",
    restaurant: "모수 한남",
    category: "캐주얼 다이닝",
    address: "서울 용산구 이태원로54길 5",
    lat: 37.5340,
    lng: 126.9970,
    phone: "02-793-5996",
    priceRange: "6만원~10만원",
    description: "모수의 캐주얼 버전. 부담없이 안성재 셰프의 요리를 경험할 수 있는 공간.",
    signature: ["런치 코스", "파스타", "스테이크"],
    openingHours: "화-일 11:30-22:00 / 월 휴무",
    reservation: {
      type: "캐치테이블",
      url: "https://app.catchtable.co.kr/ct/shop/mosuhannam",
      note: "워크인 가능하나 예약 권장"
    },
    instagram: "@mosu_seoul"
  },

  // 나폴리 맛피아 (권성준) - 백수저 (준우승)
  {
    id: 3,
    season: 1,
    chef: "나폴리 맛피아 (권성준)",
    team: "white",
    rank: "준우승",
    restaurant: "라탄티나",
    category: "이탈리안",
    address: "서울 용산구 신흥로 89",
    lat: 37.5440,
    lng: 126.9855,
    phone: "02-790-5474",
    priceRange: "3만원~6만원",
    description: "나폴리 현지 스타일 정통 이탈리안. 직접 만든 생면 파스타와 나폴리 피자가 시그니처.",
    signature: ["까르보나라", "나폴리 피자", "티라미수"],
    openingHours: "매일 11:30-22:00 / 브레이크타임 15:00-17:00",
    reservation: {
      type: "캐치테이블",
      url: "https://app.catchtable.co.kr/ct/shop/latartina",
      note: "주말 예약 필수"
    },
    instagram: "@latartina_official"
  },
  {
    id: 4,
    season: 1,
    chef: "나폴리 맛피아 (권성준)",
    team: "white",
    rank: "준우승",
    restaurant: "팔레르모",
    category: "이탈리안",
    address: "서울 강남구 압구정로10길 35",
    lat: 37.5265,
    lng: 127.0285,
    phone: "02-514-5474",
    priceRange: "4만원~8만원",
    description: "시칠리아 요리 전문. 해산물 파스타와 시칠리아 전통 요리를 선보이는 곳.",
    signature: ["해산물 파스타", "시칠리아 전채", "카놀리"],
    openingHours: "매일 12:00-22:00 / 월 휴무",
    reservation: {
      type: "캐치테이블",
      url: "https://app.catchtable.co.kr/ct/shop/palermo",
      note: "예약 권장"
    },
    instagram: "@palermo_seoul"
  },

  // 최현석 - 흑수저
  {
    id: 5,
    season: 1,
    chef: "최현석",
    team: "black",
    rank: "TOP 10",
    restaurant: "쵸이닷",
    category: "이탈리안",
    address: "서울 강남구 압구정로46길 50",
    lat: 37.5268,
    lng: 127.0345,
    phone: "02-541-5005",
    priceRange: "런치 5만원~ / 디너 15만원~",
    description: "셀럽 셰프 최현석의 시그니처 레스토랑. 이탈리안 베이스에 창의적인 요리를 선보임.",
    signature: ["트러플 파스타", "한우 타르타르", "시그니처 코스"],
    openingHours: "매일 12:00-22:00 / 브레이크타임 15:00-18:00",
    reservation: {
      type: "캐치테이블",
      url: "https://app.catchtable.co.kr/ct/shop/choidot",
      note: "주말 및 디너 예약 필수"
    },
    instagram: "@choi.dot"
  },
  {
    id: 6,
    season: 1,
    chef: "최현석",
    team: "black",
    rank: "TOP 10",
    restaurant: "앳홈키친 by 최현석",
    category: "캐주얼 다이닝",
    address: "서울 강남구 도산대로49길 22",
    lat: 37.5245,
    lng: 127.0365,
    phone: "02-545-5585",
    priceRange: "2만원~4만원",
    description: "최현석 셰프의 캐주얼 다이닝. 가성비 좋은 양식 메뉴를 즐길 수 있는 곳.",
    signature: ["함박스테이크", "파스타", "리조또"],
    openingHours: "매일 11:00-21:30",
    reservation: {
      type: "전화예약",
      url: null,
      note: "워크인 가능, 피크타임 대기 있음"
    },
    instagram: "@athomekitchen_official"
  },

  // 여경래 - 흑수저
  {
    id: 7,
    season: 1,
    chef: "여경래",
    team: "black",
    rank: "TOP 10",
    restaurant: "여경래",
    category: "중식",
    address: "서울 중구 소공로 106 웨스틴조선서울",
    lat: 37.5650,
    lng: 126.9780,
    phone: "02-317-0371",
    priceRange: "런치 8만원~ / 디너 15만원~",
    description: "웨스틴조선 호텔 내 중식당. 40년 경력의 중식 명장 여경래 셰프의 정통 광동요리.",
    signature: ["딤섬", "북경오리", "XO소스 볶음밥"],
    openingHours: "매일 12:00-22:00 / 브레이크타임 15:00-18:00",
    reservation: {
      type: "캐치테이블",
      url: "https://app.catchtable.co.kr/ct/shop/yeochineserestaurant",
      note: "호텔 레스토랑, 예약 필수"
    },
    instagram: "@yeochineserestaurant"
  },

  // 오세득 - 흑수저
  {
    id: 8,
    season: 1,
    chef: "오세득",
    team: "black",
    rank: "TOP 10",
    restaurant: "오세득의 한 잔",
    category: "프렌치 비스트로",
    address: "서울 용산구 이태원로54길 25",
    lat: 37.5345,
    lng: 126.9940,
    phone: "02-797-8226",
    priceRange: "4만원~8만원",
    description: "오세득 셰프의 프렌치 비스트로. 와인과 함께 즐기는 프랑스 가정식.",
    signature: ["스테이크", "부야베스", "크렘브륄레"],
    openingHours: "화-일 17:00-24:00 / 월 휴무",
    reservation: {
      type: "네이버예약",
      url: "https://booking.naver.com/booking/3/bizes/808234",
      note: "저녁 영업만, 예약 권장"
    },
    instagram: "@oseduk_official"
  },

  // 정지선 - 흑수저
  {
    id: 9,
    season: 1,
    chef: "정지선",
    team: "black",
    rank: "TOP 10",
    restaurant: "진진",
    category: "중식",
    address: "서울 강남구 선릉로158길 16",
    lat: 37.5245,
    lng: 127.0475,
    phone: "02-555-5155",
    priceRange: "5만원~10만원",
    description: "정통 사천요리 전문. 마라와 향신료를 활용한 정통 사천의 매운맛.",
    signature: ["마파두부", "꿔바로우", "사천식 우육면"],
    openingHours: "매일 11:30-22:00 / 브레이크타임 15:00-17:30",
    reservation: {
      type: "캐치테이블",
      url: "https://app.catchtable.co.kr/ct/shop/jinjin",
      note: "점심 런치 인기, 예약 권장"
    },
    instagram: "@jinjin_chinese"
  },

  // 박준우 - 흑수저
  {
    id: 10,
    season: 1,
    chef: "박준우",
    team: "black",
    rank: "TOP 20",
    restaurant: "라미띠에",
    category: "프렌치 비스트로",
    address: "서울 성동구 서울숲4길 18-8",
    lat: 37.5465,
    lng: 127.0435,
    phone: "02-465-8288",
    priceRange: "런치 3만원~ / 디너 6만원~",
    description: "서울숲 인근 프렌치 비스트로. 부담없는 가격에 정통 프랑스 요리를 경험.",
    signature: ["오리 콩피", "부르기뇽", "크로크무슈"],
    openingHours: "화-일 11:30-21:30 / 월 휴무",
    reservation: {
      type: "캐치테이블",
      url: "https://app.catchtable.co.kr/ct/shop/lamitie",
      note: "주말 브런치 인기"
    },
    instagram: "@lamitie_seoul"
  },

  // 이영숙 - 백수저
  {
    id: 11,
    season: 1,
    chef: "이영숙",
    team: "white",
    rank: "TOP 20",
    restaurant: "진미식당",
    category: "한식",
    address: "서울 종로구 돈화문로 62",
    lat: 37.5740,
    lng: 126.9905,
    phone: "02-2279-3939",
    priceRange: "1만원~2만원",
    description: "50년 전통 한식당. 정갈한 밑반찬과 따뜻한 국물 요리가 일품.",
    signature: ["된장찌개", "제육볶음", "김치찌개"],
    openingHours: "월-토 11:00-21:00 / 일 휴무",
    reservation: {
      type: "전화예약",
      url: null,
      note: "워크인 위주, 점심시간 대기 있음"
    },
    instagram: null
  },

  // 조희숙 - 백수저
  {
    id: 12,
    season: 1,
    chef: "조희숙",
    team: "white",
    rank: "TOP 20",
    restaurant: "밥상머리",
    category: "한식",
    address: "서울 마포구 월드컵북로4길 77",
    lat: 37.5535,
    lng: 126.9235,
    phone: "02-338-7788",
    priceRange: "1.5만원~2.5만원",
    description: "정성 가득한 가정식 백반. 엄마 손맛 그대로의 따뜻한 한 끼.",
    signature: ["백반정식", "생선구이", "불고기"],
    openingHours: "월-금 11:30-20:30 / 토,일 휴무",
    reservation: {
      type: "전화예약",
      url: null,
      note: "점심 영업 위주, 저녁 예약 필요"
    },
    instagram: "@bapsangmeori"
  },

  // 트리플스타 (황진선) - 백수저
  {
    id: 13,
    season: 1,
    chef: "트리플스타 (황진선)",
    team: "white",
    rank: "TOP 20",
    restaurant: "트리플스타 키친",
    category: "양식",
    address: "서울 강남구 역삼동 823-32",
    lat: 37.4995,
    lng: 127.0365,
    phone: null,
    priceRange: "2만원~4만원",
    description: "유튜브 인기 셰프의 캐주얼 다이닝. 유튜브에서 선보인 메뉴들을 직접 맛볼 수 있는 곳.",
    signature: ["크림파스타", "스테이크", "리조또"],
    openingHours: "화-일 11:30-21:00 / 월 휴무",
    reservation: {
      type: "네이버예약",
      url: "https://booking.naver.com/booking/3/bizes/triplestar",
      note: "팝업/이벤트성 운영, SNS 확인 필요"
    },
    instagram: "@triplestar_chef"
  },

  // 에드워드 리 - 흑수저
  {
    id: 14,
    season: 1,
    chef: "에드워드 리",
    team: "black",
    rank: "TOP 10",
    restaurant: "610 Magnolia",
    category: "아메리칸 파인다이닝",
    address: "610 W Magnolia Ave, Louisville, KY, USA",
    lat: 38.2315,
    lng: -85.7275,
    phone: "+1-502-636-0783",
    priceRange: "$150~200",
    description: "에드워드 리 셰프의 시그니처 레스토랑. 남부 요리와 아시아 퓨전의 만남. 미국 소재.",
    signature: ["테이스팅 코스", "남부식 요리", "아시아 퓨전"],
    openingHours: "수-토 18:00-22:00 / 일-화 휴무",
    reservation: {
      type: "온라인예약",
      url: "https://www.610magnolia.com/reservations",
      note: "미국 켄터키주 소재, 온라인 예약"
    },
    instagram: "@610magnolia",
    note: "미국 소재 레스토랑"
  },

  // 흑백요리사 시즌 2 (2025) - 예상/확정 셰프들
  // ============ 시즌 2 (2025) ============

  // 임기학 - 흑수저
  {
    id: 15,
    season: 2,
    chef: "임기학",
    team: "black",
    rank: "참가",
    restaurant: "밍글스",
    category: "한식 파인다이닝",
    address: "서울 강남구 도산대로67길 19",
    lat: 37.5248,
    lng: 127.0405,
    phone: "02-515-7306",
    priceRange: "런치 12만원~ / 디너 22만원~",
    description: "미쉐린 2스타. 한식의 현대화를 이끄는 임기학 셰프의 파인다이닝.",
    signature: ["한식 코스", "제철 식재료 요리", "발효 요리"],
    openingHours: "화-토 12:00-15:00, 18:00-22:00 / 일,월 휴무",
    reservation: {
      type: "캐치테이블",
      url: "https://app.catchtable.co.kr/ct/shop/mingles",
      note: "예약 필수, 한 달 전 오픈"
    },
    instagram: "@mingles_seoul"
  },
  {
    id: 16,
    season: 2,
    chef: "임기학",
    team: "black",
    rank: "참가",
    restaurant: "막시무스",
    category: "한식 스테이크",
    address: "서울 강남구 압구정로46길 71",
    lat: 37.5275,
    lng: 127.0355,
    phone: "02-518-8008",
    priceRange: "10만원~20만원",
    description: "한우 오마카세. 임기학 셰프의 한우 전문 레스토랑.",
    signature: ["한우 코스", "숙성 한우", "한우 스테이크"],
    openingHours: "화-일 17:00-22:00 / 월 휴무",
    reservation: {
      type: "캐치테이블",
      url: "https://app.catchtable.co.kr/ct/shop/maximus",
      note: "디너 예약 필수"
    },
    instagram: "@maximus_seoul"
  },

  // 선경 (조선경) - 흑수저
  {
    id: 17,
    season: 2,
    chef: "선경",
    team: "black",
    rank: "참가",
    restaurant: "순",
    category: "한식 파인다이닝",
    address: "서울 강남구 도산대로45길 10-6",
    lat: 37.5228,
    lng: 127.0392,
    phone: "02-517-5575",
    priceRange: "런치 8만원~ / 디너 15만원~",
    description: "미쉐린 1스타. 절제된 한식의 미학을 보여주는 파인다이닝.",
    signature: ["한식 코스", "채소 요리", "발효 요리"],
    openingHours: "화-토 12:00-15:00, 18:00-22:00 / 일,월 휴무",
    reservation: {
      type: "캐치테이블",
      url: "https://app.catchtable.co.kr/ct/shop/soon",
      note: "예약 필수"
    },
    instagram: "@soon_seoul"
  },

  // 김도윤 - 흑수저
  {
    id: 18,
    season: 2,
    chef: "김도윤",
    team: "black",
    rank: "참가",
    restaurant: "에빗",
    category: "프렌치",
    address: "서울 강남구 선릉로162길 17",
    lat: 37.5255,
    lng: 127.0458,
    phone: "02-501-4433",
    priceRange: "런치 7만원~ / 디너 15만원~",
    description: "미쉐린 1스타 프렌치. 김도윤 셰프의 정교한 프랑스 요리.",
    signature: ["프렌치 코스", "해산물 요리", "디저트"],
    openingHours: "화-토 12:00-15:00, 18:00-22:00 / 일,월 휴무",
    reservation: {
      type: "캐치테이블",
      url: "https://app.catchtable.co.kr/ct/shop/evett",
      note: "예약 필수"
    },
    instagram: "@evett_seoul"
  },

  // 장호준 - 백수저
  {
    id: 19,
    season: 2,
    chef: "장호준",
    team: "white",
    rank: "참가",
    restaurant: "호야",
    category: "한식",
    address: "서울 용산구 한남대로20길 24",
    lat: 37.5355,
    lng: 126.9985,
    phone: "02-793-5050",
    priceRange: "3만원~6만원",
    description: "한남동 한식 맛집. 정갈하고 깔끔한 한식을 선보이는 곳.",
    signature: ["한정식", "불고기", "비빔밥"],
    openingHours: "매일 11:30-21:30 / 브레이크타임 15:00-17:00",
    reservation: {
      type: "캐치테이블",
      url: "https://app.catchtable.co.kr/ct/shop/hoya",
      note: "예약 권장"
    },
    instagram: "@hoya_hannam"
  },

  // 문기훈 - 백수저
  {
    id: 20,
    season: 2,
    chef: "문기훈",
    team: "white",
    rank: "참가",
    restaurant: "몽탄",
    category: "한식/바베큐",
    address: "서울 마포구 월드컵북로6길 61",
    lat: 37.5565,
    lng: 126.9095,
    phone: "02-3144-6688",
    priceRange: "5만원~10만원",
    description: "뚝섬 고깃집 신화의 시작. 연기 가득한 숯불 바베큐 맛집.",
    signature: ["돼지갈비", "항정살", "생갈비"],
    openingHours: "매일 17:00-23:00",
    reservation: {
      type: "캐치테이블",
      url: "https://app.catchtable.co.kr/ct/shop/mongtan",
      note: "웨이팅 많음, 예약 필수"
    },
    instagram: "@mongtan_official"
  },
  {
    id: 21,
    season: 2,
    chef: "문기훈",
    team: "white",
    rank: "참가",
    restaurant: "육회본가",
    category: "한식/육회",
    address: "서울 성동구 왕십리로 410",
    lat: 37.5615,
    lng: 127.0395,
    phone: "02-2299-8892",
    priceRange: "3만원~5만원",
    description: "육회 전문점. 신선한 육회와 다양한 육회 요리를 맛볼 수 있는 곳.",
    signature: ["육회", "육회비빔밥", "육사시미"],
    openingHours: "매일 16:00-24:00",
    reservation: {
      type: "네이버예약",
      url: "https://booking.naver.com/booking/3/bizes/yukhoe",
      note: "저녁 예약 권장"
    },
    instagram: "@yukhoe_official"
  }
];

// 팀별 색상
export const teamColors = {
  black: "#1a1a1a",
  white: "#888888"
};

// 시즌별 필터
export const seasons = [
  { id: 'all', label: '전체' },
  { id: 1, label: '시즌 1' },
  { id: 2, label: '시즌 2' }
];
