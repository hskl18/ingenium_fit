# Ingenium Fit

This repo now carries the full Ingenium Fit React Native application with the original multi-tab experience (home, dynamic feed, profile, messaging, etc.). Use it as the baseline to iterate on visual tweaks while keeping all existing flows intact.

The iOS client as frontend is built with React Native with TypeScript. Styling leverages a tokenized theme system with hooks and Paper components for accessibility. Hermes accelerates startup, while MMKV encrypts local storage for location, auth, and translated copy. Continuous builds target iOS 15+, with Metro bundling and CLI pipelines; Android Gradle support exists for cross-platform expansion.

Testing is covered by Jest and React Testing Library, with linting and formatting handled via ESLint, Prettier, and TypeScript. On the native side, Cocoapods manage dependencies (Maps, Media Console, adaptive-image modules). Planned extensions include:
• Knowledge-sharing posts where athletes exchange training/rehab tips.
• Doctor and rehab center reviews integrated alongside facility ratings.
• Engagement actions (comments, likes, favorites, private messaging).

## Repository Layout

- `mobile-app/` – React Native iOS/Android project (screens, navigation, services, stores, theming)
- `technical-documentation.docx` – reference specs from the earlier full-stack effort

## Prerequisites

- Node.js 20+ (specified in package.json engines)
- pnpm 8+ (package manager - specified in package.json)
- Watchman (macOS) - `brew install watchman`
- Xcode 15+ with Command Line Tools
- CocoaPods - `sudo gem install cocoapods`
- iOS Simulator or physical iOS device
- Android Studio (optional, for Android builds)

## Getting Started

1. **Clone and navigate to the project:**

   ```bash
   git clone <repository-url>
   cd mobile-app
   ```

2. **Install JavaScript dependencies:**

   ```bash
   pnpm install
   ```

3. **Install iOS native dependencies:**

   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Start the Metro bundler:**

   ```bash
   pnpm start
   ```

5. **Run the app (in a new terminal):**

   ```bash
   # For iOS
   pnpm ios

   # For Android (if configured)
   pnpm android
   ```

## Alternative: Using Xcode

You can also run the iOS app directly from Xcode:

1. Open `mobile-app/ios/kangfu_app.xcworkspace` in Xcode
2. Select your target device/simulator
3. Press Cmd+R to build and run

## Troubleshooting

### CocoaPods Issues

If you encounter pod installation issues:

```bash
cd ios
pod repo update
rm -rf Pods Podfile.lock
pod install
```

### Metro Cache Issues

If you see bundling errors:

```bash
pnpm start --reset-cache
```

### Node Modules Issues

If dependencies seem corrupted:

```bash
rm -rf node_modules
pnpm install
```

## Key Source Areas (mobile-app/src)

- `screens/` – feature screens such as `Tabbar/Home`, `Dynamic`, `Message`, etc.
- `navigation/` – React Navigation configuration for stacks and tabs.
- `components/` – reusable UI pieces.
- `store/`, `services/`, `hooks/` – state management, API wrappers, and utilities.
- `theme/`, `translations/` – styling tokens and i18n resources.

## Development Commands

```bash
# Start Metro bundler
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android

# Type checking
pnpm type:check

# Linting (if configured)
pnpm lint

# Testing (if configured)
pnpm test
```

## Project Structure

The app uses React Native 0.81.1 with New Architecture enabled and includes:

- **State Management**: Zustand for global state
- **Navigation**: React Navigation v7 with native stack and bottom tabs
- **UI Components**: React Native Paper with custom theming
- **Animations**: React Native Reanimated 3.16.7
- **Storage**: MMKV for fast, encrypted local storage
- **Gestures**: React Native Gesture Handler
- **Icons & Graphics**: React Native SVG
- **Permissions**: React Native Permissions

## Working Tips

- The UI and data models are already wired; prefer updating copy/assets/layouts instead of ripping out modules.
- Keep text edits in English unless you intend to expand the translations in `src/translations/`.
- The project uses pnpm as the package manager - avoid mixing with npm or yarn.
- iOS builds require Xcode 15+ and target iOS 15+ devices.
- The app uses React Native's New Architecture (Fabric + TurboModules).
