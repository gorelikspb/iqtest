// Вопросы теста (загружаются из translations.js)
let questions = [];
    {
        type: 'analogy',
        question: 'Выберите слово, которое логически завершает аналогию:',
        data: 'Книга : Страница = Дом : ?',
        options: ['Комната', 'Крыша', 'Дверь', 'Окно'],
        correct: 0, // Комната
        explanation: 'Книга состоит из страниц, дом состоит из комнат'
    },
    {
        type: 'logic',
        question: 'Если все розы - цветы, и некоторые цветы быстро вянут, то:',
        data: '',
        options: [
            'Все розы быстро вянут',
            'Некоторые розы быстро вянут',
            'Никакие розы не вянут',
            'Нельзя определить'
        ],
        correct: 1,
        explanation: 'Если некоторые цветы вянут, и розы - цветы, то некоторые розы могут вянуть'
    },
    {
        type: 'sequence',
        question: 'Найдите закономерность и выберите следующее число:',
        data: '1, 4, 9, 16, ?',
        options: ['20', '25', '24', '23'],
        correct: 1, // 25
        explanation: 'Это квадраты чисел: 1², 2², 3², 4², 5²'
    },
    {
        type: 'pattern',
        question: 'Какая фигура должна быть следующей?',
        data: '▲ ▼ ▲ ▼ ?',
        options: ['▲', '▼', '●', '■'],
        correct: 0, // ▲
        explanation: 'Чередование треугольников: вверх, вниз, вверх, вниз...'
    },
    {
        type: 'math',
        question: 'Решите: Если 3x + 5 = 20, то x = ?',
        data: '',
        options: ['3', '4', '5', '6'],
        correct: 2, // 5
        explanation: '3x = 20 - 5 = 15, значит x = 5'
    },
    {
        type: 'logic',
        question: 'Все кошки - животные. Некоторые животные спят. Значит:',
        data: '',
        options: [
            'Все кошки спят',
            'Некоторые кошки могут спать',
            'Никакие кошки не спят',
            'Нельзя определить'
        ],
        correct: 1,
        explanation: 'Если некоторые животные спят, и кошки - животные, то некоторые кошки могут спать'
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let iqResult = null; // Сохраняем результат для поделиться

const welcomeScreen = document.getElementById('welcomeScreen');
const testScreen = document.getElementById('testScreen');
const resultScreen = document.getElementById('resultScreen');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const progressFill = document.getElementById('progressFill');
const currentQuestionSpan = document.getElementById('currentQuestion');
const totalQuestionsSpan = document.getElementById('totalQuestions');

// Инициализация языка и переводов
let currentLang = getCurrentLanguage();
questions = getQuestions();

// Применяем переводы к интерфейсу
function applyTranslations() {
    currentLang = getCurrentLanguage();
    questions = getQuestions();
    
    // Обновляем lang атрибут HTML
    document.documentElement.lang = currentLang;
    
    // Обновляем meta теги
    if (currentLang === 'en') {
        document.getElementById('pageTitle').textContent = 'IQ Test Online - Quick IQ Test in 2-3 minutes | Free';
        document.getElementById('pageDescription').content = 'Take a quick free online IQ test. 7 questions in 2-3 minutes. Find out your approximate IQ level with result and range. Free intelligence test without registration.';
        document.getElementById('pageKeywords').content = 'iq test, online iq test, quick iq test, intelligence test, free iq test, check iq';
    } else {
        document.getElementById('pageTitle').textContent = 'IQ Тест Онлайн - Быстрый тест IQ за 2-3 минуты | Бесплатно';
        document.getElementById('pageDescription').content = 'Пройдите быстрый IQ тест онлайн бесплатно. 7 вопросов за 2-3 минуты. Узнайте примерный уровень вашего IQ с результатом и диапазоном. Бесплатный тест интеллекта без регистрации.';
        document.getElementById('pageKeywords').content = 'iq тест, тест iq онлайн, быстрый iq тест, тест интеллекта, бесплатный iq тест, проверить iq';
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
function init() {
    applyTranslations();
    totalQuestionsSpan.textContent = questions.length;
    
    // Обновляем счетчик вопросов
    const questionCounter = document.querySelector('.question-counter');
    if (questionCounter) {
        const parts = questionCounter.textContent.split(' ');
        questionCounter.innerHTML = `${t('ui.questionCounter')} <span id="currentQuestion">1</span> ${t('ui.questionOf')} <span id="totalQuestions">${questions.length}</span>`;
    }
}

// Привязываем обработчики событий после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventListeners);
} else {
    initEventListeners();
}

function initEventListeners() {
    if (startBtn) startBtn.addEventListener('click', startTest);
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
    if (restartBtn) restartBtn.addEventListener('click', restartTest);
}

// Worker URL для отправки email
const WORKER_URL = 'https://iqtestemails.gorelikgo.workers.dev';

// Обработчик формы (добавляем один раз)
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

// Инициализация всех обработчиков после загрузки DOM
function initAllHandlers() {
    initContactForm();
    initStartPageShareButtons();
    initStartPageContactForm();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllHandlers);
} else {
    initAllHandlers();
}

function startTest() {
    welcomeScreen.style.display = 'none';
    testScreen.style.display = 'block';
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

// Делаем функцию доступной глобально для Puppeteer
window.startTest = startTest;

function showQuestion() {
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
    testScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    
    iqResult = calculateIQ(score, questions.length);
    
    document.getElementById('iqValue').textContent = `≈ ${iqResult.estimated}`;
    document.getElementById('iqRange').textContent = `${t('ui.range')} ${iqResult.min} - ${iqResult.max}`;
    document.getElementById('iqDescription').textContent = getIQDescription(iqResult.estimated);
    
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
            total: questions.length
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
    const currentLang = getCurrentLanguage();
    
    // Для русской версии
    if (currentLang === 'ru') {
        const shareVK = document.getElementById('shareVK');
        const shareTelegram = document.getElementById('shareTelegram');
        const shareWhatsApp = document.getElementById('shareWhatsApp');
        const shareLink = document.getElementById('shareLink');
        
        if (shareVK) shareVK.addEventListener('click', () => shareToVK());
        if (shareTelegram) shareTelegram.addEventListener('click', () => shareToTelegram());
        if (shareWhatsApp) shareWhatsApp.addEventListener('click', () => shareToWhatsApp());
        if (shareLink) shareLink.addEventListener('click', () => copyShareLink());
    } else {
        // Для английской версии
        const shareFacebook = document.getElementById('shareFacebook');
        const shareTwitter = document.getElementById('shareTwitter');
        const shareWhatsApp = document.getElementById('shareWhatsApp');
        const shareLink = document.getElementById('shareLink');
        const shareTelegram = document.getElementById('shareTelegram');
        
        if (shareFacebook) shareFacebook.addEventListener('click', () => shareToFacebook());
        if (shareTwitter) shareTwitter.addEventListener('click', () => shareToTwitter());
        if (shareWhatsApp) shareWhatsApp.addEventListener('click', () => shareToWhatsApp());
        if (shareLink) shareLink.addEventListener('click', () => copyShareLink());
        if (shareTelegram) shareTelegram.addEventListener('click', () => shareToTelegram());
    }
}

function getShareText() {
    if (!iqResult) return '';
    return t('ui.shareResultText', { iq: iqResult.estimated, min: iqResult.min, max: iqResult.max });
}

function getShareUrl() {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
        iq: iqResult.estimated,
        min: iqResult.min,
        max: iqResult.max,
        score: score,
        total: questions.length
    });
    return `${baseUrl}?${params.toString()}`;
}

