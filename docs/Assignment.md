Clear Thermal Energy (OPC) Pvt Ltd · Technical Round · 3-App Take-Home
Clear Thermal Energy (OPC) Pvt Ltd
Trading as Clear Energy · Hyderabad, India
Technical Round — 3-App Take-Home
Role: App Developer · Clear Energy Delivery Management Software
Time budget: 1.5 hours of focused work (you may spend more — be honest about actual hours in the
README)
Submission window: 48 hours from when you receive this brief
Next step on submission: 60-minute live review session
Sent: 23 May 2026
1. Why this task
You will own three React Native apps at Clear Energy — Customer, Driver, and Admin Mobile. The
hard part is not writing three apps; it is keeping them consistent: shared design language, shared types,
one API client, one set of conventions. Anyone can build a screen. We want to see that you build a
codebase where the three apps do not drift apart over 9 weeks.
This task is small on purpose. We are NOT testing how many features you can cram into 3
hours. We are testing whether you organise code like someone who has shipped a real multi-
app product before.
2. What you are building
A monorepo (or workspaces — your call) containing three React Native apps plus one shared package:
clear-energy-takehome/
├── apps/
│
├── customer/
│
├── driver/
│
└── admin-mobile/
├── packages/
│
└── shared/
├── mock-api.json
└── README.md
# one screen: "Today's Orders" list
# one screen: "Today's Trip" list
# one screen: "Pending Actions" inbox
# types, API client, OrderCard component
# json-server data
Each app has one screen. That screen calls the API via the shared client, renders a list using the
shared OrderCard component, and handles the four standard states (loading, empty, error, success).
The point is: the OrderCard component, the TypeScript types, and the API client live in
packages/shared and are imported by all three apps. If a teammate adds a field to the Order type later,
all three apps pick it up automatically. That is the test.
3. Provided reference materials
Attached to this brief:
Page 1 · App Developer Hire · Confidential · Send to shortlisted candidates onlyClear Thermal Energy (OPC) Pvt Ltd · Technical Round · 3-App Take-Home
•
•
•
•
mockups/customer_orders.html — "Today's Orders" screen for Customer App
mockups/driver_trip.html — "Today's Trip" screen for Driver App
mockups/admin_pending.html — "Pending Actions" screen for Admin Mobile
openapi.yaml — 3-endpoint spec slice:
• GET /orders?customerId={id} → customer's recent orders
• GET /trips?driverId={id} → driver's trip with stops
• GET /pending-actions?adminId={id} → admin's queue items
• mock-api.json — runnable with: npx json-server mock-api.json --port 4000
Each endpoint returns a different shape, but they all contain an array of items that map to an Order-like
row (with: id, customer name, address, amount in paise, SKU, status). Your OrderCard component
must work for all three contexts via well-thought-out props.
4. Hard requirements
R1. Monorepo or workspaces. npm workspaces, pnpm workspaces, Yarn workspaces, or a real
monorepo tool (Turborepo, Nx) — your call. Justify in the README.
R2. TypeScript everywhere. No plain JavaScript. Types live in packages/shared/types/ and are
imported, not duplicated.
R3. One typed API client in packages/shared/api/. Fetch wrapper or axios — your call. Must handle:
success, network error, non-2xx response, and abort on unmount. Idempotency key on writes
(even though there are no writes in this task — wire it as if there were, so the pattern is in place).
R4. One <OrderCard /> component in packages/shared/components/. Takes props that cover the
three use cases — customer-view (shows customer + status), driver-view (shows address +
ETA), admin-view (shows action chip). ONE component, three rendering modes — not three
components.
R5. Three apps, one screen each. Use Expo (latest stable) + React Navigation. Each screen calls the
shared API client, renders the OrderCard list, handles all four states (loading, empty, error,
success).
R6. At least one test. Unit test for the price-formatting function (paise → ₹1,23,456 Indian locale) is
enough. Use Vitest or Jest.
R7. README. What you chose, why, what you cut, what you would add given more time. Plus your
AI-tool usage summary (which tools, for what).
5. Tech constraints
Use what you know best, but stay inside these bounds:
• React Native (Expo or bare — Expo strongly preferred for this take-home)
• TypeScript — no plain JavaScript
• React Navigation for the (single-screen) nav stack in each app
• React Query (TanStack Query) for server data — preferred, not mandatory
• Any state library for local state (Zustand, useReducer — your call)
Out of scope (do not burn time on):
•
•
•
•
•
•
•
•
Authentication (assume hardcoded userId in headers)
Real backend (json-server only)
Razorpay / payments (not in this brief; the parent contract covers Phase 3)
Pixel-perfect iOS — Android-first is fine
Hindi localisation (English only)
Push notifications
Test coverage beyond the one unit test we asked for
E2E tests (Detox / Maestro)
6. AI tools — use them, disclose them
You may use Claude, Cursor, Copilot, Gemini, Codex — any AI coding tool. This is encouraged.
Page 2 · App Developer Hire · Confidential · Send to shortlisted candidates onlyClear Thermal Energy (OPC) Pvt Ltd · Technical Round · 3-App Take-Home
In return:
• Add an "AI usage" section to your README (which tools, for which files, what you accepted vs
edited vs discarded — 5 lines).
• In any commit message where more than ~30% of new lines came from AI, add a trailer:
AI-Tool: Claude-Code / Cursor-Composer / Gemini-2.5-Pro
AI-Scope: scaffold | shared-package | screen | refactor
This is a preview of our AI-Augmented Workflow Standard (Annexure A to the parent contract).
7. What to submit
1. GitHub repo link (public, or invite [your-github-username] to a private repo).
2. README with: setup steps, tech choices justified, what you cut and why, AI usage summary,
ACTUAL hours spent (be honest — overclaiming is worse than under-delivering).
3. A 60-second screen recording of running each of the three apps in turn (Loom / iOS Simulator /
Android emulator recording — your choice). Saves us setup time on first launch. Optional but
appreciated.
Email the GitHub link to hello@telanganagas.com with subject line: Clear Energy 3-app take-home —
[Your Name]
8. How we will grade (24 points)
Dimension0 — none1 — basic2 — solid3—
exceptional
Repo structurethree folders
pasted, no
shared codeworkspaces but
shared code
duplicatedclean workspaces,
shared package
importedclean + shows
tooling
judgement
(Turborepo
justified, etc.)
Shared typesany everywheretypes defined
but partly
duplicatedtyped, single
source, imported
by all 3 appstyped +
generated from
OpenAPI or
thoughtfully
derived
Shared API clientfetch().then()
inline in screenswrapper exists
but no error
handlingtyped client with
error states+ idempotency,
abort, retry
consideration
Shared
<OrderCard />three separate
copy-pasted
cardsone card but
props leak per-
app concernsone card, clean
prop interface+ composable,
named slots /
render-props
Customer screenbrokenrenders happy
path+
loading/error/empty+ thoughtful
empty-state UX
Driver screenbrokenrenders happy
path+
loading/error/empty+ ETA badge,
address
truncation
Admin Mobile
screenbrokenrenders happy
path+
loading/error/empty+ priority chips,
action
affordances
Page 3 · App Developer Hire · Confidential · Send to shortlisted candidates onlyClear Thermal Energy (OPC) Pvt Ltd · Technical Round · 3-App Take-Home
Dimension0 — none1 — basic2 — solid3—
exceptional
README +
commits + honest
hoursmissingterse, no AI
disclosureclear, AI disclosure
presentclear + trade-
offs reasoned +
honest hours
Score bands
• 24/24 — exceptional (rare in 3 hours; expect 18–22 from a strong candidate)
• 18–23 — strong hire · advance to live review
• 12–17 — borderline · live review only if pipeline thin
• Below 12 — pass
9. Live review session — what to expect (60 minutes)
After submission, we book a Google Meet. Bring your repo running locally.
MinutesSegmentWhat you do
0–5SetupYou share screen, run the three apps in turn.
5–15WalkthroughYou walk us through the shared package — design
decisions, what you would improve.
15–35Extension liveWe ask you to add a fourth screen ("Order Detail") to the
Customer App using your existing shared components. AI
tools allowed. We watch how you work.
35–45Bug huntWe show you a copy of your code with one subtle bug
planted (e.g., a useEffect dependency removed, or the price
calc off by ₹1). Find and fix.
45–55AI prompt probeWrite one prompt to your AI tool to add input validation to
one of the screens. Show the prompt, the diff, and what you
would change before merging.
55–60Q&AYour questions for us · logistics · decision timeline.
10. What we are NOT testing
•
•
•
•
•
•
Algorithm puzzles or LeetCode
Memorising APIs — keep your IDE and AI tools open
Pixel-perfect Figma reproductions
How many features you can cram in 3 hours
Speed for its own sake — clarity wins
Test coverage beyond the one unit test we asked for
11. Questions during the take-home
If a part of the brief is ambiguous, log the question, choose a sensible default, mention it in your
README, and proceed. Do not block on us.
12. Why we are doing it this way
You would be building three React Native apps in parallel for 9 weeks. We cannot make that hire off a
screening call. This take-home is the smallest possible test that tells us whether you organise multi-app
Page 4 · App Developer Hire · Confidential · Send to shortlisted candidates onlyClear Thermal Energy (OPC) Pvt Ltd · Technical Round · 3-App Take-Home
code like someone who has done it before. The Customer App, Driver App, and Admin Mobile app will
share a lot — types, design tokens, validation, even some business logic. If you build three copy-pasted
apps, we will be paying for the same code three times and the maintenance burden will sink the project
by Phase 2.
A senior who has shipped multi-app products before will recognise this brief instantly and finish in 1.5
hours. A junior will spend 2.5 hours on scaffolding and never reach the screens. That is by design.
Good luck. We are looking forward to seeing how you organise it.
—
Lingam Rajender Reddy
Founder, Clear Thermal Energy (OPC) Pvt Ltd
Trading as Clear Energy · Hyderabad, India
hello@telanganagas.com
Page 5 · App Developer Hire · Confidential · Send to shortlisted candidates only