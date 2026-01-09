#!/usr/bin/env python3
"""
Free Games Auto Claimer
IsThereAnyDeal에서 100% 할인 게임을 찾아 자동으로 클레임합니다.
"""

import argparse
import asyncio
import json
import sys
from pathlib import Path
from typing import Dict, List

# 프로젝트 루트를 path에 추가
sys.path.insert(0, str(Path(__file__).parent))

from config import Config
from src.itad_client import ITADClient
from src.claimers.steam import SteamClaimer
from src.claimers.epic import EpicClaimer
from src.claimers.gog import GOGClaimer
from src.utils.notifications import NotificationManager
from src.utils.logger import logger


class FreeGamesClaimer:
    """메인 클레이머 클래스"""

    def __init__(self, config_path: Path = None, dry_run: bool = False):
        self.config = Config(config_path)
        self.dry_run = dry_run
        self.data_dir = Path(__file__).parent / "data"
        self.data_dir.mkdir(exist_ok=True)
        self.claimed_file = self.data_dir / "claimed_games.json"

        # API 클라이언트
        if self.config.itad_api_key:
            self.itad = ITADClient(self.config.itad_api_key)
        else:
            self.itad = None
            logger.warning("IsThereAnyDeal API 키가 설정되지 않았습니다")

        # 알림 관리자
        self.notifier = NotificationManager(self.config.notifications_config)

        # 스토어별 클레이머
        self.claimers: Dict[str, any] = {}
        self._init_claimers()

    def _init_claimers(self):
        """스토어별 클레이머 초기화"""
        if self.config.is_store_enabled("steam"):
            self.claimers["steam"] = SteamClaimer(self.config.config, self.data_dir)

        if self.config.is_store_enabled("epic"):
            self.claimers["epic"] = EpicClaimer(self.config.config, self.data_dir)

        if self.config.is_store_enabled("gog"):
            self.claimers["gog"] = GOGClaimer(self.config.config, self.data_dir)

    def get_free_games(self) -> Dict[str, List[Dict]]:
        """IsThereAnyDeal에서 무료 게임 가져오기"""
        if not self.itad:
            return {}

        free_games = self.itad.get_free_games()
        stores = list(self.claimers.keys())
        return self.itad.filter_by_store(free_games, stores)

    def load_claimed(self) -> Dict[str, List[str]]:
        """이미 클레임한 게임 목록 로드"""
        if not self.claimed_file.exists():
            return {"steam": [], "epic": [], "gog": []}

        with open(self.claimed_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def save_claimed(self, claimed: Dict[str, List[str]]):
        """클레임한 게임 목록 저장"""
        with open(self.claimed_file, 'w', encoding='utf-8') as f:
            json.dump(claimed, f, indent=2, ensure_ascii=False)

    def run(self) -> List[Dict]:
        """메인 실행"""
        logger.info("=" * 50)
        logger.info("Free Games Auto Claimer 시작")
        logger.info("=" * 50)

        all_claimed = []
        claimed_record = self.load_claimed()

        # 1. IsThereAnyDeal에서 무료 게임 검색
        logger.info("IsThereAnyDeal에서 무료 게임 검색 중...")
        free_games = self.get_free_games()

        for store, games in free_games.items():
            if not games:
                continue

            logger.info(f"\n[{store.upper()}] 발견된 무료 게임: {len(games)}개")

            # 이미 클레임한 게임 제외
            new_games = [
                g for g in games
                if g.get("id") not in claimed_record.get(store, [])
            ]

            if not new_games:
                logger.info(f"[{store.upper()}] 새로운 무료 게임 없음")
                continue

            logger.info(f"[{store.upper()}] 새로운 무료 게임: {len(new_games)}개")

            for game in new_games:
                logger.info(f"  - {game['title']}: {game['url']}")

            if self.dry_run:
                logger.info(f"[{store.upper()}] Dry-run 모드: 클레임 건너뜀")
                continue

            # 클레이머 실행
            claimer = self.claimers.get(store)
            if not claimer:
                continue

            # 로그인
            if not claimer.login():
                logger.error(f"[{store.upper()}] 로그인 실패")
                continue

            # 게임 클레임
            for game in new_games:
                if claimer.claim_game(game):
                    all_claimed.append(game)
                    if store not in claimed_record:
                        claimed_record[store] = []
                    claimed_record[store].append(game.get("id"))

        # 2. 스토어별 추가 무료 게임 체크 (Epic 주간 무료)
        if not self.dry_run:
            # Epic 주간 무료 게임
            if "epic" in self.claimers:
                logger.info("\n[EPIC] 주간 무료 게임 확인 중...")
                epic_claimer: EpicClaimer = self.claimers["epic"]
                try:
                    weekly = epic_claimer.claim_weekly_free_games()
                    all_claimed.extend(weekly)
                except Exception as e:
                    logger.error(f"Epic 주간 무료 게임 클레임 오류: {e}")

        # 결과 저장 및 알림
        self.save_claimed(claimed_record)

        if all_claimed:
            logger.info(f"\n총 {len(all_claimed)}개 게임 클레임 완료!")
            self.notifier.notify(
                "무료 게임 클레임 완료!",
                f"총 {len(all_claimed)}개 게임을 라이브러리에 추가했습니다.",
                all_claimed
            )
        else:
            logger.info("\n새로 클레임한 게임 없음")

        logger.info("=" * 50)
        logger.info("Free Games Auto Claimer 종료")
        logger.info("=" * 50)

        return all_claimed


def main():
    parser = argparse.ArgumentParser(
        description="IsThereAnyDeal 무료 게임 자동 클레이머"
    )
    parser.add_argument(
        "--config", "-c",
        type=Path,
        default=None,
        help="설정 파일 경로 (기본: config.json)"
    )
    parser.add_argument(
        "--dry-run", "-d",
        action="store_true",
        help="실제 클레임 없이 테스트 실행"
    )
    parser.add_argument(
        "--setup",
        action="store_true",
        help="초기 설정 생성"
    )

    args = parser.parse_args()

    if args.setup:
        config = Config()
        config.save()
        logger.info(f"설정 파일이 생성되었습니다: {config.config_path}")
        logger.info("config.json을 열어 API 키와 계정 정보를 입력하세요.")
        return

    claimer = FreeGamesClaimer(config_path=args.config, dry_run=args.dry_run)
    claimer.run()


if __name__ == "__main__":
    main()
