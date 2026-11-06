/**
 * End-to-End Puppeteer test suite for:
 * 1. Quick IQ Test + Referral Banner + Blurred Exact IQ Gate + Email Unlock
 * 2. Extended 15-Minute IQ Test (25 questions) + Blurred Profile Gate + Email Unlock + Canvas Certificate
 * 3. Schulte Table 5x5 (1..25 complete run) + Lead Capture
 * 4. Reaction Time Benchmark (5 rounds) + Lead Capture
 */

const puppeteer = require('puppeteer');
const path = require('path');
const assert = require('assert');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const http = require('http');
const fs = require('fs');

function startStaticServer(rootDir) {
    return new Promise((resolve) => {
        const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
        const server = http.createServer((req, res) => {
            const urlObj = new URL(req.url, 'http://127.0.0.1');
            let filePath = path.join(rootDir, decodeURIComponent(urlObj.pathname));
            if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                filePath = path.join(filePath, 'index.html');
            }
            if (!fs.existsSync(filePath)) {
                res.writeHead(404);
                res.end('Not found');
                return;
            }
            const ext = path.extname(filePath);
            res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
            res.end(fs.readFileSync(filePath));
        });
        server.listen(0, '127.0.0.1', () => {
            const { port } = server.address();
            resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
        });
    });
}

