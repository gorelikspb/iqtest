// Вопросы теста (загружаются из translations.js)
let questions = [];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let iqResult = null; // Сохраняем результат для поделиться

// Элементы будут получены после загрузки DOM
let welcomeScreen, testScreen, resultScreen, startBtn, nextBtn, restartBtn;
let questionText, optionsContainer, progressFill, currentQuestionSpan, totalQuestionsSpan;

// Инициализация языка и переводов (будет установлена в init())
let currentLang = 'ru';

// Применяем переводы к интерфейсу
function applyTranslations() {
    currentLang = getCurrentLanguage();
    questions = getQuestions();
    
    // Обновляем lang атрибут HTML
    document.documentElement.lang = currentLang;
    
    // Обновляем meta теги (если они есть в HTML)
    const pageTitle = document.getElementById('pageTitle');
    const pageDescription = document.querySelector('meta[name="description"]');
    const pageKeywords = document.querySelector('meta[name="keywords"]');
    
    if (currentLang === 'en') {
        if (pageTitle) pageTitle.textContent = 'IQ Test Online - Quick IQ Test in 2-3 minutes | Free';
        else if (document.title) document.title = 'IQ Test Online - Quick IQ Test in 2-3 minutes | Free';
        if (pageDescription) pageDescription.setAttribute('content', 'Take a quick free online IQ test. 7 questions in 2-3 minutes. Find out your approximate IQ level with result and range. Free intelligence test without registration.');
        if (pageKeywords) pageKeywords.setAttribute('content', 'iq test, online iq test, quick iq test, intelligence test, free iq test, check iq');
    } else {
        if (pageTitle) pageTitle.textContent = 'IQ Тест Онлайн - Быстрый тест IQ за 2-3 минуты | Бесплатно';
        else if (document.title) document.title = 'IQ Тест Онлайн - Быстрый тест IQ за 2-3 минуты | Бесплатно';
        if (pageDescription) pageDescription.setAttribute('content', 'Пройдите быстрый IQ тест онлайн бесплатно. 7 вопросов за 2-3 минуты. Узнайте примерный уровень вашего IQ с результатом и диапазоном. Бесплатный тест интеллекта без регистрации.');
        if (pageKeywords) pageKeywords.setAttribute('content', 'iq тест, тест iq онлайн, быстрый iq тест, тест интеллекта, бесплатный iq тест, проверить iq');
    }
    
    // Обновляем HTML элементы
    const welcomeTitle = document.querySelector('#welcomeScreen h1');
    if (welcomeTitle) welcomeTitle.textContent = t('ui.welcomeTitle');
    
    const welcomeSubtitle = document.querySelector('#welcomeScreen .subtitle');
    if (welcomeSubtitle) welcomeSubtitle.textContent = t('ui.welcomeSubtitle');
    
    const infoItems = document.querySelectorAll('#welcomeScreen .info-box li');
    const infoTexts = t('ui.infoItems');
    infoItems.forEach((item, i) => {
        if (infoTexts[i]) item.textContent = infoTexts[i];
    });
    
    const warningImportant = document.querySelector('#warningBox .warning-content p strong');
    if (warningImportant) warningImportant.textContent = t('ui.warningImportant');
    
    const warningTexts = document.querySelectorAll('#warningBox .warning-content p');
    if (warningTexts[0]) {
        warningTexts[0].innerHTML = `<strong>${t('ui.warningImportant')}</strong> ${t('ui.warningText')}`;
    }
    if (warningTexts[1]) {
        warningTexts[1].innerHTML = `<strong>${t('ui.disclaimer')}</strong> ${t('ui.disclaimerText')}`;
    }
    
    const toggleText = document.querySelector('#warningToggle .toggle-text');
    if (toggleText) toggleText.textContent = t('ui.expand');
    
    if (startBtn) startBtn.textContent = t('ui.startTest');
    if (nextBtn) nextBtn.textContent = t('ui.nextQuestion');
    if (restartBtn) restartBtn.textContent = t('ui.restartTest');
    
    // Обновляем формы и другие элементы
    updateFormTranslations();
    updateResultScreenTranslations();
}

function updateFormTranslations() {
    // Форма на стартовой странице
    const ctaStartTitle = document.querySelector('#ctaBoxStart h3');
    if (ctaStartTitle) ctaStartTitle.textContent = t('ui.ctaStartTitle');
    
    const ctaStartText = document.querySelector('#ctaBoxStart .cta-text');
    if (ctaStartText) ctaStartText.textContent = t('ui.ctaStartText');
    
    const userNameStart = document.getElementById('userNameStart');
    if (userNameStart) userNameStart.placeholder = t('ui.yourName');
    
    const userEmailStart = document.getElementById('userEmailStart');
    if (userEmailStart) userEmailStart.placeholder = t('ui.yourEmail');
    
    const extendedTestStartLabel = document.querySelector('#extendedTestStart').nextElementSibling;
    if (extendedTestStartLabel) extendedTestStartLabel.textContent = t('ui.extendedTests');
    
    const kidsTestStartLabel = document.querySelector('#kidsTestStart').nextElementSibling;
    if (kidsTestStartLabel) kidsTestStartLabel.textContent = t('ui.kidsTests');
    
    const getFreeTestsStart = document.querySelector('#contactFormStart button');
    if (getFreeTestsStart) getFreeTestsStart.textContent = t('ui.getFreeTests');
    
    const noSpamStart = document.querySelector('#contactFormStart .form-note');
    if (noSpamStart) noSpamStart.textContent = t('ui.noSpam');
    
    const thanksStart = document.querySelector('#ctaSuccessStart h3');
    if (thanksStart) thanksStart.textContent = t('ui.thanks');
    
    const thanksTextStart = document.querySelector('#ctaSuccessStart p');
    if (thanksTextStart) thanksTextStart.textContent = t('ui.thanksText');
    
    // Форма на странице результатов
    const ctaTitle = document.querySelector('#ctaBox h3');
    if (ctaTitle) ctaTitle.textContent = t('ui.ctaTitle');
    
    const ctaText = document.querySelector('#ctaBox .cta-text');
    if (ctaText) ctaText.textContent = t('ui.ctaText');
    
    const userName = document.getElementById('userName');
    if (userName) userName.placeholder = t('ui.yourName');
    
    const userEmail = document.getElementById('userEmail');
    if (userEmail) userEmail.placeholder = t('ui.yourEmail');
    
    const extendedTestLabel = document.querySelector('#extendedTest').nextElementSibling;
    if (extendedTestLabel) extendedTestLabel.textContent = t('ui.extendedTests');
    
    const kidsTestLabel = document.querySelector('#kidsTest').nextElementSibling;
    if (kidsTestLabel) kidsTestLabel.textContent = t('ui.kidsTests');
    
    const getFreeTests = document.querySelector('#contactForm button');
    if (getFreeTests) getFreeTests.textContent = t('ui.getFreeTests');
    
    const noSpam = document.querySelector('#contactForm .form-note');
    if (noSpam) noSpam.textContent = t('ui.noSpam');
    
    const thanks = document.querySelector('#ctaSuccess h3');
    if (thanks) thanks.textContent = t('ui.thanks');
    
    const thanksText = document.querySelector('#ctaSuccess p');
    if (thanksText) thanksText.textContent = t('ui.thanksText');
    
    // Кнопки поделиться
    const shareLinkStart = document.getElementById('shareLinkStart');
    if (shareLinkStart) shareLinkStart.innerHTML = `<span>${t('ui.copyLink')}</span>`;
    
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    if (bookmarkBtn) bookmarkBtn.innerHTML = `<span>${t('ui.addToBookmarks')}</span>`;
    
    const fullTestsLink = document.querySelector('.full-test-link a');
    if (fullTestsLink) fullTestsLink.textContent = t('ui.fullTestsLink');
}

