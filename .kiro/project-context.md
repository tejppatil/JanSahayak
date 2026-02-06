# JanSahayak - Project Context

## Project Overview

**JanSahayak** (meaning "People's Helper" in Hindi) is a multilingual AI-powered web application that helps Indian citizens discover and access government schemes. The platform provides eligibility-based filtering, AI-driven guidance, and support for 11 Indian languages.

## Technology Stack

- **Frontend:** Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Tailwind CSS (CDN)
- **Icons:** Google Material Symbols
- **Data:** CSV-based scheme database
- **Storage:** localStorage for client-side persistence
- **Architecture:** Single-page application (SPA)

## Project Structure

```
JanSahayak/
├── index.html              # Main SPA with all views
├── app.js                  # Core application logic (1000+ lines)
├── data-loader.js          # CSV parser and data manager
├── translations.js         # i18n system (11 languages)
├── ai-chatbot.js           # AI assistant engine
├── styles.css              # Custom styles
├── updated_data.csv        # Schemes database (100+ schemes)
├── design.md               # Architecture documentation
├── requirements.md         # Technical requirements
├── README.md               # Project documentation
└── .kiro/                  # Kiro configuration
```

## Key Features

1. **Multilingual Support** - 11 Indian languages (English, Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Urdu)
2. **Eligibility Filtering** - Strict filtering based on user profile (age, gender, state, occupation, category, income)
3. **Category-Based Organization** - Schemes grouped by 10+ categories (education, health, agriculture, etc.)
4. **AI Assistant** - Context-aware chatbot for scheme queries
5. **State-Specific Schemes** - Filter by state for regional schemes
6. **Dark/Light Theme** - User preference with persistence
7. **Responsive Design** - Mobile-first approach

## Core Concepts

### 1. Eligibility System

The application has two modes:
- **Browse Mode** - Show all schemes
- **Eligibility Mode** - Show only eligible schemes based on user profile

User profile includes:
- State (required)
- Age (1-120, required)
- Gender (male/female/other, required)
- Category (General/OBC/SC/ST, required)
- Occupation (student/farmer/employed/unemployed/business/retired, required)
- Income (optional)

### 2. Data Flow

```
CSV File → Parse → Normalize → Cache → Filter → Group → Render
```

### 3. Page Views

Single HTML file with 4 views:
- **Home** - Welcome and eligibility form
- **All Schemes** - All schemes categorized
- **Popular Schemes** - Curated popular schemes
- **State Schemes** - State-specific schemes

### 4. Translation System

All UI text is translatable via `t(key)` function:
```javascript
t('navHome')  // Returns "Home" in English, "होम" in Hindi, etc.
```

## Development Guidelines

### Code Style

- Use meaningful variable names
- Comment complex logic
- Follow existing patterns
- Keep functions focused
- Maintain consistency with existing code

### Adding New Schemes

1. Update `updated_data.csv` with new scheme data
2. Ensure all required fields are present
3. Test data loading and parsing
4. Verify scheme appears in correct category
5. Test eligibility filtering

### Adding Translations

1. Add new key to `UI_TEXT` object in `translations.js`
2. Provide translations for all 11 languages
3. Use English as fallback for incomplete translations
4. Test language switching

### Modifying Eligibility Logic

1. Update `isSchemeEligible()` function in `app.js`
2. Test with various user profiles
3. Verify edge cases
4. Document new eligibility rules

## Common Tasks

### Task: Add a new category

1. Add category to `CATEGORIES` object in `data-loader.js`
2. Define icon, color, and keywords
3. Add translations in `translations.js`
4. Update category mapping if needed
5. Test rendering and filtering

### Task: Update UI text

1. Locate text key in `translations.js`
2. Update translations for all languages
3. Test language switching
4. Verify text displays correctly

### Task: Fix eligibility bug

1. Identify failing case
2. Update logic in `isSchemeEligible()`
3. Test with affected user profiles
4. Verify no regression in other cases

### Task: Add new page view

1. Add HTML structure in `index.html`
2. Add navigation link
3. Add page rendering logic in `app.js`
4. Update `renderPage()` function
5. Test navigation and rendering

## Important Functions

### app.js

- `initApp()` - Application initialization
- `isSchemeEligible(scheme, profile)` - Eligibility checking
- `renderPage(pageType)` - Page rendering
- `filterSchemesByEligibility(schemes)` - Scheme filtering
- `groupSchemesByCategory(schemes)` - Category grouping
- `openEligibilityModal()` - Eligibility form
- `openSchemeModal(scheme)` - Scheme details

### data-loader.js

- `DataLoader.loadSchemesFromCSV()` - Load and parse CSV
- `normalizeScheme(rawScheme)` - Data normalization
- `mapCategory(rawCategory)` - Category mapping

### translations.js

- `t(key)` - Get translated text
- `changeLanguage(code)` - Switch language
- `updateAllUIText()` - Update all UI elements

### ai-chatbot.js

- `processAIQuery(query)` - Process user query
- `searchSchemes(query)` - Search schemes
- `formatAIResponse(schemes)` - Format response

## Testing Checklist

Before committing changes:

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Test all language switches
- [ ] Test eligibility filtering
- [ ] Test theme toggle
- [ ] Check console for errors
- [ ] Verify accessibility
- [ ] Test with slow network
- [ ] Verify localStorage persistence

## Known Limitations

1. **AI Chat** - Simulated responses (no real AI backend)
2. **Geo-detection** - May not work without HTTPS
3. **Scheme Data** - Limited to schemes in CSV
4. **Translations** - Some languages have partial translations
5. **Browser Support** - Requires modern browsers (ES6+)

## Performance Considerations

- Non-blocking initialization (UI renders in <100ms)
- Data caching with localStorage (24-hour expiry)
- Lazy rendering (only visible content)
- Debounced search input
- Optimized re-renders

## Security Notes

- No sensitive data stored
- User input sanitized
- No eval() or unsafe innerHTML
- External links use rel="noopener noreferrer"
- Client-side only (no backend)

## Deployment

The application is a static site that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any static hosting service

No build process required - deploy files as-is.

## Support & Resources

- **Documentation:** See design.md and requirements.md
- **Issues:** Check console for errors
- **Testing:** Use local server (python -m http.server 8000)
- **Built with:** [Kiro](https://kiro.ai)

---

**Last Updated:** 2024  
**Project Status:** Active Development  
**License:** MIT (if applicable)
