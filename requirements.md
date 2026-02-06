# JanSahayak - Requirements Document

## 1. Project Overview

**JanSahayak** (meaning "People's Helper" in Hindi) is a client-side web application that helps Indian citizens discover and understand government schemes. The system provides multilingual support, eligibility-based filtering, and AI-powered assistance to make government schemes accessible to all citizens.

### Purpose
- Simplify discovery of government schemes for Indian citizens
- Provide multilingual access (11 Indian languages)
- Enable eligibility-based filtering to show relevant schemes
- Offer AI chatbot assistance for scheme information
- Support both central and state-specific schemes

### Target Users
- **Rural and Urban Citizens**: Seeking government benefits and services
- **Farmers**: Looking for agricultural support schemes
- **Students**: Searching for scholarships and education schemes
- **Women**: Finding women-specific welfare programs
- **Senior Citizens**: Discovering pension and welfare schemes
- **Low-Literacy Users**: Requiring simple language and voice assistance
- **Multilingual Users**: Preferring native language interfaces

---

## 2. Functional Requirements

### 2.1 Scheme Browsing

**FR-1.1: Browse All Schemes**
- System SHALL display all available schemes from CSV database
- Schemes SHALL be organized by categories (Education, Health, Agriculture, etc.)
- Users SHALL be able to view schemes without setting eligibility

**FR-1.2: View Popular Schemes**
- System SHALL identify and display popular schemes
- Popular schemes are determined by keywords (PM, Pradhan Mantri, Ayushman, etc.)
- Minimum 30 schemes SHALL be marked as popular

**FR-1.3: View State-Specific Schemes**
- System SHALL filter schemes by selected state
- State-specific page SHALL show ONLY schemes for selected state
- Central schemes SHALL be excluded from state-specific view
- Users SHALL be able to select state from dropdown

**FR-1.4: Category-Based Organization**
- Schemes SHALL be grouped into 14 categories:
  - Education, Health, Agriculture, Women & Child, Social Welfare
  - Business, Employment, Banking, Housing, Utilities
  - Transport, Technology, Sports, Legal, Tourism
- Each category SHALL display scheme count
- Empty categories SHALL be hidden from view

### 2.2 Eligibility System

**FR-2.1: Eligibility Profile Creation**
- Users SHALL provide the following information:
  - State (required)
  - Age (required, 1-120 years)
  - Gender (required: Male/Female/Other)
  - Social Category (required: General/OBC/SC/ST)
  - Occupation (required: Farmer/Student/Employed/Self-Employed/Unemployed/Retired)
  - Annual Income (optional, in ₹)
- System SHALL validate all required fields before submission
- Profile SHALL be stored in browser localStorage

**FR-2.2: Eligibility Mode**
- System SHALL operate in two modes:
  - **Browse Mode**: Show all schemes without filtering
  - **Eligibility Mode**: Show only schemes matching user profile
- Mode SHALL be indicated by status bar when active
- Users SHALL be able to clear eligibility and return to Browse Mode

**FR-2.3: Eligibility Filtering Rules**
- System SHALL apply STRICT filtering based on:
  - **State**: State-specific schemes must match user's state exactly
  - **Gender**: Women-only schemes filtered for non-female users
  - **Age**: Schemes with age limits enforced (senior citizen 60+, child <18)
  - **Occupation**: Farmer/Student/Worker schemes filtered by occupation
  - **Category**: SC/ST/OBC-specific schemes filtered by social category
  - **Income**: BPL/EWS schemes filtered by income limits
- ALL conditions must be met for scheme to be eligible
- Schemes failing ANY condition SHALL be excluded

### 2.3 Multilingual Support

**FR-3.1: Language Selection**
- System SHALL support 11 Indian languages:
  - English, Hindi, Marathi, Gujarati, Bengali
  - Tamil, Telugu, Kannada, Malayalam, Punjabi, Urdu
- Users SHALL be able to switch language from dropdown
- Language preference SHALL persist across sessions
- Urdu SHALL display right-to-left (RTL)

**FR-3.2: UI Translation**
- ALL UI elements SHALL be translated:
  - Navigation labels
  - Button text
  - Form labels and options
  - Category names
  - Error messages
  - Modal content
- Language change SHALL update entire interface immediately
- Missing translations SHALL fallback to English

**FR-3.3: Scheme Content Translation**
- Scheme names SHALL be displayed in selected language where available
- Category names SHALL be translated for all 11 languages
- State names SHALL be translated (English/Hindi)

