// ==========================================
// APP.JS - Main Application Logic
// STRICT Eligibility Mode vs Browse Mode
// ==========================================

// Global State
let CURRENT_LANG = localStorage.getItem('jansahayak_lang') || 'en';
let USER_PROFILE = JSON.parse(localStorage.getItem('jansahayak_profile')) || null;
let SELECTED_STATE = localStorage.getItem('jansahayak_state') || '';
let ELIGIBILITY_MODE = localStorage.getItem('jansahayak_eligibility_mode') === 'true';
let CURRENT_PAGE = 'home';
let CURRENT_CATEGORY = null;
let DATA_LOADED = false;

// Make globals accessible
window.CURRENT_LANG = CURRENT_LANG;
window.USER_PROFILE = USER_PROFILE;
window.ELIGIBILITY_MODE = ELIGIBILITY_MODE;
window.SELECTED_STATE = SELECTED_STATE;

// Initialize app - NON-BLOCKING for fast UI
async function initApp() {
    console.log('🚀 Initializing JanSahayak...');
    const startTime = performance.now();

    // STEP 1: Show UI immediately (no blocking)
    applyTheme();
    setupLanguageDropdown();
    updateAllUIText();
    setupEventListeners();

    // Show loading state for content
    showLoadingState();

    console.log(`⚡ UI ready in ${Math.round(performance.now() - startTime)}ms`);

    // STEP 2: Load data in background (non-blocking)
    setTimeout(async () => {
        if (typeof DataLoader !== 'undefined') {
            DATA_LOADED = await DataLoader.loadSchemesFromCSV();
            console.log(`📊 Data loaded: ${DATA_LOADED} in ${Math.round(performance.now() - startTime)}ms`);
        }

        // Now update UI with data
        setupAllStateSelectors();
        updateEligibilityStatusDisplay();
        renderPage();

        // Notify AI chatbot that data is ready
        window.DATA_READY = true;
        console.log(`✅ App fully ready in ${Math.round(performance.now() - startTime)}ms`);
    }, 10);
}