async function runSuite() {
    console.log('🚀 Запуск полного E2E-тестирования (Puppeteer + Local HTTP Server)...\n');
    const { server, baseUrl } = await startStaticServer(PUBLIC_DIR);
    const fileUrl = (relPath, query = '') => `${baseUrl}/${relPath}${query}`;
    const browser = await puppeteer.launch({ headless: 'new' });
    let failed = 0;

    async function step(name, fn) {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        const pageErrors = [];
        page.on('pageerror', (err) => pageErrors.push(err.message));

        // Mock Worker POST and external analytics (clarity.ms) so tests run fast offline
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.url().includes('workers.dev')) {
                req.respond({
                    status: 200,
                    contentType: 'application/json',
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ success: true, id: 'mock_e2e_id' })
                });
            } else if (req.url().includes('clarity.ms')) {
                req.respond({
                    status: 200,
                    contentType: 'application/javascript',
                    body: '/* clarity mocked */'
                });
            } else {
                req.continue();
            }
        });
        page.on('dialog', async (dialog) => {
            await dialog.accept();
        });

        try {
            await fn(page);
            if (pageErrors.length > 0) {
                throw new Error(`JS Page Errors: ${pageErrors.join('; ')}`);
            }
            console.log(`  ✅ ${name}`);
        } catch (err) {
            failed++;
            console.error(`  ❌ ${name}`);
            console.error(`     ${err.message}`);
        } finally {
            await page.close();
        }
    }

    // 1. Quick IQ Test + Referral Challenge Banner + Email Gate Unlock
    await step('RU Quick IQ Test: баннер "Вызов от друга", прохождение 7 вопросов, блюр точного IQ до ввода Email и разблокировка', async (page) => {
        await page.goto(fileUrl('ru/index.html', '?iq=130&min=110&max=150'), { waitUntil: 'domcontentloaded' });

        // Check Friend Challenge Banner
        const bannerText = await page.$eval('#friendChallengeBanner', (el) => el.textContent);
        assert(bannerText.includes('130'), 'Friend challenge banner should show IQ 130');

        // Check Brain Hub cards
        const hubCount = await page.$$eval('.brain-hub-card', (els) => els.length);
        assert.strictEqual(hubCount, 3, 'Should have 3 Brain Hub cards on home page');

        // Start Quick Test and answer 7 questions
        await page.click('#startBtn');
        for (let i = 0; i < 7; i++) {
            await page.waitForSelector('.option');
            const options = await page.$$('.option');
            await options[1].click();
            await page.click('#nextBtn');
        }

        // Result screen should be visible, exact IQ should have locked-blur class before email
        const isBlurredBefore = await page.$eval('#iqValue', (el) => el.classList.contains('locked-blur'));
        assert.strictEqual(isBlurredBefore, true, 'Exact IQ should be blurred before email submission');

        // Submit email to unlock
        await page.type('#sendResultsName', 'Тест Пользователь');
        await page.type('#sendResultsEmail', 'test@example.com');
        await page.click('#sendResultsForm button[type="submit"]');

        const isBlurredAfter = await page.$eval('#iqValue', (el) => el.classList.contains('locked-blur'));
        assert.strictEqual(isBlurredAfter, false, 'Exact IQ should unblur immediately after email submit');
    });

    // 2. Extended 15-Minute IQ Test (25 questions, 4 domains, Email Gate, Canvas Certificate)
    await step('EN Extended 15-Min IQ Test: 25 вопросов, тизер результата, блюр профиля до ввода Email, разблокировка 25 решений и Canvas PNG', async (page) => {
        await page.goto(fileUrl('en/full-tests.html'), { waitUntil: 'domcontentloaded' });

        await page.click('#startExtendedBtn');
        for (let i = 0; i < 25; i++) {
            await page.waitForSelector('.ext-option-btn');
            const btns = await page.$$('.ext-option-btn');
            await btns[1].click();
        }

        // Result screen should appear with Email Gate visible and Full Profile blurred
        const gateVisible = await page.$eval('#extendedEmailGate', (el) => window.getComputedStyle(el).display !== 'none');
        const profileBlurred = await page.$eval('#extendedFullProfile', (el) => el.classList.contains('locked-blur'));
        const teaserText = await page.$eval('#extRawScoreTeaser', (el) => el.textContent);

        assert.strictEqual(gateVisible, true, 'Extended Email Gate must be visible first');
        assert.strictEqual(profileBlurred, true, 'Extended Full Profile must be blurred before email');
        assert(teaserText.includes('of 25'), `Teaser should show raw score out of 25, got: ${teaserText}`);

        // Submit email in gate
        await page.type('#extUserName', 'Alex Tester');
        await page.type('#extUserEmail', 'alex@example.com');
        await page.click('#extendedUnlockForm button[type="submit"]');

        const profileUnblurred = await page.$eval('#extendedFullProfile', (el) => !el.classList.contains('locked-blur'));
        const breakdownCount = await page.$$eval('#extendedBreakdownList .breakdown-item', (els) => els.length);
        const canvasWidth = await page.$eval('#extResultCanvas', (el) => el.width);

        assert.strictEqual(profileUnblurred, true, 'Extended Full Profile must unblur after email submit');
        assert.strictEqual(breakdownCount, 25, 'All 25 detailed explanations must be rendered');
        assert.strictEqual(canvasWidth, 1200, 'Result certificate canvas must be rendered at 1200px width');
    });

    // 3. Schulte Table 5x5 Game
    await step('RU Таблица Шульте 5×5: старт, прохождение чисел 1..25, показ времени и отправка лида', async (page) => {
        await page.goto(fileUrl('ru/schulte-table.html'), { waitUntil: 'domcontentloaded' });
        await page.click('#schulteStartBtn');

        // Click 1 to 25 in order
        for (let num = 1; num <= 25; num++) {
            await page.evaluate((n) => {
                const cells = [...document.querySelectorAll('.schulte-cell')];
                const target = cells.find((c) => Number(c.dataset.num) === n);
                if (target) target.click();
            }, num);
        }

        const resultVisible = await page.$eval('#schulteResult', (el) => window.getComputedStyle(el).display !== 'none');
        assert.strictEqual(resultVisible, true, 'Schulte result panel should appear after clicking 25');

        await page.type('#schulteLeadName', 'Иван');
        await page.type('#schulteLeadEmail', 'ivan@example.com');
        await page.click('#schulteLeadForm button[type="submit"]');

        const statusVisible = await page.$eval('#schulteLeadStatus', (el) => window.getComputedStyle(el).display !== 'none');
        assert.strictEqual(statusVisible, true, 'Schulte lead status confirmation should appear');
    });

    // 4. Reaction Time Benchmark
    await step('EN Reaction Time Test: 5 раундов, расчет среднего мс и сохранение результата на Email', async (page) => {
        await page.goto(fileUrl('en/reaction-test.html'), { waitUntil: 'domcontentloaded' });

        // Fast-forward 5 rounds via state simulation + trigger
        await page.evaluate(() => {
            reactionState.times = [210, 225, 218, 230];
            reactionState.round = 4;
            reactionState.status = 'ready';
            reactionState.greenTimestamp = performance.now() - 215;
            handleReactionTrigger();
        });

        const resultVisible = await page.$eval('#reactionResult', (el) => window.getComputedStyle(el).display !== 'none');
        const finalMsText = await page.$eval('#reactionFinalMs', (el) => el.textContent);
        assert.strictEqual(resultVisible, true, 'Reaction result box should appear after 5th round');
        assert(finalMsText.includes('ms'), `Final reaction score should contain ms, got: ${finalMsText}`);

        await page.type('#reactionLeadEmail', 'gamer@example.com');
        await page.click('#reactionLeadForm button[type="submit"]');
        const statusVisible = await page.$eval('#reactionLeadStatus', (el) => window.getComputedStyle(el).display !== 'none');
        assert.strictEqual(statusVisible, true, 'Reaction lead status confirmation should appear');
    });

    // 5. Memory Training Difficulty Slider (3..9 numbers)
    await step('RU Тренировка памяти: выбор сложности ползунком (3 цифры) и генерация последовательности ровно из 3 чисел', async (page) => {
        await page.goto(fileUrl('ru/memory-training.html'), { waitUntil: 'domcontentloaded' });

        // Close initial modal via Later button
        await page.click('#memoryGameEmailLater');

        // Set slider to 3 and restart game
        await page.evaluate(() => {
            const slider = document.getElementById('memoryLengthSlider');
            slider.value = '3';
            slider.dispatchEvent(new Event('input', { bubbles: true }));
            resetMemoryGame();
            startMemoryGame();
        });

        const labelVal = await page.$eval('#memoryLengthValue', (el) => el.textContent.trim());
        const seqLength = await page.evaluate(() => memoryGameState.sequence.length);

        assert.strictEqual(labelVal, '3', 'Slider label should update to 3');
        assert.strictEqual(seqLength, 3, 'Generated memory sequence length should equal slider value (3)');
    });

    await browser.close();
    server.close();

    if (failed > 0) {
        console.error(`\n❌ Тестов провалено: ${failed}`);
        process.exit(1);
    } else {
        console.log('\n🎉 Все E2E-тесты пройдены без единой ошибки!');
    }
}

runSuite();
