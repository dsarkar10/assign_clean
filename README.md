# Clear Energy 3-App Take-Home

Three React Native (Expo) apps — Customer, Driver, Admin Mobile — sharing one package for types, API client, and UI components.

## Setup

```bash
# Requires: Node.js >= 22.13, pnpm >= 10

# Install dependencies
pnpm install

# Start any app (separate terminals):
pnpm admin        # Admin Mobile
pnpm customer     # Customer
pnpm driver       # Driver

# Run tests (shared package)
pnpm test
```

**No server required.** All data is static JSON embedded in each screen. The `mock-api.json` file at root contains the same data for reference.

## Structure

```
clear-energy-takehome/
├── apps/
│   ├── admin-mobile/    # "Pending Actions" inbox
│   ├── customer/        # "Today's Orders" list
│   └── driver/          # "Today's Trip" list
├── packages/
│   └── shared/          # Types, API client, OrderCard, format utils
├── mock-api.json        # json-server data
├── pnpm-workspace.yaml
└── package.json
```

## Tech Choices

| Decision | Choice | Rationale |
|---|---|---|
| **Package manager** | pnpm workspaces | Strict isolation, fast installs, built-in workspace protocol. Lightweight enough for 3 apps, no Turborepo overhead. |
| **Framework** | Expo SDK 56 | Latest stable as of submission date (May 2026). React Native 0.85, React 19.2. |
| **Navigation** | React Navigation 7.x | Native stack navigator. Brief explicitly required React Navigation. |
| **Data** | Static JSON inline | No server needed. Data embedded in each screen. API client (`ApiClient`) in shared package ready for backend integration. |
| **HTTP client** | Custom fetch wrapper (`ApiClient`) in shared | Zero-dependency. Handles abort, idempotency-key, typed responses. Wired as a pattern for future backend use. |
| **Styling** | React Native StyleSheet | Zero-dependency, sufficient for list screens. Brief said "Android-first, not pixel-perfect". |
| **Testing** | Vitest 4 | Fast, native TypeScript, no Babel setup needed for pure function tests. |
| **Price formatting** | `Intl.NumberFormat('en-IN')` | Native Indian locale grouping (lakh/crore). No library needed. |

### Architecture

**Shared package (`@clear/shared`)**:
- `types/` — `Order`, `Trip`, `PendingAction`, and discriminated union `OrderCardProps`
- `api/client.ts` — `ApiClient` class with `get/post/put/delete`, AbortController support, Idempotency-Key header, typed `ApiResult<T>` return
- `components/OrderCard.tsx` — single component with `mode` prop (`customer` | `driver` | `admin`), renders completely different layouts per mode
- `utils/format.ts` — `formatPrice(paise)` → Indian rupee string

**Per-app screens** display static data imported directly, using the shared `OrderCard` component with the appropriate `mode` prop.

## What I Cut (and Why)

- **Authentication** — brief says hardcoded userId in headers
- **Real backend** — json-server only, per brief
- **Writes / mutations** — no API endpoints require them; idempotency-key is wired as a pattern
- **More screens** — brief says one screen per app
- **E2E tests** — out of scope
- **Component tests** — out of scope; the one unit test (formatPrice) is all that was asked
- **Expo Router** — brief said React Navigation, so I used it even though Expo Router is more idiomatic for new Expo projects

## What I'd Add Given More Time

1. **OrderCard render props** — expose `renderHeader`, `renderBody`, `renderFooter` to allow per-app overrides without forking the component
2. **OpenAPI codegen** — generate TypeScript types from the OpenAPI spec so types stay in sync with the backend
3. **Skeleton loading states** — instead of a spinner, show card-shaped placeholders
4. **Mutation support** — wire up TanStack Query `useMutation` for the admin "Resolve" button
5. **Expo Router** — migrate from React Navigation for file-based routing
6. **Storybook** — document OrderCard variants in isolation

## AI Usage

| Tool | Scope | What I did |
|---|---|---|
| Claude (opencode) | All files | Scaffolded the monorepo, wrote all source files, iterated on test expectations. Accepted ~90%, edited OrderCard styling and test values. |
| Web search | Dependency versions | Verified SDK 56 compatibility, React Navigation versions, TanStack Query React 19 support. |

## Hours Spent

- **~2h** total
  - 15m planning and research
  - 20m mock API + workspace setup
  - 30m shared package (types, API client, OrderCard, format)
  - 20m three app screens
  - 15m fixing Android connection, simplifying to static data
  - 10m verification (TypeScript checks, tests)
