/**
 * API Configuration - Endpoints and Settings
 * Zero-backend: All APIs use CORS proxy for client-side access
 */

const API_CONFIG = {
    // CORS Proxy for cross-origin requests
    corsProxy: 'https://corsproxy.io/?',
    
    // Government API Endpoints
    endpoints: {
        myScheme: 'https://www.myscheme.gov.in/api/schemes',
        pibNews: 'https://pib.gov.in/allRss.aspx',
        dataGovIn: 'https://api.data.gov.in/resource/',
        nominatim: 'https://nominatim.openstreetmap.org/reverse'
    },
    
    // Scheme Status Tracking URLs (for opening in new tab)
    statusUrls: {
        pmkisan: 'https://pmkisan.gov.in/BeneficiaryStatus.aspx',
        ayushman: 'https://beneficiary.pmjay.gov.in/',
        pmawas: 'https://pmaymis.gov.in/',
        mgnrega: 'https://nrega.nic.in/netnrega/stHome.aspx',
        ration: 'https://nfsa.gov.in/portal/ration_card_state_portals_702',
        jandhan: 'https://pmjdy.gov.in/',
        ujjwala: 'https://www.pmuy.gov.in/',
        scholarship: 'https://scholarships.gov.in/',
        pmvishwakarma: 'https://pmvishwakarma.gov.in/',
        pmfby: 'https://pmfby.gov.in/'
    },
    
    // Cache settings
    cache: {
        duration: 24 * 60 * 60 * 1000, // 24 hours in ms
        keys: {
            schemes: 'kiro_schemes_cache',
            news: 'kiro_news_cache',
            userState: 'kiro_user_state',
            theme: 'kiro_theme',
            trackers: 'kiro_trackers',
            eligibilityData: 'kiro_eligibility_data'
        }
    },
    
    // API Health status
    health: {
        myScheme: false,
        pib: false,
        offline: true
    }
};

// State codes for India
const INDIAN_STATES = {
    'andhra pradesh': { code: 'AP', capital: 'Amaravati', flag: '🏛️' },
    'arunachal pradesh': { code: 'AR', capital: 'Itanagar', flag: '🏔️' },
    'assam': { code: 'AS', capital: 'Dispur', flag: '🌿' },
    'bihar': { code: 'BR', capital: 'Patna', flag: '🏛️' },
    'chhattisgarh': { code: 'CG', capital: 'Raipur', flag: '🌳' },
    'goa': { code: 'GA', capital: 'Panaji', flag: '🏖️' },
    'gujarat': { code: 'GJ', capital: 'Gandhinagar', flag: '🦁' },
    'haryana': { code: 'HR', capital: 'Chandigarh', flag: '🌾' },
    'himachal pradesh': { code: 'HP', capital: 'Shimla', flag: '🏔️' },
    'jharkhand': { code: 'JH', capital: 'Ranchi', flag: '⛏️' },
    'karnataka': { code: 'KA', capital: 'Bengaluru', flag: '🏛️' },
    'kerala': { code: 'KL', capital: 'Thiruvananthapuram', flag: '🥥' },
    'madhya pradesh': { code: 'MP', capital: 'Bhopal', flag: '🐅' },
    'maharashtra': { code: 'MH', capital: 'Mumbai', flag: '🏙️' },
    'manipur': { code: 'MN', capital: 'Imphal', flag: '💃' },
    'meghalaya': { code: 'ML', capital: 'Shillong', flag: '☁️' },
    'mizoram': { code: 'MZ', capital: 'Aizawl', flag: '🌄' },
    'nagaland': { code: 'NL', capital: 'Kohima', flag: '🦅' },
    'odisha': { code: 'OR', capital: 'Bhubaneswar', flag: '🏛️' },
    'punjab': { code: 'PB', capital: 'Chandigarh', flag: '🌾' },
    'rajasthan': { code: 'RJ', capital: 'Jaipur', flag: '🏜️' },
    'sikkim': { code: 'SK', capital: 'Gangtok', flag: '🏔️' },
    'tamil nadu': { code: 'TN', capital: 'Chennai', flag: '🏛️' },
    'telangana': { code: 'TS', capital: 'Hyderabad', flag: '🏰' },
    'tripura': { code: 'TR', capital: 'Agartala', flag: '🌳' },
    'uttar pradesh': { code: 'UP', capital: 'Lucknow', flag: '🏛️' },
    'uttarakhand': { code: 'UK', capital: 'Dehradun', flag: '🏔️' },
    'west bengal': { code: 'WB', capital: 'Kolkata', flag: '🐅' },
    'delhi': { code: 'DL', capital: 'New Delhi', flag: '🏛️' }
};

// Eligibility rule patterns for auto-extraction
const ELIGIBILITY_PATTERNS = {
    income: /(?:income|आय|ఆదాయం).*?(?:below|under|less than|अंतर्गत|కంటే తక్కువ).*?₹?\s*(\d+(?:,\d+)*(?:\s*(?:lakh|lac|लाख))?)/i,
    ageMin: /(?:age|आयु|వయస్సు).*?(?:above|over|minimum|न्यूनतम|కనీసం).*?(\d+)/i,
    ageMax: /(?:age|आयु|వయస్సు).*?(?:below|under|maximum|अधिकतम|గరిష్టం).*?(\d+)/i,
    ageRange: /(?:age|आयु|వయస్సు).*?(\d+).*?(?:to|-|–|से|నుండి).*?(\d+)/i,
    land: /(?:land|जमीन|భూమి).*?(\d+\.?\d*).*?(?:hectare|acre|हेक्टेयर|ఎకరం)/i,
    category: /(?:sc|st|obc|general|bpl|apl|secc|ews|अनुसूचित जाति|అనుసూచిత)/gi,
    gender: /(?:women|महिला|స్త్రీ|female|पुरुष|male)/gi,
    residence: /(?:rural|urban|ग्रामीण|शहरी|గ్రామీణ|పట్టణ)/gi
};

// Category mapping with icons
const CATEGORY_CONFIG = {
    documents: { icon: '📄', keywords: ['document', 'card', 'id', 'कागज', 'పత్రం'] },
    health: { icon: '🏥', keywords: ['health', 'hospital', 'medical', 'स्वास्थ्य', 'ఆరోగ్యం'] },
    housing: { icon: '🏠', keywords: ['house', 'home', 'awas', 'घर', 'ఇల్లు'] },
    employment: { icon: '💼', keywords: ['job', 'work', 'employment', 'skill', 'रोजगार', 'ఉద్యోగం'] },
    banking: { icon: '🏦', keywords: ['bank', 'account', 'loan', 'pension', 'बैंक', 'బ్యాంక్'] },
    agriculture: { icon: '🌾', keywords: ['farmer', 'kisan', 'crop', 'farm', 'किसान', 'రైతు'] },
    education: { icon: '📚', keywords: ['education', 'school', 'scholarship', 'student', 'शिक्षा', 'విద్య'] },
    women: { icon: '👩', keywords: ['women', 'महिला', 'స్త్రీ', 'mother', 'माता'] }
};

console.log('✅ API Config loaded');
