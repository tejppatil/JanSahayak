// ==========================================
// DATA-LOADER.JS - CSV Parser and Data Manager
// Single Source of Truth for All Schemes
// ==========================================

let RAW_SCHEMES = [];
let SCHEMES_BY_CATEGORY = {};
let ALL_CATEGORIES = new Set();
let ALL_STATES = new Set();

// Category mapping
const CATEGORY_MAP = {
    'education': 'education',
    'education & learning': 'education',
    'health': 'health',
    'health & wellness': 'health',
    'agriculture': 'agriculture',
    'agriculture,rural & environment': 'agriculture',
    'agriculture, rural & environment': 'agriculture',
    'women and child': 'women',
    'women & child': 'women',
    'women & child development': 'women',
    'social welfare': 'social',
    'social welfare & empowerment': 'social',
    'business': 'business',
    'business & entrepreneurship': 'business',
    'msme': 'business',
    'skills & employment': 'employment',
    'employment': 'employment',
    'skill development': 'employment',
    'banking': 'banking',
    'banking & insurance': 'banking',
    'banking, financial services and insurance': 'banking',
    'housing': 'housing',
    'housing & shelter': 'housing',
    'utility & sanitation': 'utilities',
    'utilities': 'utilities',
    'transport': 'transport',
    'transport & infrastructure': 'transport',
    'science, it & communications': 'technology',
    'sports & culture': 'sports',
    'public safety, law & justice': 'legal',
    'travel & tourism': 'tourism'
};