### 2.4 AI Chatbot

**FR-4.1: Chat Interface**
- System SHALL provide floating AI chat button on all pages
- Chat modal SHALL open on button click
- Chat history SHALL be maintained during session
- Users SHALL be able to type queries or use voice input

**FR-4.2: Query Processing**
- System SHALL handle the following query types:
  - **Greetings**: "hi", "hello", "namaste" → Welcome response
  - **Scheme Names**: "PM Kisan", "Ayushman" → Scheme card
  - **Aliases**: "MGNREGA", "nrega", "manrega" → Correct scheme
  - **Categories**: "farmer schemes", "student" → Category list
  - **Intent-based**: "how to apply", "documents needed" → Specific info
- System SHALL use fuzzy matching for typos (Levenshtein distance ≤2)
- System SHALL expand aliases (e.g., "nrega" → "MGNREGA")

**FR-4.3: Response Format**
- Scheme responses SHALL include:
  - Scheme name with Central/State badge
  - Who can apply (eligibility, max 2 points)
  - Benefits (max 2 points)
  - How to apply (max 2 steps)
  - Documents needed (max 3 items)
  - Official link
- Responses SHALL be limited to ~120 words
- Text SHALL be clean, properly capitalized, and punctuated

**FR-4.4: Eligibility-Aware Responses**
- When eligibility mode is active:
  - AI SHALL only show eligible schemes
  - AI SHALL indicate if scheme doesn't match profile
  - AI SHALL suggest clearing filters if no results
- When state is selected:
  - AI SHALL filter state-specific schemes
  - AI SHALL show central + state schemes appropriately

**FR-4.5: Voice Output**
- System SHALL provide text-to-speech for AI responses
- Voice SHALL use appropriate language (en-IN, hi-IN, etc.)
- Users SHALL be able to stop speech playback

### 2.5 Scheme Details

**FR-5.1: Scheme Modal**
- Clicking scheme SHALL open detailed modal
- Modal SHALL display:
  - Scheme name and type (Central/State)
  - Full description
  - Complete eligibility criteria
  - Detailed benefits
  - Application process
  - Required documents
  - Official website link
- Modal SHALL have "Explain with AI" button
- Modal SHALL be closable via X button or outside click

**FR-5.2: Scheme Information**
- Each scheme SHALL contain:
  - Unique ID and slug
  - Name
  - Details/Description
  - Benefits
  - Eligibility criteria
  - Application process
  - Required documents
  - Level (Central/State)
  - Categories (array)
  - State (if state-specific)
  - Tags

### 2.6 Data Management

**FR-6.1: CSV Data Loading**
- System SHALL load schemes from `updated_data.csv`
- CSV SHALL be parsed on application load
- System SHALL handle quoted fields and special characters
- Invalid rows SHALL be skipped with console warning

**FR-6.2: Data Caching**
- System SHALL cache parsed schemes in localStorage
- Cache SHALL be valid for 24 hours
- Cache SHALL store minimal scheme data (<5MB)
- Cache SHALL be cleared if quota exceeded

**FR-6.3: Category Normalization**
- CSV categories SHALL be mapped to canonical categories
- Multiple CSV categories SHALL map to single canonical category
- Unknown categories SHALL default to "Social Welfare"

**FR-6.4: State Detection**
- System SHALL extract state from scheme name/details
- State SHALL be normalized to lowercase
- State-specific flag SHALL be set based on "Level" column

---

## 3. Non-Functional Requirements

### 3.1 Performance

**NFR-1.1: Load Time**
- Initial page load SHALL complete in <3 seconds on 3G
- UI SHALL be interactive before data loads (non-blocking)
- Loading state SHALL be shown while data loads
- Cached data SHALL load in <500ms

**NFR-1.2: Response Time**
- Language switching SHALL update UI in <200ms
- Category expansion SHALL be instant (<100ms)
- AI responses SHALL appear within 1 second
- Search results SHALL display in <500ms

**NFR-1.3: Data Size**
- Total application size SHALL be <2MB (excluding CSV)
- CSV data SHALL be <1MB
- localStorage cache SHALL be <5MB
- No external dependencies except CDN (Tailwind, Google Fonts)

### 3.2 Usability

**NFR-2.1: Accessibility**
- Interface SHALL be keyboard navigable
- Color contrast SHALL meet WCAG 2.1 AA standards
- Text SHALL be scalable
- Focus indicators SHALL be visible
- Screen reader support (basic)

