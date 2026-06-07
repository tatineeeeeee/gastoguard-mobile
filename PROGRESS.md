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
- [x] Wire up `api.expenses.getSummary` to KPI cards (Income / Expenses / Balance this month)
- [x] Build animated `MoneyText` component — JetBrains Mono, color based on type (green=income, rose=expense)
- [x] Build `RecentTransactionsList` — `FlatList` with category icon bubble, description, relative date, amount
- [x] Build `SkeletonCard` and `SkeletonList` components (no spinners, ever)
- [x] Relative date helper: "Today", "Yesterday", "3 days ago", "Jun 1"

### Expense List Screen
- [x] Full `FlatList` of expenses from `api.expenses.list` with pagination (`usePaginatedQuery`)
- [x] Filter bar: All / Income / Expense toggle
- [x] Swipe-to-delete on expense row (`ReanimatedSwipeable` from gesture-handler v2)
- [x] Empty state with illustration + "Add your first expense" CTA

### Add Expense Form
- [x] Custom numpad component (0-9 keys + decimal + backspace)
- [x] Amount display in JetBrains Mono at top of modal (₱ formatted, updates as typed)
- [x] Expense / Income toggle (rose / emerald)
- [x] Category selector — horizontal `ScrollView` of category pills from `api.categories.list`
- [x] Description `TextInput`
- [x] Date picker (default today, tap to change) — `react-native-ui-datepicker` shadcn-style
- [x] Submit → `api.expenses.create` → close modal → show success toast

### Edit / Delete
- [x] `app/(app)/expense/[id].tsx` — detail/edit screen
- [x] Long-press on expense row → action sheet (Edit / Delete)
- [x] Delete with undo toast (5-second window matching web behavior)

**Status:** ~~Not Started~~ | **Complete**
**Notes:** Amounts always in centavos integers. Dates as Unix ms. Use `pesosToCentavos()` before submitting. Used `api.expenses.getSummary` (not `api.analytics.getMonthSummary`) for dashboard — direct, no date-range calculation needed for the query itself.

---

## Week 3 — Budget + Utang
**Goal:** Budget progress bars working. Utang tracker screen complete.

### Budgets
- [x] `app/(app)/budgets.tsx` — screen accessible from More tab
- [x] Build `BudgetCard` — category name, period, progress bar, spent/limit amounts
- [x] `ProgressBar` component — emerald (0–79%) → amber (80–99%) → pulsing rose (≥100%)
- [x] Add Budget form: category picker, amount input (numpad), period selector
- [x] Wire up `api.budgets.getWithSpending` (real-time spent + percentage)
- [x] Wire up `api.budgets.create` and `api.budgets.remove`
- [x] Empty state: "No budgets yet — set one to track your spending"
- [x] Budget threshold alert: warning badge when ≥ 80%, over-budget badge at 100%

### Utang Tracker
- [x] `app/(app)/utang.tsx` — screen accessible from More tab
- [x] "Utang Ko" / "Utang sa Akin" tab switcher at top
- [x] Build `DebtCard` — person name, total, paid, remaining, progress bar, due date badge
- [x] Add Debt form: person name, type, amount, due date (optional + Switch), notes
- [x] Mark payment: modal route `debt/[id]/pay` with numpad → `api.debts.addPayment`
- [x] Settle debt: confirm Alert → `api.debts.settle`
- [x] Wire up `api.debts.list`, `api.debts.create`, `api.debts.addPayment`, `api.debts.getSummary`
- [x] Empty state for each tab + DebtSummaryHeader (owed-to-me / I-owe / net)

**Status:** ~~Not Started~~ | **Complete**
**Notes:** Payment API is `api.debts.addPayment` (not `api.debtPayments.create` — that table exists but has no public mutation). Debt progress bar uses inverse color (higher % = greener, rewarding paydown). Due date badge: Overdue (rose) / Due ≤3d (amber) / Due (muted).

---

## Week 4 — Savings + Analytics
**Goal:** Savings goals with visual progress. Analytics charts with real data.

