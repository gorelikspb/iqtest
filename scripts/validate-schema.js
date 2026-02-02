// Скрипт для валидации структурированных данных Schema.org
const fs = require('fs');
const path = require('path');

const HTML_FILES = [
    'public/ru/index.html',
    'public/en/index.html',
    'public/ru/full-tests.html',
    'public/en/full-tests.html'
];

function extractJSONLD(htmlContent) {
    const matches = htmlContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
    if (!matches) return [];
    
    return matches.map(match => {
        const jsonStr = match.replace(/<script type="application\/ld\+json">|<\/script>/g, '').trim();
        try {
            return JSON.parse(jsonStr);
        } catch (e) {
            return null;
        }
    }).filter(Boolean);
}

function validateSchema(schema) {
    const errors = [];
    
    // Проверка обязательных полей для WebApplication
    if (schema['@type'] === 'WebApplication') {
        if (!schema['@context']) errors.push('Missing @context');
        if (!schema.name) errors.push('Missing name');
        if (!schema.url) errors.push('Missing url');
        if (!schema.applicationCategory) errors.push('Missing applicationCategory');
    }
    
    // Проверка обязательных полей для FAQPage
    if (schema['@type'] === 'FAQPage') {
        if (!schema['@context']) errors.push('Missing @context');
        if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
            errors.push('Missing or invalid mainEntity array');
        } else {
            schema.mainEntity.forEach((item, idx) => {
                if (!item['@type'] || item['@type'] !== 'Question') {
                    errors.push(`mainEntity[${idx}]: Missing or invalid @type`);
                }
                if (!item.name) errors.push(`mainEntity[${idx}]: Missing name`);
                if (!item.acceptedAnswer) {
                    errors.push(`mainEntity[${idx}]: Missing acceptedAnswer`);
                } else if (!item.acceptedAnswer['@type'] || item.acceptedAnswer['@type'] !== 'Answer') {
                    errors.push(`mainEntity[${idx}]: Invalid acceptedAnswer @type`);
                } else if (!item.acceptedAnswer.text) {
                    errors.push(`mainEntity[${idx}]: Missing acceptedAnswer.text`);
                }
            });
        }
    }
    
    // Проверка обязательных полей для Organization
    if (schema['@type'] === 'Organization') {
        if (!schema['@context']) errors.push('Missing @context');
        if (!schema.name) errors.push('Missing name');
        if (!schema.url) errors.push('Missing url');
    }
    
    // Проверка обязательных полей для BreadcrumbList
    if (schema['@type'] === 'BreadcrumbList') {
        if (!schema['@context']) errors.push('Missing @context');
        if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
            errors.push('Missing or invalid itemListElement array');
        } else {
            schema.itemListElement.forEach((item, idx) => {
                if (!item['@type'] || item['@type'] !== 'ListItem') {
                    errors.push(`itemListElement[${idx}]: Missing or invalid @type`);
                }
                if (!item.name) errors.push(`itemListElement[${idx}]: Missing name`);
                if (!item.item) errors.push(`itemListElement[${idx}]: Missing item`);
                if (typeof item.position !== 'number') {
                    errors.push(`itemListElement[${idx}]: Missing or invalid position`);
                }
            });
        }
    }
    
    return errors;
}

console.log('🔍 Проверка структурированных данных Schema.org...\n');

let totalSchemas = 0;
let totalErrors = 0;

HTML_FILES.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Файл не найден: ${filePath}`);
        return;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const schemas = extractJSONLD(content);
    
    if (schemas.length === 0) {
        console.log(`⚠️  ${filePath}: Нет структурированных данных`);
        return;
    }
    
    console.log(`\n📄 ${filePath}:`);
    schemas.forEach((schema, idx) => {
        totalSchemas++;
        const type = schema['@type'] || 'Unknown';
        console.log(`  Schema ${idx + 1}: ${type}`);
        
        const errors = validateSchema(schema);
        if (errors.length > 0) {
            totalErrors += errors.length;
            console.log(`    ❌ Ошибки:`);
            errors.forEach(err => console.log(`      - ${err}`));
        } else {
            console.log(`    ✅ Валидно`);
        }
    });
});

console.log(`\n📊 Итого:`);
console.log(`  Схем проверено: ${totalSchemas}`);
console.log(`  Ошибок найдено: ${totalErrors}`);

if (totalErrors === 0) {
    console.log(`\n✅ Все структурированные данные валидны!`);
    process.exit(0);
} else {
    console.log(`\n❌ Найдены ошибки в структурированных данных`);
    process.exit(1);
}



