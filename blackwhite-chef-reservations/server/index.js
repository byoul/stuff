const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const CATCHTABLE_URL = 'https://app.catchtable.co.kr/ct/curation/culinaryclasswars2';

// 매장명 -> shopId 매핑 로드
let shopMapping = {};
try {
  const mappingPath = path.join(__dirname, 'shopMapping.json');
  shopMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  console.log(`${Object.keys(shopMapping).length}개 매장 매핑 로드됨`);
} catch (e) {
  console.log('매핑 파일 없음, 검색 링크 사용');
}

let browser = null;
let cachedData = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5분
const PARALLEL_COUNT = 5; // 동시 조회 수

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browser;
}

async function scrapeRestaurants(onProgress = null) {
  const sendProgress = (stage, current, total, message) => {
    if (onProgress) onProgress({ stage, current, total, message });
  };

  const b = await getBrowser();
  const page = await b.newPage();

  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    console.log('캐치테이블 페이지 로딩...');
    sendProgress('loading', 0, 0, '캐치테이블 페이지 로딩 중...');
    await page.goto(CATCHTABLE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));

    const restaurants = [];
    let scrollCount = 0;
    const maxScrolls = 50;
    let lastHeight = 0;
    let noChangeCount = 0;

    while (scrollCount < maxScrolls && noChangeCount < 3) {
      // 텍스트에서 매장 정보 수집
      const items = await page.evaluate(() => {
        const results = [];
        const text = document.body.innerText;
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);

        let i = 0;
        while (i < lines.length) {
          if (lines[i].startsWith('흑백요리사2:')) {
            const chef = lines[i].replace('흑백요리사2:', '').trim();
            const item = { chef };
            i++;

            for (let j = 0; j < 20 && i + j < lines.length; j++) {
              const line = lines[i + j];
              if (line.startsWith('흑백요리사2:')) break;

              if (/^\d\.\d$/.test(line)) item.rating = line;
              if (/^\([\d,]+\)$/.test(line)) item.reviewCount = line.replace(/[()]/g, '');

              const locMatch = line.match(/^([가-힣a-zA-Z0-9]+)\s*·\s*([가-힣a-zA-Z]+)$/);
              if (locMatch) {
                item.location = locMatch[1];
                item.cuisine = locMatch[2];
              }

              if (line.includes('미쉐린') && line.includes('스타')) {
                const starMatch = line.match(/(\d)스타/);
                if (starMatch) item.michelinStar = starMatch[1];
              }
              if (line.includes('빕구르망')) item.michelinBib = true;
              if (line.includes('주간 예약이 마감')) item.reservationStatus = line;
              // "2월 10일 오후 1:00 예약 오픈" 형태 매칭
              if (line.includes('예약 오픈') && line.match(/\d+월\s*\d+일/)) {
                item.reservationOpenTime = line;
              }
              // "3월 1일 ~ 31일 예약 가능합니다" 형태 매칭
              if (line.includes('예약') && line.includes('가능') && line.match(/\d+월\s*\d+일/)) {
                item.reservationPeriod = line;
              }
              if (line.match(/(점심|저녁|동일가).*만원/)) item.priceInfo = line;
              if (line.match(/영업중|영업 전|영업 종료/) && line.includes('•')) item.hours = line;

              if (!item.name && line.length > 1 && line.length < 40) {
                const skipPatterns = [
                  // 기본 패턴
                  /^\d/, /^(예약|미쉐린|영업|점심|저녁|Taste|흑백|·|사진|신규)/,
                  /만원/, /마감/, /오픈$/, /가능/, /포인트/, /자동결제/, /휴무/,
                  // 방송/유튜브 관련
                  /유튜브/, /Youtube/, /전지적/, /참견/, /수요미식회/, /생활의 달인/,
                  /전현무/, /비밀이야/, /MBC|SBS|KBS/, /강민경/,
                  // 셰프 별명/설명
                  /동네의/, /꽃 주문/, /삐딱한/, /술 빚는/, /바베큐연구소장/,
                  /부채도사/, /황금손/, /서울 엄마/, /천재/, /명인/, /달인/,
                  // 태그
                  /트래픽/, /급상승/, /입점/, /성공 보장/, /알림/,
                  /브레이크/, /오늘\(/, /아직/
                ];
                if (!skipPatterns.some(p => p.test(line))) {
                  item.name = line;
                }
              }
            }

            if (item.name || item.chef) {
              results.push(item);
            }
          }
          i++;
        }
        return results;
      });

      // 기존 데이터에 추가 (중복 제거)
      items.forEach(item => {
        const key = `${item.chef}|${item.name}`;
        if (!restaurants.find(r => `${r.chef}|${r.name}` === key)) {
          restaurants.push(item);
        }
      });

      // 스크롤
      await page.evaluate(async () => {
        const wrapper = document.querySelector('.wrapper');
        if (wrapper) {
          wrapper.scrollTop += 800;
        } else {
          window.scrollBy(0, 800);
        }
      });
      await new Promise(r => setTimeout(r, 1500));

      const currentHeight = await page.evaluate(() => {
        const wrapper = document.querySelector('.wrapper');
        return wrapper ? wrapper.scrollHeight : document.body.scrollHeight;
      });

      if (currentHeight === lastHeight) {
        noChangeCount++;
      } else {
        noChangeCount = 0;
        lastHeight = currentHeight;
      }

      scrollCount++;
      sendProgress('collecting', restaurants.length, 0, `매장 수집 중... (${restaurants.length}개)`);
      if (scrollCount % 10 === 0) {
        console.log(`스크롤 ${scrollCount}회, 매장 ${restaurants.length}개 수집`);
      }
    }

    // 매핑 적용
    restaurants.forEach(r => {
      if (r.name && shopMapping[r.name]) {
        r.shopId = shopMapping[r.name];
        r.shopUrl = `https://app.catchtable.co.kr/ct/shop/${shopMapping[r.name]}`;
      } else if (r.name) {
        r.shopUrl = `https://app.catchtable.co.kr/ct/search?keyword=${encodeURIComponent(r.name)}`;
      }
    });

    console.log(`총 ${restaurants.length}개 매장 수집 완료`);
    sendProgress('collected', restaurants.length, restaurants.length, `${restaurants.length}개 매장 수집 완료`);

    // 개별 매장 페이지에서 실제 예약 가능 날짜 가져오기
    console.log('개별 매장 예약 가능 날짜 조회 중...');

    // shopId가 있는 매장만 필터링
    const withShopId = restaurants.filter(r => r.shopId);
    console.log(`${withShopId.length}개 매장 상세 조회 예정 (병렬 ${PARALLEL_COUNT}개)`);
    sendProgress('detail', 0, withShopId.length, `상세 조회 시작... (0/${withShopId.length})`);

    // 페이지 풀 생성
    const pages = [];
    for (let i = 0; i < PARALLEL_COUNT; i++) {
      const p = await b.newPage();
      await p.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
      pages.push(p);
    }

    // 단일 매장 조회 함수
    const fetchShopDetail = async (page, r) => {
      try {
        const shopUrl = `https://app.catchtable.co.kr/ct/shop/${r.shopId}`;
        await page.goto(shopUrl, { waitUntil: 'networkidle2', timeout: 20000 });
        await new Promise(resolve => setTimeout(resolve, 1500));

        const availability = await page.evaluate(() => {
          const text = document.body.innerText;
          const dates = [];
          const lines = text.split('\n').map(l => l.trim()).filter(l => l);

          // 예약 오픈 일정 정보 수집
          const openSchedule = [];
          let inOpenScheduleSection = false;

          // 예약 캘린더 영역 찾기 (날짜 · 인원 · 시간 이후)
          let inCalendarSection = false;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // 예약 오픈 일정 섹션 감지
            if (line === '예약 오픈 일정') {
              inOpenScheduleSection = true;
              continue;
            }

            // 예약 오픈 일정 섹션 종료 조건
            if (inOpenScheduleSection) {
              if (line === '예약 오픈 알림 받기' || line.includes('소식') || line.includes('리뷰')) {
                inOpenScheduleSection = false;
              } else if (line.match(/\d+월\s*\d+일/)) {
                // "2월 10일 오후 1:00" 또는 "3월 1일 ~ 31일 예약이 가능합니다" 형태
                openSchedule.push(line);
              }
            }

            // 캘린더 섹션 시작 감지
            if (line.includes('날짜 · 인원 · 시간') || line.includes('날짜·인원·시간')) {
              inCalendarSection = true;
              continue;
            }

            // 리뷰 섹션 등 다른 섹션 시작하면 종료
            if (inCalendarSection && (line.includes('리뷰') || line.includes('소개') || line.includes('위치'))) {
              break;
            }

            if (!inCalendarSection) continue;

            // "1.16 (금)" 형태의 날짜 패턴 (YY.MM.DD 형식 제외 - 2자리.1~2자리만)
            const dateMatch = line.match(/^(\d{1,2}\.\d{1,2})\s*\([월화수목금토일]\)$/);
            if (dateMatch) {
              // 다음 줄 확인
              const nextLine = lines[i + 1] || '';

              // 다음 줄이 정확히 "예약 가능"일 때만 추가
              if (nextLine === '예약 가능') {
                dates.push(dateMatch[1]);
              }
              // "휴무", "예약 마감" 등은 무시
            }

            if (dates.length >= 5) break;
          }

          // 현장 웨이팅 여부
          const hasWalkIn = text.includes('현장') && text.includes('웨이팅');

          return { dates, hasWalkIn, openSchedule };
        });

        r.availableDates = availability.dates;

        // 예약 오픈 일정 정보 저장
        if (availability.openSchedule && availability.openSchedule.length > 0) {
          const now = new Date();
          const currentMonth = now.getMonth() + 1;
          const currentDay = now.getDate();

          // 미래 날짜인지 확인하는 함수
          const isFutureDate = (dateStr) => {
            const match = dateStr.match(/(\d+)월\s*(\d+)일/);
            if (!match) return false;
            const month = parseInt(match[1]);
            const day = parseInt(match[2]);

            // 현재 월 기준으로 판단
            // 1~3월일 때 11~12월은 작년이므로 과거
            if (currentMonth <= 3 && month >= 11) return false;
            // 11~12월일 때 1~3월은 내년이므로 미래
            if (currentMonth >= 11 && month <= 3) return true;

            // 그 외는 단순 비교
            if (month > currentMonth) return true;
            if (month === currentMonth && day >= currentDay) return true;
            return false;
          };

          // 예약 오픈 시간 (미래 날짜 중 오후/오전 시간이 포함된 항목)
          const futureOpenTimes = availability.openSchedule.filter(s =>
            (s.match(/\d+월\s*\d+일.*(오전|오후)\s*\d+:\d+/) ||
             s.match(/\d+월\s*\d+일.*\d+시/)) &&
            isFutureDate(s)
          );
          const openTimeItem = futureOpenTimes.length > 0 ? futureOpenTimes[0] : null;
          if (openTimeItem && !r.reservationOpenTime) {
            r.reservationOpenTime = openTimeItem + ' 예약 오픈';
          }

          // 예약 가능 기간 (미래 날짜 중 ~ 포함 또는 "예약이 가능합니다" 포함)
          const futurePeriods = availability.openSchedule.filter(s =>
            (s.includes('~') || s.includes('예약이 가능') || s.includes('예약 가능')) &&
            isFutureDate(s)
          );
          const periodItem = futurePeriods.length > 0 ? futurePeriods[0] : null;
          if (periodItem && !r.reservationPeriod) {
            r.reservationPeriod = periodItem;
          }
        }

        if (availability.dates.length > 0) {
          r.reservationStatus = `예약 가능 (${availability.dates.length}일)`;
        } else if (availability.hasWalkIn) {
          r.reservationStatus = null; // 프론트에서 현장웨이팅으로 표시
        }
      } catch (e) {
        console.log(`${r.name} 날짜 조회 실패:`, e.message);
      }
    };

    // 배치로 나누어 병렬 처리
    for (let i = 0; i < withShopId.length; i += PARALLEL_COUNT) {
      const batch = withShopId.slice(i, i + PARALLEL_COUNT);
      const promises = batch.map((r, idx) => fetchShopDetail(pages[idx], r));
      await Promise.all(promises);
      const completed = Math.min(i + PARALLEL_COUNT, withShopId.length);
      console.log(`${completed}/${withShopId.length} 매장 날짜 조회 완료`);
      sendProgress('detail', completed, withShopId.length, `상세 조회 중... (${completed}/${withShopId.length})`);
    }

    // 페이지 풀 정리
    for (const p of pages) {
      await p.close();
    }
    console.log('예약 날짜 조회 완료');
    sendProgress('done', 0, 0, '완료');

    return restaurants;

  } finally {
    await page.close();
  }
}

