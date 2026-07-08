# UIPRD.md — UI, Motion & Visual Design System
**Clear Energy 3-App Take-Home · Optional Visual Polish Layer**
Author: Prit Pratyush Kumar Behera · Prepared: 08 July 2026
Companion to: `PRD.md` (functional/architecture spec)

---

## 0. How This Fits Into the Main PRD

The brief is explicit (§10): they are **not** grading pixel-perfect UI, and the rubric's per-screen "exceptional" band asks for small UX details (empty-state copy, ETA badges, priority chips), not a design system. Read this document as a **stretch layer**, applied in this order of priority:

1. Ship all four states (loading/empty/error/success) on all three screens — functional PRD, non-negotiable.
2. Apply the **design tokens** in §2 and **splash + app icon** in §4 — cheap, high visual impact, ~10 minutes total.
3. Apply **glassmorphism on `OrderCard`** in §3 — moderate effort, this is the single highest-leverage visual choice since the card is shared across all 3 apps.
4. Apply **micro-animations** in §5 — only if Phase 3 polish time remains after the honest README pass.

Do not let this document pull time away from `PRD.md` Phase 0–2. If the clock is tight, stop after step 2.

---

## 1. Design Direction

**Reference:** "Smart Home" style dark UI (onboarding hero photo → room dashboard → device detail) — this is the exact visual language to replicate. See breakdown in §1.1.

**Concept:** "Midnight Purple" — a dark-mode-first aesthetic matching the starry night/moon visual reference. Utilizes a pitch-black background, high-contrast purple pill buttons, and flat dark cards for data. Photo backgrounds can still be used sparingly (e.g., starry skies or delivery scenes).

**Mood:** calm, warm-dark, legible at a glance (drivers glance at phones between deliveries — the driver screen especially must survive outdoor sunlight glare, so glass effects need a solid-enough backing layer, never pure transparency).

**Shared across all 3 apps:** same tokens, same `OrderCard` shell, same type scale, same rounded-pill button language. What differs per app is the **accent color** (see §2.3) so a screenshot instantly signals which app you're looking at — useful in the live review demo.

### 1.1 Reference Breakdown (what to copy, screen by screen)

| Reference screen | What it's doing | How it maps to our 3 apps |
|---|---|---|
| **Screen 1 — Hero/onboarding** ("Making Home Smarter") | Full-bleed warm-toned photo, large serif-leaning bold headline over a dark gradient scrim, small circular prev/next nav + a pill-shaped primary CTA at the bottom | Not a hard requirement (brief has no onboarding screen), but the **pill CTA + dark scrim gradient** pattern should carry into every button in the app |
| **Screen 2 — Dashboard** ("Choose Room") | Two flat dark cards side by side (room selector + weather), pill-shaped filter chips row ("All Device / Living Room / Kitchen"), a big rounded photo-card at the bottom with an icon row and a small pill badge ("3 Devices") floating bottom-right of the photo | This **is** our `OrderCard` pattern — photo-backed card, floating pill badge, icon row footer. Maps directly onto Driver's trip stop cards or Admin's queue items |
| **Screen 3 — Detail** ("Living Room") | Full-bleed photo top half with back button + notification bell as floating circular glass buttons, two side-by-side stat cards below ("Light 100lx", "Noise 14dB"), one wide card with a big number + toggle switch | Maps onto a device/order **detail** view — useful for the live-review "add an Order Detail screen" extension task in the main PRD §9 |

Key visual DNA to extract from all three: **circular glass icon buttons** (back arrow, bell, chevrons), **flat dark stat cards with a label-on-top/value-on-bottom layout**, **pill-shaped everything else** (chips, badges, CTA buttons, toggle track), and **generous corner radius** (cards ~20-24px, buttons fully pill/999).

---

## 2. Design Tokens

Put these in `packages/shared/theme/tokens.ts` — one source of truth, imported by all three apps' `StyleSheet` calls. This mirrors the "shared package first" principle from the main PRD: theme drift across apps is the same failure mode as type drift.

### 2.1 Color — dark glass base (matched to reference)

The reference uses a true near-black (not navy-tinted) base, warm off-white text, and small warm-amber accents that read as "light/energy" rather than a cool blue-tech palette — fitting for a thermal-energy brand.

