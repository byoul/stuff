const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const CATCHTABLE_URL = 'https://app.catchtable.co.kr/ct/curation/culinaryclasswars2';

let browser = null;
let cachedData = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browser;
}

async function scrapeRestaurants() {
  const b = await getBrowser();
  const page = await b.newPage();

  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    console.log('캐치테이블 페이지 로딩...');
    await page.goto(CATCHTABLE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));

    const restaurants = [];
    let scrollCount = 0;
    const maxScrolls = 50;
    let lastHeight = 0;
    let noChangeCount = 0;

    while (scrollCount < maxScrolls && noChangeCount < 5) {
      // 카드 단위로 정보와 링크를 함께 수집
      const items = await page.evaluate(() => {
        const results = [];

        // 모든 shop 링크를 포함한 카드 찾기
        document.querySelectorAll('a[href*="/shop/"]').forEach(link => {
          const card = link.closest('div[class*="card"], div[class*="item"], li, article') || link.parentElement?.parentElement?.parentElement;
          if (!card) return;

          const text = card.innerText;
          const lines = text.split('\n').map(l => l.trim()).filter(l => l);

          // 셰프 정보 찾기
          const chefLine = lines.find(l => l.startsWith('흑백요리사2:'));
          if (!chefLine) return;

          const chef = chefLine.replace('흑백요리사2:', '').trim();
          const item = { chef };

          // 링크 정보
          const match = link.href.match(/\/shop\/([^/?]+)/);
          if (match) {
            item.shopId = match[1];
            item.shopUrl = `https://app.catchtable.co.kr/ct/shop/${match[1]}`;
          }

          // 나머지 정보 파싱
          for (const line of lines) {
            if (line.startsWith('흑백요리사2:')) continue;

            // 평점
            if (/^\d\.\d$/.test(line)) {
              item.rating = line;
            }
            // 리뷰 수
            if (/^\([\d,]+\)$/.test(line)) {
              item.reviewCount = line.replace(/[()]/g, '');
            }
            // 위치 · 음식종류
            const locMatch = line.match(/^([가-힣a-zA-Z0-9]+)\s*·\s*([가-힣a-zA-Z]+)$/);
            if (locMatch) {
              item.location = locMatch[1];
              item.cuisine = locMatch[2];
            }
            // 미쉐린
            if (line.includes('미쉐린') && line.includes('스타')) {
              const starMatch = line.match(/(\d)스타/);
              if (starMatch) item.michelinStar = starMatch[1];
            }
            if (line.includes('빕구르망')) {
              item.michelinBib = true;
            }
            // 예약 마감
            if (line.includes('주간 예약이 마감')) {
              item.reservationStatus = line;
            }
            // 예약 오픈
            if (line.includes('예약 오픈')) {
              item.reservationOpenTime = line;
            }
            // 예약 가능
            if (line.includes('예약 가능합니다')) {
              item.reservationPeriod = line;
            }
            // 가격
            if (line.match(/(점심|저녁|동일가).*만원/)) {
              item.priceInfo = line;
            }
            // 영업시간
            if (line.match(/영업중|영업 전|영업 종료/) && line.includes('•')) {
              item.hours = line;
            }
            // 매장명 추출
            if (!item.name && line.length > 1 && line.length < 40) {
              const skipPatterns = [
                /^\d/, /^(예약|미쉐린|영업|점심|저녁|Taste|흑백|·|사진|신규)/,
                /만원/, /마감/, /오픈$/, /가능/, /포인트/, /자동결제/, /휴무/
              ];
              if (!skipPatterns.some(p => p.test(line))) {
                item.name = line;
              }
            }
          }

          if ((item.name || item.chef) && item.shopId) {
            results.push(item);
          }
        });

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
      if (scrollCount % 10 === 0) {
        console.log(`스크롤 ${scrollCount}회, 매장 ${restaurants.length}개 수집`);
      }
    }

    console.log(`총 ${restaurants.length}개 매장 수집 완료`);
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
