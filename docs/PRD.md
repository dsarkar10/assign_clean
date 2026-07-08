# PRD — Clear Energy 3-App Take-Home
**App Developer Hire · Clear Thermal Energy (OPC) Pvt Ltd (trading as Clear Energy)**
Author: Prit Pratyush Kumar Behera · Prepared: 08 July 2026
Submission deadline: 48 hours from brief receipt (23 May 2026) · Time budget: 1.5 hrs focused work

---

## 1. Objective

Build a monorepo containing three React Native (Expo) apps — **Customer**, **Driver**, **Admin Mobile** — that each render one screen of live data pulled through **one shared, typed API client** and **one shared `<OrderCard />` component**. The grading rubric explicitly rewards *not duplicating code across apps*, so the single decision that matters most here is: get `packages/shared` right before touching any screen.

**What "done" looks like:** 3 apps run (`expo start`), each hits `json-server` on `:4000`, each renders loading → empty → error → success states, one Vitest test passes, README is honest about hours and AI usage, repo is pushed and emailed.

---

## 2. Non-Goals (explicitly out of scope per brief §5)

Auth, real backend, payments, iOS polish, localisation, push notifications, extra test coverage, E2E tests. Do not spend time here even if tempted — it costs rubric points elsewhere (time is the real constraint, not feature count).

---

## 3. Project Directory Structure

```
clear-energy-takehome/
├── apps/
│   ├── customer/                    # "Today's Orders" screen
│   │   ├── App.tsx
│   │   ├── app.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── screens/
│   │           └── TodaysOrdersScreen.tsx
│   │
│   ├── driver/                      # "Today's Trip" screen
│   │   ├── App.tsx
│   │   ├── app.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── screens/
│   │           └── TodaysTripScreen.tsx
│   │
│   └── admin-mobile/                # "Pending Actions" screen
│       ├── App.tsx
│       ├── app.json
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── screens/
│               └── PendingActionsScreen.tsx
│
├── packages/
│   └── shared/
│       ├── package.json
│       ├── tsconfig.json
│       ├── theme/
│       │   └── tokens.ts              # Midnight Purple tokens: pitch black, purple accents
│       ├── types/
│       │   ├── order.ts             # Order, OrderStatus, per-app view types
│       │   └── api.ts                # response envelope types per endpoint
│       ├── api/
│       │   ├── client.ts             # typed fetch wrapper: get/post, abort, retry
│       │   └── endpoints.ts           # getOrders, getTrip, getPendingActions
│       ├── components/
│       │   ├── GlassIconButton.tsx    # Frosted circular button primitive
│       │   ├── StatCard.tsx           # Flat dark card primitive
│       │   └── OrderCard.tsx          # ONE component, 3 render modes (now includes Start Trip button for drivers)
│       ├── utils/
│       │   ├── formatPrice.ts         # paise -> ₹1,23,456
│       │   └── formatPrice.test.ts    # Vitest unit test (R6)
│       └── index.ts                   # barrel export
│
├── mock-api.json                     # json-server fixture data
├── openapi.yaml                       # copied from brief, unmodified
├── package.json                       # root — npm workspaces config
├── tsconfig.base.json                 # shared compiler options
├── .nvmrc
├── README.md                          # setup, decisions, cuts, AI usage, hours
└── .gitignore
```

**Why npm workspaces over Turborepo/Nx:** three tiny apps, 1.5-hour budget, zero build-pipeline complexity needed. Turborepo would be defensible ("build cache, task graph") but is overkill here and burns setup time the rubric doesn't reward at this scale. State this trade-off explicitly in the README — the rubric's top band for "Repo structure" wants *justification*, not necessarily the fanciest tool.

---

## 4. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| App framework | **Expo (latest stable, SDK 52+)** | Brief prefers it; no native build step needed for a 1.5-hr task |
| Language | **TypeScript**, strict mode | R2 hard requirement |
| Navigation | **React Navigation** (native-stack) | Required even for single-screen stack, keeps door open for live-review "add 4th screen" ask |
| Server state | **TanStack Query (React Query) v5** | Preferred by brief; gives loading/error/success states almost for free, avoids hand-rolled `useEffect` fetch logic |
| Local/UI state | **useState/useReducer** | No global state needed for one screen each; Zustand would be over-engineering |
| API client | **Native `fetch`** wrapped by hand in `packages/shared/api/client.ts` | Axios adds a dependency for no real benefit at 3 endpoints; a plain wrapper is easier to demonstrate abort/idempotency reasoning in the live review |
| Monorepo tool | **npm workspaces** | See §3 justification |
| Testing | **Vitest** | Faster cold start than Jest in a workspace setup; one test only (R6) |
| Mock backend | **json-server** on port 4000 | Given in brief |
| Styling | React Native `StyleSheet` | No UI library — keeps shared `OrderCard` dependency-free and portable across 3 apps |

---

## 5. Shared Package Design (the part that's actually graded)

### 5.1 Types (`packages/shared/types/order.ts`)
One canonical `Order` type with optional fields covering all three API shapes (customer name, address, ETA, SKU, amount in paise, status, action label). Each app's screen narrows this to what it needs via props — never duplicates the shape.

### 5.2 API client (`packages/shared/api/client.ts`)
Single `apiClient.get<T>(path, { signal })` wrapper handling:
- success → typed JSON
- non-2xx → thrown `ApiError` with status code
- network failure → thrown `ApiError` with `cause`
- abort on unmount → pass `AbortController.signal` through, caught silently
- idempotency key stub on writes (`X-Idempotency-Key` header helper), unused today but wired per R3, called out in README as "ready for Phase 2 writes"

