from abc import ABC, abstractmethod
from typing import Dict, List, Optional
import json
import os
from pathlib import Path


class BaseClaimer(ABC):
    """베이스 클레이머 추상 클래스"""

    STORE_NAME = "base"

    def __init__(self, config: dict, data_dir: Path):
        self.config = config
        self.data_dir = data_dir
        self.cookies_dir = data_dir / "cookies"
        self.cookies_dir.mkdir(parents=True, exist_ok=True)

    @abstractmethod
    def login(self) -> bool:
        """스토어 로그인"""
        pass

    @abstractmethod
    def claim_game(self, game: Dict) -> bool:
        """게임 클레임"""
        pass

    def claim_games(self, games: List[Dict]) -> List[Dict]:
        """여러 게임 클레임"""
        claimed = []
        for game in games:
            if self.claim_game(game):
                claimed.append(game)
        return claimed

    def is_claimed(self, game_id: str, claimed_file: Path) -> bool:
        """이미 클레임했는지 확인"""
        if not claimed_file.exists():
            return False

        with open(claimed_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        return game_id in data.get(self.STORE_NAME, [])

    def mark_claimed(self, game_id: str, claimed_file: Path):
        """클레임 완료 기록"""
        data = {"steam": [], "epic": [], "gog": []}

        if claimed_file.exists():
            with open(claimed_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

        if self.STORE_NAME not in data:
            data[self.STORE_NAME] = []

        if game_id not in data[self.STORE_NAME]:
            data[self.STORE_NAME].append(game_id)

        with open(claimed_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
