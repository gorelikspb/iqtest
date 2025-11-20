# Настройка Cloudflare Worker для отправки email

## Шаг 1: Создать Cloudflare Worker

1. Открой: https://dash.cloudflare.com/
2. В левом меню выбери **Workers & Pages**
3. Нажми **Create application** → **Create Worker**
4. Название: `iqtest-email` (или любое другое)
5. Нажми **Deploy**

## Шаг 2: Добавить Secrets

1. В Worker нажми **Settings** → **Variables**
2. В разделе **Environment Variables** → **Add variable**
3. Добавь два Secrets:

   **Secret 1:**
   - Name: `RESEND_API_KEY`
   - Value: `re_EXpNX9RS_5ad8xQ2yn3ihD26Dtk8JmDJH`
   - Type: **Secret** (важно!)

   **Secret 2:**
   - Name: `ADMIN_EMAIL`
   - Value: `gorelikgo@gmail.com`
   - Type: **Secret** (важно!)

4. Нажми **Save**

## Шаг 3: Вставить код Worker

1. В Worker нажми **Edit code**
2. Удали весь код по умолчанию
3. Скопируй код из файла `worker-email.js` в этом репозитории
4. Вставь в редактор Worker
5. Нажми **Save and deploy**

## Шаг 4: Скопировать URL Worker

1. После деплоя скопируй URL Worker
2. URL будет выглядеть так: `https://iqtest-email.your-subdomain.workers.dev`
3. Обнови `WORKER_URL` в файлах:
   - `script.js` (строка с `const WORKER_URL = ...`)
   - `full-tests.js` (строка с `const WORKER_URL = ...`)

## Шаг 5: Проверить работу

1. Открой сайт с тестом
2. Пройди тест и заполни форму
3. Проверь email `gorelikgo@gmail.com` - должно прийти письмо с данными

## Важно: Тестовый режим Resend

**Ограничение:** Resend в тестовом режиме отправляет письма только на `gorelikgo@gmail.com`.

**Что происходит:**
- Пользователь заполняет форму
- Видит сообщение об успехе
- На `gorelikgo@gmail.com` приходит письмо с данными пользователя
- Если `sendResults = true`, в письме будут результаты теста

**Для продакшена:**
- Нужно верифицировать домен в Resend
- Изменить `to: env.ADMIN_EMAIL` на `to: data.email` в Worker (для пользовательских писем)
- Изменить `from` на свой домен

## Диагностика

### Письма не приходят
1. Проверь консоль браузера (F12) — есть ли ошибки?
2. Проверь логи Worker в Cloudflare Dashboard → Logs
3. Проверь Resend Dashboard → Emails — есть ли попытки отправки?
4. Проверь Secrets в Worker (Settings → Variables)

### CORS ошибка
- Убедись, что в Worker есть обработка OPTIONS запроса
- Проверь заголовки CORS в Worker

### 500 ошибка
- Проверь логи Worker
- Убедись, что Secrets добавлены правильно
- Проверь синтаксис кода Worker

