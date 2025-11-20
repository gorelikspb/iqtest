// Cloudflare Worker для отправки email через Resend API
// Используется для IQ теста
// 
// Настройка:
// 1. Создай Worker в Cloudflare Dashboard
// 2. Добавь Secrets:
//    - RESEND_API_KEY = re_EXpNX9RS_5ad8xQ2yn3ihD26Dtk8JmDJH
//    - ADMIN_EMAIL = gorelikgo@gmail.com
// 3. Скопируй URL Worker (например: https://iqtest-email.gorelikgo.workers.dev)
// 4. Используй этот URL в script.js

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

        // Email пользователю (если sendResults = true и есть iqResult)
        if (data.sendResults && data.iqResult) {
          const shareUrl = data.shareUrl || `${request.url.split('/').slice(0, 3).join('/')}?iq=${data.iqResult.estimated}&min=${data.iqResult.min}&max=${data.iqResult.max}`;
          
          const userEmailHtml = `
            <h2>Привет, ${data.name || 'друг'}!</h2>
            <p>Ты прошел быстрый IQ тест и получил результат:</p>
            <div style="background: #f0f4ff; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
              <h1 style="color: #667eea; margin: 0; font-size: 3em;">≈ ${data.iqResult.estimated}</h1>
              <p style="color: #666; margin: 10px 0;">Диапазон: ${data.iqResult.min} - ${data.iqResult.max}</p>
            </div>
            <p><strong>Поделись результатом с друзьями и сравните результаты!</strong></p>
            <p><a href="${shareUrl}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Поделиться результатом</a></p>
            <hr style="margin: 30px 0;">
            <p>Хочешь узнать свой IQ точнее? Мы готовим расширенные тесты интеллекта (15-60 минут) и специальные тесты для детей. Когда они будут готовы, мы отправим тебе все варианты бесплатно!</p>
            <p>Также можешь посмотреть расширенные тесты: <a href="${request.url.split('/').slice(0, 3).join('/')}/full-tests.html">Расширенные IQ тесты</a></p>
            <p>Удачи в развитии интеллекта! 🧠</p>
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;"><strong>Важно:</strong> Это упрощенный тест для быстрой оценки. Для более точного определения IQ обычно используются более длительные тесты, проводимые сертифицированными специалистами.</p>
            <p style="color: #666; font-size: 12px;">Если ты не проходил тест, просто проигнорируй это сообщение.</p>
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

        // Уведомление админу (все данные для таблички)
        const adminEmailHtml = `
          <h2>Новая регистрация в IQ тесте</h2>
          <p><strong>Имя:</strong> ${data.name || 'Не указано'}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Источник:</strong> ${data.source === 'result-page' ? 'Страница результатов' : 'Страница расширенных тестов'}</p>
          <hr>
          <p><strong>Интересуется:</strong></p>
          <ul>
            <li>Расширенные тесты (15-60 минут): ${data.extendedTest ? '✅ Да' : '❌ Нет'}</li>
            <li>Тесты для детей: ${data.kidsTest ? '✅ Да' : '❌ Нет'}</li>
            <li>Отправить результаты на email: ${data.sendResults ? '✅ Да' : '❌ Нет'}</li>
          </ul>
          ${data.iqResult ? `
            <hr>
            <p><strong>Результат теста:</strong></p>
            <ul>
              <li>IQ: ≈ ${data.iqResult.estimated}</li>
              <li>Диапазон: ${data.iqResult.min} - ${data.iqResult.max}</li>
              <li>Правильных ответов: ${data.iqResult.score || 'N/A'} из ${data.iqResult.total || 'N/A'}</li>
            </ul>
          ` : ''}
          <hr>
          <p><strong>Время:</strong> ${new Date().toLocaleString('ru-RU')}</p>
          <p style="color: #666; font-size: 12px;">Все данные сохранены. Можно добавить в табличку для ручной рассылки расширенных тестов.</p>
        `;

        await fetch('https://api.resend.com/emails', {
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

