# IQ Test Online (`iqtestnow.org`)

Быстрый онлайн-тест интеллекта (7 вопросов, 2–3 минуты) с примерной оценкой диапазона IQ, двуязычным интерфейсом (RU / EN) и возможностью отправки результатов на email.

- **Сайт**: https://iqtestnow.org
- **EN**: https://iqtestnow.org/en/
- **RU**: https://iqtestnow.org/ru/

## Стек и архитектура

- **Фронтенд**: Ванильный HTML5, CSS3, JavaScript в `public/` (без тяжелых фреймворков).
- **Многоязычность**: Маршруты `/ru/` и `/en/`, файл `translations.js`.
- **API & Воркеры**: `functions/` для Cloudflare Pages / Workers (отправка результатов через Resend).
- **SEO & Аналитика**: `sitemap.xml`, `robots.txt`, верификация Search Console.

## Локальный запуск

```bash
cd c:\dev\iqtest
npx serve public
# или
python -m http.server 8000 --directory public
```

Открыть в браузере `http://localhost:8000`.

## Деплой

Проект разворачивается на **Cloudflare Pages**:
- **Build output directory**: `public`
- **Build command**: отсутствует (чистая статика)
- **Functions**: папка `functions/` подхватывается Cloudflare автоматически.
