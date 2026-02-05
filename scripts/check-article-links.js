/**
 * Скрипт для проверки ссылок в статьях "Как повысить IQ"
 * Проверяет:
 * - Существование файлов
 * - Корректность ссылок между частями
 * - Наличие всех необходимых элементов
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', 'public');

const filesToCheck = {
    ru: {
        main: 'ru/how-to-improve-iq.html',
        part1: 'ru/how-to-improve-iq-part1.html',
        part2: 'ru/how-to-improve-iq-part2.html',
        memory: 'ru/memory-training.html'
    },
    en: {
        main: 'en/how-to-improve-iq.html',
        part1: 'en/how-to-improve-iq-part1.html',
        part2: 'en/how-to-improve-iq-part2.html',
        memory: 'en/memory-training.html'
    }
};

const errors = [];
const warnings = [];

function checkFileExists(filePath) {
    const fullPath = path.join(BASE_DIR, filePath);
    if (!fs.existsSync(fullPath)) {
        errors.push(`❌ Файл не найден: ${filePath}`);
        return false;
    }
    return true;
}

function checkLinksInFile(filePath, lang) {
    const fullPath = path.join(BASE_DIR, filePath);
    if (!fs.existsSync(fullPath)) {
        return;
    }
    
    const content = fs.readFileSync(fullPath, 'utf-8');
    const otherLang = lang === 'ru' ? 'en' : 'ru';
    
    // Проверяем наличие ссылок на части
    if (filePath.includes('how-to-improve-iq.html') && !filePath.includes('part')) {
        // Главная страница должна ссылаться на обе части
        if (!content.includes(`how-to-improve-iq-part1.html`)) {
            warnings.push(`⚠️ ${filePath}: нет ссылки на часть 1`);
        }
        if (!content.includes(`how-to-improve-iq-part2.html`)) {
            warnings.push(`⚠️ ${filePath}: нет ссылки на часть 2`);
        }
    }
    
    if (filePath.includes('part1')) {
        // Часть 1 должна ссылаться на главную и часть 2
        if (!content.includes(`how-to-improve-iq.html`)) {
            warnings.push(`⚠️ ${filePath}: нет ссылки на главную страницу`);
        }
        if (!content.includes(`how-to-improve-iq-part2.html`)) {
            warnings.push(`⚠️ ${filePath}: нет ссылки на часть 2`);
        }
    }
    
    if (filePath.includes('part2')) {
        // Часть 2 должна ссылаться на главную и часть 1
        if (!content.includes(`how-to-improve-iq.html`)) {
            warnings.push(`⚠️ ${filePath}: нет ссылки на главную страницу`);
        }
        if (!content.includes(`how-to-improve-iq-part1.html`)) {
            warnings.push(`⚠️ ${filePath}: нет ссылки на часть 1`);
        }
    }
    
    // Проверяем наличие основных элементов
    if (!content.includes('<h1>')) {
        warnings.push(`⚠️ ${filePath}: нет заголовка H1`);
    }
    
    if (!content.includes('canonical')) {
        warnings.push(`⚠️ ${filePath}: нет canonical ссылки`);
    }
    
    if (!content.includes('sitemap.xml')) {
        warnings.push(`⚠️ ${filePath}: нет ссылки на sitemap`);
    }
}

function checkSitemap() {
    const sitemapPath = path.join(BASE_DIR, 'sitemap.xml');
    if (!fs.existsSync(sitemapPath)) {
        errors.push('❌ sitemap.xml не найден');
        return;
    }
    
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    
    // Проверяем наличие всех новых страниц в sitemap
    const requiredUrls = [
        'how-to-improve-iq-part1.html',
        'how-to-improve-iq-part2.html',
        'memory-training.html'
    ];
    
    requiredUrls.forEach(url => {
        if (!content.includes(url)) {
            warnings.push(`⚠️ sitemap.xml: нет URL ${url}`);
        }
    });
}

console.log('🔍 Проверка статей "Как повысить IQ"...\n');

// Проверяем существование файлов
console.log('📁 Проверка существования файлов...');
Object.entries(filesToCheck).forEach(([lang, files]) => {
    Object.entries(files).forEach(([key, filePath]) => {
        if (checkFileExists(filePath)) {
            console.log(`  ✅ ${filePath}`);
        }
    });
});

// Проверяем ссылки в файлах
console.log('\n🔗 Проверка ссылок...');
Object.entries(filesToCheck).forEach(([lang, files]) => {
    Object.entries(files).forEach(([key, filePath]) => {
        checkLinksInFile(filePath, lang);
    });
});

// Проверяем sitemap
console.log('\n🗺️ Проверка sitemap.xml...');
checkSitemap();

// Выводим результаты
console.log('\n' + '='.repeat(50));
if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Все проверки пройдены успешно!');
    process.exit(0);
} else {
    if (errors.length > 0) {
        console.log('\n❌ Ошибки:');
        errors.forEach(err => console.log(`  ${err}`));
    }
    if (warnings.length > 0) {
        console.log('\n⚠️ Предупреждения:');
        warnings.forEach(warn => console.log(`  ${warn}`));
    }
    process.exit(errors.length > 0 ? 1 : 0);
}

