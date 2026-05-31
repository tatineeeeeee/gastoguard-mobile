# GastoGuard Mobile — Build Progress Tracker

> Update this file as you complete each task. Check off items with `[x]`.
> **Stack:** Expo SDK 56 · Expo Router · @clerk/expo v3 · Convex · NativeWind v4 · Reanimated v4

---

## Week 1 — Setup + Auth
**Goal:** Clerk login screen working on physical Android device.

### Project Scaffold
- [x] Create Expo SDK 56 project with blank-typescript template
- [x] Delete default `App.tsx` and `index.ts` (Expo Router takes over entry)
- [x] Set `"main": "expo-router/entry"` in `package.json`

### Dependencies
- [x] Install Expo SDK packages: `expo-router`, `expo-font`, `expo-splash-screen`, `expo-secure-store`, `expo-web-browser`, `expo-auth-session`, `react-native-reanimated`, `react-native-gesture-handler`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`
- [x] Install `@clerk/expo` v3 (auth)
- [x] Install `convex` (same deployment as web, no new backend)
- [x] Install `nativewind` v4 + `tailwindcss` v3 (NOT v4 — different tools)
- [x] Install `@expo-google-fonts/inter`, `@expo-google-fonts/plus-jakarta-sans`, `@expo-google-fonts/jetbrains-mono`

### Configuration
- [x] `app.json` — set `"scheme": "gastoguard"` (required for Clerk OAuth), dark theme, bundle ID, permissions
- [x] `babel.config.js` — `jsxImportSource: "nativewind"` + Reanimated plugin
- [x] `metro.config.js` — `withNativeWind` wrapper pointing to `global.css`
- [x] `tailwind.config.js` — all GastoGuard design tokens (background, surface, primary, danger, accent, muted, border)
- [x] `global.css` — `@tailwind base/components/utilities`
- [x] `tsconfig.json` — strict mode + `@/*` path alias
- [x] `nativewind-env.d.ts` — eliminates `className` TypeScript errors

### Convex Type Bridge
- [x] Copy `convex/_generated/` (api.d.ts, api.js, dataModel.d.ts, server.d.ts, server.js) from web repo
- [x] Copy `convex/schema.ts` from web repo
- [ ] Fill in `.env` file — copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `NEXT_PUBLIC_CONVEX_URL` from web's `.env.local`, rename prefix to `EXPO_PUBLIC_`

### App Screens
- [x] `app/_layout.tsx` — `ClerkProvider` (with `tokenCache` via `expo-secure-store`) + `ConvexProviderWithClerk` + font loading + splash screen
- [x] `app/index.tsx` — auth gate: redirects to `(auth)` or `(app)` based on sign-in state
- [x] `app/(auth)/_layout.tsx` — redirects to app if already signed in
- [x] `app/(auth)/sign-in.tsx` — email/password + Google OAuth (dark theme, `WebBrowser.maybeCompleteAuthSession()` at top level)
- [x] `app/(auth)/sign-up.tsx` — register + 6-digit email verification flow
- [x] `app/(app)/_layout.tsx` — 5-tab bottom bar with center emerald FAB, custom `GastoGuardTabBar`
- [x] `app/(app)/index.tsx` — dashboard shell with live Convex connection status indicator
- [x] `app/(app)/expenses.tsx` — placeholder
- [x] `app/(app)/add-expense.tsx` — modal placeholder (slides up from FAB)
- [x] `app/(app)/savings.tsx` — placeholder
- [x] `app/(app)/more.tsx` — more menu with sign-out button

### Support Files
- [x] `lib/currency.ts` — `formatCurrency`, `pesosToCentavos`, `centavosToPesos` (ported from web)
- [x] `lib/constants.ts` — `DEFAULT_CATEGORIES`, `CHART_COLORS`, `BUDGET_PERIODS`
- [x] `hooks/use-current-user.ts` — Convex user sync hook (ported from web)
- [x] `.env.example` — template with required env var names

**Status:** ~~Not Started~~ | ~~In Progress~~ | **Complete** *(pending .env setup)*
**Notes:** Expo SDK 56 (not 53 as originally planned — latest stable). Reanimated is v4 (no separate Babel plugin path, uses `react-native-reanimated/plugin`). NativeWind v4 MUST use Tailwind v3, not v4.

---

## Week 2 — Dashboard + Expenses
**Goal:** Real expenses from Convex shown on mobile. Add-expense form working.

### Dashboard
- [ ] Wire up `api.analytics.getMonthSummary` to KPI cards (Income / Expenses / Balance this month)
- [ ] Build animated `MoneyText` component — JetBrains Mono, color based on type (green=income, rose=expense)
- [ ] Build `RecentTransactionsList` — `FlatList` with category icon bubble, description, relative date, amount
- [ ] Build `SkeletonCard` and `SkeletonList` components (no spinners, ever)
- [ ] Relative date helper: "Today", "Yesterday", "3 days ago", "Jun 1"

### Expense List Screen
- [ ] Full `FlatList` of expenses from `api.expenses.list` with pagination
- [ ] Filter bar: All / Income / Expense toggle
- [ ] Swipe-to-delete on expense row (Reanimated v4 `useAnimatedStyle` + `useSharedValue`)
- [ ] Empty state with illustration + "Add your first expense" CTA

### Add Expense Form
- [ ] Custom numpad component (0-9 keys + decimal + backspace)
- [ ] Amount display in JetBrains Mono at top of modal (₱ formatted, updates as typed)
- [ ] Expense / Income toggle (rose / emerald)
- [ ] Category selector — horizontal `ScrollView` of category pills from `api.categories.list`
- [ ] Description `TextInput`
- [ ] Date picker (default today, tap to change)
- [ ] Submit → `api.expenses.create` → close modal → show success toast

### Edit / Delete
- [ ] `app/(app)/expense/[id].tsx` — detail/edit screen
- [ ] Long-press on expense row → action sheet (Edit / Delete)
- [ ] Delete with undo toast (5-second window matching web behavior)

**Status:** Not Started
**Notes:** Amounts always in centavos integers. Dates as Unix ms. Use `pesosToCentavos()` before submitting.

---

## Week 3 — Budget + Utang
**Goal:** Budget progress bars working. Utang tracker screen complete.

### Budgets
- [ ] `app/(app)/budgets.tsx` — screen accessible from More tab
- [ ] Build `BudgetCard` — category name, period, progress bar, spent/limit amounts
- [ ] `ProgressBar` component — emerald (0–79%) → amber (80–99%) → pulsing rose (≥100%)
- [ ] Add Budget form: category picker, amount input (numpad), period selector
- [ ] Wire up `api.budgets.list` (with `getWithSpending` for real-time spent amount)
- [ ] Wire up `api.budgets.create` and `api.budgets.delete`
- [ ] Empty state: "No budgets yet — set one to track your spending"
- [ ] Budget threshold alert: show warning badge when ≥ 80%

### Utang Tracker
- [ ] `app/(app)/utang.tsx` — screen accessible from More tab
- [ ] "I Owe" / "Owed to Me" tab switcher at top
- [ ] Build `DebtCard` — person name, total, paid, remaining, progress bar, due date badge
- [ ] Add Debt form: person name, type, amount, due date (optional), notes
- [ ] Mark payment: bottom sheet with amount input → `api.debtPayments.create`
- [ ] Settle debt: mark as fully paid → `api.debts.settle`
- [ ] Wire up `api.debts.list`, `api.debts.create`, `api.debtPayments.create`
- [ ] Empty state for each tab

**Status:** Not Started
**Notes:** Debt `type` is `"owed_to_me"` or `"i_owe"` — drives tab placement. Progress bar on debts uses danger color for overdue, accent for approaching due date.

---

## Week 4 — Savings + Analytics
**Goal:** Savings goals with visual progress. Analytics charts with real data.

### Savings Goals
- [ ] `app/(app)/savings.tsx` — replace placeholder with real screen
- [ ] Build `SavingsGoalCard` — goal name, icon, target/saved amounts, circular progress ring
- [ ] Circular progress ring component (SVG-based, no external library)
- [ ] Add Savings Goal form: name, icon picker (emoji), target amount, deadline
- [ ] Add Contribution bottom sheet: amount input → `api.savingsContributions.create`
- [ ] Completion confetti: trigger `react-native-confetti-cannon` when goal reaches 100%
- [ ] Wire up `api.savingsGoals.list`, `api.savingsGoals.create`, `api.savingsContributions.create`
- [ ] Empty state with "Start saving towards a goal" CTA

### Charts Setup
- [ ] Install `victory-native` + `@shopify/react-native-skia` (`npx expo install @shopify/react-native-skia`)
- [ ] Wrap root layout with `<SkiaValueHost>` from `@shopify/react-native-skia`

### Analytics Screen
- [ ] `app/(app)/analytics.tsx` — accessible from More tab
- [ ] Monthly spending bar chart (victory-native `VictoryBar`, last 6 months)
- [ ] Category breakdown donut chart (`VictoryPie`)
- [ ] Financial health score card — circular gauge 0–100 from `api.analytics.getHealthScore`
- [ ] Spending trend: this month vs last month comparison
- [ ] Wire up `api.analytics.getMonthSummary`, `api.analytics.getCategoryBreakdown`, `api.analytics.getHealthScore`

**Status:** Not Started
**Notes:** Charts need Skia — can't use Recharts from web (DOM-only). Victory Native XL uses Skia canvas for smooth 60fps.

---

## Week 5 — Mobile-Native Features
**Goal:** Biometric login, receipt camera, push notifications.

### Biometric Login
- [ ] Install `expo-local-authentication` (`npx expo install expo-local-authentication`)
- [ ] `hooks/use-biometric-auth.ts` — check availability, store pref in SecureStore, trigger on app foreground
- [ ] Biometric unlock prompt on app resume (if user opted in)
- [ ] Toggle in Settings: "Use Face ID / Fingerprint"

### Receipt Camera
- [ ] Install `expo-image-picker` (`npx expo install expo-image-picker`)
- [ ] Add "Attach Receipt" button in add-expense form
- [ ] On tap: show action sheet (Camera / Photo Library)
- [ ] On image selected: upload to Convex storage via `api.expenses.generateUploadUrl`
- [ ] Show receipt thumbnail in expense detail screen
- [ ] Tap thumbnail → full-screen image viewer

### Push Notifications
- [ ] Install `expo-notifications` (`npx expo install expo-notifications`)
- [ ] **Note:** Requires development build — does NOT work in Expo Go for Android
- [ ] Build dev build: `eas build --profile development --platform android`
- [ ] Register for push token → save to user's Convex record
- [ ] Bill reminder notification: scheduled local notification for upcoming recurring transactions
- [ ] Daily check-in notification (opt-in, 9pm): "Log your expenses for today"

### Haptic Feedback
- [ ] Install `expo-haptics` (`npx expo install expo-haptics`)
- [ ] `hooks/use-haptics.ts` — wrapper for `Haptics.impactAsync()`
- [ ] Add haptics to: FAB press, expense submit, swipe-to-delete, budget warning

**Status:** Not Started
**Notes:** Push notifications require a dev build, not Expo Go. `eas build --profile development --platform android` creates a `.apk` that includes the Expo dev client. This is different from the preview APK built in Week 7.

---

## Week 6 — Polish
**Goal:** No loading/error/empty states missing. Smooth navigation. App feels finished.

### Empty States
- [ ] Every list screen has a unique empty state illustration (emoji + heading + subtext + CTA button)
- [ ] Dashboard: "No transactions yet" with add-expense CTA
- [ ] Expenses: "No expenses this month" with filter reset option
- [ ] Budgets: "Set a budget to control your spending"
- [ ] Utang: separate empties for each tab
- [ ] Savings: "Start your first savings goal"
- [ ] Analytics: "Add at least 5 transactions to see insights"

### Error States
- [ ] `ErrorBoundary` wrapper component for screens with Convex queries
- [ ] Network error banner (detect offline state)
- [ ] Retry button on all failed queries

### Loading States
- [ ] Skeleton for every screen that fetches data (no `ActivityIndicator` spinners, ever)
- [ ] `SkeletonCard`, `SkeletonList`, `SkeletonText` primitive components

### Navigation Polish
- [ ] Smooth back gesture (confirm `react-native-screens` native stack is active)
- [ ] Keyboard avoiding works correctly on all forms
- [ ] Safe area respected on all screens (top notch + bottom home indicator)
- [ ] Tab bar hides when keyboard is open

### Visual Polish
- [ ] App icon (1024×1024 PNG): emerald `₱` on `#0F172A` background
- [ ] Splash screen matches: dark background, same icon, `resizeMode: "contain"`
- [ ] Consistent heading style across all screens (`PlusJakartaSans_700Bold`)
- [ ] Consistent spacing (24px horizontal padding everywhere)
- [ ] All financial amounts in `JetBrainsMono_500Medium` — no exceptions
- [ ] Budget progress bar color transitions animated (not instant)

### Performance
- [ ] `React.memo` on `ExpenseRow`, `BudgetCard`, `DebtCard`, `SavingsGoalCard`
- [ ] `useCallback` on all list-item handlers (onPress, onDelete, onEdit)
- [ ] `keyExtractor` on all `FlatList`s using Convex `_id`

**Status:** Not Started
**Notes:** Polish week is about completeness, not new features. Every screen must handle all three states: loading, empty, error.

---

## Week 7 — Ship It
**Goal:** Working APK on GitHub Releases. Clean README with screenshots.

### EAS Build Setup
- [ ] Install EAS CLI globally: `npm install -g eas-cli`
- [ ] Login: `eas login` (uses your Expo account)
- [ ] Configure: `eas build:configure` → generates `eas.json`
- [ ] Edit `eas.json` to add APK profile:
  ```json
  {
    "build": {
      "preview": { "android": { "buildType": "apk" } },
      "production": { "android": { "buildType": "app-bundle" } }
    }
  }
  ```
- [ ] Fill in `extra.eas.projectId` in `app.json` with the ID from `eas build:configure`

### Build + Test
- [ ] Run: `eas build --platform android --profile preview`
- [ ] Download `.apk` from EAS dashboard
- [ ] Install on physical Android device and smoke-test all features
- [ ] Fix any production-only bugs found

### GitHub
- [ ] Create GitHub Release v1.0.0 and attach the `.apk` file
- [ ] Write `README.md`:
  - [ ] Project description + "Filipino expense tracker built with React Native"
  - [ ] Screenshots (at least 4: sign-in, dashboard, add expense, budgets)
  - [ ] Tech stack badges (Expo, React Native, Convex, Clerk, NativeWind)
  - [ ] Setup instructions (clone, install, fill `.env`, run)
  - [ ] Link to web version (`gastoguard` repo)
- [ ] `git push origin main` — all 7 weeks of commits visible

**Status:** Not Started
**Notes:** APK size will be ~80–120MB (Hermes engine + JS bundle). This is normal for Expo managed workflow. For the Play Store in the future, use `buildType: "app-bundle"` (AAB) instead.

---

## Quick Reference

### Design Tokens
```
background: #0F172A  surface: #1E293B  border: #334155
primary: #10B981     danger: #F43F5E   accent: #F59E0B
text: #F8FAFC        muted: #94A3B8
```

### Typography Rules
- Headings → `PlusJakartaSans_700Bold`
- Body → `Inter_400Regular` / `Inter_500Medium` / `Inter_600SemiBold`
- ALL money amounts → `JetBrainsMono_500Medium` (no exceptions)

### Amount Rules
- Store as **centavos integers**: ₱100.50 = `10050`
- Convert before submit: `pesosToCentavos(parseFloat(input))`
- Display: `formatCurrency(centavos)` from `lib/currency.ts`

### Convex Type Bridge
When the web project updates its schema or functions, re-copy these files:
```
d:\Justine\gastoguard\convex\_generated\  →  convex\_generated\
d:\Justine\gastoguard\convex\schema.ts    →  convex\schema.ts
```
