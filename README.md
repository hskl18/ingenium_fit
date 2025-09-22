# Ingenium Fit

This repo carries the full Ingenium Fit React Native application with the original multi-tab experience (home, dynamic feed, profile, messaging, etc.). Built with **Expo SDK 52** and the latest React Native architecture for optimal performance and developer experience.

The mobile app is built with React Native + TypeScript using Expo's managed workflow. Styling leverages a tokenized theme system with React Native Paper components for accessibility. The New Architecture (Fabric + TurboModules) accelerates performance, while MMKV provides encrypted local storage for location, auth, and translated content. Expo Router handles navigation with file-based routing, targeting iOS 15+ and Android API 21+.

Key features include:
• Knowledge-sharing posts where athletes exchange training/rehab tips
• Doctor and rehab center reviews integrated alongside facility ratings  
• Engagement actions (comments, likes, favorites, private messaging)
• Real-time messaging and notifications
• Location-based facility discovery

## Repository Layout

- `mobile-app/` – React Native iOS/Android project (screens, navigation, services, stores, theming)
- `technical-documentation.docx` – reference specs from the earlier full-stack effort

## Prerequisites

- Node.js 22+ (specified in package.json engines)
- pnpm 9+ (package manager - specified in package.json)
- Expo CLI - `npm install -g @expo/cli`
- Watchman (macOS) - `brew install watchman`
- Xcode 15+ with Command Line Tools (for iOS development)
- iOS Simulator or physical iOS device
- Android Studio (for Android development)
- EAS CLI (optional, for cloud builds) - `npm install -g eas-cli`

## Getting Started

1. **Clone and navigate to the project:**

   ```bash
   git clone <repository-url>
   cd mobile-app
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start the Expo development server:**

   ```bash
   pnpm start
   # or
   npx expo start --clear
   ```

## Development Options

### Expo Go (Recommended for Development)

1. Install Expo Go on your device from App Store/Play Store
2. Run `pnpm start` and scan the QR code
3. Instant reload and debugging without native builds

### Native Development Builds

For features requiring custom native code:

```bash
# Create development build
npx expo run:ios --device
npx expo run:android --device
```

### Using Xcode (iOS)

After running `npx expo run:ios`, you can open the generated Xcode project:

1. Open `mobile-app/ios/kangfu_app.xcworkspace` in Xcode
2. Select your target device/simulator
3. Press Cmd+R to build and run

## Troubleshooting

### Expo Cache Issues

If you encounter bundling or build issues:

```bash
# Clear Expo cache
npx expo start --clear

# Clear Metro cache
pnpm start --reset-cache

# Clear all caches
npx expo start --clear --reset-cache
```

### Native Dependencies Issues

For iOS native builds:

```bash
cd ios
pod install --repo-update
cd ..
```

### Node Modules Issues

If dependencies seem corrupted:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Common Expo Issues

```bash
# Update Expo CLI
npm install -g @expo/cli@latest

# Check Expo doctor for issues
npx expo doctor

# Prebuild native directories (if needed)
npx expo prebuild --clean
```

## Key Source Areas (mobile-app/src)

- `screens/` – feature screens such as `Tabbar/Home`, `Dynamic`, `Message`, etc.
- `navigation/` – React Navigation configuration for stacks and tabs.
- `components/` – reusable UI pieces.
- `store/`, `services/`, `hooks/` – state management, API wrappers, and utilities.
- `theme/`, `translations/` – styling tokens and i18n resources.

## Development Commands

```bash
# Start Expo development server
pnpm start

# Run on iOS simulator/device
pnpm ios

# Run on Android emulator/device
pnpm android

# Run on web browser
pnpm web

# Build for production (requires EAS)
npx eas build --platform ios
npx eas build --platform android

# Submit to app stores (requires EAS)
npx eas submit --platform ios
npx eas submit --platform android

# Type checking (if configured)
pnpm type:check

# Linting (if configured)
pnpm lint

# Testing (if configured)
pnpm test
```

## Tech Stack & Dependencies

Built with the latest versions (updated December 2024):

- **Framework**: Expo SDK 52 + React Native 0.76.5 with New Architecture
- **Language**: TypeScript 5.7.2
- **State Management**: Zustand 5.0.9 for global state
- **Navigation**: React Navigation v7 (bottom-tabs 7.4.8, native-stack 7.3.27)
- **UI Components**: React Native Paper 5.15.0 with custom theming
- **Animations**: React Native Reanimated 3.16.1
- **Storage**: MMKV 3.3.2 for fast, encrypted local storage
- **Gestures**: React Native Gesture Handler 2.20.0
- **Icons & Graphics**: React Native SVG 15.8.0, Expo Vector Icons 14.0.4
- **Data Fetching**: TanStack React Query 5.87.2
- **Lists**: Shopify FlashList 2.0.4 for performance
- **Permissions**: React Native Permissions 5.5.0
- **Date/Time**: Day.js 1.11.15
- **Error Boundaries**: React Error Boundary 5.0.1

## Working Tips

- **Expo Workflow**: Use Expo Go for rapid development, switch to development builds for custom native code
- **Package Manager**: Project uses pnpm 9.15.2 - avoid mixing with npm or yarn
- **Node Version**: Requires Node.js 22+ for optimal performance with latest dependencies
- **UI Updates**: The UI and data models are already wired; prefer updating copy/assets/layouts instead of ripping out modules
- **Translations**: Keep text edits in English unless expanding translations in `src/translations/`
- **New Architecture**: App uses React Native's New Architecture (Fabric + TurboModules) for better performance
- **Hot Reload**: Expo provides instant refresh - changes appear immediately without rebuilds
- **Debugging**: Use Expo DevTools, React DevTools, or Flipper for debugging
- **Platform Targets**: iOS 15+, Android API 21+ (Android 5.0+)
