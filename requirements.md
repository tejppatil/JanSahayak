# JanSahayak - AI-Powered Community Services Website - Requirements

## Project Overview
JanSahayak is a multilingual AI-powered web application that helps Indian citizens access government schemes and services through simple language explanations and step-by-step guidance.

## Core Requirements

### 1. Language Support
- **MANDATORY**: Support for 11 Indian languages
  - English (en)
  - Hindi (hi) 
  - Telugu (te)
  - Tamil (ta)
  - Bengali (bn)
  - Marathi (mr)
  - Gujarati (gu)
  - Kannada (kn)
  - Malayalam (ml)
  - Punjabi (pa)
  - Urdu (ur)

- **Language Switching**: Complete UI translation when language is changed
- **No Hardcoded Text**: All UI text must come from translation objects
- **AI Responses**: Must respond in selected language

### 2. AI Integration
- **Real AI Model**: No static/fake responses allowed
- **Structured Format**: All AI responses must follow:
  ```
  Title: [Scheme Name]
  What is it: [Simple explanation]
  Who can apply: [Eligibility criteria]
  Steps to apply: [Numbered steps]
  Documents needed: [Required documents list]
  ```
- **Domain Restriction**: Only answer government scheme queries
- **Error Handling**: Show "Unable to fetch AI response" on failures

### 3. Scheme Information System
- **Static Schemes**: 14 popular schemes always visible
- **State Schemes**: Location-based scheme recommendations
- **Scheme Modals**: Detailed popups for each scheme
- **Search Functionality**: AI-powered scheme search and matching

### 4. User Interface
- **Mobile-First**: Responsive design optimized for mobile
- **Low-Bandwidth**: Lightweight, fast loading
- **Accessibility**: High contrast, large text, clear navigation
- **Theme Support**: Light/dark mode toggle
- **Clean Design**: Minimal, government-appropriate styling

### 5. Technical Constraints
- **Frontend Only**: HTML/CSS/JavaScript (no backend required)
- **No Heavy Frameworks**: Vanilla JavaScript preferred
- **No Paid APIs**: Use free AI services only
- **Offline Capability**: Core functionality without internet

## Functional Requirements

### Language System
- `changeLanguage(lang)` function updates entire DOM
- Translation objects for all UI elements
- Font support for all Indian scripts
- RTL support for Urdu

### AI Chat System
- `getAIResponse(query, language)` function
- Chat history with user/AI message distinction
- Typing indicators during AI processing
- Query preprocessing and intent recognition

### Scheme Management
- `openSchemeModal(schemeId)` function
- `schemeDetails` object with all scheme data
- Category-based scheme filtering
- State-specific scheme detection

### State Detection
- Geolocation-based state detection
- Manual state selection dropdown
- Cached user preferences
- State-specific scheme recommendations

## Performance Requirements
- Page load time < 3 seconds on 3G
- First contentful paint < 1.5 seconds
- Interactive within 2 seconds
- Bundle size < 500KB total

## Browser Support
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Content Requirements
- Simple language (6th grade reading level)
- No technical jargon
- Step-by-step instructions
- Visual icons for categories
- Official government links

## Security Requirements
- No user data collection
- Local storage only for preferences
- HTTPS for all external API calls
- Input sanitization for chat queries

## Compliance Requirements
- Government accessibility standards
- Multi-language content accuracy
- Official scheme information verification
- Privacy-first design (no tracking)