/**
 * NLP Engine - fuzzy matching and intent helpers
 */
(function (global) {
    const SYNONYM_MAP = {
        aadhaar: ['aadhar', 'adhaar', 'uid', 'आधार', 'ஆதார்', 'ఆధార్'],
        pan: ['pancard', 'permanent account number', 'पैन'],
        pmkisan: ['farmer', 'kisan', 'किसान', 'రైతు'],
        ayushman: ['health', 'hospital', 'golden card', 'स्वास्थ्य'],
        ration: ['ration card', 'food', '粮', 'खाद्य'],
        women: ['mahila', 'महिला', 'స్త్రీ']
    };

    function levenshtein(a, b) {
        if (a === b) return 0;
        const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++) dp[i][0] = i;
        for (let j = 0; j <= b.length; j++) dp[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + cost
                );
            }
        }
        return dp[a.length][b.length];
    }

    function normalize(text) {
        return (text || '').toLowerCase().trim();
    }

    function fuzzyFindScheme(query, schemes) {
        const q = normalize(query);
        let best = { id: null, distance: Infinity };
        Object.entries(schemes || {}).forEach(([id, scheme]) => {
            (scheme.names || []).forEach(name => {
                const d = levenshtein(q, normalize(name));
                if (d < best.distance) best = { id, distance: d };
            });
        });
        return best.distance <= 2 ? best.id : null;
    }

    function expandSynonyms(query) {
        const tokens = query.split(/\s+/);
        const expanded = new Set(tokens);
        tokens.forEach(tok => {
            Object.entries(SYNONYM_MAP).forEach(([key, arr]) => {
                if (arr.some(s => normalize(tok) === normalize(s))) {
                    expanded.add(key);
                }
            });
        });
        return Array.from(expanded).join(' ');
    }

    function inferIntent(query) {
        const q = normalize(query);
        if (/status|track|payment|भुगतान|status check/.test(q)) return 'status';
        if (/eligib|योग्यता|eligible/.test(q)) return 'eligibility';
        if (/document|doc|कागज|पात्र|papers/.test(q)) return 'documents';
        if (/apply|process|कैसे|how/.test(q)) return 'apply';
        return 'generic';
    }

    global.NlpEngine = {
        levenshtein,
        fuzzyFindScheme,
        expandSynonyms,
        inferIntent
    };
})(window);
