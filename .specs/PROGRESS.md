# KanaPlay — Implementation Progress

Tracker for the phases defined in [`tickets/`](./tickets/). Update the boxes as work
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

## ✅ Phase 6 — Artist Profile

Ticket: [phase-6-artist-profile.md](./tickets/phase-6-artist-profile.md) · **Status: done**

- [x] `ArtistProfile.tsx` page (`/artist/:id`) — built from `screens/profile.html` (liquid-glass design)
- [x] `ArtistHero` (full-bleed backdrop, verified badge, gradient name, genres, play/follow/more)
- [x] `AlbumsTable` — real `<table>`, offset-paginated (8/page), Prev/Next pager, no infinite scroll
- [x] `AlbumTracksView` — selecting an album swaps the frame to its tracks
- [x] `AddFavoriteDialog` (RHF + Zod, pre-filled) — opens from a track row
- [x] Duration formatted as mm:ss; release dates localized
- [x] `getAlbumTracks` service + mock (GET /albums/{id}/tracks)

**Notes**
- **Pivot from the ticket:** the live Spotify API stopped returning `followers`,
  `popularity` **and the artist top-tracks endpoint** for this app, so those were
  dropped per the user. The page now centers on a **paginated albums table**; clicking
  an album switches the frame to that album's track list.
- **Back navigation:** in album-tracks view a chevron-left (`common.back`) runs
  `navigate(-1)` to return to the screen the user came from (Home/search), per the
  user's choice. Album selection is local state (no history push), so back exits the
  profile rather than returning to the album list.
- `ArtistHero` shows genres in place of the removed follower/popularity stat pills.
- Removed the originally-planned `TopTracksList`, `AboutArtistCard`, `FansAlsoLike`
  components (About + Fans sections cut per user request).
- The shadcn `Tabs` (Top Tracks / Albums) from the ticket were not used — the design
  has a single switchable frame, not tabs.

---

## ⏭️ Phase 7 — My Collection

Ticket: [phase-7-my-collection.md](./tickets/phase-7-my-collection.md) · **Status: skipped (deferred per user request)**

- [-] `MyCollection.tsx` page (`/collection`)
- [-] `LibrarySidebar`, `LikedSongsGrid`
- [-] `AddFavoriteForm` (RHF + Zod, min 2 chars)
- [-] Remove with confirmation
- [-] Empty state

**Notes**
- Skipped to implement Phase 8 first, per user request (2026-06-15). Route + page stub
  remain wired in the router; revisit later.

---

## ✅ Phase 8 — Insights Dashboard

Ticket: [phase-8-insights.md](./tickets/phase-8-insights.md) · **Status: done**

- [x] `Insights.tsx` page (`/insights`) — built from `screens/insights.html` (sidebar + charts + stat cards)
- [x] `InsightsSidebar` (Overview active, History/Top Charts/Global Stats, Export Report)
- [x] `ListeningTrendsChart` (Recharts area/line) — real listening hours/day, last 7 days
- [x] `TopArtistsChart` (Recharts donut) — real top artists by recent play count
- [x] `StatCards` (Hours Played, New Artists, Top Artist)
- [x] `useInsightsData` — React Query hook combining `/me/top/artists` + `/me/player/recently-played`
- [x] `get-recently-played.ts` service + mock (GET /me/player/recently-played)
- [x] `get-saved-tracks.ts` service + mock (GET /me/tracks — Library Stats total)
- [x] Period selector (Week/Month/Year) → `time_range` (short/medium/long_term) on `/me/top/*`
- [x] **Functional sidebar tabs** (Overview / History / Top Charts / Library Stats)
- [x] Loading / error / empty states; all strings via `t('insights.*')`

**Notes**
- **Pivot from the ticket: 100% real Spotify data, no simulation** (per user request,
  2026-06-15). The ticket's simulated `AppContext.searchResults` + `listeningHistory`
  were **not** added — instead everything is derived from two real endpoints:
  `/me/top/artists` (scoped by the period selector) and `/me/player/recently-played`.
- **Genre dropped:** Spotify no longer returns `genres`/`followers` for this app (also
  marked `deprecated` in `doc.yaml`), so the genre-based widgets were re-labelled to
  **artists**: "Monthly Favorites" donut → **Top Artists** (by recent play count),
  "Top Genre" card → **Top Artist** (`/me/top/artists[0]`).
