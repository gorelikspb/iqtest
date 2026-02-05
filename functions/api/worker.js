// Cloudflare Worker для отправки email через Resend API
// Проект: IQ Test Online
// URL: https://iqtestemails.gorelikgo.workers.dev/

export default {
  async fetch(request, env) {
    // CORS для всех запросов
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
        
        // Структура данных из форм:
        // Форма отправки результатов на email (send-results-only):
        // {
        //   type: 'send-results-only',
        //   name: 'Имя',
        //   email: 'email@example.com',
        //   iqResult: { estimated: 120, min: 100, max: 160, score: 5, total: 7 },
        //   shareUrl: 'https://...',
        //   source: 'result-page',
        //   timestamp: '...'
        // }
        //
        // Форма на странице результатов (script.js):
        // {
        //   type: 'iq-test',
        //   name: 'Имя',
        //   email: 'email@example.com',
        //   extendedTest: true/false,
        //   kidsTest: true/false,
        //   sendResults: false,
        //   iqResult: null,
        //   source: 'result-page',
        //   timestamp: '...'
        // }
        //
        // Форма на странице расширенных тестов (full-tests.js):
        // {
        //   type: 'full-tests',
        //   name: 'Имя',
        //   email: 'email@example.com',
        //   extendedTest: true/false,
        //   kidsTest: true/false,
        //   sendResults: false,
        //   source: 'full-tests-page',
        //   timestamp: '...'
        // }

        // 1. Email пользователю с результатами (если type = 'send-results-only' и есть iqResult)
        if (data.type === 'send-results-only' && data.iqResult) {
          const shareUrl = data.shareUrl || `https://iqtestnow.org/ru/index.html?iq=${data.iqResult.estimated}&min=${data.iqResult.min}&max=${data.iqResult.max}`;
          
          // Определяем уровень IQ для описания
          let iqLevel = '';
          if (data.iqResult.estimated < 80) iqLevel = 'Ниже среднего';
          else if (data.iqResult.estimated < 90) iqLevel = 'Немного ниже среднего';
          else if (data.iqResult.estimated < 110) iqLevel = 'Средний уровень';
          else if (data.iqResult.estimated < 120) iqLevel = 'Выше среднего';
          else if (data.iqResult.estimated < 130) iqLevel = 'Высокий уровень';
          else if (data.iqResult.estimated < 140) iqLevel = 'Очень высокий уровень';
          else iqLevel = 'Исключительно высокий уровень';
          
          const userEmailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .result-box { background: linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%); border: 2px solid #667eea; border-radius: 15px; padding: 30px; margin: 30px 0; text-align: center; }
                .iq-value { font-size: 3em; font-weight: bold; color: #667eea; margin: 10px 0; }
                .iq-range { font-size: 1.2em; color: #666; margin: 10px 0; }
                .iq-level { font-size: 1.1em; color: #555; margin: 10px 0; font-weight: 500; }
                .share-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                .share-button:hover { background: #5568d3; }
                .info-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 0.9em; color: #856404; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.85em; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🧠 Результаты IQ теста</h1>
                </div>
                
                <p>Привет, ${data.name || 'друг'}!</p>
                <p>Ты прошел быстрый IQ тест и получил результат:</p>
                
                <div class="result-box">
                  <div class="iq-value">≈ ${data.iqResult.estimated}</div>
                  <div class="iq-range">Диапазон: ${data.iqResult.min} - ${data.iqResult.max}</div>
                  <div class="iq-level">${iqLevel}</div>
                  <p style="margin-top: 15px; color: #666;">Правильных ответов: ${data.iqResult.score || 'N/A'} из ${data.iqResult.total || 'N/A'}</p>
                </div>
                
                <p><strong>Поделись результатом с друзьями и сравните результаты!</strong></p>
                <p style="text-align: center;">
                  <a href="${shareUrl}" class="share-button">Поделиться результатом</a>
                </p>
                
                <div class="info-box">
                  <p><strong>Важно:</strong> Это упрощенный тест для быстрой оценки. Для более точного определения IQ обычно используются более длительные тесты, проводимые сертифицированными специалистами.</p>
                </div>
                
                <hr style="margin: 30px 0;">
                
                <h2>Хочешь узнать свой IQ точнее?</h2>
                <p>Мы готовим расширенные тесты интеллекта (15-60 минут) и специальные тесты для детей. Когда они будут готовы, мы отправим тебе все варианты бесплатно!</p>
                ${data.extendedTest || data.kidsTest ? `
                  <p>✅ Ты подписался на:</p>
                  <ul>
                    ${data.extendedTest ? '<li>Расширенные тесты (15-60 минут)</li>' : ''}
                    ${data.kidsTest ? '<li>Тесты для детей</li>' : ''}
                  </ul>
                ` : ''}
                
                <p>Удачи в развитии интеллекта! 🧠</p>
                
                <div class="footer">
                  <p><strong>Дисклеймер:</strong> Данный онлайн IQ тест не является официальным или стандартизированным тестом IQ (таким как WAIS, Stanford-Binet, Raven). Результаты носят ознакомительный характер.</p>
                  <p>Если ты не проходил тест, просто проигнорируй это сообщение.</p>
                </div>
              </div>
            </body>
            </html>
          `;

          // В тестовом режиме Resend отправляет только на ADMIN_EMAIL
          const userEmailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'IQ Test <onboarding@resend.dev>',
              to: env.ADMIN_EMAIL, // ТЕСТОВЫЙ РЕЖИМ: все письма на админ email
              reply_to: env.ADMIN_EMAIL,
              subject: `[TEST for ${data.email}] Результаты IQ теста - IQ ≈ ${data.iqResult.estimated}`,
              html: userEmailHtml
            })
          });

          if (!userEmailResponse.ok) {
            const error = await userEmailResponse.json();
            console.error('Ошибка отправки email пользователю:', error);
          }
        }

        // 2. Уведомление админу (все данные для таблички)
        const adminEmailHtml = `
          <!DOCTYPE html>
          <html>
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
              <h2>📧 Новая регистрация в IQ тесте</h2>
              
              <div class="data-box">
                <div class="data-row">
                  <span class="data-label">Имя:</span> ${data.name || 'Не указано'}
                </div>
                <div class="data-row">
                  <span class="data-label">Email:</span> ${data.email}
                </div>
                <div class="data-row">
                  <span class="data-label">Источник:</span> ${data.source === 'result-page' ? 'Страница результатов' : 'Страница расширенных тестов'}
                </div>
                <div class="data-row">
                  <span class="data-label">Тип:</span> ${data.type === 'iq-test' ? 'IQ тест' : 'Расширенные тесты'}
                </div>
              </div>
              
              <h3>Интересуется:</h3>
              <div class="data-box">
                <ul>
                  <li>Расширенные тесты (15-60 минут): ${data.extendedTest ? '✅ Да' : '❌ Нет'}</li>
                  <li>Тесты для детей: ${data.kidsTest ? '✅ Да' : '❌ Нет'}</li>
                </ul>
              </div>
              
              ${data.iqResult ? `
                <h3>Результат теста:</h3>
                <div class="iq-result">
                  <div class="data-row">
                    <span class="data-label">IQ:</span> ≈ ${data.iqResult.estimated}
                  </div>
                  <div class="data-row">
                    <span class="data-label">Диапазон:</span> ${data.iqResult.min} - ${data.iqResult.max}
                  </div>
                  <div class="data-row">
                    <span class="data-label">Правильных ответов:</span> ${data.iqResult.score || 'N/A'} из ${data.iqResult.total || 'N/A'}
                  </div>
                </div>
              ` : ''}
              
              ${data.type === 'send-results-only' ? `
                <div class="data-box" style="background: #e0e7ff; margin-top: 15px;">
                  <p><strong>Тип запроса:</strong> Отправка результатов теста на email</p>
                </div>
              ` : ''}
              
              <div class="data-box">
                <div class="data-row">
                  <span class="data-label">Время:</span> ${new Date(data.timestamp || Date.now()).toLocaleString('ru-RU')}
                </div>
              </div>
              
              <hr style="margin: 30px 0;">
              <p style="color: #666; font-size: 0.9em;">Все данные сохранены. Можно добавить в табличку для ручной рассылки расширенных тестов.</p>
            </div>
          </body>
          </html>
        `;

        const adminEmailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'IQ Test <onboarding@resend.dev>',
            to: env.ADMIN_EMAIL,
            subject: `Новая регистрация: ${data.name || 'Без имени'} (${data.email})`,
            html: adminEmailHtml
          })
        });

        if (!adminEmailResponse.ok) {
          const error = await adminEmailResponse.json();
          console.error('Ошибка отправки email админу:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: error.message || 'Email sending failed',
            details: error
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

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

    // GET запрос - простая проверка работоспособности
    if (request.method === 'GET') {
      return new Response('IQ Test Email Worker is running!', {
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response('Method not allowed', { 
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

