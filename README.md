# Ingenium Fit – Adaptive Sport Navigator

Ingenium Fit is a mixed-methods research prototype that explores how an iOS-based adaptive sport navigator can reduce barriers faced by athletes with disabilities. The app curates Pasadena resources, facilitates peer knowledge exchange, surfaces rehabilitation reviews, and embeds an AI assistant to help athletes plan transport, request equipment, and stay engaged with their care team.

The project was submitted to the **2025 Google IgniteCS Programming Expo** (Mobile & Web · Individual). Research goals focus on measuring changes in confidence, participation, and perceived accessibility by combining in-app surveys, analytics, and interviews with athletes and community partners.

## Core Capabilities

- **Local discovery hub** – browse adaptive sport programs, rehab centers, transit tips, and equipment grants targeted to Pasadena.
- **Community storytelling** – post updates, share rehab and training strategies, react, save, and privately message other athletes.
- **Rehab intelligence** – rate facilities and doctors, review accessibility amenities, and bookmark favourites for quick comparison.
- **Navigator messaging** – chat with a volunteer sports navigator and leverage an AI assistant (OpenAI `gpt-5-chat-latest`) for instant suggestions.
- **Research instrumentation** – built-in surveys, engagement analytics, and exportable insights for mixed-method evaluation.

## Architecture Snapshot

- **Framework**: Expo SDK 52 · React Native 0.76 with Fabric/TurboModules enabled.
- **Language**: TypeScript 5.
- **State & Data**: Zustand for lightweight state, TanStack Query for networking, MMKV for secure storage.
- **UI System**: React Native Paper + custom theming tokens (light/dark aware, accessible typography).
- **Lists & Performance**: FlashList, Reanimated 3, Gesture Handler 2.
- **AI Layer**: `src/services/openai.ts` securely reads the `openai_api` key from `.env` via `app.config.js`.

## Repository Layout

```
├── app.config.js        # Expo configuration (loads secrets from .env)
├── assets/              # Icons, splash screens, illustrations
├── src/
│   ├── components/      # Atoms/Molecules/Templates
│   ├── hooks/           # Custom hooks, i18n helpers
│   ├── navigation/      # Stack + tab configuration
│   ├── screens/         # Feature modules (Home, Dynamic feed, Messaging, Research tools)
│   ├── services/        # API clients (mock + live), AI helper
│   ├── store/           # Zustand slices
│   ├── theme/           # Tokenized theming + typings
│   └── translations/    # Localized copy scaffolding
└── README.md
```

## Prerequisites

- Node.js **22+**
- pnpm **9+** (`corepack enable` recommended)
- Expo CLI (`npm install -g @expo/cli`)
- Watchman (macOS) · Xcode 15+ (iOS) · Android Studio (Android)

## Getting Started

```bash
git clone <repository-url>
cd ingenium-fit
pnpm install
pnpm start
```

Scan the QR code in Expo Go or press `i`/`a` to launch the iOS simulator/Android emulator.

### Development Builds (optional)

```bash
npx expo run:ios --device
npx expo run:android --device
```

### Useful scripts

```bash
pnpm start       # Expo dev server
pnpm ios         # Run on iOS simulator
pnpm android     # Run on Android emulator
pnpm lint        # ESLint (Expo lint)
pnpm type:check  # tsconfig type checking
```

## Troubleshooting

- **Clear caches**: `npx expo start --clear`
- **Metro reset**: `pnpm start --reset-cache`
- **Pod install** (iOS): `cd ios && pod install --repo-update`
- **Expo doctor**: `npx expo doctor`

## Notes for Contributors

- Store secrets in `.env` (e.g., `openai_api=sk-...`). Expo loads them via `extra` in `app.config.js`.
- Keep copy edits mirrored in `src/translations` for future localization.
- MMKV is fall-backed to in-memory storage inside Expo Go; warnings are expected in development.
- The AI assistant uses optimistic UI updates—avoid blocking calls in the chat screen to maintain responsiveness.
- When adding data-driven features, favour React Query mutations/queries to stay consistent with the existing cache model.

## License

This repository is provided for research and educational use in conjunction with the IgniteCS Programming Expo submission.

more info https://docs.google.com/presentation/d/1PuFshxsBYVaxrjABdLOmHkKQMCQ_yPn-mvbmKFgBVeE/edit?usp=sharing