function updateResultScreenTranslations() {
    const resultTitle = document.querySelector('#resultScreen h1');
    if (resultTitle) resultTitle.textContent = t('ui.testComplete');
    
    const sendResultsTitle = document.querySelector('#sendResultsBox h3');
    if (sendResultsTitle) sendResultsTitle.textContent = t('ui.sendResultsTitle');
    
    const sendResultsText = document.querySelector('#sendResultsBox .send-results-text');
    if (sendResultsText) sendResultsText.textContent = t('ui.sendResultsText');
    
    const sendResultsName = document.getElementById('sendResultsName');
    if (sendResultsName) sendResultsName.placeholder = t('ui.yourName');
    
    const sendResultsEmail = document.getElementById('sendResultsEmail');
    if (sendResultsEmail) sendResultsEmail.placeholder = t('ui.yourEmail');
    
    const sendResultsBtn = document.querySelector('#sendResultsForm button');
    if (sendResultsBtn) sendResultsBtn.textContent = t('ui.sendResults');
    
    const resultsWillBeSent = document.querySelector('#sendResultsSuccess p');
    if (resultsWillBeSent) resultsWillBeSent.textContent = t('ui.resultsWillBeSent');
    
    const shareTitle = document.querySelector('#shareBox h3');
    if (shareTitle) shareTitle.textContent = t('ui.shareTitle');
    
    const shareText = document.querySelector('#shareBox .share-text');
    if (shareText) shareText.textContent = t('ui.shareText');
    
    const shareLink = document.getElementById('shareLink');
    if (shareLink) shareLink.innerHTML = `<span>${t('ui.copyLink')}</span>`;
}

// Инициализация
// Worker URL для отправки email
const WORKER_URL = 'https://iqtestemails.gorelikgo.workers.dev';

// Главная функция инициализации - вызывается после загрузки DOM
function init() {
    console.log('🚀 Начало инициализации...');
    
    // Инициализируем язык и вопросы (после загрузки translations.js)
    try {
        currentLang = getCurrentLanguage();
        questions = getQuestions();
        console.log(`✅ Язык: ${currentLang}, Вопросов: ${questions.length}`);
    } catch (error) {
        console.error('❌ Ошибка загрузки переводов:', error);
        // Fallback на русский
        currentLang = 'ru';
        questions = [];
    }
    
    // Сначала получаем все элементы
    welcomeScreen = document.getElementById('welcomeScreen');
    testScreen = document.getElementById('testScreen');
    resultScreen = document.getElementById('resultScreen');
    startBtn = document.getElementById('startBtn');
    nextBtn = document.getElementById('nextBtn');
    restartBtn = document.getElementById('restartBtn');
    questionText = document.getElementById('questionText');
    optionsContainer = document.getElementById('optionsContainer');
    progressFill = document.getElementById('progressFill');
    currentQuestionSpan = document.getElementById('currentQuestion');
    totalQuestionsSpan = document.getElementById('totalQuestions');
    
    console.log('📋 Элементы найдены:', {
        welcomeScreen: !!welcomeScreen,
        testScreen: !!testScreen,
        resultScreen: !!resultScreen,
        startBtn: !!startBtn,
        nextBtn: !!nextBtn,
        restartBtn: !!restartBtn
    });
    
    // Применяем переводы
    applyTranslations();
    
    // Инициализируем счетчик вопросов
    if (totalQuestionsSpan) {
        totalQuestionsSpan.textContent = questions.length;
    }
    
    // Обновляем счетчик вопросов в HTML
    const questionCounter = document.querySelector('.question-counter');
    if (questionCounter) {
        questionCounter.innerHTML = `${t('ui.questionCounter')} <span id="currentQuestion">1</span> ${t('ui.questionOf')} <span id="totalQuestions">${questions.length}</span>`;
        // Обновляем ссылки после изменения HTML
        currentQuestionSpan = document.getElementById('currentQuestion');
        totalQuestionsSpan = document.getElementById('totalQuestions');
    }
    
    // Привязываем обработчики кнопок
    if (startBtn) {
        // Удаляем старый обработчик, если есть
        startBtn.removeEventListener('click', startTest);
        startBtn.addEventListener('click', function(e) {
            console.log('🔵 startBtn кликнут!');
            e.preventDefault();
            startTest();
        });
        console.log('✅ startBtn инициализирован, функция startTest:', typeof startTest);
    } else {
        console.error('❌ startBtn не найден!');
    }
    if (nextBtn) {
        nextBtn.removeEventListener('click', nextQuestion);
        nextBtn.addEventListener('click', function(e) {
            console.log('🔵 nextBtn кликнут!');
            e.preventDefault();
            nextQuestion();
        });
        console.log('✅ nextBtn инициализирован');
    }
    if (restartBtn) {
        restartBtn.removeEventListener('click', restartTest);
        restartBtn.addEventListener('click', function(e) {
            console.log('🔵 restartBtn кликнут!');
            e.preventDefault();
            restartTest();
        });
        console.log('✅ restartBtn инициализирован');
    }
    
    // Инициализируем формы
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            console.log('🔵 contactForm отправлена!');
            handleFormSubmit(e);
        });
        console.log('✅ contactForm инициализирован');
    } else {
        console.warn('⚠️ contactForm не найден (это нормально, если мы на стартовой странице)');
    }

    // Инициализируем кнопки шаринга
initStartPageShareButtons();
initStartPageContactForm();
    
    // Инициализируем ссылку на статью "Как повысить IQ"
    const improveIqLink = document.querySelector('.btn-improve-iq');
    if (improveIqLink) {
        improveIqLink.addEventListener('click', function(e) {
            console.log('🔵 Клик по ссылке "Как повысить IQ"');
            if (typeof clarity !== 'undefined') {
                clarity('event', 'article_improve_iq_click');
            }
            // Разрешаем стандартное поведение ссылки (переход на страницу)
        });
        console.log('✅ Ссылка на статью "Как повысить IQ" инициализирована');
    }
    
    // Инициализация игры памяти теперь происходит напрямую на странице memory-training.html
    // Здесь только инициализируем обработчики для страницы результатов (если нужно)
    
    // Проверяем URL параметры
    checkUrlParams();
    
    console.log('✅ Инициализация завершена');
}

// Флаг для предотвращения двойной инициализации
let isInitialized = false;

// Инициализация при загрузке DOM
function doInit() {
    if (isInitialized) {
        console.warn('⚠️ Уже инициализировано, пропускаем');
        return;
    }
    
    console.log('🚀 Начинаем инициализацию...');
    
    // Проверяем, что translations.js загружен
    if (typeof getCurrentLanguage === 'undefined' || typeof getQuestions === 'undefined') {
        console.error('❌ translations.js не загружен!');
        return;
    }
    
    isInitialized = true;
    init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doInit);
} else {
    // DOM уже загружен
    doInit();
}

