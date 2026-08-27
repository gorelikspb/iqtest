# Send IQ results to a user (today)

Until Resend can deliver from a verified `iqtestnow.org` domain, compose **one new message** from Gmail. Do not forward the admin notification, and do not bounce the letter through extra mailboxes.

## 1. Read the inbound notification

From the Worker / admin mail, copy:

- **name**
- **email** (this is To)
- **lang** (`en` or `ru` — same as the page they used)
- **IQ** estimate, **min**, **max**
- **share URL** if present

If `lang` is missing, use `en` when they came from `/en/`, otherwise `ru`.

If share URL is missing, build:

`https://iqtestnow.org/{lang}/index.html?iq={iq}&min={min}&max={max}`

## 2. Compose from iqtestnoworg@gmail.com

In Gmail, signed in as (or “Send mail as”) **iqtestnoworg@gmail.com**:

1. **New message** (not Forward, not Reply-all).
2. **From:** `iqtestnoworg@gmail.com`
3. **To:** the address they typed
4. **Subject + body:** paste the matching template below and replace `{name}`, `{iq}`, `{min}`, `{max}`, `{shareUrl}`.

Send. That is the whole chain.

When Resend + `FROM_EMAIL` work, stop doing this; the Worker will send the same copy to the user.

---

## English template (`lang = en`)

**Subject:** `Your IQ test results — IQ ≈ {iq}`

```
Hi, {name}!

You completed the quick IQ test. Here is your result:

IQ ≈ {iq}
Range: {min} - {max}

Share your result with friends and compare scores!
{shareUrl}

Want to train your mind?
IQ Test Online: https://iqtestnow.org/en/
How to improve IQ: https://iqtestnow.org/en/how-to-improve-iq.html
Memory training: https://iqtestnow.org/en/memory-training.html

Good luck training your mind!

Important: This is a simplified test for a quick estimate. A more accurate IQ score usually requires longer tests administered by certified specialists.

This online IQ test is not an official or standardized IQ test (such as WAIS, Stanford-Binet, or Raven). Results are for informational purposes only.

If you did not take this test, you can ignore this message.
```

---

## Russian template (`lang = ru`)

**Subject:** `Результаты IQ теста — IQ ≈ {iq}`

```
Привет, {name}!

Ты прошел быстрый IQ тест и получил результат:

IQ ≈ {iq}
Диапазон: {min} - {max}

Поделись результатом с друзьями и сравните результаты!
{shareUrl}

Хочешь потренировать мозг?
IQ Test Online: https://iqtestnow.org/ru/
Как улучшить IQ: https://iqtestnow.org/ru/how-to-improve-iq.html
Тренировка памяти: https://iqtestnow.org/ru/memory-training.html

Удачи в развитии интеллекта!

Важно: Это упрощенный тест для быстрой оценки. Для более точного определения IQ обычно используются более длительные тесты, проводимые сертифицированными специалистами.

Данный онлайн IQ тест не является официальным или стандартизированным тестом IQ (таким как WAIS, Stanford-Binet, Raven). Результаты носят ознакомительный характер.

Если ты не проходил тест, просто проигнорируй это сообщение.
```

Do not add extra-test / “full test” links. Those were removed from the results letter on purpose (the old URL was dead). Link only `/en/` or `/ru/` pages that exist.
