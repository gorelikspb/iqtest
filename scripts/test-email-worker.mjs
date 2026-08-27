/**
 * Offline tests for localized IQ results emails.
 * Does not call Resend or Cloudflare. Run: node scripts/test-email-worker.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  resolveLang,
  iqLevelLabel,
  buildShareUrl,
  buildFromAddress,
  buildResultsEmail,
  buildResultsEmailText,
  buildUserResultsResendBody,
  buildAdminResendBody,
  shouldSendResultsEmail,
  isValidEmail,
  resendDomainHint,
  sitePages,
  DEFAULT_FROM,
  OPERATOR_FROM
} from '../functions/_lib/email.js';

import worker from '../functions/api/worker.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`  ❌ ${name}`);
    console.error(`     ${error.message}`);
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`  ❌ ${name}`);
    console.error(`     ${error.message}`);
  }
}

const sample = {
  type: 'send-results-only',
  name: 'Ann <script>',
  email: 'ann@example.com',
  lang: 'en',
  iqResult: { estimated: 120, min: 100, max: 140, score: 5, total: 7 },
  shareUrl: 'https://iqtestnow.org/en/index.html?iq=120&min=100&max=140',
  source: 'result-page',
  timestamp: '2026-08-27T12:00:00.000Z'
};

console.log('\nLocale + templates');
test('en from lang', () => assert.equal(resolveLang({ lang: 'EN' }), 'en'));
test('ru default when lang missing', () => assert.equal(resolveLang({}), 'ru'));
test('currentLang alias', () => assert.equal(resolveLang({ currentLang: 'en' }), 'en'));
test('unknown lang falls back to ru', () => assert.equal(resolveLang({ lang: 'de' }), 'ru'));
test('EN IQ level matches site copy', () => {
  assert.equal(iqLevelLabel(115, 'en'), 'Above Average');
  assert.equal(iqLevelLabel(120, 'en'), 'High');
  assert.equal(iqLevelLabel(75, 'en'), 'Below Average');
  assert.equal(iqLevelLabel(145, 'en'), 'Exceptionally High');
});
test('RU IQ level matches site copy', () => {
  assert.equal(iqLevelLabel(115, 'ru'), 'Выше среднего');
  assert.equal(iqLevelLabel(120, 'ru'), 'Высокий уровень');
  assert.equal(iqLevelLabel(75, 'ru'), 'Ниже среднего');
});
test('English results email has no Russian body copy', () => {
  const email = buildResultsEmail(sample, 'en');
  assert.match(email.subject, /Your IQ test results/);
  assert.match(email.html, /lang="en"/);
  assert.match(email.html, /You completed the quick IQ test/);
  assert.match(email.html, /High/);
  assert.doesNotMatch(email.html, /Привет/);
  assert.doesNotMatch(email.html, /Результаты IQ теста/);
  assert.doesNotMatch(email.html, /Диапазон/);
  assert.doesNotMatch(email.subject, /Результаты/);
});
test('Russian results email has no English body copy', () => {
  const email = buildResultsEmail({ ...sample, lang: 'ru', name: 'Анна' }, 'ru');
  assert.match(email.subject, /Результаты IQ теста/);
  assert.match(email.html, /lang="ru"/);
  assert.match(email.html, /Привет/);
  assert.match(email.html, /Диапазон/);
  assert.doesNotMatch(email.html, /You completed the quick IQ test/);
  assert.doesNotMatch(email.subject, /Your IQ test results/);
});
test('HTML in the name is escaped', () => {
  const email = buildResultsEmail(sample, 'en');
  assert.match(email.html, /Ann &lt;script&gt;/);
  assert.doesNotMatch(email.html, /Ann <script>/);
});
function hrefs(html) {
  return [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
}

test('share URL is forced onto the locale path even if the payload had /ru/', () => {
  const fromRu = buildShareUrl({
    ...sample,
    shareUrl: 'https://iqtestnow.org/ru/index.html?iq=120&min=100&max=140'
  }, 'en');
  assert.equal(fromRu, 'https://iqtestnow.org/en/index.html?iq=120&min=100&max=140&score=5&total=7');
  const ok = buildShareUrl(sample, 'en');
  assert.match(ok, /^https:\/\/iqtestnow\.org\/en\/index\.html\?/);
  assert.match(ok, /iq=120/);
  assert.match(ok, /min=100/);
  assert.match(ok, /max=140/);
  const evil = buildShareUrl({ ...sample, shareUrl: 'https://evil.example/phish' }, 'en');
  assert.match(evil, /^https:\/\/iqtestnow\.org\/en\/index\.html/);
  const js = buildShareUrl({ ...sample, shareUrl: 'javascript:alert(1)' }, 'ru');
  assert.match(js, /^https:\/\/iqtestnow\.org\/ru\/index\.html/);
});
test('EN mail links are only iqtestnow.org/en and include IQ numbers', () => {
  const email = buildResultsEmail(sample, 'en');
  const links = hrefs(email.html);
  assert.ok(links.length >= 4);
  for (const href of links) {
    assert.match(href, /^https:\/\/iqtestnow\.org\/en\//);
    assert.doesNotMatch(href, /\/ru\//);
    assert.doesNotMatch(href, /full-tests/);
    assert.doesNotMatch(href, /workers\.dev/);
  }
  assert.ok(links.some((href) => href.includes('/en/index.html?iq=120')));
  assert.ok(links.includes(sitePages('en').home));
  assert.ok(links.includes(sitePages('en').howToImprove));
  assert.ok(links.includes(sitePages('en').memory));
  assert.match(email.html, /≈ 120/);
  assert.match(email.html, /100 - 140/);
  assert.match(email.html, /5 of 7/);
  assert.doesNotMatch(email.html, /preparing extended/);
  assert.doesNotMatch(email.html, /full-tests/);
  assert.doesNotMatch(email.text, /\/ru\//);
});
test('RU mail links are only iqtestnow.org/ru', () => {
  const email = buildResultsEmail({ ...sample, lang: 'ru', name: 'Анна' }, 'ru');
  const links = hrefs(email.html);
  for (const href of links) {
    assert.match(href, /^https:\/\/iqtestnow\.org\/ru\//);
    assert.doesNotMatch(href, /\/en\//);
    assert.doesNotMatch(href, /full-tests/);
  }
  assert.ok(links.includes(sitePages('ru').howToImprove));
  assert.doesNotMatch(email.html, /You completed the quick IQ test/);
});
test('plain-text template has the operator fields', () => {
  const { text, subject } = buildResultsEmailText(sample, 'en');
  assert.match(subject, /IQ ≈ 120/);
  assert.match(text, /Hi, Ann <script>!/);
  assert.match(text, /IQ ≈ 120/);
  assert.match(text, /Range: 100 - 140/);
  assert.match(text, /https:\/\/iqtestnow\.org\/en\/index\.html\?iq=120/);
  assert.match(text, /https:\/\/iqtestnow\.org\/en\/how-to-improve-iq\.html/);
});
test('operator how-to exists and uses direct compose, not a forward chain', () => {
  const doc = fs.readFileSync(path.join(root, 'docs/SEND_RESULTS.md'), 'utf8');
  assert.match(doc, /iqtestnoworg@gmail\.com/);
  assert.match(doc, /Your IQ test results — IQ ≈ \{iq\}/);
  assert.match(doc, /Результаты IQ теста — IQ ≈ \{iq\}/);
  assert.match(doc, /\{shareUrl\}/);
  assert.match(doc, /https:\/\/iqtestnow\.org\/en\/how-to-improve-iq\.html/);
  assert.match(doc, /https:\/\/iqtestnow\.org\/ru\/how-to-improve-iq\.html/);
  assert.match(doc, /New message/);
  assert.doesNotMatch(doc, /triple-forward/i);
  assert.doesNotMatch(doc, /full-tests\.html/);
});

console.log('\nRecipients (direct-to-user, no forward chain)');
test('results email To is the user address', () => {
  const { body } = buildUserResultsResendBody(sample, {
    ADMIN_EMAIL: 'admin@example.com',
    FROM_EMAIL: 'IQ Test <noreply@iqtestnow.org>'
  });
  assert.deepEqual(body.to, ['ann@example.com']);
  assert.deepEqual(body.bcc, ['admin@example.com']);
  assert.equal(body.from, 'IQ Test <noreply@iqtestnow.org>');
  assert.doesNotMatch(body.subject, /\[TEST for/);
});
test('BCC is omitted when admin is the same as the user', () => {
  const { body } = buildUserResultsResendBody(sample, { ADMIN_EMAIL: 'ann@example.com' });
  assert.equal(body.bcc, undefined);
});
test('default from stays onboarding until FROM_EMAIL is set', () => {
  assert.equal(buildFromAddress({}), DEFAULT_FROM);
});
test('shouldSendResultsEmail only for results requests', () => {
  assert.equal(shouldSendResultsEmail(sample), true);
  assert.equal(shouldSendResultsEmail({ type: 'iq-test', email: 'a@b.co' }), false);
});
test('admin copy tells the operator to compose from Gmail, not forward', () => {
  const admin = buildAdminResendBody(sample, { ADMIN_EMAIL: 'admin@example.com' }, {
    userEmailSent: false,
    userEmailError: 'sandbox'
  });
  assert.doesNotMatch(admin.html, /НУЖНО ОТПРАВИТЬ ВРУЧНУЮ/);
  assert.doesNotMatch(admin.subject, /ВРУЧНУЮ/);
  assert.match(admin.html, /Язык письма:/);
  assert.ok(admin.html.includes(OPERATOR_FROM));
  assert.match(admin.html, /не Forward/);
  assert.match(admin.html, /docs\/SEND_RESULTS.md/);
  assert.match(admin.html, /Your IQ test results/);
});
test('sandbox hint points at Resend domains dashboard', () => {
  const hint = resendDomainHint(
    DEFAULT_FROM,
    'You can only send testing emails to your own email address'
  );
  assert.match(hint, /resend.com\/domains/);
  assert.match(hint, /FROM_EMAIL/);
});
test('email validation', () => {
  assert.equal(isValidEmail('ann@example.com'), true);
  assert.equal(isValidEmail('not-an-email'), false);
  assert.equal(isValidEmail(''), false);
});

console.log('\nFrontend payloads include lang');
test('script.js send-results and other forms pass lang', () => {
  const src = fs.readFileSync(path.join(root, 'public/script.js'), 'utf8');
  assert.match(src, /function getEmailLang\(/);
  const sendIdx = src.indexOf("type: 'send-results-only'");
  const resultFormIdx = src.indexOf("type: 'iq-test'");
  const startFormIdx = src.indexOf("source: 'start-page'");
  assert.ok(sendIdx > 0 && src.slice(sendIdx, sendIdx + 250).includes('lang: getEmailLang()'));
  assert.ok(resultFormIdx > 0 && src.slice(resultFormIdx, resultFormIdx + 250).includes('lang: getEmailLang()'));
  assert.ok(startFormIdx > 0 && src.slice(startFormIdx - 200, startFormIdx).includes('lang: getEmailLang()'));
});
test('full-tests.js passes lang from the URL', () => {
  const src = fs.readFileSync(path.join(root, 'public/full-tests.js'), 'utf8');
  assert.match(src, /function getEmailLang\(/);
  assert.match(src, /lang: getEmailLang\(\)/);
  assert.match(src, /path\.includes\('\/en\/'\)/);
});
test('worker no longer hard-codes admin as the results To', () => {
  const src = fs.readFileSync(path.join(root, 'functions/api/worker.js'), 'utf8');
  assert.doesNotMatch(src, /to:\s*env\.ADMIN_EMAIL/);
  assert.doesNotMatch(src, /ТЕСТОВЫЙ РЕЖИМ/);
  assert.match(src, /buildUserResultsResendBody/);
});
test('legacy worker-email.js has no secrets in source', () => {
  const src = fs.readFileSync(path.join(root, 'functions/api/worker-email.js'), 'utf8');
  assert.doesNotMatch(src, /re_[A-Za-z0-9]/);
  assert.doesNotMatch(src, /RESEND_API_KEY\s*=/);
});

console.log('\nWorker handler (mocked Resend)');
const originalFetch = globalThis.fetch;

await testAsync('EN payload posts To user with English subject', async () => {
  const sent = [];
  globalThis.fetch = async (url, opts) => {
    sent.push({ url, body: JSON.parse(opts.body) });
    return new Response(JSON.stringify({ id: 'msg_en' }), { status: 200 });
  };
  const req = new Request('https://iqtestemails.gorelikgo.workers.dev/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sample)
  });
  const res = await worker.fetch(req, {
    RESEND_API_KEY: 're_test',
    ADMIN_EMAIL: 'admin@example.com',
    FROM_EMAIL: 'IQ Test <noreply@iqtestnow.org>'
  });
  const json = await res.json();
  assert.equal(res.status, 200);
  assert.equal(json.success, true);
  assert.equal(json.lang, 'en');
  assert.equal(json.deliveredTo, 'ann@example.com');
  const userMail = sent[0].body;
  assert.deepEqual(userMail.to, ['ann@example.com']);
  assert.deepEqual(userMail.bcc, ['admin@example.com']);
  assert.match(userMail.subject, /Your IQ test results/);
  assert.match(userMail.html, /You completed the quick IQ test/);
  assert.equal(userMail.from, 'IQ Test <noreply@iqtestnow.org>');
});

await testAsync('RU payload posts Russian results to the user', async () => {
  const sent = [];
  globalThis.fetch = async (url, opts) => {
    sent.push({ url, body: JSON.parse(opts.body) });
    return new Response(JSON.stringify({ id: 'msg_ru' }), { status: 200 });
  };
  const req = new Request('https://iqtestemails.gorelikgo.workers.dev/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...sample, lang: 'ru', name: 'Анна' })
  });
  const res = await worker.fetch(req, {
    RESEND_API_KEY: 're_test',
    ADMIN_EMAIL: 'admin@example.com',
    FROM_EMAIL: 'IQ Test <noreply@iqtestnow.org>'
  });
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.lang, 'ru');
  assert.match(sent[0].body.subject, /Результаты IQ теста/);
  assert.match(sent[0].body.html, /Привет/);
  assert.deepEqual(sent[0].body.to, ['ann@example.com']);
});

await testAsync('Resend sandbox 403 is returned instead of fake success', async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    if (calls === 1) {
      return new Response(
        JSON.stringify({
          message: 'You can only send testing emails to your own email address (owner@example.com).'
        }),
        { status: 403 }
      );
    }
    return new Response(JSON.stringify({ id: 'msg_admin' }), { status: 200 });
  };
  const req = new Request('https://iqtestemails.gorelikgo.workers.dev/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sample)
  });
  const res = await worker.fetch(req, {
    RESEND_API_KEY: 're_test',
    ADMIN_EMAIL: 'admin@example.com'
  });
  const json = await res.json();
  assert.equal(res.status, 502);
  assert.equal(json.success, false);
  assert.match(json.hint || '', /resend.com\/domains/);
});

await testAsync('invalid email is rejected before Resend', async () => {
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response('{}', { status: 200 });
  };
  const req = new Request('https://iqtestemails.gorelikgo.workers.dev/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...sample, email: 'nope' })
  });
  const res = await worker.fetch(req, {
    RESEND_API_KEY: 're_test',
    ADMIN_EMAIL: 'admin@example.com'
  });
  assert.equal(res.status, 400);
  assert.equal(called, false);
});

globalThis.fetch = originalFetch;

if (failed) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}
console.log('\nAll email tests passed.');
