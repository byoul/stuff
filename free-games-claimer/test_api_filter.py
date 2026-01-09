#!/usr/bin/env python3
import requests
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from config import Config

config = Config()
api_key = config.itad_api_key

base_url = "https://api.isthereanydeal.com/deals/v2"

# 다양한 필터 옵션 테스트
test_params = [
    {"key": api_key, "country": "KR", "limit": 50, "price": 0},
    {"key": api_key, "country": "KR", "limit": 50, "price:max": 0},
    {"key": api_key, "country": "KR", "limit": 50, "cut": 100},
    {"key": api_key, "country": "KR", "limit": 50, "filter": "price:0"},
    {"key": api_key, "country": "KR", "limit": 50, "nondeals": "true"},
]

for params in test_params:
    print(f"\n테스트: {params}")
    try:
        resp = requests.get(base_url, params=params, timeout=10)
        print(f"  상태: {resp.status_code}")
        if resp.status_code == 200:
            data = resp.json()
            deals = data.get("list", [])
            print(f"  결과: {len(deals)}개")
            # 무료 게임 있는지 확인
            free = [d for d in deals if d.get("deal", {}).get("cut") == 100]
            print(f"  100% 할인: {len(free)}개")
        else:
            print(f"  에러: {resp.text[:200]}")
    except Exception as e:
        print(f"  예외: {e}")