// Canonical categories with metadata and translations
const CATEGORIES = {
    education: {
        icon: 'school',
        color: 'blue',
        names: { en: 'Education', hi: 'शिक्षा', mr: 'शिक्षण', gu: 'શિક્ષણ', kn: 'ಶಿಕ್ಷಣ', ml: 'വിദ്യാഭ്യാസം', pa: 'ਸਿੱਖਿਆ', ur: 'تعلیم', te: 'విద్య', ta: 'கல்வி', bn: 'শিক্ষা' }
    },
    health: {
        icon: 'health_and_safety',
        color: 'rose',
        names: { en: 'Health', hi: 'स्वास्थ्य', mr: 'आरोग्य', gu: 'આરોગ્ય', kn: 'ಆರೋಗ್ಯ', ml: 'ആരോഗ്യം', pa: 'ਸਿਹਤ', ur: 'صحت', te: 'ఆరోగ్యం', ta: 'சுகாதாரம்', bn: 'স্বাস্থ্য' }
    },
    agriculture: {
        icon: 'agriculture',
        color: 'emerald',
        names: { en: 'Agriculture', hi: 'कृषि', mr: 'शेती', gu: 'ખેતી', kn: 'ಕೃಷಿ', ml: 'കൃഷി', pa: 'ਖੇਤੀ', ur: 'زراعت', te: 'వ్యవసాయం', ta: 'விவசாயம்', bn: 'কৃষি' }
    },
    women: {
        icon: 'female',
        color: 'pink',
        names: { en: 'Women & Child', hi: 'महिला और बाल', mr: 'महिला व बालक', gu: 'મહિલા અને બાળ', kn: 'ಮಹಿಳೆ ಮತ್ತು ಮಕ್ಕಳು', ml: 'സ്ത്രീകളും കുട്ടികളും', pa: 'ਔਰਤਾਂ ਅਤੇ ਬੱਚੇ', ur: 'خواتین اور بچے', te: 'మహిళలు మరియు పిల్లలు', ta: 'பெண்கள் மற்றும் குழந்தைகள்', bn: 'মহিলা ও শিশু' }
    },
    social: {
        icon: 'diversity_3',
        color: 'purple',
        names: { en: 'Social Welfare', hi: 'सामाजिक कल्याण', mr: 'सामाजिक कल्याण', gu: 'સામાજિક કલ્યાણ', kn: 'ಸಾಮಾಜಿಕ ಕಲ್ಯಾಣ', ml: 'സാമൂഹിക ക്ഷേമം', pa: 'ਸਮਾਜਿਕ ਭਲਾਈ', ur: 'سماجی بہبود', te: 'సామాజిక సంక్షేమం', ta: 'சமூக நலன்', bn: 'সামাজিক কল্যাণ' }
    },
    business: {
        icon: 'storefront',
        color: 'amber',
        names: { en: 'Business', hi: 'व्यापार', mr: 'व्यवसाय', gu: 'વ્યાપાર', kn: 'ವ್ಯಾಪಾರ', ml: 'ബിസിനസ്സ്', pa: 'ਕਾਰੋਬਾਰ', ur: 'کاروبار', te: 'వ్యాపారం', ta: 'வணிகம்', bn: 'ব্যবসা' }
    },
    employment: {
        icon: 'work',
        color: 'orange',
        names: { en: 'Skills & Employment', hi: 'कौशल और रोज़गार', mr: 'कौशल्य आणि रोजगार', gu: 'કૌશલ્ય અને રોજગાર', kn: 'ಕೌಶಲ್ಯ ಮತ್ತು ಉದ್ಯೋಗ', ml: 'നൈപുണ്യവും തൊഴിലും', pa: 'ਹੁਨਰ ਅਤੇ ਰੁਜ਼ਗਾਰ', ur: 'ہنر اور روزگار', te: 'నైపుణ్యాలు మరియు ఉద్యోగం', ta: 'திறன்கள் மற்றும் வேலை', bn: 'দক্ষতা ও কর্মসংস্থান' }
    },
    banking: {
        icon: 'account_balance',
        color: 'indigo',
        names: { en: 'Banking & Insurance', hi: 'बैंकिंग और बीमा', mr: 'बँकिंग आणि विमा', gu: 'બેંકિંગ અને વીમો', kn: 'ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ವಿಮೆ', ml: 'ബാങ്കിംഗും ഇൻഷുറൻസും', pa: 'ਬੈਂਕਿੰਗ ਅਤੇ ਬੀਮਾ', ur: 'بینکنگ اور انشورنس', te: 'బ్యాంకింగ్ మరియు బీమా', ta: 'வங்கி மற்றும் காப்பீடு', bn: 'ব্যাংকিং ও বীমা' }
    },
    housing: {
        icon: 'home',
        color: 'teal',
        names: { en: 'Housing', hi: 'आवास', mr: 'गृहनिर्माण', gu: 'આવાસ', kn: 'ವಸತಿ', ml: 'ഭവനം', pa: 'ਮਕਾਨ', ur: 'رہائش', te: 'గృహం', ta: 'வீட்டுவசதி', bn: 'আবাসন' }
    },
    utilities: {
        icon: 'water_drop',
        color: 'cyan',
        names: { en: 'Utilities', hi: 'उपयोगिताएँ', mr: 'उपयोगिता', gu: 'ઉપયોગિતાઓ', kn: 'ಉಪಯುಕ್ತತೆಗಳು', ml: 'യൂട്ടിലിറ്റികൾ', pa: 'ਸਹੂਲਤਾਂ', ur: 'سہولیات', te: 'యుటిలిటీలు', ta: 'பயன்பாடுகள்', bn: 'ইউটিলিটি' }
    },
    transport: {
        icon: 'directions_bus',
        color: 'slate',
        names: { en: 'Transport', hi: 'परिवहन', mr: 'वाहतूक', gu: 'પરિવહન', kn: 'ಸಾರಿಗೆ', ml: 'ഗതാഗതം', pa: 'ਆਵਾਜਾਈ', ur: 'نقل و حمل', te: 'రవాణా', ta: 'போக்குவரத்து', bn: 'পরিবহন' }
    },
    technology: {
        icon: 'computer',
        color: 'violet',
        names: { en: 'Technology', hi: 'प्रौद्योगिकी', mr: 'तंत्रज्ञान', gu: 'ટેકનોલોજી', kn: 'ತಂತ್ರಜ್ಞಾನ', ml: 'സാങ്കേതികവിദ്യ', pa: 'ਤਕਨਾਲੋਜੀ', ur: 'ٹیکنالوجی', te: 'సాంకేతికత', ta: 'தொழில்நுட்பம்', bn: 'প্রযুক্তি' }
    },
    sports: {
        icon: 'sports_soccer',
        color: 'lime',
        names: { en: 'Sports & Culture', hi: 'खेल और संस्कृति', mr: 'क्रीडा आणि संस्कृती', gu: 'રમતગમત અને સંસ્કૃતિ', kn: 'ಕ್ರೀಡೆ ಮತ್ತು ಸಂಸ್ಕೃತಿ', ml: 'കായികവും സംസ്കാരവും', pa: 'ਖੇਡਾਂ ਅਤੇ ਸੱਭਿਆਚਾਰ', ur: 'کھیل اور ثقافت', te: 'క్రీడలు మరియు సంస్కృతి', ta: 'விளையாட்டு மற்றும் கலாச்சாரம்', bn: 'খেলা ও সংস্কৃতি' }
    },
    legal: {
        icon: 'gavel',
        color: 'red',
        names: { en: 'Legal & Justice', hi: 'कानूनी और न्याय', mr: 'कायदेशीर आणि न्याय', gu: 'કાનૂની અને ન્યાય', kn: 'ಕಾನೂನು ಮತ್ತು ನ್ಯಾಯ', ml: 'നിയമവും നീതിയും', pa: 'ਕਾਨੂੰਨੀ ਅਤੇ ਨਿਆਂ', ur: 'قانون اور انصاف', te: 'చట్టం మరియు న్యాయం', ta: 'சட்டம் மற்றும் நீதி', bn: 'আইন ও বিচার' }
    },
    tourism: {
        icon: 'flight_takeoff',
        color: 'sky',
        names: { en: 'Tourism', hi: 'पर्यटन', mr: 'पर्यटन', gu: 'પર્યટન', kn: 'ಪ್ರವಾಸೋದ್ಯಮ', ml: 'ടൂറിസം', pa: 'ਸੈਰ-ਸਪਾਟਾ', ur: 'سیاحت', te: 'పర్యాటకం', ta: 'சுற்றுலா', bn: 'পর্যটন' }
    }
};

