// Worker URL для отправки email
// Замени на свой URL после создания Worker в Cloudflare
const WORKER_URL = 'https://iqtest-email.gorelikgo.workers.dev';

// Обработчик формы
const contactForm = document.getElementById('contactForm');
const ctaSuccess = document.getElementById('ctaSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
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
        type: 'full-tests',
        name: userName,
        email: userEmail,
        extendedTest: extendedTest,
        kidsTest: kidsTest,
        sendResults: false,
        source: 'full-tests-page',
        timestamp: new Date().toISOString()
    };
    
    // Сохраняем в localStorage (бэкап)
    let contacts = JSON.parse(localStorage.getItem('iqTestContacts') || '[]');
    contacts.push(contactData);
    localStorage.setItem('iqTestContacts', JSON.stringify(contacts));
    
    // Отправляем на Worker
    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Показываем успешное сообщение
            contactForm.style.display = 'none';
            ctaSuccess.style.display = 'block';
        } else {
            console.error('Ошибка отправки:', result.error);
            alert('Произошла ошибка при отправке. Данные сохранены локально. Попробуйте позже.');
            
            // Все равно показываем успех
            contactForm.style.display = 'none';
            ctaSuccess.style.display = 'block';
        }
    } catch (error) {
        console.error('Ошибка отправки на Worker:', error);
        alert('Произошла ошибка при отправке. Данные сохранены локально. Попробуйте позже.');
        
        // Все равно показываем успех
        contactForm.style.display = 'none';
        ctaSuccess.style.display = 'block';
    }
    
    console.log('Contact saved:', contactData);
}


