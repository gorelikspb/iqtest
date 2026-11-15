(function () {
    if (typeof window.clarity !== 'function') return;

    var AI_HOSTS = [
        ['chatgpt.com', 'chatgpt'],
        ['chat.openai.com', 'chatgpt'],
        ['perplexity.ai', 'perplexity'],
        ['claude.ai', 'claude'],
        ['gemini.google.com', 'gemini'],
        ['bard.google.com', 'gemini'],
        ['copilot.microsoft.com', 'copilot'],
        ['grok.com', 'grok'],
        ['x.ai', 'grok'],
        ['deepseek.com', 'deepseek'],
        ['poe.com', 'poe'],
        ['you.com', 'you'],
        ['phind.com', 'phind'],
        ['meta.ai', 'meta_ai']
    ];

    var SEARCH_HOSTS = ['google.', 'bing.', 'yandex.', 'duckduckgo.', 'yahoo.', 'baidu.', 'ecosia.'];
    var SOCIAL_HOSTS = ['t.me', 'telegram.', 'vk.com', 'facebook.com', 'twitter.com', 'x.com', 'reddit.com', 'instagram.com', 'tiktok.com', 'youtube.com', 'linkedin.com'];

    function hostFromUrl(url) {
        try {
            return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
        } catch (e) {
            return '';
        }
    }

    function matchAi(value) {
        if (!value) return '';
        var v = value.toLowerCase();
        for (var i = 0; i < AI_HOSTS.length; i++) {
            if (v === AI_HOSTS[i][0] || v.indexOf(AI_HOSTS[i][0]) !== -1 || v === AI_HOSTS[i][1]) {
                return AI_HOSTS[i][1];
            }
        }
        return '';
    }

    function matchesAny(host, list) {
        for (var i = 0; i < list.length; i++) {
            if (host.indexOf(list[i]) !== -1) return true;
        }
        return false;
    }

    var params = new URLSearchParams(window.location.search || '');
    var utmSource = (params.get('utm_source') || '').trim().toLowerCase();
    var refHost = hostFromUrl(document.referrer || '');
    var ownHost = (window.location.hostname || '').toLowerCase().replace(/^www\./, '');

    // Ignore internal navigation between pages of the same site for initial attribution
    var externalHost = refHost && refHost !== ownHost ? refHost : '';

    var aiName = matchAi(utmSource) || matchAi(externalHost);
    var trafficSource = 'direct';

    if (aiName) {
        trafficSource = 'ai_chatbot';
    } else if (externalHost) {
        if (matchesAny(externalHost, SEARCH_HOSTS)) {
            trafficSource = 'search';
        } else if (matchesAny(externalHost, SOCIAL_HOSTS)) {
            trafficSource = 'social';
        } else {
            trafficSource = 'referral';
        }
    } else if (utmSource) {
        trafficSource = 'campaign';
    }

    // Persist first-touch attribution in sessionStorage so multi-page journeys keep their source
    try {
        if (trafficSource !== 'direct') {
            sessionStorage.setItem('iq_traffic_source', trafficSource);
            if (aiName) sessionStorage.setItem('iq_ai_referrer', aiName);
            if (externalHost) sessionStorage.setItem('iq_referrer_host', externalHost);
        } else {
            trafficSource = sessionStorage.getItem('iq_traffic_source') || 'direct';
            aiName = sessionStorage.getItem('iq_ai_referrer') || '';
            externalHost = sessionStorage.getItem('iq_referrer_host') || '';
        }
    } catch (e) {}

    var path = (window.location.pathname || '/').toLowerCase();
    var lang = path.indexOf('/en/') !== -1 || document.documentElement.lang === 'en' ? 'en' : 'ru';
    var feature = 'quick_test';
    if (path.indexOf('full-tests') !== -1 || path.indexOf('iq-test-pro') !== -1) feature = 'full_tests';
    else if (path.indexOf('memory-training') !== -1) feature = 'memory_training';
    else if (path.indexOf('schulte-table') !== -1) feature = 'schulte_table';
    else if (path.indexOf('reaction-test') !== -1) feature = 'reaction_test';
    else if (path.indexOf('how-to-improve-iq') !== -1) feature = 'how_to_improve';
    else if (path.indexOf('about-iq-tests') !== -1) feature = 'about_iq';
    else if (path.indexOf('faq') !== -1) feature = 'faq';

    window.clarity('set', 'traffic_source', trafficSource);
    window.clarity('set', 'lang', lang);
    window.clarity('set', 'feature', feature);
    if (aiName) {
        window.clarity('set', 'ai_referrer', aiName);
        window.clarity('event', 'visit_from_' + aiName);
    }
    if (externalHost) {
        window.clarity('set', 'referrer_host', externalHost);
    }
})();
