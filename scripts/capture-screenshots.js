// Скрипт для автоматической генерации скриншотов IQ теста
// Использует Puppeteer с file:// протоколом
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// ========== НАСТРОЙКИ ПРОЕКТА ==========
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const INDEX_HTML_RU = path.join(PUBLIC_DIR, 'ru', 'index.html');
const INDEX_HTML_EN = path.join(PUBLIC_DIR, 'en', 'index.html');
const FULL_TESTS_HTML_RU = path.join(PUBLIC_DIR, 'ru', 'full-tests.html');
const FULL_TESTS_HTML_EN = path.join(PUBLIC_DIR, 'en', 'full-tests.html');
const SCREENSHOTS_DIR = path.join(PROJECT_ROOT, 'iqtest_log', 'screenshots');
const LANGUAGES = ['ru', 'en'];

// ========== ОСНОВНОЙ КОД ==========

async function captureScreenshots() {
    // Создаем папки если их нет
    LANGUAGES.forEach(lang => {
        const dir = path.join(SCREENSHOTS_DIR, lang);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    // Проверяем наличие файлов
    if (!fs.existsSync(INDEX_HTML_RU) || !fs.existsSync(INDEX_HTML_EN)) {
        console.error('❌ Файлы не найдены:', INDEX_HTML_RU, INDEX_HTML_EN);
        process.exit(1);
    }
    
    try {
        const browser = await puppeteer.launch({ 
            headless: true,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--allow-file-access-from-files'
            ]
        });
        
        for (const lang of LANGUAGES) {
            console.log(`\n=== Язык: ${lang.toUpperCase()} ===`);
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            
            // Включаем логирование консоли для отладки
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    console.log(`  [Console Error]: ${msg.text()}`);
                }
            });
            
            // Загружаем страницу один раз
            const indexHtml = lang === 'ru' ? INDEX_HTML_RU : INDEX_HTML_EN;
            const fileUrl = `file://${indexHtml.replace(/\\/g, '/')}`;
            console.log(`Загрузка страницы (${lang})...`);
            await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });
            
            // Ждем загрузки скриптов
            await page.waitForFunction(() => {
                return typeof window.getCurrentLanguage === 'function' && 
                       typeof window.getQuestions === 'function';
            }, { timeout: 15000 });
            
            // Устанавливаем язык и инициализируем вопросы
            await page.evaluate((lang) => {
                // Устанавливаем язык
                if (typeof window.setLanguage === 'function') {
                    window.setLanguage(lang);
                }
                
                // Инициализируем вопросы
                if (typeof window.getQuestions === 'function') {
                    window.questions = window.getQuestions();
                }
                
                // Применяем переводы, если функция доступна
                if (typeof window.applyTranslations === 'function') {
                    window.applyTranslations();
                }
            }, lang);
            
            // Ждем применения переводов и рендеринга
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Проверяем, что язык установлен правильно
            const currentLang = await page.evaluate(() => {
                return typeof window.getCurrentLanguage === 'function' ? window.getCurrentLanguage() : 'ru';
            });
            console.log(`  Текущий язык: ${currentLang}`);
            
            // Дополнительно ждем, пока текст на странице обновится
            await page.waitForFunction((expectedLang) => {
                const h1 = document.querySelector('h1');
                if (!h1) return false;
                
                // Проверяем, что текст соответствует языку
                if (expectedLang === 'en') {
                    return h1.textContent.includes('Quick IQ Test') || h1.textContent.includes('IQ');
                } else {
                    return h1.textContent.includes('Быстрый IQ Тест') || h1.textContent.includes('IQ');
                }
            }, { timeout: 10000 }, lang);
            
            // 1. Скриншот welcome-screen
            console.log('Скриншот: welcome-screen...');
            await page.waitForSelector('.welcome-screen', { timeout: 10000 });
            await new Promise(resolve => setTimeout(resolve, 500));
            const welcomeElement = await page.$('.welcome-screen');
            if (welcomeElement) {
                await welcomeElement.screenshot({ path: path.join(SCREENSHOTS_DIR, lang, '01-welcome-screen.png') });
                console.log(`  ✅ Сохранено: 01-welcome-screen.png`);
            }
            
            // 2. Переключаем на экран теста вручную и делаем скриншот test-question
            console.log('Скриншот: test-question...');
            
            await page.evaluate(() => {
                const welcomeScreen = document.querySelector('.welcome-screen');
                const testScreen = document.querySelector('.test-screen');
                const questionText = document.getElementById('questionText');
                const optionsContainer = document.getElementById('optionsContainer');
                const currentQuestionSpan = document.getElementById('currentQuestion');
                const totalQuestionsSpan = document.getElementById('totalQuestions');
                const progressFill = document.getElementById('progressFill');
                
                if (welcomeScreen && testScreen && window.questions && window.questions.length > 0) {
                    welcomeScreen.style.display = 'none';
                    testScreen.style.display = 'block';
                    
                    // Инициализируем тест
                    window.currentQuestionIndex = 0;
                    window.score = 0;
                    window.selectedAnswer = null;
                    
                    const question = window.questions[0];
                    
                    // Обновляем счетчик
                    if (currentQuestionSpan) currentQuestionSpan.textContent = 1;
                    if (totalQuestionsSpan) totalQuestionsSpan.textContent = window.questions.length;
                    
                    // Обновляем прогресс
                    if (progressFill) {
                        const progress = (1 / window.questions.length) * 100;
                        progressFill.style.width = progress + '%';
                    }
                    
                    // Показываем вопрос
                    if (questionText) {
                        let questionHTML = `<h2>${question.question}</h2>`;
                        if (question.data) {
                            questionHTML += `<div class="question-data">${question.data}</div>`;
                        }
                        questionText.innerHTML = questionHTML;
                    }
                    
                    // Показываем варианты ответов
                    if (optionsContainer) {
                        optionsContainer.innerHTML = '';
                        question.options.forEach((option, index) => {
                            const optionDiv = document.createElement('div');
                            optionDiv.className = 'option';
                            optionDiv.textContent = option;
                            optionsContainer.appendChild(optionDiv);
                        });
                    }
                }
            });
            
            // Ждем появления вопроса и вариантов ответов
            await page.waitForSelector('.question', { timeout: 10000 });
            await page.waitForSelector('.option', { timeout: 10000 });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const testElement = await page.$('.test-screen');
            if (testElement) {
                await testElement.screenshot({ path: path.join(SCREENSHOTS_DIR, lang, '02-test-question.png') });
                console.log(`  ✅ Сохранено: 02-test-question.png`);
            }
            
            // 3. Проходим все вопросы (7 вопросов) и переходим на экран результатов
            console.log('Прохождение теста...');
            
            for (let i = 0; i < 7; i++) {
                // Ждем появления вариантов ответов
                await page.waitForSelector('.option', { timeout: 10000 });
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Кликаем на первый вариант
                const firstOption = await page.$('.option');
                if (firstOption) {
                    await firstOption.click();
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
                // Если не последний вопрос, переходим к следующему
                if (i < 6) {
                    await page.evaluate((currentIndex) => {
                        window.currentQuestionIndex = currentIndex + 1;
                        const question = window.questions[window.currentQuestionIndex];
                        const questionText = document.getElementById('questionText');
                        const optionsContainer = document.getElementById('optionsContainer');
                        const currentQuestionSpan = document.getElementById('currentQuestion');
                        const progressFill = document.getElementById('progressFill');
                        
                        // Обновляем счетчик
                        if (currentQuestionSpan) currentQuestionSpan.textContent = window.currentQuestionIndex + 1;
                        
                        // Обновляем прогресс
                        if (progressFill) {
                            const progress = ((window.currentQuestionIndex + 1) / window.questions.length) * 100;
                            progressFill.style.width = progress + '%';
                        }
                        
                        // Показываем вопрос
                        if (questionText) {
                            let questionHTML = `<h2>${question.question}</h2>`;
                            if (question.data) {
                                questionHTML += `<div class="question-data">${question.data}</div>`;
                            }
                            questionText.innerHTML = questionHTML;
                        }
                        
                        // Показываем варианты ответов
                        if (optionsContainer) {
                            optionsContainer.innerHTML = '';
                            question.options.forEach((option, index) => {
                                const optionDiv = document.createElement('div');
                                optionDiv.className = 'option';
                                optionDiv.textContent = option;
                                optionsContainer.appendChild(optionDiv);
                            });
                        }
                    }, i);
                    
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
            }
            
            // 4. Переключаем на экран результатов
            console.log('Скриншот: result-screen...');
            await page.evaluate(() => {
                const testScreen = document.querySelector('.test-screen');
                const resultScreen = document.querySelector('.result-screen');
                const iqValue = document.getElementById('iqValue');
                const iqRange = document.getElementById('iqRange');
                const iqDescription = document.getElementById('iqDescription');
                
                if (testScreen && resultScreen) {
                    testScreen.style.display = 'none';
                    resultScreen.style.display = 'block';
                    
                    // Рассчитываем результат
                    const score = 3; // Примерный результат
                    const total = window.questions.length;
                    const percentage = (score / total) * 100;
                    const baseIQ = 100;
                    const iqRange = 30;
                    const estimatedIQ = baseIQ + ((percentage - 50) / 50) * iqRange;
                    const roundedIQ = Math.round(estimatedIQ / 5) * 5;
                    const range = 40;
                    const minIQ = Math.max(70, roundedIQ - range);
                    const maxIQ = Math.min(160, roundedIQ + range);
                    
                    // Обновляем результаты
                    if (iqValue) iqValue.textContent = `≈ ${roundedIQ}`;
                    if (iqRange) iqRange.textContent = `${window.getCurrentLanguage() === 'en' ? 'Range:' : 'Диапазон:'} ${minIQ} - ${maxIQ}`;
                    if (iqDescription && typeof window.getIQDescription === 'function') {
                        iqDescription.textContent = window.getIQDescription(roundedIQ);
                    }
                }
            });
            
            await page.waitForSelector('.result-screen', { timeout: 10000 });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const resultElement = await page.$('.result-screen');
            if (resultElement) {
                await resultElement.screenshot({ path: path.join(SCREENSHOTS_DIR, lang, '03-result-screen.png') });
                console.log(`  ✅ Сохранено: 03-result-screen.png`);
            }
            
            // 5. Скриншот share-buttons (на странице результатов)
            console.log('Скриншот: share-buttons...');
            await page.waitForSelector('.share-box', { timeout: 5000 });
            await new Promise(resolve => setTimeout(resolve, 500));
            const shareElement = await page.$('.share-box');
            if (shareElement) {
                await shareElement.screenshot({ path: path.join(SCREENSHOTS_DIR, lang, '04-share-buttons.png') });
                console.log(`  ✅ Сохранено: 04-share-buttons.png`);
            }
            
            // 6. Скриншот contact-form (на странице результатов)
            console.log('Скриншот: contact-form...');
            await page.waitForSelector('.cta-box', { timeout: 5000 });
            await new Promise(resolve => setTimeout(resolve, 500));
            const ctaElement = await page.$('.cta-box');
            if (ctaElement) {
                await ctaElement.screenshot({ path: path.join(SCREENSHOTS_DIR, lang, '05-contact-form.png') });
                console.log(`  ✅ Сохранено: 05-contact-form.png`);
            }
            
            await page.close();
            
            // 7. Скриншот full-tests-page (отдельная страница)
            console.log('Скриншот: full-tests-page...');
            const fullTestsPage = await browser.newPage();
            await fullTestsPage.setViewport({ width: 1920, height: 1080 });
            const fullTestsHtml = lang === 'ru' ? FULL_TESTS_HTML_RU : FULL_TESTS_HTML_EN;
            const fullTestsUrl = `file://${fullTestsHtml.replace(/\\/g, '/')}`;
            await fullTestsPage.goto(fullTestsUrl, { waitUntil: 'networkidle0', timeout: 30000 });
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            await fullTestsPage.waitForSelector('.full-tests-screen', { timeout: 5000 });
            const fullTestsElement = await fullTestsPage.$('.full-tests-screen');
            if (fullTestsElement) {
                await fullTestsElement.screenshot({ path: path.join(SCREENSHOTS_DIR, lang, '06-full-tests-page.png') });
                console.log(`  ✅ Сохранено: 06-full-tests-page.png`);
            }
            
            await fullTestsPage.close();
        }

        await browser.close();
        console.log('\n✅ Скриншоты созданы для всех языков в:', SCREENSHOTS_DIR);
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

captureScreenshots().catch(console.error);