// Complete list of Indian States and UTs with translations
const INDIAN_STATES = {
    'andhra pradesh': { en: 'Andhra Pradesh', hi: 'आंध्र प्रदेश', code: 'AP' },
    'arunachal pradesh': { en: 'Arunachal Pradesh', hi: 'अरुणाचल प्रदेश', code: 'AR' },
    'assam': { en: 'Assam', hi: 'असम', code: 'AS' },
    'bihar': { en: 'Bihar', hi: 'बिहार', code: 'BR' },
    'chhattisgarh': { en: 'Chhattisgarh', hi: 'छत्तीसगढ़', code: 'CG' },
    'goa': { en: 'Goa', hi: 'गोवा', code: 'GA' },
    'gujarat': { en: 'Gujarat', hi: 'गुजरात', code: 'GJ' },
    'haryana': { en: 'Haryana', hi: 'हरियाणा', code: 'HR' },
    'himachal pradesh': { en: 'Himachal Pradesh', hi: 'हिमाचल प्रदेश', code: 'HP' },
    'jharkhand': { en: 'Jharkhand', hi: 'झारखंड', code: 'JH' },
    'karnataka': { en: 'Karnataka', hi: 'कर्नाटक', code: 'KA' },
    'kerala': { en: 'Kerala', hi: 'केरल', code: 'KL' },
    'madhya pradesh': { en: 'Madhya Pradesh', hi: 'मध्य प्रदेश', code: 'MP' },
    'maharashtra': { en: 'Maharashtra', hi: 'महाराष्ट्र', code: 'MH' },
    'manipur': { en: 'Manipur', hi: 'मणिपुर', code: 'MN' },
    'meghalaya': { en: 'Meghalaya', hi: 'मेघालय', code: 'ML' },
    'mizoram': { en: 'Mizoram', hi: 'मिज़ोरम', code: 'MZ' },
    'nagaland': { en: 'Nagaland', hi: 'नागालैंड', code: 'NL' },
    'odisha': { en: 'Odisha', hi: 'ओडिशा', code: 'OD' },
    'punjab': { en: 'Punjab', hi: 'पंजाब', code: 'PB' },
    'rajasthan': { en: 'Rajasthan', hi: 'राजस्थान', code: 'RJ' },
    'sikkim': { en: 'Sikkim', hi: 'सिक्किम', code: 'SK' },
    'tamil nadu': { en: 'Tamil Nadu', hi: 'तमिलनाडु', code: 'TN' },
    'telangana': { en: 'Telangana', hi: 'तेलंगाना', code: 'TS' },
    'tripura': { en: 'Tripura', hi: 'त्रिपुरा', code: 'TR' },
    'uttar pradesh': { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश', code: 'UP' },
    'uttarakhand': { en: 'Uttarakhand', hi: 'उत्तराखंड', code: 'UK' },
    'west bengal': { en: 'West Bengal', hi: 'पश्चिम बंगाल', code: 'WB' },
    'andaman and nicobar': { en: 'Andaman & Nicobar', hi: 'अंडमान और निकोबार', code: 'AN' },
    'chandigarh': { en: 'Chandigarh', hi: 'चंडीगढ़', code: 'CH' },
    'dadra and nagar haveli': { en: 'Dadra & Nagar Haveli', hi: 'दादरा और नगर हवेली', code: 'DN' },
    'daman and diu': { en: 'Daman & Diu', hi: 'दमन और दीव', code: 'DD' },
    'delhi': { en: 'Delhi', hi: 'दिल्ली', code: 'DL' },
    'jammu and kashmir': { en: 'Jammu & Kashmir', hi: 'जम्मू और कश्मीर', code: 'JK' },
    'ladakh': { en: 'Ladakh', hi: 'लद्दाख', code: 'LA' },
    'lakshadweep': { en: 'Lakshadweep', hi: 'लक्षद्वीप', code: 'LD' },
    'puducherry': { en: 'Puducherry', hi: 'पुडुचेरी', code: 'PY' }
};

// Parse CSV row handling quoted fields
function parseCSVRow(row) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
            if (inQuotes && row[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

// Clean text from CSV
function cleanText(text) {
    if (!text) return '';
    return text.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
}

// Normalize category
function normalizeCategory(csvCategory) {
    if (!csvCategory) return ['social'];
    const catLower = csvCategory.toLowerCase().trim();

    for (const [key, value] of Object.entries(CATEGORY_MAP)) {
        if (catLower.includes(key) || key.includes(catLower)) {
            return [value];
        }
    }
    return ['social'];
}

// Extract state from scheme
function extractState(scheme) {
    const text = (scheme.name + ' ' + scheme.details).toLowerCase();
    for (const state of Object.keys(INDIAN_STATES)) {
        if (text.includes(state)) return state;
    }
    return null;
}

// Cache settings
const CACHE_KEY = 'jansahayak_schemes_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Check if cache is valid
function getCachedSchemes() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { timestamp, schemes, categories, states } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_DURATION) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
        return { schemes, categories, states };
    } catch (e) {
        return null;
    }
}

