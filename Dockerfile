# ---------- этап 1: сборка статики ----------
FROM node:22-alpine AS build

WORKDIR /app

# зависимости ставим сначала из манифестов — так кэшируется,
# пока package.json не поменялся
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


# ---------- этап 2: отдача статики через nginx ----------
FROM nginx:1.27-alpine

# конфиг: SPA-фолбэк, gzip, кэш имён-ассетов
COPY nginx.conf /etc/nginx/conf.d/default.conf

# vite складывает собранный сайт в dist/ — отдаём его как корень
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx уже умеет стартовать сам — CMD в базовом образе не трогаем