function startTest() {
    if (!welcomeScreen || !testScreen) {
        console.error('❌ Элементы не инициализированы!');
        return;
    }
    welcomeScreen.style.display = 'none';
    testScreen.style.display = 'block';
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

// Делаем функцию доступной глобально для Puppeteer
window.startTest = startTest;

function showQuestion() {
    if (!questionText || !optionsContainer || !currentQuestionSpan || !progressFill || !nextBtn) {
        console.error('❌ Элементы не инициализированы в showQuestion!');
        return;
    }
    
    const question = questions[currentQuestionIndex];
    selectedAnswer = null;
    
    // Обновляем счетчик
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    
    // Обновляем прогресс
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressFill.style.width = progress + '%';
    
    // Показываем вопрос
    let questionHTML = `<h2>${question.question}</h2>`;
    if (question.data) {
        questionHTML += `<div class="question-data">${question.data}</div>`;
    }
    questionText.innerHTML = questionHTML;
    
    // Показываем варианты ответов
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(optionDiv);
    });
    
    nextBtn.style.display = 'none';
}

function selectAnswer(index) {
    selectedAnswer = index;
    
    // Убираем предыдущий выбор
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'wrong');
    });
    
    const selectedOption = document.querySelectorAll('.option')[index];
    selectedOption.classList.add('selected');
    
    // Проверяем ответ
    const question = questions[currentQuestionIndex];
    if (index === question.correct) {
        selectedOption.classList.add('correct');
        score++;
    } else {
        selectedOption.classList.add('wrong');
        // Показываем правильный ответ
        document.querySelectorAll('.option')[question.correct].classList.add('correct');
    }
    
    // Показываем кнопку "Следующий"
    nextBtn.style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function calculateIQ(score, total) {
    // Простая формула: базовый IQ 100, +10 за каждый правильный ответ
    // Это упрощенная модель, не научная
    const percentage = (score / total) * 100;
    
    // Базовый IQ = 100
    // Максимальный IQ при 100% = 130
    // Минимальный IQ при 0% = 70
    const baseIQ = 100;
    const iqRange = 30; // ±30 от базового
    
    const estimatedIQ = baseIQ + ((percentage - 50) / 50) * iqRange;
    
    // Округляем до ближайшего 5
    const roundedIQ = Math.round(estimatedIQ / 5) * 5;
    
    // Широкий диапазон для неточности быстрого теста
    const range = 40; // ±40 пунктов
    const minIQ = Math.max(70, roundedIQ - range);
    const maxIQ = Math.min(160, roundedIQ + range);
    
    return {
        estimated: roundedIQ,
        min: minIQ,
        max: maxIQ,
        percentage: percentage
    };
}

// getIQDescription теперь используется из translations.js

function showResult() {
    if (!testScreen || !resultScreen) {
        console.error('❌ Элементы не инициализированы в showResult!');
        return;
    }
    testScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    
    iqResult = calculateIQ(score, questions.length);
    
    const iqValueEl = document.getElementById('iqValue');
    const iqRangeEl = document.getElementById('iqRange');
    const iqDescriptionEl = document.getElementById('iqDescription');
    
    if (iqValueEl) iqValueEl.textContent = `≈ ${iqResult.estimated}`;
    if (iqRangeEl) iqRangeEl.textContent = `${t('ui.range')} ${iqResult.min} - ${iqResult.max}`;
    if (iqDescriptionEl) iqDescriptionEl.textContent = getIQDescription(iqResult.estimated);
    
    // Инициализируем кнопки поделиться
    initShareButtons();
    
    // Инициализация формы отправки результатов
    const sendResultsForm = document.getElementById('sendResultsForm');
    const sendResultsSuccess = document.getElementById('sendResultsSuccess');
    if (sendResultsForm && sendResultsSuccess) {
        sendResultsForm.style.display = 'block';
        sendResultsSuccess.style.display = 'none';
        // Убеждаемся, что обработчик добавлен
        if (!sendResultsForm.hasAttribute('data-handler-attached')) {
            sendResultsForm.addEventListener('submit', handleSendResultsSubmit);
            sendResultsForm.setAttribute('data-handler-attached', 'true');
        }
    }
    
    // Добавляем предупреждение
    const warning = document.createElement('div');
    warning.className = 'result-warning';
    warning.innerHTML = `
        <p><strong>${t('ui.remember')}</strong> ${t('ui.rememberText')}</p>
        <p style="margin-top: 10px;"><strong>${t('ui.disclaimer')}</strong> ${t('ui.disclaimerText')}</p>
        <p style="margin-top: 10px;">${t('ui.correctAnswers')} ${score} ${t('ui.of')} ${questions.length}</p>
    `;
    resultScreen.querySelector('.result-box').appendChild(warning);
    
    // Показываем форму сбора контактов
    showContactForm();
}

function showContactForm() {
    const contactForm = document.getElementById('contactForm');
    const ctaSuccess = document.getElementById('ctaSuccess');
    
    // Сбрасываем форму и показываем
    if (contactForm && ctaSuccess) {
        contactForm.style.display = 'block';
        ctaSuccess.style.display = 'none';
        contactForm.reset();
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const extendedTest = document.getElementById('extendedTest').checked;
    const kidsTest = document.getElementById('kidsTest').checked;
    
    // Проверяем, что выбран хотя бы один вариант
    if (!extendedTest && !kidsTest) {
        alert('Пожалуйста, выберите хотя бы один тип теста');
        return;
    }
    
    // Подготавливаем данные для отправки
    const contactData = {
        type: 'iq-test',
        name: userName,
        email: userEmail,
        extendedTest: extendedTest,
        kidsTest: kidsTest,
        sendResults: false,
        iqResult: null,
        source: 'result-page',
        timestamp: new Date().toISOString()
    };
    
    // Сохраняем в localStorage (бэкап)
    let contacts = JSON.parse(localStorage.getItem('iqTestContacts') || '[]');
    contacts.push(contactData);
    localStorage.setItem('iqTestContacts', JSON.stringify(contacts));
    
    // Отправляем на Worker
    try {
        console.log('Отправка данных на Worker:', contactData);
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });
        
        console.log('Ответ от Worker:', response.status, response.statusText);
        const result = await response.json();
        console.log('Результат от Worker:', result);
        
        if (result.success) {
            // Показываем алерт пользователю
            alert(`Спасибо, ${userName}! Мы получили ваш email и отправим вам все варианты тестов.`);
            
            // Показываем успешное сообщение
            document.getElementById('contactForm').style.display = 'none';
            document.getElementById('ctaSuccess').style.display = 'block';
        } else {
            console.error('Ошибка отправки:', result.error);
            alert(t('ui.errorSending'));
            
            // Все равно показываем успех, но с предупреждением
            document.getElementById('contactForm').style.display = 'none';
            document.getElementById('ctaSuccess').style.display = 'block';
        }
    } catch (error) {
        console.error('Ошибка отправки на Worker:', error);
        alert(t('ui.errorSending'));
        
        // Все равно показываем успех
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('ctaSuccess').style.display = 'block';
    }
    
    console.log('Contact saved:', contactData);
}