```ts
// packages/shared/theme/tokens.ts
export const colors = {
  // base surfaces — pitch black background
  bg: '#000000',             // true pitch black background
  bgCard: '#1A1A1C',         // flat dark card fill
  bgCardElevated: '#232326', // slightly lighter flat card, for nested/secondary cards
  glassFill: 'rgba(255,255,255,0.10)',    // frosted circular icon buttons (back/bell)
  glassBorder: 'rgba(255,255,255,0.14)',  // 1px hairline on glass edges
  glassHighlight: 'rgba(255,255,255,0.20)', // top-edge specular line on glass buttons
  scrimGradient: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.95)'], // photo-to-dark gradient overlay

  // text — warm off-white, not cool gray, matches reference headline color
  textPrimary: '#F7F5F2',
  textSecondary: '#A8A5A0',
  textMuted: '#6B6864',

  // pill/chip surfaces
  pillActive: '#F7F5F2',       // white-ish active filter chip (reference's "All Device")
  pillActiveText: '#0A0A0B',   // dark text on the active white pill
  pillInactive: 'rgba(255,255,255,0.08)',
  pillInactiveText: '#A8A5A0',

  // status
  success: '#34D399',
  warning: '#FBBF24',    // matches the reference's sun/weather icon amber
  error: '#F87171',
  info: '#60A5FA',
  energyAmber: '#F2A93B', // warm bulb-glow amber pulled straight from the hero photo — use for "Light"/energy stat icons
} as const;
```

### 2.2 Semantic status colors (drives `OrderCard` status pill)

| Status | Color token | Use |
|---|---|---|
| `pending` | `warning` | Admin queue, not yet actioned |
| `in_transit` | `info` | Driver trip in progress |
| `delivered` | `success` | Customer completed order |
| `failed` / `cancelled` | `error` | Any app, needs attention |

### 2.3 Per-app accent (identity color, used sparingly — CTA buttons, active nav, top gradient wash)

| App | Accent | Hex | Rationale |
|---|---|---|---|
| Customer | Vibrant Purple | `#9333EA` | Matches the starry night image exactly — the primary CTA "Get Started" and "Add device" buttons are vibrant purple. |
| Driver | Vibrant Purple | `#9333EA` | Shared accent color for consistent brand feel across all 3 apps. |
| Admin Mobile | Vibrant Purple | `#9333EA` | Shared accent color. |

Note: The accent set uses the single vibrant purple tone for the entire suite, maintaining a cohesive "Midnight Purple" brand.

### 2.4 Typography

The reference's headline ("Making Home Smarter", "Living Room") uses a **large, light-to-regular-weight humanist sans** — tall x-height, minimal personality, big tracking room between words. That's a different feel from a geometric grotesk like Sora: it's softer and more editorial. Closest accurate match:

