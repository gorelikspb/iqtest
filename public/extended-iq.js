/**
 * Extended 15-Minute IQ Test (25 questions, 4 cognitive domains, countdown timer)
 * Bilingual RU/EN, interactive Radar/Bar breakdown, Email Gate for full certificate + Answer explanations,
 * Canvas Social Card generator for viral sharing.
 */

const EXTENDED_WORKER_URL = 'https://iqtestemails.gorelikgo.workers.dev';

const extendedQuestions = {
    ru: [
        // 1-7: Numerical & Sequences (Числовое мышление и ряды)
        { domain: 'numerical', q: 'Продолжите числовой ряд:', data: '3, 7, 15, 31, 63, ?', options: ['95', '127', '125', '119'], correct: 1, exp: 'Каждое следующее число равно предыдущему × 2 + 1 (63 × 2 + 1 = 127).' },
        { domain: 'numerical', q: 'Найдите недостающее число в последовательности Фибоначчи со сдвигом:', data: '2, 3, 5, 8, 13, 21, ?', options: ['29', '34', '32', '35'], correct: 1, exp: 'Каждое число равно сумме двух предыдущих: 13 + 21 = 34.' },
        { domain: 'numerical', q: 'Какое число нарушает закономерность?', data: '4, 9, 16, 25, 35, 49, 64', options: ['16', '25', '35', '49'], correct: 2, exp: 'Все числа — полные квадраты (2², 3², 4², 5², 6²=36, 7², 8²). Вместо 35 должно быть 36.' },
        { domain: 'numerical', q: 'Вставьте пропущенное число в матрице:', data: '[ 4 | 6 | 10 ]\n[ 7 | 3 | 10 ]\n[ 9 | 8 | ? ]', options: ['15', '17', '19', '16'], correct: 1, exp: 'В каждой строке третье число равно сумме первых двух: 9 + 8 = 17.' },
        { domain: 'numerical', q: 'Если 5 машин производят 5 деталей за 5 минут, за сколько минут 100 машин произведут 100 деталей?', data: '5 машин → 5 дет. за 5 мин', options: ['100 минут', '5 минут', '20 минут', '1 минута'], correct: 1, exp: 'Каждая машина делает 1 деталь за 5 минут. Значит, 100 машин сделают 100 деталей одновременно за те же 5 минут.' },
        { domain: 'numerical', q: 'Найдите следующее число в чередующемся ряду:', data: '10, 20, 18, 36, 34, 68, ?', options: ['66', '70', '136', '64'], correct: 0, exp: 'Чередуются операции: ×2, затем −2. После 68 идет 68 − 2 = 66.' },
        { domain: 'numerical', q: 'Товар уценили на 20%, а затем новую цену повысили на 25%. Как изменилась цена относительно начальной?', data: '−20%, затем +25%', options: ['Выросла на 5%', 'Не изменилась (0%)', 'Упала на 5%', 'Выросла на 2%'], correct: 1, exp: '1.0 × 0.8 = 0.8; 0.8 × 1.25 = 1.0. Итоговая цена равна исходной.' },

        // 8-13: Matrices & Spatial Patterns (Матрицы и пространственные паттерны)
        { domain: 'spatial', q: 'Какой символ должен стоять на месте вопроса в матрице 3×3?', data: '◯  △  □\n△  □  ◯\n□  ◯  ?', options: ['◯', '△', '□', '◇'], correct: 1, exp: 'Латинский квадрат: в каждой строке и каждом столбце по одному разу встречаются ◯, △ и □.' },
        { domain: 'spatial', q: 'Найдите следующую фигуру при вращении стрелки на 90° по часовой стрелке:', data: '↑ → ↓ ← ?', options: ['↑', '→', '↓', '↖'], correct: 0, exp: 'Полный оборот из 4 шагов возвращает стрелку в положение ↑.' },
        { domain: 'spatial', q: 'Куб покрасили со всех сторон и распилили на 27 одинаковых маленьких кубиков (3×3×3). У скольких маленьких кубиков окрашены ровно ДВЕ грани?', data: 'Куб 3 × 3 × 3', options: ['8', '12', '6', '9'], correct: 1, exp: 'По две окрашенные грани имеют реберные центральные кубики. У куба 12 рёбер → 12 кубиков.' },
        { domain: 'spatial', q: 'Определите закономерность в заполнении клеток:', data: '■□□ → □■□ → □□■ → ?', options: ['■□□', '■■□', '□□□', '□■□'], correct: 0, exp: 'Закрашенный квадрат смещается на одну позицию вправо по циклу, возвращаясь в начало.' },
        { domain: 'spatial', q: 'Если отразить слово «НОС» в горизонтальном зеркале, а затем повернуть на 180°, сколько букв останутся визуально симметричными сами себе?', data: 'Н  О  С', options: ['1 (только О)', '2 (Н и О)', '3 (все)', '0'], correct: 1, exp: 'Буквы Н и О обладают как центральной, так и осевой симметрией.' },
        { domain: 'spatial', q: 'Завершите визуальную пропорцию:', data: '◐ : ◑  =  ◒ : ?', options: ['◓', '◐', '●', '◯'], correct: 0, exp: 'Левая половина меняется на правую; нижняя половина ◒ меняется на верхнюю ◓.' },

        // 14-19: Verbal & Conceptual Analogies (Вербальный интеллект и аналогии)
        { domain: 'verbal', q: 'Выберите пару, которая соответствует отношению:', data: 'Маятник : Колебание = Земля : ?', options: ['Гравитация', 'Орбита / Вращение', 'Луна', 'Континент'], correct: 1, exp: 'Маятник совершает колебание, а Земля совершает вращение (движение по орбите).' },
        { domain: 'verbal', q: 'Какое понятие является лишним по смыслу?', data: 'Симфония, Соната, Фреска, Концерт, Оратория', options: ['Соната', 'Фреска', 'Оратория', 'Симфония'], correct: 1, exp: 'Фреска — произведение живописи, остальные — музыкальные жанры.' },
        { domain: 'verbal', q: 'Дополните логическую аналогию:', data: 'Гипотеза : Доказательство = Семена : ?', options: ['Почва', 'Урожай', 'Дождь', 'Фермер'], correct: 1, exp: 'Развитие и успешный результат гипотезы — доказательство; результат посева семян — урожай.' },
        { domain: 'verbal', q: 'Антонимом к слову «Эфемерный» является:', data: 'Эфемерный ↔ ?', options: ['Мимолетный', 'Долговечный / Прочный', 'Призрачный', 'Искусственный'], correct: 1, exp: 'Эфемерный означает недолговечный, мимолетный; противоположность — долговечный, прочный.' },
        { domain: 'verbal', q: 'Выберите слово, завершающее метафорическую связь:', data: 'Алгоритм : Программа = Рецепт : ?', options: ['Кухня', 'Блюдо', 'Повар', 'Ингредиент'], correct: 1, exp: 'Алгоритм — это пошаговая инструкция для получения программы; рецепт — инструкция для приготовления блюда.' },
        { domain: 'verbal', q: 'Найдите общее свойство: Кислород, Золото, Углерод, Водород', data: 'O, Au, C, H', options: ['Все они газы', 'Все они химические элементы', 'Все они металлы', 'Все они жидкости'], correct: 1, exp: 'Все перечисленные вещества являются простыми химическими элементами таблицы Менделеева.' },

        // 20-25: Formal Deduction & Logic (Формальная логика и дедукция)
        { domain: 'logic', q: 'Все логики любят головоломки. Ни один лентяй не любит головоломки. Следовательно:', data: 'Логики → Головоломки; Лентяи ↛ Головоломки', options: ['Некоторые логики — лентяи', 'Ни один логик не является лентяем', 'Все, кто любит головоломки — логики', 'Нельзя сделать вывод'], correct: 1, exp: 'Если логики входят в множество любителей головоломок, а лентяи с ним не пересекаются, то ни один логик не лентяй.' },
        { domain: 'logic', q: 'Анна старше Бориса, но младше Виктора. Дарья младше Бориса. Кто самый младший?', data: 'В > А > Б > Д', options: ['Анна', 'Борис', 'Виктор', 'Дарья'], correct: 3, exp: 'По цепочке возрастов: Виктор > Анна > Борис > Дарья. Самая младшая — Дарья.' },
        { domain: 'logic', q: 'На столе лежат 4 карточки: [A], [K], [4], [7]. Утверждение: «Если на одной стороне гласная буква, то на другой — четное число». Какие ДВЕ карточки нужно перевернуть для проверки?', data: '[A]  [K]  [4]  [7]', options: ['A и 4', 'A и 7', 'K и 4', 'Все четыре'], correct: 1, exp: 'Задача выбора Уэйсона: нужно проверить P (A — есть ли четное) и ¬Q (7 — нет ли там гласной).' },
        { domain: 'logic', q: 'На острове рыцари всегда говорят правду, а лжецы всегда лгут. Житель А говорит: «Мы оба — лжецы». Кто они (А и Б)?', data: 'А: «Мы оба лжецы»', options: ['Оба лжецы', 'А — лжец, Б — рыцарь', 'А — рыцарь, Б — лжец', 'Оба рыцари'], correct: 1, exp: 'Рыцарь не может назвать себя лжецом, значит А — лжец. Так как его фраза «мы оба лжецы» ложна, Б должен быть рыцарем.' },
        { domain: 'logic', q: 'Если сегодня не вторник, то завтра не среда. Сегодня не среда. Какой вывод гарантированно верен?', data: 'Логическая импликация', options: ['Сегодня вторник', 'Если завтра среда, то сегодня вторник', 'Завтра четверг', 'Сегодня понедельник'], correct: 1, exp: 'Контрапозиция высказывания (¬P → ¬Q) эквивалентна (Q → P): если завтра среда, то сегодня вторник.' },
        { domain: 'logic', q: 'В темной комнате в ящике 10 черных и 10 белых носков. Какое минимальное число носков нужно вытащить не глядя, чтобы гарантированно получить пару одного цвета?', data: '10 черных + 10 белых', options: ['2', '3', '11', '5'], correct: 1, exp: 'По принципу Дирихле: при 2 цветах среди любых 3 носков минимум два совпадут по цвету.' }
    ],
    en: [
        // 1-7: Numerical & Sequences
        { domain: 'numerical', q: 'Continue the number sequence:', data: '3, 7, 15, 31, 63, ?', options: ['95', '127', '125', '119'], correct: 1, exp: 'Each number is the previous one × 2 + 1 (63 × 2 + 1 = 127).' },
        { domain: 'numerical', q: 'Find the missing number in the shifted Fibonacci sequence:', data: '2, 3, 5, 8, 13, 21, ?', options: ['29', '34', '32', '35'], correct: 1, exp: 'Each number is the sum of the two preceding ones: 13 + 21 = 34.' },
        { domain: 'numerical', q: 'Which number breaks the pattern?', data: '4, 9, 16, 25, 35, 49, 64', options: ['16', '25', '35', '49'], correct: 2, exp: 'All numbers are perfect squares (2², 3², 4², 5², 6²=36, 7², 8²). 35 should be 36.' },
        { domain: 'numerical', q: 'Find the missing value in the matrix:', data: '[ 4 | 6 | 10 ]\n[ 7 | 3 | 10 ]\n[ 9 | 8 | ? ]', options: ['15', '17', '19', '16'], correct: 1, exp: 'In each row, the third number equals the sum of the first two: 9 + 8 = 17.' },
        { domain: 'numerical', q: 'If 5 machines make 5 widgets in 5 minutes, how long would it take 100 machines to make 100 widgets?', data: '5 machines → 5 widgets in 5 min', options: ['100 minutes', '5 minutes', '20 minutes', '1 minute'], correct: 1, exp: 'Each machine makes 1 widget in 5 minutes. Working in parallel, 100 machines make 100 widgets in 5 minutes.' },
        { domain: 'numerical', q: 'Find the next number in the alternating series:', data: '10, 20, 18, 36, 34, 68, ?', options: ['66', '70', '136', '64'], correct: 0, exp: 'Operations alternate: ×2, then −2. After 68 comes 68 − 2 = 66.' },
        { domain: 'numerical', q: 'An item is discounted by 20%, and then the new price is increased by 25%. How does the final price compare to the original?', data: '−20%, then +25%', options: ['5% higher', 'Unchanged (0%)', '5% lower', '2% higher'], correct: 1, exp: '1.0 × 0.8 = 0.8; 0.8 × 1.25 = 1.0. The price returns to 100% of the original.' },

        // 8-13: Matrices & Spatial Patterns
        { domain: 'spatial', q: 'Which symbol completes the 3×3 Latin Square matrix?', data: '◯  △  □\n△  □  ◯\n□  ◯  ?', options: ['◯', '△', '□', '◇'], correct: 1, exp: 'Each row and column contains ◯, △, and □ exactly once.' },
        { domain: 'spatial', q: 'Find the next arrow when rotating 90° clockwise each step:', data: '↑ → ↓ ← ?', options: ['↑', '→', '↓', '↖'], correct: 0, exp: 'Four 90° steps complete a full 360° rotation back to ↑.' },
        { domain: 'spatial', q: 'A painted cube is cut into 27 smaller identical cubes (3×3×3). How many small cubes have paint on EXACLY TWO faces?', data: '3 × 3 × 3 Cube', options: ['8', '12', '6', '9'], correct: 1, exp: 'Center edge cubes have 2 painted faces. A cube has 12 edges → 12 cubes.' },
        { domain: 'spatial', q: 'Identify the next pattern in the shifting grid:', data: '■□□ → □■□ → □□■ → ?', options: ['■□□', '■■□', '□□□', '□■□'], correct: 0, exp: 'The filled square shifts one position right each step and wraps around to the first position.' },
        { domain: 'spatial', q: 'Among the capital letters H, O, X, how many remain identical after both a horizontal mirror flip and a 180° rotation?', data: 'H   O   X', options: ['1 (only O)', '2 (H and O)', '3 (all three)', '0'], correct: 2, exp: 'H, O, and X all possess horizontal, vertical, and 180° rotational symmetry.' },
        { domain: 'spatial', q: 'Complete the visual proportion:', data: '◐ : ◑  =  ◒ : ?', options: ['◓', '◐', '●', '◯'], correct: 0, exp: 'Left half flips to right half; bottom half ◒ flips to top half ◓.' },

        // 14-19: Verbal & Conceptual Analogies
        { domain: 'verbal', q: 'Select the pair that matches the relationship:', data: 'Pendulum : Oscillation = Earth : ?', options: ['Gravity', 'Orbit / Rotation', 'Moon', 'Continent'], correct: 1, exp: 'A pendulum performs oscillation; the Earth performs rotation/orbit.' },
        { domain: 'verbal', q: 'Which word is the odd one out?', data: 'Symphony, Sonata, Fresco, Concerto, Oratorio', options: ['Sonata', 'Fresco', 'Oratorio', 'Symphony'], correct: 1, exp: 'A fresco is a visual painting technique; all others are musical compositions.' },
        { domain: 'verbal', q: 'Complete the logical analogy:', data: 'Hypothesis : Proof = Seed : ?', options: ['Soil', 'Harvest / Crop', 'Rain', 'Farmer'], correct: 1, exp: 'A hypothesis develops into proof; a seed develops into a harvest.' },
        { domain: 'verbal', q: 'Which word is the closest antonym to "Ephemeral"?', data: 'Ephemeral ↔ ?', options: ['Fleeting', 'Enduring / Permanent', 'Ghostly', 'Artificial'], correct: 1, exp: 'Ephemeral means lasting for a very short time; its opposite is enduring or permanent.' },
        { domain: 'verbal', q: 'Complete the conceptual analogy:', data: 'Algorithm : Program = Recipe : ?', options: ['Kitchen', 'Dish / Meal', 'Chef', 'Ingredient'], correct: 1, exp: 'An algorithm is a step-by-step guide to produce a program; a recipe is a guide to produce a dish.' },
        { domain: 'verbal', q: 'What do Oxygen, Gold, Carbon, and Hydrogen have in common?', data: 'O, Au, C, H', options: ['All are gases', 'All are chemical elements', 'All are metals', 'All are liquids'], correct: 1, exp: 'All four are fundamental chemical elements on the periodic table.' },

        // 20-25: Formal Deduction & Logic
        { domain: 'logic', q: 'All logicians love puzzles. No lazy person loves puzzles. Therefore:', data: 'Logicians → Puzzles; Lazy ↛ Puzzles', options: ['Some logicians are lazy', 'No logician is lazy', 'Everyone who loves puzzles is a logician', 'Cannot be determined'], correct: 1, exp: 'Since logicians are a subset of puzzle-lovers and lazy people are disjoint from puzzle-lovers, no logician is lazy.' },
        { domain: 'logic', q: 'Alice is older than Bob, but younger than Charlie. Diana is younger than Bob. Who is the youngest?', data: 'C > A > B > D', options: ['Alice', 'Bob', 'Charlie', 'Diana'], correct: 3, exp: 'Ordering from oldest to youngest: Charlie > Alice > Bob > Diana.' },
        { domain: 'logic', q: 'Four cards lie on a table: [A], [K], [4], [7]. Rule: "If a card has a vowel on one side, it has an even number on the other." Which TWO cards must you flip to test this rule?', data: '[A]  [K]  [4]  [7]', options: ['A and 4', 'A and 7', 'K and 4', 'All four'], correct: 1, exp: 'Wason selection task: you must check P (A — is it even?) and ¬Q (7 — is there a vowel on the back?).' },
        { domain: 'logic', q: 'On an island, knights always tell the truth and knaves always lie. Person A says: "Both of us are knaves." What are A and B?', data: 'A: "Both of us are knaves"', options: ['Both are knaves', 'A is a knave, B is a knight', 'A is a knight, B is a knave', 'Both are knights'], correct: 1, exp: 'A knight cannot claim to be a knave, so A is a knave. Since A’s statement is false, they are not both knaves — so B is a knight.' },
        { domain: 'logic', q: 'If today is not Tuesday, then tomorrow is not Wednesday. Which statement is logically equivalent?', data: 'Logical Contrapositive', options: ['Today is Tuesday', 'If tomorrow is Wednesday, then today is Tuesday', 'Tomorrow is Thursday', 'Today is Monday'], correct: 1, exp: 'The contrapositive of (¬P → ¬Q) is (Q → P): if tomorrow is Wednesday, today is Tuesday.' },
        { domain: 'logic', q: 'A dark drawer holds 10 black socks and 10 white socks. What is the minimum number of socks you must pull out blindly to guarantee a matching pair?', data: '10 black + 10 white', options: ['2', '3', '11', '5'], correct: 1, exp: 'By the Pigeonhole Principle, with 2 colors, picking 3 socks guarantees at least 2 of the same color.' }
    ]
};