// Save to cache - only essential fields to stay under 5MB localStorage limit
function cacheSchemes() {
    try {
        // Create minimal scheme objects for cache
        const minimalSchemes = RAW_SCHEMES.map(s => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            details: (s.details || '').substring(0, 200),
            benefits: (s.benefits || '').substring(0, 200),
            eligibility: (s.eligibility || '').substring(0, 300),
            application: (s.application || '').substring(0, 200),
            documents: (s.documents || '').substring(0, 200),
            level: s.level,
            categories: s.categories,
            isStateSpecific: s.isStateSpecific,
            state: s.state,
            isPopular: s.isPopular
        }));

        const data = {
            timestamp: Date.now(),
            schemes: minimalSchemes,
            categories: Array.from(ALL_CATEGORIES),
            states: Array.from(ALL_STATES)
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        console.log('💾 Cached', minimalSchemes.length, 'schemes');
    } catch (e) {
        // Quota exceeded - clear old cache and skip caching
        console.warn('Cache storage failed:', e.name);
        localStorage.removeItem(CACHE_KEY);
    }
}

// Load schemes from CSV
async function loadSchemesFromCSV() {
    // Try cache first for instant load
    const cached = getCachedSchemes();
    if (cached) {
        RAW_SCHEMES = cached.schemes;
        cached.categories.forEach(c => ALL_CATEGORIES.add(c));
        cached.states.forEach(s => ALL_STATES.add(s));

        // Rebuild category index
        SCHEMES_BY_CATEGORY = {};
        RAW_SCHEMES.forEach(scheme => {
            scheme.categories.forEach(cat => {
                if (!SCHEMES_BY_CATEGORY[cat]) SCHEMES_BY_CATEGORY[cat] = [];
                SCHEMES_BY_CATEGORY[cat].push(scheme);
            });
        });

        console.log(`⚡ Loaded ${RAW_SCHEMES.length} schemes from cache`);
        return true;
    }

    // Parse CSV if no cache
    try {
        console.log('📥 Loading schemes from CSV...');
        const response = await fetch('updated_data.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(line => line.trim());

        RAW_SCHEMES = [];
        SCHEMES_BY_CATEGORY = {};
        ALL_CATEGORIES.clear();
        ALL_STATES.clear();

        for (let i = 1; i < lines.length; i++) {
            try {
                const values = parseCSVRow(lines[i]);
                if (values.length < 8) continue;

                const scheme = {
                    id: values[1] || `scheme_${i}`,
                    name: cleanText(values[0]),
                    slug: values[1] || '',
                    details: cleanText(values[2]),
                    benefits: cleanText(values[3]),
                    eligibility: cleanText(values[4]),
                    application: cleanText(values[5]),
                    documents: cleanText(values[6]),
                    level: values[7] || 'Central',
                    csvCategory: values[8] || '',
                    tags: values[10] || '',
                    categories: normalizeCategory(values[8]),
                    isStateSpecific: (values[7] || '').toLowerCase() === 'state',
                    state: null,
                    isPopular: false
                };

                if (scheme.isStateSpecific) {
                    scheme.state = extractState(scheme);
                    if (scheme.state) ALL_STATES.add(scheme.state);
                }

                scheme.categories.forEach(cat => {
                    ALL_CATEGORIES.add(cat);
                    if (!SCHEMES_BY_CATEGORY[cat]) SCHEMES_BY_CATEGORY[cat] = [];
                    SCHEMES_BY_CATEGORY[cat].push(scheme);
                });

                RAW_SCHEMES.push(scheme);
            } catch (e) {
                console.warn(`Error parsing row ${i}:`, e);
            }
        }

        // Mark popular schemes
        const popularKeywords = ['pradhan mantri', 'pm ', 'ayushman', 'kisan', 'ujjwala', 'jan dhan', 'mudra', 'atal', 'swachh', 'beti', 'sukanya', 'awas', 'scholarship', 'mgnrega', 'nrega'];
        RAW_SCHEMES.forEach(scheme => {
            const nameLower = scheme.name.toLowerCase();
            if (popularKeywords.some(kw => nameLower.includes(kw))) {
                scheme.isPopular = true;
            }
        });

        // Ensure at least 30 popular schemes
        const popularCount = RAW_SCHEMES.filter(s => s.isPopular).length;
        if (popularCount < 30) {
            for (let i = 0; i < Math.min(50, RAW_SCHEMES.length) && RAW_SCHEMES.filter(s => s.isPopular).length < 30; i++) {
                RAW_SCHEMES[i].isPopular = true;
            }
        }

        // Cache for next time
        cacheSchemes();

        console.log(`✅ Loaded ${RAW_SCHEMES.length} schemes. Categories: ${ALL_CATEGORIES.size}, States: ${ALL_STATES.size}`);
        return true;
    } catch (error) {
        console.error('Error loading CSV:', error);
        return false;
    }
}

// Get schemes with filters
function getSchemes(options = {}) {
    const { category, state, popular, stateOnly, limit } = options;
    let schemes = [...RAW_SCHEMES];

    if (category) {
        schemes = schemes.filter(s => s.categories.includes(category));
    }

    // STRICT STATE FILTER for State Schemes page
    if (stateOnly && state) {
        // ONLY show state-specific schemes for selected state
        // EXCLUDE all central schemes and schemes from other states
        const stateLower = state.toLowerCase();
        schemes = schemes.filter(s => {
            // Must be state-specific AND match the selected state exactly
            return s.isStateSpecific && s.state === stateLower;
        });
        console.log(`📍 State-only filter: ${state} → ${schemes.length} schemes`);
    } else if (state) {
        // For other pages: show central + selected state schemes
        const stateLower = state.toLowerCase();
        schemes = schemes.filter(s => !s.isStateSpecific || s.state === stateLower);
    }

    if (popular) {
        schemes = schemes.filter(s => s.isPopular);
    }

    if (limit) {
        schemes = schemes.slice(0, limit);
    }

    return schemes;
}

// Group by category
function getSchemesByCategory(options = {}) {
    const schemes = getSchemes(options);
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

// ==========================================
// COMPREHENSIVE SCHEME ALIASES & KEYWORDS
// ==========================================
const SCHEME_ALIASES = {
    // MGNREGA - CRITICAL (with Hindi)
    'mgnrega': ['mgnrega', 'nrega', 'mahatma gandhi', 'rural employment', 'mnrega', 'mgnrga', 'manrega', '100 days', 'rozgar guarantee', 'employment guarantee'],
    'mgnregs': ['mgnrega', 'nrega', 'employment guarantee'],
    'nrega': ['mgnrega', 'nrega', 'mahatma gandhi'],
    'manrega': ['mgnrega', 'nrega'], // common typo
    'mnrega': ['mgnrega', 'nrega'], // common typo
    'मनरेगा': ['mgnrega', 'nrega', 'mahatma gandhi'], // Hindi
    'नरेगा': ['mgnrega', 'nrega'], // Hindi

    // PM Kisan
    'pm kisan': ['pm kisan', 'pmkisan', 'pm-kisan', 'kisan samman', 'kisan nidhi', 'farmer income'],
    'pmkisan': ['pm kisan', 'pmkisan', 'kisan samman'],
    'kisan': ['pm kisan', 'kisan', 'farmer', 'krishi', 'agriculture'],
    'kisan yojna': ['pm kisan', 'kisan'],
    'kisan yojana': ['pm kisan', 'kisan'],
    'किसान': ['pm kisan', 'kisan', 'farmer'], // Hindi
    'पीएम किसान': ['pm kisan', 'pmkisan'], // Hindi

    // Ayushman Bharat
    'ayushman': ['ayushman', 'ayushman bharat', 'pmjay', 'jan arogya', 'health insurance'],
    'ayushman bharat': ['ayushman bharat', 'pmjay', 'jan arogya'],
    'pmjay': ['ayushman', 'pmjay', 'jan arogya'],
    'jan arogya': ['ayushman', 'pmjay', 'jan arogya'],
    'आयुष्मान': ['ayushman', 'ayushman bharat', 'pmjay'], // Hindi
    'आयुष्मान भारत': ['ayushman bharat', 'pmjay'], // Hindi

    // PM Awas Yojana
    'pm awas': ['pm awas', 'pmay', 'awas yojana', 'housing', 'gramin awas', 'urban awas'],
    'pmay': ['pm awas', 'pmay', 'awas yojana'],
    'awas': ['pm awas', 'awas', 'housing', 'gramin'],
    'housing': ['pm awas', 'awas', 'housing', 'shelter'],
    'आवास': ['pm awas', 'awas', 'housing'], // Hindi

    // Ujjwala
    'ujjwala': ['ujjwala', 'lpg', 'gas cylinder', 'cooking gas', 'pradhan mantri ujjwala'],
    'lpg': ['ujjwala', 'lpg', 'gas'],
    'उज्ज्वला': ['ujjwala', 'lpg', 'gas'], // Hindi

    // Jan Dhan
    'jan dhan': ['jan dhan', 'pmjdy', 'bank account', 'zero balance'],
    'pmjdy': ['jan dhan', 'pmjdy'],
    'जन धन': ['jan dhan', 'pmjdy'], // Hindi

    // Mudra
    'mudra': ['mudra', 'pmmy', 'mudra loan', 'shishu', 'kishor', 'tarun'],
    'pmmy': ['mudra', 'pmmy'],
    'मुद्रा': ['mudra', 'pmmy', 'loan'], // Hindi

    // Scholarships
    'scholarship': ['scholarship', 'vidyarthi', 'student', 'education', 'stipend', 'merit'],
    'student': ['scholarship', 'student', 'education'],
    'छात्रवृत्ति': ['scholarship', 'student', 'education'], // Hindi

    // Women schemes
    'women': ['women', 'mahila', 'beti', 'stree', 'nari', 'sukanya', 'maternity', 'lady', 'female'],
    'mahila': ['women', 'mahila', 'lady', 'female'],
    'beti': ['beti bachao', 'sukanya', 'girl child', 'beti padhao'],
    'sukanya': ['sukanya samriddhi', 'girl child', 'sukanya'],
    'महिला': ['women', 'mahila', 'lady', 'female'], // Hindi
    'बेटी': ['beti bachao', 'sukanya', 'girl'], // Hindi

    // Pension
    'pension': ['pension', 'vridha', 'old age', 'senior citizen', 'atal pension'],
    'atal pension': ['atal pension', 'apy', 'pension'],
    'apy': ['atal pension', 'apy'],
    'पेंशन': ['pension', 'vridha', 'old age'], // Hindi
    'वृद्धा पेंशन': ['pension', 'vridha', 'old age'], // Hindi

    // Labour schemes
    'labour': ['labour', 'shramik', 'worker', 'eshram', 'unorganized'],
    'shramik': ['shramik', 'labour', 'worker'],
    'eshram': ['eshram', 'e-shram', 'shramik', 'unorganized'],
    'worker': ['worker', 'labour', 'shramik'],
    'श्रमिक': ['shramik', 'labour', 'worker'], // Hindi
    'मजदूर': ['labour', 'worker', 'shramik'], // Hindi

    // Ration
    'ration': ['ration', 'pds', 'food security', 'annapurna', 'antodaya'],
    'pds': ['ration', 'pds', 'public distribution'],
    'राशन': ['ration', 'pds', 'food'], // Hindi

    // Swachh Bharat
    'swachh bharat': ['swachh bharat', 'toilet', 'sanitation', 'sbm'],
    'toilet': ['swachh bharat', 'toilet', 'sanitation'],
    'स्वच्छ भारत': ['swachh bharat', 'toilet', 'sanitation'], // Hindi

    // Skill development
    'skill': ['skill india', 'pmkvy', 'skill development', 'training'],
    'pmkvy': ['pmkvy', 'skill india', 'kaushal vikas'],
    'कौशल': ['skill india', 'pmkvy', 'training'], // Hindi

    // Insurance
    'insurance': ['insurance', 'bima', 'jeevan jyoti', 'suraksha bima'],
    'bima': ['insurance', 'bima'],
    'बीमा': ['insurance', 'bima'] // Hindi
};

// Category keywords for category-based queries
const CATEGORY_KEYWORDS = {
    'agriculture': ['kisan', 'farmer', 'krishi', 'agriculture', 'farming', 'crop', 'fasal', 'किसान', 'खेती'],
    'education': ['scholarship', 'student', 'education', 'school', 'college', 'vidyarthi', 'शिक्षा', 'छात्रवृत्ति'],
    'health': ['health', 'ayushman', 'medical', 'hospital', 'swasthya', 'doctor', 'स्वास्थ्य', 'चिकित्सा'],
    'women': ['women', 'mahila', 'lady', 'girl', 'beti', 'stree', 'nari', 'महिला', 'बेटी', 'female'],
    'social': ['pension', 'senior', 'widow', 'disability', 'divyang', 'vridha', 'पेंशन'],
    'housing': ['housing', 'awas', 'home', 'house', 'shelter', 'आवास', 'घर'],
    'employment': ['job', 'employment', 'rozgar', 'skill', 'labour', 'worker', 'mgnrega', 'nrega', 'रोजगार'],
    'banking': ['loan', 'mudra', 'bank', 'credit', 'finance', 'jan dhan', 'बैंक'],
    'utilities': ['ration', 'gas', 'lpg', 'ujjwala', 'electricity', 'water', 'toilet']
};

// Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            matrix[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
                ? matrix[i - 1][j - 1]
                : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
        }
    }
    return matrix[b.length][a.length];
}

