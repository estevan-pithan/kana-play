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

## ✅ Phase 3 — Spotify API Layer

Ticket: [phase-3-api-layer.md](./tickets/phase-3-api-layer.md) · **Status: done**

- [x] Zod schemas co-located in each service file (Artist, Track, Album, Paging)
- [x] `get-token.ts` (Client Credentials flow)
- [x] `search-artists.ts` + mock
- [x] `get-artist.ts` + mock
- [x] `get-artist-top-tracks.ts` + mock
- [x] `get-artist-albums.ts` + mock
- [x] All mocks expose `successMock` / `emptyMock` / `errorMock`
- [x] `get-user-playlists.ts` + mock (GET /me/playlists)
- [x] `get-user-top-artists.ts` + mock (GET /me/top/artists)
- [x] `get-user-top-tracks.ts` + mock (GET /me/top/tracks)
- [x] `get-followed-artists.ts` + mock (GET /me/following?type=artist)
- [x] `get-saved-albums.ts` + mock (GET /me/albums)
- [x] `get-user-profile.ts` + mock (GET /me)
- [x] `search.ts` — generic search supporting `all` (multi-type fan-out) + single type

**Notes**
- Spec asked for a single `src/types/spotify.ts`, but the `api-requests` skill mandates
  schemas co-located in each service file — followed the skill. `get-artist.ts` owns the
  shared `spotifyImageSchema` / `spotifyArtistResponseSchema`, reused by the other services.
- Endpoint shapes verified against the official Spotify Web API docs (developer.spotify.com).
- `get-artist-top-tracks` now sends `market` (default `'US'`): with a client-credentials
  token there is no user country, so Spotify returns zero tracks without it.

---

## ✅ Phase 4 — Login Page

Ticket: [phase-4-login.md](./tickets/phase-4-login.md) · **Status: done**

- [x] `src/pages/login/Login.tsx` (glass card, single "Continue with Spotify" CTA)
- [x] `hooks/useSpotifyLogin.ts` (kicks off PKCE redirect / mock short-circuit → `SET_TOKEN` → `/`)
- [x] Spotify OAuth **Authorization Code + PKCE** flow (`src/utils/spotify-pkce.ts`)
- [x] `exchange-code-for-token.ts` service + mock (code → token, no client secret)
- [x] `/callback` route + `src/pages/callback/Callback.tsx` (validates state, exchanges code)
- [x] Language switcher in top-right
- [x] All strings via `t('login.*')`
- [x] Visual matches `screens/login.png` (glass card, logo, gradient CTA, blobs, footer)

**Notes**
- **Pivot from the ticket:** user requested **Spotify OAuth** instead of the Client ID/Secret
  form the ticket described. Implemented Authorization Code + PKCE (recommended for SPAs —
  no secret in the bundle, supports refresh tokens). The Phase 3 `get-token.ts`
  (Client Credentials) is now unused by login but left in place.
- **Mock short-circuit:** with `USE_SPOTIFY_MOCK = true`, the button logs straight in with
  the mock token (no real redirect), so the portfolio works without a registered redirect
  URI. With mocks off it redirects to `accounts.spotify.com` for real — requires the app's
  redirect URI (`<origin>/callback`) registered in the Spotify Dashboard.
- `VITE_SPOTIFY_CLIENT_ID` is read in `spotify-pkce.ts`; added `src/vite-env.d.ts` to type it.
- Refresh token is persisted to `localStorage` (`kanaplay_refresh_token`) for a future
  auto-refresh phase; no refresh logic wired yet.
- The screenshot's email/password fields + "Remember me / Forgot / Sign Up" were template
  decoration; replaced by the OAuth button. Unused `login.*` form keys left in i18n.

---

## ✅ Phase 5 — Artist Discovery

Ticket: [phase-5-artist-discovery.md](./tickets/phase-5-artist-discovery.md) · **Status: done**

- [x] `useArtistDiscovery` hook (`useInfiniteQuery`, debounce 300ms, IntersectionObserver)
- [x] `ArtistDiscovery.tsx` page (card grid, no tables)
- [x] `HeroBanner`, `FeaturedArtistCard`, `TopPickItem`
- [x] `PlayerBar` (fixed footer, global)
- [x] Loading skeleton, error state, empty state

**Notes**
- **Redesigned to match `screens/artist-discovery.png`** (screenshot landed after the
  first pass). The page now mirrors the print: curated landing = Hero + Featured Artists
  (row of image-top cards) + Top Picks (with "View All"). The old inline search bar +
  artist grid were removed from the page body.