const extCopy = {
    ru: {
        domainNames: {
            numerical: 'Числовое мышление',
            spatial: 'Пространство и матрицы',
            verbal: 'Вербальные аналогии',
            logic: 'Формальная дедукция'
        },
        percentileLabel: (p) => `Выше, чем у ${p}% протестированных`,
        timeTakenLabel: (m, s) => `Время: ${m} мин ${s} сек`,
        unlockedMsg: '✅ Полный разбор всех 25 задач разблокирован! Копия сертификата также отправлена на ваш email.',
        cardTitle: 'СЕРТИФИКАТ КОГНИТИВНОГО ТЕСТА',
        cardSub: 'iqtestnow.org • 25 вопросов • 4 шкалы интеллекта',
        cardPercentile: (p) => `Перцентиль: Топ-${100 - p}% (выше ${p}% людей)`
    },
    en: {
        domainNames: {
            numerical: 'Numerical Reasoning',
            spatial: 'Spatial & Matrices',
            verbal: 'Verbal Analogies',
            logic: 'Formal Deduction'
        },
        percentileLabel: (p) => `Higher than ${p}% of test takers`,
        timeTakenLabel: (m, s) => `Time: ${m}m ${s}s`,
        unlockedMsg: '✅ Full 25-question breakdown unlocked! A copy of your report has also been sent to your email.',
        cardTitle: 'COGNITIVE IQ ASSESSMENT REPORT',
        cardSub: 'iqtestnow.org • 25 Questions • 4 Cognitive Domains',
        cardPercentile: (p) => `Percentile: Top ${100 - p}% (beats ${p}% of population)`
    }
};

