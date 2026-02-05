/**
 * Скрипт для проверки статей с помощью Puppeteer
 * Проверяет, что страницы открываются и ссылки работают
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.join(__dirname, '..', 'public');

const pagesToTest = [
    { file: 'ru/how-to-improve-iq.html', name: 'RU Main' },
    { file: 'ru/how-to-improve-iq-part1.html', name: 'RU Part 1' },
    { file: 'ru/how-to-improve-iq-part2.html', name: 'RU Part 2' },
    { file: 'ru/memory-training.html', name: 'RU Memory Game' },
    { file: 'en/how-to-improve-iq.html', name: 'EN Main' },
    { file: 'en/how-to-improve-iq-part1.html', name: 'EN Part 1' },
    { file: 'en/how-to-improve-iq-part2.html', name: 'EN Part 2' },
    { file: 'en/memory-training.html', name: 'EN Memory Game' }
];

async function testPages() {
    let browser;
    const errors = [];
    const warnings = [];
    
    try {
        console.log('🚀 Starting Puppeteer tests...\n');
        browser = await puppeteer.launch({ headless: true });
        
        for (const pageInfo of pagesToTest) {
            const filePath = path.join(BASE_DIR, pageInfo.file);
            
            if (!fs.existsSync(filePath)) {
                errors.push(`❌ ${pageInfo.name}: File not found - ${pageInfo.file}`);
                continue;
            }
            
            const page = await browser.newPage();
            const fullPath = `file://${filePath}`;
            
            try {
                await page.goto(fullPath, { waitUntil: 'networkidle0', timeout: 10000 });
                
                // Проверяем наличие основных элементов
                const h1 = await page.$('h1');
                if (!h1) {
                    warnings.push(`⚠️ ${pageInfo.name}: No H1 found`);
                }
                
                // Проверяем наличие ссылок на части (для главной страницы)
                if (pageInfo.file.includes('how-to-improve-iq.html') && !pageInfo.file.includes('part')) {
                    const part1Link = await page.$('a[href*="part1"]');
                    const part2Link = await page.$('a[href*="part2"]');
                    
                    if (!part1Link) {
                        warnings.push(`⚠️ ${pageInfo.name}: No link to Part 1`);
                    }
                    if (!part2Link) {
                        warnings.push(`⚠️ ${pageInfo.name}: No link to Part 2`);
                    }
                }
                
                // Проверяем наличие ссылок на главную (для частей)
                if (pageInfo.file.includes('part')) {
                    const mainLink = await page.$('a[href*="how-to-improve-iq.html"]:not([href*="part"])');
                    if (!mainLink) {
                        warnings.push(`⚠️ ${pageInfo.name}: No link to main page`);
                    }
                }
                
                // Проверяем страницу игры памяти
                if (pageInfo.file.includes('memory-training.html')) {
                    const startBtn = await page.$('#startMemoryGameBtn');
                    const emailModal = await page.$('#memoryGameEmailModal');
                    if (!startBtn) {
                        warnings.push(`⚠️ ${pageInfo.name}: No start button found`);
                    }
                    if (!emailModal) {
                        warnings.push(`⚠️ ${pageInfo.name}: No email modal found`);
                    }
                }
                
                console.log(`  ✅ ${pageInfo.name}: Page loaded successfully`);
                
            } catch (error) {
                errors.push(`❌ ${pageInfo.name}: Error loading page - ${error.message}`);
            } finally {
                await page.close();
            }
        }
        
        console.log('\n' + '='.repeat(50));
        
        if (errors.length === 0 && warnings.length === 0) {
            console.log('✅ All pages tested successfully!');
            return 0;
        } else {
            if (errors.length > 0) {
                console.log('\n❌ Errors:');
                errors.forEach(err => console.log(`  ${err}`));
            }
            if (warnings.length > 0) {
                console.log('\n⚠️ Warnings:');
                warnings.forEach(warn => console.log(`  ${warn}`));
            }
            return errors.length > 0 ? 1 : 0;
        }
        
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        return 1;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Запускаем тесты
testPages().then(exitCode => {
    process.exit(exitCode);
}).catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
});

