// ==========================================
// AI-CHATBOT.JS - Improved Chat UI
// Structured, Card-like Response Format
// ==========================================

let CHAT_HISTORY = [];
let IS_SPEAKING = false;
let SPEECH_SYNTH = window.speechSynthesis;

// ==========================================
// CHAT UI FUNCTIONS
// ==========================================
function openAIChat() {
    const modal = document.getElementById('aiChatModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        const history = document.getElementById('chat-history');
        if (history && history.children.length === 0) {
            addChatMessage(getWelcomeMessage(), 'ai');
        }

        setTimeout(() => {
            document.getElementById('chatInput')?.focus();
        }, 100);
    }
}

function closeAIChat() {
    const modal = document.getElementById('aiChatModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    stopSpeaking();
}

function addChatMessage(content, type) {
    const history = document.getElementById('chat-history');
    if (!history) return;

    const msg = document.createElement('div');
    msg.className = 'chat-message ' + (type === 'user' ? 'flex justify-end' : 'flex gap-2');

    if (type === 'user') {
        msg.innerHTML = `
            <div class="user-bubble bg-primary text-white px-3 py-2 rounded-xl rounded-tr-sm max-w-[80%]">
                <p class="text-sm">${escapeHtml(content)}</p>
            </div>
        `;
    } else {
        msg.innerHTML = `
            <div class="ai-avatar w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-white text-sm">smart_toy</span>
            </div>
            <div class="ai-bubble bg-slate-50 dark:bg-slate-800 rounded-xl rounded-tl-sm border border-slate-200 dark:border-slate-700 max-w-[85%]">
                <div class="ai-response p-2 text-sm text-slate-800 dark:text-slate-200">${content}</div>
                <button onclick="speakText(this.previousElementSibling.innerText)" 
                    class="text-xs text-primary px-2 pb-1 hover:underline">🔊 ${getListenText()}</button>
            </div>
        `;
    }

    history.appendChild(msg);
    history.scrollTop = history.scrollHeight;

    CHAT_HISTORY.push({ role: type, content: content, lang: window.CURRENT_LANG || 'en' });
}

function getListenText() {
    const texts = {
        en: 'Listen', hi: 'सुनें', mr: 'ऐका', ta: 'கேளுங்கள்', te: 'వినండి',
        bn: 'শুনুন', gu: 'સાંભળો', kn: 'ಆಲಿಸಿ', ml: 'കേൾക്കുക', pa: 'ਸੁਣੋ', ur: 'سنیں'
    };
    return texts[window.CURRENT_LANG] || texts.en;
}

function showTyping() {
    const history = document.getElementById('chat-history');
    if (!history) return;

    const typing = document.createElement('div');
    typing.id = 'typing-indicator';
    typing.className = 'flex gap-3';
    typing.innerHTML = `
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-white text-lg">smart_toy</span>
        </div>
        <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-sm shadow-md border border-slate-100 dark:border-slate-700">
            <div class="flex gap-1.5">
                <span class="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></span>
                <span class="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style="animation-delay:150ms"></span>
                <span class="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style="animation-delay:300ms"></span>
            </div>
        </div>
    `;
    history.appendChild(typing);
    history.scrollTop = history.scrollHeight;
}

function hideTyping() {
    document.getElementById('typing-indicator')?.remove();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==========================================
// MESSAGE HANDLING
// ==========================================
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const text = input?.value?.trim();
    if (!text) return;

    addChatMessage(text, 'user');
    input.value = '';

    // Check if data is still loading
    if (!window.DATA_READY) {
        showTyping();
        setTimeout(() => {
            hideTyping();
            const lang = window.CURRENT_LANG || 'en';
            const loadingMsg = lang === 'hi'
                ? '<p>⏳ डेटा लोड हो रहा है, कृपया कुछ सेकंड प्रतीक्षा करें...</p>'
                : '<p>⏳ AI is loading data, please wait a moment...</p>';
            addChatMessage(loadingMsg, 'ai');
        }, 300);
        return;
    }

    showTyping();

    setTimeout(() => {
        hideTyping();
        const response = processQuery(text);
        addChatMessage(response, 'ai');
    }, 400 + Math.random() * 300);
}

function askAIAboutScheme(schemeId) {
    const scheme = DataLoader?.getSchemeById(schemeId);
    if (!scheme) return;

    openAIChat();

    const history = document.getElementById('chat-history');
    if (history) history.innerHTML = '';

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            hideTyping();
            const response = formatSchemeCard(scheme);
            addChatMessage(response, 'ai');
        }, 600);
    }, 200);
}