### Savings Goals
- [x] `app/(app)/savings.tsx` — replace placeholder with real screen
- [x] Build `SavingsGoalCard` — goal name, icon, target/saved amounts, circular progress ring
- [x] Circular progress ring component (SVG-based via `react-native-svg`, no extra library)
- [x] Add Savings Goal form: name, emoji icon picker, color swatch, target amount, deadline toggle
- [x] Add Contribution bottom sheet: amount numpad + notes → `api.savingsGoals.addContribution`
- [x] Add Withdrawal bottom sheet: subtract from goal → `api.savingsGoals.withdrawContribution`
- [x] Completion alert when goal reaches 100%
- [x] Wire up `api.savingsGoals.list`, `api.savingsGoals.create`, `api.savingsGoals.addContribution`, `api.savingsGoals.withdrawContribution`, `api.savingsGoals.remove`, `api.savingsGoals.getSummary`
- [x] Empty state with "Start saving towards a goal" CTA

### Charts Setup
- [x] No external chart library needed — pure `react-native-svg` (already installed) for circular gauges; View-based flexbox bars for category comparison

### Analytics Screen
- [x] `app/(app)/analytics.tsx` — accessible from More tab
- [x] Month recap cards (income / expenses / net) with vs-last-month badge
- [x] Category comparison horizontal bars (this month vs last month, View-based flexbox)
- [x] Financial health score circular gauge (SVG, 0–100, colour-coded)
- [x] Insights section with logging streak chip
- [x] Wire up `api.analytics.getMonthlySummaryRecap`, `api.analytics.getCategoryComparison`, `api.analytics.getFinancialHealthScore`, `api.analytics.getInsights`, `api.analytics.getLoggingStreak`

**Status:** ~~Not Started~~ | **Complete**
**Notes:** Charts built with pure `react-native-svg` (already installed) — no victory-native/Skia needed. SVG `strokeDasharray`/`strokeDashoffset` for circular rings; View-based flexbox bars for category comparison. Actual Convex function names: `getFinancialHealthScore` (not `getHealthScore`), `getMonthlySummaryRecap` (not `getMonthSummary`), `getCategoryComparison` (not `getCategoryBreakdown`).

---

## Week 5 — Mobile-Native Features
**Goal:** Biometric login, receipt camera, push notifications.

### Biometric Login
- [x] Install `expo-local-authentication` (`npx expo install expo-local-authentication`)
- [x] `hooks/use-biometric-auth.ts` — check availability, store pref in SecureStore
- [x] Biometric unlock screen (`app/(auth)/biometric-lock.tsx`) triggered after 5 min in background
- [x] AppState listener in root layout — `backgroundedAt` ref tracks time in background
- [x] Toggle in More screen: "Biometric Login" switch (shown only if hardware available)

### Receipt Camera
- [x] Install `expo-image-picker` (`npx expo install expo-image-picker`)
- [x] `components/expenses/ReceiptPicker.tsx` — "Attach Receipt" button with camera / photo library action sheet
- [x] Upload to Convex storage via `api.expenses.generateUploadUrl` → stores `receiptId` (v.id("_storage"))
- [x] `app/(app)/expense/[id].tsx` — show receipt thumbnail; tap for full-screen viewer

### Push Notifications
- [x] Install `expo-notifications` (`npx expo install expo-notifications`)
- [x] `hooks/use-push-notifications.ts` — register token; saves to Convex user record
- [ ] **Note:** Requires development build — does NOT work in Expo Go for Android
- [ ] Build dev build: `eas build --profile development --platform android`
- [ ] Daily check-in notification (opt-in, 9pm): "Log your expenses for today"

### Haptic Feedback
- [x] Install `expo-haptics` (`npx expo install expo-haptics`)
- [x] `hooks/use-haptics.ts` — wrapper for all `Haptics.impactAsync()` / `notificationAsync()` variants
- [x] Haptics wired to: FAB press, expense submit success, swipe-to-delete, over-budget render, goal completion

**Status:** ~~Not Started~~ | **Complete** *(push delivery requires dev build — registration hook done)*
**Notes:** Receipt upload uses Convex storage — field is `receiptId: v.id("_storage")` (not a URL string). Push notifications registered but delivery requires `eas build --profile development --platform android`. Biometric triggers only after 5+ minutes in background (not every resume) for better UX.

---

## Week 6 — Polish
**Goal:** No loading/error/empty states missing. Smooth navigation. App feels finished.

### Empty States
- [x] Every list screen has a unique empty state illustration (emoji + heading + subtext + CTA button)
- [x] Dashboard: "No transactions yet" with add-expense CTA
- [x] Expenses: "No expenses this month" with filter reset option
- [x] Budgets: "Set a budget to control your spending"
- [x] Utang: separate empties for each tab
- [x] Savings: "Start your first savings goal"
- [x] Analytics: inline "No expense data for this month yet" in category card

