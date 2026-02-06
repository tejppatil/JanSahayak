# JanSahayak - Design Document

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
├─────────────┬─────────────────┬─────────────────┬───────────────┤
│  index.html │ all-schemes.html│ popular-schemes │ state-schemes │
│   (Home)    │   (All)         │    (Popular)    │   (State)     │
└──────┬──────┴────────┬────────┴────────┬────────┴───────┬───────┘
       │               │                 │                │
       └───────────────┴────────┬────────┴────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │      shared.js        │
                    │  (Core Logic Layer)   │
                    └───────────┬───────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
    ┌─────▼─────┐       ┌───────▼───────┐     ┌──────▼──────┐
    │ Eligibility│       │   Filtering   │     │ Translation │
    │  Manager  │       │    Engine     │     │   Engine    │
    └─────┬─────┘       └───────┬───────┘     └──────┬──────┘
          │                     │                    │
          └─────────────────────┼────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │     schemes-db.js     │
                    │    (Data Source)      │
                    └───────────────────────┘
```

---

## Data Flow

### 1. Page Load Sequence
```
1. Load HTML structure
2. Load shared.js (initializes globals)
3. Load ai-config.js (languages, translations)
4. Load schemes-db.js (scheme data)
5. Check localStorage for:
   - jansahayak_profile (eligibility)
   - jansahayak_lang (language preference)
   - jansahayak_state (detected/selected state)
6. Apply translations to UI
7. Execute page-specific logic
```

### 2. Eligibility Pipeline
```
┌──────────────┐
│ Raw Schemes  │
│   Database   │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Eligibility      │   USER_PROFILE = { state, age, gender, 
│ Filter           │                    category, income, occupation }
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ State Filter     │   For state-schemes.html only
│ (if applicable)  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Category         │   Group by: farmers, education, health, etc.
│ Grouping         │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Empty Category   │   Remove categories with 0 schemes
│ Removal          │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ UI Rendering     │   Category cards → Expandable scheme lists
└──────────────────┘
```

---

## Page Separation Logic

### index.html (Home)
- Welcome message
- Quick eligibility check prompt
- Navigation to three main pages
- AI chat floating button

### all-schemes.html
```javascript
function getSchemes() {
    return Object.keys(SCHEMES_DB);
}
```
- Gets ALL scheme IDs
- Applies eligibility filter
- Groups by category
- Renders category grid

### popular-schemes.html
```javascript
const POPULAR_IDS = ['ayushman', 'pmkisan', 'ujjwala', ...];
function getSchemes() {
    return POPULAR_IDS.filter(id => SCHEMES_DB[id]);
}
```
- Uses predefined popular list
- Applies eligibility filter
- Groups by category
- Renders category grid

### state-schemes.html
```javascript
function getSchemes() {
    const state = getSelectedState();
    return Object.keys(SCHEMES_DB).filter(id => {
        const s = SCHEMES_DB[id];
        return s.stateSpecific && s.state === state;
    });
}
```
- Gets user's state (detected or selected)
- Filters to state-specific schemes only
- Applies eligibility filter
- Groups by category
- Renders category grid

---

## AI Integration Points

### Entry Points
1. **Floating AI Button** (all pages) → Opens chat modal
2. **"Explain with AI" button** (scheme detail modal)
3. **Chat input** (AI modal)

### Processing Flow
```
User Query
    │
    ▼
┌────────────────────┐
│ Greeting Check     │──► "Hi/Hello" → Return personalized greeting
└────────┬───────────┘    (NO schemes returned)
         │
         ▼
┌────────────────────┐
│ Query Analysis     │──► Extract intent (scheme name, category, question)
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Context Injection  │──► Add USER_PROFILE, CURRENT_LANG, STATE
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Scheme Lookup      │──► Find matching schemes (with eligibility filter)
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Response Format    │──► Format in selected language
└────────────────────┘    using structured template
```

---

## Language Handling Design

### Storage
```javascript
CURRENT_LANG = localStorage.getItem('jansahayak_lang') || 'en';
```

### Translation Function
```javascript
function t(key) {
    return UI_TEXT[CURRENT_LANG]?.[key] 
        || UI_TEXT['en']?.[key] 
        || key;
}
```

### Scheme Content Access
```javascript
function getSchemeContent(scheme) {
    return scheme.content?.[CURRENT_LANG] 
        || scheme.content?.en 
        || { name: 'Unknown', desc: '' };
}
```

### Update Flow
```
Language Change
    │
    ├── Update localStorage
    ├── Update CURRENT_LANG variable
    ├── Re-render navigation labels
    ├── Re-render page title
    ├── Re-render category names
    ├── Re-render buttons
    ├── Re-render AI welcome message
    └── Re-render any visible scheme content
```

---

## State Management

### Global Variables (shared.js)
```javascript
let SCHEMES_DB = {};           // All scheme data
let USER_PROFILE = null;       // Eligibility profile
let CURRENT_LANG = 'en';       // Active language
let DETECTED_STATE = '';       // Geo-detected or selected state
let ELIGIBLE_SCHEME_IDS = [];  // Cached eligible scheme IDs
```

### localStorage Keys
| Key | Purpose |
|-----|---------|
| `jansahayak_profile` | User eligibility data (JSON) |
| `jansahayak_lang` | Selected language code |
| `jansahayak_state` | Selected/detected state |
| `jansahayak_theme` | Dark/light mode preference |

---

## Category Configuration

```javascript
const CATEGORIES = {
    farmers:    { icon: 'agriculture',       color: 'green' },
    education:  { icon: 'school',            color: 'blue' },
    health:     { icon: 'medical_services',  color: 'red' },
    women:      { icon: 'face_3',            color: 'pink' },
    employment: { icon: 'work',              color: 'purple' },
    housing:    { icon: 'home',              color: 'orange' },
    banking:    { icon: 'account_balance',   color: 'indigo' },
    documents:  { icon: 'description',       color: 'slate' },
    elderly:    { icon: 'elderly',           color: 'teal' },
    food:       { icon: 'restaurant',        color: 'yellow' }
};
```

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| No schemes found | Show "No schemes available" message |
| No eligible schemes | Show "No eligible schemes. Update profile?" |
| Translation missing | Fallback to English |
| State not detected | Show state selector dropdown |
| localStorage unavailable | Use session-only variables |
