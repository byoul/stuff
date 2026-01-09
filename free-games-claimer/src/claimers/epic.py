import time
from typing import Dict, Optional, List
from pathlib import Path
from playwright.sync_api import sync_playwright, Browser, Page, BrowserContext
from .base import BaseClaimer
from ..utils.logger import logger


class EpicClaimer(BaseClaimer):
    """Epic Games Store 클레이머 - Playwright 브라우저 자동화"""

    STORE_NAME = "epic"
    EPIC_LOGIN_URL = "https://www.epicgames.com/id/login"
    EPIC_STORE_URL = "https://store.epicgames.com"

    def __init__(self, config: dict, data_dir: Path):
        super().__init__(config, data_dir)
        epic_config = config.get("epic", {})
        self.email = epic_config.get("email", "")
        self.totp_secret = epic_config.get("totp_secret", "")
        self.headless = epic_config.get("headless", False)
        self.storage_state = self.cookies_dir / "epic_state.json"
        self._playwright = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None

    def login(self) -> bool:
        """Epic Games 로그인"""
        try:
            self._playwright = sync_playwright().start()
            self.browser = self._playwright.chromium.launch(headless=self.headless)

            # 저장된 세션이 있으면 로드
            if self.storage_state.exists():
                self.context = self.browser.new_context(
                    storage_state=str(self.storage_state)
                )
                page = self.context.new_page()

                # 로그인 상태 확인
                page.goto(self.EPIC_STORE_URL, timeout=60000)
                page.wait_for_load_state("domcontentloaded")
                time.sleep(3)

                if self._is_logged_in(page):
                    logger.info("Epic Games 기존 세션으로 로그인됨")
                    return True

                # 세션 만료됨 - 새로 로그인 필요
                page.close()
                self.context.close()

            # 새로 로그인 필요
            self.context = self.browser.new_context()
            page = self.context.new_page()

            # 스토어 페이지로 직접 이동
            page.goto(self.EPIC_STORE_URL, timeout=60000)
            page.wait_for_load_state("domcontentloaded")
            time.sleep(3)

            logger.info("Epic Games 브라우저에서 로그인해주세요...")
            logger.info("로그인 완료 후 스토어 페이지(store.epicgames.com)로 이동하면 자동 감지됩니다.")

            # 로그인 완료 대기 (최대 5분)
            for i in range(150):
                time.sleep(2)

                try:
                    if self._is_logged_in(page):
                        self.context.storage_state(path=str(self.storage_state))
                        logger.info("Epic Games 로그인 성공, 세션 저장됨")
                        return True
                except Exception:
                    pass

                if i % 15 == 0 and i > 0:
                    logger.info(f"로그인 대기 중... ({i*2}초)")

            logger.error("Epic Games 로그인 시간 초과")
            return False

        except Exception as e:
            logger.error(f"Epic Games 로그인 오류: {e}")
            return False

    def _is_logged_in(self, page: Page) -> bool:
        """로그인 상태 확인"""
        try:
            current_url = page.url

            # 스토어 페이지에 있고 로그인 버튼이 없으면 성공
            if "store.epicgames.com" in current_url:
                sign_in = page.query_selector('a:has-text("Sign In"), button:has-text("Sign In"), span:has-text("Sign In")')
                if not sign_in:
                    return True
            return False
        except:
            return False

    def claim_game(self, game: Dict) -> bool:
        """Epic 게임 클레임"""
        game_url = game.get("url", "")
        game_title = game.get("title", "Unknown")

        if not self.context:
            logger.error("Epic Games에 로그인되어 있지 않습니다")
            return False

        try:
            page = self.context.new_page()
            page.goto(game_url, timeout=60000)
            page.wait_for_load_state("domcontentloaded")
            time.sleep(3)

            # "Get" 또는 "받기" 버튼 찾기
            get_button = page.query_selector(
                'button[data-testid="purchase-cta-button"], '
                'button:has-text("Get"), '
                'button:has-text("받기"), '
                'button:has-text("무료")'
            )

            if not get_button:
                # 이미 소유 중인지 확인
                owned = page.query_selector(
                    'span:has-text("In Library"), '
                    'span:has-text("라이브러리에 있음"), '
                    'span:has-text("Owned")'
                )
                if owned:
                    logger.info(f"이미 소유 중: {game_title}")
                    page.close()
                    return True
                logger.warning(f"클레임 버튼을 찾을 수 없음: {game_title}")
                page.close()
                return False

            get_button.click()
            time.sleep(3)

            # 주문 확인 모달 처리
            place_order = page.query_selector(
                'button:has-text("Place Order"), '
                'button:has-text("주문하기")'
            )
            if place_order:
                place_order.click()
                time.sleep(4)

            # 성공 확인
            success = page.query_selector(
                'span:has-text("Thank you"), '
                'span:has-text("감사합니다")'
            )

            if success:
                logger.info(f"Epic 게임 클레임 성공: {game_title}")
                page.close()
                return True

            # 이미 소유 확인 (클레임 시도 후)
            owned = page.query_selector('span:has-text("In Library"), span:has-text("Owned")')
            if owned:
                logger.info(f"이미 소유 중: {game_title}")
                page.close()
                return True

            logger.warning(f"Epic 게임 클레임 결과 확인 필요: {game_title}")
            page.close()
            return False

        except Exception as e:
            logger.error(f"Epic 게임 클레임 오류 ({game_title}): {e}")
            return False

    def claim_weekly_free_games(self) -> List[Dict]:
        """Epic 주간 무료 게임 클레임"""
        if not self.context:
            if not self.login():
                return []

        claimed = []
        try:
            page = self.context.new_page()
            page.goto(f"{self.EPIC_STORE_URL}/en-US/free-games", timeout=60000)
            page.wait_for_load_state("domcontentloaded")
            time.sleep(3)

            # 무료 게임 카드 찾기
            free_games = page.query_selector_all('[data-testid="offer-card"]')

            for game_card in free_games[:5]:  # 최대 5개
                try:
                    title_elem = game_card.query_selector('[data-testid="offer-card-text-title"]')
                    title = title_elem.text_content() if title_elem else "Unknown"

                    # FREE NOW 확인
                    free_now = game_card.query_selector('span:has-text("Free Now")')
                    if not free_now:
                        continue

                    game_card.click()
                    time.sleep(3)

                    # 클레임 시도
                    get_btn = page.query_selector('button[data-testid="purchase-cta-button"]')
                    if get_btn:
                        btn_text = get_btn.text_content()
                        if "Get" in btn_text or "받기" in btn_text:
                            get_btn.click()
                            time.sleep(2)

                            place_order = page.query_selector('button:has-text("Place Order")')
                            if place_order:
                                place_order.click()
                                time.sleep(4)
                                claimed.append({"title": title, "store": "epic"})
                                logger.info(f"Epic 주간 무료 게임 클레임: {title}")

                    page.go_back()
                    time.sleep(2)
                except Exception as e:
                    logger.debug(f"주간 무료 게임 처리 중 오류: {e}")
                    continue

            page.close()
        except Exception as e:
            logger.error(f"주간 무료 게임 페이지 오류: {e}")

        return claimed

    def close(self):
        """브라우저 종료"""
        try:
            if self.context:
                self.context.storage_state(path=str(self.storage_state))
                self.context.close()
            if self.browser:
                self.browser.close()
            if self._playwright:
                self._playwright.stop()
        except:
            pass
