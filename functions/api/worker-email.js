// Cloudflare Worker для отправки email через Resend API
// Используется для IQ теста
// 
// Настройка:
// 1. Создай Worker в Cloudflare Dashboard
// 2. Добавь Secrets:
//    - RESEND_API_KEY = re_EXpNX9RS_5ad8xQ2yn3ihD26Dtk8JmDJH
//    - ADMIN_EMAIL = gorelikgo@gmail.com
//    - CORPORATE_EMAIL = ваш@корпоративный.email (опционально, для отправки от имени компании)
//    - CORPORATE_NAME = IQ Test Online (опционально, имя отправителя)
// 3. Скопируй URL Worker (например: https://iqtest-email.gorelikgo.workers.dev)
// 4. Используй этот URL в script.js
//
// ============================================================================
// ПЛАН НАСТРОЙКИ КОРПОРАТИВНОГО EMAIL
// ============================================================================
// ТЕКУЩИЙ РЕЖИМ (временный):
// - Пересылка писем вручную с другого Gmail ящика
// - Пользователи не получают письма автоматически из-за тестового режима Resend
//
// КОГДА БУДЕТ 5+ ПИСЕМ:
// 1. Настроить корпоративный email домен (например, через Google Workspace или другой провайдер)
// 2. Добавить в Cloudflare Worker Secrets:
//    - CORPORATE_EMAIL = ваш@корпоративный.email
//    - CORPORATE_NAME = IQ Test Online
// 3. Изменить в коде строку 101: заменить env.ADMIN_EMAIL на data.email (для реальной отправки)
// 4. Проверить отправку на реальный email пользователя
// 5. Убрать тестовый режим Resend (если нужно)
//
// ============================================================================

