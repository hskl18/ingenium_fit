# Ingenium Fit

This repo now carries the full Ingenium Fit React Native application with the original multi-tab experience (home, dynamic feed, profile, messaging, etc.). Use it as the baseline to iterate on visual tweaks while keeping all existing flows intact.

## Repository Layout
- `mobile-app/` – React Native iOS/Android project (screens, navigation, services, stores, theming)
- `technical-documentation.docx` – reference specs from the earlier full-stack effort

## Prerequisites
- Node.js 20+
- Watchman (macOS)
- Xcode 15 with Command Line Tools
- CocoaPods (`sudo gem install cocoapods`)
- Android Studio (only if you plan to ship Android builds)

## Getting Started
1. Install JavaScript dependencies (choose one package manager):
   ```bash
   cd mobile-app
   yarn install        # or: pnpm install --no-frozen-lockfile
   ```
2. Install native iOS pods:
   ```bash
   npx pod-install
   ```
3. Start Metro and run the app:
   ```bash
   yarn start
   yarn ios            # or open ios/kangfu_app.xcworkspace in Xcode
   ```

## Key Source Areas (mobile-app/src)
- `screens/` – feature screens such as `Tabbar/Home`, `Dynamic`, `Message`, etc.
- `navigation/` – React Navigation configuration for stacks and tabs.
- `components/` – reusable UI pieces.
- `store/`, `services/`, `hooks/` – state management, API wrappers, and utilities.
- `theme/`, `translations/` – styling tokens and i18n resources.

## Working Tips
- The UI and data models are already wired; prefer updating copy/assets/layouts instead of ripping out modules.
- Keep text edits in English unless you intend to expand the translations in `src/translations/`.
- Use `yarn lint` and `yarn test` to stay aligned with the existing tooling before committing changes.