// Fuzzy match scheme name
function fuzzyMatchScheme(query, schemes) {
    const q = query.toLowerCase().trim();
    let bestMatch = null;
    let bestScore = Infinity;

    for (const scheme of schemes) {
        const name = scheme.name.toLowerCase();
        const dist = levenshtein(q, name.split(' ')[0]); // Compare first word
        if (dist < bestScore && dist <= 2) { // Max 2 character difference
            bestScore = dist;
            bestMatch = scheme;
        }

        // Also check if query is substring
        if (name.includes(q) || q.includes(name.split(' ')[0])) {
            return scheme;
        }
    }
    return bestMatch;
}

// Search schemes with improved matching
function searchSchemes(query, options = {}) {
    if (!query || query.length < 2) return [];

    const q = query.toLowerCase().replace(/[-_]/g, ' ').trim();
    const words = q.split(/\s+/);

    // Get base schemes with state filter applied
    let schemes = getSchemes(options);

    // Apply selected state filter from global context
    const selectedState = window.SELECTED_STATE || localStorage.getItem('jansahayak_state');
    if (selectedState && !options.ignoreState) {
        const stateLower = selectedState.toLowerCase();
        schemes = schemes.filter(s => !s.isStateSpecific || s.state === stateLower);
    }

    // ========== STEP 1: Check scheme aliases for exact match ==========
    let expandedTerms = [q, ...words];

    // Check if query matches any known alias
    for (const [alias, expansions] of Object.entries(SCHEME_ALIASES)) {
        if (q.includes(alias) || alias.includes(q) || levenshtein(q, alias) <= 2) {
            expandedTerms = [...expandedTerms, ...expansions];
        }
    }

    // Check individual words
    words.forEach(word => {
        if (word.length >= 3) {
            for (const [alias, expansions] of Object.entries(SCHEME_ALIASES)) {
                if (alias.includes(word) || word.includes(alias) || levenshtein(word, alias) <= 1) {
                    expandedTerms = [...expandedTerms, ...expansions];
                }
            }
        }
    });

    expandedTerms = [...new Set(expandedTerms)]; // Dedupe

    // ========== STEP 2: Score-based matching ==========
    const scored = schemes.map(scheme => {
        const searchText = `${scheme.name} ${scheme.details || ''} ${scheme.tags || ''} ${scheme.csvCategory || ''}`
            .toLowerCase().replace(/[-_]/g, ' ');

        let score = 0;

        // Exact name match (highest priority)
        if (scheme.name.toLowerCase().includes(q)) score += 100;

        // Fuzzy name match
        const nameDist = levenshtein(q, scheme.name.toLowerCase().split(' ')[0]);
        if (nameDist <= 2) score += (50 - nameDist * 10);

        // Check expanded terms
        expandedTerms.forEach(term => {
            if (searchText.includes(term)) score += 15;
            if (scheme.name.toLowerCase().includes(term)) score += 30;
        });

        // Word-by-word matching
        words.forEach(word => {
            if (word.length >= 3 && searchText.includes(word)) score += 5;
        });

        return { scheme, score };
    }).filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, options.limit || 10)
        .map(item => item.scheme);

    // ========== STEP 3: Fuzzy fallback if no results ==========
    if (scored.length === 0) {
        const fuzzyMatch = fuzzyMatchScheme(query, schemes);
        if (fuzzyMatch) return [fuzzyMatch];
    }

    return scored;
}

