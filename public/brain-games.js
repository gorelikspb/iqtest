/**
 * Interactive Brain Games (Schulte Table & Reaction/Stroop Benchmark)
 * Bilingual (RU/EN), viral share, lead capture integration with Worker & Telegram.
 */

const BRAIN_GAMES_WORKER_URL = 'https://iqtestemails.gorelikgo.workers.dev';

const brainGamesI18n = {
    ru: {
        // Schulte
        schulteRound: 'Текущее число:',
        schulteTime: 'Время:',
        schulteErrors: 'Ошибки:',
        schulteStart: 'Начать таблицу 5×5',
        schulteTryAgain: 'Сыграть ещё раз',
        schulteDoneTitle: '🎉 Таблица пройдена!',
        schulteYourTime: 'Ваше время:',
        schulteSec: 'сек',
        schulteNormFast: '⚡ Феноменально! Уровень скорочтения и топ-5% концентрации (< 30 сек).',
        schulteNormGood: '🔥 Отличный результат! Выше среднего (30–45 сек).',
        schulteNormAvg: '👍 Нормальный взрослый показатель (45–60 сек). Тренируйтесь для ускорения!',
        schulteNormSlow: '🌱 Есть куда расти (> 60 сек). Попробуйте удерживать взгляд в центре таблицы!',
        schulteShareText: 'Я прошел таблицу Шульте 5×5 за {time} сек! Попробуй побить мой рекорд концентрации: ',
        // Reaction & Stroop
        reactionWait: 'Ждите ЗЕЛЕНЫЙ цвет...',
        reactionClickNow: 'ЖМИТЕ СЕЙЧАС!',
        reactionTooEarly: 'Слишком рано! Нажмите, чтобы попробовать снова.',
        reactionClickToStart: 'Нажмите здесь, чтобы начать раунд {round} из 5',
        reactionRoundResult: 'Раунд {round}: {ms} мс. Нажмите для следующего!',
        reactionDoneTitle: '⚡ Ваш результат реакции и внимания',
        reactionAvg: 'Средняя скорость реакции:',
        reactionMs: 'мс',
        reactionNormFast: '🚀 Киберспортивный уровень (< 215 мс)! Топ-10% скорости нервной системы.',
        reactionNormGood: '⚡ Отличная реакция (215–260 мс)! Быстрее большинства людей.',
        reactionNormAvg: '👍 Средняя норма человека (260–320 мс).',
        reactionNormSlow: '☕ Немного сонная реакция (> 320 мс). Попробуйте ещё раз!',
        reactionShareText: 'Моя скорость реакции — {ms} мс! Проверь свои рефлексы на тренажере мозга: ',
        stroopTitle: 'Тест Струпа (Концентрация)',
        stroopInstruction: 'Выберите ЦВЕТ текста, а не само слово!',
        stroopScore: 'Правильно: {score} из {total} ({time} сек)',
        // Common lead / share
        copied: '✅ Скопировано в буфер обмена!',
        emailSaved: '✅ Отлично! Результат и программа тренировок отправлены на ваш email.',
        emailError: 'Сохранено локально! Проверьте подключение.'
    },
    en: {
        // Schulte
        schulteRound: 'Find number:',
        schulteTime: 'Time:',
        schulteErrors: 'Errors:',
        schulteStart: 'Start 5×5 Grid',
        schulteTryAgain: 'Play Again',
        schulteDoneTitle: '🎉 Grid Completed!',
        schulteYourTime: 'Your time:',
        schulteSec: 'sec',
        schulteNormFast: '⚡ Phenomenal! Speed-reader level & Top 5% focus (< 30 sec).',
        schulteNormGood: '🔥 Great result! Above average peripheral vision (30–45 sec).',
        schulteNormAvg: '👍 Normal adult benchmark (45–60 sec). Keep training to go faster!',
        schulteNormSlow: '🌱 Room to grow (> 60 sec). Tip: keep your gaze fixed on the center cell!',
        schulteShareText: 'I completed the 5×5 Schulte Table in {time}s! Can you beat my focus record? ',
        // Reaction & Stroop
        reactionWait: 'Wait for GREEN...',
        reactionClickNow: 'CLICK NOW!',
        reactionTooEarly: 'Too early! Click to try again.',
        reactionClickToStart: 'Click here to start Round {round} of 5',
        reactionRoundResult: 'Round {round}: {ms} ms. Click for next round!',
        reactionDoneTitle: '⚡ Your Reaction & Focus Benchmark',
        reactionAvg: 'Average reaction time:',
        reactionMs: 'ms',
        reactionNormFast: '🚀 Pro Gamer reflexes (< 215 ms)! Top 10% neural processing speed.',
        reactionNormGood: '⚡ Sharp reflexes (215–260 ms)! Faster than average.',
        reactionNormAvg: '👍 Average human benchmark (260–320 ms).',
        reactionNormSlow: '☕ A bit sleepy (> 320 ms). Give it another shot!',
        reactionShareText: 'My average reaction time is {ms} ms! Test your reflexes on the Brain Benchmark: ',
        stroopTitle: 'Stroop Effect Challenge',
        stroopInstruction: 'Click the INK COLOR of the word, not what the word reads!',
        stroopScore: 'Correct: {score} of {total} ({time}s)',
        // Common lead / share
        copied: '✅ Link copied to clipboard!',
        emailSaved: '✅ Saved! Your benchmark & brain training guide are on the way.',
        emailError: 'Saved locally! Please check your connection.'
    }
};