// Show loading state while data loads
function showLoadingState() {
    const container = document.getElementById('main-content');
    if (container) {
        container.innerHTML = `
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                ${[1, 2, 3, 4, 5, 6, 7, 8].map(() => `
                    <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse">
                        <div class="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4"></div>
                        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// ==========================================
// ELIGIBILITY SYSTEM - STRICT FILTERING
// ==========================================
// STRICT ELIGIBILITY ENGINE
// ==========================================

// Validate eligibility data - ALL fields required
function validateEligibility(profile) {
    if (!profile) return false;
    if (!profile.state || profile.state.trim() === '') return false;
    if (!profile.age || isNaN(profile.age) || profile.age < 1 || profile.age > 120) return false;
    if (!profile.gender || profile.gender.trim() === '') return false;
    if (!profile.occupation || profile.occupation.trim() === '') return false;
    if (!profile.category || profile.category.trim() === '') return false;
    return true;
}

// STRICT eligibility check - scheme must pass ALL conditions
function isSchemeEligible(scheme, profile) {
    if (!profile || !validateEligibility(profile)) return false;

    const eligText = (scheme.eligibility || '').toLowerCase();
    const schemeName = (scheme.name || '').toLowerCase();
    const schemeDetails = (scheme.details || '').toLowerCase();
    const fullText = `${eligText} ${schemeName} ${schemeDetails}`;

    // ========== 1. STATE CHECK (STRICT) ==========
    if (scheme.isStateSpecific && scheme.state) {
        const schemeState = scheme.state.toLowerCase().trim();
        const userState = profile.state.toLowerCase().trim();
        // Must be exact match
        if (schemeState !== userState) {
            return false;
        }
    }

    // ========== 2. GENDER CHECK (STRICT) ==========
    // Women-only schemes
    const womenKeywords = ['women only', 'for women', 'female only', 'only women',
        'women beneficiaries', 'girl', 'mahila', 'widow', 'pregnant', 'maternity',
        'lady', 'ladies', 'beti', 'stree', 'nari', 'sukanya', 'kanya'];
    const isWomenOnly = womenKeywords.some(kw => fullText.includes(kw));

    // Men-only schemes (rare)
    const menKeywords = ['men only', 'male only', 'for men'];
    const isMenOnly = menKeywords.some(kw => fullText.includes(kw));

    if (isWomenOnly && profile.gender !== 'female') {
        console.log(`❌ Excluded (gender): ${scheme.name} - women only, user is ${profile.gender}`);
        return false;
    }
    if (isMenOnly && profile.gender !== 'male') {
        return false;
    }

    // ========== 3. AGE CHECK (STRICT) ==========
    const userAge = parseInt(profile.age);

    // Extract age limits from text
    const agePatterns = [
        /age.*?(\d{1,2})\s*(?:to|-|–)\s*(\d{1,2})/i,
        /(\d{1,2})\s*(?:to|-|–)\s*(\d{1,2})\s*years/i,
        /between.*?(\d{1,2}).*?(\d{1,2})/i,
        /above\s*(\d{1,2})\s*years/i,
        /below\s*(\d{1,2})\s*years/i,
        /minimum.*?(\d{1,2})\s*years/i,
        /maximum.*?(\d{1,2})\s*years/i
    ];

    for (const pattern of agePatterns) {
        const match = fullText.match(pattern);
        if (match) {
            if (match[2]) {
                // Range: min-max
                const minAge = parseInt(match[1]);
                const maxAge = parseInt(match[2]);
                if (userAge < minAge || userAge > maxAge) {
                    console.log(`❌ Excluded (age range): ${scheme.name} - needs ${minAge}-${maxAge}, user is ${userAge}`);
                    return false;
                }
            } else if (fullText.includes('above') || fullText.includes('minimum')) {
                const minAge = parseInt(match[1]);
                if (userAge < minAge) {
                    console.log(`❌ Excluded (min age): ${scheme.name} - needs ${minAge}+, user is ${userAge}`);
                    return false;
                }
            } else if (fullText.includes('below') || fullText.includes('maximum') || fullText.includes('upto')) {
                const maxAge = parseInt(match[1]);
                if (userAge > maxAge) {
                    console.log(`❌ Excluded (max age): ${scheme.name} - needs below ${maxAge}, user is ${userAge}`);
                    return false;
                }
            }
            break;
        }
    }

    // Senior citizen schemes (60+)
    if ((fullText.includes('senior citizen') || fullText.includes('old age') ||
        fullText.includes('vridha') || fullText.includes('pension')) && userAge < 60) {
        if (!fullText.includes('disability') && !fullText.includes('widow')) {
            console.log(`❌ Excluded (senior): ${scheme.name} - needs 60+, user is ${userAge}`);
            return false;
        }
    }

    // Child schemes (below 18)
    if ((fullText.includes('child') || schemeName.includes('bal ') ||
        fullText.includes('minor') || fullText.includes('below 18')) && userAge >= 18) {
        if (!fullText.includes('parent') && !fullText.includes('mother')) {
            return false;
        }
    }

    // ========== 4. OCCUPATION CHECK (STRICT) ==========
    const userOccupation = profile.occupation.toLowerCase();

    // Farmer schemes
    const farmerKeywords = ['farmer', 'kisan', 'krishi', 'agricultural', 'cultivator'];
    const isFarmerScheme = farmerKeywords.some(kw => fullText.includes(kw));
    if (isFarmerScheme && userOccupation !== 'farmer') {
        console.log(`❌ Excluded (occupation): ${scheme.name} - for farmers, user is ${userOccupation}`);
        return false;
    }

    // Student schemes
    const studentKeywords = ['student', 'scholarship', 'vidyarthi', 'studying', 'college', 'school'];
    const isStudentScheme = studentKeywords.some(kw => fullText.includes(kw));
    if (isStudentScheme && userOccupation !== 'student') {
        return false;
    }

    // Worker/Labour schemes
    const workerKeywords = ['worker', 'labourer', 'shramik', 'labour', 'employee'];
    const isWorkerScheme = workerKeywords.some(kw => fullText.includes(kw));
    if (isWorkerScheme && !['employed', 'self-employed', 'labourer'].includes(userOccupation)) {
        return false;
    }

    // ========== 5. CATEGORY CHECK (STRICT) ==========
    const userCategory = profile.category.toLowerCase();

    // SC specific
    if ((fullText.includes('sc only') || fullText.includes('scheduled caste only'))
        && userCategory !== 'sc') {
        return false;
    }

    // ST specific
    if ((fullText.includes('st only') || fullText.includes('scheduled tribe only'))
        && userCategory !== 'st') {
        return false;
    }

    // SC/ST specific
    if ((fullText.includes('sc/st only') || fullText.includes('sc and st only') ||
        fullText.includes('for sc/st')) && !['sc', 'st'].includes(userCategory)) {
        console.log(`❌ Excluded (category): ${scheme.name} - SC/ST only, user is ${userCategory}`);
        return false;
    }

    // OBC specific
    if ((fullText.includes('obc only') || fullText.includes('backward class only'))
        && userCategory !== 'obc') {
        return false;
    }

    // ========== 6. INCOME CHECK (STRICT) ==========
    if (profile.income && profile.income > 0) {
        const userIncome = parseInt(profile.income);

        // BPL schemes (strict)
        if (fullText.includes('bpl') || fullText.includes('below poverty line')) {
            if (userIncome > 100000) {
                console.log(`❌ Excluded (BPL): ${scheme.name} - BPL only, user income is ${userIncome}`);
                return false;
            }
        }

        // EWS schemes (typically < 8 lakh)
        if (fullText.includes('ews') || fullText.includes('economically weaker')) {
            if (userIncome > 800000) {
                return false;
            }
        }

        // Extract specific income limits
        const incomePatterns = [
            /income.*?(?:less than|below|upto|not exceed).*?(?:rs\.?|₹)?\s*(\d+\.?\d*)\s*(lakh|lac|crore)?/i,
            /(?:rs\.?|₹)?\s*(\d+\.?\d*)\s*(lakh|lac|crore)?.*?income.*?limit/i,
            /annual.*?income.*?(\d+\.?\d*)\s*(lakh|lac)/i
        ];

        for (const pattern of incomePatterns) {
            const match = fullText.match(pattern);
            if (match) {
                let limit = parseFloat(match[1]);
                const unit = (match[2] || '').toLowerCase();
                if (unit === 'lakh' || unit === 'lac') limit *= 100000;
                if (unit === 'crore') limit *= 10000000;
                if (!unit && limit < 1000) limit *= 100000; // Assume lakh if no unit

                if (userIncome > limit) {
                    console.log(`❌ Excluded (income): ${scheme.name} - limit ${limit}, user income is ${userIncome}`);
                    return false;
                }
                break;
            }
        }
    }

    // ========== PASSED ALL CHECKS ==========
    console.log(`✅ Eligible: ${scheme.name}`);
    return true;
}

// Export eligibility functions to window
window.isSchemeEligible = isSchemeEligible;
window.validateEligibility = validateEligibility;

// Get filtered schemes based on mode
function getFilteredSchemes(schemes) {
    // BROWSE MODE - No eligibility, show all
    if (!ELIGIBILITY_MODE || !USER_PROFILE || !validateEligibility(USER_PROFILE)) {
        return schemes;
    }

    // ELIGIBILITY MODE - Strict filtering
    return schemes.filter(scheme => isSchemeEligible(scheme, USER_PROFILE));
}

// Update eligibility status bar
function updateEligibilityStatusDisplay() {
    const statusBar = document.getElementById('eligibility-status-bar');
    const statusText = document.getElementById('eligibility-status-text');
    const statsSection = document.querySelector('section.max-w-7xl.-mt-6') || document.querySelector('section.max-w-7xl.mt-6'); // Handle both states

    if (ELIGIBILITY_MODE && USER_PROFILE && validateEligibility(USER_PROFILE)) {
        if (statusBar) {
            statusBar.classList.remove('hidden');
            statusBar.classList.add('flex');
        }
        if (statusText) {
            const stateName = DataLoader.getStateName(USER_PROFILE.state, CURRENT_LANG) || USER_PROFILE.state;
            const genderText = t(USER_PROFILE.gender) || USER_PROFILE.gender;
            const occupationText = t(USER_PROFILE.occupation) || USER_PROFILE.occupation;
            statusText.innerHTML = `<strong>${t('eligibilityMode')}:</strong> ${USER_PROFILE.age} ${t('years')}, ${genderText}, ${occupationText}, ${stateName}`;
        }
        // Fix layout overlap: remove negative margin, add positive margin
        if (statsSection) {
            statsSection.classList.remove('-mt-6');
            statsSection.classList.add('mt-6');
        }
    } else if (statusBar) {
        statusBar.classList.add('hidden');
        statusBar.classList.remove('flex');
        // Restore layout overlap
        if (statsSection) {
            statsSection.classList.add('-mt-6');
            statsSection.classList.remove('mt-6');
        }
    }
}

// Clear eligibility mode - return to browse mode
function clearEligibilityMode() {
    ELIGIBILITY_MODE = false;
    USER_PROFILE = null;
    SELECTED_STATE = '';

    localStorage.setItem('jansahayak_eligibility_mode', 'false');
    localStorage.removeItem('jansahayak_profile');
    localStorage.removeItem('jansahayak_state');

    window.ELIGIBILITY_MODE = false;
    window.USER_PROFILE = null;

    updateEligibilityStatusDisplay();
    CURRENT_CATEGORY = null;
    renderPage();

    console.log('Cleared eligibility mode - now in Browse Mode');
}

// ==========================================
// LANGUAGE SYSTEM
// ==========================================
function setupLanguageDropdown() {
    const dropdowns = document.querySelectorAll('#langDropdown');
    const btns = document.querySelectorAll('#langDropdownBtn');

    btns.forEach((btn, index) => {
        const dropdown = dropdowns[index];
        if (!dropdown || typeof LANGUAGES === 'undefined') return;

        const label = btn.querySelector('#currentLangLabel');
        if (label) {
            label.textContent = LANGUAGES[CURRENT_LANG]?.native || 'English';
        }

        dropdown.innerHTML = '';
        Object.entries(LANGUAGES).forEach(([code, lang]) => {
            const item = document.createElement('button');
            item.className = `w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between transition-colors ${code === CURRENT_LANG ? 'bg-primary/10 text-primary font-bold' : 'text-slate-700 dark:text-slate-300'}`;
            item.innerHTML = `
                <span>${lang.native}</span>
                <span class="text-xs text-slate-400">${lang.name}</span>
                ${code === CURRENT_LANG ? '<span class="material-symbols-outlined text-sm text-primary">check</span>' : ''}
            `;
            item.onclick = (e) => {
                e.stopPropagation();
                changeLanguage(code);
            };
            dropdown.appendChild(item);
        });

        btn.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        };
    });

    document.addEventListener('click', () => {
        dropdowns.forEach(d => d?.classList.add('hidden'));
    });
}

function changeLanguage(code) {
    console.log('Changing language to:', code);
    CURRENT_LANG = code;
    window.CURRENT_LANG = code;
    localStorage.setItem('jansahayak_lang', code);

    document.querySelectorAll('#currentLangLabel').forEach(label => {
        if (LANGUAGES[code]) label.textContent = LANGUAGES[code].native;
    });

    document.querySelectorAll('#langDropdown').forEach(d => d.classList.add('hidden'));

    updateAllUIText();
    setupAllStateSelectors();
    updateEligibilityStatusDisplay();
    CURRENT_CATEGORY = null;
    renderPage();

    // Clear AI chat for fresh language responses
    const chatHistory = document.getElementById('chat-history');
    if (chatHistory) chatHistory.innerHTML = '';
}

function updateAllUIText() {
    setText('nav-home', t('navHome'));
    setText('nav-all', t('navAll'));
    setText('nav-popular', t('navPopular'));
    setText('nav-state', t('navState'));
    setText('hero-title', t('heroTitle'));
    setText('hero-subtitle', t('heroSubtitle'));
    setText('btn-browse', t('browseSchemes'));
    setText('btn-eligible', t('findEligible'));
    setText('page-title', t('navAll'));
    setText('page-subtitle', t('browseModeDesc'));
    setText('state-page-title', t('statePageTitle'));
    setText('state-page-subtitle', t('statePageSubtitle'));
    setText('state-selector-label', t('selectState'));
    setText('footer-text', t('footerText'));
    setText('eligibility-title', t('eligibilityTitle'));
    setText('eligibility-subtitle', t('eligibilitySubtitle'));
    setText('btn-submit-elig', t('submit'));
    setText('btn-clear-elig', t('clear'));
    setText('label-state', t('selectState'));
    setText('label-age', t('enterAge'));
    setText('label-gender', t('selectGender'));
    setText('label-category', t('selectCategory'));
    setText('label-occupation', t('selectOccupation'));
    setText('label-income', t('annualIncome'));
    setText('ai-title', t('aiAssistant'));
    setPlaceholder('chatInput', t('typeMessage'));
    setText('clear-eligibility-btn', t('clearEligibility'));

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (key) el.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (key) el.placeholder = t(key);
    });

    updateSelectOptions();
}