- **Bug fix (search rendered nothing):** Spotify's `/search` returns **slim** artist
  objects without `genres` / `followers` / `popularity`, so `spotifyArtistResponseSchema.parse`
  threw a `ZodError` that React Query swallowed (no console log) → the page fell into its
  error state. Those three fields are now `.default()`ed in `type.ts`, so search results
  parse while the full `/artists/{id}` endpoint keeps its real values.
- **Search moved to the navbar icon** (per design): clicking the icon opens a debounced
  input that writes `?q=` to the URL. The Discovery page reads `?q` and switches between
  the curated landing (no query) and a results grid with infinite scroll (Phase 5 feature).
- Hero + Featured cards fetch the **full artist** (`getArtist`, cached) to show genre
  labels like the print, since `/search` doesn't include genres.
- Default browse query `'a'` still populates the curated landing on first load
  (Spotify's `/search` requires a non-empty `q`).
- The client-side **album/genre filter was dropped** — not present in the print.
- Navbar updated to the print style (centered nav + search icon + avatar); language
  switcher kept (requirement) next to the avatar.
- `PlayerBar` is wired into `ProtectedLayout` (global on all protected routes) with
  local UI state — no audio playback. Ticket says "reads from `AppContext`"; the
  context has no player slice yet, so kept self-contained for now.
- Custom `.kana-range` slider styling added to `glass.css` (track + thumb in brand
  colors). Page itself paints `#0d0d0d` over the layout's blobs as the ticket asks.
- **SUPERSEDED by Change ticket:** The Discovery page and Navbar are being refactored. See [change-navbar-discovery.md](./tickets/change-navbar-discovery.md).

---

## ✅ Change — Navbar Redesign + Home Discovery Refactor

Ticket: [change-navbar-discovery.md](./tickets/change-navbar-discovery.md) · **Status: done**

- [x] `Navbar.tsx` — substituir implementação (remover links centrais)
- [x] `SearchPill.tsx` — input + select grudados em pill liquid glass
- [x] `SearchTypeSelect.tsx` — select All/Artists/Albums/Music/Playlists → `?type=`
- [x] `UserMenu.tsx` — avatar dropdown (Insights, Idioma, Logout)
- [x] Ícone Home (lucide:Home) ao lado do logo → `/`
- [x] `FilterChips.tsx` — chips liquid glass sincronizados com `?type=`
- [x] `SectionRow.tsx` — componente genérico de seção com scroll horizontal
- [x] `PlaylistCard.tsx`, `ArtistCard.tsx`, `TrackRow.tsx`, `AlbumCard.tsx`
- [x] `useHomeData.ts` — 5 queries em paralelo
- [x] `useSearchResults.ts` — infinite scroll por query
- [x] `ArtistDiscovery.tsx` — refatorado (sem hero banner, 5 seções + modo busca)
- [x] Remover: `HeroBanner.tsx`, `FeaturedArtistCard.tsx`, `TopPickItem.tsx`, `useArtistDiscovery.ts`
- [x] i18n: novas chaves `nav.home`, `nav.searchPlaceholder`, `nav.logout`, `nav.typeAll`, etc.
- [x] `dropdown-menu.tsx` (Shadcn) + `@radix-ui/react-dropdown-menu` instalado

**Notes**
- Navbar agora é um grid 3 colunas: logo+Home / SearchPill / UserMenu. Sem links de texto centrais.
- `?q=` e `?type=` são a única fonte de verdade — `SearchPill`, `SearchTypeSelect` e `FilterChips` apenas leem/escrevem nesses parâmetros.
- `search.ts` substitui `useArtistDiscovery`. Suporta `all` (fan-out paralelo de 4 chamadas com interleave round-robin) e tipo único.
- FilterChips na Home filtra quais seções aparecem: `all` mostra todas; `artist` mostra Top Artists + Followed Artists; `album` → Saved Albums; `track` → Top Tracks; `playlist` → Top Playlists.
- Card de busca renderiza por kind (Artist/Album/Playlist como card 160px, Track ocupa linha inteira).
- `UserMenu` lê `/me` via `getUserProfile`; fallback com inicial em gradiente brand quando não há avatar.
- Schemas movidos para `type.ts` (album, track, playlist, user profile, paging genérico) — services antigos re-exportam os tipos para não quebrar imports.

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