- **Listening Trends** is a single real series (hours/day over the last 7 days from
  recently-played). The design's "This Month vs Last Month" two-line view is impossible:
  `/me/player/recently-played` returns only the ~50 most recent plays, not two months.
- **Stat cards** show real values with no fabricated deltas: Hours Played = Σ duration of
  recently-played; New Artists = recently-played artists not in your top artists; Top
  Artist = #1 top artist for the selected period.
- Charts are toggled by `USE_SPOTIFY_MOCK` like every other service (mock exposes
  `successMock`/`emptyMock`/`errorMock`); the mock builds timestamps relative to load
  time so the trend always covers the last several days.
- Navbar / PlayerBar / background blobs come from `ProtectedLayout`, so the page itself
  only renders the sidebar + main content.
- **Sidebar tabs are functional** (the ticket's were decorative). Each is real data:
  - **Overview** → charts + stat cards (above).
  - **History** → `/me/player/recently-played` as a track list with relative timestamps.
  - **Top Charts** → ranked `/me/top/artists` + `/me/top/tracks` (scoped by the period selector).
  - **Library Stats** → replaced the spec's **Global Stats** (Spotify exposes no worldwide
    stats; `/browse/*` is deprecated like genres). Shows real account totals: Liked Songs
    (`/me/tracks`), Saved Albums (`/me/albums`), Playlists (`/me/playlists`), Following
    (`/me/following`) — each read from the endpoint's `total` field.
- The period selector only renders on Overview + Top Charts (the only views scoped by
  `time_range`); History and Library Stats hide it.

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

---

## ✅ Phase 10 — Music Playback Foundation (Web Playback SDK + Player API)

Ticket: [phase-10-playback-foundation.md](./tickets/phase-10-playback-foundation.md) · **Status: done**

- [x] Add `streaming` scope to `spotify-pkce.ts` (existing users must re-login once)
- [x] Player-control services in `player/`: `get-playback-state`, `transfer-playback`, `start-playback`, `pause-playback`, `skip-to-next`, `skip-to-previous`, `seek-to-position`, `set-volume`, `set-repeat-mode`, `set-shuffle`
- [x] `get-playback-state.mock.ts` with `successMock` / `emptyMock` (the `204` case) / `errorMock`
- [x] `spotify-player-sdk.ts` loader (idempotent script inject + `onSpotifyWebPlaybackSDKReady`)
- [x] `Spotify.Player` typings in `vite-env.d.ts`
- [x] `PlayerContext` (useReducer): SDK init, `ready`/`not_ready`/`player_state_changed`/error listeners, `transferPlayback` to our device
- [x] Actions: `playTrack`, `togglePlay`, `next`, `previous`, `seek`, `setVolume`, `toggleShuffle`, `cycleRepeat`
- [x] `usePlayer` hook + `PlayerProvider` wired into `Providers.tsx`
- [x] Graceful `premium_required` state on free accounts (no crash)

**Decision:** Playback strategy = **Web Playback SDK + REST `/me/player/*` control endpoints**
(chosen by user 2026-06-15). SDK creates an in-browser device that streams full tracks; the
doc.yaml control endpoints drive it. Requires **Spotify Premium** + the `streaming` scope.
Rejected alternatives: 30s `preview_url` (doesn't use the player endpoints, often `null` for new apps);
controlling an existing external device only (no in-browser audio).

**Notes**
- **Mocks only for the one endpoint with a body.** The 9 control endpoints all return
  `204 No Content` → `void`, so there is nothing to fabricate: each short-circuits inline with
  `if (USE_SPOTIFY_MOCK) return`. Only `get-playback-state` (which has a response) ships a
  `.mock.ts` (`success`/`empty`/`error`) — deviates from the ticket's "sibling mock for each"
  to avoid 9 empty no-op files.
- **SDK methods vs REST.** `togglePlay`/`next`/`previous`/`seek`/`setVolume` use the SDK
  player object directly (snappier, local to the browser device); `playTrack` (specific
  uris/context), `toggleShuffle` and `cycleRepeat` go through the REST services because the
  SDK player exposes no shuffle/repeat/queue-jump methods. Shuffle/repeat/volume/seek update
  local state **optimistically**; the authoritative value still arrives via
  `player_state_changed`.
- **Volume** is held 0–100 in state but the SDK's `setVolume` takes 0–1 (converted on the way
  out). No `/me/player/volume` REST call is used for the browser device — the SDK handles it.
