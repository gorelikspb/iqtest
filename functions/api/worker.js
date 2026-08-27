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
  resendDomainHint
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
      const email = normalizeEmail(data?.email);
      if (!isValidEmail(email)) {
        return jsonResponse({ success: false, error: 'Valid email is required' }, 400);
      }
      data.email = email;
      data.lang = resolveLang(data);

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
