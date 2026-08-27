/**
 * Email helpers for the IQ Test Cloudflare Worker.
 * Pure functions so language, recipients, and Resend payloads can be unit-tested
 * without calling Resend or Cloudflare.
 */

export const DEFAULT_FROM = 'IQ Test <onboarding@resend.dev>';
export const SITE_ORIGIN = 'https://iqtestnow.org';
/** Gmail the operator uses TODAY to compose results until Resend domain is verified. */
export const OPERATOR_FROM = 'iqtestnoworg@gmail.com';
export const ALLOWED_SHARE_HOSTS = new Set([
  'iqtestnow.org',
  'www.iqtestnow.org',
  'iqtest.pages.dev'
]);

const IQ_LEVELS = {
  ru: {
    low: 'Ниже среднего',
    belowAverage: 'Немного ниже среднего',
    average: 'Средний уровень',
    aboveAverage: 'Выше среднего',
    high: 'Высокий уровень',
    veryHigh: 'Очень высокий уровень',
    exceptional: 'Исключительно высокий уровень'
  },
  en: {
    low: 'Below Average',
    belowAverage: 'Slightly Below Average',
    average: 'Average',
    aboveAverage: 'Above Average',
    high: 'High',
    veryHigh: 'Very High',
    exceptional: 'Exceptionally High'
  }
};

const COPY = {
  ru: {
    htmlLang: 'ru',
    subject: (iq) => `Результаты IQ теста — IQ ≈ ${iq}`,
    heading: '🧠 Результаты IQ теста',
    hello: (name) => `Привет, ${name}!`,
    intro: 'Ты прошел быстрый IQ тест и получил результат:',
    range: 'Диапазон',
    correct: 'Правильных ответов',
    of: 'из',
    shareCta: 'Поделись результатом с друзьями и сравните результаты!',
    shareButton: 'Открыть результат на сайте',
    moreHeading: 'Хочешь потренировать мозг?',
    improveButton: 'Как улучшить IQ',
    memoryButton: 'Тренировка памяти',
    homeButton: 'IQ Test Online',
    luck: 'Удачи в развитии интеллекта! 🧠',
    importantTitle: 'Важно:',
    important:
      'Это упрощенный тест для быстрой оценки. Для более точного определения IQ обычно используются более длительные тесты, проводимые сертифицированными специалистами.',
    ignore: 'Если ты не проходил тест, просто проигнорируй это сообщение.',
    disclaimer:
      'Данный онлайн IQ тест не является официальным или стандартизированным тестом IQ (таким как WAIS, Stanford-Binet, Raven). Результаты носят ознакомительный характер.',
    fallbackName: 'друг'
  },
  en: {
    htmlLang: 'en',
    subject: (iq) => `Your IQ test results — IQ ≈ ${iq}`,
    heading: '🧠 Your IQ test results',
    hello: (name) => `Hi, ${name}!`,
    intro: 'You completed the quick IQ test. Here is your result:',
    range: 'Range',
    correct: 'Correct answers',
    of: 'of',
    shareCta: 'Share your result with friends and compare scores!',
    shareButton: 'Open your result on the site',
    moreHeading: 'Want to train your mind?',
    improveButton: 'How to improve IQ',
    memoryButton: 'Memory training',
    homeButton: 'IQ Test Online',
    luck: 'Good luck training your mind! 🧠',
    importantTitle: 'Important:',
    important:
      'This is a simplified test for a quick estimate. A more accurate IQ score usually requires longer tests administered by certified specialists.',
    ignore: 'If you did not take this test, you can ignore this message.',
    disclaimer:
      'This online IQ test is not an official or standardized IQ test (such as WAIS, Stanford-Binet, or Raven). Results are for informational purposes only.',
    fallbackName: 'there'
  }
};

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function resolveLang(data) {
  const raw = String(data?.lang ?? data?.currentLang ?? data?.locale ?? '')
    .trim()
    .toLowerCase();
  return raw === 'en' ? 'en' : 'ru';
}

export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 3 || trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function normalizeEmail(email) {
  return String(email || '').trim();
}

export function iqLevelLabel(estimated, lang) {
  const labels = IQ_LEVELS[lang] || IQ_LEVELS.ru;
  const iq = Number(estimated);
  if (!Number.isFinite(iq)) return '';
  if (iq < 80) return labels.low;
  if (iq < 90) return labels.belowAverage;
  if (iq < 110) return labels.average;
  if (iq < 120) return labels.aboveAverage;
  if (iq < 130) return labels.high;
  if (iq < 140) return labels.veryHigh;
  return labels.exceptional;
}