- **Provider placement:** `PlayerProvider` wraps `RouterProvider` inside `FavoritesProvider`
  in `Providers.tsx` (it reads the token from `AppContext`). It only boots the SDK when a
  token exists and tears the player down (`disconnect()` + `RESET`) on logout. `usePlayer` is
  therefore available app-wide; the global `PlayerBar` (in `ProtectedLayout`) consumes it in
  Phase 11.
- **No audible sound without Premium + a live token.** With `USE_SPOTIFY_MOCK = true` the
  services resolve and `get-playback-state` returns a fake "now playing", but the SDK needs a
  real Premium token to emit audio — same honesty bar as Phase 8 ("no simulation").
- `getOAuthToken` reads the latest token from a ref, so token refreshes don't recreate the
  player. SDK only runs in a secure context (`https` / `http://localhost`) — same constraint
  as the PKCE redirect.
- **Re-login required once:** tokens issued before this phase lack the `streaming` scope; the
  SDK will emit `authentication_error` until the user logs in again.

---

## ✅ Phase 11 — Functional PlayerBar & Play Triggers

Ticket: [phase-11-player-ui.md](./tickets/phase-11-player-ui.md) · **Status: done**

- [x] Rewire `PlayerBar.tsx` to `usePlayer()` — removed `MOCK_TRACK` + local playback state
- [x] Transport bound to context (play/pause, next, prev, shuffle, repeat); progress + volume sliders → `seek`/`setVolume`
- [x] Cosmetic progress-tick interpolation between SDK state pushes (no polling)
- [x] Idle ("nothing playing") + `premium_required`/`connecting` disabled states
- [x] Like button reuses `FavoriteButton` (wired to `FavoritesContext`, not local state)
- [x] Play triggers on `TrackRow.tsx` (track uris) and `TrackItem.tsx`/`AlbumTracksView.tsx` (album context + offset)
- [x] Shared `PlayButton` component (`src/components/player/`); current-row "playing" indicator
- [x] i18n `player.*` keys (en-US + pt-BR); transport aria-labels moved to `t()`

**Notes**
- **Like button reuses the existing `FavoriteButton`** rather than a bespoke toggle — it
  already wires to `FavoritesContext` (open-dialog on add, remove on click) and matches the
  track lists. Favorites are matched by `trackName` + `artist`, so the bar's heart stays in
  sync with the same track's heart in the lists.
- **Progress interpolation is render-phase, not effect-based.** Mirroring the SDK's
  `progressMs` into local state via `useEffect` tripped `react-hooks/set-state-in-effect`;
  switched to the React "store info from previous renders" pattern (compare + setState during
  render). A 1s `setInterval` advances the bar between the SDK's ~1/s `player_state_changed`
  pushes; scrubbing suspends the tick and commits on `pointerup` via `seek()`.
- **`controlsDisabled = !isReady`** covers both connecting and premium-blocked (account_error
  also clears `isReady`); the hint text distinguishes them (`connecting` vs `premiumRequired`).
- **Repeat** uses `Repeat1` (lucide) for the `track` mode and `Repeat` for `off`/`context`,
  brand-tinted when not `off` — Spotify-style.
- **`TrackRow` / `TrackItem` now subscribe to `usePlayer`** to render the current-track
  highlight + playing indicator. This means visible track rows re-render on the SDK's ~1/s
  state push during playback — acceptable for the list sizes here; revisit with a selector/
  context split if lists grow large.
- **`PlayButton`** (`src/components/player/PlayButton.tsx`) is the shared affordance: plays
  its `playInput` when its track isn't current, else `togglePlay`; disabled + titled when
  `premium_required`. Home rows play a single track URI; album rows play the album context
  with a track `offset` so next/prev walk the album.
- Same Premium/mock caveat as Phase 10: with `USE_SPOTIFY_MOCK = true` the bar can show a
  fabricated "now playing" but no audio plays without a live Premium token.
