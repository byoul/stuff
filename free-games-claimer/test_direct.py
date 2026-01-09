#!/usr/bin/env python3
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from config import Config
from src.itad_client import ITADClient

config = Config()
client = ITADClient(config.itad_api_key)

# 사용자가 알려준 무료 게임들 직접 검색
games_to_check = [
    "Billie's Wheelie",
    "Total War Three Kingdoms",
]

print("알려진 무료 게임 확인 중...")
found = []

for title in games_to_check:
    print(f"\n검색: {title}")
    result = client.search_and_check_free(title)
    if result:
        print(f"  -> 무료 발견! [{result['store'].upper()}]")
        print(f"     URL: {result['url']}")
        found.append(result)
    else:
        print(f"  -> 무료 아님 또는 찾을 수 없음")

print(f"\n\n=== 총 {len(found)}개 무료 게임 발견 ===")
for game in found:
    print(f"[{game['store'].upper()}] {game['title']} - {game['url']}")
