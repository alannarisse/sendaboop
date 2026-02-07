# Send a Boop - Project Overview

## What This App Does
Send a Boop is a web/mobile app that lets users send cute dog photos to friends via email. Users pick a dog from a grid, fill out sender/recipient info, write a message, and send a "boop" to brighten someone's day.

## Tech Stack
- **Framework**: Expo SDK 54 with React Native
- **Router**: Expo Router 4.0 (file-based routing)
- **Language**: TypeScript
- **Styling**: React Native StyleSheet API (no CSS/Tailwind)
- **Icons**: react-native-svg for custom SVG icons
- **Gradients**: expo-linear-gradient
- **Email Service**: Resend (server-side API)
- **Fonts**: Quattrocento (serif) and QuattrocentoSans (sans-serif)

## Project Structure

```
sendaboop/
├── app/                    # Pages (Expo Router file-based routing)
│   ├── _layout.tsx         # Root layout with gradient background, font loading
│   ├── index.tsx           # Main page - dog selector + boop form
│   ├── success.tsx         # Success confirmation after sending
│   ├── about.tsx           # About page with creator info
│   ├── contact.tsx         # Contact form page
│   └── +html.tsx           # HTML template for web (meta tags)
│
├── components/             # Reusable UI components
│   ├── Nav.tsx             # Fixed navigation bar with DogLogo and About/Contact links
│   ├── Header.tsx          # Hero content for home page (heart icon, title, subtitle)
│   ├── DogSelector.tsx     # 3x4 grid of dog photos with heart selection
│   ├── BoopForm.tsx        # Form fields for sender/recipient/message with labels
│   ├── BoopPreview.tsx     # Preview of email (currently hidden in new design)
│   └── Tooltip.tsx         # Hover tooltip for disabled buttons (web only)
│
├── lib/                    # Utilities
│   ├── dogs.ts             # Dog data (21 breeds) with images and metadata
│   └── api.ts              # API functions for sending boops
│
├── assets/
│   ├── fonts/              # Quattrocento font family
│   ├── images/dogs/        # Dog photos (organized by breed)
│   └── images/general/     # General images (bio-pic.jpeg, etc.)
│
├── api/                    # Server-side API routes
│   ├── send-boop.ts        # POST endpoint for sending dog photo emails
│   └── contact.ts          # POST endpoint for contact form
│
└── docs/                   # Documentation and design assets
    └── design-screenshot.png
```

## Design System (Current)

### Colors
- **Primary**: `#f87171` (coral/red-pink) - hearts, buttons, accents
- **Gradient Button**: `#fcd5ce` → `#f8a4a4` → `#f87171`
- **Background Gradient**: `#fff5f5` → `#ffeef2` → `#fff0f3` (soft pink)
- **Text Dark**: `#1f2937`
- **Text Medium**: `#6b7280`
- **Text Light**: `#9ca3af`
- **Card Background**: `rgba(255, 255, 255, 0.85)`
- **Error**: `#f87171` (borders), `#dc2626` (text)
- **Disabled Button**: `#aeb1b6` → `#a0a2a5`

### Typography
- **Headings**: `Quattrocento-Bold` (serif)
- **Body**: `QuattrocentoSans-Regular`
- **Labels/Buttons**: `QuattrocentoSans-Bold`
- **Section Labels**: 11px uppercase with letter-spacing

### Component Patterns
- **Cards**: White semi-transparent (`rgba(255,255,255,0.85)`), 16px border-radius, subtle shadow
- **Inputs**: White background, 1px `#e5e7eb` border, 10px border-radius
- **Buttons**: Gradient fill, 12-14px border-radius, shadow with primary color
- **Selection**: Animated heart icon overlay on selected items

## Key Components

### Nav.tsx
- Fixed navigation bar at top of all pages
- Contains DogLogo (custom SVG) that links to home
- About and Contact navigation links on the right
- Stays fixed while page content scrolls

### Header.tsx
- Hero content shown only on home page
- Centered heart icon + "Send A Boop!" title + subtitle
- Scrolls with the page content

### DogSelector.tsx
- Displays 12 random dogs in a 3-column grid
- Selected dog shows animated heart badge (spring animation)
- Uses `Animated.spring` for selection effect

### BoopForm.tsx
- Card-based sections: "FROM YOU", "TO YOUR FRIEND", "YOUR MESSAGE"
- Field labels with red asterisks (*) for required fields
- Uppercase section labels with letter-spacing
- Clean white inputs with subtle borders

### Tooltip.tsx
- Web-only hover tooltip component
- Shows on disabled send button to explain missing fields
- Uses mouse enter/leave events (web platform only)

### Success Page
- Heart icon header
- Rounded dog image preview with coral border
- Gradient "Send Another Boop" button
- Ko-fi tip link with button image in footer

### About Page
- Bio photo with rounded corners in "Who Am I?" section
- Card-based layout for content sections

## API Endpoints
- `POST /api/send-boop` - Sends dog photo email via Resend
- `POST /api/contact` - Sends contact form message

## Environment Variables
- `EXPO_PUBLIC_API_URL` - API base URL
- `RESEND_API_KEY` - Resend API key for email sending

## Running the App
```bash
# Install dependencies
npm install

# Start dev server
npx expo start

# Build for web
npx expo export --platform web
```

## Recent Changes (Feb 2026)
- Redesigned UI to match new design screenshot
- Added gradient backgrounds and buttons
- Replaced checkmark with animated heart selection
- Added react-native-svg for custom icons
- Reorganized forms into card-based layout
- Updated color scheme from hot pink to coral
- Added thin menu bar to all pages including homepage
- Added field labels with required asterisks to forms
- Added tooltip on disabled send button (web only)
- Added bio photo to About page
- Added Ko-fi button image to success page
- Separated Nav component from Header for fixed navigation
- Nav bar stays fixed while content scrolls