// Обработка отправки результатов на email
async function handleSendResultsSubmit(e) {
    e.preventDefault();
    
    const userName = document.getElementById('sendResultsName').value;
    const userEmail = document.getElementById('sendResultsEmail').value;
    
    if (!iqResult) {
        alert(t('ui.errorResults'));
        return;
    }
    
    // Подготавливаем данные для отправки
    const sendResultsData = {
        type: 'send-results-only',
        name: userName,
        email: userEmail,
        iqResult: {
            estimated: iqResult.estimated,
            min: iqResult.min,
            max: iqResult.max,
            score: score,
            total: questions.length,
            level: getIQDescription(iqResult.estimated) // Добавляем уровень IQ
        },
        shareUrl: getShareUrl(),
        source: 'result-page',
        timestamp: new Date().toISOString()
    };
    
    // Сохраняем в localStorage (бэкап)
    let contacts = JSON.parse(localStorage.getItem('iqTestContacts') || '[]');
    contacts.push(sendResultsData);
    localStorage.setItem('iqTestContacts', JSON.stringify(contacts));
    
    // Отправляем на Worker
    try {
        console.log('Отправка результатов на email:', sendResultsData);
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sendResultsData)
        });
        
        console.log('Ответ от Worker (отправка результатов):', response.status, response.statusText);
        const result = await response.json();
        console.log('Результат от Worker (отправка результатов):', result);
        
        if (result.success) {
            // Показываем алерт пользователю
            alert(t('ui.thanksResults', { name: userName, iq: iqResult.estimated }));
            
            // Показываем успешное сообщение
            document.getElementById('sendResultsForm').style.display = 'none';
            document.getElementById('sendResultsSuccess').style.display = 'block';
        } else {
            console.error('Ошибка отправки:', result.error);
            alert(t('ui.errorSending'));
        }
    } catch (error) {
        console.error('Ошибка отправки на Worker:', error);
        alert(t('ui.errorSending'));
    }
    
    console.log('Send results saved:', sendResultsData);
}

function restartTest() {
    if (!resultScreen || !welcomeScreen) {
        console.error('❌ Элементы не инициализированы в restartTest!');
        return;
    }
    resultScreen.style.display = 'none';
    welcomeScreen.style.display = 'block';
    // Удаляем предупреждение, если оно было добавлено
    const warning = resultScreen.querySelector('.result-warning');
    if (warning) {
        warning.remove();
    }
}

// Функции для поделиться результатами
function initShareButtons() {
    console.log('🔵 Инициализация кнопок поделиться результатами...');
    const currentLang = getCurrentLanguage();
    
    // Для русской версии
    if (currentLang === 'ru') {
        const shareVK = document.getElementById('shareVK');
        const shareTelegram = document.getElementById('shareTelegram');
        const shareWhatsApp = document.getElementById('shareWhatsApp');
        const shareLink = document.getElementById('shareLink');
        
        console.log('Кнопки найдены:', {
            shareVK: !!shareVK,
            shareTelegram: !!shareTelegram,
            shareWhatsApp: !!shareWhatsApp,
            shareLink: !!shareLink
        });
        
        if (shareVK) {
            shareVK.removeEventListener('click', shareToVK); // Удаляем старый обработчик если есть
            shareVK.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔵 shareVK кликнут!');
                shareToVK();
            });
        }
        if (shareTelegram) {
            shareTelegram.removeEventListener('click', shareToTelegram);
            shareTelegram.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔵 shareTelegram кликнут!');
                shareToTelegram();
            });
        }
        if (shareWhatsApp) {
            shareWhatsApp.removeEventListener('click', shareToWhatsApp);
            shareWhatsApp.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔵 shareWhatsApp кликнут!');
                shareToWhatsApp();
            });
        }
        if (shareLink) {
            shareLink.removeEventListener('click', copyShareLink);
            shareLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔵 shareLink кликнут!');
                copyShareLink();
            });
        }
    } else {
        // Для английской версии
        const shareFacebook = document.getElementById('shareFacebook');
        const shareTwitter = document.getElementById('shareTwitter');
        const shareWhatsApp = document.getElementById('shareWhatsApp');
        const shareLink = document.getElementById('shareLink');
        const shareTelegram = document.getElementById('shareTelegram');
        
        console.log('Кнопки найдены:', {
            shareFacebook: !!shareFacebook,
            shareTwitter: !!shareTwitter,
            shareWhatsApp: !!shareWhatsApp,
            shareLink: !!shareLink,
            shareTelegram: !!shareTelegram
        });
        
        if (shareFacebook) {
            shareFacebook.removeEventListener('click', shareToFacebook);
            shareFacebook.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔵 shareFacebook кликнут!');
                shareToFacebook();
            });
        }
        if (shareTwitter) {
            shareTwitter.removeEventListener('click', shareToTwitter);
            shareTwitter.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔵 shareTwitter кликнут!');
                shareToTwitter();
            });
        }
        if (shareWhatsApp) {
            shareWhatsApp.removeEventListener('click', shareToWhatsApp);
            shareWhatsApp.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔵 shareWhatsApp кликнут!');
                shareToWhatsApp();
            });
        }
        if (shareLink) {
            shareLink.removeEventListener('click', copyShareLink);
            shareLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔵 shareLink кликнут!');
                copyShareLink();
            });
        }
        if (shareTelegram) {
            shareTelegram.removeEventListener('click', shareToTelegram);
            shareTelegram.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔵 shareTelegram кликнут!');
                shareToTelegram();
            });
        }
    }
    console.log('✅ Кнопки поделиться результатами инициализированы');
}

function getShareText() {
    if (!iqResult) {
        console.error('❌ iqResult не установлен!');
        return '';
    }
    try {
        return t('ui.shareResultText', { iq: iqResult.estimated, min: iqResult.min, max: iqResult.max });
    } catch (error) {
        console.error('❌ Ошибка получения текста для шаринга:', error);
        return `Мой IQ результат: примерно ${iqResult.estimated} (диапазон ${iqResult.min}-${iqResult.max})`;
    }
}

function getShareUrl() {
    if (!iqResult) {
        console.error('❌ iqResult не установлен!');
        return window.location.href;
    }
    
    // Используем продакшн URL вместо локального file://
    const productionUrl = 'https://iqtestnow.org';
    const isLocal = window.location.protocol === 'file:';
    
    let baseUrl;
    if (isLocal) {
        // Для локальной разработки используем продакшн URL
        const currentLang = getCurrentLanguage();
        baseUrl = productionUrl + '/' + currentLang + '/index.html';
    } else {
        baseUrl = window.location.origin + window.location.pathname;
    }
    
    try {
        const params = new URLSearchParams({
            iq: iqResult.estimated,
            min: iqResult.min,
            max: iqResult.max,
            score: score,
            total: questions.length
        });
        return `${baseUrl}?${params.toString()}`;
    } catch (error) {
        console.error('❌ Ошибка создания URL для шаринга:', error);
        return baseUrl;
    }
}