function updateSelectOptions() {
    const genderSelect = document.getElementById('elig_gender');
    if (genderSelect) {
        genderSelect.querySelectorAll('option').forEach(opt => {
            if (opt.value === 'male') opt.textContent = t('male');
            else if (opt.value === 'female') opt.textContent = t('female');
            else if (opt.value === 'other') opt.textContent = t('other');
            else if (opt.value === '') opt.textContent = t('selectGender');
        });
    }

    const categorySelect = document.getElementById('elig_category');
    if (categorySelect) {
        categorySelect.querySelectorAll('option').forEach(opt => {
            if (opt.value === 'general') opt.textContent = t('general');
            else if (opt.value === 'obc') opt.textContent = t('obc');
            else if (opt.value === 'sc') opt.textContent = t('sc');
            else if (opt.value === 'st') opt.textContent = t('st');
        });
    }

    const occupationSelect = document.getElementById('elig_occupation');
    if (occupationSelect) {
        occupationSelect.querySelectorAll('option').forEach(opt => {
            if (opt.value === 'farmer') opt.textContent = t('farmer');
            else if (opt.value === 'student') opt.textContent = t('student');
            else if (opt.value === 'employed') opt.textContent = t('employed');
            else if (opt.value === 'self-employed') opt.textContent = t('selfEmployed');
            else if (opt.value === 'unemployed') opt.textContent = t('unemployed');
            else if (opt.value === 'retired') opt.textContent = t('retired');
            else if (opt.value === '') opt.textContent = t('selectOccupation');
        });
    }
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
}