export function sitePages(lang) {
  const locale = lang === 'en' ? 'en' : 'ru';
  const base = `${SITE_ORIGIN}/${locale}`;
  return {
    home: `${base}/`,
    test: `${base}/index.html`,
    howToImprove: `${base}/how-to-improve-iq.html`,
    memory: `${base}/memory-training.html`,
    about: `${base}/about-iq-tests.html`,
    faq: `${base}/faq.html`
  };
}

export function buildShareUrl(data, lang) {
  const locale = lang === 'en' ? 'en' : 'ru';
  const iq = data?.iqResult || {};
  const params = new URLSearchParams();

  const fromShare = {};
  const candidate = data?.shareUrl;
  if (candidate && typeof candidate === 'string') {
    try {
      const url = new URL(candidate);
      if ((url.protocol === 'https:' || url.protocol === 'http:') && ALLOWED_SHARE_HOSTS.has(url.hostname)) {
        url.searchParams.forEach((value, key) => {
          fromShare[key] = value;
        });
      }
    } catch {
      // ignore invalid share URLs
    }
  }

  const iqVal = iq.estimated ?? fromShare.iq;
  const minVal = iq.min ?? fromShare.min;
  const maxVal = iq.max ?? fromShare.max;
  const scoreVal = iq.score ?? fromShare.score;
  const totalVal = iq.total ?? fromShare.total;
  if (iqVal != null && iqVal !== '') params.set('iq', String(iqVal));
  if (minVal != null && minVal !== '') params.set('min', String(minVal));
  if (maxVal != null && maxVal !== '') params.set('max', String(maxVal));
  if (scoreVal != null && scoreVal !== '') params.set('score', String(scoreVal));
  if (totalVal != null && totalVal !== '') params.set('total', String(totalVal));

  const query = params.toString();
  return `${SITE_ORIGIN}/${locale}/index.html${query ? `?${query}` : ''}`;
}

export function buildFromAddress(env = {}) {
  const named = env.FROM_EMAIL || env.CORPORATE_EMAIL;
  if (!named) return DEFAULT_FROM;
  if (String(named).includes('<')) return named;
  const name = env.CORPORATE_NAME || env.FROM_NAME || 'IQ Test';
  return `${name} <${named}>`;
}

function emailStyles() {
  return `
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .result-box { background: linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%); border: 2px solid #667eea; border-radius: 15px; padding: 30px; margin: 30px 0; text-align: center; }
    .iq-value { font-size: 3em; font-weight: bold; color: #667eea; margin: 10px 0; }
    .iq-range { font-size: 1.2em; color: #666; margin: 10px 0; }
    .iq-level { font-size: 1.1em; color: #555; margin: 10px 0; font-weight: 500; }
    .share-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
    .info-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 0.9em; color: #856404; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.85em; color: #666; }
  `;
}

export function displayName(data, lang) {
  const t = COPY[lang] || COPY.ru;
  return (data?.name && String(data.name).trim()) || t.fallbackName;
}

function resultFields(data, lang) {
  const t = COPY[lang] || COPY.ru;
  const iq = data?.iqResult || {};
  const pages = sitePages(lang);
  const shareUrl = buildShareUrl(data, lang);
  const name = displayName(data, lang);
  return {
    t,
    iq,
    pages,
    shareUrl,
    name,
    level: iqLevelLabel(iq.estimated, lang),
    score: iq.score ?? 'N/A',
    total: iq.total ?? 'N/A',
    subject: t.subject(iq.estimated)
  };
}

export function buildResultsEmailText(data, lang = 'ru') {
  const { t, iq, pages, shareUrl, name, level, score, total, subject } = resultFields(data, lang);
  const lines = [
    t.hello(name),
    '',
    t.intro,
    '',
    `IQ ≈ ${iq.estimated}`,
    `${t.range}: ${iq.min} - ${iq.max}`,
    level,
    `${t.correct}: ${score} ${t.of} ${total}`,
    '',
    t.shareCta,
    shareUrl,
    '',
    t.moreHeading,
    `${t.homeButton}: ${pages.home}`,
    `${t.improveButton}: ${pages.howToImprove}`,
    `${t.memoryButton}: ${pages.memory}`,
    '',
    t.luck,
    '',
    `${t.importantTitle} ${t.important}`,
    t.disclaimer,
    t.ignore
  ];
  return { subject, text: lines.join('\n'), shareUrl, pages, name, level };
}