let extState = {
    lang: 'ru',
    idx: 0,
    answers: [],
    startTime: 0,
    remainingSec: 15 * 60,
    timerId: null,
    result: null
};

function getExtLang() {
    const path = window.location.pathname || '';
    if (path.includes('/en/')) return 'en';
    const htmlLang = document.documentElement && document.documentElement.lang;
    return htmlLang === 'en' ? 'en' : 'ru';
}

function initExtendedIqTest() {
    extState.lang = getExtLang();
    const startBtn = document.getElementById('startExtendedBtn');
    if (startBtn) {
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            startExtendedQuiz();
        });
    }

    const unlockForm = document.getElementById('extendedUnlockForm');
    if (unlockForm) {
        unlockForm.addEventListener('submit', handleExtendedUnlockSubmit);
    }

    const skipUnlockBtn = document.getElementById('skipUnlockBtn');
    if (skipUnlockBtn) {
        skipUnlockBtn.addEventListener('click', function(e) {
            e.preventDefault();
            revealAnswerBreakdown(false);
        });
    }

    const downloadCardBtn = document.getElementById('downloadCertBtn');
    if (downloadCardBtn) {
        downloadCardBtn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadResultCardPng();
        });
    }
}

function startExtendedQuiz() {
    const introEl = document.getElementById('extendedIntro');
    const quizEl = document.getElementById('extendedQuizScreen');
    const resultEl = document.getElementById('extendedResultScreen');

    if (introEl) introEl.style.display = 'none';
    if (resultEl) resultEl.style.display = 'none';
    if (quizEl) quizEl.style.display = 'block';

    extState.idx = 0;
    extState.answers = [];
    extState.startTime = Date.now();
    extState.remainingSec = 15 * 60;

    if (extState.timerId) clearInterval(extState.timerId);
    extState.timerId = setInterval(() => {
        extState.remainingSec--;
        updateExtendedTimerUI();
        if (extState.remainingSec <= 0) {
            clearInterval(extState.timerId);
            finishExtendedQuiz();
        }
    }, 1000);

    updateExtendedTimerUI();
    renderExtendedQuestion();

    if (typeof clarity !== 'undefined') {
        clarity('event', 'extended_iq_start');
    }
}

