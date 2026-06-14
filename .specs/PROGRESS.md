# KanaPlay — Implementation Progress

Tracker for the 9 phases defined in [`tickets/`](./tickets/). Update the boxes as work
lands. Each phase links to its ticket; tasks below mirror the ticket's "Tasks" section.

**Legend:** `[ ]` pending · `[~]` in progress · `[x]` done · `[-]` skipped/deferred

---

## ✅ Phase 1 — Bootstrap & Dependencies

Ticket: [phase-1-bootstrap.md](./tickets/phase-1-bootstrap.md) · **Status: done**

- [x] Install all production + dev dependencies (Bun)
- [x] Configure Tailwind v4 (`@tailwindcss/vite` + `@theme` tokens)
- [x] `src/styles/index.css` + `src/styles/glass.css` (Yellow Ochre + glass tokens + blob keyframes)
- [x] Logo asset (`src/assets/logo.png`) + favicon (`public/favicon.svg`)
- [x] Shadcn UI configured + 9 components (button, input, card, dialog, table, badge, tabs, tooltip, select)
- [x] Path aliases (`@`, `@pages`, `@types`, `@contexts`) in Vite + tsconfig
- [x] ESLint strict + stylistic, Prettier
- [x] Vitest + setup (`src/test/setup.ts`)
- [x] Playwright + `e2e/smoke.spec.ts`
- [x] `.specs/` folder versioned

**Notes**
- Logo is currently a placeholder — replace `src/assets/logo.png` when the real cheese-wedge art is ready.
- Spec asked for `tailwind.config.ts`, but Tailwind v4 uses `@theme` in CSS — adapted.
- Phase 4 expects login form to take Spotify Client ID + Secret directly. Trade-off: secret leaks in the bundle. Acceptable for hiring challenge; flag in README.

---

## ✅ Phase 2 — Core Infrastructure

Ticket: [phase-2-infrastructure.md](./tickets/phase-2-infrastructure.md) · **Status: done**

- [x] i18n setup (`src/langs/`): `i18n.ts`, `resources.ts`, `en-US.json`, `pt-BR.json`
- [x] `AppContext` (useReducer: token, language, theme, isAuthLoading)
- [x] `FavoritesContext` (useReducer + localStorage sync)
- [x] `Providers.tsx` hierarchy (QueryClient → App → Favorites → Router)
- [x] Spotify Axios instance + interceptors (`src/api/services/spotify/api.ts`)
- [-] `src/config/env.ts` — **skipped per user request**; vars read directly from `.env` via `import.meta.env`
- [x] Router (`src/routes/router.tsx`) + `ProtectedRoute`
- [x] Layout: `Navbar`, `PageWrapper`, `ProtectedLayout`

**Notes**
- Page stubs created for all 5 routes so the router compiles. Each placeholder mentions which phase will populate it.
- Spotify Axios uses module-level `tokenGetter` + `onUnauthorized` callbacks wired by `AppProvider` via `useEffect` — keeps the interceptor decoupled from React.
- `AppContext` persists `token` and `language` to `localStorage` (keys `kanaplay_token` and `kanaplay_language`).
- `FavoritesContext` waits for `LOAD_FAVORITES` before syncing to `localStorage` to avoid wiping on first mount.
- Old scaffold `App.tsx` is now orphaned — `main.tsx` renders `<Providers />` directly. Safe to delete in a later pass.

---

## ⏳ Phase 3 — Spotify API Layer

Ticket: [phase-3-api-layer.md](./tickets/phase-3-api-layer.md) · **Status: pending**

- [ ] Zod schemas in `src/types/spotify.ts` (Artist, Track, Album, Paging)
- [ ] `get-token.ts` (Client Credentials flow)
- [ ] `search-artists.ts` + mock
- [ ] `get-artist.ts` + mock
- [ ] `get-artist-top-tracks.ts` + mock
- [ ] `get-artist-albums.ts` + mock
- [ ] All mocks expose `successMock` / `emptyMock` / `errorMock`

---

## ⏳ Phase 4 — Login Page

Ticket: [phase-4-login.md](./tickets/phase-4-login.md) · **Status: pending**

- [ ] `src/pages/login/Login.tsx` (glass card, RHF + Zod)
- [ ] `useLoginForm.ts` (mutation → `SET_TOKEN` → navigate `/`)
- [ ] Language switcher in top-right
- [ ] All strings via `t('login.*')`
- [ ] Visual matches `screens/login.png`

---

## ⏳ Phase 5 — Artist Discovery

Ticket: [phase-5-artist-discovery.md](./tickets/phase-5-artist-discovery.md) · **Status: pending**

- [ ] `useArtistDiscovery` hook (`useInfiniteQuery`, debounce 300ms, IntersectionObserver)
- [ ] `ArtistDiscovery.tsx` page (card grid, no tables)
- [ ] `HeroBanner`, `FeaturedArtistCard`, `TopPickItem`
- [ ] `PlayerBar` (fixed footer, global)
- [ ] Loading skeleton, error state, empty state

---

## ⏳ Phase 6 — Artist Profile

Ticket: [phase-6-artist-profile.md](./tickets/phase-6-artist-profile.md) · **Status: pending**

- [ ] `ArtistProfile.tsx` page (`/artist/:id`)
- [ ] `ArtistHero`, `TopTracksList`, `AboutArtistCard`, `FansAlsoLike`
- [ ] `AddFavoriteDialog` (RHF + Zod, pre-filled)
- [ ] Tabs: Top Tracks (paginated 10/page) + Albums (paginated)
- [ ] Duration formatted as mm:ss

---

## ⏳ Phase 7 — My Collection

Ticket: [phase-7-my-collection.md](./tickets/phase-7-my-collection.md) · **Status: pending**

- [ ] `MyCollection.tsx` page (`/collection`)
- [ ] `LibrarySidebar`, `LikedSongsGrid`
- [ ] `AddFavoriteForm` (RHF + Zod, min 2 chars)
- [ ] Remove with confirmation
- [ ] Empty state

---

## ⏳ Phase 8 — Insights Dashboard

Ticket: [phase-8-insights.md](./tickets/phase-8-insights.md) · **Status: pending**

- [ ] `Insights.tsx` page (`/insights`)
- [ ] `InsightsSidebar`
- [ ] `ListeningTrendsChart` (Recharts LineChart)
- [ ] `MonthlyFavoritesChart` (Recharts donut PieChart)
- [ ] `StatCards` (Hours Played, New Artists, Top Genre)
- [ ] Extend `AppContext` with `searchResults` + `listeningHistory` (note: not in original Phase 2 shape)

---

## ⏳ Phase 9 — Quality, Tests & Polish

Ticket: [phase-9-quality.md](./tickets/phase-9-quality.md) · **Status: pending**

- [ ] Unit: `FavoritesContext.test.tsx`
- [ ] Unit: `storage.test.ts`
- [ ] Unit: `useArtistDiscovery.test.ts`
- [ ] Unit: `AddFavoriteForm.test.tsx`
- [ ] E2E: `login.spec.ts`
- [ ] E2E: `artist-search.spec.ts`
- [ ] E2E: `favorites.spec.ts`
- [ ] Final visual polish (CTA gradients, glass cards, blobs, responsive 375/768/1280)
- [ ] Loading spinner component (`Spinner.tsx`)
- [ ] README updated (description, setup, architecture, scripts)