// ==========================================
// QUERY PROCESSING - INTELLIGENT & TOLERANT
// ==========================================
function processQuery(query) {
    const q = query.toLowerCase().trim();
    const lang = window.CURRENT_LANG || 'en';

    // Greetings
    if (['hi', 'hello', 'hey', 'namaste', 'नमस्ते', 'नमस्कार'].some(g => q === g)) {
        return getGreetingResponse();
    }

    // Thanks
    if (['thanks', 'thank you', 'धन्यवाद', 'shukriya'].some(t => q.includes(t))) {
        return getThanksResponse();
    }

    // Context
    const selectedState = window.SELECTED_STATE || localStorage.getItem('jansahayak_state') || '';
    const eligibilityActive = window.ELIGIBILITY_MODE && window.USER_PROFILE;

    if (typeof DataLoader === 'undefined') {
        return getHelpResponse();
    }

    // ========== PRIORITY 1: DIRECT SCHEME / ALIAS MATCH ==========
    // If user types a known scheme name or alias, show it immediately.

    let isAlias = false;
    let searchTerm = q;

    if (DataLoader.SCHEME_ALIASES) {
        for (const [key, aliases] of Object.entries(DataLoader.SCHEME_ALIASES)) {
            if (key === q || aliases.includes(q)) {
                searchTerm = key; // Use the canonical key for better search
                isAlias = true;
                break;
            }
        }
    }

    // Search with high precision
    let schemeResults = DataLoader.searchSchemes(searchTerm, { limit: 5 });

    // Apply state filter if needed
    if (selectedState) {
        const stateLower = selectedState.toLowerCase();
        schemeResults = schemeResults.filter(s => !s.isStateSpecific || s.state === stateLower);
    }

    if (eligibilityActive && typeof window.isSchemeEligible === 'function') {
        schemeResults = schemeResults.filter(s => window.isSchemeEligible(s, window.USER_PROFILE));
    }

    if (schemeResults.length > 0) {
        const first = schemeResults[0];
        const isStrictNameMatch = first.name.toLowerCase().includes(q);

        // If it's an alias match OR strict name match -> SHOW CARD
        if (isAlias || isStrictNameMatch) {
            return formatSchemeCard(first);
        }
    }

    // ========== PRIORITY 2: CATEGORY KEYWORD MATCH ==========
    // If user types "farmer", "student", "women", show category list.

    const categoryQueryPatterns = [
        { pattern: /women|mahila|महिला|lady|female/i, category: 'women', label: 'Women' },
        { pattern: /farmer|kisan|किसान|agriculture|krishi/i, category: 'agriculture', label: 'Farmer' },
        { pattern: /student|scholarship|education|vidyarthi|छात्र/i, category: 'education', label: 'Student/Education' },
        { pattern: /labour|labor|worker|shramik|श्रमिक|मजदूर/i, category: 'employment', label: 'Labour/Worker' },
        { pattern: /senior|pension|vridha|old age|वृद्ध/i, category: 'social', label: 'Senior Citizen' },
        { pattern: /housing|awas|आवास|home|house/i, category: 'housing', label: 'Housing' },
        { pattern: /health|swasthya|स्वास्थ्य|medical/i, category: 'health', label: 'Health' },
        { pattern: /loan|mudra|bank|credit/i, category: 'banking', label: 'Banking/Loan' },
        { pattern: /job|employment|rozgar|रोजगार|skill/i, category: 'employment', label: 'Employment' }
    ];

    for (const { pattern, category, label } of categoryQueryPatterns) {
        if (pattern.test(q)) {
            let catSchemes = DataLoader.getSchemes({ category, limit: 5 });

            // Filter
            if (selectedState) {
                const stateLower = selectedState.toLowerCase();
                catSchemes = catSchemes.filter(s => !s.isStateSpecific || s.state === stateLower);
            }
            if (eligibilityActive && typeof window.isSchemeEligible === 'function') {
                catSchemes = catSchemes.filter(s => window.isSchemeEligible(s, window.USER_PROFILE));
            }

            if (catSchemes.length > 0) {
                return formatCategoryResults(catSchemes.slice(0, 4), label);
            } else if (eligibilityActive) {
                // If filtered out by eligibility, say so
                return getNoEligibleSchemesResponse(label);
            }
        }
    }

    // ========== PRIORITY 3: GENERAL FUZZY SEARCH ==========
    // If not a strict match or category, show search results.

    if (schemeResults.length > 0) {
        if (schemeResults.length === 1) return formatSchemeCard(schemeResults[0]);
        return formatSearchResults(schemeResults.slice(0, 3), query);
    }

    // ========== PRIORITY 4: DEAD END / CLARIFICATION ==========
    // No results found.

    if (eligibilityActive) {
        return getNoEligibleSchemesResponse(query);
    }

    return getSuggestionsResponse(query);
}