// 매장 목록 API
app.get('/api/restaurants', async (req, res) => {
  try {
    // 캐시 확인
    if (cachedData && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
      return res.json({ success: true, data: cachedData, cached: true });
    }

    const data = await scrapeRestaurants();
    cachedData = data;
    cacheTime = Date.now();

    res.json({ success: true, data, cached: false });
  } catch (error) {
    console.error('에러:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// SSE 스트리밍 API
app.get('/api/restaurants/stream', async (req, res) => {
  // SSE 헤더 설정
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // 캐시 확인
  if (cachedData && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
    res.write(`data: ${JSON.stringify({ type: 'cached', data: cachedData })}\n\n`);
    res.end();
    return;
  }

  try {
    const data = await scrapeRestaurants((progress) => {
      res.write(`data: ${JSON.stringify({ type: 'progress', ...progress })}\n\n`);
    });

    cachedData = data;
    cacheTime = Date.now();

    res.write(`data: ${JSON.stringify({ type: 'complete', data })}\n\n`);
    res.end();
  } catch (error) {
    console.error('에러:', error.message);
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
    res.end();
  }
});

// 캐시 초기화
app.post('/api/refresh', async (req, res) => {
  cachedData = null;
  cacheTime = null;
  res.json({ success: true, message: '캐시 초기화 완료' });
});

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`서버 실행: http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  if (browser) await browser.close();
  process.exit(0);
});
