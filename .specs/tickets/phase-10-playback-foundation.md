# Phase 10 — Music Playback Foundation (Web Playback SDK + Player API)

## Goal

Build the data and infrastructure layer that makes real music playback possible:
the **Spotify Web Playback SDK** (an in-browser Spotify Connect device that streams the
**full** track) plus the **Web API player-control services** that drive it
(`/me/player/*`), all funneled through a single global `PlayerContext`.

This phase ships **no visible UI changes** beyond the SDK loading silently — the
functional [`PlayerBar`](../../src/components/layout/PlayerBar.tsx) and the per-track
"play" triggers are **Phase 11** ([phase-11-player-ui.md](./phase-11-player-ui.md)).

> ⚠️ **Premium required.** Every `/me/player/*` control endpoint and the Web Playback
> SDK itself only work for **Spotify Premium** accounts (`doc.yaml` repeats this on each
> operation). On a free account the SDK fires an `account_error`; the context must surface
> that as a non-fatal "Premium required" state, never a crash.

## Reference

- Endpoints: [`src/api/services/spotify/doc.yaml`](../../src/api/services/spotify/doc.yaml)
  — Player tag, lines ~3483–4022:
  - `GET  /me/player` — Get Playback State (`OneCurrentlyPlaying`, `204` when idle)
  - `PUT  /me/player` — Transfer Playback (`device_ids: [id]`, `play`) → move playback to our SDK device
  - `GET  /me/player/devices` — list available devices
  - `PUT  /me/player/play` — start/resume (`device_id` query; body `context_uri` **or** `uris[]`, `offset`, `position_ms`)
  - `PUT  /me/player/pause`
  - `POST /me/player/next` · `POST /me/player/previous`
  - `PUT  /me/player/seek?position_ms=`
  - `PUT  /me/player/volume?volume_percent=`
  - `PUT  /me/player/repeat?state=track|context|off`
  - `PUT  /me/player/shuffle?state=true|false`
- SDK docs: Spotify **Web Playback SDK** (`https://sdk.scdn.co/spotify-player.js`).
- Existing reference service to copy the file/Zod/mock pattern from:
  [`get-recently-played.ts`](../../src/api/services/spotify/player/get-recently-played.ts).
- Shared schemas: [`type.ts`](../../src/api/services/spotify/type.ts) (`spotifyTrackSchema`
  already exists and already carries `preview_url`).

## Tasks

### 1. OAuth scope

- Add `'streaming'` to `SCOPES` in
  [`src/utils/spotify-pkce.ts`](../../src/utils/spotify-pkce.ts) — required to create a
  Web Playback SDK device. `user-read-playback-state`, `user-modify-playback-state` and
  `user-read-currently-playing` are **already** present, so playback control is covered.
- **Note in PROGRESS:** existing logged-in users must re-authenticate once to pick up the
  new scope (old tokens lack `streaming`).

### 2. Player-control services — `src/api/services/spotify/player/`

One file per endpoint, mirroring the existing service pattern (Zod input schema, default
`limit`s, `USE_SPOTIFY_MOCK` short-circuit, named async fn). Control endpoints return
`204 No Content` → resolve `void`; no response schema needed for those.

- `get-playback-state.ts` — `GET /me/player`. Response schema: `device`, `is_playing`,
  `progress_ms`, `repeat_state`, `shuffle_state`, `item` (reuse `spotifyTrackSchema`).
  **Handle `204`** (nothing active) → return `null`.
- `transfer-playback.ts` — `PUT /me/player`, body `{ device_ids: [deviceId], play }`.
- `start-playback.ts` — `PUT /me/player/play`. Input: `{ deviceId?, contextUri?, uris?, offset?, positionMs? }`.
- `pause-playback.ts` — `PUT /me/player/pause`.
- `skip-to-next.ts` — `POST /me/player/next`.
- `skip-to-previous.ts` — `POST /me/player/previous`.
- `seek-to-position.ts` — `PUT /me/player/seek?position_ms=`.
- `set-volume.ts` — `PUT /me/player/volume?volume_percent=` (clamp 0–100).
- `set-repeat-mode.ts` — `PUT /me/player/repeat?state=` (`'track' | 'context' | 'off'`).
- `set-shuffle.ts` — `PUT /me/player/shuffle?state=`.
- All accept an optional `deviceId` query param (defaults to active device).
- Each gets a sibling mock in `src/api/mocks/spotify/player/` (`successMock`; control
  endpoints can export a no-op resolver). `get-playback-state.mock.ts` must also export an
  `emptyMock` (the `204` case).