// Format category-based results
function formatCategoryResults(schemes, categoryLabel) {
    const lang = window.CURRENT_LANG || 'en';
    const labels = {
        en: { found: `${categoryLabel} Schemes:`, details: 'Details →' },
        hi: { found: `${categoryLabel} योजनाएं:`, details: 'विवरण →' }
    };
    const L = labels[lang] || labels.en;

    let html = `<div class="text-sm"><p class="font-medium mb-2">${L.found}</p>`;

    schemes.forEach(scheme => {
        const badge = scheme.isStateSpecific ? '🏛️' : '🇮🇳';
        html += `<div class="p-2 mb-1 bg-slate-50 dark:bg-slate-700/50 rounded border border-slate-200 dark:border-slate-600">
            <span class="font-medium">${badge} ${scheme.name}</span>
            <button onclick="askAIAboutScheme('${scheme.id}')" class="text-xs text-primary hover:underline ml-2">${L.details}</button>
        </div>`;
    });

    html += `</div>`;
    return html;
}

// No schemes in category
function getNoSchemesInCategoryResponse(category) {
    const lang = window.CURRENT_LANG || 'en';
    const msg = {
        en: `<p>No <b>${category}</b> schemes found matching your criteria.</p><p class="text-xs text-slate-500 mt-1">Try clearing eligibility filters or selecting a different state.</p>`,
        hi: `<p><b>${category}</b> श्रेणी में कोई योजना नहीं मिली।</p>`
    };
    return msg[lang] || msg.en;
}

// Suggestions when nothing found - ASK CLARIFICATION
function getSuggestionsResponse(query) {
    const lang = window.CURRENT_LANG || 'en';
    const msg = {
        en: `<p>I didn't quite get that. Could you clarify regarding which category you are looking for?</p>
             <ul class="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>• <b>Farmer</b> schemes?</li>
                <li>• <b>Student</b> scholarships?</li>
                <li>• <b>Women</b> welfare?</li>
                <li>• <b>Health</b> insurance?</li>
             </ul>
             <p class="mt-2 text-xs text-slate-500">Or type a scheme name like "<b>PM Kisan</b>".</p>`,
        hi: `<p>मैं समझ नहीं पाया। क्या आप इनमें से किसी के बारे में जानना चाहते हैं?</p>
             <ul class="mt-2 space-y-1 text-sm">
                <li>• <b>किसान</b> योजनाएं?</li>
                <li>• <b>छात्र</b> छात्रवृत्ति?</li>
                <li>• <b>महिला</b> कल्याण?</li>
             </ul>`
    };
    return msg[lang] || msg.en;
}

// Detect category from query
function detectCategory(q) {
    const categoryMap = {
        'agriculture': ['kisan', 'farmer', 'krishi', 'agriculture', 'farming', 'किसान'],
        'education': ['scholarship', 'student', 'education', 'school', 'college', 'शिक्षा'],
        'health': ['health', 'ayushman', 'medical', 'hospital', 'स्वास्थ्य'],
        'women': ['women', 'mahila', 'lady', 'girl', 'महिला', 'beti'],
        'social': ['pension', 'senior', 'widow', 'disability'],
        'housing': ['housing', 'awas', 'home', 'house', 'आवास'],
        'employment': ['job', 'employment', 'rozgar', 'skill', 'रोजगार'],
        'banking': ['loan', 'mudra', 'bank', 'credit', 'finance']
    };

    for (const [category, keywords] of Object.entries(categoryMap)) {
        if (keywords.some(kw => q.includes(kw))) {
            return category;
        }
    }
    return null;
}

// ========== RESPONSE MESSAGES ==========
function getNotEligibleResponse(schemeName) {
    const lang = window.CURRENT_LANG || 'en';
    const msg = {
        en: `<p>❌ <b>${schemeName}</b> does not match your eligibility criteria.</p><p class="text-xs text-slate-500 mt-1">Check if your age, gender, occupation, or income meets the requirements.</p>`,
        hi: `<p>❌ <b>${schemeName}</b> आपकी पात्रता से मेल नहीं खाती।</p><p class="text-xs text-slate-500 mt-1">अपनी उम्र, लिंग, व्यवसाय या आय जांचें।</p>`
    };
    return msg[lang] || msg.en;
}

