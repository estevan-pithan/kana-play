# Phase 2 — Core Infrastructure (Providers, i18n, Router, Axios, Contexts)

## Goal

Build all foundational infrastructure that every page depends on: providers hierarchy, global state contexts, i18n setup, routing, and the Spotify Axios instance.

## Tasks

### 1. i18n Setup (`src/langs/`)

- `i18n.ts`: initialize i18next with `react-i18next`, default language `enUS`, interpolation `escapeValue: false`
- `resources.ts`: export `RESOURCES` object mapping `enUS` and `ptBR` to their JSON files + icon names
- `en-US.json`: all English strings for all 5 pages (keys: `common`, `nav`, `login`, `artistDiscovery`, `artistProfile`, `collection`, `insights`)
- `pt-BR.json`: all Portuguese translations for the same keys
- Import `./langs/i18n.js` as a side-effect in `src/main.tsx`

### 2. AppContext (`src/contexts/AppContext.tsx`)

Global state via `useReducer`:

```
State: { token: string | null, language: 'enUS' | 'ptBR', theme: 'light' | 'dark', isAuthLoading: boolean }
Actions: SET_TOKEN | SET_LANGUAGE | SET_THEME | SET_AUTH_LOADING
```

- Export `AppProvider`, `useApp` hook, and all action types
- `AppProvider` wraps children and exposes dispatch + state via context

### 3. FavoritesContext (`src/contexts/FavoritesContext.tsx`)

Favorites state via `useReducer`:

```
State: { favorites: FavoriteTrack[] }
FavoriteTrack: { id: string, trackName: string, artist: string, album: string, notes?: string, addedAt: string }
Actions: ADD_FAVORITE | REMOVE_FAVORITE | LOAD_FAVORITES
```

- On mount: load from `localStorage` key `kanaplay_favorites` via `LOAD_FAVORITES` dispatch
- On every state change: sync to `localStorage` via `useEffect`
- Export `FavoritesProvider`, `useFavorites` hook

### 4. Providers Hierarchy (`src/Providers.tsx`)

Compose all providers in the correct order:

```
QueryClientProvider (React Query)
  └── AppProvider
        └── FavoritesProvider
              └── RouterProvider (react-router)
```

Update `src/main.tsx` to render `<Providers />` instead of `<App />`.

### 5. Spotify Axios Instance (`src/api/services/spotify/api.ts`)

- `baseURL`: `https://api.spotify.com/v1`
- `USE_SPOTIFY_MOCK` flag exported
- Request interceptor: reads token from `AppContext` (via a module-level getter) and injects `Authorization: Bearer <token>`
- Response interceptor: on 401 → dispatch `SET_TOKEN(null)` to force re-login; on 400 → `toast.error()`

### 6. Environment Config (`src/config/env.ts`)

```ts
export const ENV = {
  spotifyClientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  spotifyClientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
  spotifyBaseUrl: 'https://api.spotify.com/v1',
  spotifyAuthUrl: 'https://accounts.spotify.com/api/token',
}
```

Create `.env.example` with the required variable names.

### 7. Router (`src/routes/router.tsx`)

Define all routes per the spec:

```
/login          → Login (public)
/               → ProtectedRoute
  /             → ArtistDiscovery
  /artist/:id   → ArtistProfile
  /collection   → MyCollection
  /insights     → Insights
```

Create `src/components/ProtectedRoute.tsx` that reads `useApp()` — if no token, redirect to `/login`.

### 8. Layout Components (`src/components/layout/`)

- `Navbar.tsx`:
  - Left: cheese-wedge logo image (`src/assets/logo.png`, 36px height) + **KanaPlay** text in Yellow Ochre (`#E8B84B`)
  - Center: nav links (Discover, Collection, Insights) — active link uses ochre color + `rgba(200,146,42,0.12)` background
  - Right: language switcher (calls `i18n.changeLanguage`)
  - Background: `rgba(255,255,255,0.05)` with `backdrop-filter: blur(20px)`, bottom border `rgba(255,255,255,0.09)`
- `PageWrapper.tsx`: wraps page content with consistent padding (`36px 32px`) and max-width (`1280px`)

## Acceptance Criteria

- `useApp()` returns state and dispatch from AppContext
- `useFavorites()` returns favorites array and add/remove actions
- Favorites survive page refresh (localStorage persistence)
- Navigating to `/` without a token redirects to `/login`
- Navbar renders on all protected pages with working language switcher
- All i18n keys resolve without missing-key warnings in console
