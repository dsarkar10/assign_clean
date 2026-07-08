# Clear Energy — Multi-App Workspace

This repository contains the monorepo workspace for Clear Energy's delivery management application suite. It includes three React Native (Expo) apps and a shared package containing all core components, theme styles, types, and API client logic.

---

## Repository Structure

```
clear-energy-takehome/
├── apps/
│   ├── customer/            # Customer App (Today's Orders)
│   ├── driver/              # Driver App (Today's Trip)
│   └── admin-mobile/        # Admin Mobile (Pending Actions)
├── packages/
│   └── shared/              # Shared theme, types, client, and <OrderCard />
├── mock-api.json            # json-server mock database
├── package.json             # Root workspace configuration
└── start-all.sh             # Launch script for all services
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run the launch script
./start-all.sh

# Or via npm script:
npm run start:all
```

This launches:
- **Mock API**: `http://localhost:4000`
- **Customer App**: `http://localhost:8081` (Press `w` in its pane to open in browser)
- **Driver App**: `http://localhost:8082` (Press `w` in its pane to open in browser)
- **Admin App**: `http://localhost:8083` (Press `w` in its pane to open in browser)

---

## Architecture & Decisions

### Workspaces vs. Turborepo / Nx

I chose **npm workspaces** for simplicity. With the 1.5-hour scope, setting up Turborepo/Nx adds config overhead without meaningful benefit at this stage. npm workspaces enforce dependency sharing and package boundaries without extra tooling.

### Code Sharing & Preventing Drift

All core business logic and presentation lives in `packages/shared`:

1. **Strict TypeScript (`packages/shared/types/`)**: Shared `Order`, `TripStop`, and `PendingAction` types ensure one source of truth.
2. **API Client (`packages/shared/api/`)**: Typed fetch wrapper handling HTTP errors, network errors, abort on unmount, and idempotency key headers.
3. **Unified `<OrderCard />`**: Single component adapting layout via `mode` prop (`order` | `route` | `queue`).
4. **Dark Theme**: Colors, fonts (Manrope + JetBrains Mono), spacing, and glassmorphism in `@clear-energy/shared/theme/tokens`.

---

## Features

- **Interactive Cache Mutations**: Driver stop states cycle pending -> active -> done; admin actions remove items from list on tap.
- **Branded Empty States**: Custom empty states with icons for each app instead of plain text placeholders.
- **Indian Currency Lakh Grouping**: `en-IN` locale formatting (e.g. `₹1,23,456.00`).
- **Animated Transitions**: Fade-in lists, pulsing breached-priority pills via react-native-reanimated.

---

## Testing

```bash
npm test
```

Runs the Vitest unit test for the price-formatting function (paise to INR with Indian locale).