function getNotAvailableInStateResponse(schemeName, state) {
    const lang = window.CURRENT_LANG || 'en';
    const stateName = DataLoader.getStateName(state, lang) || state;
    const msg = {
        en: `<p>❌ <b>${schemeName}</b> is not available in <b>${stateName}</b>.</p>`,
        hi: `<p>❌ <b>${schemeName}</b> <b>${stateName}</b> में उपलब्ध नहीं है।</p>`
    };
    return msg[lang] || msg.en;
}

function getNoEligibleSchemesResponse(query) {
    const lang = window.CURRENT_LANG || 'en';
    const msg = {
        en: `<p>❌ <b>No schemes found</b> matching "${query}" for your eligibility profile.</p><p class="text-xs text-slate-500 mt-1">Try a different search or clear eligibility filters to browse all schemes.</p>`,
        hi: `<p>❌ "${query}" के लिए आपकी पात्रता प्रोफ़ाइल से मेल खाती <b>कोई योजना नहीं मिली</b>।</p><p class="text-xs text-slate-500 mt-1">अलग खोज करें या सभी योजनाएं देखने के लिए पात्रता फ़िल्टर साफ़ करें।</p>`
    };
    return msg[lang] || msg.en;
}

// === INTENT-BASED RESPONSE FORMATTERS ===
function formatStatusResponse(scheme) {
    const lang = window.CURRENT_LANG || 'en';
    const labels = {
        en: { title: 'Check Status', msg: 'To check your application status for', visit: 'Visit the official portal' },
        hi: { title: 'स्थिति जांचें', msg: 'के लिए अपने आवेदन की स्थिति जांचने के लिए', visit: 'आधिकारिक पोर्टल पर जाएं' }
    };
    const L = labels[lang] || labels.en;

    return `
        <div class="space-y-3">
            <div class="flex items-center gap-2 text-primary font-bold">
                <span class="material-symbols-outlined">track_changes</span>
                ${L.title}: ${scheme.name}
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-400">${L.msg} <strong>${scheme.name}</strong>:</p>
            <a href="https://www.myscheme.gov.in" target="_blank" 
               class="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <span class="material-symbols-outlined text-base">open_in_new</span>
                ${L.visit}
            </a>
        </div>
    `;
}

function formatDocumentsResponse(scheme) {
    const lang = window.CURRENT_LANG || 'en';
    const labels = {
        en: { title: 'Documents Required', for: 'For' },
        hi: { title: 'आवश्यक दस्तावेज', for: 'के लिए' }
    };
    const L = labels[lang] || labels.en;

    return `
        <div class="space-y-3">
            <div class="flex items-center gap-2 text-rose-600 font-bold">
                <span class="material-symbols-outlined">folder</span>
                ${L.title}
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-400">${L.for} <strong>${scheme.name}</strong>:</p>
            <div class="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-xl">
                ${formatAsPoints(scheme.documents || 'Check official website')}
            </div>
            <button onclick="askAIAboutScheme('${scheme.id}')" class="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">info</span>
                ${t('viewDetails')}
            </button>
        </div>
    `;
}

function formatApplyResponse(scheme) {
    const lang = window.CURRENT_LANG || 'en';
    const labels = {
        en: { title: 'How to Apply', for: 'For' },
        hi: { title: 'आवेदन कैसे करें', for: 'के लिए' }
    };
    const L = labels[lang] || labels.en;

    return `
        <div class="space-y-3">
            <div class="flex items-center gap-2 text-amber-600 font-bold">
                <span class="material-symbols-outlined">checklist</span>
                ${L.title}
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-400">${L.for} <strong>${scheme.name}</strong>:</p>
            <div class="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl">
                ${formatAsSteps(scheme.application || 'Visit official portal to apply')}
            </div>
            <a href="https://www.myscheme.gov.in" target="_blank" 
               class="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <span class="material-symbols-outlined text-base">open_in_new</span>
                ${t('applyNow')}
            </a>
        </div>
    `;
}