// Get schemes by category keyword
function getSchemesByKeyword(keyword, limit = 5) {
    const kw = keyword.toLowerCase();
    let category = null;

    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(k => kw.includes(k) || k.includes(kw))) {
            category = cat;
            break;
        }
    }

    if (category) {
        return getSchemes({ category, limit });
    }
    return [];
}

// Get scheme by ID
function getSchemeById(id) {
    return RAW_SCHEMES.find(s => s.id === id || s.slug === id);
}

// Get state name in current language
function getStateName(stateKey, lang = 'en') {
    const state = INDIAN_STATES[stateKey];
    if (!state) return stateKey;
    return state[lang] || state.en || stateKey;
}

// Get category name in current language
function getCategoryName(catId, lang = 'en') {
    const cat = CATEGORIES[catId];
    if (!cat) return catId;
    return cat.names?.[lang] || cat.names?.en || catId;
}

// Get all states sorted
function getAllStatesSorted() {
    return Object.keys(INDIAN_STATES).sort((a, b) => {
        return INDIAN_STATES[a].en.localeCompare(INDIAN_STATES[b].en);
    });
}

// Get all schemes
function getAllSchemes() {
    return RAW_SCHEMES;
}

// Export
window.DataLoader = {
    loadSchemesFromCSV,
    getSchemes,
    getSchemesByCategory,
    getSchemesByKeyword,
    searchSchemes,
    getSchemeById,
    getStateName,
    getCategoryName,
    getAllStatesSorted,
    getAllSchemes,
    CATEGORIES,
    CATEGORY_KEYWORDS,
    SCHEME_ALIASES,
    INDIAN_STATES,
    get RAW_SCHEMES() { return RAW_SCHEMES; },
    get ALL_CATEGORIES() { return ALL_CATEGORIES; },
    get ALL_STATES() { return ALL_STATES; }
};
