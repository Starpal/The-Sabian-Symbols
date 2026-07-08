# ✦ The Sabian Symbols

[![Expo](https://img.shields.io/badge/Expo-54.0-blue)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)](https://www.typescriptlang.org)

> A mystical React Native application exploring the 360 degrees of the zodiac through the Sabian Symbols — a system of 360 evocative images for each degree of the zodiac.

## ✧ Overview

The Sabian Symbols app provides an intuitive interface to explore the Sabian Symbols, a profound divination tool and psychological mirror. Users can search specific degrees, generate random symbols, or compute their complete natal chart.

## ✧ Features

- **🔍 Search a Degree** — Explore any zodiac sign and degree combination
- **🎲 Ask the Oracle** — Receive a random Sabian Symbol for inspiration
- **🌟 Natal Chart** — Calculate planetary positions based on birth data
- **♈ Astrological Navigation** — Browse degrees seamlessly with intuitive controls
- **✨ Visual Poetry** — Elegant typography with Cormorant Garamond and Inter fonts
- **📱 Cross-Platform** — iOS, Android, and Web support
- **♿ Accessibility** — VoiceOver and TalkBack support for inclusive experience, increased Readability and Navigation accessibility
- **🧪 Comprehensive Testing** — Unit and integration tests with Jest

## ✧ Tech Stack

- **Framework**: React Native 0.81 + Expo 54
- **Navigation**: Expo Router (file-based routing)
- **State Management**: TanStack React Query v5
- **Styling**: React Native StyleSheet with design tokens
- **Fonts**: @expo-google-fonts (Cormorant Garamond + Inter)
- **UI Components**: Gorhom Bottom Sheet, Gesture Handler
- **Astrology Engine**: circular-natal-horoscope-js
- **Geocoding**: Nominatim (OpenStreetMap)
- **Language**: TypeScript 5.9
- **Testing**: Jest + React Native Testing Library
- **Accessibility**: VoiceOver (iOS) · TalkBack (Android)

## ✧ API Integration
The app consumes a REST API [https://github.com/Starpal/zodiac-server] for Sabian Symbol data:

**Endpoint,	Method, Description**
/degree	GET	Fetch a random symbol

/DBdegree	POST	Fetch symbol by sign + degree

Nominatim	GET	Geocode location for natal chart


## ✧ Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Setup

```bash
# Clone the repository
git clone https://github.com/Starpal/The-Sabian-Symbols.git
cd The-Sabian-Symbols

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API URL to .env:
# EXPO_PUBLIC_API_URL=https://your-api-endpoint.com

# Start the development server
npx expo start
```

## ✧ Made with intuition and code ✧

Stars are the poetry of the sky, and the Sabian Symbols are their verses.
