#!/usr/bin/env python3
"""API 응답 디버깅"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from config import Config

import requests

config = Config()
api_key = config.itad_api_key

if not api_key:
    print("API 키가 설정되지 않았습니다.")
    sys.exit(1)

# 여러 페이지 가져오기
all_deals = []
offset = 0
limit = 200

print("무료 게임 검색 중...")

while True:
    url = "https://api.isthereanydeal.com/deals/v2"
    params = {
        "key": api_key,
        "country": "KR",
        "offset": offset,
        "limit": limit
    }

    response = requests.get(url, params=params, timeout=30)
    if response.status_code != 200:
        print(f"에러: {response.status_code}")
        break

    data = response.json()
    deals = data.get("list", [])
    all_deals.extend(deals)

    print(f"  가져온 딜: {len(all_deals)}개", end="\r")

    if not data.get("hasMore", False):
        break
    offset += limit

    # 최대 2000개까지만
    if offset >= 2000:
        break

print(f"\n총 {len(all_deals)}개 딜 확인")

# 100% 할인 찾기
print("\n=== 100% 할인 (무료) 게임 ===")
free_games = []

for deal in all_deals:
    cut = deal.get("deal", {}).get("cut", 0)
    price = deal.get("deal", {}).get("price", {}).get("amount", 0)

    if cut == 100 or price == 0:
        title = deal.get("title", "Unknown")
        shop = deal.get("deal", {}).get("shop", {}).get("name", "Unknown")
        url = deal.get("deal", {}).get("url", "")
        free_games.append({
            "title": title,
            "shop": shop,
            "cut": cut,
            "price": price,
            "url": url
        })

if free_games:
    for g in free_games:
        print(f"\n[{g['cut']}% 할인] {g['title']}")
        print(f"  스토어: {g['shop']}")
        print(f"  가격: {g['price']}")
        print(f"  URL: {g['url']}")
else:
    print("100% 할인 게임 없음")

# 90% 이상 할인도 확인
print("\n=== 90% 이상 할인 게임 ===")
high_discount = [d for d in all_deals if d.get("deal", {}).get("cut", 0) >= 90]
print(f"90% 이상 할인: {len(high_discount)}개")

for deal in high_discount[:10]:
    cut = deal.get("deal", {}).get("cut", 0)
    title = deal.get("title", "Unknown")
    shop = deal.get("deal", {}).get("shop", {}).get("name", "Unknown")
    price = deal.get("deal", {}).get("price", {}).get("amount", 0)
    print(f"  [{cut}%] {title} - {shop} - {price}원")