### 5.3 `<OrderCard />` (`packages/shared/components/OrderCard.tsx`)
One component, `variant: 'customer' | 'driver' | 'admin'` prop switches which sub-fields render (status pill vs. prominent ETA badge + address + 'Start Trip' button vs. action chip). Rubric's top band wants "composable, named slots" — a lightweight `variant` + optional `renderAction` slot prop gets there without overbuilding.

### 5.4 Price formatter (`packages/shared/utils/formatPrice.ts`)
`formatPaiseToINR(paise: number): string` → `₹1,23,456` using `Intl.NumberFormat('en-IN')`. This is the one unit test (R6).

---

## 6. Phase-by-Phase Implementation Plan

Budget: **90 minutes** total. Log any ambiguity + your default choice inline in README rather than blocking (brief §11).

### Phase 0 — Setup (10 min)
1. `npx create-expo-app` x3 into `apps/customer`, `apps/driver`, `apps/admin-mobile` (or hand-roll minimal `package.json` + `App.tsx` if create-expo-app is slow/unavailable).
2. Root `package.json` with `"workspaces": ["apps/*", "packages/*"]`.
3. `npm install` at root once, confirm all three apps + shared package resolve.
4. Drop `mock-api.json` in root, confirm `npx json-server mock-api.json --port 4000` serves all 3 endpoints.
5. `git init`, first commit: "scaffold: workspaces + expo apps".

### Phase 1 — Shared package first (25 min)
This is the highest-leverage phase — get it right and the three screens become copy-paste-thin.
1. Write `Order` + response envelope types from `openapi.yaml`.
2. Write `apiClient` (fetch wrapper, error branches, abort, idempotency stub).
3. Write `getOrders`, `getTrip`, `getPendingActions` typed endpoint functions.
4. Write `<OrderCard variant={...} />` against the mockup HTML files (`customer_orders.html`, `driver_trip.html`, `admin_pending.html`) for visual reference.
5. Write `formatPaiseToINR` + Vitest test, run it green.
6. Commit: "feat(shared): types, api client, OrderCard, price formatter" — tag `AI-Tool`/`AI-Scope` trailer if AI generated >30% of new lines.

### Phase 2 — Three screens (40 min, ~13 min each)
For each app, in order Customer → Driver → Admin (customer is simplest, de-risks the pattern before the trickier admin chip logic):
1. React Navigation native-stack with one route.
2. React Query `useQuery` calling the shared endpoint function.
3. Render `<FlatList>` of `<OrderCard variant="..." />`.
4. **Driver App Specifics:** Add a toggle at the top of the screen to switch between 'List' and 'Map' view. Ensure the OrderCard displays a prominent ETA badge and a purple 'Start Trip' button.
5. Four states: `isLoading` spinner, `data.length === 0` empty state, `isError` retry button, success → list.
6. Commit per app: "feat(customer): Today's Orders screen".

### Phase 3 — Polish + honesty pass (15 min)
1. Empty-state copy that's actually useful ("No orders yet today"), ETA badge + address truncation on driver card, priority chip color on admin card — cheap wins that hit the rubric's "exceptional" band per-screen.
2. Run all three apps, confirm against json-server.
3. Write README: setup steps, tech justification (from §4 table above), what got cut (auth, retries beyond basic, iOS), AI usage summary (5 lines: tool, files touched, accepted/edited/discarded), **actual hours spent, logged honestly**.
4. Record the 60-second Loom/simulator walkthrough (optional but appreciated — cheap credibility signal, worth doing if time allows).

### Phase 4 — Submit (buffer, not counted in the 90 min)
1. Push to public GitHub repo (or invite reviewer to private repo).
2. Email `hello@telanganagas.com`, subject: `Clear Energy 3-app take-home — Prit Pratyush Kumar Behera`, body = GitHub link + one-line summary of hours spent.

---

## 7. Risk Register

| Risk | Mitigation |
|---|---|
| Expo scaffolding eats the clock (brief flags this as the "junior" failure mode) | Use `--template blank-typescript`, skip anything not on the critical path (no custom fonts/icons/splash) |
| Three apps drift despite shared package | Only ever edit `Order` type / `OrderCard` / `apiClient` in `packages/shared`; screens should contain near-zero business logic |
| Running low on time before Phase 3 polish | Phase 2 "success state" is the floor — ship all three screens at basic level before adding ETA badges/chips; partial polish on 3 screens beats full polish on 1 |
| Live-review "add 4th screen" ask (§9) | Keep `OrderCard` genuinely reusable now so the Order Detail screen in the interview is a fast composition, not a rebuild |

---

## 8. Grading Self-Check (map plan → rubric before submitting)

- Repo structure → clean workspaces + shared package imported by all 3 → target band 2, reach for 3 by stating the Turborepo trade-off in README.
- Shared types → single source in `packages/shared/types`, imported everywhere → band 2–3.
- Shared API client → typed, error states, abort, idempotency stub → band 3.
- Shared `OrderCard` → one component, `variant` prop, optional render slot → band 2–3.
- Each screen → all four states → band 2 minimum; ETA badge/empty-state UX/priority chips push to band 3 if time allows.
- README + commits + honest hours → always achievable regardless of time pressure — do not skip this section under time pressure, it's free rubric points.

---

*Next action: open this PRD alongside the brief, start Phase 0 timer, and build in the order above.*