function getGameLang() {
    const path = window.location.pathname || '';
    if (path.includes('/en/')) return 'en';
    const htmlLang = document.documentElement && document.documentElement.lang;
    return htmlLang === 'en' ? 'en' : 'ru';
}

function gt(key, params = {}) {
    const lang = getGameLang();
    let str = (brainGamesI18n[lang] && brainGamesI18n[lang][key]) || brainGamesI18n.ru[key] || key;
    Object.keys(params).forEach(k => {
        str = str.replace(`{${k}}`, params[k]);
    });
    return str;
}

async function sendGameLeadToWorker(payload) {
    const lang = getGameLang();
    const fullPayload = {
        ...payload,
        lang,
        timestamp: new Date().toISOString()
    };
    try {
        const list = JSON.parse(localStorage.getItem('iqTestContacts') || '[]');
        list.push(fullPayload);
        localStorage.setItem('iqTestContacts', JSON.stringify(list));
    } catch (e) {}

    try {
        const res = await fetch(BRAIN_GAMES_WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fullPayload)
        });
        return await res.json();
    } catch (err) {
        return { success: false, error: err.message };
    }
}

// ==================== 1. SCHULTE TABLE 5x5 ====================
let schulteState = {
    current: 1,
    errors: 0,
    startTime: 0,
    timerId: null,
    isPlaying: false,
    lastTimeSec: null
};

