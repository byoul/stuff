import requests
from typing import Optional
from .logger import logger


class NotificationManager:
    """Discord/Telegram 알림 관리자"""

    def __init__(self, config: dict):
        self.discord_webhook = config.get('discord_webhook', '')
        self.telegram_token = config.get('telegram_bot_token', '')
        self.telegram_chat_id = config.get('telegram_chat_id', '')

    def send_discord(self, title: str, message: str, color: int = 0x00FF00) -> bool:
        """Discord 웹훅으로 알림 전송"""
        if not self.discord_webhook:
            return False

        payload = {
            "embeds": [{
                "title": title,
                "description": message,
                "color": color
            }]
        }

        try:
            response = requests.post(self.discord_webhook, json=payload, timeout=10)
            response.raise_for_status()
            logger.info(f"Discord 알림 전송 완료: {title}")
            return True
        except Exception as e:
            logger.error(f"Discord 알림 전송 실패: {e}")
            return False

    def send_telegram(self, message: str) -> bool:
        """Telegram으로 알림 전송"""
        if not self.telegram_token or not self.telegram_chat_id:
            return False

        url = f"https://api.telegram.org/bot{self.telegram_token}/sendMessage"
        payload = {
            "chat_id": self.telegram_chat_id,
            "text": message,
            "parse_mode": "HTML"
        }

        try:
            response = requests.post(url, json=payload, timeout=10)
            response.raise_for_status()
            logger.info("Telegram 알림 전송 완료")
            return True
        except Exception as e:
            logger.error(f"Telegram 알림 전송 실패: {e}")
            return False

    def notify(self, title: str, message: str, games: list = None):
        """모든 활성화된 채널로 알림 전송"""
        if games:
            game_list = "\n".join([f"- {g['title']} ({g['store']})" for g in games])
            full_message = f"{message}\n\n{game_list}"
        else:
            full_message = message

        # Discord
        if self.discord_webhook:
            self.send_discord(title, full_message)

        # Telegram
        if self.telegram_token:
            telegram_msg = f"<b>{title}</b>\n\n{full_message}"
            self.send_telegram(telegram_msg)