function shareToVK() {
    try {
        const url = getShareUrl();
        const text = getShareText();
        console.log('🔵 Поделиться в VK:', { url, text });
        
        // Отслеживание в Clarity
        if (typeof clarity !== 'undefined') {
            clarity('event', 'share_vk');
        }
        
        const shareUrl = `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    } catch (error) {
        console.error('❌ Ошибка при шаринге в VK:', error);
        alert('Ошибка при открытии окна поделиться. Попробуйте скопировать ссылку.');
    }
}

function shareToTelegram() {
    try {
        const url = getShareUrl();
        const text = getShareText() + ' ' + url;
        console.log('🔵 Поделиться в Telegram:', { url, text });
        
        // Отслеживание в Clarity
        if (typeof clarity !== 'undefined') {
            clarity('event', 'share_telegram');
        }
        
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    } catch (error) {
        console.error('❌ Ошибка при шаринге в Telegram:', error);
        alert('Ошибка при открытии окна поделиться. Попробуйте скопировать ссылку.');
    }
}

function shareToWhatsApp() {
    try {
        const url = getShareUrl();
        const text = getShareText() + ' ' + url;
        console.log('🔵 Поделиться в WhatsApp:', { url, text });
        
        // Отслеживание в Clarity
        if (typeof clarity !== 'undefined') {
            clarity('event', 'share_whatsapp');
        }
        
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank');
    } catch (error) {
        console.error('❌ Ошибка при шаринге в WhatsApp:', error);
        alert('Ошибка при открытии окна поделиться. Попробуйте скопировать ссылку.');
    }
}

function shareToFacebook() {
    try {
        const url = getShareUrl();
        const text = getShareText(); // URL не добавляем в quote, Facebook добавит его сам из параметра u
        console.log('🔵 Поделиться в Facebook:', { url, text });
        
        // Отслеживание в Clarity
        if (typeof clarity !== 'undefined') {
            clarity('event', 'share_facebook');
        }
        
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    } catch (error) {
        console.error('❌ Ошибка при шаринге в Facebook:', error);
        alert('Ошибка при открытии окна поделиться. Попробуйте скопировать ссылку.');
    }
}

function shareToTwitter() {
    try {
        const url = getShareUrl();
        const text = getShareText(); // URL не добавляем в текст, Twitter добавит его сам из параметра url
        console.log('🔵 Поделиться в Twitter:', { url, text });
        
        // Отслеживание в Clarity
        if (typeof clarity !== 'undefined') {
            clarity('event', 'share_twitter');
        }
        
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    } catch (error) {
        console.error('❌ Ошибка при шаринге в Twitter:', error);
        alert('Ошибка при открытии окна поделиться. Попробуйте скопировать ссылку.');
    }
}

function copyShareLink() {
    try {
        const url = getShareUrl();
        const text = getShareText() + ' ' + url;
        console.log('🔵 Копирование ссылки:', { url, text });
        
        // Отслеживание в Clarity
        if (typeof clarity !== 'undefined') {
            clarity('event', 'share_link_copy');
        }
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('✅ Ссылка скопирована в буфер обмена');
                showShareSuccess();
            }).catch((error) => {
                console.error('❌ Ошибка копирования в буфер обмена:', error);
                // Fallback для старых браузеров
                fallbackCopyText(text);
            });
        } else {
            // Fallback для старых браузеров
            fallbackCopyText(text);
        }
    } catch (error) {
        console.error('❌ Ошибка при копировании ссылки:', error);
        alert('Ошибка при копировании ссылки. Попробуйте еще раз.');
    }
}

function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        console.log('✅ Ссылка скопирована (fallback метод)');
        showShareSuccess();
    } catch (error) {
        console.error('❌ Ошибка копирования (fallback метод):', error);
        alert('Не удалось скопировать ссылку. Попробуйте выделить текст вручную.');
    } finally {
        document.body.removeChild(textarea);
    }
}

function showShareSuccess() {
    const shareSuccess = document.getElementById('shareSuccess');
    if (shareSuccess) {
        shareSuccess.textContent = t('ui.linkCopied');
        shareSuccess.style.display = 'block';
        setTimeout(() => {
            shareSuccess.style.display = 'none';
        }, 2000);
    }
}

// Функции sendResultsEmail и generateEmailContent больше не нужны - 
// отправка происходит через Worker в handleFormSubmit

// Функции для поделиться на стартовой странице
function initStartPageShareButtons() {
    console.log('🔵 Инициализация кнопок шаринга на стартовой странице...');
    const currentLang = getCurrentLanguage();
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', function(e) {
            console.log('🔵 bookmarkBtn кликнут!');
            e.preventDefault();
            addToBookmarks();
        });
        console.log('✅ bookmarkBtn инициализирован');
    }
    
    // Для русской версии
    if (currentLang === 'ru') {
    const shareVKStart = document.getElementById('shareVKStart');
    const shareTelegramStart = document.getElementById('shareTelegramStart');
    const shareWhatsAppStart = document.getElementById('shareWhatsAppStart');
    const shareLinkStart = document.getElementById('shareLinkStart');
        
        if (shareVKStart) {
            shareVKStart.addEventListener('click', function(e) {
                console.log('🔵 shareVKStart кликнут!');
                e.preventDefault();
                shareToVKStart();
            });
            console.log('✅ shareVKStart инициализирован');
        }
        if (shareTelegramStart) {
            shareTelegramStart.addEventListener('click', function(e) {
                console.log('🔵 shareTelegramStart кликнут!');
                e.preventDefault();
                shareToTelegramStart();
            });
            console.log('✅ shareTelegramStart инициализирован');
        }
        if (shareWhatsAppStart) {
            shareWhatsAppStart.addEventListener('click', function(e) {
                console.log('🔵 shareWhatsAppStart кликнут!');
                e.preventDefault();
                shareToWhatsAppStart();
            });
            console.log('✅ shareWhatsAppStart инициализирован');
        }
        if (shareLinkStart) {
            shareLinkStart.addEventListener('click', function(e) {
                console.log('🔵 shareLinkStart кликнут!');
                e.preventDefault();
                copyShareLinkStart();
            });
            console.log('✅ shareLinkStart инициализирован');
        }
    } else {
        // Для английской версии
        const shareFacebookStart = document.getElementById('shareFacebookStart');
        const shareTwitterStart = document.getElementById('shareTwitterStart');
        const shareWhatsAppStart = document.getElementById('shareWhatsAppStart');
        const shareLinkStart = document.getElementById('shareLinkStart');
        const shareTelegramStart = document.getElementById('shareTelegramStart');
        
        if (shareFacebookStart) {
            shareFacebookStart.addEventListener('click', function(e) {
                console.log('🔵 shareFacebookStart кликнут!');
                e.preventDefault();
                shareToFacebookStart();
            });
            console.log('✅ shareFacebookStart инициализирован');
        }
        if (shareTwitterStart) {
            shareTwitterStart.addEventListener('click', function(e) {
                console.log('🔵 shareTwitterStart кликнут!');
                e.preventDefault();
                shareToTwitterStart();
            });
            console.log('✅ shareTwitterStart инициализирован');
        }
        if (shareWhatsAppStart) {
            shareWhatsAppStart.addEventListener('click', function(e) {
                console.log('🔵 shareWhatsAppStart кликнут!');
                e.preventDefault();
                shareToWhatsAppStart();
            });
            console.log('✅ shareWhatsAppStart инициализирован');
        }
        if (shareLinkStart) {
            shareLinkStart.addEventListener('click', function(e) {
                console.log('🔵 shareLinkStart кликнут!');
                e.preventDefault();
                copyShareLinkStart();
            });
            console.log('✅ shareLinkStart инициализирован');
        }
        if (shareTelegramStart) {
            shareTelegramStart.addEventListener('click', function(e) {
                console.log('🔵 shareTelegramStart кликнут!');
                e.preventDefault();
                shareToTelegramStart();
            });
            console.log('✅ shareTelegramStart инициализирован');
        }
    }
    console.log('✅ Кнопки шаринга на стартовой странице инициализированы');
}

function getStartPageShareText() {
    return t('ui.shareStartText');
}

function getStartPageShareUrl() {
    // Используем продакшн URL вместо локального file://
    const productionUrl = 'https://iqtestnow.org';
    const isLocal = window.location.protocol === 'file:';
    
    if (isLocal) {
        // Для локальной разработки определяем язык из пути
        const path = window.location.pathname;
        const lang = path.includes('/en/') ? 'en' : 'ru';
        return `${productionUrl}/${lang}/index.html`;
    }
    
    return window.location.href;
}

function shareToVKStart() {
    const url = getStartPageShareUrl();
    const text = getStartPageShareText();
    
    // Отслеживание в Clarity
    if (typeof clarity !== 'undefined') {
        clarity('event', 'share_vk_start');
    }
    
    window.open(`https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
}

function shareToTelegramStart() {
    const url = getStartPageShareUrl();
    const text = getStartPageShareText() + url;
    
    // Отслеживание в Clarity
    if (typeof clarity !== 'undefined') {
        clarity('event', 'share_telegram_start');
    }
    
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
}

function shareToWhatsAppStart() {
    const url = getStartPageShareUrl();
    const text = getStartPageShareText() + url;
    
    // Отслеживание в Clarity
    if (typeof clarity !== 'undefined') {
        clarity('event', 'share_whatsapp_start');
    }
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

function shareToFacebookStart() {
    const url = getStartPageShareUrl();
    const text = getStartPageShareText(); // URL не добавляем в quote, Facebook добавит его сам из параметра u
    
    // Отслеживание в Clarity
    if (typeof clarity !== 'undefined') {
        clarity('event', 'share_facebook_start');
    }
    
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
}

function shareToTwitterStart() {
    const url = getStartPageShareUrl();
    const text = getStartPageShareText(); // URL не добавляем в текст, Twitter добавит его сам из параметра url
    
    // Отслеживание в Clarity
    if (typeof clarity !== 'undefined') {
        clarity('event', 'share_twitter_start');
    }
    
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
}

function copyShareLinkStart() {
    const url = getStartPageShareUrl();
    const text = getStartPageShareText() + url;
    
    // Отслеживание в Clarity
    if (typeof clarity !== 'undefined') {
        clarity('event', 'share_link_copy_start');
    }
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showShareSuccessStart();
        });
    } else {
        // Fallback для старых браузеров
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showShareSuccessStart();
    }
}

