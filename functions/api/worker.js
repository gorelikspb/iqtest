// Cloudflare Worker: IQ Test results email via Resend
// Live URL: https://iqtestemails.gorelikgo.workers.dev/
// Deploy: `npx wrangler deploy` from the repo root (see wrangler.toml).
//
// Secrets (wrangler secret put / Cloudflare Dashboard → Worker → Settings → Variables):
//   RESEND_API_KEY   required
//   ADMIN_EMAIL      required (operator copy / BCC)
//   FROM_EMAIL       optional until domain verified; then e.g. "IQ Test <noreply@iqtestnow.org>"
//   CORPORATE_EMAIL  optional alias for FROM_EMAIL
//   CORPORATE_NAME   optional sender name
//   REPLY_TO         optional

import {
  isValidEmail,
  normalizeEmail,
  resolveLang,
  shouldSendResultsEmail,
  buildUserResultsResendBody,
  buildAdminResendBody,
  resendDomainHint,
  buildChallengeNotificationResendBody
} from '../_lib/email.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

async function sendResend(env, payload) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  let result = null;
  try {
    result = await response.json();
  } catch {
    result = { message: `Resend HTTP ${response.status}` };
  }
  return { ok: response.ok, status: response.status, result };
}

async function sendTelegramLeadAlert(env, data) {
  const token = env?.TELEGRAM_BOT_TOKEN;
  const chatId = env?.TELEGRAM_CHAT_ID || '127226331';
  if (!token) return;
  try {
    const iq = data?.iqResult;
    const iqLine = iq ? `\n🧠 *IQ / Score:* ≈ ${iq.estimated} (${iq.score ?? ''}/${iq.total ?? ''})` : '';
    const text = `🔔 *IQTestNow Lead*\n👤 *Имя:* ${data?.name || '—'}\n📧 *Email:* ${data?.email || '—'}\n🌐 *Lang:* ${data?.lang || 'ru'}\n📍 *Source:* ${data?.source || data?.type || '—'}${iqLine}`;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    });
  } catch (err) {
    console.error('Telegram alert error:', err);
  }
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'GET') {
      return new Response('IQ Test Email Worker is running!', {
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    try {
      const data = await request.json();

      if (data?.type === 'create-challenge') {
        const id = crypto.randomUUID().replace(/-/g, '').slice(0, 8);
        const lang = resolveLang(data);
        const creatorEmail = normalizeEmail(data?.creator_email);
        if (env?.DB) {
          try {
            await env.DB.prepare(
              `INSERT INTO challenges (id, creator_name, creator_email, creator_iq, creator_test_type, lang) VALUES (?, ?, ?, ?, ?, ?)`
            ).bind(
              id,
              data?.creator_name ? String(data.creator_name).slice(0, 120) : null,
              isValidEmail(creatorEmail) ? creatorEmail : null,
              Number.isFinite(Number(data?.creator_iq)) ? Number(data.creator_iq) : null,
              data?.creator_test_type === 'extended' ? 'extended' : 'quick',
              lang
            ).run();
          } catch (err) {
            console.error('Challenge create error:', err);
          }
        }
        return jsonResponse({ success: true, challengeId: id });
      }

      if (data?.type === 'complete-challenge') {
        let notified = false;
        const cid = String(data?.challengeId || '').trim();
        if (cid && env?.DB && env?.RESEND_API_KEY) {
          try {
            const challenge = await env.DB.prepare('SELECT * FROM challenges WHERE id = ?').bind(cid).first();
            const cEmail = normalizeEmail(challenge?.creator_email);
            const fEmail = normalizeEmail(data?.challengerEmail);
            if (challenge && isValidEmail(cEmail) && cEmail.toLowerCase() !== fEmail.toLowerCase()) {
              const { body } = buildChallengeNotificationResendBody(challenge, data, env);
              const sent = await sendResend(env, body);
              notified = Boolean(sent?.ok);
            }
          } catch (err) {
            console.error('Challenge notify error:', err);
          }
        }
        return jsonResponse({ success: true, notified });
      }

      const email = normalizeEmail(data?.email);
      if (!isValidEmail(email)) {
        return jsonResponse({ success: false, error: 'Valid email is required' }, 400);
      }
      data.email = email;
      data.lang = resolveLang(data);

      // Optional Honeypot check (from c:/dev/common pattern)
      if (data?.company) {
        return jsonResponse({ success: true, spam: true });
      }

      // Optional Telegram Lead Alert (@altergorbot) if TELEGRAM_BOT_TOKEN is configured
      await sendTelegramLeadAlert(env, data);

      // Persist lead to Cloudflare D1 if bound
      if (env?.DB) {
        try {
          const iq = data?.iqResult || {};
          await env.DB.prepare(
            `INSERT INTO leads (
              email, name, lang, type, source,
              iq_estimated, iq_min, iq_max, score, total,
              extended_test, kids_test, newsletter,
              traffic_source, ai_referrer
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            email,
            data?.name ? String(data.name).slice(0, 120) : null,
            data.lang,
            data?.type ? String(data.type).slice(0, 64) : null,
            data?.source ? String(data.source).slice(0, 64) : null,
            Number.isFinite(Number(iq.estimated)) ? Number(iq.estimated) : null,
            Number.isFinite(Number(iq.min)) ? Number(iq.min) : null,
            Number.isFinite(Number(iq.max)) ? Number(iq.max) : null,
            Number.isFinite(Number(iq.score)) ? Number(iq.score) : null,
            Number.isFinite(Number(iq.total)) ? Number(iq.total) : null,
            data?.extendedTest ? 1 : 0,
            data?.kidsTest ? 1 : 0,
            data?.newsletter ? 1 : 0,
            data?.traffic_source ? String(data.traffic_source).slice(0, 32) : null,
            data?.ai_referrer ? String(data.ai_referrer).slice(0, 32) : null
          ).run();
        } catch (dbErr) {
          console.error('D1 insert error:', dbErr);
        }
      }

      if (!env?.RESEND_API_KEY) {
        return jsonResponse({ success: false, error: 'Email service is not configured' }, 500);
      }
      if (!env?.ADMIN_EMAIL) {
        return jsonResponse({ success: false, error: 'Admin email is not configured' }, 500);
      }

      let userEmailSent = false;
      let userEmailError = null;
      let domainHint = null;
      let userResendId = null;

      if (shouldSendResultsEmail(data)) {
        const { body } = buildUserResultsResendBody(data, env);
        const sent = await sendResend(env, body);
        if (sent.ok) {
          userEmailSent = true;
          userResendId = sent.result?.id || null;
        } else {
          userEmailError = sent.result?.message || sent.result?.error || `Resend HTTP ${sent.status}`;
          domainHint = resendDomainHint(body.from, userEmailError);
          console.error('Results email to user failed:', sent.result);
        }
      }

      const adminBody = buildAdminResendBody(data, env, {
        userEmailSent,
        userEmailError: domainHint ? `${userEmailError} — ${domainHint}` : userEmailError
      });
      const adminSent = await sendResend(env, adminBody);
      if (!adminSent.ok) {
        console.error('Admin email failed:', adminSent.result);
      }

      if (data?.challengeId && env?.DB && env?.RESEND_API_KEY) {
        try {
          const challenge = await env.DB.prepare('SELECT * FROM challenges WHERE id = ?').bind(String(data.challengeId).trim()).first();
          const cEmail = normalizeEmail(challenge?.creator_email);
          if (challenge && isValidEmail(cEmail) && cEmail.toLowerCase() !== email.toLowerCase()) {
            const { body } = buildChallengeNotificationResendBody(challenge, { challengerName: data?.name, challengerIq: data?.iqResult?.estimated }, env);
            await sendResend(env, body);
          }
        } catch (chErr) {
          console.error('Challenge auto-notify error:', chErr);
        }
      }

      if (shouldSendResultsEmail(data) && !userEmailSent) {
        return jsonResponse({
          success: false,
          error: userEmailError || 'Failed to send results email',
          hint: domainHint,
          lang: data.lang
        }, 502);
      }

      if (!adminSent.ok && !userEmailSent) {
        return jsonResponse({
          success: false,
          error: adminSent.result?.message || 'Email sending failed',
          details: adminSent.result
        }, 500);
      }

      return jsonResponse({
        success: true,
        lang: data.lang,
        deliveredTo: shouldSendResultsEmail(data) ? email : undefined,
        id: userResendId
      });
    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }
  }
};
