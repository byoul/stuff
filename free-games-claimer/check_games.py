#!/usr/bin/env python3
import requests
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from config import Config

config = Config()
api_key = config.itad_api_key

# 게임 검색
games_to_check = ["billies wheelie", "total war three kingdoms"]

for game_name in games_to_check:
    print(f"\n=== {game_name} 검색 ===")

    # 1. 게임 검색
    search_url = "https://api.isthereanydeal.com/games/search/v1"
    params = {"key": api_key, "title": game_name}

    resp = requests.get(search_url, params=params, timeout=10)
    if resp.status_code != 200:
        print(f"검색 실패: {resp.status_code}")
        continue

    results = resp.json()
    if not results:
        print("검색 결과 없음")
        continue

    game = results[0]
    game_id = game.get("id")
    print(f"게임 ID: {game_id}")
    print(f"제목: {game.get('title')}")

    # 2. 가격 조회
    prices_url = "https://api.isthereanydeal.com/games/prices/v2"
    params = {"key": api_key, "country": "KR"}

    resp = requests.post(prices_url, params=params, json=[game_id], timeout=10)
    if resp.status_code != 200:
        print(f"가격 조회 실패: {resp.status_code} - {resp.text}")
        continue

    prices_data = resp.json()
    print(f"\n가격 정보:")

    for item in prices_data:
        deals = item.get("deals", [])
        if not deals:
            print("  현재 판매 중인 딜 없음")
        for deal in deals:
            shop = deal.get("shop", {}).get("name", "Unknown")
            price = deal.get("price", {}).get("amount", 0)
            regular = deal.get("regular", {}).get("amount", 0)
            cut = deal.get("cut", 0)
            url = deal.get("url", "")

            print(f"  [{shop}] {cut}% 할인 - {price}원 (정가 {regular}원)")
            if cut == 100 or price == 0:
                print(f"    *** 무료! URL: {url}")
