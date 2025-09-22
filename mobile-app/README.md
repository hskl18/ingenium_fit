# Ingenium Fit Mobile App

React Native client that delivers the patient-facing rehabilitation experience.

## Prerequisites
- Node.js ≥ 20
- pnpm 9
- Xcode 15+ with Command Line Tools
- CocoaPods (`sudo gem install cocoapods`)

## Setup
```bash
pnpm install --no-frozen-lockfile
pnpm pod-install
cp .env .env.local # adjust API_URL, S3 keys, etc.
```

## Development
```bash
pnpm start              # Metro bundler
pnpm ios -- --simulator "iPhone 17 Pro"   # Launch iOS simulator
# or open ios/kangfu_app.xcworkspace in Xcode and run
```

Metro caches exports; restart with `pnpm start --reset-cache` if you see stale module warnings.

## Project Layout
- `src/components/` UI atoms, molecules, and organisms
- `src/screens/` screen-level containers
- `src/hooks/`, `src/services/`, `src/store/` domain logic and state management
- `ios/`, `android/` native projects (keep pods/gradle in sync with JavaScript deps)

## Testing & Linting
```bash
pnpm test       # Jest
pnpm lint       # ESLint + Prettier + type check
```

## Build Artifacts
- Android: `pnpm build:android` / `pnpm build:android-debug`
- iOS release builds are handled through Xcode archive/export.
