/**
 * API Service - fetch live schemes and news with caching
 */
(function (global) {
    const { API_CONFIG } = global;

    function getCache(key) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (Date.now() - parsed.timestamp < API_CONFIG.cache.duration) return parsed.data;
            return null;
        } catch (e) {
            return null;
        }
    }

    function setCache(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
        } catch (e) {
            /* ignore */
        }
    }

    async function fetchJson(url) {
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error('Network error');
        return res.json();
    }

    async function fetchMySchemeAPI() {
        const cached = getCache(API_CONFIG.cache.keys.schemes);
        if (cached) return { data: cached, fromCache: true };
        try {
            const url = API_CONFIG.corsProxy + API_CONFIG.endpoints.myScheme;
            const data = await fetchJson(url);
            setCache(API_CONFIG.cache.keys.schemes, data);
            API_CONFIG.health.myScheme = true;
            API_CONFIG.health.offline = false;
            return { data, fromCache: false };
        } catch (e) {
            API_CONFIG.health.myScheme = false;
            API_CONFIG.health.offline = true;
            return { data: null, fromCache: false, error: e.message };
        }
    }

    async function fetchPIBNews() {
        const cached = getCache(API_CONFIG.cache.keys.news);
        if (cached) return { data: cached, fromCache: true };
        try {
            const url = API_CONFIG.corsProxy + API_CONFIG.endpoints.pibNews;
            const res = await fetch(url);
            const text = await res.text();
            setCache(API_CONFIG.cache.keys.news, text);
            API_CONFIG.health.pib = true;
            API_CONFIG.health.offline = false;
            return { data: text, fromCache: false };
        } catch (e) {
            API_CONFIG.health.pib = false;
            return { data: null, fromCache: false, error: e.message };
        }
    }

    function mergeSchemes(staticDb, liveData) {
        if (!liveData || !Array.isArray(liveData)) return staticDb;
        const merged = { ...staticDb };
        liveData.forEach(item => {
            if (!item || !item.slug) return;
            const id = item.slug;
            if (!merged[id]) {
                merged[id] = {
                    id,
                    category: item.category || 'documents',
                    link: item.url || '#',
                    stateSpecific: false,
                    names: [item.title || id],
                    content: {
                        en: {
                            name: item.title || id,
                            desc: item.shortDesc || 'Government scheme',
                            eligible: item.eligibility || 'As per guidelines',
                            steps: item.howToApply ? [item.howToApply] : ['Visit official link'],
                            docs: item.documents || ['Aadhaar']
                        }
                    }
                };
            }
        });
        return merged;
    }

    async function loadSchemes(staticDb) {
        const { data } = await fetchMySchemeAPI();
        const merged = mergeSchemes(staticDb, data?.schemes || data);
        return merged;
    }

    global.ApiService = {
        fetchMySchemeAPI,
        fetchPIBNews,
        loadSchemes
    };
})(window);
