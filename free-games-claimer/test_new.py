#!/usr/bin/env python3
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from config import Config
from src.itad_client import ITADClient

config = Config()
client = ITADClient(config.itad_api_key)

print("무료 게임 검색 중...")
free_games = client.get_free_games()

print(f"\n=== 발견된 무료 게임: {len(free_games)}개 ===")
for game in free_games:
    print(f"\n[{game['store'].upper()}] {game['title']}")
    print(f"  URL: {game['url']}")
    print(f"  정가: {game['original_price']}원")