**Font: [Manrope](https://fonts.google.com/specimen/Manrope)** (variable font, via `@expo-google-fonts/manrope`) for all UI text — humanist proportions, low-contrast strokes, reads calm at large display sizes exactly like the reference's headlines, but still crisp at 12-14px for card labels. Pair with **[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)** (`@expo-google-fonts/jetbrains-mono`) for amounts/stat values only (₹ amounts, dB/lx readings) — the reference's stat numbers ("100lx", "14dB", "26 Days") are tabular and want to align in a column, which a proportional font won't do cleanly.

```ts
export const typography = {
  fontFamily: {
    display: 'Manrope_300Light',    // large headlines, e.g. "Living Room" — reference uses a light weight at big sizes
    displayBold: 'Manrope_700Bold', // headline emphasis words, e.g. "Home" bolded mid-sentence in reference screen 1
    body: 'Manrope_400Regular',
    bodyMedium: 'Manrope_600SemiBold', // card titles, "Choose Room", "Quick Access"
    mono: 'JetBrainsMono_500Medium',   // stat values only
  },
  size: {
    xs: 12,    // pill/chip labels
    sm: 13,    // card sub-labels ("3 Users", "Sunny")
    base: 15,  // body text
    lg: 17,    // card titles ("Choose Room")
    xl: 26,    // section headline ("Living Room")
    xxl: 34,   // hero headline ("Making Home Smarter")
  },
  lineHeight: { tight: 1.1, normal: 1.35, relaxed: 1.6 },
  letterSpacing: { display: -0.5, tight: -0.2, normal: 0 }, // reference headlines sit slightly tight, not tracked-out
} as const;
```

**Reference-matched detail:** in screen 1, "Home" is visually bolder/brighter than "Making" and "Smarter" around it — a single emphasized word inline with lighter-weight surrounding text. Reuse this pattern for app headlines, e.g. Driver's screen could read "Today's **Trip**" with the same light/bold word contrast, rather than bolding the whole line.

### 2.5 Spacing & radius (glassmorphism needs generous radius to read as "glass," not "card")

```ts
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radius  = { sm: 14, md: 20, lg: 28, pill: 999 } as const;
// reference cards read visibly rounder —
// small stat cards ~20px, big cards ~28px, all buttons/chips full pill (ROUND_FULL)
```

---

## 3. Glassmorphism Implementation

### 3.1 Library choice

| Library | Use for | Resource link |
|---|---|---|
| **`expo-blur`** (`<BlurView>`) | The frosted-glass blur behind `OrderCard`, top nav bar, splash overlay | https://docs.expo.dev/versions/latest/sdk/blur-view/ |
| **`expo-linear-gradient`** | Subtle top-to-bottom or accent-tinted gradient wash on screen backgrounds and the glass highlight edge | https://docs.expo.dev/versions/latest/sdk/linear-gradient/ |
| **`react-native-reanimated`** (v3) | All animation in §5 — required, not optional, for anything beyond opacity fades | https://docs.swmansion.com/react-native-reanimated/ |
| **`react-native-gesture-handler`** | Swipe-to-action on `OrderCard` in Admin (optional stretch) | https://docs.swmansion.com/react-native-gesture-handler/ |

**Why `expo-blur` over a pure CSS/rgba fake-glass approach:** real backdrop blur is what makes glassmorphism read as "glass" rather than "semi-transparent gray box." It's an Expo-native module (no config plugin headaches), works on both platforms, and is already inside the Expo-preferred stack the main PRD commits to.

### 3.2 Two shared primitives (reference actually uses two distinct surfaces, not one)

Looking closely at the reference, "glass" only appears on **small circular icon buttons** floating over photos (back arrow, bell). The bigger cards — "Choose Room," the stat tiles, the room-photo cards — are **flat dark surfaces**, not blurred. Copying this distinction matters: over-blurring everything is the most common way to miss this exact look.

**Primitive 1 — `GlassIconButton`** (circular, floating over photo areas)

```tsx
// packages/shared/components/GlassIconButton.tsx
import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

export function GlassIconButton({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.tint} />
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 44, height: 44, borderRadius: 22, // fully circular, matches reference back/bell buttons
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', borderWidth: 1, borderColor: colors.glassBorder,
  },
  tint: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.glassFill },
});
```
Use for: back button, notification bell, prev/next chevrons on hero screens — anywhere a control floats directly over photo content.

**Primitive 2 — `StatCard`** (flat dark card, no blur — this is the "Choose Room" / "Light 100lx" pattern)

```tsx
// packages/shared/components/StatCard.tsx
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';

export function StatCard({ label, value, icon, style }: { label: string; value: string; icon?: React.ReactNode; style?: object }) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        {icon}
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontFamily: typography.fontFamily.body, fontSize: typography.size.sm, color: colors.textSecondary },
  value: { fontFamily: typography.fontFamily.mono, fontSize: typography.size.xl, color: colors.textPrimary, marginTop: spacing.sm },
});
```
Use for: the reference's "Light / 100lx" and "Noise / 14dB" tiles — label-on-top, big value-on-bottom, laid out two-across with `gap: spacing.md`. This maps directly to `OrderCard`'s admin/driver stat rows (ETA, amount) in the main PRD.

**Primitive 3 — `PhotoCard` with floating pill badge** (the "Smarter Bedroom / 3 Devices" pattern — this is our actual `OrderCard` base)

A rounded photo-backed card (`radius.lg`), dark gradient scrim (`colors.scrimGradient`, via `expo-linear-gradient`) rising from the bottom third so text stays legible over any photo, title text top-left, and a small pill badge floating at the bottom-right corner of the card (half on/half off the image edge, like the reference's "3 Devices" pill and the circular expand arrow next to it). This is exactly `OrderCard`'s shell in the main PRD — its `variant` prop just changes what text sits in the badge (status for customer, ETA for driver, action label for admin) instead of adding new surfaces.

### 3.3 Glass rules (so it doesn't turn into "just blur everything")

- **Only circular icon buttons over photos get real blur** (`GlassIconButton`) — this is what the reference actually does. Stat cards and dashboard tiles are flat `colors.bgCard`, no blur, per §3.2.
- Always pair blur with the 1px `glassBorder` hairline — without it, blur edges look muddy on real devices, especially over busy photo backgrounds.
- Driver screen: cap blur `intensity` at 30 (vs. 35 elsewhere) and raise `glassFill` opacity slightly — outdoor glare needs more backing contrast, less pure transparency.
- Never stack more than 2 blurred layers on screen at once — perf cost on Android mid-range devices (this is delivery driver hardware, likely not flagship), and the reference itself never shows more than 2 glass buttons per screen (back + bell).

---

## 4. Splash Screen & App Icon

### 4.1 Library

**`expo-splash-screen`** (built into Expo, config-driven, no extra install beyond what Expo scaffolds already include): https://docs.expo.dev/versions/latest/sdk/splash-screen/

### 4.2 Spec per app (`app.json` → `expo.splash`)

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#0B0E14"
    }
  }
}
```

- Background: always `colors.bg` (`#0B0E14`) across all 3 apps — consistent brand moment before the accent color takes over inside the app.
- Icon/wordmark: simple centered mark, accent-tinted per app (teal/amber/violet) so even the splash hints which app is opening — useful when the reviewer runs all three back-to-back in the Loom recording.
- **Animated splash transition (stretch, only if time allows):** use `expo-splash-screen`'s `SplashScreen.hideAsync()` combined with a `Reanimated` fade+scale on the first screen's root view (fade splash out over 300ms while the app's `GlassSurface` content fades+scales in from 0.96→1). This reads as an intentional brand moment rather than an abrupt cut.

```tsx
// App.tsx pattern, all 3 apps
import * as SplashScreen from 'expo-splash-screen';
import Animated, { FadeIn } from 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({ /* Sora + JetBrains Mono */ });

  const onLayout = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1 }} onLayout={onLayout}>
      {/* nav stack */}
    </Animated.View>
  );
}
```

### 4.3 App icon

Keep it simple: a single glyph (droplet/flame for thermal energy, or a stylized "C") on the `bg` dark background, accent-colored per app. Generate with Expo's icon config — no custom native icon pipeline needed at this scope (brief explicitly excludes "pixel-perfect" polish as a grading dimension).

---

## 5. Animation & Micro-interactions

**Library: `react-native-reanimated` v3** everywhere. Do not reach for `Animated` (RN core) — Reanimated runs on the UI thread, which matters even at this small scale because list scroll + card entrance animations on RN core `Animated` will visibly jank on mid-range Android (driver's likely hardware).

Resource: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started

### 5.1 List entrance (all 3 screens)

`OrderCard` items fade+slide in with a small stagger as the list first renders (success state only — not on every re-render/refetch).

```tsx
import Animated, { FadeInDown } from 'react-native-reanimated';

<Animated.View entering={FadeInDown.delay(index * 60).duration(280)}>
  <OrderCard {...props} />
</Animated.View>
```

Cap the stagger delay (`index * 60`, max ~5 items staggered, then flat) so a long list doesn't feel sluggish to appear.

### 5.2 State transitions (loading ↔ empty ↔ error ↔ success)

Cross-fade between states rather than a hard swap — wrap the state-conditional render in `Animated.View` with `entering={FadeIn}` / `exiting={FadeOut}`. This alone makes the four required states (R5 in main PRD) feel designed rather than just "conditionally rendered."

### 5.3 Status pill / chip pulse (Admin "Pending Actions" screen)

For `pending` status specifically, a subtle breathing opacity loop (0.7↔1.0, 1.6s, `withRepeat(withTiming(...), -1, true)`) on the status dot draws the eye to what needs action — directly supports the rubric's "priority chips, action affordances" exceptional-band note for the Admin screen.

### 5.4 Pull-to-refresh

Standard `RefreshControl` on each `FlatList`, tinted with the app's accent color (`tintColor` prop, iOS; `colors` prop, Android) — a two-line change that makes refresh feel branded rather than default-gray.

### 5.5 What NOT to animate

- No animation on the price/amount text itself — operational data should feel stable, not playful.
- No bounce/spring easing on anything error-related — errors should read as calm and clear, not bouncy.
- No parallax/scroll-linked effects — cute, but zero rubric value and real risk of eating your 90-minute budget for nothing (brief §10 explicitly says speed-for-its-own-sake and feature-cramming aren't being tested).

---

## 6. Component-Level Application Table

| Component/Screen | Surface type | Animation | Accent usage |
|---|---|---|---|
| `OrderCard` (shared) | `PhotoCard` — flat photo + gradient scrim + floating pill badge (§3.2 Primitive 3) | Entrance stagger (§5.1) | Status pill color only |
| Nav bar back/bell buttons | `GlassIconButton` — circular blur (§3.2 Primitive 1) | None (static) | Icon tint follows app accent |
| Filter chip row ("All Device / Living Room / Kitchen" pattern) | Flat pill — `pillActive`/`pillInactive` tokens, no blur | Slide/scale on active-state change | Active pill uses `pillActive` (near-white), never accent — matches reference exactly |
| Two-across stat tiles ("Light / Noise" pattern) | `StatCard` — flat `bgCard`, no blur (§3.2 Primitive 2) | None (static data) | Icon only, small, in accent |
| Empty state | Flat surface, no glass — matches reference's restraint | Simple fade-in | Muted icon in accent, low opacity |
| Error state | Flat surface, high-contrast for clarity | Fade-in only, no shake/bounce | `colors.error`, retry button as filled pill (`pillActive` style) |
| Loading state | Optional thin skeleton in `bgCardElevated` (stretch) | Skeleton pulse or spinner | Accent-colored spinner |
| Splash | Solid `bg`, no blur needed (nothing behind it) | Fade+scale exit (§4.2) | Icon/wordmark tint |
| Driver ETA badge | `GlassIconButton`-style small pill, blurred (over photo) | None | `info` color, not accent (status semantics win here) |
| Admin priority chip | Flat pill, no blur (sits on flat card, not photo) | Pulse for `pending` only (§5.3) | Status color, not accent |
| Toggle switch (reference's "26 Days / Off" pattern) | Flat pill track, circular white knob | Knob slide on toggle (Reanimated `withSpring`) | Track fills with accent when "on" |

---

## 7. Resource & Library Reference Sheet

| Need | Library | Install | Docs |
|---|---|---|---|
| Frosted blur surfaces | `expo-blur` | `npx expo install expo-blur` | https://docs.expo.dev/versions/latest/sdk/blur-view/ |
| Gradient washes | `expo-linear-gradient` | `npx expo install expo-linear-gradient` | https://docs.expo.dev/versions/latest/sdk/linear-gradient/ |
| Animation engine | `react-native-reanimated` | `npx expo install react-native-reanimated` | https://docs.swmansion.com/react-native-reanimated/ |
| Gesture support (swipe actions, stretch) | `react-native-gesture-handler` | `npx expo install react-native-gesture-handler` | https://docs.swmansion.com/react-native-gesture-handler/ |
| Splash + icon config | `expo-splash-screen` | included in Expo scaffold | https://docs.expo.dev/versions/latest/sdk/splash-screen/ |
| Font loading | `expo-font` + `@expo-google-fonts/manrope` + `@expo-google-fonts/jetbrains-mono` | `npx expo install expo-font @expo-google-fonts/manrope @expo-google-fonts/jetbrains-mono` | https://docs.expo.dev/develop/user-interface/fonts/ |
| Safe-area handling (glass headers need this) | `react-native-safe-area-context` | usually pre-included by Expo template | https://docs.expo.dev/versions/latest/sdk/safe-area-context/ |
| Icons (status/action glyphs) | `@expo/vector-icons` (Feather or Lucide set) | included in Expo scaffold | https://icons.expo.fyi/ |

**Setup order matters:** install fonts + blur + reanimated **once at root**, since all three apps are workspace members reading from the same `node_modules` — do not install per-app, or you risk version drift across the three apps (same failure mode the main PRD warns about for types/API client).

---

## 8. Accessibility & Legibility Guardrails (glassmorphism's usual failure mode)

Glass effects are notorious for tanking text contrast. Guardrails to keep this from happening:

- Text on glass is always `colors.textPrimary` (`#F5F7FA`) minimum — never `textSecondary`/`textMuted` directly on a blurred surface.
- Minimum tap target 44×44pt on all pills/chips/buttons, even inside compact cards — non-negotiable for a driver tapping a phone one-handed.
- Status color is never the *only* signal — always pair with a text label (`"Pending"`, not just an amber dot), for colorblind accessibility.
- Test every screen once with device brightness turned down to ~30% (simulates the "driver in a dim cab") and once at max brightness outdoors-simulated — glass legibility swings a lot with ambient light in real usage, even though this won't be part of the graded review.

---

## 9. Time-Boxed Application Summary

If you choose to apply any of this within the main PRD's Phase 3 (polish, 15 min):

1. **5 min:** Drop in `tokens.ts`, wire Manrope + JetBrains Mono fonts, set splash `backgroundColor` per app.
2. **7 min:** Build `GlassIconButton` + `StatCard` + `PhotoCard`, wrap `OrderCard` in `PhotoCard`, apply per-app accent to nav buttons + active pill.
3. **3 min:** Add `FadeInDown` list entrance + cross-fade between the four states.

Anything beyond this (pulse animations, animated splash exit, swipe gestures) is genuinely optional — mention in the README under "what I'd add with more time" rather than risk the core rubric to chase it.

---

*Companion document to `PRD.md`. Apply after all four functional states are working on all three screens — never before.*