### Error States
- [x] `ErrorBoundary` wrapper component for screens with Convex queries (`components/ui/ErrorBoundary.tsx`)
- [x] Network error banner — `@react-native-community/netinfo` + `OfflineBanner` + `useNetworkStatus`
- [x] Retry button on all failed queries (via ErrorBoundary "Try again" action)

### Loading States
- [x] Skeleton for every screen that fetches data (no `ActivityIndicator` spinners, ever)
- [x] `SkeletonCard`, `SkeletonList`, `SkeletonText` primitive components (`components/ui/Skeleton.tsx`)

### Navigation Polish
- [x] Smooth back gesture (native stack active via expo-router / react-native-screens)
- [x] Keyboard avoiding works correctly on all forms (KeyboardAvoidingView in FormSheet + auth screens)
- [x] Safe area respected on all screens (useSafeAreaInsets on all screens)
- [x] Tab bar hides when keyboard is open (Keyboard listener in GastoGuardTabBar)

### Visual Polish
- [x] App icon (1024×1024 PNG): emerald `₱` on `#0F172A` background (all assets present)
- [x] Splash screen matches: dark background, same icon, `resizeMode: "contain"`
- [x] Consistent heading style across all screens (`PlusJakartaSans_700Bold`)
- [x] Consistent spacing (24px horizontal padding everywhere)
- [x] All financial amounts in `JetBrainsMono_500Medium` — no exceptions
- [x] Budget progress bar color transitions animated (ProgressBar uses Reanimated)

### Performance
- [x] `React.memo` on `ExpenseListItem`, `BudgetCard`, `DebtCard`, `SavingsGoalCard`, `TransactionRow`
- [x] `useCallback` on all list-item handlers (onPress, onDelete, onEdit)
- [x] `keyExtractor` on all `FlatList`s using Convex `_id`

**Status:** ~~Not Started~~ | **Complete**
**Notes:** Most states were already implemented in Weeks 1–5. Week 6 added: `ErrorBoundary` (class component, catches Convex query throws), `@react-native-community/netinfo` + `OfflineBanner` (animated amber overlay), `SkeletonText` alias, and keyboard-hide for tab bar. All 6 data screens wrapped in per-screen ErrorBoundary with "Try again" retry.

---

## Week 7 — Ship It
**Goal:** Working APK on GitHub Releases. Clean README with screenshots.

### EAS Build Setup
- [x] Author `eas.json` with `development` (dev-client apk), `preview` (apk / internal), and `production` (app-bundle / store) profiles — `appVersionSource: "remote"`
- [x] Un-ignore `eas.json` in `.gitignore` (no secrets; belongs in the repo)
- [ ] Install EAS CLI globally: `npm install -g eas-cli` *(account-bound — run locally)*
- [ ] Login: `eas login` (uses your Expo account)
- [ ] Run `eas init` → writes the real `projectId` into `app.json` (replaces the `YOUR_EAS_PROJECT_ID` placeholder)

### Build + Test
- [ ] Run: `eas build --platform android --profile preview`
- [ ] Download `.apk` from EAS dashboard
- [ ] Install on physical Android device and smoke-test all features
- [ ] Fix any production-only bugs found

### GitHub
- [x] Write `README.md`:
  - [x] Project description + "Filipino peso expense tracker built with React Native"
  - [x] Screenshots section (sign-in, dashboard, add expense, budgets) → drop PNGs in `docs/screenshots/`
  - [x] Tech stack badges (Expo, React Native, Convex, Clerk, NativeWind, TypeScript)
  - [x] Setup instructions (clone, install, fill `.env`, run) + EAS build section
  - [x] Link to web version (`gastoguard` repo + live demo)
- [ ] Capture the 4 screenshots and add them to `docs/screenshots/`
- [ ] Create GitHub Release v1.0.0 and attach the `.apk` file
- [ ] `git push origin main` — all 7 weeks of commits visible

**Status:** ~~Not Started~~ | **In Progress** *(config + README done; EAS build / screenshots / release are account- and device-bound, see Notes)*
**Notes:** APK size will be ~80–120MB (Hermes engine + JS bundle) — normal for the Expo managed workflow. For the Play Store later, the `production` profile already builds an AAB (`buildType: "app-bundle"`). The EAS login/init/build steps require your Expo account and a device, so they can't be run from here — exact commands are in `README.md` → "Building an APK (EAS)". `eas init` overwrites the `extra.eas.projectId` placeholder in `app.json`.

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