function setPlaceholder(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.placeholder = text;
}

// ==========================================
// STATE SELECTOR
// ==========================================
function setupAllStateSelectors() {
    const selectors = document.querySelectorAll('[data-state-selector]');

    selectors.forEach(select => {
        if (!select || typeof DataLoader === 'undefined') return;

        select.innerHTML = `<option value="">${t('selectState')}</option>`;

        const states = DataLoader.getAllStatesSorted();
        states.forEach(stateKey => {
            const stateName = DataLoader.getStateName(stateKey, CURRENT_LANG);
            const opt = document.createElement('option');
            opt.value = stateKey;
            opt.textContent = stateName;
            if (stateKey === SELECTED_STATE) opt.selected = true;
            select.appendChild(opt);
        });
    });
}

function selectState(state) {
    SELECTED_STATE = state;
    window.SELECTED_STATE = state;
    localStorage.setItem('jansahayak_state', state);
    CURRENT_CATEGORY = null;
    renderPage();
}

function clearStateSelection() {
    SELECTED_STATE = '';
    window.SELECTED_STATE = '';
    localStorage.removeItem('jansahayak_state');
    CURRENT_CATEGORY = null;
    renderPage();
}

// ==========================================
// THEME SYSTEM
// ==========================================
function applyTheme() {
    const theme = localStorage.getItem('jansahayak_theme') || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    updateThemeIcon();
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('jansahayak_theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    document.querySelectorAll('#themeToggle .material-symbols-outlined').forEach(icon => {
        icon.textContent = document.documentElement.classList.contains('dark') ? 'light_mode' : 'dark_mode';
    });
}

