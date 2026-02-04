# JanSahayak - AI-Powered Community Services Website - Design Specification

## Design Philosophy
Clean, accessible, government-appropriate design that works for users with varying literacy levels and technical expertise. JanSahayak (meaning "People's Helper" in Hindi) embodies the mission of empowering citizens through AI-driven guidance.

## Visual Design System

### Color Palette
```css
/* Light Theme */
--primary-500: #6366F1 (Indigo - trust, government)
--primary-600: #4F46E5 (Darker indigo for buttons)
--accent-500: #14B8A6 (Teal - success, progress)
--gray-50: #F9FAFB (Light backgrounds)
--gray-900: #111827 (Primary text)

/* Dark Theme */
--primary-500: #6366F1 (Consistent primary)
--primary-600: #818CF8 (Lighter for dark mode)
--accent-500: #2DD4BF (Brighter teal)
--bg-primary: #0B0B0E (Dark background)
--text-primary: #F9FAFB (Light text)
```

### Typography
- **Primary Font**: Noto Sans (universal, government-approved)
- **Script Fonts**: 
  - Noto Sans Devanagari (Hindi, Marathi)
  - Noto Sans Telugu
  - Noto Sans Tamil
  - Noto Sans Bengali
- **Font Sizes**: 
  - Headers: 2rem (32px)
  - Body: 1rem (16px)
  - Small: 0.85rem (14px)

### Layout Structure

#### Header
- Gradient background (blue to purple)
- Centered title and tagline
- Horizontal language selector
- State dropdown
- Theme toggle button (top-right)

#### Main Content
- Max-width: 800px (mobile-first)
- Padding: 16px on mobile, 24px on desktop
- Card-based layout with shadows
- Grid system for scheme cards

#### AI Chat Section
- Prominent placement below header
- Chat history with distinct user/AI styling
- Input field with send button
- Typing indicators

#### Scheme Grids
- Responsive grid (1-4 columns based on screen)
- Card hover effects
- Category icons
- Consistent spacing

## Component Design

### Language Buttons
- Pill-shaped buttons
- Native script text
- Active state highlighting
- Horizontal scroll on mobile
- Centered layout on desktop

### Scheme Cards
- 120px height for consistency
- Icon + text layout
- Hover animations (lift + shadow)
- Border color change on hover
- Category-based icons

### Chat Interface
- Distinct styling for user vs AI messages
- User messages: right-aligned, blue background
- AI messages: left-aligned, white background
- Rounded corners with reduced radius on speech bubble side
- Scrollable history area

### Modal Design
- Overlay with backdrop blur
- Centered modal with max-width
- Close button (top-right)
- Structured content sections
- Slide-up animation

## Responsive Design

### Mobile (< 600px)
- Single column layout
- Full-width cards
- Stacked language buttons
- Larger touch targets (44px minimum)
- Simplified navigation

### Tablet (600px - 1024px)
- 2-3 column grid
- Larger cards
- Horizontal language scroll
- Optimized for touch

### Desktop (> 1024px)
- 4 column grid
- Hover effects
- Keyboard navigation
- Mouse interactions

## Accessibility Features

### Visual Accessibility
- High contrast ratios (4.5:1 minimum)
- Large text sizes
- Clear visual hierarchy
- Color-blind friendly palette
- Dark mode support

### Interaction Accessibility
- Keyboard navigation
- Focus indicators
- Screen reader support
- Touch-friendly targets
- Reduced motion options

### Language Accessibility
- Right-to-left support for Urdu
- Proper font rendering for all scripts
- Cultural color considerations
- Appropriate iconography

## Animation & Interactions

### Micro-interactions
- Button hover effects (lift + shadow)
- Card hover animations
- Theme toggle rotation
- Loading indicators
- Typing dots animation

### Page Transitions
- Modal slide-up animation
- Smooth language switching
- Theme transition effects
- Chat message animations

### Performance Considerations
- CSS transforms over position changes
- Hardware acceleration for animations
- Reduced motion media queries
- Efficient repaints

## Icon System

### Category Icons
- Documents: 📄
- Health: 🏥
- Housing: 🏠
- Farmers: 🌾
- Employment: 💼
- Banking: 🏦
- Education: 🎓
- Women: 👩
- Food: 🍚
- Finance: 💰
- Elderly: 👴

### UI Icons
- AI: 🤖
- Theme: 🌙/☀️
- Close: ×
- External Link: ↗

## Content Layout

### Scheme Information Structure
```
[Icon]
Scheme Name
---
What is it: Brief description
Who can apply: Eligibility
Steps to apply: Numbered list
Documents needed: Bullet list
Official Link: Government URL
```

### Chat Message Structure
- User messages: Right-aligned, blue
- AI messages: Left-aligned, structured format
- Timestamps: Optional, subtle
- Status indicators: Typing, error states

## Brand Guidelines

### Government Appropriate
- Professional color scheme
- Trustworthy typography
- Official language tone
- Accessible design
- No commercial branding

### Cultural Sensitivity
- Respectful iconography
- Appropriate color meanings
- Cultural context awareness
- Regional customization support

## Technical Implementation

### CSS Architecture
- CSS Custom Properties for theming
- Mobile-first media queries
- Flexbox and Grid layouts
- Component-based styling
- Minimal external dependencies

### Performance Optimization
- Critical CSS inlining
- Font loading optimization
- Image optimization
- Minimal JavaScript
- Efficient animations

### Browser Support
- Progressive enhancement
- Graceful degradation
- Polyfills for older browsers
- Consistent cross-browser rendering