function showShareSuccessStart() {
    const shareSuccess = document.getElementById('shareSuccessStart');
    if (shareSuccess) {
        shareSuccess.textContent = t('ui.linkCopied');
        shareSuccess.style.display = 'block';
        setTimeout(() => {
            shareSuccess.style.display = 'none';
        }, 2000);
    }
}

function addToBookmarks() {
    const url = window.location.href;
    const title = currentLang === 'en' ? 'IQ Test Online - Quick IQ Test in 2-3 minutes' : 'IQ Тест Онлайн - Быстрый тест IQ за 2-3 минуты';
    
    // Проверяем поддержку API закладок
    if (window.sidebar && window.sidebar.addPanel) {
        // Firefox
        window.sidebar.addPanel(title, url, '');
        showBookmarkSuccess();
    } else if (window.external && ('AddFavorite' in window.external)) {
        // IE
        window.external.AddFavorite(url, title);
        showBookmarkSuccess();
    } else if (window.opera && window.print) {
        // Opera
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('title', title);
        a.setAttribute('rel', 'sidebar');
        a.click();
        showBookmarkSuccess();
    } else {
        // Современные браузеры (Chrome, Safari, Edge)
        // Показываем инструкцию
        const bookmarkSuccess = document.getElementById('bookmarkSuccess');
        if (bookmarkSuccess) {
            bookmarkSuccess.innerHTML = t('ui.bookmarkInstruction');
            bookmarkSuccess.style.display = 'block';
            setTimeout(() => {
                bookmarkSuccess.style.display = 'none';
            }, 4000);
        }
    }
}

function showBookmarkSuccess() {
    const bookmarkSuccess = document.getElementById('bookmarkSuccess');
    if (bookmarkSuccess) {
        bookmarkSuccess.innerHTML = t('ui.bookmarkAdded');
        bookmarkSuccess.style.display = 'block';
        setTimeout(() => {
            bookmarkSuccess.style.display = 'none';
        }, 2000);
    }
}

// Проверяем URL параметры при загрузке (если кто-то перешел по ссылке с результатами)
function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('iq')) {
        // Отслеживание переходов по ссылкам с результатами в Clarity
        if (typeof clarity !== 'undefined') {
            clarity('event', 'share_referral');
        }
        
        console.log('Shared result:', {
            iq: params.get('iq'),
            min: params.get('min'),
            max: params.get('max')
        });
    }
}

// Инициализация формы на стартовой странице
function initStartPageContactForm() {
    console.log('🔵 Инициализация формы на стартовой странице...');
    const contactFormStart = document.getElementById('contactFormStart');
    if (contactFormStart) {
        contactFormStart.addEventListener('submit', function(e) {
            console.log('🔵 contactFormStart отправлена!');
            handleStartPageFormSubmit(e);
        });
        console.log('✅ contactFormStart инициализирован');
    } else {
        console.warn('⚠️ contactFormStart не найден');
    }
}

async function handleStartPageFormSubmit(e) {
    e.preventDefault();
    
    const userName = document.getElementById('userNameStart').value;
    const userEmail = document.getElementById('userEmailStart').value;
    const extendedTest = document.getElementById('extendedTestStart').checked;
    const kidsTest = document.getElementById('kidsTestStart').checked;
    
    // Проверяем, что выбран хотя бы один вариант
    if (!extendedTest && !kidsTest) {
        alert('Пожалуйста, выберите хотя бы один тип теста');
        return;
    }
    
    // Подготавливаем данные для отправки
    const contactData = {
        type: 'full-tests',
        name: userName,
        email: userEmail,
        extendedTest: extendedTest,
        kidsTest: kidsTest,
        sendResults: false,
        source: 'start-page',
        timestamp: new Date().toISOString()
    };
    
    // Сохраняем в localStorage (бэкап)
    let contacts = JSON.parse(localStorage.getItem('iqTestContacts') || '[]');
    contacts.push(contactData);
    localStorage.setItem('iqTestContacts', JSON.stringify(contacts));
    
    // Отправляем на Worker
    try {
        console.log('Отправка данных на Worker (стартовая страница):', contactData);
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });
        
        console.log('Ответ от Worker (стартовая страница):', response.status, response.statusText);
        const result = await response.json();
        console.log('Результат от Worker (стартовая страница):', result);
        
        if (result.success) {
            // Показываем алерт пользователю
            alert(t('ui.thanksName', { name: userName }));
            
            // Показываем успешное сообщение
            document.getElementById('contactFormStart').style.display = 'none';
            document.getElementById('ctaSuccessStart').style.display = 'block';
        } else {
            console.error('Ошибка отправки:', result.error);
            alert(t('ui.errorSending'));
            
            // Все равно показываем успех
            document.getElementById('contactFormStart').style.display = 'none';
            document.getElementById('ctaSuccessStart').style.display = 'block';
        }
    } catch (error) {
        console.error('Ошибка отправки на Worker:', error);
        alert(t('ui.errorSending'));
        
        // Все равно показываем успех
        document.getElementById('contactFormStart').style.display = 'none';
        document.getElementById('ctaSuccessStart').style.display = 'block';
    }
    
    console.log('Contact saved:', contactData);
}