function shareToVK() {
    const url = getShareUrl();
    const text = getShareText();
    window.open(`https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
}

function shareToTelegram() {
    const url = getShareUrl();
    const text = getShareText() + url;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
}

function shareToWhatsApp() {
    const url = getShareUrl();
    const text = getShareText() + url;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + url)}`, '_blank');
}

function shareToFacebook() {
    const url = getShareUrl();
    const text = getShareText() + url;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
}

function shareToTwitter() {
    const url = getShareUrl();
    const text = getShareText() + url;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
}

function copyShareLink() {
    const url = getShareUrl();
    const text = getShareText() + url;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showShareSuccess();
        });
    } else {
        // Fallback для старых браузеров
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showShareSuccess();
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
    const currentLang = getCurrentLanguage();
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    
    if (bookmarkBtn) bookmarkBtn.addEventListener('click', () => addToBookmarks());
    
    // Для русской версии
    if (currentLang === 'ru') {
        const shareVKStart = document.getElementById('shareVKStart');
        const shareTelegramStart = document.getElementById('shareTelegramStart');
        const shareWhatsAppStart = document.getElementById('shareWhatsAppStart');
        const shareLinkStart = document.getElementById('shareLinkStart');
        
        if (shareVKStart) shareVKStart.addEventListener('click', () => shareToVKStart());
        if (shareTelegramStart) shareTelegramStart.addEventListener('click', () => shareToTelegramStart());
        if (shareWhatsAppStart) shareWhatsAppStart.addEventListener('click', () => shareToWhatsAppStart());
        if (shareLinkStart) shareLinkStart.addEventListener('click', () => copyShareLinkStart());
    } else {
        // Для английской версии
        const shareFacebookStart = document.getElementById('shareFacebookStart');
        const shareTwitterStart = document.getElementById('shareTwitterStart');
        const shareWhatsAppStart = document.getElementById('shareWhatsAppStart');
        const shareLinkStart = document.getElementById('shareLinkStart');
        const shareTelegramStart = document.getElementById('shareTelegramStart');
        
        if (shareFacebookStart) shareFacebookStart.addEventListener('click', () => shareToFacebookStart());
        if (shareTwitterStart) shareTwitterStart.addEventListener('click', () => shareToTwitterStart());
        if (shareWhatsAppStart) shareWhatsAppStart.addEventListener('click', () => shareToWhatsAppStart());
        if (shareLinkStart) shareLinkStart.addEventListener('click', () => copyShareLinkStart());
        if (shareTelegramStart) shareTelegramStart.addEventListener('click', () => shareToTelegramStart());
    }
}