// ==========================================
// STRUCTURED RESPONSE FORMATTERS
// ==========================================
function getWelcomeMessage() {
    const lang = window.CURRENT_LANG || 'en';
    const messages = {
        en: `<p><strong>👋 Hi! I'm JanSahayak.</strong> Ask me about any government scheme.<br><span class="text-slate-500 dark:text-slate-400 text-xs">Try: PM Kisan, Ayushman, scholarships</span></p>`,
        hi: `<p><strong>👋 नमस्ते! मैं जनसहायक हूं।</strong> किसी भी सरकारी योजना के बारे में पूछें।<br><span class="text-slate-500 dark:text-slate-400 text-xs">पूछें: पीएम किसान, आयुष्मान, छात्रवृत्ति</span></p>`,
        mr: `<p><strong>👋 नमस्कार! मी जनसहायक आहे.</strong> कोणत्याही योजनेबद्दल विचारा।<br><span class="text-slate-500 dark:text-slate-400 text-xs">विचारा: पीएम किसान, आयुष्मान</span></p>`,
        ta: `<p><strong>👋 வணக்கம்! நான் ஜன்சஹாயக்.</strong> எந்த அரசு திட்டத்தைப் பற்றியும் கேளுங்கள்.<br><span class="text-slate-500 dark:text-slate-400 text-xs">முயற்சி: PM கிசான், ஆயுஷ்மான்</span></p>`,
        te: `<p><strong>👋 నమస్కారం! నేను జన్‌సహాయక్.</strong> ఏ ప్రభుత్వ పథకం గురించి అయినా అడగండి.<br><span class="text-slate-500 dark:text-slate-400 text-xs">ప్రయత్నించండి: PM కిసాన్, ఆయుష్మాన్</span></p>`,
        bn: `<p><strong>👋 নমস্কার! আমি জনসহায়ক।</strong> যেকোনো সরকারি প্রকল্প সম্পর্কে জিজ্ঞাসা করুন।<br><span class="text-slate-500 dark:text-slate-400 text-xs">চেষ্টা করুন: PM কিষাণ, আয়ুষ্মান</span></p>`,
        gu: `<p><strong>👋 નમસ્તે! હું જનસહાયક છું.</strong> કોઈપણ સરકારી યોજના વિશે પૂછો.<br><span class="text-slate-500 dark:text-slate-400 text-xs">પ્રયત્ન કરો: PM કિસાન, આયુષ્માન</span></p>`,
        kn: `<p><strong>👋 ನಮಸ್ಕಾರ! ನಾನು ಜನಸಹಾಯಕ್.</strong> ಯಾವುದೇ ಸರ್ಕಾರಿ ಯೋಜನೆ ಬಗ್ಗೆ ಕೇಳಿ.<br><span class="text-slate-500 dark:text-slate-400 text-xs">ಪ್ರಯತ್ನಿಸಿ: PM ಕಿಸಾನ್, ಆಯುಷ್ಮಾನ್</span></p>`,
        pa: `<p><strong>👋 ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਜਨਸਹਾਇਕ ਹਾਂ।</strong> ਕਿਸੇ ਵੀ ਸਰਕਾਰੀ ਯੋਜਨਾ ਬਾਰੇ ਪੁੱਛੋ।<br><span class="text-slate-500 dark:text-slate-400 text-xs">ਕੋਸ਼ਿਸ਼ ਕਰੋ: PM ਕਿਸਾਨ, ਆਯੁਸ਼ਮਾਨ</span></p>`
    };
    return messages[lang] || messages.en;
}

function getGreetingResponse() {
    const lang = window.CURRENT_LANG || 'en';
    const r = {
        en: `<p>Hello! 👋 What scheme would you like to know about?</p>`,
        hi: `<p>नमस्ते! 👋 किस योजना के बारे में जानना चाहेंगे?</p>`
    };
    return r[lang] || r.en;
}

function getThanksResponse() {
    const lang = window.CURRENT_LANG || 'en';
    const r = {
        en: `<p>You're welcome! 😊 Ask if you need more help.</p>`,
        hi: `<p>आपका स्वागत है! 😊 और मदद चाहिए तो पूछें।</p>`
    };
    return r[lang] || r.en;
}

function getHelpResponse() {
    const lang = window.CURRENT_LANG || 'en';
    const r = {
        en: `<p>I couldn't find that. Try: <strong>PM Kisan</strong>, <strong>Ayushman</strong>, <strong>scholarships</strong>, or <strong>women schemes</strong>.</p>`,
        hi: `<p>नहीं मिला। पूछें: <strong>पीएम किसान</strong>, <strong>आयुष्मान</strong>, <strong>छात्रवृत्ति</strong>।</p>`
    };
    return r[lang] || r.en;
}