// ==========================================
// PAGE RENDERING
// ==========================================
function renderNoSchemesMessage() {
    return `
        <div class="text-center py-12">
            <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined text-3xl text-slate-400">content_paste_off</span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">${t('noSchemesFound') || 'No Schemes Found'}</h3>
            <p class="text-slate-500 max-w-md mx-auto mb-6">
                ${SELECTED_STATE ?
            `We couldn't find specific schemes for <b>${DataLoader.getStateName(SELECTED_STATE, CURRENT_LANG)}</b> matching your filters.` :
            (t('tryAdjustingFilters') || 'Try adjusting your filters or browsing all categories.')}
            </p>
            ${ELIGIBILITY_MODE ? `
                <button onclick="clearEligibilityMode()" class="px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
                    ${t('clearFilters') || 'Clear Eligibility Filters'}
                </button>
            ` : ''}
        </div>
    `;
}

function renderPage() {
    if (!DATA_LOADED) {
        showLoading();
        return;
    }
    // ... rest of renderPage


    const container = document.getElementById('main-content');
    if (!container) return;

    const path = window.location.pathname.toLowerCase();

    if (path.includes('all-schemes')) {
        CURRENT_PAGE = 'all';
        renderAllSchemes(container);
    } else if (path.includes('popular')) {
        CURRENT_PAGE = 'popular';
        renderPopularSchemes(container);
    } else if (path.includes('state-schemes') || path.includes('state')) {
        CURRENT_PAGE = 'state';
        renderStateSchemes(container);
    } else {
        CURRENT_PAGE = 'home';
        renderHomePage(container);
    }

    updateNavigation();
}

function renderHomePage(container) {
    let schemes = DataLoader.getSchemes({});
    schemes = getFilteredSchemes(schemes);

    const grouped = groupSchemesByCategory(schemes);
    const categories = Object.keys(grouped).filter(cat => grouped[cat].length > 0).slice(0, 8);

    const modeText = ELIGIBILITY_MODE && validateEligibility(USER_PROFILE)
        ? (t('eligibilityModeDesc') || "Showing only schemes you qualify for")
        : (t('browseModeDesc') || "Browse government schemes by category");

    let html = `
        <div class="mb-8">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">${t('byCategory')}</h2>
            <p class="text-slate-500 dark:text-slate-400">${modeText}</p>
        </div>
    `;

    if (categories.length === 0) {
        html += renderNoSchemesMessage();
    } else {
        html += `<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">`;
        categories.forEach(catId => {
            const cat = DataLoader.CATEGORIES[catId];
            if (cat) html += createCategoryCard(catId, cat, grouped[catId].length);
        });
        html += `</div>`;
        html += `
            <div class="text-center mt-10">
                <a href="all-schemes.html" class="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg">
                    ${t('browseSchemes')}
                    <span class="material-symbols-outlined">arrow_forward</span>
                </a>
            </div>
        `;
    }

    container.innerHTML = html;
}

