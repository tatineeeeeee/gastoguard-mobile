# GastoGuard Mobile

> Guard your gastos, on the go. The native Android companion to [GastoGuard](https://gastoguard.vercel.app) — a real-time Philippine peso (₱) expense tracker built for Filipino students and young professionals.

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2056-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.85-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![Convex](https://img.shields.io/badge/Convex-Realtime-EE342F?style=for-the-badge)](https://convex.dev)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com)
[![NativeWind](https://img.shields.io/badge/NativeWind-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://nativewind.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)

A from-scratch React Native client that shares the **same Convex backend and Clerk project** as the web app — every expense, budget, and savings goal stays in sync in real time across web and mobile.

---

## Screenshots

| Sign In | Dashboard | Add Expense | Budgets |
| :-----: | :-------: | :---------: | :-----: |
| ![Sign in](docs/screenshots/sign-in.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Add expense](docs/screenshots/add-expense.png) | ![Budgets](docs/screenshots/budgets.png) |

---

## Features

### Core
- **Expense & Income Tracking** — fast custom numpad entry, category pills, swipe-to-delete, undo toast
- **Budget System** — per-category budgets with color-coded progress bars (emerald → amber → pulsing rose at 100%)
- **Utang Tracker** — Filipino debt tracking ("Utang Ko" / "Utang sa Akin") with payment history and due-date badges
- **Savings Goals** — SVG circular progress rings, contributions & withdrawals, milestone celebration alerts

### Analytics
- **Dashboard** — animated KPI cards (income / expenses / balance) with JetBrains Mono money type
- **Month Recap** — income / expenses / net with vs-last-month deltas
- **Category Comparison** — this month vs last month horizontal bars
- **Financial Health Score** — 0–100 composite shown as an animated SVG gauge
- **Insights & Streaks** — logging-streak chip and personalized insight cards

### Mobile-Native
- **Biometric Lock** — fingerprint / Face ID unlock after 5 minutes in the background (`expo-local-authentication`)
- **Receipt Capture** — attach a photo from camera or library, uploaded to Convex storage (`expo-image-picker`)
- **Push Notifications** — opt-in daily check-in reminder (`expo-notifications`, requires a dev/preview build)
- **Haptic Feedback** — tuned haptics on FAB press, submit success, swipe-delete, and goal completion

### Polish
- Skeleton loaders everywhere (no spinners), per-screen `ErrorBoundary` with retry, offline banner, and a unique empty state for every list.

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Expo SDK 56 · React Native 0.85 |
| Navigation | Expo Router (typed routes, native stack) |
| Auth | `@clerk/expo` v3 (token cache via `expo-secure-store`) |
| Backend | Convex (shared real-time deployment with web) |
| Styling | NativeWind v4 (Tailwind CSS **v3**) |
| Animation | Reanimated v4 · `react-native-gesture-handler` |
| Charts | Pure `react-native-svg` (no chart library) |
| Fonts | Inter · Plus Jakarta Sans · JetBrains Mono |

---

## Getting Started

### Prerequisites
- Node.js 20+
- An Android device or emulator (Expo Go for most features; a dev build for push notifications)
- Access to the same Clerk app and Convex deployment as the [web project](https://github.com/tatineeeeeee/gastoguard)

### Setup

```bash
# 1. Clone
git clone https://github.com/tatineeeeeee/gastoguard-mobile.git
cd gastoguard-mobile

# 2. Install dependencies
npm install

# 3. Configure environment — copy the template and fill in your keys
cp .env.example .env
```

Fill `.env` with values from the web project's `.env.local` (rename the prefix to `EXPO_PUBLIC_`):

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud
```

```bash
# 4. Run
npm start          # then press 'a' for Android, or scan the QR with Expo Go
```

> **Note:** This repo is a pure UI client. It does **not** run its own Convex backend — it copies `convex/_generated/` from the web repo as a type bridge. Never run `npx convex dev` here.

---

## Building an APK (EAS)

```bash
npm install -g eas-cli
eas login
eas init                                          # writes your projectId into app.json
eas build --platform android --profile preview    # produces a shareable .apk
```

The `preview` profile builds an installable APK; `production` builds an AAB for the Play Store. Profiles are defined in [`eas.json`](eas.json).

---

## Related

- **Web app:** [github.com/tatineeeeeee/gastoguard](https://github.com/tatineeeeeee/gastoguard) · [Live demo](https://gastoguard.vercel.app)

## License

[MIT](LICENSE)
