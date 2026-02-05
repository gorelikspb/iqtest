/**
 * Скрипт для создания английских версий частей статьи
 * На основе русских версий с переводами
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', 'public');

// Переводы для замены
const translations = {
    part1: {
        title: 'How to Improve IQ? Part 1: Brain Training - 5 Effective Ways',
        description: 'Learn how to improve IQ through brain training: reading, logical problems, learning skills, brain games and continuous learning.',
        keywords: 'how to improve iq, brain training, develop intelligence, improve memory, logical thinking, brain exercises',
        ogTitle: 'How to Improve IQ? Part 1: Brain Training - 5 Ways',
        ogDescription: 'Learn how to improve IQ through brain training: reading, logical problems, learning skills, games and continuous learning.',
        twitterTitle: 'How to Improve IQ? Part 1: Brain Training',
        twitterDescription: 'Learn how to improve IQ through brain training: reading, logical problems, learning skills, games and learning.',
        headline: 'How to Improve IQ? Part 1: Brain Training - 5 Effective Ways',
        schemaDescription: 'Learn how to improve IQ through brain training: reading, logical problems, learning skills, brain games and continuous learning.',
        breadcrumbHome: 'Home',
        breadcrumbMain: 'How to Improve IQ',
        breadcrumbPart: 'Part 1: Brain Training',
        h1: 'How to Improve IQ? Part 1: Brain Training',
        intro: `Although the basic level of intelligence is largely determined by genetics, research shows that cognitive abilities 
can be developed and improved throughout life. In this first part, we will look at 5 effective ways to improve IQ 
through brain training.`,
        navTitle: '📖 Article Navigation',
        navOverview: '← Overview of All Methods',
        navPart2: 'Part 2: Healthy Lifestyle →',
        section1Title: '1. Regular Reading',
        section1Text1: `Reading books, especially scientific literature, fiction and educational materials, significantly improves 
vocabulary, analytical ability and general cognitive abilities. Try to read diverse literature 
and don't limit yourself to one genre.`,
        section1Text2: `Research shows that people who read regularly have more developed cognitive abilities and perform better 
on intelligence tests. Reading also improves attention concentration and critical thinking ability.`,
        section2Title: '2. Solving Logical Problems and Puzzles',
        section2Text: `Regularly solving logical problems, puzzles, sudoku, crosswords and mathematical problems trains the brain and improves 
logical thinking ability. Try solving different types of problems to develop various aspects of intelligence.`,
        tipText: `Tip: Take our quick IQ test regularly to track progress 
in developing intellectual abilities. Also try our memory training for developing cognitive skills.`,
        section3Title: '3. Learning New Skills',
        section3Text1: `Learning new languages, musical instruments, programming or other complex skills creates new neural connections 
in the brain and improves cognitive flexibility. The more complex the skill, the more benefit for intelligence development.`,
        section3Text2: `When you learn something new, your brain creates new neural pathways and strengthens existing connections. This improves 
brain plasticity and the ability to learn in the future.`,
        section4Title: '4. Brain Development Games',
        section4Text1: `Chess, Go, strategic board games and special brain training apps (such as Lumosity, Peak) 
can help improve various cognitive abilities: memory, attention, information processing speed.`,
        section4Text2: `Brain games are especially effective when they are diverse and regular. Alternate different types of games to develop 
various aspects of intelligence, not just one skill.`,
        section5Title: '5. Continuous Learning',
        section5Text1: `Continuous learning of new things, whether online courses, lectures, podcasts or self-study of interesting topics, 
keeps the brain active and promotes intelligence development throughout life.`,
        section5Text2: `The key to effective learning is curiosity and the desire to understand new things. Set yourself challenging tasks, study 
topics that are outside your comfort zone, and don't be afraid to make mistakes - they are part of the learning process.`,
        notesTitle: 'Important Notes',
        notesText: `All listed methods require regular practice. Don't expect instant results, but with constant effort 
you will definitely notice improvements in cognitive abilities.`,
        continueTitle: '📖 Continue Reading',
        continueText: `Don't forget to read Part 2: Healthy Lifestyle, where we will look at 
5 more ways to improve IQ through physical exercise, healthy sleep, meditation, proper nutrition and social interaction.`,
        continueLink: 'Read Part 2: Healthy Lifestyle →',
        ctaTitle: 'Check Your IQ Right Now!',
        ctaText: `Take our free quick IQ test online and find out your current intelligence level. 
Then train regularly and take the test again to track your progress!`,
        ctaButton: 'Take IQ Test',
        linksTitle: 'Useful Links',
        links: [
            'Quick IQ Test Online - check your current intelligence level',
            'Part 2: Healthy Lifestyle - 5 more ways to improve IQ',
            'About IQ Tests - what is IQ and how tests work',
            'Extended IQ Tests - full tests for accurate assessment',
            'FAQ - answers to popular questions about IQ tests'
        ]
    },
    part2: {
        title: 'How to Improve IQ? Part 2: Healthy Lifestyle - 5 Effective Ways',
        description: 'Learn how to improve IQ through healthy lifestyle: physical exercise, healthy sleep, meditation, proper nutrition and social interaction.',
        keywords: 'how to improve iq, healthy lifestyle, physical exercise, healthy sleep, meditation, proper nutrition, develop intelligence',
        ogTitle: 'How to Improve IQ? Part 2: Healthy Lifestyle - 5 Ways',
        ogDescription: 'Learn how to improve IQ through healthy lifestyle: physical exercise, healthy sleep, meditation, nutrition and social interaction.',
        twitterTitle: 'How to Improve IQ? Part 2: Healthy Lifestyle',
        twitterDescription: 'Learn how to improve IQ through healthy lifestyle: exercise, sleep, meditation, nutrition and social interaction.',
        headline: 'How to Improve IQ? Part 2: Healthy Lifestyle - 5 Effective Ways',
        schemaDescription: 'Learn how to improve IQ through healthy lifestyle: physical exercise, healthy sleep, meditation, proper nutrition and social interaction.',
        breadcrumbHome: 'Home',
        breadcrumbMain: 'How to Improve IQ',
        breadcrumbPart: 'Part 2: Healthy Lifestyle',
        h1: 'How to Improve IQ? Part 2: Healthy Lifestyle',
        intro: `In the first part, we looked at ways to train the brain. Now let's talk about how a healthy lifestyle affects intelligence. 
Physical health and mental well-being are directly related to cognitive abilities. In this part, we will look at 
5 effective ways to improve IQ through taking care of your health.`,
        navTitle: '📖 Article Navigation',
        navOverview: '← Overview of All Methods',
        navPart1: '← Part 1: Brain Training',
        section1Title: '1. Physical Exercise',
        section1Text1: `Regular physical exercise improves blood circulation in the brain, promotes the growth of new neurons and improves memory. 
Aerobic exercises are especially beneficial: running, swimming, cycling.`,
        section1Text2: `Research shows that even 20-30 minutes of moderate physical activity per day can significantly improve cognitive 
functions. Physical exercise increases blood flow to the brain, providing it with oxygen and nutrients 
necessary for optimal functioning.`,
        section2Title: '2. Healthy Sleep',
        section2Text1: `Quality sleep (7-9 hours per day) is critically important for brain function. During sleep, memory consolidation occurs, 
information processing and restoration of cognitive functions. Lack of sleep significantly reduces intellectual abilities.`,
        section2Text2: `During deep sleep, the brain processes and stores information received during the day. Lack of sleep disrupts this process, 
which leads to deterioration of memory, concentration and learning ability. Regular sleep schedule is also important for maintaining 
optimal brain function.`,
        section3Title: '3. Meditation and Mindfulness',
        section3Text1: `Meditation practice improves attention concentration, working memory and problem-solving ability. Regular meditation 
also reduces stress, which negatively affects cognitive abilities.`,
        section3Text2: `Meditation helps train attention and mindfulness, which is directly related to improved cognitive functions. Even 10-15 minutes 
of meditation per day can bring noticeable results. Meditation also helps reduce cortisol levels (stress hormone), 
which can negatively affect brain function.`,
        section4Title: '4. Proper Nutrition',
        section4Text1: `A balanced diet with sufficient omega-3 fatty acids, antioxidants, B vitamins and other 
nutrients supports brain health. Especially beneficial for the brain: fish, nuts, berries, dark chocolate, green vegetables.`,
        section4Text2: `The brain consumes about 20% of all body energy, so proper nutrition is critically important for its function. Omega-3 fatty acids 
(found in fish, nuts) improve brain cell structure. Antioxidants (in berries, green vegetables) protect the brain from oxidative 
stress. B vitamins are necessary for neurotransmitter production.`,
        section5Title: '5. Social Interaction',
        section5Text1: `Communicating with smart and interesting people, participating in discussions and debates stimulates thinking and broadens horizons. 
Social interaction also improves emotional intelligence and social skills.`,
        section5Text2: `The human brain is evolutionarily tuned for social interaction. Communication activates various brain areas associated 
with understanding, empathy and solving social problems. Regular communication with people who challenge you intellectually 
helps develop critical thinking and the ability to consider problems from different perspectives.`,
        notesTitle: 'Important Notes',
        notesText1: `A healthy lifestyle is the foundation for intelligence development. Without physical and mental health, it is difficult to achieve maximum 
brain potential. Combine brain training (from Part 1) with health care for best results.`,
        notesText2: `Also remember that IQ tests only measure certain aspects of intelligence. Developing creative abilities, emotional 
intelligence and practical skills is equally important for overall intellectual development.`,
        backTitle: '📖 Back to Part 1',
        backText: `If you haven't read the first part yet, be sure to check out Part 1: Brain Training, 
where we looked at 5 ways to improve IQ through reading, logical problems, learning skills, games and continuous learning.`,
        backLink: '← Read Part 1: Brain Training',
        ctaTitle: 'Check Your IQ Right Now!',
        ctaText: `Take our free quick IQ test online and find out your current intelligence level. 
Then train regularly and take the test again to track your progress!`,
        ctaButton: 'Take IQ Test',
        linksTitle: 'Useful Links',
        links: [
            'Quick IQ Test Online - check your current intelligence level',
            'Part 1: Brain Training - 5 ways to improve IQ through training',
            'About IQ Tests - what is IQ and how tests work',
            'Extended IQ Tests - full tests for accurate assessment',
            'FAQ - answers to popular questions about IQ tests'
        ]
    }
};

// Функция для чтения русской версии и создания английской
function createEnglishPart1() {
    const ruFile = path.join(BASE_DIR, 'ru', 'how-to-improve-iq-part1.html');
    const enFile = path.join(BASE_DIR, 'en', 'how-to-improve-iq-part1.html');
    
    let content = fs.readFileSync(ruFile, 'utf-8');
    const t = translations.part1;
    
    // Замены для мета-тегов и структуры
    content = content.replace(/lang="ru"/g, 'lang="en"');
    content = content.replace(/\/ru\//g, '/en/');
    content = content.replace(/ru_RU/g, 'en_US');
    content = content.replace(/og-image-ru\.jpg/g, 'og-image-en.jpg');
    content = content.replace(/twitter-image-ru\.jpg/g, 'twitter-image-en.jpg');
    
    // Замены заголовков и мета-тегов
    content = content.replace(/<title>.*?<\/title>/, `<title>${t.title}</title>`);
    content = content.replace(/meta name="description" content="[^"]*"/, `meta name="description" content="${t.description}"`);
    content = content.replace(/meta name="keywords" content="[^"]*"/, `meta name="keywords" content="${t.keywords}"`);
    content = content.replace(/property="og:title" content="[^"]*"/, `property="og:title" content="${t.ogTitle}"`);
    content = content.replace(/property="og:description" content="[^"]*"/, `property="og:description" content="${t.ogDescription}"`);
    content = content.replace(/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${t.twitterTitle}"`);
    content = content.replace(/name="twitter:description" content="[^"]*"/, `name="twitter:description" content="${t.twitterDescription}"`);
    
    // Schema.org
    content = content.replace(/"headline": "[^"]*"/, `"headline": "${t.headline}"`);
    content = content.replace(/"description": "[^"]*",/, `"description": "${t.schemaDescription}",`);
    content = content.replace(/"inLanguage": "ru"/, `"inLanguage": "en"`);
    
    // Breadcrumbs
    content = content.replace(/"name": "Главная"/g, `"name": "${t.breadcrumbHome}"`);
    content = content.replace(/"name": "Как повысить IQ"/g, `"name": "${t.breadcrumbMain}"`);
    content = content.replace(/"name": "Часть 1: Тренировка мозга"/g, `"name": "${t.breadcrumbPart}"`);
    
    // Навигация
    content = content.replace(/🏠 Главная/g, '🏠 Home');
    content = content.replace(/📚 О IQ тестах/g, '📚 About IQ Tests');
    content = content.replace(/📈 Как повысить IQ/g, '📈 How to Improve IQ');
    content = content.replace(/🎯 Расширенные тесты/g, '🎯 Extended Tests');
    
    // Breadcrumbs в HTML
    content = content.replace(/<a href="\/en\/index\.html">Главная<\/a>/, `<a href="/en/index.html">${t.breadcrumbHome}</a>`);
    content = content.replace(/<a href="\/en\/how-to-improve-iq\.html">Как повысить IQ<\/a>/, `<a href="/en/how-to-improve-iq.html">${t.breadcrumbMain}</a>`);
    content = content.replace(/<span>Часть 1: Тренировка мозга<\/span>/, `<span>${t.breadcrumbPart}</span>`);
    
    // Заголовок H1
    content = content.replace(/<h1>Как повысить IQ\? Часть 1: Тренировка мозга<\/h1>/, `<h1>${t.h1}</h1>`);
    
    // Вступление
    content = content.replace(/<p>\s*Хотя базовый уровень интеллекта[^<]*<\/p>/, `<p>${t.intro}</p>`);
    
    // Навигация по статьям
    content = content.replace(/<h3>📖 Навигация по статьям<\/h3>/, `<h3>${t.navTitle}</h3>`);
    content = content.replace(/<a href="\/en\/how-to-improve-iq\.html">← Обзор всех способов<\/a>/, `<a href="/en/how-to-improve-iq.html">${t.navOverview}</a>`);
    content = content.replace(/<a href="\/en\/how-to-improve-iq-part2\.html">Часть 2: Здоровый образ жизни →<\/a>/, `<a href="/en/how-to-improve-iq-part2.html">${t.navPart2}</a>`);
    
    // Секции
    content = content.replace(/<h2>1\. Регулярное чтение<\/h2>/, `<h2>${t.section1Title}</h2>`);
    content = content.replace(/Чтение книг, особенно научной литературы[^<]*<\/p>/, `${t.section1Text1}</p>`);
    content = content.replace(/Исследования показывают, что люди, которые регулярно читают[^<]*<\/p>/, `${t.section1Text2}</p>`);
    
    content = content.replace(/<h2>2\. Решение логических задач и головоломок<\/h2>/, `<h2>${t.section2Title}</h2>`);
    content = content.replace(/Регулярное решение логических задач, головоломок[^<]*<\/p>/, `${t.section2Text}</p>`);
    
    content = content.replace(/<strong>Совет:<\/strong> Проходите наш[^<]*<\/div>/, `<strong>Tip:</strong> ${t.tipText}</div>`);
    
    content = content.replace(/<h2>3\. Изучение новых навыков<\/h2>/, `<h2>${t.section3Title}</h2>`);
    content = content.replace(/Изучение новых языков, музыкальных инструментов[^<]*<\/p>/, `${t.section3Text1}</p>`);
    content = content.replace(/Когда вы изучаете что-то новое[^<]*<\/p>/, `${t.section3Text2}</p>`);
    
    content = content.replace(/<h2>4\. Игры для развития мозга<\/h2>/, `<h2>${t.section4Title}</h2>`);
    content = content.replace(/Шахматы, го, стратегические настольные игры[^<]*<\/p>/, `${t.section4Text1}</p>`);
    content = content.replace(/Игры для мозга особенно эффективны[^<]*<\/p>/, `${t.section4Text2}</p>`);
    
    content = content.replace(/<h2>5\. Постоянное обучение<\/h2>/, `<h2>${t.section5Title}</h2>`);
    content = content.replace(/Непрерывное обучение новым вещам[^<]*<\/p>/, `${t.section5Text1}</p>`);
    content = content.replace(/Ключ к эффективному обучению[^<]*<\/p>/, `${t.section5Text2}</p>`);
    
    // Важные замечания
    content = content.replace(/<h2>Важные замечания<\/h2>/, `<h2>${t.notesTitle}</h2>`);
    content = content.replace(/Все перечисленные способы требуют регулярной практики[^<]*<\/p>/, `${t.notesText}</p>`);
    
    // Продолжить чтение
    content = content.replace(/<h3>📖 Продолжить чтение<\/h3>/, `<h3>${t.continueTitle}</h3>`);
    content = content.replace(/Не забудьте прочитать <a href="\/en\/how-to-improve-iq-part2\.html">Часть 2: Здоровый образ жизни<\/a>[^<]*<\/p>/, `${t.continueText}</p>`);
    content = content.replace(/<a href="\/en\/how-to-improve-iq-part2\.html">Читать Часть 2: Здоровый образ жизни →<\/a>/, `<a href="/en/how-to-improve-iq-part2.html">${t.continueLink}</a>`);
    
    // CTA
    content = content.replace(/<h3>Проверьте свой IQ прямо сейчас!<\/h3>/, `<h3>${t.ctaTitle}</h3>`);
    content = content.replace(/Пройдите наш <a href="\/en\/index\.html">бесплатный быстрый IQ тест онлайн<\/a>[^<]*<\/p>/, `${t.ctaText}</p>`);
    content = content.replace(/<a href="\/en\/index\.html">Пройти IQ тест<\/a>/, `<a href="/en/index.html">${t.ctaButton}</a>`);
    
    // Полезные ссылки
    content = content.replace(/<h2>Полезные ссылки<\/h2>/, `<h2>${t.linksTitle}</h2>`);
    content = content.replace(/<li><a href="\/en\/index\.html">Быстрый IQ тест онлайн<\/a> - проверьте свой текущий уровень интеллекта<\/li>/, `<li><a href="/en/index.html">${t.links[0]}</a></li>`);
    content = content.replace(/<li><a href="\/en\/how-to-improve-iq-part2\.html">Часть 2: Здоровый образ жизни<\/a> - еще 5 способов повысить IQ<\/li>/, `<li><a href="/en/how-to-improve-iq-part2.html">${t.links[1]}</a></li>`);
    content = content.replace(/<li><a href="\/en\/about-iq-tests\.html">О IQ тестах<\/a> - что такое IQ и как работают тесты<\/li>/, `<li><a href="/en/about-iq-tests.html">${t.links[2]}</a></li>`);
    content = content.replace(/<li><a href="\/en\/full-tests\.html">Расширенные IQ тесты<\/a> - полноценные тесты для точной оценки<\/li>/, `<li><a href="/en/full-tests.html">${t.links[3]}</a></li>`);
    content = content.replace(/<li><a href="\/en\/faq\.html">FAQ<\/a> - ответы на популярные вопросы о IQ тестах<\/li>/, `<li><a href="/en/faq.html">${t.links[4]}</a></li>`);
    
    // Сохраняем файл
    fs.writeFileSync(enFile, content, 'utf-8');
    console.log('✅ Created: en/how-to-improve-iq-part1.html');
}

// Функция для создания части 2
function createEnglishPart2() {
    const ruFile = path.join(BASE_DIR, 'ru', 'how-to-improve-iq-part2.html');
    const enFile = path.join(BASE_DIR, 'en', 'how-to-improve-iq-part2.html');
    
    let content = fs.readFileSync(ruFile, 'utf-8');
    const t = translations.part2;
    
    // Замены для мета-тегов и структуры
    content = content.replace(/lang="ru"/g, 'lang="en"');
    content = content.replace(/\/ru\//g, '/en/');
    content = content.replace(/ru_RU/g, 'en_US');
    content = content.replace(/og-image-ru\.jpg/g, 'og-image-en.jpg');
    content = content.replace(/twitter-image-ru\.jpg/g, 'twitter-image-en.jpg');
    
    // Замены заголовков и мета-тегов
    content = content.replace(/<title>.*?<\/title>/, `<title>${t.title}</title>`);
    content = content.replace(/meta name="description" content="[^"]*"/, `meta name="description" content="${t.description}"`);
    content = content.replace(/meta name="keywords" content="[^"]*"/, `meta name="keywords" content="${t.keywords}"`);
    content = content.replace(/property="og:title" content="[^"]*"/, `property="og:title" content="${t.ogTitle}"`);
    content = content.replace(/property="og:description" content="[^"]*"/, `property="og:description" content="${t.ogDescription}"`);
    content = content.replace(/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${t.twitterTitle}"`);
    content = content.replace(/name="twitter:description" content="[^"]*"/, `name="twitter:description" content="${t.twitterDescription}"`);
    
    // Schema.org
    content = content.replace(/"headline": "[^"]*"/, `"headline": "${t.headline}"`);
    content = content.replace(/"description": "[^"]*",/, `"description": "${t.schemaDescription}",`);
    content = content.replace(/"inLanguage": "ru"/, `"inLanguage": "en"`);
    
    // Breadcrumbs
    content = content.replace(/"name": "Главная"/g, `"name": "${t.breadcrumbHome}"`);
    content = content.replace(/"name": "Как повысить IQ"/g, `"name": "${t.breadcrumbMain}"`);
    content = content.replace(/"name": "Часть 2: Здоровый образ жизни"/g, `"name": "${t.breadcrumbPart}"`);
    
    // Навигация
    content = content.replace(/🏠 Главная/g, '🏠 Home');
    content = content.replace(/📚 О IQ тестах/g, '📚 About IQ Tests');
    content = content.replace(/📈 Как повысить IQ/g, '📈 How to Improve IQ');
    content = content.replace(/🎯 Расширенные тесты/g, '🎯 Extended Tests');
    
    // Breadcrumbs в HTML
    content = content.replace(/<a href="\/en\/index\.html">Главная<\/a>/, `<a href="/en/index.html">${t.breadcrumbHome}</a>`);
    content = content.replace(/<a href="\/en\/how-to-improve-iq\.html">Как повысить IQ<\/a>/, `<a href="/en/how-to-improve-iq.html">${t.breadcrumbMain}</a>`);
    content = content.replace(/<span>Часть 2: Здоровый образ жизни<\/span>/, `<span>${t.breadcrumbPart}</span>`);
    
    // Заголовок H1
    content = content.replace(/<h1>Как повысить IQ\? Часть 2: Здоровый образ жизни<\/h1>/, `<h1>${t.h1}</h1>`);
    
    // Вступление
    content = content.replace(/<p>\s*В первой части мы рассмотрели способы тренировки мозга[^<]*<\/p>/, `<p>${t.intro}</p>`);
    
    // Навигация по статьям
    content = content.replace(/<h3>📖 Навигация по статьям<\/h3>/, `<h3>${t.navTitle}</h3>`);
    content = content.replace(/<a href="\/en\/how-to-improve-iq\.html">← Обзор всех способов<\/a>/, `<a href="/en/how-to-improve-iq.html">${t.navOverview}</a>`);
    content = content.replace(/<a href="\/en\/how-to-improve-iq-part1\.html">← Часть 1: Тренировка мозга<\/a>/, `<a href="/en/how-to-improve-iq-part1.html">${t.navPart1}</a>`);
    
    // Секции
    content = content.replace(/<h2>1\. Физические упражнения<\/h2>/, `<h2>${t.section1Title}</h2>`);
    content = content.replace(/Регулярные физические упражнения улучшают кровообращение в мозге[^<]*<\/p>/, `${t.section1Text1}</p>`);
    content = content.replace(/Исследования показывают, что даже 20-30 минут[^<]*<\/p>/, `${t.section1Text2}</p>`);
    
    content = content.replace(/<h2>2\. Здоровый сон<\/h2>/, `<h2>${t.section2Title}</h2>`);
    content = content.replace(/Качественный сон \(7-9 часов в сутки\)[^<]*<\/p>/, `${t.section2Text1}</p>`);
    content = content.replace(/Во время глубокого сна мозг обрабатывает[^<]*<\/p>/, `${t.section2Text2}</p>`);
    
    content = content.replace(/<h2>3\. Медитация и осознанность<\/h2>/, `<h2>${t.section3Title}</h2>`);
    content = content.replace(/Практика медитации улучшает концентрацию внимания[^<]*<\/p>/, `${t.section3Text1}</p>`);
    content = content.replace(/Медитация помогает тренировать внимание[^<]*<\/p>/, `${t.section3Text2}</p>`);
    
    content = content.replace(/<h2>4\. Правильное питание<\/h2>/, `<h2>${t.section4Title}</h2>`);
    content = content.replace(/Сбалансированное питание с достаточным количеством[^<]*<\/p>/, `${t.section4Text1}</p>`);
    content = content.replace(/Мозг потребляет около 20% всей энергии[^<]*<\/p>/, `${t.section4Text2}</p>`);
    
    content = content.replace(/<h2>5\. Социальное взаимодействие<\/h2>/, `<h2>${t.section5Title}</h2>`);
    content = content.replace(/Общение с умными и интересными людьми[^<]*<\/p>/, `${t.section5Text1}</p>`);
    content = content.replace(/Человеческий мозг эволюционно настроен[^<]*<\/p>/, `${t.section5Text2}</p>`);
    
    // Важные замечания
    content = content.replace(/<h2>Важные замечания<\/h2>/, `<h2>${t.notesTitle}</h2>`);
    content = content.replace(/Здоровый образ жизни - это основа для развития интеллекта[^<]*<\/p>/, `${t.notesText1}</p>`);
    content = content.replace(/Также помните, что IQ тесты измеряют только[^<]*<\/p>/, `${t.notesText2}</p>`);
    
    // Вернуться к части 1
    content = content.replace(/<h3>📖 Вернуться к Части 1<\/h3>/, `<h3>${t.backTitle}</h3>`);
    content = content.replace(/Если вы еще не читали первую часть[^<]*<\/p>/, `${t.backText}</p>`);
    content = content.replace(/<a href="\/en\/how-to-improve-iq-part1\.html">← Читать Часть 1: Тренировка мозга<\/a>/, `<a href="/en/how-to-improve-iq-part1.html">${t.backLink}</a>`);
    
    // CTA
    content = content.replace(/<h3>Проверьте свой IQ прямо сейчас!<\/h3>/, `<h3>${t.ctaTitle}</h3>`);
    content = content.replace(/Пройдите наш <a href="\/en\/index\.html">бесплатный быстрый IQ тест онлайн<\/a>[^<]*<\/p>/, `${t.ctaText}</p>`);
    content = content.replace(/<a href="\/en\/index\.html">Пройти IQ тест<\/a>/, `<a href="/en/index.html">${t.ctaButton}</a>`);
    
    // Полезные ссылки
    content = content.replace(/<h2>Полезные ссылки<\/h2>/, `<h2>${t.linksTitle}</h2>`);
    content = content.replace(/<li><a href="\/en\/index\.html">Быстрый IQ тест онлайн<\/a> - проверьте свой текущий уровень интеллекта<\/li>/, `<li><a href="/en/index.html">${t.links[0]}</a></li>`);
    content = content.replace(/<li><a href="\/en\/how-to-improve-iq-part1\.html">Часть 1: Тренировка мозга<\/a> - 5 способов повысить IQ через тренировку<\/li>/, `<li><a href="/en/how-to-improve-iq-part1.html">${t.links[1]}</a></li>`);
    content = content.replace(/<li><a href="\/en\/about-iq-tests\.html">О IQ тестах<\/a> - что такое IQ и как работают тесты<\/li>/, `<li><a href="/en/about-iq-tests.html">${t.links[2]}</a></li>`);
    content = content.replace(/<li><a href="\/en\/full-tests\.html">Расширенные IQ тесты<\/a> - полноценные тесты для точной оценки<\/li>/, `<li><a href="/en/full-tests.html">${t.links[3]}</a></li>`);
    content = content.replace(/<li><a href="\/en\/faq\.html">FAQ<\/a> - ответы на популярные вопросы о IQ тестах<\/li>/, `<li><a href="/en/faq.html">${t.links[4]}</a></li>`);
    
    // Сохраняем файл
    fs.writeFileSync(enFile, content, 'utf-8');
    console.log('✅ Created: en/how-to-improve-iq-part2.html');
}

// Запускаем создание
try {
    createEnglishPart1();
    createEnglishPart2();
    console.log('\n✅ English Parts 1 & 2 created successfully!');
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}