function renderAllSchemes(container) {
    if (CURRENT_CATEGORY) {
        renderCategorySchemes(container, CURRENT_CATEGORY);
        return;
    }

    let schemes = DataLoader.getSchemes({});
    schemes = getFilteredSchemes(schemes);

    const grouped = groupSchemesByCategory(schemes);
    renderCategoryGrid(container, grouped);
}

function renderPopularSchemes(container) {
    if (CURRENT_CATEGORY) {
        renderCategorySchemes(container, CURRENT_CATEGORY, true);
        return;
    }

    let schemes = DataLoader.getSchemes({ popular: true });
    schemes = getFilteredSchemes(schemes);

    const grouped = groupSchemesByCategory(schemes);
    renderCategoryGrid(container, grouped);
}

function renderStateSchemes(container) {
    if (!SELECTED_STATE) {
        container.innerHTML = `
            <div class="max-w-md mx-auto text-center py-12">
                <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span class="material-symbols-outlined text-4xl text-primary">location_on</span>
                </div>
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">${t('selectStateFirst')}</h3>
                <p class="text-slate-500 dark:text-slate-400 mb-6">${t('statePageSubtitle')}</p>
                <div class="relative">
                    <select id="mainStateSelector" data-state-selector onchange="selectState(this.value)" 
                        class="w-full px-5 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-lg font-medium appearance-none cursor-pointer">
                        <option value="">${t('selectState')}</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
            </div>
        `;
        setupAllStateSelectors();
        return;
    }

    if (CURRENT_CATEGORY) {
        renderCategorySchemes(container, CURRENT_CATEGORY, false, true);
        return;
    }

    const stateName = DataLoader.getStateName(SELECTED_STATE, CURRENT_LANG);

    let schemes = DataLoader.getSchemes({ state: SELECTED_STATE, stateOnly: true });
    schemes = getFilteredSchemes(schemes);

    const grouped = groupSchemesByCategory(schemes);

    let html = `
        <div class="bg-gradient-to-r from-primary/5 to-blue-500/5 dark:from-primary/10 dark:to-blue-500/10 rounded-2xl p-6 mb-8 border border-primary/20">
            <div class="flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg">
                        <span class="material-symbols-outlined text-2xl">location_on</span>
                    </div>
                    <div>
                        <p class="text-sm text-primary font-medium">${t('selectedState')}</p>
                        <h3 class="text-2xl font-bold text-slate-900 dark:text-white">${stateName}</h3>
                        <p class="text-sm text-slate-500">${schemes.length} ${t('schemesAvailable')}</p>
                    </div>
                </div>
                <button onclick="clearStateSelection()" class="px-4 py-2 bg-white dark:bg-slate-800 text-primary font-medium rounded-xl border border-primary/30 hover:bg-primary/5 flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">swap_horiz</span>
                    ${t('changeState')}
                </button>
            </div>
        </div>
    `;

    const categoryOrder = Object.keys(DataLoader.CATEGORIES);
    let hasContent = false;

    html += `<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">`;
    categoryOrder.forEach(catId => {
        const categorySchemes = grouped[catId];
        if (!categorySchemes || categorySchemes.length === 0) return;
        hasContent = true;
        const cat = DataLoader.CATEGORIES[catId];
        html += createCategoryCard(catId, cat, categorySchemes.length);
    });
    html += `</div>`;

    if (!hasContent) {
        html += renderNoSchemesMessage();
    }

    container.innerHTML = html;
}