### 3. Web Playback SDK loader — `src/utils/spotify-player-sdk.ts`

- `loadSpotifyPlayerSDK(): Promise<void>` — injects `https://sdk.scdn.co/spotify-player.js`
  once (idempotent; resolve immediately if already present). Resolves when
  `window.onSpotifyWebPlaybackSDKReady` fires.
- Add the `Spotify.Player` typings (`window.Spotify`, `onSpotifyWebPlaybackSDKReady`) to
  [`src/vite-env.d.ts`](../../src/vite-env.d.ts) — minimal hand-written types, no extra dep.

### 4. `PlayerContext` — `src/contexts/PlayerContext.tsx`

Single source of truth for playback, following the existing `AppContext` /
`FavoritesContext` `useReducer` convention. Wired into
[`Providers.tsx`](../../src/Providers.tsx) **inside** the authenticated tree (it needs the
token).

- **On mount (authenticated only):** `loadSpotifyPlayerSDK()` → `new Spotify.Player({ name:
  'KanaPlay Web Player', getOAuthToken: cb => cb(token), volume })`.
- **SDK listeners:**
  - `ready` → store `device_id`; **`transferPlayback({ deviceIds: [device_id], play:
    false })`** so commands target our browser device.
  - `player_state_changed` → update `currentTrack`, `isPlaying`, `progressMs`, `durationMs`,
    `shuffle`, `repeatMode` from the SDK state (the SDK pushes state ~every second while
    playing — no polling needed).
  - `not_ready` → mark device offline.
  - `initialization_error` / `authentication_error` / `account_error` → set
    `error: 'premium_required' | 'auth' | 'init'` (non-fatal).
- **Exposed state:** `currentTrack`, `isPlaying`, `progressMs`, `durationMs`, `volume`,
  `shuffle`, `repeatMode`, `deviceId`, `isReady`, `error`.
- **Exposed actions** (each delegates to the Phase-2 services, with **optimistic** local
  state where it reads well):
  `playTrack(uris | contextUri, offset?)`, `togglePlay()`, `next()`, `previous()`,
  `seek(ms)`, `setVolume(0-100)`, `toggleShuffle()`, `cycleRepeat()`.
- `playTrack` calls `startPlayback({ deviceId, ... })`; `togglePlay` may use the SDK's local
  `resume()`/`pause()` for snappiness, falling back to the REST endpoints.
- Tear down the SDK (`player.disconnect()`) on logout / unmount.

### 5. `usePlayer` hook — `src/contexts/usePlayer.ts` (or co-located)

Thin `useContext(PlayerContext)` wrapper that throws outside the provider — same shape as
the existing context hooks. This is what Phase 11's `PlayerBar` and play buttons consume.

## Acceptance Criteria

- App still builds, lints, and runs; an existing session is unaffected apart from needing
  one re-login for the `streaming` scope.
- With a **Premium** account: the SDK device "KanaPlay Web Player" appears in the user's
  Spotify Connect device list, and calling `playTrack(...)` from a quick dev harness (or the
  browser console via the exposed context) **plays the full track in the browser tab**.
- `player_state_changed` keeps `PlayerContext` in sync (play/pause/track/progress) without
  manual polling.
- With a **free** account the SDK init fails gracefully: `error === 'premium_required'`, no
  uncaught exception, the rest of the app works.
- Every new service has a Zod-validated response (where there is a body) and a mock honoring
  `USE_SPOTIFY_MOCK`.
- All endpoints, params, and request-body shapes match `doc.yaml`.

## Notes / Constraints

- **`USE_SPOTIFY_MOCK` can't fake real audio.** Mocks let the services resolve and let the
  UI render a "now playing" state, but no sound plays without a live Premium token + the
  real SDK. Document this clearly in PROGRESS — it's the same honesty bar the Insights phase
  set ("no simulation").
- The SDK only works over **https or `http://localhost`** (a Web Crypto / secure-context
  requirement) — same constraint the PKCE redirect already lives under.
- Keep `PlayerContext` decoupled from the visual `PlayerBar`: this phase exposes state +
  actions only; Phase 11 binds them to the footer UI and per-track play buttons.
