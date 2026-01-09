#!/usr/bin/env python3
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from config import Config
from src.claimers.epic import EpicClaimer

config = Config()
data_dir = Path(__file__).parent / "data"

print("Epic 클레이머 테스트...")
print(f"headless 설정: {config.config.get('epic', {}).get('headless', False)}")

claimer = EpicClaimer(config.config, data_dir)

print("\n로그인 시도 중...")
try:
    result = claimer.login()
    print(f"로그인 결과: {result}")
except Exception as e:
    print(f"로그인 에러: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
