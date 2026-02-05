# Best Practices: Forms and Modals

## Проблема
При создании форм и модалок возникали проблемы с обработчиками событий - кнопки не работали, обработчики не привязывались.

## Решение: Единый подход для всех форм и модалок

### ✅ Правильный подход (используется на сайте)

**Все обработчики привязываются напрямую на странице в отдельном скрипте**, а не через сложную логику в общем `script.js`.

#### Пример для формы с модалкой:

```html
<!-- HTML -->
<div class="modal" id="myModal" style="display: none;">
    <div class="modal-content">
        <form id="myForm" onsubmit="return false;">
            <input type="email" id="userEmail" required>
            <button type="submit">Save</button>
            <button type="button" id="laterBtn">Later</button>
        </form>
    </div>
</div>

<script>
// Инициализация формы/модалки - используем тот же подход, что и для других форм
function initMyForm() {
    const modal = document.getElementById('myModal');
    const form = document.getElementById('myForm');
    const laterBtn = document.getElementById('laterBtn');
    
    // Показываем модалку при загрузке (если нужно)
    if (!sessionStorage.getItem('myModalShown')) {
        if (modal) {
            modal.style.display = 'flex';
            sessionStorage.setItem('myModalShown', 'true');
        }
    }
    
    // Обработчик формы (Submit)
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const email = document.getElementById('userEmail').value;
            if (email) {
                // Сохраняем данные
                localStorage.setItem('userEmail', email);
                
                // Закрываем модалку
                if (modal) modal.style.display = 'none';
                
                // Выполняем дальнейшие действия
                doSomething();
            }
        });
    }
    
    // Обработчик кнопки Later
    if (laterBtn) {
        laterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (modal) {
                modal.style.display = 'none';
            }
            sessionStorage.setItem('myModalShown', 'true');
            
            // Выполняем дальнейшие действия
            doSomething();
        });
    }
}

// Инициализируем при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMyForm);
} else {
    initMyForm();
}
</script>
```

### ❌ Неправильный подход (избегать)

**НЕ делайте так:**

1. ❌ Условная инициализация в общем `script.js`:
```javascript
// ПЛОХО: Условия, проверки пути, сложная логика
if (window.location.pathname.includes('some-page.html')) {
    initMyForm();
}
```

2. ❌ Обработчики в функциях, которые вызываются условно:
```javascript
// ПЛОХО: Может не вызваться или вызваться не вовремя
function initMyForm() {
    if (someCondition) {
        btn.addEventListener('click', handler);
    }
}
```

3. ❌ Зависимость от порядка загрузки скриптов:
```javascript
// ПЛОХО: Может не сработать, если скрипт загрузится раньше DOM
document.addEventListener('DOMContentLoaded', function() {
    if (typeof someFunction === 'function') {
        someFunction();
    }
});
```

## Ключевые принципы

### 1. Обработчики привязываются напрямую на странице
- ✅ Каждая страница со своей формой/модалкой имеет свой скрипт инициализации
- ✅ Обработчики привязываются сразу, без условий
- ✅ Используется проверка `if (element)` для безопасности

### 2. Всегда используйте `e.preventDefault()` и `e.stopPropagation()`
```javascript
form.addEventListener('submit', function(e) {
    e.preventDefault();      // Предотвращаем отправку формы
    e.stopPropagation();     // Останавливаем всплытие события
    // ... ваш код
});
```

### 3. Проверка готовности DOM
```javascript
// Правильная проверка готовности DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFunction);
} else {
    initFunction(); // DOM уже загружен
}
```

### 4. Использование sessionStorage для показа модалок один раз
```javascript
if (!sessionStorage.getItem('modalShown')) {
    modal.style.display = 'flex';
    sessionStorage.setItem('modalShown', 'true');
}
```

### 5. Формы с `onsubmit="return false;"` для дополнительной защиты
```html
<form id="myForm" onsubmit="return false;">
    <!-- форма -->
</form>
```

## Примеры работающих форм на сайте

### ✅ Рабочие формы (используйте как образец):

1. **`contactForm`** на странице результатов (`public/ru/index.html`)
   - Обработчик: `handleFormSubmit`
   - Инициализация: в `init()` функции `script.js`

2. **`sendResultsForm`** на странице результатов
   - Обработчик: `handleSendResultsSubmit`
   - Инициализация: в `showResults()` функции

3. **`memoryGameEmailForm`** на странице игры памяти (`public/ru/memory-training.html`)
   - Обработчик: привязан напрямую на странице
   - Инициализация: функция `initMemoryGamePage()` на странице

## Чеклист при создании новой формы/модалки

- [ ] Обработчики привязаны напрямую на странице (не через условную логику)
- [ ] Используется `e.preventDefault()` и `e.stopPropagation()`
- [ ] Проверка готовности DOM через `document.readyState`
- [ ] Форма имеет `onsubmit="return false;"` для защиты
- [ ] Кнопки типа `button` имеют `type="button"` (не `submit`)
- [ ] Используется `sessionStorage` для показа модалок один раз
- [ ] Проверка существования элементов через `if (element)`
- [ ] Логирование для отладки (`console.log`)

## Отладка

Если форма/модалка не работает:

1. Проверьте консоль браузера на ошибки
2. Убедитесь, что обработчики привязаны (проверьте через DevTools)
3. Проверьте, что элементы существуют в DOM
4. Убедитесь, что используется `e.preventDefault()` и `e.stopPropagation()`
5. Проверьте порядок загрузки скриптов

## Тестирование

Используйте Puppeteer для автоматического тестирования:

```javascript
// Пример теста
const btn = await page.$('#myButton');
await btn.click();
await page.waitForTimeout(500);

const modalDisplay = await page.evaluate(() => {
    const modal = document.getElementById('myModal');
    return modal ? window.getComputedStyle(modal).display : 'none';
});
```

## Резюме

**Главное правило:** Всегда используйте тот же подход, что и для рабочих форм на сайте (`contactForm`, `sendResultsForm`). Не изобретайте велосипед - копируйте рабочий паттерн.

**См. примеры:**
- `public/ru/memory-training.html` - правильная реализация модалки с формой
- `public/ru/index.html` - правильная реализация форм на странице результатов

