import json
import os
from pathlib import Path
from typing import Optional


class Config:
    """설정 관리 클래스"""

    DEFAULT_CONFIG = {
        "itad_api_key": "",
        "stores": ["steam", "epic", "gog"],
        "check_interval_hours": 6,
        "steam": {
            "enabled": True,
            "asf_url": "http://localhost:1242",
            "asf_password": "",
            "bot_name": "main"
        },
        "epic": {
            "enabled": True,
            "email": "",
            "totp_secret": "",
            "headless": False
        },
        "gog": {
            "enabled": True,
            "email": "",
            "headless": False
        },
        "notifications": {
            "discord_webhook": "",
            "telegram_bot_token": "",
            "telegram_chat_id": ""
        }
    }

    def __init__(self, config_path: Optional[Path] = None):
        self.config_path = config_path or Path(__file__).parent / "config.json"
        self.config = self._load_config()

    def _load_config(self) -> dict:
        """설정 파일 로드"""
        if self.config_path.exists():
            with open(self.config_path, 'r', encoding='utf-8') as f:
                loaded = json.load(f)
                # 기본값과 병합
                return self._merge_config(self.DEFAULT_CONFIG, loaded)
        return self.DEFAULT_CONFIG.copy()

    def _merge_config(self, default: dict, loaded: dict) -> dict:
        """기본 설정과 로드된 설정 병합"""
        result = default.copy()
        for key, value in loaded.items():
            if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                result[key] = self._merge_config(result[key], value)
            else:
                result[key] = value
        return result

    def save(self):
        """설정 파일 저장"""
        with open(self.config_path, 'w', encoding='utf-8') as f:
            json.dump(self.config, f, indent=4, ensure_ascii=False)

    def get(self, key: str, default=None):
        """설정 값 가져오기"""
        keys = key.split('.')
        value = self.config
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        return value

    def set(self, key: str, value):
        """설정 값 설정"""
        keys = key.split('.')
        config = self.config
        for k in keys[:-1]:
            if k not in config:
                config[k] = {}
            config = config[k]
        config[keys[-1]] = value

    @property
    def itad_api_key(self) -> str:
        return self.config.get("itad_api_key", "")

    @property
    def stores(self) -> list:
        return self.config.get("stores", [])

    @property
    def steam_config(self) -> dict:
        return self.config.get("steam", {})

    @property
    def epic_config(self) -> dict:
        return self.config.get("epic", {})

    @property
    def gog_config(self) -> dict:
        return self.config.get("gog", {})

    @property
    def notifications_config(self) -> dict:
        return self.config.get("notifications", {})

    def is_store_enabled(self, store: str) -> bool:
        """스토어가 활성화되어 있는지 확인"""
        store_config = self.config.get(store, {})
        return store_config.get("enabled", True) and store in self.stores
