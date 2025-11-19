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
    
    // Сохраняем в localStorage (в реальном проекте здесь будет отправка на сервер)
    const contactData = {
        name: userName,
        email: userEmail,
        extendedTest: extendedTest,
        kidsTest: kidsTest,
        source: 'full-tests-page',
        timestamp: new Date().toISOString()
    };
    
    // Сохраняем в localStorage (массив всех контактов)
    let contacts = JSON.parse(localStorage.getItem('iqTestContacts') || '[]');
    contacts.push(contactData);
    localStorage.setItem('iqTestContacts', JSON.stringify(contacts));
    
    // Показываем успешное сообщение
    contactForm.style.display = 'none';
    ctaSuccess.style.display = 'block';
    
    // В реальном проекте здесь будет отправка на сервер:
    // fetch('/api/contacts', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(contactData)
    // });
    
    console.log('Contact saved:', contactData);
}