function initSchultePage() {
    const gridEl = document.getElementById('schulteGrid');
    if (!gridEl) return;

    const startBtn = document.getElementById('schulteStartBtn');
    const restartBtn = document.getElementById('schulteRestartBtn');
    const leadForm = document.getElementById('schulteLeadForm');
    const copyBtn = document.getElementById('schulteShareCopy');
    const tgBtn = document.getElementById('schulteShareTelegram');
    const waBtn = document.getElementById('schulteShareWhatsApp');

    renderSchultePreview(gridEl);

    if (startBtn) {
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            startSchulteGame();
        });
    }
    if (restartBtn) {
        restartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            startSchulteGame();
        });
    }
    if (leadForm) {
        leadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            const emailInput = document.getElementById('schulteLeadEmail');
            const nameInput = document.getElementById('schulteLeadName');
            const honey = document.getElementById('schulteCompany');
            if (honey && honey.value) return;

            const email = emailInput ? emailInput.value.trim() : '';
            const name = nameInput ? nameInput.value.trim() : '';
            if (!email) return;

            localStorage.setItem('brainGameEmail', email);
            const statusEl = document.getElementById('schulteLeadStatus');
            if (statusEl) {
                statusEl.textContent = gt('emailSaved');
                statusEl.style.display = 'block';
            }
            leadForm.style.display = 'none';

            const sec = schulteState.lastTimeSec || 35;
            const iqEq = Math.max(85, Math.min(145, Math.round(135 - (sec - 25) * 0.8)));

            await sendGameLeadToWorker({
                type: 'send-results-only',
                source: 'schulte-table-game',
                name,
                email,
                iqResult: {
                    estimated: iqEq,
                    min: Math.max(75, iqEq - 10),
                    max: Math.min(160, iqEq + 10),
                    score: `${sec}s (Schulte 5x5)`,
                    total: '25 cells'
                }
            });
        });
    }

    const getShareData = () => {
        const sec = schulteState.lastTimeSec || '30.0';
        const url = `https://iqtestnow.org/${getGameLang()}/schulte-table.html`;
        const text = gt('schulteShareText', { time: sec });
        return { url, text };
    };

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const { url, text } = getShareData();
            navigator.clipboard?.writeText(text + url);
            const msg = document.getElementById('schulteShareMsg');
            if (msg) {
                msg.textContent = gt('copied');
                msg.style.display = 'block';
                setTimeout(() => (msg.style.display = 'none'), 2500);
            }
        });
    }
    if (tgBtn) {
        tgBtn.addEventListener('click', () => {
            const { url, text } = getShareData();
            window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        });
    }
    if (waBtn) {
        waBtn.addEventListener('click', () => {
            const { url, text } = getShareData();
            window.open(`https://wa.me/?text=${encodeURIComponent(text + url)}`, '_blank');
        });
    }
}

function renderSchultePreview(gridEl) {
    gridEl.innerHTML = '';
    for (let i = 1; i <= 25; i++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'schulte-cell preview';
        cell.textContent = i;
        if (i === 13) cell.classList.add('center-dot');
        gridEl.appendChild(cell);
    }
}