export default {
  async fetch(request, env) {
    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method === 'POST') {
      try {
        const data = await request.json();
        
        // Структура данных:
        // {
        //   type: 'iq-test' | 'full-tests',
        //   name: 'Имя',
        //   email: 'email@example.com',
        //   extendedTest: true/false,
        //   kidsTest: true/false,
        //   sendResults: true/false,
        //   iqResult: { estimated: 120, min: 100, max: 160 } (опционально),
        //   source: 'result-page' | 'full-tests-page'
        // }

        // Email пользователю (если type = 'send-results-only' или sendResults = true и есть iqResult)
        if ((data.type === 'send-results-only' || data.sendResults) && data.iqResult) {
          const shareUrl = data.shareUrl || `${request.url.split('/').slice(0, 3).join('/')}?iq=${data.iqResult.estimated}&min=${data.iqResult.min}&max=${data.iqResult.max}`;
          
          // Определяем уровень IQ, если не передан
          let iqLevel = data.iqResult.level;
          if (!iqLevel) {
            const iq = data.iqResult.estimated;
            if (iq < 80) iqLevel = 'Низкий уровень';
            else if (iq < 90) iqLevel = 'Ниже среднего';
            else if (iq < 110) iqLevel = 'Средний уровень';
            else if (iq < 120) iqLevel = 'Выше среднего';
            else if (iq < 130) iqLevel = 'Высокий уровень';
            else if (iq < 140) iqLevel = 'Очень высокий уровень';
            else iqLevel = 'Исключительный уровень';
          }
          
          const userEmailHtml = `
            <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color: #333;">
              <h1 style="color: #667eea; font-size: 1.8em; margin-bottom: 20px;">🧠 Результаты IQ теста</h1>
              <p style="font-size: 16px; margin-bottom: 20px;">Привет, ${data.name || 'друг'}!</p>
              <p style="font-size: 16px; margin-bottom: 30px;">Ты прошел быстрый IQ тест и получил результат:</p>
              
              <div style="background: linear-gradient(135deg, #f0f4ff 0%, #e8edff 100%); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; border: 2px solid #667eea;">
                <h1 style="color: #667eea; margin: 0; font-size: 4em; font-weight: bold;">≈ ${data.iqResult.estimated}</h1>
                <p style="color: #666; margin: 15px 0; font-size: 16px;">Диапазон: ${data.iqResult.min} - ${data.iqResult.max}</p>
                <p style="color: #667eea; margin: 10px 0; font-size: 18px; font-weight: bold;">${iqLevel}</p>
                ${data.iqResult.score !== undefined && data.iqResult.total !== undefined ? 
                  `<p style="color: #666; margin: 10px 0; font-size: 16px;">Правильных ответов: ${data.iqResult.score} из ${data.iqResult.total}</p>` : ''}
              </div>
              
              <p style="font-size: 16px; margin: 30px 0;"><strong>Поделись результатом с друзьями и сравните результаты!</strong></p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${shareUrl}" style="background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">Поделиться результатом</a>
              </p>
              
              <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">
              
              <p style="font-size: 15px; line-height: 1.6;">Хочешь узнать свой IQ точнее? Мы готовим расширенные тесты интеллекта (15-60 минут) и специальные тесты для детей. Когда они будут готовы, мы отправим тебе все варианты бесплатно!</p>
              <p style="font-size: 15px; margin: 20px 0;">
                Также можешь посмотреть <a href="${request.url.split('/').slice(0, 3).join('/')}/ru/full-tests.html" style="color: #667eea; text-decoration: underline;">расширенные IQ тесты</a>
              </p>
              <p style="font-size: 15px; margin-top: 20px;">Удачи в развитии интеллекта! 🧠</p>
              
              <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">
              
              <p style="color: #666; font-size: 12px; line-height: 1.5;"><strong>Важно:</strong> Это упрощенный тест для быстрой оценки. Для более точного определения IQ обычно используются более длительные тесты, проводимые сертифицированными специалистами.</p>
              <p style="color: #666; font-size: 12px; margin-top: 10px;">Если ты не проходил тест, просто проигнорируй это сообщение.</p>
            </div>
          `;

          // Определяем адрес отправителя
          const fromEmail = env.CORPORATE_EMAIL || 'IQ Test <onboarding@resend.dev>';
          const fromName = env.CORPORATE_NAME || 'IQ Test';
          const fromAddress = env.CORPORATE_EMAIL ? `${fromName} <${env.CORPORATE_EMAIL}>` : fromEmail;
          
          // В тестовом режиме Resend отправляет только на ADMIN_EMAIL
          const userEmailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: fromAddress,
              to: env.ADMIN_EMAIL, // ТЕСТОВЫЙ РЕЖИМ: все письма на админ email
              reply_to: env.CORPORATE_EMAIL || env.ADMIN_EMAIL,
              subject: `[TEST for ${data.email}] Результаты IQ теста - IQ ≈ ${data.iqResult.estimated}`,
              html: userEmailHtml
            })
          });

          if (!userEmailResponse.ok) {
            const error = await userEmailResponse.json();
            console.error('Ошибка отправки email пользователю:', error);
          }
        }

        // Определяем тип регистрации для заголовка
        const registrationType = data.type === 'send-results-only' ? 'Отправка результатов на email' : 
                                 data.extendedTest || data.kidsTest ? 'Регистрация на расширенные тесты' : 
                                 'Быстрый тест';
        
        // Уведомление админу (все данные для таблички)
        const adminEmailHtml = `
          <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color: #333;">
            <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📊 ${registrationType}</h2>
            
            ${data.type === 'send-results-only' && data.iqResult ? `
              <div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p style="margin: 0 0 15px 0; color: #856404; font-size: 14px;">
                  <strong>⚠️ Внимание:</strong> Пользователь запросил отправку результатов на email, но из-за тестового режима Resend письмо отправлено на админ email. 
                  <strong>Пользователь не получил письмо!</strong>
                </p>
                <p style="margin: 0 0 10px 0; color: #856404; font-size: 14px;">
                  <strong>📧 Отправить пользователю:</strong> 
                  <a href="mailto:${data.email}?subject=Результаты IQ теста - IQ ≈ ${data.iqResult.estimated}&body=Привет, ${data.name || 'друг'}!%0A%0AТы прошел быстрый IQ тест и получил результат:%0A%0AIQ: ≈ ${data.iqResult.estimated}%0AДиапазон: ${data.iqResult.min} - ${data.iqResult.max}%0AУровень: ${data.iqResult.level || 'N/A'}%0AПравильных ответов: ${data.iqResult.score || 'N/A'} из ${data.iqResult.total || 'N/A'}%0A%0AПоделись результатом с друзьями и сравните результаты!%0A%0AУдачи в развитии интеллекта! 🧠" style="color: #667eea; font-weight: bold;">Кликни здесь для отправки</a>
                  <br><small style="color: #666; font-size: 12px;">💡 Совет: В настройках почтового клиента можно настроить отправку от корпоративного email. Или используй готовый текст ниже.</small>
                </p>
                <details style="margin-top: 10px;">
                  <summary style="cursor: pointer; color: #856404; font-size: 13px; font-weight: bold;">📋 Или скопируй готовый текст письма:</summary>
                  <div style="background: white; padding: 15px; margin-top: 10px; border-radius: 5px; border: 1px solid #ddd;">
                    <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">Тема: Результаты IQ теста - IQ ≈ ${data.iqResult.estimated}</p>
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; white-space: pre-wrap; overflow-x: auto;">Привет, ${data.name || 'друг'}!

Ты прошел быстрый IQ тест и получил результат:

🧠 Результаты IQ теста

IQ: ≈ ${data.iqResult.estimated}
Диапазон: ${data.iqResult.min} - ${data.iqResult.max}
Уровень: ${data.iqResult.level || 'N/A'}
Правильных ответов: ${data.iqResult.score || 'N/A'} из ${data.iqResult.total || 'N/A'}

Поделись результатом с друзьями и сравните результаты!

