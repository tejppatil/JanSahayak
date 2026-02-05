# JanSahayak - AI-Powered Government Services Assistant

**JanSahayak** (meaning "People's Helper" in Hindi) is a multilingual AI-powered web application that bridges the gap between Indian citizens and government services. Built with accessibility and simplicity at its core, this platform empowers users to access crucial information about government schemes through AI-driven guidance in 11 Indian languages.

## 🌟 Key Features

- **🌐 Multilingual Support**: Complete interface and AI responses in 11 languages including Hindi, English, Telugu, Tamil, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Urdu
- **🤖 AI-Powered Chat**: Real-time assistance for government scheme queries with structured, easy-to-understand responses
- **📋 Comprehensive Database**: Information on 14+ popular schemes including Aadhaar, PAN, PM Kisan, Ayushman Bharat, and more
- **🏛️ State-Specific Schemes**: Location-based recommendations for regional government programs
- **📱 Mobile-First Design**: Optimized for low-bandwidth usage and accessibility across all devices
- **⚡ Offline Capability**: Core functionality works without internet connectivity
- **🎨 Dark/Light Theme**: User-friendly theme switching
- **♿ Accessibility**: High contrast, large text, keyboard navigation support

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome 70+, Firefox 65+, Safari 12+, Edge 79+)
- No server or installation required!

### Running the Application

1. **Clone the repository**
   ```bash
   git clone https://github.com/tejppatil/JanSahayak.git
   cd JanSahayak
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server for better performance:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Access the application**
   - Direct file: `file:///path/to/JanSahayak/index.html`
   - Local server: `http://localhost:8000`

## 📁 Project Structure

```
JanSahayak/
├── index.html              # Main application page
├── styles.css              # Styling and themes
├── script.js               # Main application logic
├── ai-config.js            # Language translations and UI text
├── api-config.js           # API endpoints and configurations
├── api-service.js          # API service functions
├── nlp-engine.js           # Natural language processing
├── schemes-db.js           # Core government schemes database
├── schemes-db-2.js         # Additional schemes (Part 2)
├── schemes-db-3.js         # Additional schemes (Part 3)
├── state-schemes.js        # State-specific schemes
├── requirements.md         # Technical requirements
├── design.md               # Design specifications
└── README.md               # This file
```

## 🎯 Target Audience

- **Rural and Urban Citizens**: Seeking information about government benefits
- **Low-Literacy Users**: Simple language explanations and step-by-step guidance
- **Multilingual Communities**: Native language support for better understanding
- **Digital Newcomers**: Intuitive interface requiring minimal technical knowledge

## 🛠️ Technical Highlights

- **Frontend-Only Architecture**: Pure HTML/CSS/JavaScript with no backend dependencies
- **Lightweight & Fast**: Optimized for 3G networks and older devices (< 500KB total)
- **Progressive Enhancement**: Works across all modern browsers with graceful degradation
- **Local Storage Caching**: Efficient data caching for improved performance
- **Responsive Design**: Mobile-first approach with flexible layouts

## 🌍 Supported Languages

| Language | Code | Script |
|----------|------|--------|
| English | en | Latin |
| Hindi | hi | Devanagari |
| Telugu | te | Telugu |
| Tamil | ta | Tamil |
| Bengali | bn | Bengali |
| Marathi | mr | Devanagari |
| Gujarati | gu | Gujarati |
| Kannada | kn | Kannada |
| Malayalam | ml | Malayalam |
| Punjabi | pa | Gurmukhi |
| Urdu | ur | Arabic |

## 📋 Available Schemes

### Central Government Schemes
- **Aadhaar Card** - Unique identity number
- **PAN Card** - Tax identification
- **PM Kisan** - Farmer income support
- **Ayushman Bharat** - Health insurance
- **PM Awas Yojana** - Housing assistance
- **MGNREGA** - Employment guarantee
- **Jan Dhan Yojana** - Banking inclusion
- **Ujjwala Yojana** - LPG connections
- **Scholarships** - Education support
- **Skill India** - Vocational training
- **And many more...**

### State-Specific Schemes
- **Telangana**: Rythu Bandhu, KCR Kit, Aasara Pension
- **Karnataka**: Anna Bhagya, Gruha Jyoti, Gruha Lakshmi
- **Tamil Nadu**: Kalaignar Magalir Urimai, Free Bus Travel
- **Maharashtra**: Ladki Bahin Yojana
- **And schemes from other major states...**

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Issues**: Found a bug or have a suggestion? Open an issue
2. **Add Schemes**: Help us add more government schemes
3. **Improve Translations**: Enhance language support
4. **Enhance UI/UX**: Make the interface more user-friendly

**JanSahayak** - Empowering citizens through AI-driven guidance 🇮🇳

## 🌟 Key Features

### 1. Hybrid Interface
- **Quick Access Cards**: Popular schemes like Aadhaar, PAN, Ration Card are immediately visible.
- **AI Chat Assistant**: Ask about *any* scheme, get details, find schemes by category.

### 2. Comprehensive Language Support (13 Languages)
- English, Hindi, Telugu, Tamil, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Urdu, Odia, Assamese.
- Instant language switching updates the entire UI.

### 3. Intelligent Scheme Information
- **Database**: Covers 20+ schemes including PM Vishwakarma, PM POSHAN, etc.
- **Smart Search**: Understands categories like "Farmers", "Education", "Health".
- **Structured Output**:
  - Title & Description
  - Eligibility Checks
  - Step-by-step Application Process
  - Required Documents
  - **Official Direct Links**

### 4. Technical Highlights
- **Zero Backend**: Runs entirely in the browser (Client-side AI simulation).
- **Fast & Lightweight**: No heavy frameworks, pure HTML/CSS/JS.
- **Responsive Design**: Mobile-first premium UI.

## 🚀 How to Use

1. **Open `index.html`**.
2. **Select Language**: Scroll the top bar to choose your preferred language.
3. **Browse**: Click on any card (e.g., "Aadhaar") to see full details in a popup.
4. **Chat**: Type in the chat box.
   - *Try:* "schemes for farmers"
   - *Try:* "how to apply for pan card"
   - *Try:* "healthcare schemes"

## 📂 Project Structure

- `index.html`: Main entry point.
- `styles.css`: Modern styling.
- `script.js`: Core logic (UI, Chat, Event Handling).
- `ai-config.js`: Knowledge base (Schemes DB, Translations).

---
*Built for the people of India.*
>>>>>>> newrepo/master