function groupSchemesByCategory(schemes) {
    const grouped = {};
    schemes.forEach(scheme => {
        scheme.categories.forEach(cat => {
            if (!grouped[cat]) grouped[cat] = [];
            if (!grouped[cat].find(s => s.id === scheme.id)) {
                grouped[cat].push(scheme);
            }
        });
    });
    return grouped;
}

function renderCategoryGrid(container, grouped) {
    const categoryOrder = Object.keys(DataLoader.CATEGORIES);
    let html = `<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">`;
    let hasContent = false;

    categoryOrder.forEach(catId => {
        const schemes = grouped[catId];
        if (!schemes || schemes.length === 0) return;
        hasContent = true;
        const cat = DataLoader.CATEGORIES[catId];
        html += createCategoryCard(catId, cat, schemes.length);
    });

    html += `</div>`;

    if (!hasContent) {
        html = renderNoSchemesMessage();
    }

    container.innerHTML = html;
}

function renderNoSchemesMessage() {
    if (ELIGIBILITY_MODE && validateEligibility(USER_PROFILE)) {
        return `
            <div class="text-center py-16">
                <span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">search_off</span>
                <h3 class="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">${t('noEligibleSchemes')}</h3>
                <p class="text-slate-500 dark:text-slate-400 mb-6">${t('tryDifferentFilters')}</p>
                <button onclick="clearEligibilityMode()" class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                    ${t('clearEligibility')}
                </button>
            </div>
        `;
    }
    return `
        <div class="text-center py-16">
            <span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">search_off</span>
            <h3 class="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">${t('noSchemesFound')}</h3>
        </div>
    `;
}

function createCategoryCard(catId, cat, count) {
    const catName = DataLoader.getCategoryName(catId, CURRENT_LANG);
    return `
        <div onclick="openCategory('${catId}')" class="group bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer">
            <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                <span class="material-symbols-outlined text-xl">${cat.icon}</span>
            </div>
            <h3 class="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">${catName}</h3>
            <div class="flex items-center justify-between">
                <span class="text-sm font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">${count} ${t('schemes')}</span>
                <span class="material-symbols-outlined text-primary text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
        </div>
    `;
}