Хочешь узнать свой IQ точнее? Мы готовим расширенные тесты интеллекта (15-60 минут) и специальные тесты для детей. Когда они будут готовы, мы отправим тебе все варианты бесплатно!

Удачи в развитии интеллекта! 🧠

---
Важно: Это упрощенный тест для быстрой оценки. Для более точного определения IQ обычно используются более длительные тесты, проводимые сертифицированными специалистами.</div>
                  </div>
                </details>
              </div>
            ` : ''}
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">👤 Контактные данные</h3>
              <p style="margin: 8px 0;"><strong>Имя:</strong> ${data.name || 'Не указано'}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #667eea;">${data.email}</a></p>
              <p style="margin: 8px 0;"><strong>Источник:</strong> ${data.source === 'result-page' ? 'Страница результатов' : 'Страница расширенных тестов'}</p>
              <p style="margin: 8px 0;"><strong>Тип запроса:</strong> ${registrationType}</p>
              <p style="margin: 8px 0;"><strong>Время:</strong> ${new Date().toLocaleString('ru-RU')}</p>
            </div>
            
            ${data.iqResult ? `
              <div style="background: #f0f4ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #333; margin-top: 0;">🧠 Результат теста</h3>
                <p style="margin: 8px 0; font-size: 18px;"><strong>IQ: ≈ ${data.iqResult.estimated}</strong></p>
                <p style="margin: 8px 0;"><strong>Диапазон:</strong> ${data.iqResult.min} - ${data.iqResult.max}</p>
                <p style="margin: 8px 0;"><strong>Уровень:</strong> ${data.iqResult.level || 'N/A'}</p>
                <p style="margin: 8px 0;"><strong>Правильных ответов:</strong> ${data.iqResult.score || 'N/A'} из ${data.iqResult.total || 'N/A'}</p>
              </div>
            ` : ''}
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h3 style="color: #333; margin-top: 0;">📋 Интересы</h3>
              <ul style="margin: 8px 0; padding-left: 20px;">
                <li style="margin: 5px 0;">Расширенные тесты (15-60 минут): ${data.extendedTest ? '✅ <strong>Да</strong>' : '❌ Нет'}</li>
                <li style="margin: 5px 0;">Тесты для детей: ${data.kidsTest ? '✅ <strong>Да</strong>' : '❌ Нет'}</li>
                <li style="margin: 5px 0;">Отправить результаты на email: ${data.sendResults || data.type === 'send-results-only' ? '✅ <strong>Да</strong>' : '❌ Нет'}</li>
              </ul>
            </div>
            
            <div style="background: #d1ecf1; padding: 15px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #0c5460;">
              <p style="margin: 0; color: #0c5460; font-size: 14px;">
              <strong>💡 Действие:</strong> ${data.extendedTest || data.kidsTest ? 
                'Добавить в табличку для рассылки расширенных тестов, когда они будут готовы.' : 
                data.type === 'send-results-only' ?
                'Отправить результаты теста вручную на email пользователя (см. блок с результатом выше).' :
                'Пользователь прошел только быстрый тест. Можно добавить в общую базу для будущих рассылок.'}
              </p>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            
            <p style="color: #666; font-size: 12px; margin: 0;">
              Данные автоматически сохранены. Скопируй email для добавления в табличку: <code style="background: #f5f5f5; padding: 2px 6px; border-radius: 3px;">${data.email}</code>
            </p>
          </div>
        `;

        // Определяем адрес отправителя для админского письма
        const adminFromEmail = env.CORPORATE_EMAIL || 'IQ Test <onboarding@resend.dev>';
        const adminFromName = env.CORPORATE_NAME || 'IQ Test';
        const adminFromAddress = env.CORPORATE_EMAIL ? `${adminFromName} <${env.CORPORATE_EMAIL}>` : adminFromEmail;
        
        const adminEmailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: adminFromAddress,
            to: env.ADMIN_EMAIL,
            reply_to: env.CORPORATE_EMAIL || env.ADMIN_EMAIL,
            subject: `📊 ${registrationType}: ${data.name || 'Без имени'} (${data.email})${data.iqResult ? ` - IQ ≈ ${data.iqResult.estimated}` : ''}${data.type === 'send-results-only' ? ' ⚠️ НУЖНО ОТПРАВИТЬ ВРУЧНУЮ' : ''}`,
            html: adminEmailHtml
          })
        });

        if (!adminEmailResponse.ok) {
          const error = await adminEmailResponse.json();
          console.error('Ошибка отправки email админу:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: `Ошибка отправки email админу: ${error.message || 'Unknown error'}` 
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

        const adminEmailResult = await adminEmailResponse.json();
        console.log('Email админу отправлен:', adminEmailResult);

        return new Response(JSON.stringify({ success: true }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        console.error('Ошибка Worker:', error);
        return new Response(JSON.stringify({ 
          success: false, 
          error: error.message 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    return new Response('Method not allowed', { status: 405 });
  }
}

