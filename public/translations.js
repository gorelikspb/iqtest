// Система переводов для IQ теста
const translations = {
    ru: {
        // Вопросы теста
        questions: [
            {
                type: 'sequence',
                question: 'Какое число должно быть следующим в последовательности?',
                data: '2, 4, 8, 16, ?',
                options: ['24', '32', '28', '20'],
                correct: 1,
                explanation: 'Каждое число умножается на 2'
            },
            {
                type: 'analogy',
                question: 'Выберите слово, которое логически завершает аналогию:',
                data: 'Книга : Страница = Дом : ?',
                options: ['Комната', 'Крыша', 'Дверь', 'Окно'],
                correct: 0,
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
                correct: 1,
                explanation: 'Это квадраты чисел: 1², 2², 3², 4², 5²'
            },
            {
                type: 'pattern',
                question: 'Какая фигура должна быть следующей?',
                data: '▲ ▼ ▲ ▼ ?',
                options: ['▲', '▼', '●', '■'],
                correct: 0,
                explanation: 'Чередование треугольников: вверх, вниз, вверх, вниз...'
            },
            {
                type: 'math',
                question: 'Решите: Если 3x + 5 = 20, то x = ?',
                data: '',
                options: ['3', '4', '5', '6'],
                correct: 2,
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
        ],
        // UI тексты
        ui: {
            welcomeTitle: '🧠 Быстрый IQ Тест Онлайн',
            welcomeSubtitle: 'Примерная оценка IQ за 2-3 мин.',
            infoItems: [
                '✅ 7 логических задач для IQ',
                '⏱️ 2-3 минуты на прохождение',
                '📊 Оценка диапазона IQ',
                '🎯 Бесплатно, без регистрации'
            ],
            warningImportant: 'Важно:',
            warningText: 'Это упрощенный IQ тест для быстрой оценки. Для более точного определения IQ обычно используются более длительные тесты с большим количеством вопросов, проводимые специалистами.',
            disclaimer: 'Дисклеймер:',
            disclaimerText: 'Данный онлайн IQ тест не является официальным или стандартизированным тестом IQ (таким как WAIS, Stanford-Binet, Raven). Результаты носят ознакомительный характер и не могут использоваться для официальной оценки интеллекта.',
            expand: 'Развернуть',
            collapse: 'Свернуть',
            startTest: 'Начать тест',
            questionCounter: 'Вопрос',
            questionOf: 'из',
            nextQuestion: 'Следующий вопрос',
            testComplete: '🎉 Тест завершен!',
            range: 'Диапазон:',
            correctAnswers: 'Правильных ответов:',
            of: 'из',
            sendResultsTitle: '📧 Отправить результаты на email',
            sendResultsText: 'Получите результаты теста на свою почту',
            yourName: 'Ваше имя',
            yourEmail: 'Ваш email',
            sendResults: 'Отправить результаты на email',
            resultsWillBeSent: 'Результаты будут скоро отправлены на email.',
            shareTitle: 'Поделитесь результатом',
            shareText: 'Сравните свой результат с друзьями!',
            copyLink: '📋 Копировать ссылку',
            linkCopied: '✅ Ссылка скопирована!',
            ctaTitle: 'Хотите узнать свой IQ точнее?',
            ctaText: 'Получите бесплатный доступ к расширенным IQ тестам (15-60 минут) и специальным IQ тестам для детей. Мы отправим вам все варианты на email.',
            extendedTests: 'Расширенные тесты (15-60 минут)',
            kidsTests: 'Тесты для детей',
            getFreeTests: 'Получить бесплатные тесты',
            noSpam: 'Мы не спамим. Отправим только полезные материалы.',
            thanks: 'Спасибо!',
            thanksText: 'Мы отправим вам все бесплатные варианты тестов на указанный email.',
            restartTest: 'Пройти еще раз',
            addToBookmarks: '⭐ В закладки',
            bookmarkAdded: '✅ Добавлено в закладки!',
            bookmarkInstruction: 'Нажмите Ctrl+D (или Cmd+D на Mac) для добавления в закладки',
            fullTestsLink: 'Расширенные IQ тесты (15-60 минут) и IQ тесты для детей →',
            ctaStartTitle: 'Хотите получить расширенные IQ тесты?',
            ctaStartText: 'Оставьте контакт, и мы отправим вам все бесплатные варианты расширенных тестов интеллекта (15-60 минут) и специальных тестов для детей на email.',
            remember: 'Помните:',
            rememberText: 'Это упрощенный тест для быстрой оценки. Для более точного определения IQ обычно используются более длительные и детальные тесты, проводимые сертифицированными специалистами.',
            selectTestType: 'Пожалуйста, выберите хотя бы один тип теста',
            thanksName: 'Спасибо, {name}! Мы получили ваш email и отправим вам все варианты тестов.',
            errorSending: 'Произошла ошибка при отправке. Данные сохранены локально. Попробуйте позже.',
            thanksResults: 'Спасибо, {name}! Результаты вашего теста (IQ ≈ {iq}) будут скоро отправлены на email.',
            errorResults: 'Ошибка: результаты теста не найдены',
            shareResultText: 'Я прошел IQ тест и получил результат ≈ {iq} (диапазон: {min}-{max})! Пройди и сравни свой результат: ',
            shareStartText: 'Пройди быстрый IQ тест онлайн бесплатно! Узнай свой примерный уровень интеллекта за 2-3 минуты: ',
            // Игра на память
            memoryGameTitle: '🧠 Тренировка памяти',
            memoryGameDescription: 'Быстрая игра для развития мозга',
            memoryGameButton: 'Играть →',
            memoryGameEmailTitle: 'Сохранить результат игры?',
            memoryGameEmailText: 'Оставьте email, чтобы сохранить результат тренировки памяти',
            memoryGameEmailPlaceholder: 'Ваш email',
            memoryGameEmailSubmit: 'Сохранить',
            memoryGameEmailLater: 'Позже',
            memoryGameInstructions: 'Запомните последовательность чисел, которые появятся на 3 секунды',
            memoryGameRemembering: 'Запоминайте...',
            memoryGameYourTurn: 'Ваша очередь! Кликните числа в правильном порядке',
            memoryGameResult: 'Ты запомнил {score} из {total}!',
            memoryGameTryAgain: 'Попробовать еще раз',
            memoryGameClose: 'Закрыть'
        },
        // Описания IQ
        iqDescriptions: {
            low: 'Ниже среднего',
            belowAverage: 'Немного ниже среднего',
            average: 'Средний уровень',
            aboveAverage: 'Выше среднего',
            high: 'Высокий уровень',
            veryHigh: 'Очень высокий уровень',
            exceptional: 'Исключительно высокий уровень'
        }
    },
    en: {
        questions: [
            {
                type: 'sequence',
                question: 'What number should be next in the sequence?',
                data: '2, 4, 8, 16, ?',
                options: ['24', '32', '28', '20'],
                correct: 1,
                explanation: 'Each number is multiplied by 2'
            },
            {
                type: 'analogy',
                question: 'Choose the word that logically completes the analogy:',
                data: 'Book : Page = House : ?',
                options: ['Room', 'Roof', 'Door', 'Window'],
                correct: 0,
                explanation: 'A book consists of pages, a house consists of rooms'
            },
            {
                type: 'logic',
                question: 'If all roses are flowers, and some flowers wilt quickly, then:',
                data: '',
                options: [
                    'All roses wilt quickly',
                    'Some roses may wilt quickly',
                    'No roses wilt',
                    'Cannot be determined'
                ],
                correct: 1,
                explanation: 'If some flowers wilt, and roses are flowers, then some roses may wilt'
            },
            {
                type: 'sequence',
                question: 'Find the pattern and choose the next number:',
                data: '1, 4, 9, 16, ?',
                options: ['20', '25', '24', '23'],
                correct: 1,
                explanation: 'These are squares: 1², 2², 3², 4², 5²'
            },
            {
                type: 'pattern',
                question: 'What figure should be next?',
                data: '▲ ▼ ▲ ▼ ?',
                options: ['▲', '▼', '●', '■'],
                correct: 0,
                explanation: 'Alternating triangles: up, down, up, down...'
            },
            {
                type: 'math',
                question: 'Solve: If 3x + 5 = 20, then x = ?',
                data: '',
                options: ['3', '4', '5', '6'],
                correct: 2,
                explanation: '3x = 20 - 5 = 15, so x = 5'
            },
            {
                type: 'logic',
                question: 'All cats are animals. Some animals sleep. Therefore:',
                data: '',
                options: [
                    'All cats sleep',
                    'Some cats may sleep',
                    'No cats sleep',
                    'Cannot be determined'
                ],
                correct: 1,
                explanation: 'If some animals sleep, and cats are animals, then some cats may sleep'
            }
        ],
        ui: {
            welcomeTitle: '🧠 Quick IQ Test Online',
            welcomeSubtitle: 'Approximate IQ assessment in 2-3 min.',
            infoItems: [
                '✅ 7 logic questions for IQ',
                '⏱️ 2-3 minutes to complete',
                '📊 IQ range assessment',
                '🎯 Free, no registration'
            ],
            warningImportant: 'Important:',
            warningText: 'This is a simplified IQ test for quick assessment. For more accurate IQ determination, longer tests with more questions conducted by specialists are usually used.',
            disclaimer: 'Disclaimer:',
            disclaimerText: 'This online IQ test is not an official or standardized IQ test (such as WAIS, Stanford-Binet, Raven). Results are for informational purposes only and cannot be used for official intelligence assessment.',
            expand: 'Expand',
            collapse: 'Collapse',
            startTest: 'Start Test',
            questionCounter: 'Question',
            questionOf: 'of',
            nextQuestion: 'Next Question',
            testComplete: '🎉 Test Complete!',
            range: 'Range:',
            correctAnswers: 'Correct answers:',
            of: 'of',
            sendResultsTitle: '📧 Send Results to Email',
            sendResultsText: 'Get your test results by email',
            yourName: 'Your name',
            yourEmail: 'Your email',
            sendResults: 'Send Results to Email',
            resultsWillBeSent: 'Results will be sent to your email soon.',
            shareTitle: 'Share Your Result',
            shareText: 'Compare your result with friends!',
            copyLink: '📋 Copy Link',
            linkCopied: '✅ Link copied!',
            ctaTitle: 'Want to know your IQ more accurately?',
            ctaText: 'Get free access to extended IQ tests (15-60 minutes) and special IQ tests for children. We will send you all options by email.',
            extendedTests: 'Extended Tests (15-60 minutes)',
            kidsTests: 'Tests for Children',
            getFreeTests: 'Get Free Tests',
            noSpam: 'We don\'t spam. We\'ll only send useful materials.',
            thanks: 'Thank You!',
            thanksText: 'We will send you all free test options to the specified email.',
            restartTest: 'Take Again',
            addToBookmarks: '⭐ Add to Bookmarks',
            bookmarkAdded: '✅ Added to bookmarks!',
            bookmarkInstruction: 'Press Ctrl+D (or Cmd+D on Mac) to add to bookmarks',
            fullTestsLink: 'Extended IQ Tests (15-60 minutes) and IQ Tests for Children →',
            ctaStartTitle: 'Want to get extended IQ tests?',
            ctaStartText: 'Leave your contact, and we will send you all free options of extended intelligence tests (15-60 minutes) and special tests for children by email.',
            remember: 'Remember:',
            rememberText: 'This is a simplified test for quick assessment. For more accurate IQ determination, longer and more detailed tests conducted by certified specialists are usually used.',
            selectTestType: 'Please select at least one test type',
            thanksName: 'Thank you, {name}! We received your email and will send you all test options.',
            errorSending: 'An error occurred while sending. Data saved locally. Please try again later.',
            thanksResults: 'Thank you, {name}! Your test results (IQ ≈ {iq}) will be sent to your email soon.',
            errorResults: 'Error: test results not found',
            shareResultText: 'I took an IQ test and got ≈ {iq} (range: {min}-{max})! Take it and compare your result: ',
            shareStartText: 'Take a quick free online IQ test! Find out your approximate intelligence level in 2-3 minutes: ',
            // Memory game
            memoryGameTitle: '🧠 Memory Training',
            memoryGameDescription: 'Quick game for brain development',
            memoryGameButton: 'Play →',
            memoryGameEmailTitle: 'Save game result?',
            memoryGameEmailText: 'Leave your email to save your memory training result',
            memoryGameEmailPlaceholder: 'Your email',
            memoryGameEmailSubmit: 'Save',
            memoryGameEmailLater: 'Later',
            memoryGameInstructions: 'Remember the sequence of numbers that will appear for 3 seconds',
            memoryGameRemembering: 'Remembering...',
            memoryGameYourTurn: 'Your turn! Click the numbers in the correct order',
            memoryGameResult: 'You remembered {score} out of {total}!',
            memoryGameTryAgain: 'Try Again',
            memoryGameClose: 'Close'
        },
        iqDescriptions: {
            low: 'Below Average',
            belowAverage: 'Slightly Below Average',
            average: 'Average',
            aboveAverage: 'Above Average',
            high: 'High',
            veryHigh: 'Very High',
            exceptional: 'Exceptionally High'
        }
    }
};

// Определение текущего языка
function getCurrentLanguage() {
    // Проверяем путь URL (новая структура: /ru/index.html или /en/index.html)
    const path = window.location.pathname;
    const pathMatch = path.match(/\/(ru|en)\//);
    if (pathMatch && translations[pathMatch[1]]) {
        return pathMatch[1];
    }
    
    // Проверяем URL параметр (старая структура для обратной совместимости)
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    if (lang && translations[lang]) {
        return lang;
    }
    
    // Проверяем атрибут lang у html
    const htmlLang = document.documentElement.lang;
    if (htmlLang && translations[htmlLang]) {
        return htmlLang;
    }
    
    // По умолчанию русский
    return 'ru';
}

// Получение переводов
function t(key, params = {}) {
    const lang = getCurrentLanguage();
    const keys = key.split('.');
    let value = translations[lang];
    
    for (const k of keys) {
        value = value?.[k];
    }
    
    if (typeof value === 'string' && params) {
        return value.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
    }
    
    return value || key;
}

// Получение вопросов для текущего языка
function getQuestions() {
    return translations[getCurrentLanguage()].questions;
}

// Получение описания IQ
function getIQDescription(iq) {
    const lang = getCurrentLanguage();
    const descs = translations[lang].iqDescriptions;
    
    if (iq < 80) return descs.low;
    if (iq < 90) return descs.belowAverage;
    if (iq < 110) return descs.average;
    if (iq < 120) return descs.aboveAverage;
    if (iq < 130) return descs.high;
    if (iq < 140) return descs.veryHigh;
    return descs.exceptional;
}