// ==========================================
// SCHEME CARD FORMAT - MANDATORY FORMAT (120 words max)
// ==========================================
function formatSchemeCard(scheme) {
    const lang = window.CURRENT_LANG || 'en';

    const L = lang === 'hi'
        ? { title: 'योजना', who: 'कौन आवेदन करे', benefits: 'लाभ', apply: 'आवेदन प्रक्रिया', docs: 'दस्तावेज़', link: 'आधिकारिक लिंक' }
        : { title: 'Scheme', who: 'Who can apply', benefits: 'Benefits', apply: 'How to apply', docs: 'Documents needed', link: 'Official link' };

    const badge = scheme.isStateSpecific
        ? '<span class="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded ml-1">State</span>'
        : '<span class="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded ml-1">Central</span>';

    return `
        <div class="text-sm leading-snug">
            <p class="font-bold text-slate-900 dark:text-white mb-3 text-base">${scheme.name}${badge}</p>
            
            <div class="mb-3">
                <p class="font-bold text-slate-800 dark:text-slate-200">${L.who}:</p>
                <div class="pl-1 text-slate-700 dark:text-slate-300">
                    ${formatCleanPoints(scheme.eligibility, 2)}
                </div>
            </div>
            
            <div class="mb-3">
                <p class="font-bold text-slate-800 dark:text-slate-200">${L.benefits}:</p>
                <div class="pl-1 text-slate-700 dark:text-slate-300">
                    ${formatCleanPoints(scheme.benefits, 2)}
                </div>
            </div>
            
            <div class="mb-3">
                <p class="font-bold text-slate-800 dark:text-slate-200">${L.apply}:</p>
                <div class="pl-1 text-slate-700 dark:text-slate-300">
                    ${formatCleanSteps(scheme.application, 2)}
                </div>
            </div>

            ${scheme.documents ? `
            <div class="mb-3">
                <p class="font-bold text-slate-800 dark:text-slate-200">${L.docs}:</p>
                <div class="pl-1 text-slate-700 dark:text-slate-300">
                    ${formatCleanPoints(scheme.documents, 3)}
                </div>
            </div>` : ''}
            
            <p class="mt-2"><b>${L.link}:</b> <a href="https://www.myscheme.gov.in" target="_blank" class="text-primary hover:underline break-all">myscheme.gov.in →</a></p>
        </div>
    `;
}

// Helper: Format points cleanly without cutting sentences
function formatCleanPoints(text, max) {
    if (!text || text === '-' || text === 'null') return `• Refer to official website for details.`;

    // Split by newlines, bullets, semicolons, or periods followed by space
    let points = text.split(/[\n•;]+|(?<=\.)\s+/).map(s => s.trim()).filter(s => s.length > 5);

    // Unique points only
    points = [...new Set(points)];

    if (points.length === 0) return `• Refer to official website for details.`;

    // Take top N points
    return points.slice(0, max).map(p => {
        // Ensure proper capitalization and ending
        let clean = p.charAt(0).toUpperCase() + p.slice(1);
        if (!clean.endsWith('.')) clean += '.';
        return `• ${clean}`;
    }).join('<br>');
}

// Helper: Format numbered steps cleanly without cutting sentences
function formatCleanSteps(text, max) {
    if (!text || text === '-' || text === 'null') return `1. Check official portal.`;

    // Split by numbers or newlines
    let steps = text.split(/[\n;]+|\d+\.\s+/).map(s => s.trim()).filter(s => s.length > 5);

    // Unique steps
    steps = [...new Set(steps)];

    if (steps.length === 0) return `1. Visit the official website.<br>2. Follow instructions to apply.`;

    // Take top N steps
    return steps.slice(0, max).map((s, i) => {
        let clean = s.charAt(0).toUpperCase() + s.slice(1);
        if (!clean.endsWith('.')) clean += '.';
        return `${i + 1}. ${clean}`;
    }).join('<br>');
}

// Legacy helpers (can be removed or mapped to new ones)
function truncatePoints(text, max) { return formatCleanPoints(text, max); }
function truncateSteps(text, max) { return formatCleanSteps(text, max); }
function truncateList(text, max) { return formatCleanPoints(text, max); }

function formatAsPoints(text) {
    return formatCleanPoints(text, 5);
}

function formatAsSteps(text) {
    return formatCleanSteps(text, 5);
}