export function buildResultsEmail(data, lang = 'ru') {
  const { t, iq, pages, shareUrl, name, level, score, total, subject } = resultFields(data, lang);
  const safeName = escapeHtml(name);
  const safeShareUrl = escapeHtml(shareUrl);
  const safeHome = escapeHtml(pages.home);
  const safeImprove = escapeHtml(pages.howToImprove);
  const safeMemory = escapeHtml(pages.memory);

  const html = `<!DOCTYPE html>
<html lang="${t.htmlLang}">
<head>
  <meta charset="UTF-8">
  <style>${emailStyles()}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${escapeHtml(t.heading)}</h1>
    </div>
    <p>${t.hello(safeName)}</p>
    <p>${escapeHtml(t.intro)}</p>
    <div class="result-box">
      <div class="iq-value">≈ ${escapeHtml(iq.estimated)}</div>
      <div class="iq-range">${escapeHtml(t.range)}: ${escapeHtml(iq.min)} - ${escapeHtml(iq.max)}</div>
      <div class="iq-level">${escapeHtml(level)}</div>
      <p style="margin-top: 15px; color: #666;">${escapeHtml(t.correct)}: ${escapeHtml(score)} ${escapeHtml(t.of)} ${escapeHtml(total)}</p>
    </div>
    <p><strong>${escapeHtml(t.shareCta)}</strong></p>
    <p style="text-align: center;">
      <a href="${safeShareUrl}" class="share-button">${escapeHtml(t.shareButton)}</a>
    </p>
    <div class="info-box">
      <p><strong>${escapeHtml(t.importantTitle)}</strong> ${escapeHtml(t.important)}</p>
    </div>
    <hr style="margin: 30px 0;">
    <h2>${escapeHtml(t.moreHeading)}</h2>
    <p style="text-align: center;">
      <a href="${safeHome}" class="share-button">${escapeHtml(t.homeButton)}</a>
      <a href="${safeImprove}" class="share-button">${escapeHtml(t.improveButton)}</a>
      <a href="${safeMemory}" class="share-button">${escapeHtml(t.memoryButton)}</a>
    </p>
    <p>${escapeHtml(t.luck)}</p>
    <div class="footer">
      <p><strong>${lang === 'en' ? 'Disclaimer:' : 'Дисклеймер:'}</strong> ${escapeHtml(t.disclaimer)}</p>
      <p>${escapeHtml(t.ignore)}</p>
    </div>
  </div>
</body>
</html>`;

  return {
    lang,
    subject,
    html,
    text: buildResultsEmailText(data, lang).text,
    shareUrl,
    pages,
    level
  };
}

export function shouldSendResultsEmail(data) {
  return Boolean(
    (data?.type === 'send-results-only' || data?.sendResults) && data?.iqResult
  );
}

/**
 * Build the Resend JSON body for the user-facing results email.
 * Sends TO the address the user typed. Optional BCC to admin (skipped when
 * it would duplicate the To address).
 */
export function buildUserResultsResendBody(data, env = {}) {
  const lang = resolveLang(data);
  const email = buildResultsEmail(data, lang);
  const to = normalizeEmail(data.email);
  const admin = normalizeEmail(env.ADMIN_EMAIL);
  const body = {
    from: buildFromAddress(env),
    to: [to],
    reply_to: env.REPLY_TO || admin || to,
    subject: email.subject,
    html: email.html,
    text: email.text
  };
  if (admin && admin.toLowerCase() !== to.toLowerCase()) {
    body.bcc = [admin];
  }
  return { lang, email, body };
}

