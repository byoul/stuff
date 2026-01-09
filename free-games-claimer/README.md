# Free Games Auto Claimer

IsThereAnyDeal에서 100% 할인 게임을 찾아 자동으로 클레임하는 도구입니다.

## 실행 방법

### 1. 의존성 설치

```bash
pip install -r requirements.txt
playwright install
```

### 2. 설정

`config.example.json`을 참고하여 `config.json` 파일을 설정합니다.

### 3. 실행

```bash
python main.py
```

실제 클레임 없이 테스트만 하려면:

```bash
python main.py --dry-run
```