function formatSearchResults(results, query) {
    const lang = window.CURRENT_LANG || 'en';
    const found = { en: 'Found', hi: 'मिला' }[lang] || 'Found';

    let html = `<div class="text-sm space-y-2">
        <p class="text-slate-600 dark:text-slate-400">${found} <b>${results.length}</b> scheme(s):</p>`;

    results.slice(0, 3).forEach(scheme => {
        const badge = scheme.isStateSpecific ? '🏛️' : '🇮🇳';
        html += `
            <div class="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                <div class="font-medium text-slate-900 dark:text-white">${badge} ${scheme.name}</div>
                <button onclick="askAIAboutScheme('${scheme.id}')" class="text-xs text-primary hover:underline mt-1">View details →</button>
            </div>`;
    });

    html += `</div>`;
    return html;
}

function formatSearchResultsWithNote(results, query) {
    const lang = window.CURRENT_LANG || 'en';
    const note = { en: '⚠️ May not match your eligibility:', hi: '⚠️ पात्रता से मेल नहीं:' }[lang] || '⚠️ May not match eligibility:';

    let html = `<div class="text-sm space-y-2">
        <p class="text-amber-600 dark:text-amber-400">${note}</p>`;

    results.slice(0, 3).forEach(scheme => {
        html += `<div class="p-2 bg-slate-50 dark:bg-slate-700/50 rounded border">
            <span class="font-medium">${scheme.name}</span>
            <button onclick="askAIAboutScheme('${scheme.id}')" class="text-xs text-primary hover:underline ml-2">Details →</button>
        </div>`;
    });

    html += `</div>`;
    return html;
}

// ==========================================
// VOICE/TTS
// ==========================================
function speakText(text) {
    if (!SPEECH_SYNTH) return;
    stopSpeaking();

    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const langMap = {
        en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', ta: 'ta-IN', te: 'te-IN',
        bn: 'bn-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN', ur: 'ur-PK'
    };

    utterance.lang = langMap[window.CURRENT_LANG] || 'en-IN';
    utterance.rate = 0.9;
    utterance.onstart = () => { IS_SPEAKING = true; };
    utterance.onend = () => { IS_SPEAKING = false; };

    SPEECH_SYNTH.speak(utterance);
}

function stopSpeaking() {
    if (SPEECH_SYNTH) {
        SPEECH_SYNTH.cancel();
        IS_SPEAKING = false;
    }
}

