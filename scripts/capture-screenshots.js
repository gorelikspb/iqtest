const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, '..', 'screenshots');
const ruDir = path.join(screenshotsDir, 'ru');
const enDir = path.join(screenshotsDir, 'en');

// Создаем папки если их нет
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
if (!fs.existsSync(ruDir)) fs.mkdirSync(ruDir, { recursive: true });
if (!fs.existsSync(enDir)) fs.mkdirSync(enDir, { recursive: true });

// Секции для скриншотов
const sections = [
  {
    name: '01-welcome-screen',
    selector: '.welcome-screen',
    description: 'Главная страница - приветственный экран'
  },
  {
    name: '02-test-question',
    selector: '.test-screen',
    description: 'Экран с вопросом теста',
    waitFor: 1000 // Ждем загрузки
  },
  {
    name: '03-result-screen',
    selector: '.result-screen',
    description: 'Экран с результатами',
    waitFor: 1000
  },
  {
    name: '04-share-buttons',
    selector: '.share-box',
    description: 'Блок с кнопками поделиться'
  },
  {
    name: '05-contact-form',
    selector: '.cta-box',
    description: 'Форма сбора контактов'
  },
  {
    name: '06-full-tests-page',
    file: 'full-tests.html',
    selector: '.full-tests-screen',
    description: 'Страница расширенных тестов'
  }
];

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Скриншоты главной страницы (index.html)
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600 }); // Увеличиваем высоту для полного скриншота
    
    const fileUrl = `file://${path.join(__dirname, '..', 'index.html').replace(/\\/g, '/')}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(500);

    // 1. Приветственный экран
    console.log('Снимаю скриншот: Приветственный экран...');
    await page.waitForSelector('.welcome-screen', { visible: true, timeout: 5000 });
    const welcomeElement = await page.$('.welcome-screen');
    if (welcomeElement) {
      // Делаем скриншот элемента с padding
      await welcomeElement.screenshot({
        path: path.join(ruDir, '01-welcome-screen.png'),
        captureBeyondViewport: true
      });
    } else {
      // Fallback - полный скриншот страницы
      await page.screenshot({
        path: path.join(ruDir, '01-welcome-screen.png'),
        fullPage: true
      });
    }

    // 2. Нажимаем "Начать тест" и делаем скриншот вопроса
    console.log('Снимаю скриншот: Экран с вопросом...');
    await page.click('#startBtn');
    await page.waitForSelector('.test-screen', { visible: true });
    await page.waitForTimeout(500);
    
    await page.screenshot({
      path: path.join(ruDir, '02-test-question.png'),
      fullPage: false
    });

    // 3. Отвечаем на все вопросы и делаем скриншот результатов
    console.log('Прохожу тест для скриншота результатов...');
    for (let i = 0; i < 7; i++) {
      try {
        await page.waitForSelector('.option', { visible: true, timeout: 5000 });
        // Выбираем первый вариант (не важно правильный или нет для скриншота)
        await page.click('.option');
        await page.waitForTimeout(800);
        
        // Ждем появления кнопки "Следующий"
        if (i < 6) {
          await page.waitForSelector('#nextBtn', { visible: true, timeout: 5000 });
          await page.click('#nextBtn');
          await page.waitForTimeout(1000);
        } else {
          // Последний вопрос - ждем автоматического перехода или нажимаем кнопку если есть
          await page.waitForTimeout(1000);
          // Проверяем, есть ли кнопка "Следующий" на последнем вопросе
          const nextBtn = await page.$('#nextBtn');
          if (nextBtn) {
            const isVisible = await page.evaluate(el => {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden';
            }, nextBtn);
            if (isVisible) {
              await page.click('#nextBtn');
              await page.waitForTimeout(1000);
            }
          }
        }
      } catch (error) {
        console.log(`Ошибка на вопросе ${i + 1}:`, error.message);
        // Продолжаем дальше
      }
    }
    
    // Дополнительная проверка - ждем появления экрана результатов
    console.log('Ожидаю появления экрана результатов...');
    await page.waitForTimeout(2000);

    // Скриншот результатов
    console.log('Снимаю скриншот: Экран с результатами...');
    await page.setViewport({ width: 1200, height: 2000 }); // Увеличиваем для результатов
    try {
      await page.waitForSelector('.result-screen', { visible: true, timeout: 15000 });
      await page.waitForTimeout(1500);
      
      // Прокручиваем страницу вверх для полного скриншота
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      
      const resultElement = await page.$('.result-screen');
      if (resultElement) {
        await resultElement.screenshot({
          path: path.join(ruDir, '03-result-screen.png'),
          captureBeyondViewport: true
        });
      } else {
        await page.screenshot({
          path: path.join(ruDir, '03-result-screen.png'),
          fullPage: true
        });
      }
    } catch (error) {
      console.log('Не удалось сделать скриншот результатов, пробую полный скриншот страницы...');
      await page.screenshot({
        path: path.join(ruDir, '03-result-screen.png'),
        fullPage: true
      });
    }

    // 4. Скриншот блока поделиться
    console.log('Снимаю скриншот: Блок поделиться...');
    try {
      // Прокручиваем к блоку поделиться
      await page.evaluate(() => {
        const shareBox = document.querySelector('.share-box');
        if (shareBox) shareBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      await page.waitForTimeout(1000);
      
      await page.waitForSelector('.share-box', { visible: true, timeout: 5000 });
      const shareBox = await page.$('.share-box');
      if (shareBox) {
        await shareBox.screenshot({
          path: path.join(ruDir, '04-share-buttons.png'),
          captureBeyondViewport: true
        });
      } else {
        console.log('Блок поделиться не найден, пропускаем...');
      }
    } catch (error) {
      console.log('Ошибка при скриншоте блока поделиться:', error.message);
    }

    // 5. Скриншот формы сбора контактов
    console.log('Снимаю скриншот: Форма сбора контактов...');
    try {
      // Прокручиваем к форме
      await page.evaluate(() => {
        const ctaBox = document.querySelector('.cta-box');
        if (ctaBox) ctaBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      await page.waitForTimeout(1000);
      
      await page.waitForSelector('.cta-box', { visible: true, timeout: 5000 });
      const ctaBox = await page.$('.cta-box');
      if (ctaBox) {
        await ctaBox.screenshot({
          path: path.join(ruDir, '05-contact-form.png'),
          captureBeyondViewport: true
        });
      } else {
        console.log('Форма сбора контактов не найдена, пропускаем...');
      }
    } catch (error) {
      console.log('Ошибка при скриншоте формы:', error.message);
    }

    // 6. Скриншот страницы расширенных тестов
    console.log('Снимаю скриншот: Страница расширенных тестов...');
    const fullTestsUrl = `file://${path.join(__dirname, '..', 'full-tests.html').replace(/\\/g, '/')}`;
    await page.goto(fullTestsUrl, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(500);
    await page.setViewport({ width: 1200, height: 2000 }); // Увеличиваем для полного скриншота
    
    const fullTestsElement = await page.$('.full-tests-screen');
    if (fullTestsElement) {
      await fullTestsElement.screenshot({
        path: path.join(ruDir, '06-full-tests-page.png'),
        captureBeyondViewport: true
      });
    } else {
      await page.screenshot({
        path: path.join(ruDir, '06-full-tests-page.png'),
        fullPage: true
      });
    }

    console.log('✅ Все скриншоты созданы в папке screenshots/ru/');

  } catch (error) {
    console.error('Ошибка при создании скриншотов:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

captureScreenshots();