// Сворачивание/разворачивание блока "Важно"
function toggleWarning() {
    const warningBox = document.getElementById('warningBox');
    if (warningBox) {
        warningBox.classList.toggle('collapsed');
        const toggleText = warningBox.querySelector('.toggle-text');
        if (toggleText) {
            if (warningBox.classList.contains('collapsed')) {
                toggleText.textContent = t('ui.expand');
            } else {
                toggleText.textContent = t('ui.collapse');
            }
        }
    }
}

// Делаем функцию доступной глобально
window.toggleWarning = toggleWarning;

// Инициализация: блок "Важно" свернут по умолчанию
// Класс collapsed уже добавлен в HTML, но убеждаемся что он есть
(function() {
    const warningBox = document.getElementById('warningBox');
    if (warningBox) {
        warningBox.classList.add('collapsed');
    }
})();

// checkUrlParams вызывается после инициализации через DOMContentLoaded
// init() теперь вызывается автоматически через DOMContentLoaded

// ==================== МИНИ-ИГРА "ТРЕНИРОВКА ПАМЯТИ" ====================

let memoryGameState = {
    sequence: [],
    userSequence: [],
    isShowing: false,
    isPlaying: false,
    score: 0
};

function initMemoryGame() {
    // Проверяем, что мы на странице игры памяти
    const isMemoryTrainingPage = window.location.pathname.includes('memory-training.html') || 
                                  window.location.href.includes('memory-training.html');
    if (!isMemoryTrainingPage) {
        console.log('⚠️ Not on memory-training page, skipping initMemoryGame');
        return; // Не инициализируем игру на других страницах
    }
    
    console.log('✅ Initializing memory game...');
    
    const startBtn = document.getElementById('startMemoryGameBtn');
    const emailModal = document.getElementById('memoryGameEmailModal');
    const emailForm = document.getElementById('memoryGameEmailForm');
    const emailLaterBtn = document.getElementById('memoryGameEmailLater');
    const gameContainer = document.getElementById('memoryGameContainer');
    const gameCloseBtn = document.getElementById('memoryGameClose');
    const gameCloseBtn2 = document.getElementById('memoryGameCloseBtn');
    const tryAgainBtn = document.getElementById('memoryGameTryAgain');
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            // Проверяем, видна ли модалка сейчас (через computed style)
            let isModalVisible = false;
            if (emailModal) {
                const computedStyle = window.getComputedStyle(emailModal);
                isModalVisible = computedStyle.display !== 'none';
            }
            
            if (isModalVisible) {
                // Модалка уже видна, ничего не делаем (пользователь может кликнуть "Later" или "Save")
                return;
            }
            
            // Если модалка была показана ранее (в sessionStorage), начинаем игру напрямую
            if (sessionStorage.getItem('memoryGameEmailShown')) {
                startMemoryGame();
            } else {
                // Показываем модалку впервые
                if (emailModal) {
                    emailModal.style.display = 'flex';
                    sessionStorage.setItem('memoryGameEmailShown', 'true');
                } else {
                    // Если модалки нет, начинаем игру
                    startMemoryGame();
                }
            }
        });
    }
    
    // Обработка формы email
    if (emailForm) {
        emailForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('memoryGameEmail').value;
            if (email) {
                // Сохраняем email (можно отправить на сервер позже)
                localStorage.setItem('memoryGameEmail', email);
                
                // Отслеживание в Clarity
                if (typeof clarity !== 'undefined') {
                    clarity('event', 'memory_game_email_saved');
                }
                
                // Закрываем модалку и начинаем игру
                if (emailModal) emailModal.style.display = 'none';
                startMemoryGame();
            }
        });
    }
    
    // Кнопка "Позже"
    if (emailLaterBtn) {
        console.log('✅ emailLaterBtn found, attaching handler...');
        emailLaterBtn.addEventListener('click', function(e) {
            console.log('🔵 Later button clicked!');
            e.preventDefault();
            e.stopPropagation();
            
            if (emailModal) {
                console.log('🔵 Closing modal...');
                emailModal.style.display = 'none';
            }
            // Отмечаем, что модалка была показана
            sessionStorage.setItem('memoryGameEmailShown', 'true');
            // Начинаем игру
            console.log('🔵 Starting game...');
            startMemoryGame();
        });
        console.log('✅ Handler attached to emailLaterBtn');
    } else {
        console.error('❌ emailLaterBtn not found!');
    }
    
    // Закрытие игры
    if (gameCloseBtn) {
        gameCloseBtn.addEventListener('click', closeMemoryGame);
    }
    if (gameCloseBtn2) {
        gameCloseBtn2.addEventListener('click', closeMemoryGame);
    }
    
    // Попробовать еще раз
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            resetMemoryGame();
            startMemoryGame();
        });
    }
}

function startMemoryGame() {
    console.log('🎮 startMemoryGame() called');
    const gameContainer = document.getElementById('memoryGameContainer');
    const gameBoard = document.getElementById('memoryGameBoard');
    const gameInstructions = document.getElementById('memoryGameInstructions');
    const gameResult = document.getElementById('memoryGameResult');
    const startBtn = document.getElementById('startMemoryGameBtn');
    const emailModal = document.getElementById('memoryGameEmailModal');
    
    if (!gameContainer || !gameBoard) {
        console.error('❌ Элементы игры не найдены!', { gameContainer: !!gameContainer, gameBoard: !!gameBoard });
        return;
    }
    
    console.log('🎮 Game elements found, starting game...');
    
    // Скрываем модалку если она видна
    if (emailModal) {
        emailModal.style.display = 'none';
    }
    
    // Скрываем кнопку "Начать игру"
    if (startBtn) {
        startBtn.style.display = 'none';
    }
    
    // Показываем контейнер игры
    gameContainer.style.display = 'block';
    
    // Скрываем результат
    if (gameResult) gameResult.style.display = 'none';
    
    // Генерируем последовательность из 8 чисел (1-9)
    memoryGameState.sequence = [];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        memoryGameState.sequence.push(numbers[randomIndex]);
        numbers.splice(randomIndex, 1); // Убираем использованное число
    }
    
    memoryGameState.userSequence = [];
    memoryGameState.isShowing = true;
    memoryGameState.isPlaying = false;
    memoryGameState.score = 0;
    
    // Отслеживание в Clarity
    if (typeof clarity !== 'undefined') {
        clarity('event', 'memory_game_start');
    }
    
    // Создаем игровое поле
    createMemoryGameBoard();
    
    // Показываем последовательность
    if (gameInstructions) {
        gameInstructions.textContent = t('ui.memoryGameRemembering');
    }
    
    showMemorySequence();
}

function createMemoryGameBoard() {
    const gameBoard = document.getElementById('memoryGameBoard');
    if (!gameBoard) return;
    
    gameBoard.innerHTML = '';
    
    // Создаем 9 карточек (числа от 1 до 9)
    for (let i = 1; i <= 9; i++) {
        const card = document.createElement('div');
        card.className = 'memory-game-card-item hidden';
        card.dataset.value = i;
        card.textContent = i;
        gameBoard.appendChild(card);
    }
}

function showMemorySequence() {
    const cards = document.querySelectorAll('.memory-game-card-item');
    let index = 0;
    
    // Показываем каждую карточку из последовательности по очереди
    function showNextCard() {
        if (index >= memoryGameState.sequence.length) {
            // Все карточки показаны, скрываем их
            setTimeout(() => {
                cards.forEach(card => {
                    card.classList.add('hidden');
                    card.classList.remove('showing');
                });
                
                // Переходим к игре
                setTimeout(() => {
                    memoryGameState.isShowing = false;
                    memoryGameState.isPlaying = true;
                    startUserTurn();
                }, 500);
            }, 500);
            return;
        }
        
        // Находим карточку с нужным числом
        const numberToShow = memoryGameState.sequence[index];
        cards.forEach(card => {
            if (parseInt(card.dataset.value) === numberToShow) {
                card.classList.remove('hidden');
                card.classList.add('showing');
            }
        });
        
        index++;
        
        // Показываем следующую карточку через 600мс
        setTimeout(showNextCard, 600);
    }
    
    showNextCard();
}

