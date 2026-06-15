# KanaPlay

A single-page application that consumes the **Spotify Web API** to discover artists, search the catalog, browse artist profiles, manage a personal collection of favorites, and visualize listening insights. The UI follows a **Liquid Glass** (glassmorphism) aesthetic.

## Tech Stack

| Concern | Technology |
| --- | --- |
| Core | React 19 + TypeScript |
| Build / Dev server | Vite |
| State management | Context API + `useReducer` |
| Data fetching | TanStack React Query + Axios |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| Forms | React Hook Form + Zod |
| i18n | i18next — `en-US` and `pt-BR` |
| Charts | Recharts |
| Icons | Lucide |
| Routing | React Router v7 |
| Auth | Spotify OAuth 2.0 with PKCE |
| Unit tests | Vitest + Testing Library |
| E2E tests | Playwright |
| Tooling | ESLint + Prettier |

## Prerequisites

- **[Bun](https://bun.sh)** (this project uses `bun.lock` as its lockfile). Node.js 20+ also works if you prefer `npm`/`pnpm`, but the commands below assume Bun.
- A **Spotify account** and a registered Spotify app (only required to run against the live API — see [Spotify setup](#spotify-setup)). You can skip this entirely by using [mock mode](#mock-mode).

## Getting started

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_SPOTIFY_CLIENT_ID` | Client ID of your Spotify app | — |
| `VITE_SPOTIFY_BASE_URL` | Spotify Web API base URL | `https://api.spotify.com/v1` |
| `VITE_SPOTIFY_AUTH_URL` | Spotify token endpoint | `https://accounts.spotify.com/api/token` |
| `VITE_HOST` | Dev server host. **Do not use `localhost`** — Spotify rejects it | `127.0.0.1` |
| `VITE_PORT` | Dev server port | `5173` |
| `VITE_USE_SPOTIFY_MOCK` | Set to `true` to run fully offline against bundled mocks | `false` |

> ⚠️ The Spotify API does **not** accept `localhost` as a redirect host. Use `127.0.0.1` for `VITE_HOST`.

### 3. Run the dev server

```bash
bun run dev
```

The app will be available at `http://127.0.0.1:5173` (or whatever host/port you configured).

## Spotify setup

To run against the real Spotify API:

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create an app.
2. Copy the **Client ID** into `VITE_SPOTIFY_CLIENT_ID`.
3. Under the app settings, add a **Redirect URI** that matches your dev server plus the `/callback` route, e.g.:
   ```
   http://127.0.0.1:5173/callback
   ```
4. Save, then start the app and click **Log in with Spotify**. Authentication uses the OAuth 2.0 **Authorization Code with PKCE** flow — no client secret is required.

## Mock mode

You can run the entire app offline, without any Spotify credentials, by enabling the bundled mocks:

```bash
# in .env
VITE_USE_SPOTIFY_MOCK=true
```

In mock mode, logging in skips the OAuth redirect and the app serves deterministic fixture data. This is the same mode used by the E2E suite.

## Available scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Vite dev server with HMR |
| `bun run build` | Type-check (`tsc -b`) and build for production |
| `bun run preview` | Serve the production build locally |
| `bun run lint` | Run ESLint |
| `bun run format` | Format all files with Prettier |
| `bun run format:check` | Check formatting without writing |
| `bun run test` | Run unit tests once (Vitest) |
| `bun run test:watch` | Run unit tests in watch mode |
| `bun run test:coverage` | Run unit tests with coverage report |
| `bun run test:e2e` | Run Playwright E2E tests (boots the app in mock mode automatically) |

## Routes

| Route | Page | Access |
| --- | --- | --- |
| `/login` | Login / Spotify auth | Public |
| `/callback` | OAuth redirect handler | Public |
| `/` | Artist discovery (home) | Protected |
| `/artist/:id` | Artist profile | Protected |
| `/playlist/:id` | Playlist | Protected |
| `/collection` | My collection (favorites) | Protected |
| `/insights` | Insights dashboard | Protected |

Protected routes require an authenticated session and redirect to `/login` otherwise.

## Project structure

```
src/
├── api/
│   ├── mocks/spotify/      # Offline fixtures (mock mode + E2E)
│   └── services/spotify/   # Axios instance + typed API services (Zod-validated)
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Navbar, sidebar, player bar, page wrappers
│   ├── player/             # Playback controls
│   └── favorites/          # Favorites dialogs
├── contexts/               # AppContext, FavoritesContext, PlayerContext (useReducer)
├── hooks/                  # Shared hooks (use-local-storage, use-media-query, …)
├── langs/                  # i18next config + en-US / pt-BR resources
├── lib/                    # Utilities (cn() helper, …)
├── pages/                  # One folder per page (component + local hooks/components)
├── routes/                 # React Router configuration
├── styles/                 # Global styles / Tailwind layers
└── utils/                  # spotify-pkce, storage helpers, …
```

Path aliases are configured in `vite.config.ts`: `@` → `src/`, `@pages`, `@types`, `@contexts`.

## Testing

- **Unit tests** live next to the code as `*.test.ts(x)` and run in a jsdom environment. Coverage focuses on contexts and hooks.
  ```bash
  bun run test
  ```
- **E2E tests** live in `e2e/` and run against a Chromium browser. Playwright starts the dev server in mock mode automatically, so no Spotify credentials are needed.
  ```bash
  bun run test:e2e
  ```

## Production build

```bash
bun run build      # outputs to dist/
bun run preview    # preview the built app locally
```

The `dist/` folder is a static bundle and can be deployed to any static host. Remember to register the deployed origin's `/callback` URL as a Redirect URI in your Spotify app.
