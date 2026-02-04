// ==========================================
// MAIN CONTROLLER - Multilingual AI Scheme Assistant
// ==========================================

let CURRENT_LANG = 'en';
let ACTIVE_SCHEMES = {};
let DETECTED_STATE = '';

const STATIC_SCHEME_IDS = [
    "aadhaar", "pan", "voter", "ration", "ayushman", "pmawas",
    "mgnrega", "pmkisan", "scholarship", "jandhan", "ujjwala",
    "pension", "skillindia", "pmposhan"
];

// ==========================================
// INITIALIZATION
// ==========================================
async function initApp() {
    initTheme();
    renderLanguageButtons();
    ACTIVE_SCHEMES = { ...SCHEMES_DB };
    await loadAndMergeSchemes();
    renderStaticSchemes();
    updateUI();
    setupEventListeners();
    updateWelcomeMessage();
    await detectUserState();
    renderStateSchemes();
}

// ==========================================
// TRANSLATION HELPER
// ==========================================
function t(key) {
    if (UI_TEXT[CURRENT_LANG] && UI_TEXT[CURRENT_LANG][key]) {
        return UI_TEXT[CURRENT_LANG][key];
    }
    return UI_TEXT['en'][key] || UI_TEXT['hi'][key] || key;
}

function initTheme() {
    const saved = localStorage.getItem(API_CONFIG.cache.keys.theme) || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = saved === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(API_CONFIG.cache.keys.theme, next);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
}

function getSchemeContent(schemeId) {
    const scheme = ACTIVE_SCHEMES[schemeId];
    if (!scheme) return null;
    const base = scheme.content[CURRENT_LANG] || scheme.content['en'] || scheme.content['hi'];
    const verifiedEligible = scheme.content?.en?.eligible || base?.eligible;
    return { ...base, eligible: verifiedEligible };
}

async function loadAndMergeSchemes() {
    try {
        const merged = await ApiService.loadSchemes(SCHEMES_DB);
        ACTIVE_SCHEMES = merged;
    } catch (e) {
        ACTIVE_SCHEMES = { ...SCHEMES_DB };
    }
}

// ==========================================
// UI UPDATES
// ==========================================
function updateUI() {
    safeSetText('page-title', t('pageTitle'));
    safeSetText('header-title', t('headerTitle'));
    safeSetText('header-tagline', t('headerTagline'));
    safeSetText('welcome-title', t('welcomeTitle'));
    safeSetText('welcome-text', t('welcomeText'));
    safeSetText('ai-help-title', t('aiHelpTitle'));
    safeSetText('ai-help-desc', t('aiHelpDesc'));
    safeSetText('common-schemes-title', t('commonSchemesTitle'));
    safeSetText('footer-text', t('footerText'));

    const chatInput = document.getElementById('chatInput');
    if (chatInput) chatInput.placeholder = t('chatPlaceholder');

    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) sendBtn.textContent = t('sendBtn');

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === CURRENT_LANG);
    });

    document.documentElement.lang = CURRENT_LANG;
    renderStaticSchemes();
}

function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function updateWelcomeMessage() {
    const welcomeMsg = document.getElementById('welcome-msg-chat');
    if (welcomeMsg) welcomeMsg.textContent = t('welcomeMsg');
}

// ==========================================
// LANGUAGE HANDLING
// ==========================================
function renderLanguageButtons() {
    const container = document.getElementById('language-buttons');
    if (!container) return;
    container.innerHTML = '';

    Object.keys(LANGUAGES).forEach(code => {
        const btn = document.createElement('button');
        btn.className = 'lang-btn';
        btn.dataset.lang = code;
        btn.textContent = LANGUAGES[code].name;
        btn.onclick = () => setLanguage(code);
        container.appendChild(btn);
    });
}

function setLanguage(langCode) {
    CURRENT_LANG = langCode;
    updateUI();
    updateWelcomeMessage();

    // Clear chat and show welcome in new language
    const chatHistory = document.getElementById('chat-history');
    if (chatHistory) {
        chatHistory.innerHTML = `<div class="msg ai-msg">${t('welcomeMsg')}</div>`;
    }
}

