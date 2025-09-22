# Ingenium Fit – Project Overview

The repository focuses on the original Ingenium Fit mobile experience. Admin and backend services were removed to keep the footprint light while you iterate on the React Native app.

## Directory Layout
```
ingenium_fit/
├── mobile-app/               # React Native project with iOS & Android targets
├── README.md                 # High-level repo guide
├── PROJECT_STRUCTURE.md      # This file
└── technical-documentation.docx
```

## Mobile App Highlights
- **Framework**: React Native 0.81 + TypeScript
- **Feature Set**: Home feed, dynamic tab, personal profile, chat, rehab centre catalogue, localisation, theming, etc.
- **State & Data**: React Query, Zustand, and a services layer for remote APIs.
- **Startup Flow**: Boot splash, onboarding, authentication, and tab navigation modeled after the original product.

## Source Folder Outline (`mobile-app/src`)
```
components/         # Shared UI atoms and molecules
hooks/              # Custom hooks (network, location, theme helpers)
navigation/         # React Navigation stacks & tab configs
screens/            # Feature screens (Home, Dynamic, Message, Profile, Rehab Centre...)
services/           # API clients and request helpers
store/              # Zustand stores for session, search, etc.
theme/              # Design tokens, theming utilities, assets
translations/       # i18n resources (en-EN, zh-Hans)
utils/              # Cross-cutting helpers (upload, formatters)
```

## Recommended Workflow
1. Run `yarn install` (or `pnpm install`) inside `mobile-app/`.
2. Execute `npx pod-install` for iOS native dependencies.
3. Use `yarn start` + `yarn ios` (or Android equivalents) to preview changes.
4. Keep feature updates scoped to existing screens unless you plan a larger navigation refactor.

## Next Steps & Customisation
- Update copy and assets inside the relevant screen folders to match new branding.
- Extend Zustand stores or React Query hooks if you need additional client-side data.
- When integrating a backend again, reuse the existing services layer and environment files.

This structure mirrors the app in your screenshot, so you can continue iterating on UI/UX without rebuilding the foundation.