function updateExtendedTimerUI() {
    const timerEl = document.getElementById('extendedTimer');
    if (!timerEl) return;
    const m = Math.floor(Math.max(0, extState.remainingSec) / 60);
    const s = Math.max(0, extState.remainingSec) % 60;
    timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function renderExtendedQuestion() {
    const list = extendedQuestions[extState.lang];
    const item = list[extState.idx];
    if (!item) {
        finishExtendedQuiz();
        return;
    }

    const numEl = document.getElementById('extCurrentNum');
    const totalEl = document.getElementById('extTotalNum');
    const fillEl = document.getElementById('extProgressFill');
    const domainBadge = document.getElementById('extDomainBadge');
    const qText = document.getElementById('extQuestionText');
    const qData = document.getElementById('extQuestionData');
    const optsEl = document.getElementById('extOptionsContainer');

    if (numEl) numEl.textContent = String(extState.idx + 1);
    if (totalEl) totalEl.textContent = String(list.length);
    if (fillEl) fillEl.style.width = `${((extState.idx + 1) / list.length) * 100}%`;
    if (domainBadge) domainBadge.textContent = extCopy[extState.lang].domainNames[item.domain];
    if (qText) qText.textContent = item.q;
    if (qData) {
        qData.textContent = item.data;
        qData.style.display = item.data ? 'block' : 'none';
    }

    if (optsEl) {
        optsEl.innerHTML = '';
        item.options.forEach((optText, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'option ext-option-btn';
            btn.textContent = optText;
            btn.addEventListener('click', () => selectExtendedAnswer(i));
            optsEl.appendChild(btn);
        });
    }
}

function selectExtendedAnswer(choiceIdx) {
    extState.answers.push(choiceIdx);
    extState.idx++;
    const list = extendedQuestions[extState.lang];
    if (extState.idx < list.length) {
        renderExtendedQuestion();
    } else {
        finishExtendedQuiz();
    }
}

function calculateExtendedResults() {
    const list = extendedQuestions[extState.lang];
    const domainStats = {
        numerical: { score: 0, total: 0 },
        spatial: { score: 0, total: 0 },
        verbal: { score: 0, total: 0 },
        logic: { score: 0, total: 0 }
    };

    let totalCorrect = 0;
    list.forEach((item, i) => {
        const userAns = extState.answers[i];
        const isCorrect = userAns === item.correct;
        domainStats[item.domain].total++;
        if (isCorrect) {
            domainStats[item.domain].score++;
            totalCorrect++;
        }
    });

    const elapsedSec = Math.max(10, Math.round((Date.now() - extState.startTime) / 1000));
    // Speed bonus up to +5 IQ points for fast accurate completion under 8 minutes
    const accuracyRatio = totalCorrect / list.length;
    const speedBonus = accuracyRatio >= 0.6 && elapsedSec < 480 ? Math.round(((480 - elapsedSec) / 480) * 5) : 0;

    // Scaled IQ: 75 to 145
    const rawIq = 75 + Math.round(accuracyRatio * 65) + speedBonus;
    const estimated = Math.max(75, Math.min(148, rawIq));
    const min = Math.max(70, estimated - 6);
    const max = Math.min(160, estimated + 6);

    // Normal CDF approximation for percentile (mean=100, sd=15)
    const z = (estimated - 100) / 15;
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp((-z * z) / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    let percentile = z >= 0 ? (1 - prob) * 100 : prob * 100;
    percentile = Math.max(5, Math.min(99, Math.round(percentile)));

    return {
        estimated,
        min,
        max,
        score: totalCorrect,
        total: list.length,
        percentile,
        elapsedSec,
        domainStats
    };
}

function finishExtendedQuiz() {
    if (extState.timerId) clearInterval(extState.timerId);

    const quizEl = document.getElementById('extendedQuizScreen');
    const resultEl = document.getElementById('extendedResultScreen');
    if (quizEl) quizEl.style.display = 'none';
    if (resultEl) resultEl.style.display = 'block';

    const res = calculateExtendedResults();
    extState.result = res;

    // Populate Teaser (shown before Email Unlock)
    const rawScoreEl = document.getElementById('extRawScoreTeaser');
    const rangeTeaserEl = document.getElementById('extRangeTeaser');
    if (rawScoreEl) {
        rawScoreEl.textContent = extState.lang === 'en'
            ? `Correct Answers: ${res.score} of ${res.total}`
            : `Правильных ответов: ${res.score} из ${res.total}`;
    }
    if (rangeTeaserEl) {
        const roughLow = Math.max(70, Math.floor((res.estimated - 12) / 5) * 5);
        const roughHigh = Math.min(160, Math.ceil((res.estimated + 12) / 5) * 5);
        rangeTeaserEl.textContent = extState.lang === 'en'
            ? `Preliminary Corridor: ${roughLow} – ${roughHigh} (Exact IQ & 4 Scales Locked)`
            : `Предварительный коридор: ${roughLow} – ${roughHigh} (Точный IQ и 4 шкалы ждут отправки)`;
    }

    // Populate Full Profile (locked/blurred until Email Submit or Skip)
    const iqValEl = document.getElementById('extIqValue');
    const iqRangeEl = document.getElementById('extIqRange');
    const pctEl = document.getElementById('extPercentileBadge');
    const timeEl = document.getElementById('extTimeTaken');
    const barsEl = document.getElementById('extDomainBars');

    if (iqValEl) iqValEl.textContent = `IQ ${res.estimated}`;
    if (iqRangeEl) {
        iqRangeEl.textContent = extState.lang === 'en'
            ? `95% Confidence Interval: ${res.min} – ${res.max} (${res.score}/${res.total} correct)`
            : `Доверительный интервал (95%): ${res.min} – ${res.max} (${res.score} из ${res.total} верно)`;
    }
    if (pctEl) pctEl.textContent = extCopy[extState.lang].percentileLabel(res.percentile);
    if (timeEl) {
        const m = Math.floor(res.elapsedSec / 60);
        const s = res.elapsedSec % 60;
        timeEl.textContent = extCopy[extState.lang].timeTakenLabel(m, s);
    }

    if (barsEl) {
        barsEl.innerHTML = '';
        Object.keys(res.domainStats).forEach(domKey => {
            const st = res.domainStats[domKey];
            const pct = Math.round((st.score / st.total) * 100);
            const label = extCopy[extState.lang].domainNames[domKey];
            const row = document.createElement('div');
            row.className = 'domain-bar-row';
            row.innerHTML = `
                <div class="domain-bar-header">
                    <span>${label}</span>
                    <strong>${st.score}/${st.total} (${pct}%)</strong>
                </div>
                <div class="domain-bar-track">
                    <div class="domain-bar-fill" style="width: ${pct}%"></div>
                </div>
            `;
            barsEl.appendChild(row);
        });
    }

    drawResultCanvasCard();

    // Auto-unlock if user already provided email earlier in session
    const savedEmail = localStorage.getItem('extUnlockedEmail');
    if (savedEmail) {
        revealAnswerBreakdown(true);
    }

    if (typeof clarity !== 'undefined') {
        clarity('event', 'extended_iq_complete');
    }
}

async function handleExtendedUnlockSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const nameInput = document.getElementById('extUserName');
    const emailInput = document.getElementById('extUserEmail');
    const honey = document.getElementById('extCompany');
    if (honey && honey.value) return;

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    if (!email) return;

    const res = extState.result || calculateExtendedResults();

    const payload = {
        type: 'send-results-only',
        source: 'extended-15min-test',
        name,
        email,
        lang: extState.lang,
        iqResult: {
            estimated: res.estimated,
            min: res.min,
            max: res.max,
            score: res.score,
            total: res.total
        },
        timestamp: new Date().toISOString()
    };

    try {
        localStorage.setItem('extUnlockedEmail', email);
        const saved = JSON.parse(localStorage.getItem('iqTestContacts') || '[]');
        saved.push(payload);
        localStorage.setItem('iqTestContacts', JSON.stringify(saved));
    } catch (err) {}

    fetch(EXTENDED_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(() => {});

    revealAnswerBreakdown(true);
}

function revealAnswerBreakdown(viaEmail) {
    const gateBox = document.getElementById('extendedEmailGate');
    const fullProfileBox = document.getElementById('extendedFullProfile');
    const breakdownBox = document.getElementById('extendedBreakdownBox');
    const listContainer = document.getElementById('extendedBreakdownList');
    const noticeEl = document.getElementById('extendedUnlockedNotice');

    if (gateBox) gateBox.style.display = 'none';
    if (fullProfileBox) {
        fullProfileBox.classList.remove('locked-blur');
        fullProfileBox.style.display = 'block';
    }
    if (breakdownBox) breakdownBox.style.display = 'block';
    if (noticeEl) {
        noticeEl.textContent = viaEmail ? extCopy[extState.lang].unlockedMsg : '';
        noticeEl.style.display = viaEmail ? 'block' : 'none';
    }

    if (!listContainer) return;
    listContainer.innerHTML = '';

    const list = extendedQuestions[extState.lang];
    list.forEach((item, idx) => {
        const userAns = extState.answers[idx];
        const isCorrect = userAns === item.correct;
        const userText = userAns != null && item.options[userAns] ? item.options[userAns] : '—';
        const correctText = item.options[item.correct];

        const card = document.createElement('div');
        card.className = `breakdown-item ${isCorrect ? 'is-correct' : 'is-wrong'}`;
        card.innerHTML = `
            <div class="breakdown-header">
                <span class="breakdown-num">#${idx + 1} • ${extCopy[extState.lang].domainNames[item.domain]}</span>
                <span class="breakdown-status">${isCorrect ? '✅' : '❌'}</span>
            </div>
            <div class="breakdown-q">${item.q} ${item.data ? `<code>${item.data}</code>` : ''}</div>
            <div class="breakdown-ans">
                <span>${extState.lang === 'en' ? 'Your answer:' : 'Ваш ответ:'} <strong>${userText}</strong></span>
                ${!isCorrect ? ` • <span>${extState.lang === 'en' ? 'Correct:' : 'Верно:'} <strong>${correctText}</strong></span>` : ''}
            </div>
            <div class="breakdown-exp">💡 ${item.exp}</div>
        `;
        listContainer.appendChild(card);
    });
}

function drawResultCanvasCard() {
    const canvas = document.getElementById('extResultCanvas');
    if (!canvas || !extState.result) return;
    const ctx = canvas.getContext('2d');
    const res = extState.result;
    const copy = extCopy[extState.lang];

    // 1200x630 HD card
    canvas.width = 1200;
    canvas.height = 630;

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, 1200, 630);
    grad.addColorStop(0, '#4f46e5');
    grad.addColorStop(1, '#7c3aed');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);

    // Card inner panel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.beginPath();
    ctx.roundRect(60, 50, 1080, 530, 28);
    ctx.fill();

    // Header
    ctx.fillStyle = '#4f46e5';
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
    ctx.fillText(copy.cardTitle, 110, 115);

    ctx.fillStyle = '#6b7280';
    ctx.font = '22px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
    ctx.fillText(copy.cardSub, 110, 152);

    // Big IQ Score Badge
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 110px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
    ctx.fillText(`IQ ${res.estimated}`, 110, 290);

    ctx.fillStyle = '#4f46e5';
    ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
    ctx.fillText(copy.cardPercentile(res.percentile), 110, 345);

    ctx.fillStyle = '#4b5563';
    ctx.font = '24px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
    const rangeLabel = extState.lang === 'en'
        ? `95% Interval: ${res.min}–${res.max}  |  Score: ${res.score}/${res.total}`
        : `Интервал 95%: ${res.min}–${res.max}  |  Верно: ${res.score} из ${res.total}`;
    ctx.fillText(rangeLabel, 110, 395);

    // Right side domain bars
    const domains = Object.keys(res.domainStats);
    let y = 200;
    domains.forEach(domKey => {
        const st = res.domainStats[domKey];
        const pct = Math.round((st.score / st.total) * 100);
        const label = copy.domainNames[domKey];

        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
        ctx.fillText(`${label} (${pct}%)`, 650, y);

        // Track
        ctx.fillStyle = '#e5e7eb';
        ctx.beginPath();
        ctx.roundRect(650, y + 12, 420, 22, 11);
        ctx.fill();

        // Fill
        ctx.fillStyle = '#4f46e5';
        ctx.beginPath();
        ctx.roundRect(650, y + 12, Math.max(22, (420 * pct) / 100), 22, 11);
        ctx.fill();

        y += 85;
    });

    // Footer URL
    ctx.fillStyle = '#9ca3af';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
    ctx.fillText('https://iqtestnow.org', 110, 530);
}

function downloadResultCardPng() {
    const canvas = document.getElementById('extResultCanvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `iqtestnow-certificate-${extState.result ? extState.result.estimated : 'iq'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExtendedIqTest);
} else {
    initExtendedIqTest();
}