function startSchulteGame() {
    const gridEl = document.getElementById('schulteGrid');
    const hudEl = document.getElementById('schulteHud');
    const resultEl = document.getElementById('schulteResult');
    const startBtn = document.getElementById('schulteStartBtn');
    const nextNumEl = document.getElementById('schulteNextNum');
    const errorsEl = document.getElementById('schulteErrors');
    const timerEl = document.getElementById('schulteTimer');

    if (startBtn) startBtn.style.display = 'none';
    if (resultEl) resultEl.style.display = 'none';
    if (hudEl) hudEl.style.display = 'flex';
    if (gridEl) gridEl.style.display = 'grid';

    schulteState.current = 1;
    schulteState.errors = 0;
    schulteState.isPlaying = true;
    schulteState.startTime = performance.now();

    if (nextNumEl) nextNumEl.textContent = '1';
    if (errorsEl) errorsEl.textContent = '0';
    if (timerEl) timerEl.textContent = '0.0';

    if (schulteState.timerId) clearInterval(schulteState.timerId);
    schulteState.timerId = setInterval(() => {
        if (!schulteState.isPlaying) return;
        const elapsed = ((performance.now() - schulteState.startTime) / 1000).toFixed(1);
        if (timerEl) timerEl.textContent = elapsed;
    }, 100);

    // Shuffle 1..25
    const nums = Array.from({ length: 25 }, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    gridEl.innerHTML = '';
    nums.forEach((num, idx) => {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'schulte-cell';
        if (idx === 12) cell.classList.add('center-dot');
        cell.textContent = num;
        cell.dataset.num = num;
        cell.addEventListener('click', () => onSchulteCellClick(cell, num));
        gridEl.appendChild(cell);
    });
}

function onSchulteCellClick(cell, num) {
    if (!schulteState.isPlaying) return;
    const nextNumEl = document.getElementById('schulteNextNum');
    const errorsEl = document.getElementById('schulteErrors');

    if (num === schulteState.current) {
        cell.classList.add('hit');
        setTimeout(() => cell.classList.remove('hit'), 250);
        schulteState.current++;
        if (schulteState.current > 25) {
            finishSchulteGame();
        } else if (nextNumEl) {
            nextNumEl.textContent = String(schulteState.current);
        }
    } else {
        schulteState.errors++;
        if (errorsEl) errorsEl.textContent = String(schulteState.errors);
        cell.classList.add('miss');
        setTimeout(() => cell.classList.remove('miss'), 300);
    }
}

function finishSchulteGame() {
    schulteState.isPlaying = false;
    if (schulteState.timerId) clearInterval(schulteState.timerId);

    const totalSec = ((performance.now() - schulteState.startTime) / 1000).toFixed(1);
    schulteState.lastTimeSec = totalSec;

    const resultEl = document.getElementById('schulteResult');
    const timeValEl = document.getElementById('schulteFinalTime');
    const normEl = document.getElementById('schulteNormText');

    if (timeValEl) timeValEl.textContent = `${totalSec} ${gt('schulteSec')}`;
    const secNum = parseFloat(totalSec);
    let normKey = 'schulteNormSlow';
    if (secNum < 30) normKey = 'schulteNormFast';
    else if (secNum < 45) normKey = 'schulteNormGood';
    else if (secNum <= 60) normKey = 'schulteNormAvg';

    if (normEl) normEl.textContent = gt(normKey);
    if (resultEl) resultEl.style.display = 'block';

    if (typeof clarity !== 'undefined') {
        clarity('event', 'schulte_complete');
    }
}

// ==================== 2. REACTION TIME & STROOP BENCHMARK ====================
let reactionState = {
    round: 0,
    maxRounds: 5,
    times: [],
    status: 'idle', // idle | waiting | ready | early | done
    timeoutId: null,
    greenTimestamp: 0,
    avgMs: null
};

function initReactionPage() {
    const padEl = document.getElementById('reactionPad');
    if (!padEl) return;

    const restartBtn = document.getElementById('reactionRestartBtn');
    const leadForm = document.getElementById('reactionLeadForm');
    const copyBtn = document.getElementById('reactionShareCopy');
    const tgBtn = document.getElementById('reactionShareTelegram');
    const waBtn = document.getElementById('reactionShareWhatsApp');

    padEl.addEventListener('mousedown', handleReactionTrigger);
    padEl.addEventListener('touchstart', function(e) {
        e.preventDefault();
        handleReactionTrigger();
    }, { passive: false });

    if (restartBtn) {
        restartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetReactionBenchmark();
        });
    }

    if (leadForm) {
        leadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            const emailInput = document.getElementById('reactionLeadEmail');
            const nameInput = document.getElementById('reactionLeadName');
            const honey = document.getElementById('reactionCompany');
            if (honey && honey.value) return;

            const email = emailInput ? emailInput.value.trim() : '';
            const name = nameInput ? nameInput.value.trim() : '';
            if (!email) return;

            const statusEl = document.getElementById('reactionLeadStatus');
            if (statusEl) {
                statusEl.textContent = gt('emailSaved');
                statusEl.style.display = 'block';
            }
            leadForm.style.display = 'none';

            const ms = reactionState.avgMs || 250;
            const iqEq = Math.max(85, Math.min(145, Math.round(135 - (ms - 200) * 0.25)));

            await sendGameLeadToWorker({
                type: 'send-results-only',
                source: 'reaction-benchmark-game',
                name,
                email,
                iqResult: {
                    estimated: iqEq,
                    min: Math.max(75, iqEq - 10),
                    max: Math.min(160, iqEq + 10),
                    score: `${ms} ms (Reaction Benchmark)`,
                    total: '5 rounds'
                }
            });
        });
    }

    const getShareData = () => {
        const ms = reactionState.avgMs || 245;
        const url = `https://iqtestnow.org/${getGameLang()}/reaction-test.html`;
        const text = gt('reactionShareText', { ms });
        return { url, text };
    };

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const { url, text } = getShareData();
            navigator.clipboard?.writeText(text + url);
            const msg = document.getElementById('reactionShareMsg');
            if (msg) {
                msg.textContent = gt('copied');
                msg.style.display = 'block';
                setTimeout(() => (msg.style.display = 'none'), 2500);
            }
        });
    }
    if (tgBtn) {
        tgBtn.addEventListener('click', () => {
            const { url, text } = getShareData();
            window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        });
    }
    if (waBtn) {
        waBtn.addEventListener('click', () => {
            const { url, text } = getShareData();
            window.open(`https://wa.me/?text=${encodeURIComponent(text + url)}`, '_blank');
        });
    }
}