// ==========================================
// SCHEME MODAL
// ==========================================
function openSchemeModal(schemeId) {
    const scheme = DataLoader?.getSchemeById(schemeId);
    if (!scheme) return;

    const modal = document.getElementById('schemeModal');
    const header = document.getElementById('modalHeader');
    const content = document.getElementById('modalContent');
    const footer = document.getElementById('modalFooter');

    if (!modal || !header || !content || !footer) return;

    const isState = scheme.isStateSpecific;
    const badgeClass = isState ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary';
    const badgeText = isState ? t('stateScheme') : t('centralScheme');

    header.innerHTML = `
        <div class="flex-1">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full ${badgeClass} mb-2 inline-block">${badgeText}</span>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white leading-snug">${scheme.name}</h2>
        </div>
        <button onclick="closeSchemeModal()" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors shrink-0">
            <span class="material-symbols-outlined">close</span>
        </button>
    `;

    content.innerHTML = `
        <div class="space-y-5">
            <div class="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/20">
                <h4 class="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
                    <span class="material-symbols-outlined text-primary">info</span> ${t('whatIsIt')}
                </h4>
                <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">${scheme.details || '-'}</p>
            </div>
            
            ${scheme.benefits ? `
            <div class="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <h4 class="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
                    <span class="material-symbols-outlined text-emerald-600">payments</span> ${t('benefits')}
                </h4>
                <p class="text-slate-700 dark:text-slate-300 text-sm">${scheme.benefits}</p>
            </div>
            ` : ''}
            
            <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-xl border border-violet-200 dark:border-violet-800">
                <h4 class="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
                    <span class="material-symbols-outlined text-violet-600">how_to_reg</span> ${t('whoCanApply')}
                </h4>
                <p class="text-slate-700 dark:text-slate-300 text-sm">${scheme.eligibility || '-'}</p>
            </div>
            
            <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                <h4 class="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
                    <span class="material-symbols-outlined text-amber-600">checklist</span> ${t('howToApply')}
                </h4>
                <p class="text-slate-700 dark:text-slate-300 text-sm">${scheme.application || '-'}</p>
            </div>
            
            <div class="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-200 dark:border-rose-800">
                <h4 class="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
                    <span class="material-symbols-outlined text-rose-600">folder</span> ${t('documentsNeeded')}
                </h4>
                <p class="text-slate-700 dark:text-slate-300 text-sm">${scheme.documents || '-'}</p>
            </div>
        </div>
    `;

    footer.innerHTML = `
        <a href="https://www.myscheme.gov.in" target="_blank" class="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 text-center flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">open_in_new</span> ${t('applyNow')}
        </a>
        <button onclick="closeSchemeModal();askAIAboutScheme('${schemeId}')" class="flex-1 py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/10 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">smart_toy</span> ${t('askAI')}
        </button>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeSchemeModal() {
    const modal = document.getElementById('schemeModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// ==========================================
// ELIGIBILITY MODAL WITH VALIDATION
// ==========================================
function openEligibilityModal() {
    const modal = document.getElementById('eligibilityModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        if (typeof setupAllStateSelectors === 'function') setupAllStateSelectors();
        if (typeof updateAllUIText === 'function') updateAllUIText();

        // Restore previous values
        if (window.USER_PROFILE) {
            ['state', 'age', 'gender', 'category', 'occupation', 'income'].forEach(key => {
                const el = document.getElementById('elig_' + key);
                if (el && window.USER_PROFILE[key]) el.value = window.USER_PROFILE[key];
            });
        }
    }
}

function closeEligibilityModal() {
    const modal = document.getElementById('eligibilityModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function submitEligibility() {
    const state = document.getElementById('elig_state')?.value?.trim();
    const age = parseInt(document.getElementById('elig_age')?.value) || 0;
    const gender = document.getElementById('elig_gender')?.value?.trim();
    const category = document.getElementById('elig_category')?.value?.trim();
    const occupation = document.getElementById('elig_occupation')?.value?.trim();
    const income = parseInt(document.getElementById('elig_income')?.value) || 0;

    // STRICT VALIDATION - ALL FIELDS REQUIRED
    const errors = [];
    if (!state) errors.push(t('selectState'));
    if (!age || age < 1 || age > 120) errors.push(t('enterAge') + ' (1-120)');
    if (!gender) errors.push(t('selectGender'));
    if (!category) errors.push('Select Category');
    if (!occupation) errors.push(t('selectOccupation'));

    if (errors.length > 0) {
        alert(t('fillAllFields') + ':\n• ' + errors.join('\n• '));
        return;
    }

    // Create profile
    const profile = { state, age, gender, category, occupation, income };

    // Update globals
    window.USER_PROFILE = profile;
    window.ELIGIBILITY_MODE = true;

    if (typeof USER_PROFILE !== 'undefined') USER_PROFILE = profile;
    if (typeof ELIGIBILITY_MODE !== 'undefined') ELIGIBILITY_MODE = true;
    if (typeof SELECTED_STATE !== 'undefined') SELECTED_STATE = state;

    // Persist
    localStorage.setItem('jansahayak_profile', JSON.stringify(profile));
    localStorage.setItem('jansahayak_eligibility_mode', 'true');
    localStorage.setItem('jansahayak_state', state);

    closeEligibilityModal();

    // Redirect to all-schemes page
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath.includes('all-schemes')) {
        if (typeof updateEligibilityStatusDisplay === 'function') updateEligibilityStatusDisplay();
        if (typeof renderPage === 'function') renderPage();
    } else {
        window.location.href = 'all-schemes.html';
    }
}

function clearEligibility() {
    window.USER_PROFILE = null;
    window.ELIGIBILITY_MODE = false;

    if (typeof USER_PROFILE !== 'undefined') USER_PROFILE = null;
    if (typeof ELIGIBILITY_MODE !== 'undefined') ELIGIBILITY_MODE = false;

    localStorage.setItem('jansahayak_eligibility_mode', 'false');
    localStorage.removeItem('jansahayak_profile');

    ['elig_state', 'elig_age', 'elig_gender', 'elig_category', 'elig_occupation', 'elig_income'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    closeEligibilityModal();

    if (typeof updateEligibilityStatusDisplay === 'function') updateEligibilityStatusDisplay();
    if (typeof renderPage === 'function') renderPage();
}

// Exports
window.openAIChat = openAIChat;
window.closeAIChat = closeAIChat;
window.sendChatMessage = sendChatMessage;
window.askAIAboutScheme = askAIAboutScheme;
window.speakText = speakText;
window.stopSpeaking = stopSpeaking;
window.openSchemeModal = openSchemeModal;
window.closeSchemeModal = closeSchemeModal;
window.openEligibilityModal = openEligibilityModal;
window.closeEligibilityModal = closeEligibilityModal;
window.submitEligibility = submitEligibility;
window.clearEligibility = clearEligibility;