export function buildAdminEmail(data, { userEmailSent, userEmailError } = {}) {
  const lang = resolveLang(data);
  const iq = data?.iqResult;
  const results = iq ? buildResultsEmail(data, lang) : null;
  const typeLabel =
    data?.type === 'send-results-only'
      ? 'Отправка результатов на email'
      : data?.extendedTest || data?.kidsTest
        ? 'Регистрация на расширенные тесты'
        : 'Быстрый тест';

  const deliveryNote = data?.type === 'send-results-only'
    ? (userEmailSent
      ? `<p style="color:#0c5460;"><strong>Доставка:</strong> письмо с результатами отправлено напрямую на ${escapeHtml(data.email)} (язык: ${escapeHtml(lang)}). Пользователю ничего пересылать не нужно.</p>`
      : `<p style="color:#856404;"><strong>Доставка Resend не удалась:</strong> ${escapeHtml(userEmailError || 'неизвестная ошибка')}.</p>
         <p><strong>Сегодня:</strong> открой новое письмо (не Forward) FROM <code>${OPERATOR_FROM}</code> TO <code>${escapeHtml(data.email)}</code>. Тема и текст ниже уже заполнены. Инструкция: docs/SEND_RESULTS.md</p>`)
    : '';

  const composeBlock = results
    ? `<h3>Черновик для ${OPERATOR_FROM}</h3>
      <div class="data-box">
        <div class="data-row"><span class="data-label">From:</span> ${OPERATOR_FROM}</div>
        <div class="data-row"><span class="data-label">To:</span> ${escapeHtml(data.email)}</div>
        <div class="data-row"><span class="data-label">Lang:</span> ${escapeHtml(lang)}</div>
        <div class="data-row"><span class="data-label">Subject:</span> ${escapeHtml(results.subject)}</div>
        <div class="data-row"><span class="data-label">Share URL:</span> ${escapeHtml(results.shareUrl)}</div>
      </div>
      <pre style="white-space:pre-wrap;background:#fff;border:1px solid #ddd;padding:12px;border-radius:8px;">${escapeHtml(results.text)}</pre>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .data-box { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 15px 0; }
    .data-row { margin: 10px 0; }
    .data-label { font-weight: 600; color: #667eea; }
    .iq-result { background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h2>📧 ${escapeHtml(typeLabel)}</h2>
    ${deliveryNote}
    <div class="data-box">
      <div class="data-row"><span class="data-label">Имя:</span> ${escapeHtml(data?.name || 'Не указано')}</div>
      <div class="data-row"><span class="data-label">Email:</span> ${escapeHtml(data?.email)}</div>
      <div class="data-row"><span class="data-label">Язык письма:</span> ${escapeHtml(lang)}</div>
      <div class="data-row"><span class="data-label">Источник:</span> ${escapeHtml(data?.source || '')}</div>
      <div class="data-row"><span class="data-label">Тип:</span> ${escapeHtml(data?.type || '')}</div>
    </div>
    ${iq ? `
      <h3>Результат теста:</h3>
      <div class="iq-result">
        <div class="data-row"><span class="data-label">IQ:</span> ≈ ${escapeHtml(iq.estimated)}</div>
        <div class="data-row"><span class="data-label">Диапазон:</span> ${escapeHtml(iq.min)} - ${escapeHtml(iq.max)}</div>
        <div class="data-row"><span class="data-label">Правильных ответов:</span> ${escapeHtml(iq.score ?? 'N/A')} из ${escapeHtml(iq.total ?? 'N/A')}</div>
      </div>
    ` : ''}
    ${composeBlock}
    <div class="data-box">
      <div class="data-row"><span class="data-label">Время:</span> ${escapeHtml(new Date(data?.timestamp || Date.now()).toISOString())}</div>
    </div>
  </div>
</body>
</html>`;

  return {
    subject: `${typeLabel}: ${data?.name || 'Без имени'} (${data?.email})${iq ? ` — IQ ≈ ${iq.estimated}` : ''} [${lang}]`,
    html
  };
}

export function buildAdminResendBody(data, env = {}, delivery = {}) {
  const adminEmail = buildAdminEmail(data, delivery);
  const to = normalizeEmail(env.ADMIN_EMAIL);
  return {
    from: buildFromAddress(env),
    to: [to],
    reply_to: env.REPLY_TO || to,
    subject: adminEmail.subject,
    html: adminEmail.html
  };
}

export function resendDomainHint(fromAddress, resendMessage) {
  const from = String(fromAddress || '');
  const msg = String(resendMessage || '');
  const usesOnboarding = from.includes('resend.dev');
  const looksLikeSandbox =
    /only send testing emails to your own email/i.test(msg) ||
    /verify a domain/i.test(msg) ||
    usesOnboarding;
  if (!looksLikeSandbox) return null;
  return 'Resend will not deliver to arbitrary inboxes until a sending domain is verified. Add and verify iqtestnow.org (or a subdomain) at https://resend.com/domains, then set the Worker secret FROM_EMAIL to e.g. "IQ Test <noreply@iqtestnow.org>".';
}