function resetReactionBenchmark() {
    reactionState.round = 0;
    reactionState.times = [];
    reactionState.status = 'idle';
    if (reactionState.timeoutId) clearTimeout(reactionState.timeoutId);

    const padEl = document.getElementById('reactionPad');
    const padText = document.getElementById('reactionPadText');
    const resultEl = document.getElementById('reactionResult');
    const historyEl = document.getElementById('reactionHistory');

    if (resultEl) resultEl.style.display = 'none';
    if (historyEl) historyEl.innerHTML = '';
    if (padEl) {
        padEl.style.display = 'flex';
        padEl.className = 'reaction-pad state-idle';
    }
    if (padText) {
        padText.textContent = gt('reactionClickToStart', { round: 1 });
    }
}

function handleReactionTrigger() {
    const padEl = document.getElementById('reactionPad');
    const padText = document.getElementById('reactionPadText');
    if (!padEl || !padText) return;

    if (reactionState.status === 'idle' || reactionState.status === 'early') {
        // Start waiting for green
        reactionState.status = 'waiting';
        padEl.className = 'reaction-pad state-waiting';
        padText.textContent = gt('reactionWait');

        const delay = 1500 + Math.floor(Math.random() * 2800);
        reactionState.timeoutId = setTimeout(() => {
            reactionState.status = 'ready';
            reactionState.greenTimestamp = performance.now();
            padEl.className = 'reaction-pad state-ready';
            padText.textContent = gt('reactionClickNow');
        }, delay);
    } else if (reactionState.status === 'waiting') {
        // Clicked too early!
        if (reactionState.timeoutId) clearTimeout(reactionState.timeoutId);
        reactionState.status = 'early';
        padEl.className = 'reaction-pad state-early';
        padText.textContent = gt('reactionTooEarly');
    } else if (reactionState.status === 'ready') {
        // Measure reaction time
        const ms = Math.max(80, Math.round(performance.now() - reactionState.greenTimestamp));
        reactionState.times.push(ms);
        reactionState.round++;

        updateReactionHistory();

        if (reactionState.round >= reactionState.maxRounds) {
            finishReactionBenchmark();
        } else {
            reactionState.status = 'idle';
            padEl.className = 'reaction-pad state-idle';
            padText.textContent = gt('reactionRoundResult', { round: reactionState.round, ms });
        }
    }
}

function updateReactionHistory() {
    const historyEl = document.getElementById('reactionHistory');
    if (!historyEl) return;
    historyEl.innerHTML = reactionState.times
        .map((ms, i) => `<span class="reaction-pill">#${i + 1}: <strong>${ms} ms</strong></span>`)
        .join('');
}

function finishReactionBenchmark() {
    reactionState.status = 'done';
    const sum = reactionState.times.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / reactionState.times.length);
    reactionState.avgMs = avg;

    const padEl = document.getElementById('reactionPad');
    const resultEl = document.getElementById('reactionResult');
    const avgValEl = document.getElementById('reactionFinalMs');
    const normEl = document.getElementById('reactionNormText');

    if (padEl) padEl.style.display = 'none';
    if (avgValEl) avgValEl.textContent = `${avg} ${gt('reactionMs')}`;

    let normKey = 'reactionNormSlow';
    if (avg < 215) normKey = 'reactionNormFast';
    else if (avg <= 260) normKey = 'reactionNormGood';
    else if (avg <= 320) normKey = 'reactionNormAvg';

    if (normEl) normEl.textContent = gt(normKey);
    if (resultEl) resultEl.style.display = 'block';

    if (typeof clarity !== 'undefined') {
        clarity('event', 'reaction_complete');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initSchultePage();
        initReactionPage();
    });
} else {
    initSchultePage();
    initReactionPage();
}
