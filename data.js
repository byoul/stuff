// 흑백요리사 셰프 및 레스토랑 데이터
const chefData = {
    season1: {
        white: [
            {
                id: "s1w1",
                name: "권성준",
                nickname: "나폴리 맛피아 (최종 우승)",
                spoon: "black",
                restaurants: [
                    {
                        name: "비아 톨레도 파스타바",
                        address: "서울 용산구 원효로83길 7-2",
                        lat: 37.5367,
                        lng: 126.9647,
                        cuisine: "이탈리안 파스타",
                        phone: "02-715-2222",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/viaToledopastabar",
                        naver: "https://naver.me/xpz5J1vZ"
                    },
                    {
                        name: "비아 톨레도 용리단길",
                        address: "서울 용산구 신흥로 89",
                        lat: 37.5294,
                        lng: 126.9715,
                        cuisine: "이탈리안",
                        phone: "02-798-2222",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/GzQxEZ8H"
                    }
                ]
            },
            {
                id: "s1w2",
                name: "에드워드 리",
                nickname: "2010 아이언 셰프 우승자",
                spoon: "white",
                restaurants: [
                    {
                        name: "610 Magnolia",
                        address: "Louisville, Kentucky, USA",
                        lat: 38.2387,
                        lng: -85.7401,
                        cuisine: "서던 아메리칸",
                        phone: null,
                        michelin: null,
                        catchTable: null,
                        naver: null,
                        website: "https://610magnolia.com"
                    }
                ]
            },
            {
                id: "s1w3",
                name: "장호준",
                nickname: "일식 끝판왕",
                spoon: "white",
                restaurants: [
                    {
                        name: "네기 스키야키",
                        address: "서울 성동구 서울숲2길 32-14 지층 101호",
                        lat: 37.5446,
                        lng: 127.0432,
                        cuisine: "일식 스키야키",
                        phone: "02-462-0401",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/negisukiyaki",
                        naver: "https://naver.me/xpn5vqzy"
                    },
                    {
                        name: "네기 다이닝 라운지",
                        address: "서울 강남구 압구정로60길 26 3층",
                        lat: 37.5262,
                        lng: 127.0365,
                        cuisine: "일식 오마카세",
                        phone: "02-543-0401",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/negidining",
                        naver: null
                    }
                ]
            },
            {
                id: "s1w4",
                name: "김도윤",
                nickname: "미슐랭 1스타 오너 셰프",
                spoon: "white",
                restaurants: [
                    {
                        name: "윤서울",
                        address: "서울 강남구 선릉로 805",
                        lat: 37.5230,
                        lng: 127.0465,
                        cuisine: "모던 한식",
                        phone: "02-511-0414",
                        michelin: "1 Star",
                        catchTable: "https://app.catchtable.co.kr/ct/shop/yoonseoul",
                        naver: null
                    }
                ]
            },
            {
                id: "s1w5",
                name: "최현석",
                nickname: "대한민국 대표 스타 셰프",
                spoon: "white",
                restaurants: [
                    {
                        name: "달리아 다이닝",
                        address: "서울 강남구 압구정로 161",
                        lat: 37.5241,
                        lng: 127.0325,
                        cuisine: "유러피안",
                        phone: "02-544-4450",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/dahliadining",
                        naver: "https://naver.me/xpn5nDAH"
                    },
                    {
                        name: "쵸이닷",
                        address: "서울 강남구 압구정로46길 50",
                        lat: 37.5267,
                        lng: 127.0286,
                        cuisine: "캐주얼 다이닝",
                        phone: "02-549-0071",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/xMGj4Lxz"
                    }
                ]
            },
            {
                id: "s1w6",
                name: "여경래",
                nickname: "중식 그랜드 마스터",
                spoon: "white",
                restaurants: [
                    {
                        name: "홍보각",
                        address: "서울 강남구 봉은사로 130",
                        lat: 37.5118,
                        lng: 127.0211,
                        cuisine: "정통 광동식 중식",
                        phone: "02-568-3388",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/hongbogak",
                        naver: "https://naver.me/5eqzJqGz"
                    }
                ]
            },
            {
                id: "s1w7",
                name: "조셉 리저우드",
                nickname: "미슐랭 2스타 오너 셰프",
                spoon: "white",
                restaurants: [
                    {
                        name: "EVETT",
                        address: "서울 강남구 도산대로45길 10-5",
                        lat: 37.5233,
                        lng: 127.0372,
                        cuisine: "모던 한식",
                        phone: "02-544-4466",
                        michelin: "2 Star",
                        catchTable: "https://app.catchtable.co.kr/ct/shop/evett",
                        naver: null
                    }
                ]
            },
            {
                id: "s1w8",
                name: "남정석",
                nickname: "국내 채소요리 1인자",
                spoon: "white",
                restaurants: [
                    {
                        name: "로컬릿",
                        address: "서울 성동구 옥수동 228-16",
                        lat: 37.5436,
                        lng: 127.0156,
                        cuisine: "채소 다이닝",
                        phone: "02-6952-9008",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/localeat",
                        naver: null
                    },
                    {
                        name: "그린볼",
                        address: "강원 강릉시 난설헌로 132",
                        lat: 37.7847,
                        lng: 128.8821,
                        cuisine: "비건 다이닝",
                        phone: "033-642-9008",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/5VnmYxzz"
                    }
                ]
            },
            {
                id: "s1w9",
                name: "파브리치오 페라리",
                nickname: "15년 연속 이탈리아 미슐랭 1스타",
                spoon: "white",
                restaurants: [
                    {
                        name: "파브리키친",
                        address: "서울 용산구 한강대로15길 23-6",
                        lat: 37.5324,
                        lng: 126.9701,
                        cuisine: "이탈리안",
                        phone: "02-790-8903",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/fabrykitchen",
                        naver: "https://naver.me/xpz5NqYA"
                    }
                ]
            },
            {
                id: "s1w10",
                name: "정지선",
                nickname: "한국 최초 여성 중식 스타 셰프",
                spoon: "white",
                restaurants: [
                    {
                        name: "티엔미미 강남점",
                        address: "서울 서초구 강남대로 359",
                        lat: 37.4969,
                        lng: 127.0287,
                        cuisine: "중식",
                        phone: "02-538-5292",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/xVZyzqwz"
                    },
                    {
                        name: "티엔미미 홍대점",
                        address: "서울 마포구 양화로 162",
                        lat: 37.5564,
                        lng: 126.9229,
                        cuisine: "중식",
                        phone: "02-338-5292",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/FzzQzXzz"
                    }
                ]
            },
            {
                id: "s1w11",
                name: "조은주",
                nickname: "세계 3대 요리 대회 2관왕",
                spoon: "white",
                restaurants: [
                    {
                        name: "터치더스카이",
                        address: "서울 영등포구 63로 50 63빌딩 58층",
                        lat: 37.5199,
                        lng: 126.9401,
                        cuisine: "프렌치",
                        phone: "02-789-5858",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/touchthesky",
                        naver: null
                    }
                ]
            },
            {
                id: "s1w12",
                name: "오세득",
                nickname: "하이브리드 스타 셰프",
                spoon: "white",
                restaurants: [
                    {
                        name: "친밀 제주",
                        address: "제주 제주시 조천읍 남조로 1781",
                        lat: 33.4536,
                        lng: 126.6425,
                        cuisine: "한식",
                        phone: "064-784-0111",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/xpgE7qzz"
                    }
                ]
            },
            {
                id: "s1w13",
                name: "황진선",
                nickname: "미슐랭 1스타 오너셰프",
                spoon: "white",
                restaurants: [
                    {
                        name: "진진",
                        address: "서울 마포구 월드컵북로1길 60",
                        lat: 37.5567,
                        lng: 126.9089,
                        cuisine: "일식",
                        phone: "02-322-9922",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/jinjin",
                        naver: null
                    }
                ]
            },
            {
                id: "s1w14",
                name: "최지형",
                nickname: "세계가 인정한 이북 요리 전문가",
                spoon: "white",
                restaurants: [
                    {
                        name: "리북방",
                        address: "서울 마포구 마포대로1길 16",
                        lat: 37.5524,
                        lng: 126.9521,
                        cuisine: "이북식 한식",
                        phone: "02-719-0203",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/5eqZJqzz"
                    }
                ]
            },
            {
                id: "s1w15",
                name: "박준우",
                nickname: "마스터셰프 코리아 1 준우승",
                spoon: "white",
                restaurants: [
                    {
                        name: "오쁘띠베르",
                        address: "서울 종로구 자하문로 47-1",
                        lat: 37.5807,
                        lng: 126.9701,
                        cuisine: "프렌치 디저트",
                        phone: "02-733-8282",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/xpn5Nqzz"
                    }
                ]
            }
        ],
        black: [
            {
                id: "s1b1",
                name: "현상욱",
                nickname: "간귀",
                spoon: "black",
                restaurants: [
                    {
                        name: "에다마메 남영",
                        address: "서울 용산구 한강대로76길 11-40",
                        lat: 37.5416,
                        lng: 126.9720,
                        cuisine: "일식",
                        phone: "02-701-4800",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/edamame",
                        naver: "https://naver.me/xpn5qDAH"
                    }
                ]
            },
            {
                id: "s1b2",
                name: "데이비드 리",
                nickname: "고기 깡패",
                spoon: "black",
                restaurants: [
                    {
                        name: "군몽",
                        address: "서울 용산구 한강대로27가길 15",
                        lat: 37.5302,
                        lng: 126.9648,
                        cuisine: "고기 요리",
                        phone: "02-792-8881",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/xpz5qDAz"
                    }
                ]
            },
            {
                id: "s1b3",
                name: "조광효",
                nickname: "만찢남",
                spoon: "black",
                restaurants: [
                    {
                        name: "조광 101",
                        address: "서울 송파구 새말로10길 8",
                        lat: 37.5054,
                        lng: 127.0895,
                        cuisine: "이탈리안",
                        phone: "02-416-0101",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/jogwang101",
                        naver: null
                    },
                    {
                        name: "조광 201",
                        address: "서울 송파구 새말로10길 8 2층",
                        lat: 37.5055,
                        lng: 127.0896,
                        cuisine: "이탈리안 파인다이닝",
                        phone: "02-416-0201",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/jogwang201",
                        naver: null
                    }
                ]
            },
            {
                id: "s1b4",
                name: "윤남노",
                nickname: "요리하는 돌아이",
                spoon: "black",
                restaurants: [
                    {
                        name: "디핀 옥수",
                        address: "서울 성동구 독서당로 267",
                        lat: 37.5426,
                        lng: 127.0165,
                        cuisine: "모던 한식",
                        phone: "02-2296-0309",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/dipinoksu",
                        naver: null
                    },
                    {
                        name: "디핀 신당",
                        address: "서울 중구 다산로38길 51",
                        lat: 37.5572,
                        lng: 127.0124,
                        cuisine: "한식",
                        phone: "02-2232-0309",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/GzQxEqzz"
                    }
                ]
            },
            {
                id: "s1b5",
                name: "김미령",
                nickname: "이모카세 1호",
                spoon: "black",
                restaurants: [
                    {
                        name: "즐거운술상",
                        address: "서울 도봉구 노해로 341",
                        lat: 37.6523,
                        lng: 127.0559,
                        cuisine: "한식 술집",
                        phone: "02-995-5995",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/xMGj4qzz"
                    }
                ]
            },
            {
                id: "s1b6",
                name: "조진명",
                nickname: "장사천재 조사장",
                spoon: "black",
                restaurants: [
                    {
                        name: "을지로보석",
                        address: "서울 중구 을지로13길 20",
                        lat: 37.5662,
                        lng: 126.9914,
                        cuisine: "한식 술집",
                        phone: "02-2275-5353",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/5VnmYqzz"
                    }
                ]
            },
            {
                id: "s1b7",
                name: "박영",
                nickname: "키친갱스터",
                spoon: "black",
                restaurants: [
                    {
                        name: "나우 남영",
                        address: "서울 용산구 한강대로76길 16",
                        lat: 37.5418,
                        lng: 126.9724,
                        cuisine: "모던 아시안",
                        phone: "02-701-3365",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/nau",
                        naver: null
                    }
                ]
            },
            {
                id: "s1b8",
                name: "송영복",
                nickname: "야키토리왕",
                spoon: "black",
                restaurants: [
                    {
                        name: "야키토리 묵",
                        address: "서울 마포구 성미산로27길 12",
                        lat: 37.5612,
                        lng: 126.9146,
                        cuisine: "야키토리",
                        phone: "02-322-0501",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/yakitorimook",
                        naver: null
                    }
                ]
            },
            {
                id: "s1b9",
                name: "이상민",
                nickname: "영탉",
                spoon: "black",
                restaurants: [
                    {
                        name: "남영탉",
                        address: "서울 용산구 한강대로76길 19-1",
                        lat: 37.5420,
                        lng: 126.9718,
                        cuisine: "치킨",
                        phone: "02-714-9282",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/xpn5NDAH"
                    }
                ]
            },
            {
                id: "s1b10",
                name: "임태훈",
                nickname: "트리플스타",
                spoon: "black",
                restaurants: [
                    {
                        name: "트리드",
                        address: "서울 강남구 선릉로153길 6",
                        lat: 37.5247,
                        lng: 127.0414,
                        cuisine: "프렌치",
                        phone: "02-512-0707",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/treed",
                        naver: null
                    }
                ]
            },
            {
                id: "s1b11",
                name: "김정주",
                nickname: "히든천재",
                spoon: "black",
                restaurants: [
                    {
                        name: "포노 부오노",
                        address: "서울 강남구 논현로153길 63",
                        lat: 37.5176,
                        lng: 127.0315,
                        cuisine: "이탈리안",
                        phone: "02-543-1207",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/GzQxEZzz"
                    }
                ]
            },
            {
                id: "s1b12",
                name: "한민구",
                nickname: "철가방 요리사",
                spoon: "black",
                restaurants: [
                    {
                        name: "도량",
                        address: "서울 종로구 필운대로 16",
                        lat: 37.5755,
                        lng: 126.9705,
                        cuisine: "한정식",
                        phone: "02-738-0201",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/doryang",
                        naver: null
                    }
                ]
            },
            {
                id: "s1b13",
                name: "임세호",
                nickname: "반찬 셰프",
                spoon: "black",
                restaurants: [
                    {
                        name: "마마리마켓",
                        address: "서울 성동구 성수일로12길 33",
                        lat: 37.5448,
                        lng: 127.0567,
                        cuisine: "반찬 및 식품",
                        phone: "02-469-9979",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/xpn5NDAz"
                    },
                    {
                        name: "마마리다이닝 IFC몰점",
                        address: "서울 영등포구 국제금융로 10 IFC몰 L3",
                        lat: 37.5253,
                        lng: 126.9256,
                        cuisine: "한식 다이닝",
                        phone: "02-6137-5050",
                        michelin: null,
                        catchTable: null,
                        naver: null
                    }
                ]
            },
            {
                id: "s1b14",
                name: "조지연",
                nickname: "셀럽의 셰프",
                spoon: "black",
                restaurants: [
                    {
                        name: "Buto 한남",
                        address: "서울 용산구 대사관로 35",
                        lat: 37.5342,
                        lng: 127.0012,
                        cuisine: "아시안 퓨전",
                        phone: "02-749-9995",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/buto",
                        naver: null
                    }
                ]
            },
            {
                id: "s1b15",
                name: "원태희",
                nickname: "원투쓰리",
                spoon: "black",
                restaurants: [
                    {
                        name: "본연",
                        address: "서울 강남구 논현로153길 16",
                        lat: 37.5181,
                        lng: 127.0289,
                        cuisine: "한정식",
                        phone: "02-517-0601",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/bonyeon",
                        naver: null
                    }
                ]
            }
        ]
    },
    season2: {
        white: [
            {
                id: "s2w1",
                name: "이준",
                nickname: "미슐랭 2스타 오너 셰프",
                spoon: "white",
                restaurants: [
                    {
                        name: "스와니예 SOIGNE",
                        address: "서울 강남구 선릉로158길 11",
                        lat: 37.5277,
                        lng: 127.0463,
                        cuisine: "모던 프렌치",
                        phone: "02-3446-3466",
                        michelin: "2 Star",
                        catchTable: "https://app.catchtable.co.kr/ct/shop/soigne",
                        naver: null
                    }
                ]
            },
            {
                id: "s2w2",
                name: "손종원",
                nickname: "더블 미슐랭 스타 셰프",
                spoon: "white",
                restaurants: [
                    {
                        name: "이타닉 가든",
                        address: "서울 강남구 테헤란로 231 조선팰리스 36층",
                        lat: 37.5028,
                        lng: 127.0394,
                        cuisine: "모던 프렌치",
                        phone: "02-3430-8836",
                        michelin: "1 Star",
                        catchTable: "https://app.catchtable.co.kr/ct/shop/etanicgarden",
                        naver: null
                    },
                    {
                        name: "라망 시크레",
                        address: "서울 강남구 도산대로45길 6",
                        lat: 37.5235,
                        lng: 127.0369,
                        cuisine: "프렌치",
                        phone: "02-518-0313",
                        michelin: "1 Star",
                        catchTable: "https://app.catchtable.co.kr/ct/shop/lamangsecret",
                        naver: null
                    }
                ]
            },
            {
                id: "s2w3",
                name: "선재 스님",
                nickname: "사찰음식 명장 1호",
                spoon: "white",
                restaurants: [
                    {
                        name: "선재사찰음식문화연구원",
                        address: "경기 양평군 양서면 복포리",
                        lat: 37.5401,
                        lng: 127.3012,
                        cuisine: "사찰음식",
                        phone: "031-774-7710",
                        michelin: null,
                        catchTable: null,
                        naver: null,
                        note: "예약 문의는 연구원으로 직접 연락"
                    }
                ]
            },
            {
                id: "s2w4",
                name: "후덕죽",
                nickname: "57년 경력 중식 대가",
                spoon: "white",
                restaurants: [
                    {
                        name: "호빈",
                        address: "서울 중구 동호로 287 앰배서더 서울 풀만",
                        lat: 37.5635,
                        lng: 127.0066,
                        cuisine: "광동식 중식",
                        phone: "02-2275-4605",
                        michelin: "1 Star",
                        catchTable: "https://app.catchtable.co.kr/ct/shop/hobin",
                        naver: null
                    }
                ]
            },
            {
                id: "s2w5",
                name: "송훈",
                nickname: "뉴욕 미슐랭 3스타 수셰프 출신",
                spoon: "white",
                restaurants: [
                    {
                        name: "크라운돼지 청담",
                        address: "서울 강남구 도산대로55길 28",
                        lat: 37.5244,
                        lng: 127.0411,
                        cuisine: "돼지고기 전문",
                        phone: "02-515-9283",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/xVZyZqzz"
                    },
                    {
                        name: "크라운돼지 제주",
                        address: "제주 제주시 탑동로2길 13",
                        lat: 33.5142,
                        lng: 126.5214,
                        cuisine: "돼지고기 전문",
                        phone: "064-723-9283",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/FzzQZXzz"
                    }
                ]
            },
            {
                id: "s2w6",
                name: "샘킴",
                nickname: "드라마 파스타 실제 모델",
                spoon: "white",
                restaurants: [
                    {
                        name: "뜨라또리아 샘킴",
                        address: "서울 강남구 도산대로49길 28",
                        lat: 37.5225,
                        lng: 127.0385,
                        cuisine: "이탈리안",
                        phone: "02-543-9994",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/trattoriasamkim",
                        naver: null
                    }
                ]
            },
            {
                id: "s2w7",
                name: "정호영",
                nickname: "방송인 겸 셰프",
                spoon: "white",
                restaurants: [
                    {
                        name: "우동 카덴",
                        address: "서울 마포구 잔다리로3길 42",
                        lat: 37.5515,
                        lng: 126.9181,
                        cuisine: "일식 우동",
                        phone: "02-6409-1226",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/udonkaden",
                        naver: null
                    }
                ]
            },
            {
                id: "s2w8",
                name: "김성운",
                nickname: "미슐랭 1스타 오너 셰프",
                spoon: "white",
                restaurants: [
                    {
                        name: "테이블포포",
                        address: "서울 용산구 회나무로13가길 38",
                        lat: 37.5365,
                        lng: 126.9927,
                        cuisine: "프렌치",
                        phone: "02-749-5044",
                        michelin: "1 Star",
                        catchTable: "https://app.catchtable.co.kr/ct/shop/table44",
                        naver: null
                    }
                ]
            },
            {
                id: "s2w9",
                name: "임성근",
                nickname: "한식 명장, 한식대첩 시즌2 우승",
                spoon: "white",
                restaurants: [
                    {
                        name: "백운한정식",
                        address: "경기 의왕시 백운호수로 68",
                        lat: 37.3687,
                        lng: 127.0125,
                        cuisine: "전통 한정식",
                        phone: "031-421-0050",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/5VnmYXzz"
                    }
                ]
            },
            {
                id: "s2w10",
                name: "레이먼 킴",
                nickname: "스타 셰프",
                spoon: "white",
                restaurants: [
                    {
                        name: "레이먼킴 서울",
                        address: "서울 강남구 압구정로46길 50",
                        lat: 37.5270,
                        lng: 127.0280,
                        cuisine: "아메리칸 스테이크",
                        phone: "02-511-0300",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/xpn5qDzz"
                    }
                ]
            },
            {
                id: "s2w11",
                name: "김희은",
                nickname: "미슐랭 빕구르망 오너 셰프",
                spoon: "white",
                restaurants: [
                    {
                        name: "소울",
                        address: "서울 용산구 회나무로46길 38",
                        lat: 37.5365,
                        lng: 126.9965,
                        cuisine: "캐주얼 파인다이닝",
                        phone: "02-790-2822",
                        michelin: "Bib Gourmand",
                        catchTable: "https://app.catchtable.co.kr/ct/shop/soul",
                        naver: null
                    }
                ]
            },
            {
                id: "s2w12",
                name: "이금희",
                nickname: "호텔 중식 명인",
                spoon: "white",
                restaurants: [
                    {
                        name: "봉래헌",
                        address: "서울 강서구 방화동로21길 72 메이필드호텔",
                        lat: 37.5672,
                        lng: 126.8221,
                        cuisine: "정통 중식",
                        phone: "02-2660-9098",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/GzQxEZHz"
                    }
                ]
            },
            {
                id: "s2w13",
                name: "김도윤",
                nickname: "히든 백수저 (시즌1 출연)",
                spoon: "white",
                restaurants: [
                    {
                        name: "윤서울",
                        address: "서울 강남구 선릉로 805",
                        lat: 37.5230,
                        lng: 127.0465,
                        cuisine: "모던 한식",
                        phone: "02-511-0414",
                        michelin: "1 Star",
                        catchTable: "https://app.catchtable.co.kr/ct/shop/yoonseoul",
                        naver: null
                    }
                ]
            },
            {
                id: "s2w14",
                name: "최강록",
                nickname: "히든 백수저, 마스터셰프 코리아 2 우승",
                spoon: "white",
                restaurants: [
                    {
                        name: "강록 다이닝",
                        address: "서울 용산구 이태원로54길 4",
                        lat: 37.5345,
                        lng: 126.9954,
                        cuisine: "모던 다이닝",
                        phone: "02-797-0707",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/gangrokdining",
                        naver: null
                    }
                ]
            }
        ],
        black: [
            {
                id: "s2b1",
                name: "김시현",
                nickname: "아기 맹수",
                spoon: "black",
                restaurants: [
                    {
                        name: "솔밤",
                        address: "서울 강남구 학동로 305",
                        lat: 37.5152,
                        lng: 127.0318,
                        cuisine: "모던 한식",
                        phone: "02-544-8888",
                        michelin: "1 Star",
                        catchTable: "https://app.catchtable.co.kr/ct/shop/solbam",
                        naver: null
                    }
                ]
            },
            {
                id: "s2b2",
                name: "박주성",
                nickname: "무쇠팔",
                spoon: "black",
                restaurants: [
                    {
                        name: "소바쥬",
                        address: "서울 마포구 도화길 41",
                        lat: 37.5439,
                        lng: 126.9415,
                        cuisine: "메밀 일식",
                        phone: "02-6929-0001",
                        michelin: "1 Star",
                        catchTable: "https://app.catchtable.co.kr/ct/shop/sobaju",
                        naver: null
                    }
                ]
            },
            {
                id: "s2b3",
                name: "옥동식",
                nickname: "돼지곰탕의 장인",
                spoon: "black",
                restaurants: [
                    {
                        name: "옥동식",
                        address: "서울 마포구 동교로46길 34",
                        lat: 37.5579,
                        lng: 126.9212,
                        cuisine: "돼지곰탕",
                        phone: "02-332-8188",
                        michelin: "Bib Gourmand",
                        catchTable: null,
                        naver: "https://naver.me/xpz5qDzz"
                    }
                ]
            },
            {
                id: "s2b4",
                name: "윤나라",
                nickname: "술 빚는 윤주모",
                spoon: "black",
                restaurants: [
                    {
                        name: "윤주당",
                        address: "서울 용산구 신흥로21길 7",
                        lat: 37.5423,
                        lng: 126.9871,
                        cuisine: "전통주 전문",
                        phone: "02-797-9905",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/5eqZJqHz"
                    }
                ]
            },
            {
                id: "s2b5",
                name: "이하성",
                nickname: "요리 괴물",
                spoon: "black",
                restaurants: [
                    {
                        name: "Oyatte (예정)",
                        address: "New York, USA",
                        lat: 40.7128,
                        lng: -74.0060,
                        cuisine: "파인다이닝",
                        phone: null,
                        michelin: null,
                        catchTable: null,
                        naver: null,
                        note: "뉴욕 레스토랑 오픈 준비 중"
                    }
                ]
            },
            {
                id: "s2b6",
                name: "명현지",
                nickname: "그때 명셰프",
                spoon: "black",
                restaurants: [
                    {
                        name: "아선재",
                        address: "서울 강남구 압구정로42길 40",
                        lat: 37.5269,
                        lng: 127.0298,
                        cuisine: "한정식",
                        phone: "02-543-0042",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/asunjae",
                        naver: null
                    }
                ]
            },
            {
                id: "s2b7",
                name: "이순실",
                nickname: "평양 큰형님",
                spoon: "black",
                restaurants: [
                    {
                        name: "이순실평양명가",
                        address: "경기 화성시 동탄순환대로20길 38",
                        lat: 37.2035,
                        lng: 127.0631,
                        cuisine: "평양냉면",
                        phone: "031-8015-5599",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/FzzQzXHz"
                    }
                ]
            },
            {
                id: "s2b8",
                name: "유용욱",
                nickname: "바베큐 연구소장",
                spoon: "black",
                restaurants: [
                    {
                        name: "유용욱 바베큐 연구소",
                        address: "서울 마포구 독막로 20",
                        lat: 37.5465,
                        lng: 126.9523,
                        cuisine: "아메리칸 바베큐",
                        phone: "02-332-0082",
                        michelin: null,
                        catchTable: null,
                        naver: "https://naver.me/xMGj4qHz"
                    }
                ]
            },
            {
                id: "s2b9",
                name: "최유강",
                nickname: "곱창킹",
                spoon: "white",
                restaurants: [
                    {
                        name: "코자차",
                        address: "서울 강남구 논현로85길 57",
                        lat: 37.5197,
                        lng: 127.0332,
                        cuisine: "이자카야",
                        phone: "02-543-8900",
                        michelin: null,
                        catchTable: "https://app.catchtable.co.kr/ct/shop/cozacha",
                        naver: null
                    }
                ]
            },
            {
                id: "s2b10",
                name: "천상현",
                nickname: "미쉐린 빕구르망 셰프",
                spoon: "white",
                restaurants: [
                    {
                        name: "천상현의 천상",
                        address: "서울 서초구 서초대로77길 3",
                        lat: 37.4922,
                        lng: 127.0254,
                        cuisine: "한정식",
                        phone: "02-525-8880",
                        michelin: "Bib Gourmand",
                        catchTable: "https://app.catchtable.co.kr/ct/shop/chunsang",
                        naver: null
                    }
                ]
            }
        ]
    }
};
