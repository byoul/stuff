import asyncio
from typing import Dict, Optional
from pathlib import Path
from playwright.async_api import async_playwright, Browser, Page, BrowserContext
from .base import BaseClaimer
from ..utils.logger import logger


def _run_async(coro):
    """Python 3.10+ 호환 async 실행"""
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None

    if loop and loop.is_running():
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor() as pool:
            future = pool.submit(asyncio.run, coro)
            return future.result()
    else:
        return asyncio.run(coro)


class GOGClaimer(BaseClaimer):
    """GOG.com 클레이머 - Playwright 브라우저 자동화"""

    STORE_NAME = "gog"
    GOG_LOGIN_URL = "https://www.gog.com/account/settings/login"
    GOG_URL = "https://www.gog.com"

    def __init__(self, config: dict, data_dir: Path):
        super().__init__(config, data_dir)
        gog_config = config.get("gog", {})
        self.email = gog_config.get("email", "")
        self.headless = gog_config.get("headless", False)
        self.storage_state = self.cookies_dir / "gog_state.json"
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self._playwright = None

    def login(self) -> bool:
        """동기 래퍼"""
        return _run_async(self._login_async())

    async def _login_async(self) -> bool:
        """GOG 로그인"""
        try:
            self._playwright = await async_playwright().start()
            self.browser = await self._playwright.chromium.launch(headless=self.headless)

            # 저장된 세션이 있으면 로드
            if self.storage_state.exists():
                self.context = await self.browser.new_context(
                    storage_state=str(self.storage_state)
                )
                page = await self.context.new_page()

                await page.goto(self.GOG_URL)
                await page.wait_for_load_state("networkidle")

                if await self._is_logged_in(page):
                    logger.info("GOG 기존 세션으로 로그인됨")
                    return True

            # 새로 로그인 필요
            self.context = await self.browser.new_context()
            page = await self.context.new_page()

            await page.goto(self.GOG_LOGIN_URL)
            logger.info("GOG 수동 로그인이 필요합니다. 브라우저에서 로그인해주세요...")

            # 로그인 완료 대기 (최대 5분)
            for _ in range(300):
                await asyncio.sleep(1)
                if await self._is_logged_in(page):
                    await self.context.storage_state(path=str(self.storage_state))
                    logger.info("GOG 로그인 성공, 세션 저장됨")
                    return True

            logger.error("GOG 로그인 시간 초과")
            return False

        except Exception as e:
            logger.error(f"GOG 로그인 오류: {e}")
            return False

    async def _is_logged_in(self, page: Page) -> bool:
        """로그인 상태 확인"""
        try:
            # 계정 메뉴가 있으면 로그인된 상태
            await page.wait_for_selector('.menu-username, .header-account', timeout=5000)
            return True
        except:
            return False

    def claim_game(self, game: Dict) -> bool:
        """동기 래퍼"""
        return _run_async(self._claim_game_async(game))

    async def _claim_game_async(self, game: Dict) -> bool:
        """GOG 게임 클레임"""
        game_url = game.get("url", "")
        game_title = game.get("title", "Unknown")

        if not self.context:
            logger.error("GOG에 로그인되어 있지 않습니다")
            return False

        try:
            page = await self.context.new_page()
            await page.goto(game_url)
            await page.wait_for_load_state("networkidle")
            await asyncio.sleep(2)

            # 이미 소유 중인지 확인
            owned = await page.query_selector(
                '.product-actions__in-library, '
                'span:has-text("In library"), '
                'span:has-text("Owned")'
            )
            if owned:
                logger.info(f"GOG 이미 소유 중: {game_title}")
                await page.close()
                return True

            # 무료 게임 버튼 찾기
            claim_button = await page.query_selector(
                'button.product-actions__add-to-library, '
                'button:has-text("Add to library"), '
                'button:has-text("라이브러리에 추가"), '
                'button:has-text("Get it FREE")'
            )

            if not claim_button:
                # 가격이 FREE인 경우 구매 버튼
                free_price = await page.query_selector(
                    '.product-actions-price__final-amount:has-text("FREE"), '
                    '.product-actions-price__final-amount:has-text("0")'
                )
                if free_price:
                    buy_button = await page.query_selector(
                        '.product-actions__add-to-cart, '
                        'button:has-text("Add to cart")'
                    )
                    if buy_button:
                        claim_button = buy_button

            if claim_button:
                await claim_button.click()
                await asyncio.sleep(3)

                # 체크아웃 처리 (무료 게임)
                checkout = await page.query_selector(
                    'button:has-text("Checkout"), '
                    'button:has-text("Complete order")'
                )
                if checkout:
                    await checkout.click()
                    await asyncio.sleep(3)

                logger.info(f"GOG 게임 클레임 성공: {game_title}")
                await page.close()
                return True

            logger.warning(f"GOG 클레임 버튼을 찾을 수 없음: {game_title}")
            await page.close()
            return False

        except Exception as e:
            logger.error(f"GOG 게임 클레임 오류 ({game_title}): {e}")
            return False

    async def claim_giveaway(self) -> Optional[Dict]:
        """GOG 기브어웨이 클레임"""
        if not self.context:
            if not await self._login_async():
                return None

        try:
            page = await self.context.new_page()
            await page.goto(self.GOG_URL)
            await page.wait_for_load_state("networkidle")

            # 기브어웨이 배너 찾기
            giveaway_banner = await page.query_selector(
                '.giveaway-banner, '
                '[data-testid="giveaway"], '
                '.ng-giveaway'
            )

            if giveaway_banner:
                # 클레임 버튼 클릭
                claim_btn = await giveaway_banner.query_selector(
                    'button, a:has-text("Claim"), a:has-text("Get it FREE")'
                )
                if claim_btn:
                    await claim_btn.click()
                    await asyncio.sleep(2)

                    # 게임 제목 추출
                    title_elem = await giveaway_banner.query_selector(
                        '.giveaway-banner__title, .product-title'
                    )
                    title = await title_elem.text_content() if title_elem else "Unknown"

                    logger.info(f"GOG 기브어웨이 클레임 성공: {title}")
                    await page.close()
                    return {"title": title, "store": "gog"}

            logger.info("현재 GOG 기브어웨이가 없습니다")
            await page.close()
            return None

        except Exception as e:
            logger.error(f"GOG 기브어웨이 클레임 오류: {e}")
            return None

    async def close(self):
        """브라우저 종료"""
        if self.context:
            await self.context.storage_state(path=str(self.storage_state))
        if self.browser:
            await self.browser.close()