function getStartPageShareText() {
    return t('ui.shareStartText');
}

function getStartPageShareUrl() {
    return window.location.href;
}

function shareToVKStart() {
    const url = getStartPageShareUrl();
    const text = getStartPageShareText();
    window.open(`https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
}

function shareToTelegramStart() {
    const url = getStartPageShareUrl();
    const text = getStartPageShareText() + url;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
}

function shareToWhatsAppStart() {
    const url = getStartPageShareUrl();
    const text = getStartPageShareText() + url;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

function shareToFacebookStart() {
    const url = getStartPageShareUrl();
    const text = getStartPageShareText() + url;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
}

function shareToTwitterStart() {
    const url = getStartPageShareUrl();
    const text = getStartPageShareText() + url;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
}

function copyShareLinkStart() {
    const url = getStartPageShareUrl();
    const text = getStartPageShareText() + url;
    
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
        // Можно показать специальное сообщение или редирект
        console.log('Shared result:', {
            iq: params.get('iq'),
            min: params.get('min'),
            max: params.get('max')
        });
    }
}

// Инициализация формы на стартовой странице
function initStartPageContactForm() {
    const contactFormStart = document.getElementById('contactFormStart');
    if (contactFormStart) {
        contactFormStart.addEventListener('submit', handleStartPageFormSubmit);
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

// Вызываем при загрузке
init();
checkUrlParams();

