// Вопросы теста
const questions = [
    {
        type: 'sequence',
        question: 'Какое число должно быть следующим в последовательности?',
        data: '2, 4, 8, 16, ?',
        options: ['24', '32', '28', '20'],
        correct: 1, // 32
        explanation: 'Каждое число умножается на 2'
    },
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

// Инициализация
totalQuestionsSpan.textContent = questions.length;

startBtn.addEventListener('click', startTest);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartTest);

// Worker URL для отправки email
const WORKER_URL = 'https://iqtestemails.gorelikgo.workers.dev';

// Обработчик формы (добавляем один раз)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

// Инициализация кнопок поделиться на стартовой странице
initStartPageShareButtons();

// Инициализация формы на стартовой странице
initStartPageContactForm();

function startTest() {
    welcomeScreen.style.display = 'none';
    testScreen.style.display = 'block';
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

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

function getIQDescription(iq) {
    if (iq < 80) return 'Ниже среднего';
    if (iq < 90) return 'Немного ниже среднего';
    if (iq < 110) return 'Средний уровень';
    if (iq < 120) return 'Выше среднего';
    if (iq < 130) return 'Высокий уровень';
    if (iq < 140) return 'Очень высокий уровень';
    return 'Исключительно высокий уровень';
}

function showResult() {
    testScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    
    iqResult = calculateIQ(score, questions.length);
    
    document.getElementById('iqValue').textContent = `≈ ${iqResult.estimated}`;
    document.getElementById('iqRange').textContent = `Диапазон: ${iqResult.min} - ${iqResult.max}`;
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
        <p><strong>Помните:</strong> Это упрощенный тест для быстрой оценки. 
        Для более точного определения IQ обычно используются более длительные и детальные тесты, 
        проводимые сертифицированными специалистами.</p>
        <p style="margin-top: 10px;"><strong>Дисклеймер:</strong> Данный онлайн IQ тест не является официальным или стандартизированным тестом IQ (таким как WAIS, Stanford-Binet, Raven). 
        Результаты носят ознакомительный характер и не могут использоваться для официальной оценки интеллекта.</p>
        <p style="margin-top: 10px;">Правильных ответов: ${score} из ${questions.length}</p>
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
            alert('Произошла ошибка при отправке. Данные сохранены локально. Попробуйте позже.');
            
            // Все равно показываем успех, но с предупреждением
            document.getElementById('contactForm').style.display = 'none';
            document.getElementById('ctaSuccess').style.display = 'block';
        }
    } catch (error) {
        console.error('Ошибка отправки на Worker:', error);
        alert('Произошла ошибка при отправке. Данные сохранены локально. Попробуйте позже.');
        
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
        alert('Ошибка: результаты теста не найдены');
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
            alert(`Спасибо, ${userName}! Результаты вашего теста (IQ ≈ ${iqResult.estimated}) будут скоро отправлены на email.`);
            
            // Показываем успешное сообщение
            document.getElementById('sendResultsForm').style.display = 'none';
            document.getElementById('sendResultsSuccess').style.display = 'block';
        } else {
            console.error('Ошибка отправки:', result.error);
            alert('Произошла ошибка при отправке. Данные сохранены локально. Попробуйте позже.');
        }
    } catch (error) {
        console.error('Ошибка отправки на Worker:', error);
        alert('Произошла ошибка при отправке. Данные сохранены локально. Попробуйте позже.');
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
    const shareVK = document.getElementById('shareVK');
    const shareTelegram = document.getElementById('shareTelegram');
    const shareWhatsApp = document.getElementById('shareWhatsApp');
    const shareLink = document.getElementById('shareLink');
    
    if (shareVK) shareVK.addEventListener('click', () => shareToVK());
    if (shareTelegram) shareTelegram.addEventListener('click', () => shareToTelegram());
    if (shareWhatsApp) shareWhatsApp.addEventListener('click', () => shareToWhatsApp());
    if (shareLink) shareLink.addEventListener('click', () => copyShareLink());
}

function getShareText() {
    if (!iqResult) return '';
    return `Я прошел IQ тест и получил результат ≈ ${iqResult.estimated} (диапазон: ${iqResult.min}-${iqResult.max})! Пройди и сравни свой результат: `;
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
    const shareVKStart = document.getElementById('shareVKStart');
    const shareTelegramStart = document.getElementById('shareTelegramStart');
    const shareWhatsAppStart = document.getElementById('shareWhatsAppStart');
    const shareLinkStart = document.getElementById('shareLinkStart');
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    
    if (shareVKStart) shareVKStart.addEventListener('click', () => shareToVKStart());
    if (shareTelegramStart) shareTelegramStart.addEventListener('click', () => shareToTelegramStart());
    if (shareWhatsAppStart) shareWhatsAppStart.addEventListener('click', () => shareToWhatsAppStart());
    if (shareLinkStart) shareLinkStart.addEventListener('click', () => copyShareLinkStart());
    if (bookmarkBtn) bookmarkBtn.addEventListener('click', () => addToBookmarks());
}

function getStartPageShareText() {
    return 'Пройди быстрый IQ тест онлайн бесплатно! Узнай свой примерный уровень интеллекта за 2-3 минуты: ';
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
        shareSuccess.style.display = 'block';
        setTimeout(() => {
            shareSuccess.style.display = 'none';
        }, 2000);
    }
}

function addToBookmarks() {
    const url = window.location.href;
    const title = 'IQ Тест Онлайн - Быстрый тест IQ за 2-3 минуты';
    
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
            bookmarkSuccess.innerHTML = 'Нажмите Ctrl+D (или Cmd+D на Mac) для добавления в закладки';
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
        bookmarkSuccess.innerHTML = '✅ Добавлено в закладки!';
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
            alert(`Спасибо, ${userName}! Мы получили ваш email и отправим вам все варианты тестов.`);
            
            // Показываем успешное сообщение
            document.getElementById('contactFormStart').style.display = 'none';
            document.getElementById('ctaSuccessStart').style.display = 'block';
        } else {
            console.error('Ошибка отправки:', result.error);
            alert('Произошла ошибка при отправке. Данные сохранены локально. Попробуйте позже.');
            
            // Все равно показываем успех
            document.getElementById('contactFormStart').style.display = 'none';
            document.getElementById('ctaSuccessStart').style.display = 'block';
        }
    } catch (error) {
        console.error('Ошибка отправки на Worker:', error);
        alert('Произошла ошибка при отправке. Данные сохранены локально. Попробуйте позже.');
        
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
                toggleText.textContent = 'Развернуть';
            } else {
                toggleText.textContent = 'Свернуть';
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
checkUrlParams();

