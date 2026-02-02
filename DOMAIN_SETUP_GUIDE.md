# 🚀 Пошаговый план настройки домена

## ✅ Домен куплен! Что дальше?

---

## 📋 Шаг 1: Настроить домен в Cloudflare Pages

### 1.1 Добавить домен в Cloudflare Pages

1. Открой Cloudflare Dashboard: https://dash.cloudflare.com/
2. Выбери свой проект (IQ Test)
3. Перейди в **Pages → Custom domains**
4. Нажми **Add custom domain**
5. Введи свой домен: `iqtestnow.org` (или какой купил)
6. Подтверди добавление

### 1.2 Настроить DNS (если нужно)

**Если домен куплен через Cloudflare:**
- ✅ DNS настраивается автоматически
- ✅ SSL выдается автоматически
- ✅ Подожди 5-15 минут для активации

**Если домен куплен через другого регистратора:**
- Нужно изменить nameservers на Cloudflare
- Или добавить домен в Cloudflare DNS

### 1.3 Проверить SSL

1. Подожди 5-15 минут
2. Проверь что SSL активен (зеленый замочек)
3. Открой сайт: `https://iqtestnow.org` - должен открываться

---

## 🔧 Шаг 2: Обновить все ссылки в коде

### 2.1 Обновить sitemap.xml

**Файл:** `public/sitemap.xml`

Заменить все вхождения:
- `https://iqtest-1id.pages.dev` → `https://iqtestnow.org`

### 2.2 Обновить robots.txt

**Файл:** `public/robots.txt`

Заменить:
- `https://iqtest-1id.pages.dev` → `https://iqtestnow.org`

### 2.3 Обновить все HTML файлы

**Файлы для обновления:**
- `public/index.html`
- `public/ru/index.html`
- `public/en/index.html`
- `public/ru/full-tests.html`
- `public/en/full-tests.html`
- `public/ru/about-iq-tests.html`
- `public/en/about-iq-tests.html`
- `public/ru/faq.html`
- `public/en/faq.html`
- `public/ru/how-to-improve-iq.html`
- `public/en/how-to-improve-iq.html`

**Что заменить в каждом файле:**

1. **Canonical URL:**
   ```html
   <link rel="canonical" href="https://iqtestnow.org/ru/index.html">
   ```

2. **Open Graph URL:**
   ```html
   <meta property="og:url" content="https://iqtestnow.org/ru/index.html">
   ```

3. **Twitter Card URL:**
   ```html
   <meta name="twitter:url" content="https://iqtestnow.org/ru/index.html">
   ```

4. **Open Graph Image:**
   ```html
   <meta property="og:image" content="https://iqtestnow.org/assets/og-image-ru.jpg">
   ```

5. **Twitter Image:**
   ```html
   <meta name="twitter:image" content="https://iqtestnow.org/assets/twitter-image-ru.jpg">
   ```

6. **Schema.org URL:**
   ```json
   "url": "https://iqtestnow.org/ru/index.html"
   ```

### 2.4 Обновить script.js

**Файл:** `public/script.js`

Найти функцию `getShareUrl()` и обновить:
```javascript
// Заменить hardcoded URL если есть
const PRODUCTION_URL = 'https://iqtestnow.org';
```

---

## 🔍 Шаг 3: Обновить Google Search Console

### 3.1 Добавить новый домен

1. Открой Google Search Console: https://search.google.com/search-console
2. Нажми **Добавить ресурс**
3. Выбери **Префикс URL**
4. Введи: `https://iqtestnow.org`
5. Подтверди владение (через HTML файл или DNS)

### 3.2 Отправить новый sitemap

1. В Google Search Console → Sitemaps
2. Добавь новый sitemap: `https://iqtestnow.org/sitemap.xml`
3. Отправь на индексацию

### 3.3 Уведомить о смене адреса (если был старый домен)

1. Google Search Console → Настройки → Смена адреса
2. Укажи старый домен: `iqtest-1id.pages.dev`
3. Укажи новый домен: `iqtestnow.org`
4. Подтверди смену

---

## 🔄 Шаг 4: Настроить редиректы (опционально)

### Если хочешь чтобы старый домен перенаправлял на новый:

**В Cloudflare Pages:**
1. Pages → Custom domains
2. Добавь старый домен `iqtest-1id.pages.dev`
3. Настрой редирект на новый домен

**Или через Cloudflare Workers:**
- Создай Worker для редиректов
- Настрой 301 редирект со старого на новый

---

## ✅ Шаг 5: Проверка

### 5.1 Проверить что сайт открывается

- [ ] `https://iqtestnow.org` открывается
- [ ] `https://iqtestnow.org/ru/index.html` открывается
- [ ] `https://iqtestnow.org/en/index.html` открывается
- [ ] SSL работает (зеленый замочек)

### 5.2 Проверить ссылки

- [ ] Все внутренние ссылки работают
- [ ] Кнопки "Поделиться" используют новый домен
- [ ] Формы отправляются корректно

### 5.3 Проверить SEO

- [ ] Sitemap доступен: `https://iqtestnow.org/sitemap.xml`
- [ ] Robots.txt доступен: `https://iqtestnow.org/robots.txt`
- [ ] Meta tags обновлены
- [ ] Canonical URLs правильные

### 5.4 Проверить Google Search Console

- [ ] Домен добавлен
- [ ] Sitemap отправлен
- [ ] Страницы индексируются

---

## 🚨 Важно!

### После обновления кода:

1. **Сделай commit и push:**
   ```bash
   git add .
   git commit -m "Update domain to iqtestnow.org"
   git push
   ```

2. **Дождись деплоя:**
   - Cloudflare Pages автоматически задеплоит изменения
   - Обычно 1-2 минуты

3. **Проверь что всё работает:**
   - Открой сайт
   - Проверь консоль браузера (F12) - не должно быть ошибок
   - Проверь что все ссылки правильные

---

## 📝 Чеклист

- [ ] Домен добавлен в Cloudflare Pages
- [ ] SSL активен
- [ ] Sitemap.xml обновлен
- [ ] Robots.txt обновлен
- [ ] Все HTML файлы обновлены (canonical, OG, Twitter)
- [ ] Schema.org данные обновлены
- [ ] script.js обновлен (если нужно)
- [ ] Код закоммичен и запушен
- [ ] Деплой прошел успешно
- [ ] Сайт открывается на новом домене
- [ ] Google Search Console обновлен
- [ ] Новый sitemap отправлен
- [ ] Всё работает корректно

---

## 🎯 Следующие шаги

После настройки домена:

1. **Мониторинг:**
   - Следи за трафиком в Google Search Console
   - Проверяй что страницы индексируются
   - Мониторь ошибки в Cloudflare Analytics

2. **Оптимизация:**
   - Продолжай SEO оптимизацию
   - Добавляй контент
   - Улучшай позиции

3. **Email:**
   - Когда будет 5+ писем - настроить корпоративный email
   - См. `EMAIL_SETUP_PLAN.md`

---

**Готово!** Следуй этому плану и домен будет настроен! 🚀

