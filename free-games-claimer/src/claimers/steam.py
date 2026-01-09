import requests
from typing import Dict, List, Optional
from pathlib import Path
import re
from .base import BaseClaimer
from ..utils.logger import logger


class SteamClaimer(BaseClaimer):
    """Steam 클레이머 - ArchiSteamFarm (ASF) IPC 연동"""

    STORE_NAME = "steam"

    def __init__(self, config: dict, data_dir: Path):
        super().__init__(config, data_dir)
        steam_config = config.get("steam", {})
        self.asf_url = steam_config.get("asf_url", "http://localhost:1242")
        self.asf_password = steam_config.get("asf_password", "")
        self.bot_name = steam_config.get("bot_name", "main")
        self.session = requests.Session()

        if self.asf_password:
            self.session.headers.update({
                "Authentication": self.asf_password
            })

    def login(self) -> bool:
        """ASF 연결 확인"""
        try:
            response = self.session.get(
                f"{self.asf_url}/Api/ASF",
                timeout=10
            )
            response.raise_for_status()
            data = response.json()

            if data.get("Success"):
                logger.info("ASF 연결 성공")
                return True
            else:
                logger.error(f"ASF 연결 실패: {data.get('Message')}")
                return False
        except requests.exceptions.ConnectionError:
            logger.error("ASF에 연결할 수 없습니다. ASF가 실행 중인지 확인하세요.")
            return False
        except Exception as e:
            logger.error(f"ASF 연결 오류: {e}")
            return False

    def get_bot_status(self) -> Optional[Dict]:
        """봇 상태 확인"""
        try:
            response = self.session.get(
                f"{self.asf_url}/Api/Bot/{self.bot_name}",
                timeout=10
            )
            response.raise_for_status()
            data = response.json()

            if data.get("Success"):
                return data.get("Result", {}).get(self.bot_name)
            return None
        except Exception as e:
            logger.error(f"봇 상태 확인 실패: {e}")
            return None

    def claim_game(self, game: Dict) -> bool:
        """Steam 게임 추가 (ASF addlicense 명령 사용)"""
        game_url = game.get("url", "")
        game_title = game.get("title", "Unknown")

        # Steam App ID 추출
        app_id = self._extract_app_id(game_url)
        if not app_id:
            logger.warning(f"Steam App ID를 추출할 수 없습니다: {game_title}")
            return False

        try:
            # ASF addlicense 명령 실행
            command = f"addlicense {self.bot_name} app/{app_id}"
            response = self.session.post(
                f"{self.asf_url}/Api/Command",
                json={"Command": command},
                timeout=30
            )
            response.raise_for_status()
            result = response.json()

            if result.get("Success"):
                output = result.get("Result", "")
                if "OK" in output or "already" in output.lower():
                    logger.info(f"Steam 게임 추가 성공: {game_title} (App ID: {app_id})")
                    return True
                else:
                    logger.warning(f"Steam 게임 추가 결과: {output}")
                    return False
            else:
                logger.error(f"Steam 게임 추가 실패: {result.get('Message')}")
                return False
        except Exception as e:
            logger.error(f"Steam 게임 추가 오류: {e}")
            return False

    def _extract_app_id(self, url: str) -> Optional[str]:
        """Steam URL에서 App ID 추출"""
        # https://store.steampowered.com/app/12345/...
        patterns = [
            r'store\.steampowered\.com/app/(\d+)',
            r'steam://store/(\d+)',
            r'steamcommunity\.com/app/(\d+)'
        ]

        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)

        return None

    def add_free_packages(self, package_ids: List[str]) -> List[str]:
        """여러 무료 패키지 추가"""
        added = []
        for pkg_id in package_ids:
            try:
                command = f"addlicense {self.bot_name} sub/{pkg_id}"
                response = self.session.post(
                    f"{self.asf_url}/Api/Command",
                    json={"Command": command},
                    timeout=30
                )
                response.raise_for_status()
                result = response.json()

                if result.get("Success") and "OK" in result.get("Result", ""):
                    added.append(pkg_id)
                    logger.info(f"패키지 추가 성공: {pkg_id}")
            except Exception as e:
                logger.error(f"패키지 추가 실패 ({pkg_id}): {e}")

        return added