function renderCategorySchemes(container, catId, popularOnly = false, stateOnly = false) {
    const cat = DataLoader.CATEGORIES[catId];
    const catName = DataLoader.getCategoryName(catId, CURRENT_LANG);

    const options = { category: catId };
    if (popularOnly) options.popular = true;
    if (stateOnly && SELECTED_STATE) {
        options.state = SELECTED_STATE;
        options.stateOnly = true;
    }

    let schemes = DataLoader.getSchemes(options);
    schemes = getFilteredSchemes(schemes);

    let html = `
        <div class="mb-6">
            <button onclick="closeCategory()" class="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors mb-4 group">
                <span class="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span class="font-medium">${t('backToCategories')}</span>
            </button>
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <span class="material-symbols-outlined">${cat.icon}</span>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-slate-900 dark:text-white">${catName}</h2>
                    <p class="text-slate-500">${schemes.length} ${t('schemesAvailable')}</p>
                </div>
            </div>
        </div>
    `;

    if (schemes.length === 0) {
        html += renderNoSchemesMessage();
    } else {
        html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">`;
        schemes.forEach(scheme => {
            html += createSchemeCard(scheme);
        });
        html += `</div>`;
    }

    container.innerHTML = html;
}

function createSchemeCard(scheme) {
    const isState = scheme.isStateSpecific;
    const badgeClass = isState
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        : 'bg-primary/10 text-primary';
    const badgeText = isState ? t('stateScheme') : t('centralScheme');
    const desc = scheme.details?.substring(0, 120) || '';

    return `
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group">
            <div class="p-5">
                <h4 class="font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">${scheme.name}</h4>
                <span class="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${badgeClass}">${badgeText}</span>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">${desc}${desc.length >= 120 ? '...' : ''}</p>
                <div class="flex gap-2">
                    <button onclick="openSchemeModal('${scheme.id}')" class="flex-1 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 text-sm flex items-center justify-center gap-1">
                        <span class="material-symbols-outlined text-lg">visibility</span>
                        ${t('viewDetails')}
                    </button>
                    <button onclick="askAIAboutScheme('${scheme.id}')" class="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600" title="${t('askAI')}">
                        <span class="material-symbols-outlined text-primary">smart_toy</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// NAVIGATION & HELPERS
// ==========================================
function openCategory(catId) {
    CURRENT_CATEGORY = catId;
    renderPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeCategory() {
    CURRENT_CATEGORY = null;
    renderPage();
}

function updateNavigation() {
    document.querySelectorAll('[data-page]').forEach(link => {
        const page = link.dataset.page;
        const isActive =
            (CURRENT_PAGE === 'home' && (page === 'index' || page === 'home')) ||
            (CURRENT_PAGE === 'all' && page.includes('all')) ||
            (CURRENT_PAGE === 'popular' && page.includes('popular')) ||
            (CURRENT_PAGE === 'state' && page.includes('state'));

        link.classList.toggle('bg-primary/10', isActive);
        link.classList.toggle('text-primary', isActive);
        link.classList.toggle('font-bold', isActive);
    });
}

function showLoading() {
    const container = document.getElementById('main-content');
    if (container) {
        container.innerHTML = `
            <div class="text-center py-16">
                <div class="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="text-slate-500">${t('loadingSchemes')}</p>
            </div>
        `;
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    document.querySelectorAll('#themeToggle').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && typeof sendChatMessage === 'function') sendChatMessage();
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', initApp);

// Exports
window.changeLanguage = changeLanguage;
window.toggleTheme = toggleTheme;
window.openCategory = openCategory;
window.closeCategory = closeCategory;
window.selectState = selectState;
window.clearStateSelection = clearStateSelection;
window.clearEligibilityMode = clearEligibilityMode;
window.renderPage = renderPage;
window.updateAllUIText = updateAllUIText;
window.setupAllStateSelectors = setupAllStateSelectors;
window.isSchemeEligible = isSchemeEligible;
window.getFilteredSchemes = getFilteredSchemes;
window.updateEligibilityStatusDisplay = updateEligibilityStatusDisplay;
window.validateEligibility = validateEligibility;