function startUserTurn() {
    const gameInstructions = document.getElementById('memoryGameInstructions');
    const cards = document.querySelectorAll('.memory-game-card-item');
    
    if (gameInstructions) {
        gameInstructions.textContent = t('ui.memoryGameYourTurn');
    }
    
    // Показываем все карточки с числами (в случайном порядке на доске)
    const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffledNumbers = [...allNumbers].sort(() => Math.random() - 0.5);
    
    cards.forEach((card, i) => {
        card.classList.remove('hidden', 'showing', 'correct', 'wrong');
        card.textContent = shuffledNumbers[i];
        card.dataset.value = shuffledNumbers[i];
        card.style.pointerEvents = 'auto';
        card.addEventListener('click', handleCardClick);
    });
}

function handleCardClick(e) {
    if (!memoryGameState.isPlaying) return;
    
    const card = e.target;
    if (card.classList.contains('correct') || card.classList.contains('wrong')) {
        return; // Уже кликнута
    }
    
    const value = parseInt(card.dataset.value);
    const expectedValue = memoryGameState.sequence[memoryGameState.userSequence.length];
    
    memoryGameState.userSequence.push(value);
    
    // Проверяем правильность
    if (value === expectedValue) {
        card.classList.add('correct');
        memoryGameState.score++;
    } else {
        // Неправильный ответ
        card.classList.add('wrong');
    }
    
    // Проверяем, закончилась ли последовательность (все 8 карточек кликнуты)
    if (memoryGameState.userSequence.length === memoryGameState.sequence.length) {
        // Даем небольшую задержку, чтобы пользователь увидел последний ответ
        setTimeout(() => {
            showMemoryGameResult();
        }, 500);
    }
}

function showMemoryGameResult() {
    const gameResult = document.getElementById('memoryGameResult');
    const gameResultText = document.getElementById('memoryGameResultText');
    const gameBoard = document.getElementById('memoryGameBoard');
    const gameInstructions = document.getElementById('memoryGameInstructions');
    
    memoryGameState.isPlaying = false;
    
    if (gameResult) gameResult.style.display = 'block';
    if (gameBoard) gameBoard.style.display = 'none';
    if (gameInstructions) gameInstructions.style.display = 'none';
    
    const score = memoryGameState.score;
    const total = memoryGameState.sequence.length;
    
    if (gameResultText) {
        // Убеждаемся, что значения передаются как числа
        const resultText = t('ui.memoryGameResult', { score: score, total: total });
        console.log('Memory game result:', { score, total, resultText });
        gameResultText.textContent = resultText;
    }
    
    // Отслеживание в Clarity
    if (typeof clarity !== 'undefined') {
        clarity('event', 'memory_game_complete');
        clarity('event', `memory_game_score_${score}`);
    }
    
    // Сохраняем результат, если есть email
    const email = localStorage.getItem('memoryGameEmail');
    if (email) {
        saveMemoryGameResult(email, score, total);
    }
}

function saveMemoryGameResult(email, score, total) {
    // Можно отправить на сервер позже
    const result = {
        email: email,
        score: score,
        total: total,
        timestamp: new Date().toISOString()
    };
    
    // Сохраняем локально
    let results = JSON.parse(localStorage.getItem('memoryGameResults') || '[]');
    results.push(result);
    localStorage.setItem('memoryGameResults', JSON.stringify(results));
}

function resetMemoryGame() {
    memoryGameState.sequence = [];
    memoryGameState.userSequence = [];
    memoryGameState.isShowing = false;
    memoryGameState.isPlaying = false;
    memoryGameState.score = 0;
    
    const gameBoard = document.getElementById('memoryGameBoard');
    const gameResult = document.getElementById('memoryGameResult');
    const gameInstructions = document.getElementById('memoryGameInstructions');
    
    // Удаляем все обработчики событий с карточек
    const cards = document.querySelectorAll('.memory-game-card-item');
    cards.forEach(card => {
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
    });
    
    if (gameBoard) {
        gameBoard.style.display = 'grid';
    }
    if (gameResult) gameResult.style.display = 'none';
    if (gameInstructions) {
        gameInstructions.style.display = 'block';
        gameInstructions.textContent = t('ui.memoryGameInstructions');
    }
}

function closeMemoryGame() {
    const gameContainer = document.getElementById('memoryGameContainer');
    const startBtn = document.getElementById('startMemoryGameBtn');
    
    if (gameContainer) {
        gameContainer.style.display = 'none';
    }
    
    // Показываем кнопку "Начать игру" обратно
    if (startBtn) {
        startBtn.style.display = 'inline-block';
    }
    
    resetMemoryGame();
}

// Обновляем переводы для игры при изменении языка
function updateMemoryGameTranslations() {
    const memoryGameCard = document.querySelector('.memory-game-card');
    if (memoryGameCard) {
        const title = memoryGameCard.querySelector('h3');
        const text = memoryGameCard.querySelector('.memory-game-text');
        const button = memoryGameCard.querySelector('.btn-memory-game');
        
        if (title) title.textContent = t('ui.memoryGameTitle');
        if (text) text.textContent = t('ui.memoryGameDescription');
        if (button) button.textContent = t('ui.memoryGameButton');
    }
    
    const emailModal = document.getElementById('memoryGameEmailModal');
    if (emailModal) {
        const title = emailModal.querySelector('h3');
        const text = emailModal.querySelector('p');
        const emailInput = document.getElementById('memoryGameEmail');
        const submitBtn = emailModal.querySelector('button[type="submit"]');
        const laterBtn = document.getElementById('memoryGameEmailLater');
        
        if (title) title.textContent = t('ui.memoryGameEmailTitle');
        if (text) text.textContent = t('ui.memoryGameEmailText');
        if (emailInput) emailInput.placeholder = t('ui.memoryGameEmailPlaceholder');
        if (submitBtn) submitBtn.textContent = t('ui.memoryGameEmailSubmit');
        if (laterBtn) laterBtn.textContent = t('ui.memoryGameEmailLater');
    }
    
    const gameContainer = document.getElementById('memoryGameContainer');
    if (gameContainer) {
        const title = gameContainer.querySelector('.memory-game-header h3');
        const instructions = document.getElementById('memoryGameInstructions');
        const tryAgainBtn = document.getElementById('memoryGameTryAgain');
        const closeBtn = document.getElementById('memoryGameCloseBtn');
        
        if (title) title.textContent = t('ui.memoryGameTitle');
        if (instructions) instructions.textContent = t('ui.memoryGameInstructions');
        if (tryAgainBtn) tryAgainBtn.textContent = t('ui.memoryGameTryAgain');
        if (closeBtn) closeBtn.textContent = t('ui.memoryGameClose');
    }
}

// Добавляем вызов обновления переводов в applyTranslations
const originalApplyTranslations = applyTranslations;
applyTranslations = function() {
    originalApplyTranslations();
    updateMemoryGameTranslations();
};