// ==========================================
// SCHEME CARDS
// ==========================================
function renderStaticSchemes() {
    const grid = document.getElementById('schemes-grid');
    if (!grid) return;
    grid.innerHTML = '';

    STATIC_SCHEME_IDS.forEach(id => {
        const content = getSchemeContent(id);
        if (!content) return;

        const scheme = ACTIVE_SCHEMES[id];
        const card = document.createElement('div');
        card.className = 'scheme-card';
        card.onclick = () => openSchemeModal(id);
        card.innerHTML = `
            <div class="scheme-icon">${getCategoryIcon(scheme.category[0])}</div>
            <h3>${content.name}</h3>
        `;
        grid.appendChild(card);
    });
}

// ==========================================
// STATE SCHEMES
// ==========================================
function populateStateSelector() {
    const selector = document.getElementById('stateSelector');
    if (!selector) return;
    const states = getAllStates();
    selector.innerHTML = `<option value="">${DETECTED_STATE ? `Detected: ${DETECTED_STATE}` : 'Select your state'}</option>`;
    states.forEach(st => {
        const opt = document.createElement('option');
        opt.value = st;
        opt.textContent = st.toUpperCase();
        selector.appendChild(opt);
    });
    selector.value = DETECTED_STATE || '';
}

async function detectUserState() {
    const cached = localStorage.getItem(API_CONFIG.cache.keys.userState);
    if (cached) {
        DETECTED_STATE = cached;
        populateStateSelector();
        return;
    }

    if (!navigator.geolocation) {
        populateStateSelector();
        return;
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const { latitude, longitude } = pos.coords;
                const url = `${API_CONFIG.endpoints.nominatim}?lat=${latitude}&lon=${longitude}&format=json`;
                const res = await fetch(url);
                const data = await res.json();
                const stateName = (data.address?.state || '').toLowerCase();
                DETECTED_STATE = stateName;
                localStorage.setItem(API_CONFIG.cache.keys.userState, stateName);
            } catch (e) {
                DETECTED_STATE = '';
            }
            populateStateSelector();
            resolve();
        }, () => {
            populateStateSelector();
            resolve();
        }, { timeout: 8000 });
    });
}

function renderStateSchemes() {
    const grid = document.getElementById('state-schemes-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const targetState = DETECTED_STATE || document.getElementById('stateSelector')?.value || '';
    if (!targetState) {
        grid.innerHTML = '<p class="text-muted">Select a state to view schemes.</p>';
        return;
    }
    const schemes = getStateSchemes(targetState);
    if (!schemes.length) {
        grid.innerHTML = '<p class="text-muted">No state schemes available yet.</p>';
        return;
    }
    schemes.forEach(s => {
        const content = s.info[CURRENT_LANG] || s.info.en;
        const card = document.createElement('div');
        card.className = 'scheme-card';
        card.innerHTML = `
            <div class="scheme-icon">${getCategoryIcon(s.category)}</div>
            <h3>${content?.name || s.names.en}</h3>
        `;
        card.onclick = () => openStateSchemeModal(s);
        grid.appendChild(card);
    });
}

function formatStateSchemeForChat(scheme) {
    const content = scheme.info[CURRENT_LANG] || scheme.info.en;
    return `
        <div class="scheme-response">
            <b>📍 ${content?.name || scheme.names.en}</b><br><br>
            <b>ℹ️ ${t('whatIsIt')}:</b> ${content?.desc || ''}<br><br>
            <b>👤 ${t('whoCanApply')}:</b> ${content?.eligible || ''}<br><br>
            <b>📝 ${t('stepsToApply')}:</b><br>${(content?.steps || []).map((s, i) => `${i + 1}. ${s}`).join('<br>')}<br><br>
            <b>📄 ${t('documentsNeeded')}:</b><br>${(content?.docs || []).map(d => `• ${d}`).join('<br>')}<br><br>
            <b>🔗 ${t('officialLink')}:</b> <a href="${scheme.link}" target="_blank">${scheme.link}</a>
        </div>
    `;
}

function getCategoryIcon(category) {
    const icons = {
        documents: "📄", health: "🏥", housing: "🏠", farmers: "🌾",
        employment: "💼", banking: "🏦", education: "🎓", women: "👩",
        food: "🍚", finance: "💰", elderly: "👴"
    };
    return icons[category] || "📋";
}

// ==========================================
// AI CHAT LOGIC
// ==========================================
function setupEventListeners() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');

    if (sendBtn) sendBtn.onclick = handleUserMessage;
    if (chatInput) chatInput.onkeypress = (e) => {
        if (e.key === 'Enter') handleUserMessage();
    };

    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) closeBtn.onclick = closeModal;

    window.onclick = (e) => {
        if (e.target.id === 'aiModal') closeModal();
    };

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.onclick = toggleTheme;

    const stateSelector = document.getElementById('stateSelector');
    if (stateSelector) stateSelector.onchange = (e) => {
        DETECTED_STATE = e.target.value;
        renderStateSchemes();
    };
}

function handleUserMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    addChatMessage(text, 'user');
    input.value = '';
    showTypingIndicator();

    setTimeout(() => {
        const response = processAIQuery(text);
        removeTypingIndicator();
        addChatMessage(response, 'ai');
    }, 500);
}

function processAIQuery(query) {
    const expanded = NlpEngine.expandSynonyms(query);
    const q = expanded.toLowerCase();

    // Check for off-topic queries
    const offTopicWords = ["movie", "cricket", "song", "weather", "game", "news"];
    if (offTopicWords.some(w => q.includes(w))) {
        return t('unknownResponse');
    }

    // Check for category queries (farmers, education, women, etc.)
    const categoryMatch = findCategoryMatch(q);
    if (categoryMatch) {
        return formatCategoryResponse(categoryMatch);
    }

    // Check for specific scheme
    const schemeMatch = findSchemeMatch(q);
    if (schemeMatch) {
        return formatSchemeForChat(schemeMatch);
    }

    // Default response
    return t('unknownResponse');
}

function findCategoryMatch(query) {
    const categoryKeywords = {
        farmers: ["farmer", "kisan", "किसान", "agriculture", "krishi", "खेती", "రైతు", "விவசாயி"],
        education: ["education", "student", "school", "scholarship", "शिक्षा", "छात्र", "విద్య", "கல்வி"],
        health: ["health", "hospital", "medical", "स्वास्थ्य", "इलाज", "ఆరోగ్యం", "சுகாதாரம்"],
        women: ["women", "mahila", "महिला", "lady", "మహిళ", "பெண்"],
        employment: ["job", "work", "employment", "रोजगार", "नौकरी", "ఉద్యోగం", "வேலை"],
        housing: ["house", "home", "awas", "घर", "आवास", "ఇల్లు", "வீடு"],
        banking: ["bank", "account", "money", "बैंक", "खाता", "బ్యాంక్", "வங்கி"],
        documents: ["document", "card", "id", "दस्तावेज", "कार्ड", "పత్రాలు", "ஆவணங்கள்"]
    };

    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(kw => query.includes(kw))) {
            return cat;
        }
    }
    return null;
}

function findSchemeMatch(query) {
    // Fuzzy match first
    const fuzzy = NlpEngine.fuzzyFindScheme(query, ACTIVE_SCHEMES);
    if (fuzzy) return fuzzy;

    for (const [id, scheme] of Object.entries(ACTIVE_SCHEMES)) {
        if ((scheme.names || []).some(name => query.includes(name.toLowerCase()))) {
            return id;
        }
    }
    return null;
}

function formatCategoryResponse(category) {
    const schemes = SCHEME_CATEGORIES[category] || [];
    if (schemes.length === 0) return t('unknownResponse');

    let response = `<b>${t('categoryResponse').replace('{{category}}', category.toUpperCase())}</b><br><br>`;

    schemes.forEach(id => {
        const content = getSchemeContent(id);
        if (content) {
            response += `• <b>${content.name}</b><br>`;
        }
    });

    return response;
}

