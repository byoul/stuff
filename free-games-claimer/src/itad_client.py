import requests
import re
from typing import List, Dict, Optional
from .utils.logger import logger


class ITADClient:
    """IsThereAnyDeal API 클라이언트"""

    BASE_URL = "https://api.isthereanydeal.com"
    WEB_URL = "https://isthereanydeal.com"

    # 지원하는 스토어 ID 매핑
    STORE_IDS = {
        "steam": 61,
        "epic": 35,
        "gog": 35,
        "humble": 37,
    }

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })

    def get_free_games(self, country: str = "KR") -> List[Dict]:
        """무료 게임 검색 - Playwright 스크래핑 + API 조합"""
        free_games = []

        # 1. Playwright로 사이트 스크래핑
        try:
            slugs = self._scrape_free_games_with_playwright()
            logger.info(f"스크래핑으로 발견된 무료 게임 후보: {len(slugs)}개")

            for slug in slugs:
                game_info = self._get_game_free_deal(slug, country)
                if game_info:
                    free_games.append(game_info)
        except Exception as e:
            logger.error(f"Playwright 스크래핑 실패: {e}")

        # 중복 제거
        seen = set()
        unique_games = []
        for game in free_games:
            key = (game.get("title", ""), game.get("store", ""))
            if key not in seen:
                seen.add(key)
                unique_games.append(game)

        logger.info(f"발견된 무료 게임: {len(unique_games)}개")
        return unique_games

    def _scrape_free_games_with_playwright(self) -> List[str]:
        """Playwright로 IsThereAnyDeal에서 무료 게임 스크래핑"""
        try:
            from playwright.sync_api import sync_playwright

            slugs = []
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()

                # 무료 게임 페이지 (price=0-0 필터)
                page.goto("https://isthereanydeal.com/deals/?price=0-0", timeout=30000)
                page.wait_for_load_state("networkidle")

                # 게임 링크 추출
                links = page.query_selector_all('a[href*="/game/"]')
                for link in links:
                    href = link.get_attribute("href")
                    if href and "/game/" in href:
                        # /game/slug/info/ 형태에서 slug 추출
                        match = re.search(r'/game/([^/]+)/', href)
                        if match:
                            slugs.append(match.group(1))

                browser.close()

            return list(set(slugs))
        except ImportError:
            logger.warning("Playwright가 설치되지 않았습니다. pip install playwright && playwright install")
            return []
        except Exception as e:
            logger.error(f"Playwright 스크래핑 오류: {e}")
            return []

    def _get_game_free_deal(self, slug: str, country: str) -> Optional[Dict]:
        """게임 slug로 무료 딜 확인"""
        try:
            # 게임 검색
            search_url = f"{self.BASE_URL}/games/search/v1"
            params = {"key": self.api_key, "title": slug.replace("-", " ")}

            resp = self.session.get(search_url, params=params, timeout=10)
            if resp.status_code != 200 or not resp.json():
                return None

            game = resp.json()[0]
            game_id = game.get("id")

            # 가격 조회
            prices_url = f"{self.BASE_URL}/games/prices/v2"
            params = {"key": self.api_key, "country": country}

            resp = self.session.post(prices_url, params=params, json=[game_id], timeout=10)
            if resp.status_code != 200:
                return None

            for item in resp.json():
                for deal in item.get("deals", []):
                    if deal.get("cut") == 100 or deal.get("price", {}).get("amount", 1) == 0:
                        return {
                            "id": game_id,
                            "title": game.get("title", slug),
                            "store": deal.get("shop", {}).get("name", "Unknown").lower(),
                            "store_id": deal.get("shop", {}).get("id"),
                            "url": deal.get("url", ""),
                            "original_price": deal.get("regular", {}).get("amount", 0),
                            "current_price": 0,
                            "cut": 100,
                        }
            return None
        except Exception as e:
            logger.debug(f"게임 확인 실패 ({slug}): {e}")
            return None

    def _check_known_free_sources(self, country: str) -> List[Dict]:
        """알려진 무료 게임 소스 직접 체크"""
        free_games = []

        # 자주 무료 게임이 있는 검색어들
        search_terms = [
            "free",
            "giveaway",
        ]

        for term in search_terms:
            try:
                search_url = f"{self.BASE_URL}/games/search/v1"
                params = {"key": self.api_key, "title": term, "results": 20}

                resp = self.session.get(search_url, params=params, timeout=10)
                if resp.status_code != 200:
                    continue

                games = resp.json()[:10]
                game_ids = [g.get("id") for g in games if g.get("id")]

                if not game_ids:
                    continue

                # 가격 일괄 조회
                prices_url = f"{self.BASE_URL}/games/prices/v2"
                params = {"key": self.api_key, "country": country}

                resp = self.session.post(prices_url, params=params, json=game_ids, timeout=15)
                if resp.status_code != 200:
                    continue

                for item in resp.json():
                    for deal in item.get("deals", []):
                        if deal.get("cut") == 100 or deal.get("price", {}).get("amount", 1) == 0:
                            # 해당 게임 정보 찾기
                            game = next((g for g in games if g.get("id") == item.get("id")), {})
                            free_games.append({
                                "id": item.get("id"),
                                "title": game.get("title", "Unknown"),
                                "store": deal.get("shop", {}).get("name", "Unknown").lower(),
                                "store_id": deal.get("shop", {}).get("id"),
                                "url": deal.get("url", ""),
                                "original_price": deal.get("regular", {}).get("amount", 0),
                                "current_price": 0,
                                "cut": 100,
                            })
            except Exception as e:
                logger.debug(f"소스 체크 실패 ({term}): {e}")

        return free_games

    def search_and_check_free(self, title: str, country: str = "KR") -> Optional[Dict]:
        """특정 게임 검색 후 무료인지 확인"""
        try:
            search_url = f"{self.BASE_URL}/games/search/v1"
            params = {"key": self.api_key, "title": title}

            resp = self.session.get(search_url, params=params, timeout=10)
            if resp.status_code != 200 or not resp.json():
                return None

            game = resp.json()[0]
            game_id = game.get("id")

            prices_url = f"{self.BASE_URL}/games/prices/v2"
            params = {"key": self.api_key, "country": country}

            resp = self.session.post(prices_url, params=params, json=[game_id], timeout=10)
            if resp.status_code != 200:
                return None

            for item in resp.json():
                for deal in item.get("deals", []):
                    if deal.get("cut") == 100 or deal.get("price", {}).get("amount", 1) == 0:
                        return {
                            "id": game_id,
                            "title": game.get("title", title),
                            "store": deal.get("shop", {}).get("name", "Unknown").lower(),
                            "store_id": deal.get("shop", {}).get("id"),
                            "url": deal.get("url", ""),
                            "original_price": deal.get("regular", {}).get("amount", 0),
                            "current_price": 0,
                            "cut": 100,
                        }
            return None
        except Exception as e:
            logger.error(f"게임 검색 실패: {e}")
            return None

    def _parse_deal(self, deal: dict) -> Optional[Dict]:
        """딜 정보 파싱"""
        try:
            deal_info = deal.get("deal", {})
            shop = deal_info.get("shop", {})

            return {
                "id": deal.get("id"),
                "title": deal.get("title", "Unknown"),
                "store": shop.get("name", "Unknown").lower(),
                "store_id": shop.get("id"),
                "url": deal_info.get("url", ""),
                "original_price": deal_info.get("regular", {}).get("amount", 0),
                "current_price": deal_info.get("price", {}).get("amount", 0),
                "cut": deal_info.get("cut", 0),
                "drm": deal_info.get("drm", [])
            }
        except Exception as e:
            logger.error(f"딜 파싱 실패: {e}")
            return None

    def search_game(self, title: str) -> Optional[Dict]:
        """게임 제목으로 검색"""
        url = f"{self.BASE_URL}/games/search/v1"
        params = {
            "key": self.api_key,
            "title": title
        }

        try:
            response = self.session.get(url, params=params, timeout=10)
            response.raise_for_status()
            results = response.json()
            if results:
                return results[0]
            return None
        except Exception as e:
            logger.error(f"게임 검색 실패: {e}")
            return None

    def get_game_prices(self, game_id: str, country: str = "KR") -> List[Dict]:
        """특정 게임의 모든 스토어 가격 조회"""
        url = f"{self.BASE_URL}/games/prices/v2"
        params = {
            "key": self.api_key,
            "country": country
        }
        body = [game_id]

        try:
            response = self.session.post(url, params=params, json=body, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"가격 조회 실패: {e}")
            return []

    def filter_by_store(self, games: List[Dict], stores: List[str]) -> Dict[str, List[Dict]]:
        """스토어별로 게임 분류"""
        result = {store: [] for store in stores}

        for game in games:
            store = game.get("store", "").lower()
            # 스토어 이름 정규화
            if "steam" in store:
                store = "steam"
            elif "epic" in store:
                store = "epic"
            elif "gog" in store:
                store = "gog"

            if store in result:
                result[store].append(game)

        return result