**NFR-2.2: Mobile Responsiveness**
- Application SHALL work on screens 375px and above
- Touch targets SHALL be minimum 44x44px
- Text SHALL be readable without zooming
- Modals SHALL fit mobile screens
- Navigation SHALL collapse on mobile

**NFR-2.3: User Experience**
- Interface SHALL be intuitive for low-literacy users
- Icons SHALL accompany text labels
- Error messages SHALL be clear and actionable
- Success feedback SHALL be immediate
- Empty states SHALL provide guidance

### 3.3 Reliability

**NFR-3.1: Error Handling**
- CSV parsing errors SHALL not crash application
- Missing translations SHALL fallback to English
- Invalid eligibility data SHALL be rejected with message
- localStorage failures SHALL degrade gracefully
- Network errors SHALL show user-friendly messages

**NFR-3.2: Data Integrity**
- User profile SHALL persist across sessions
- Language preference SHALL persist across sessions
- State selection SHALL persist across sessions
- Cache SHALL be validated before use
- Corrupted cache SHALL be cleared automatically

### 3.4 Compatibility

**NFR-4.1: Browser Support**
- Chrome 70+ (primary)
- Firefox 65+
- Safari 12+
- Edge 79+
- Mobile browsers (Chrome, Safari)

**NFR-4.2: Device Support**
- Desktop (1920x1080 and above)
- Laptop (1366x768 and above)
- Tablet (768x1024)
- Mobile (375x667 and above)

**NFR-4.3: Network Conditions**
- Application SHALL work on 3G networks
- Application SHALL work offline after initial load (cached)
- No backend server required
- All processing client-side

### 3.5 Security & Privacy

**NFR-5.1: Data Privacy**
- User data SHALL be stored only in browser localStorage
- No data SHALL be sent to external servers
- No user tracking or analytics
- No cookies used

**NFR-5.2: Content Security**
- No inline JavaScript in HTML
- External resources from trusted CDNs only
- No eval() or similar unsafe functions
- XSS protection via proper escaping

---

## 4. Constraints and Assumptions

### 4.1 Technical Constraints
- **No Backend**: Pure client-side application
- **No Database**: Data from CSV file only
- **No Authentication**: No user accounts or login
- **No Real-time Updates**: Data updated via CSV file replacement
- **Browser Storage Limits**: localStorage ~5-10MB limit

### 4.2 Data Constraints
- Scheme data accuracy depends on CSV source
- Translations may be incomplete for some languages
- Official links may become outdated
- State-specific schemes limited to what's in CSV

### 4.3 Assumptions
- Users have modern web browsers
- Users have JavaScript enabled
- Users have internet for initial load
- CSV file is properly formatted
- Scheme information is accurate and current

---

## 5. What the System Does NOT Do

### 5.1 Out of Scope
- **No Application Submission**: System does not submit applications
- **No Document Upload**: System does not handle document uploads
- **No Status Tracking**: System does not track application status
- **No User Accounts**: No registration or login functionality
- **No Payment Processing**: No financial transactions
- **No Real AI**: Chatbot uses rule-based matching, not machine learning
- **No Backend Integration**: No connection to government databases
- **No Real-time Data**: Scheme data is static from CSV
- **No Notifications**: No email/SMS alerts
- **No Scheme Comparison**: No side-by-side comparison feature
- **No Bookmarking**: No save/favorite schemes feature
- **No Social Sharing**: No share to social media
- **No Analytics**: No usage tracking or reporting

### 5.2 Known Limitations
- Eligibility filtering is rule-based and may not cover all edge cases
- AI chatbot has limited understanding (keyword/alias matching only)
- Translations may be incomplete for some UI elements
- Voice output quality depends on browser TTS engine
- Offline mode requires prior visit (for caching)
- Search is limited to scheme names, not full-text
- No spell correction beyond fuzzy matching

---

## 6. Success Criteria

The system is considered successful if:
1. Users can discover schemes in their preferred language
2. Eligibility filtering accurately shows relevant schemes
3. AI chatbot answers common scheme queries correctly
4. Application loads and works on 3G networks
5. Interface is usable by low-literacy users
6. All 11 languages display correctly
7. State-specific filtering works accurately
8. No critical bugs or crashes
9. Performance meets specified targets
10. User feedback is positive

---

**Document Version**: 1.0  
**Last Updated**: Based on actual implementation analysis  
**Status**: Final - Reflects current system as-is
