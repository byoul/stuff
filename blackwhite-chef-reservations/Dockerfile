FROM node:20-slim

# Puppeteer 의존성 설치
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Chromium 경로 확인 및 설정
RUN which chromium || which chromium-browser || echo "Chromium not found"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm ci

COPY server/ .

# Railway가 PORT 환경변수를 자동 설정함
EXPOSE 3001

CMD ["node", "index.js"]
