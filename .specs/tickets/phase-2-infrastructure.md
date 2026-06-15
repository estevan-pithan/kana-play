# Phase 2 — Core Infrastructure (Providers, i18n, Router, Axios, Contexts)

## Goal

Build all foundational infrastructure that every page depends on: providers hierarchy, global state contexts, i18n setup, routing, and the Spotify Axios instance.

## Status: Done ✅

> ⚠️ **Navbar note:** The Navbar delivered in this phase (logo + centered nav links + language switcher) is superseded by the Change ticket. See `change-navbar-discovery.md`.

## Tasks

### 1. i18n Setup (`src/langs/`)

- `i18n.ts`: initialize i18next with `react-i18next`, default language `enUS`, interpolation `escapeValue: false`
- `resources.ts`: export `RESOURCES` object mapping `enUS` and `ptBR` to their JSON files + icon names
- `en-US.json`: all English strings for all pages (keys: `common`, `nav`, `login`, `artistDiscovery`, `artistProfile`, `collection`, `insights`)
- `pt-BR.json`: all Portuguese translations for the same keys
- Import `./langs/i18n.js` as a side-effect in `src/main.tsx`

### 2. AppContext (`src/contexts/AppContext.tsx`)

Global state via `useReducer`:

```

State: { token: string | null, language: 'enUS' | 'ptBR', theme: 'light' | 'dark', isAuthLoading: boolean }
Actions: SET_TOKEN | SET_LANGUAGE | SET_THEME | SET_AUTH_LOADING

```

- Export `AppProvider`, `useApp` hook, and all action types

### 3. FavoritesContext (`src/contexts/FavoritesContext.tsx`)

```

State: { favorites: FavoriteTrack[] }
FavoriteTrack: { id, trackName, artist, album, notes?, addedAt }
Actions: ADD_FAVORITE | REMOVE_FAVORITE | LOAD_FAVORITES

```

- On mount: load from `localStorage` key `kanaplay_favorites`
- On every state change: sync to `localStorage` via `useEffect`

### 4. Providers Hierarchy (`src/Providers.tsx`)

```

QueryClientProvider → AppProvider → FavoritesProvider → RouterProvider

```

### 5. Spotify Axios Instance (`src/api/services/spotify/api.ts`)

- `baseURL`: `https://api.spotify.com/v1`
- Request interceptor: injects `Authorization: Bearer <token>`
- Response interceptor: 401 → `SET_TOKEN(null)`; 400 → `toast.error()`

### 6. Router (`src/routes/router.tsx`)

```

/login        → Login (public)
/callback     → Callback (public, OAuth)
/             → ProtectedRoute
/           → ArtistDiscovery (Home)
/artist/:id → ArtistProfile
/collection → MyCollection (URL only, not in navbar)
/insights   → Insights (via UserMenu dropdown)

```

### 7. Layout Components

- `Navbar.tsx` — original (superseded by Change ticket)
- `PageWrapper.tsx` — padding `36px 32px`, max-width `1280px`
- `SearchBar.tsx`, `SearchTypeSelect.tsx`, `UserMenu.tsx` — created in Change ticket

## Acceptance Criteria

- `useApp()` returns state and dispatch
- `useFavorites()` returns favorites array and add/remove actions
- Favorites survive page refresh (localStorage)
- Navigating to `/` without token redirects to `/login`
- All i18n keys resolve without missing-key warnings
