# ✦ The Sabian Symbols

[![Expo](https://img.shields.io/badge/Expo-54.0-blue)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> A mystical React Native application exploring the 360 degrees of the zodiac through the Sabian Symbols — a system of 360 evocative images for each degree of the zodiac.

## ✧ Overview

The Sabian Symbols app provides an intuitive interface to explore the Sabian Symbols, a profound divination tool and psychological mirror. Users can search specific degrees, generate random symbols, or compute their complete natal chart.

## Live Demo

📱 Scan or open with [Expo Go](https://expo.dev/go)

- **iOS:** [Open demo](https://expo.dev/preview/update?message=eas+build+for+expo+go%2C+add+metro.config++for+entrypoint+setting+of+npm+package&updateRuntimeVersion=1.0.0&createdAt=2026-07-07T14%3A57%3A59.889Z&slug=exp&projectId=060afb0f-313e-4351-90e7-abc991878f66&group=e9f58755-2661-47ff-a8d7-70dbd433682d) 
 
 ![QR iOS](./assets/images/expo-qr-android.png)

- **Android:** [Open demo](https://expo.dev/preview/update?message=eas+build+for+expo+go%2C+add+metro.config++for+entrypoint+setting+of+npm+package&updateRuntimeVersion=1.0.0&createdAt=2026-07-07T15%3A04%3A20.122Z&slug=exp&projectId=060afb0f-313e-4351-90e7-abc991878f66&group=b8f503d5-0ea8-41b9-9fd6-b6a26de382f4)
 
  ![QR Android](./assets/images/expo-qr-ios.png)

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
The app consumes a REST API for Sabian Symbol data:

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
