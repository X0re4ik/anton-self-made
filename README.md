# Мочалов Антон

Личный сайт: технологии. ум. стиль.
Сделан по мотивам [Build in Amsterdam](https://www.buildinamsterdam.com/) — большие типографика,
мотивы прелоадера-шторки, кастомный курсор, marquee-строки, reveal-анимации при скролле.

**Стек:** Vue 3 + Vite, никаких лишних зависимостей — анимации написаны руками.

## Запуск

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # продакшн-сборка → dist/
npm run preview  # локальный просмотр сборки
```

## Deploy (Docker + nginx)

В проекте есть двухэтапный `Dockerfile`: первый этап собирает статику (Node + Vite),
второй отдаёт её через nginx (`nginx.conf` внутри — SPA-фолбэк, gzip, кэш).

### Сборка и запуск

```bash
# собрать образ (из корня проекта)
docker build -t anton-self-made .

# запустить на 80-м порту
docker run --rm -d --name anton-self-made -p 80:80 anton-self-made
# или на другом порту, например 8080
docker run --rm -d --name anton-self-made -p 8080:80 anton-self-made
```

Проверка: `curl http://localhost:8080/` → `200`, любой путь
(например `http://localhost:8080/#road`) открывает тот же сайт.

Полезные команды:

```bash
docker ps                                 # что сейчас запущено
docker stop anton-self-made               # остановить
docker logs anton-self-made               # логи nginx
docker image rm anton-self-made           # удалить образ
```

### Пересборка после правок

```bash
docker build -t anton-self-made . && docker run --rm -d --name anton-self-made -p 80:80 anton-self-made
```

### Раскладка на сервер (VPS)

1. Залей проект на сервер (git clone или `scp -r`).
2. Убедись, что установлены docker и docker compose (`docker --version`).
3. Собери и запусти: `docker build -t anton-self-made . && docker run -d --name anton-self-made --restart unless-stopped -p 80:80 anton-self-made`.
   - `--restart unless-stopped` — контейнер сам поднимется после перезагрузки сервера.
4. Если нужен домен — проксируй nginx'ом-фронтдом (Certbot/cloudflare) на порт 80 контейнера.

Открытые порты настраиваются флагом `-p <порт-снаружи>:80`; менять `nginx.conf`
нужно только если добавляются свои правила (HTTPS, домен и т.п.).


## Структура

```
src/
├── App.vue                     # сборка: лоадер, курсор, секции
├── main.js                     # точка входа, регистрация v-reveal
├── styles/base.css             # палитра, типографика, утилиты reveal
├── directives/reveal.js        # IntersectionObserver-анимации
├── data/site.js                # ВЕСЬ контент: дорога, достижения, контакты
├── public/
│   ├── anton.svg               # твоё фото на hero (замени на своё)
│   ├── cv.pdf                  # резюме (замени на своё)
│   └── roadmap/                # картинки дорожной карты (год-номер.jpg)
└── components/
    ├── TheLoader.vue           # шторка-прелоадер со счётчиком
    ├── CursorFX.vue            # кастомный курсор (точка + кольцо)
    ├── SiteHeader.vue          # фиксированная шапка + часы
    ├── HeroSection.vue         # «МОЧАЛОВ АНТОН*» + портрет + робот
    ├── RobotScene.vue          # фоновый робот (анимация pick & place)
    ├── ManifestoSection.vue    # тёмный блок «Технологии / Ум / Стиль»
    ├── RoadmapSection.vue      # ДОРОГА: годы, события, фото-ленты
    └── SiteFooter.vue          # «Связь»: Telegram / GitHub / CV / Email
```

## Как пополнять «Дорогу» (дорожную карту)

Секция показывает твою жизнь: год слева липнет при прокрутке, справа — события года,
каждое с фото-лентой (листается вбок) и описанием. Нить по центру заливается
оранжевым по мере чтения,_active год перекрашивается из контура в заливку.

1. Кинь фото в `public/roadmap/`, например `2026-summer-1.jpg`
2. Открой `src/data/site.js`, найди `roadmap` и добавь событие:

```js
{
  date: 'Октябрь',
  title: 'Название события',
  text: 'Короткое описание.',
  images: [
    { src: '/roadmap/2026-summer-1.jpg', caption: 'Что на фото' },
    { src: '/roadmap/2026-summer-2.jpg', caption: 'Ещё фото' },
  ],
}
```

- Новый год = новый блок `{ year, title, entries }` в массиве (порядок = порядок на сайте);
- `images` может быть пустым или отсутствовать — тогда событие будет просто текстом;
- год уже есть — просто добавь объект в его `entries`;
 - текущие SVG-заглушки («МЕСТО ДЛЯ ФОТО») лежат в `public/roadmap/` — удаляй и заменяй своими файлами.

## Как менять контент

Правь только `src/data/site.js`: дорога (`roadmap`),
контакты (`sources`), фото (`photo`), навыки (`skills`).
Разметка компонентов трогать не нужна.

## Персонализация под Антона

- `public/anton.svg` — замени на своё фото (jpg/png) и поправь `photo` в `site.js`;
- `public/cv.pdf` — замени на своё резюме;
- `src/data/site.js` → `sources` — ссылки на Telegram, GitHub и другие источники;
- `src/components/ManifestoSection.vue` — тексты трёх опор;
- палитра и акцент — CSS-переменные `--accent`, `--bg`, `--ink` в `src/styles/base.css`.
