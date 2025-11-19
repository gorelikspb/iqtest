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
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Скриншоты главной страницы (index.html)
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    const fileUrl = `file://${path.join(__dirname, '..', 'index.html')}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // 1. Приветственный экран
    console.log('Снимаю скриншот: Приветственный экран...');
    await page.screenshot({
      path: path.join(ruDir, '01-welcome-screen.png'),
      fullPage: false,
      clip: await page.evaluate(() => {
        const el = document.querySelector('.welcome-screen');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          x: 0,
          y: 0,
          width: Math.min(1200, rect.width),
          height: Math.min(800, rect.height)
        };
      }) || undefined
    });

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
      await page.waitForSelector('.option', { visible: true });
      // Выбираем первый вариант (не важно правильный или нет для скриншота)
      await page.click('.option');
      await page.waitForTimeout(300);
      if (i < 6) {
        await page.click('#nextBtn');
        await page.waitForTimeout(500);
      }
    }

    // Скриншот результатов
    console.log('Снимаю скриншот: Экран с результатами...');
    await page.waitForSelector('.result-screen', { visible: true });
    await page.waitForTimeout(500);
    
    await page.screenshot({
      path: path.join(ruDir, '03-result-screen.png'),
      fullPage: false
    });

    // 4. Скриншот блока поделиться
    console.log('Снимаю скриншот: Блок поделиться...');
    const shareBox = await page.$('.share-box');
    if (shareBox) {
      await shareBox.screenshot({
        path: path.join(ruDir, '04-share-buttons.png')
      });
    }

    // 5. Скриншот формы сбора контактов
    console.log('Снимаю скриншот: Форма сбора контактов...');
    const ctaBox = await page.$('.cta-box');
    if (ctaBox) {
      await ctaBox.screenshot({
        path: path.join(ruDir, '05-contact-form.png')
      });
    }

    // 6. Скриншот страницы расширенных тестов
    console.log('Снимаю скриншот: Страница расширенных тестов...');
    const fullTestsUrl = `file://${path.join(__dirname, '..', 'full-tests.html')}`;
    await page.goto(fullTestsUrl, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(500);
    
    await page.screenshot({
      path: path.join(ruDir, '06-full-tests-page.png'),
      fullPage: false
    });

    console.log('✅ Все скриншоты созданы в папке screenshots/ru/');

  } catch (error) {
    console.error('Ошибка при создании скриншотов:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

captureScreenshots();