function formatSchemeForChat(schemeId) {
    const scheme = ACTIVE_SCHEMES[schemeId];
    const c = getSchemeContent(schemeId);
    if (!c) return t('unknownResponse');

    return `
        <div class="scheme-response">
            <b>📋 ${t('title')}:</b> ${c.name}<br><br>
            <b>ℹ️ ${t('whatIsIt')}:</b> ${c.desc}<br><br>
            <b>👤 ${t('whoCanApply')}:</b> ${c.eligible}<br><br>
            <b>📝 ${t('stepsToApply')}:</b><br>
            ${c.steps.map((s, i) => `${i + 1}. ${s}`).join('<br>')}<br><br>
            <b>📄 ${t('documentsNeeded')}:</b><br>
            ${c.docs.map(d => `• ${d}`).join('<br>')}<br><br>
            <b>🔗 ${t('officialLink')}:</b> <a href="${scheme.link}" target="_blank">${scheme.link}</a>
        </div>
    `;
}

// ==========================================
// MODAL
// ==========================================
function openSchemeModal(id) {
    const modal = document.getElementById('aiModal');
    const contentDiv = document.getElementById('modal-ai-content');

    contentDiv.innerHTML = `<div class="ai-loading">🤖 ${t('typingMsg')}</div>`;
    modal.style.display = 'flex';

    setTimeout(() => {
        contentDiv.innerHTML = formatSchemeForModal(id);
    }, 400);
}

function formatSchemeForModal(id) {
    const scheme = ACTIVE_SCHEMES[id];
    const c = getSchemeContent(id);
    if (!c) return '';

    return `
        <h2>${c.name}</h2>
        <div class="detail-row">
            <strong>${t('whatIsIt')}:</strong>
            <p>${c.desc}</p>
        </div>
        <div class="detail-row">
            <strong>${t('whoCanApply')}:</strong>
            <p>${c.eligible}</p>
        </div>
        <div class="detail-row">
            <strong>${t('stepsToApply')}:</strong>
            <ul>${c.steps.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="detail-row">
            <strong>${t('documentsNeeded')}:</strong>
            <ul>${c.docs.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>
        <div class="detail-row">
            <strong>${t('officialLink')}:</strong>
            <a href="${scheme.link}" target="_blank" class="official-link-btn">${t('visitWebsite')} ↗</a>
        </div>
    `;
}

function openStateSchemeModal(scheme) {
    const modal = document.getElementById('aiModal');
    const contentDiv = document.getElementById('modal-ai-content');
    contentDiv.innerHTML = `<div class="ai-loading">🤖 ${t('typingMsg')}</div>`;
    modal.style.display = 'flex';

    setTimeout(() => {
        contentDiv.innerHTML = formatStateSchemeForModal(scheme);
    }, 200);
}

function formatStateSchemeForModal(scheme) {
    const content = scheme.info[CURRENT_LANG] || scheme.info.en;
    return `
        <h2>${content?.name || scheme.names.en}</h2>
        <div class="detail-row">
            <strong>${t('whatIsIt')}:</strong>
            <p>${content?.desc || ''}</p>
        </div>
        <div class="detail-row">
            <strong>${t('whoCanApply')}:</strong>
            <p>${content?.eligible || ''}</p>
        </div>
        <div class="detail-row">
            <strong>${t('stepsToApply')}:</strong>
            <ul>${(content?.steps || []).map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="detail-row">
            <strong>${t('documentsNeeded')}:</strong>
            <ul>${(content?.docs || []).map(d => `<li>${d}</li>`).join('')}</ul>
        </div>
        <div class="detail-row">
            <strong>${t('officialLink')}:</strong>
            <a href="${scheme.link}" target="_blank" class="official-link-btn">${t('visitWebsite')} ↗</a>
        </div>
    `;
}

function closeModal() {
    document.getElementById('aiModal').style.display = 'none';
}

// ==========================================
// CHAT HELPERS
// ==========================================
function addChatMessage(html, type) {
    const container = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.className = `msg ${type}-msg`;
    div.innerHTML = html;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
    const container = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.className = 'msg ai-msg typing';
    div.id = 'typing-dots';
    div.textContent = t('typingMsg');
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const el = document.getElementById('typing-dots');
    if (el) el.remove();
}

// Boot
window.onload = initApp;