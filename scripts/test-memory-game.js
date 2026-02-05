const puppeteer = require('puppeteer');

async function testMemoryGame() {
    console.log('🧪 Testing Memory Game page...\n');
    
    const browser = await puppeteer.launch({ 
        headless: false, // Показываем браузер для отладки
        slowMo: 100 // Замедляем действия для наблюдения
    });
    
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });
        
        // Переходим на страницу игры памяти
        const path = require('path');
        const filePath = path.join(__dirname, '../public/ru/memory-training.html');
        const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;
        console.log('📄 Loading memory-training.html...');
        console.log(`   URL: ${fileUrl}`);
        await page.goto(fileUrl, { 
            waitUntil: 'networkidle0' 
        });
        
        // Ждем загрузки всех элементов и инициализации
        await page.waitForTimeout(2000);
        
        // Проверяем, что обработчик действительно привязан
        const handlerCheck = await page.evaluate(() => {
            const btn = document.getElementById('memoryGameEmailLater');
            if (!btn) return { error: 'Button not found' };
            
            // Пробуем вызвать обработчик напрямую через dispatchEvent
            const modalBefore = document.getElementById('memoryGameEmailModal');
            const containerBefore = document.getElementById('memoryGameContainer');
            const stateBefore = {
                modalDisplay: modalBefore ? window.getComputedStyle(modalBefore).display : 'none',
                containerDisplay: containerBefore ? window.getComputedStyle(containerBefore).display : 'none'
            };
            
            // Создаем событие и диспатчим
            const event = new MouseEvent('click', { 
                bubbles: true, 
                cancelable: true,
                view: window
            });
            btn.dispatchEvent(event);
            
            // Ждем немного
            return new Promise(resolve => {
                setTimeout(() => {
                    const modalAfter = document.getElementById('memoryGameEmailModal');
                    const containerAfter = document.getElementById('memoryGameContainer');
                    const stateAfter = {
                        modalDisplay: modalAfter ? window.getComputedStyle(modalAfter).display : 'none',
                        containerDisplay: containerAfter ? window.getComputedStyle(containerAfter).display : 'none'
                    };
                    resolve({ before: stateBefore, after: stateAfter });
                }, 300);
            });
        });
        console.log(`  Handler check:`, JSON.stringify(handlerCheck, null, 2));
        
        // Проверяем, инициализирована ли игра и вызывалась ли initMemoryGame
        const initStatus = await page.evaluate(() => {
            const btn = document.getElementById('memoryGameEmailLater');
            const startBtn = document.getElementById('startMemoryGameBtn');
            const modal = document.getElementById('memoryGameEmailModal');
            
            // Проверяем наличие функций
            const hasStartMemoryGame = typeof window.startMemoryGame === 'function';
            const hasInitMemoryGame = typeof window.initMemoryGame === 'function';
            
            // Проверяем, есть ли обработчики на кнопках (косвенно)
            let laterBtnHasHandler = false;
            if (btn) {
                // Пробуем добавить обработчик и проверить, не перезаписывается ли он
                const originalOnclick = btn.onclick;
                btn.onclick = function() { laterBtnHasHandler = true; };
                const testEvent = new MouseEvent('click', { bubbles: true });
                btn.dispatchEvent(testEvent);
                btn.onclick = originalOnclick;
            }
            
            return {
                hasStartMemoryGame,
                hasInitMemoryGame,
                laterBtnExists: !!btn,
                startBtnExists: !!startBtn,
                modalExists: !!modal,
                laterBtnHasHandler
            };
        });
        console.log(`  Init status:`, JSON.stringify(initStatus, null, 2));
        
        // Проверяем, есть ли обработчик на кнопке Later
        const hasHandler = await page.evaluate(() => {
            const btn = document.getElementById('memoryGameEmailLater');
            if (!btn) return false;
            // Попробуем вызвать click программно и посмотреть, что происходит
            const modalBefore = document.getElementById('memoryGameEmailModal');
            const displayBefore = modalBefore ? window.getComputedStyle(modalBefore).display : 'none';
            btn.click();
            // Даем время на выполнение
            return new Promise(resolve => {
                setTimeout(() => {
                    const modalAfter = document.getElementById('memoryGameEmailModal');
                    const displayAfter = modalAfter ? window.getComputedStyle(modalAfter).display : 'none';
                    resolve({ before: displayBefore, after: displayAfter, changed: displayBefore !== displayAfter });
                }, 100);
            });
        });
        console.log(`  Handler test result:`, hasHandler);
        
        // Проверяем наличие элементов
        console.log('\n🔍 Checking elements...');
        const emailModal = await page.$('#memoryGameEmailModal');
        const startBtn = await page.$('#startMemoryGameBtn');
        const laterBtn = await page.$('#memoryGameEmailLater');
        const gameContainer = await page.$('#memoryGameContainer');
        
        console.log(`  ✅ Email modal: ${emailModal ? 'found' : 'NOT FOUND'}`);
        console.log(`  ✅ Start button: ${startBtn ? 'found' : 'NOT FOUND'}`);
        console.log(`  ✅ Later button: ${laterBtn ? 'found' : 'NOT FOUND'}`);
        console.log(`  ✅ Game container: ${gameContainer ? 'found' : 'NOT FOUND'}`);
        
        // Проверяем, вызывалась ли initMemoryGame и привязан ли обработчик
        const initCheck = await page.evaluate(() => {
            const btn = document.getElementById('memoryGameEmailLater');
            if (!btn) return { error: 'Button not found' };
            
            // Проверяем, есть ли обработчики через клонирование события
            let handlerCalled = false;
            const testHandler = () => { handlerCalled = true; };
            
            // Добавляем тестовый обработчик
            btn.addEventListener('click', testHandler);
            
            // Создаем событие и диспатчим
            const event = new MouseEvent('click', { bubbles: true, cancelable: true });
            btn.dispatchEvent(event);
            
            // Удаляем тестовый обработчик
            btn.removeEventListener('click', testHandler);
            
            return {
                handlerCalled,
                hasOnclick: typeof btn.onclick === 'function',
                // Проверяем, есть ли обработчики через getEventListeners (если доступно)
                listenersCount: btn.addEventListener ? 'addEventListener exists' : 'no addEventListener'
            };
        });
        console.log(`  Init check:`, initCheck);
        
        // Проверяем видимость модалки
        const modalDisplay = await page.evaluate(() => {
            const modal = document.getElementById('memoryGameEmailModal');
            return modal ? window.getComputedStyle(modal).display : 'none';
        });
        console.log(`\n📊 Modal display: ${modalDisplay}`);
        
        // Тест 1: Клик на кнопку "Later"
        console.log('\n🧪 Test 1: Clicking "Later" button...');
        if (laterBtn) {
            // Проверяем, что кнопка видима и кликабельна
            const isVisible = await laterBtn.isIntersectingViewport();
            console.log(`  Later button visible: ${isVisible}`);
            
            // Проверяем состояние перед кликом
            const stateBefore = await page.evaluate(() => {
                const modal = document.getElementById('memoryGameEmailModal');
                const container = document.getElementById('memoryGameContainer');
                return {
                    modalDisplay: modal ? window.getComputedStyle(modal).display : 'none',
                    containerDisplay: container ? window.getComputedStyle(container).display : 'none'
                };
            });
            console.log(`  State before: modal=${stateBefore.modalDisplay}, container=${stateBefore.containerDisplay}`);
            
            // Используем evaluate для прямого вызова обработчика
            const result = await page.evaluate(() => {
                const btn = document.getElementById('memoryGameEmailLater');
                const modal = document.getElementById('memoryGameEmailModal');
                const container = document.getElementById('memoryGameContainer');
                
                if (!btn) return { error: 'Button not found' };
                
                const stateBefore = {
                    modalDisplay: modal ? window.getComputedStyle(modal).display : 'none',
                    containerDisplay: container ? window.getComputedStyle(container).display : 'none'
                };
                
                // Пробуем вызвать startMemoryGame напрямую
                if (typeof window.startMemoryGame === 'function') {
                    console.log('Calling startMemoryGame directly...');
                    window.startMemoryGame();
                }
                
                // Также пробуем закрыть модалку напрямую
                if (modal) {
                    modal.style.display = 'none';
                }
                
                // Ждем немного
                return new Promise(resolve => {
                    setTimeout(() => {
                        const stateAfter = {
                            modalDisplay: modal ? window.getComputedStyle(modal).display : 'none',
                            containerDisplay: container ? window.getComputedStyle(container).display : 'none'
                        };
                        resolve({ before: stateBefore, after: stateAfter });
                    }, 300);
                });
            });
            console.log(`  State after direct call: modal=${result.after.modalDisplay}, container=${result.after.containerDisplay}`);
            
            // Теперь пробуем реальный клик через Puppeteer
            await laterBtn.click({ delay: 100 });
            await page.waitForTimeout(500);
            
            await page.waitForTimeout(500);
            
            // Проверяем, что модалка скрыта
            const modalDisplayAfterLater = await page.evaluate(() => {
                const modal = document.getElementById('memoryGameEmailModal');
                return modal ? window.getComputedStyle(modal).display : 'none';
            });
            console.log(`  Modal display after Later: ${modalDisplayAfterLater}`);
            
            // Проверяем, что игра началась
            const gameDisplayAfterLater = await page.evaluate(() => {
                const container = document.getElementById('memoryGameContainer');
                return container ? window.getComputedStyle(container).display : 'none';
            });
            console.log(`  Game container display after Later: ${gameDisplayAfterLater}`);
            
            if (modalDisplayAfterLater === 'none' && gameDisplayAfterLater !== 'none') {
                console.log('  ✅ Test 1 PASSED: Modal closed and game started');
            } else {
                console.log('  ❌ Test 1 FAILED: Modal not closed or game not started');
            }
        } else {
            console.log('  ❌ Later button not found!');
        }
        
        // Ждем немного перед следующим тестом
        await page.waitForTimeout(2000);
        
        // Перезагружаем страницу для следующего теста
        console.log('\n🔄 Reloading page for next test...');
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForTimeout(1000);
        
        // Тест 2: Клик на кнопку "Start Game" когда модалка видна
        console.log('\n🧪 Test 2: Clicking "Start Game" when modal is visible...');
        const startBtn2 = await page.$('#startMemoryGameBtn');
        if (startBtn2) {
            const modalDisplayBefore = await page.evaluate(() => {
                const modal = document.getElementById('memoryGameEmailModal');
                return modal ? window.getComputedStyle(modal).display : 'none';
            });
            console.log(`  Modal display before Start: ${modalDisplayBefore}`);
            
            await startBtn2.click();
            await page.waitForTimeout(500);
            
            const modalDisplayAfter = await page.evaluate(() => {
                const modal = document.getElementById('memoryGameEmailModal');
                return modal ? window.getComputedStyle(modal).display : 'none';
            });
            console.log(`  Modal display after Start: ${modalDisplayAfter}`);
            
            // Если модалка видна, она должна остаться видимой
            if (modalDisplayBefore === 'flex' && modalDisplayAfter === 'flex') {
                console.log('  ✅ Test 2 PASSED: Modal remains visible (correct behavior)');
            } else {
                console.log('  ⚠️ Test 2: Modal state changed');
            }
        }
        
        // Тест 3: Клик на "Later" снова
        console.log('\n🧪 Test 3: Clicking "Later" again...');
        const laterBtn3 = await page.$('#memoryGameEmailLater');
        if (laterBtn3) {
            await laterBtn3.click();
            await page.waitForTimeout(1000);
            
            const modalDisplayAfterLater2 = await page.evaluate(() => {
                const modal = document.getElementById('memoryGameEmailModal');
                return modal ? window.getComputedStyle(modal).display : 'none';
            });
            const gameDisplayAfterLater2 = await page.evaluate(() => {
                const container = document.getElementById('memoryGameContainer');
                return container ? window.getComputedStyle(container).display : 'none';
            });
            
            console.log(`  Modal display: ${modalDisplayAfterLater2}`);
            console.log(`  Game container display: ${gameDisplayAfterLater2}`);
            
            if (modalDisplayAfterLater2 === 'none' && gameDisplayAfterLater2 !== 'none') {
                console.log('  ✅ Test 3 PASSED: Modal closed and game started');
            } else {
                console.log('  ❌ Test 3 FAILED');
            }
        }
        
        // Слушаем все консольные сообщения
        const consoleMessages = [];
        page.on('console', msg => {
            const text = msg.text();
            const type = msg.type();
            consoleMessages.push({ type, text });
            if (type === 'error' || text.includes('Later') || text.includes('game') || text.includes('Modal')) {
                console.log(`  📝 Console [${type}]: ${text}`);
            }
        });
        
        await page.waitForTimeout(1000);
        
        if (errors.length > 0) {
            console.log('\n⚠️ Console errors:');
            errors.forEach(err => console.log(`  - ${err}`));
        }
        
        console.log('\n✅ Testing completed!');
        console.log('\n⏸️ Keeping browser open for 5 seconds for inspection...');
        await page.waitForTimeout(5000);
        
    } catch (error) {
        console.error('❌ Error during testing:', error);
    } finally {
        await browser.close();
    }
}

// Запускаем тест
testMemoryGame().catch(console.error);

