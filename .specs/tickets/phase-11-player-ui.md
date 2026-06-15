# Phase 11 — Functional PlayerBar & Play Triggers

## Goal

Make playback **visible and interactive**: turn the currently-static
[`PlayerBar`](../../src/components/layout/PlayerBar.tsx) into a live controller bound to
`PlayerContext`, and add "play" affordances across the app so any track/album/playlist can
start playback.

Depends on **Phase 10** ([phase-10-playback-foundation.md](./phase-10-playback-foundation.md))
— it consumes `usePlayer()` and the `/me/player/*` actions defined there. **No new API work
here.**

## Reference

- [`PlayerBar.tsx`](../../src/components/layout/PlayerBar.tsx) — currently hard-codes
  `MOCK_TRACK` + `useState` for `isPlaying`/`progress`/`volume`. This is the file being
  rewired. Keep its exact liquid-glass layout/markup (3-column grid, transport cluster,
  progress + volume sliders, `.kana-range` styling) — only the data/handlers change.
- Visual contract: `screens/` + `master-spec.md` §"fixed player bar pinned to the footer".
- Track rows that should gain a play trigger:
  - [`src/pages/home/components/TrackRow.tsx`](../../src/pages/home/components/TrackRow.tsx)
  - [`src/pages/artist-profile/components/AlbumTracksView.tsx`](../../src/pages/artist-profile/components/AlbumTracksView.tsx)
- `PlayerBar` is mounted globally in
  [`ProtectedLayout.tsx`](../../src/components/layout/ProtectedLayout.tsx) — no remount work.

## Tasks

### 1. Rewire `PlayerBar.tsx` to `PlayerContext`

Replace all local mock state with `usePlayer()`:

- **Track info** (left): `currentTrack` cover / `name` / artists. When `currentTrack` is
  `null`, show a muted idle placeholder ("Nothing playing") instead of the mock cover.
- **Like button:** keep wired to `FavoritesContext` (favorite/unfavorite the current track),
  not local `useState`.
- **Transport (center):** `togglePlay`, `next`, `previous`, `toggleShuffle`, `cycleRepeat`.
  - Shuffle button active-styled when `shuffle === true`.
  - Repeat button reflects `repeatMode` (`off` / `context` / `track`); the `track` state can
    show a small "1" badge like Spotify (optional).
  - Play/Pause icon driven by `isPlaying`.
- **Progress bar:** value = `progressMs / durationMs`; labels show `progressMs` and
  `durationMs` as `mm:ss` (reuse the existing duration formatter; drop `formatProgress`'s
  percent math). `onChange` (release) → `seek(ms)`. While playing, the SDK's
  `player_state_changed` advances `progressMs`; smooth it with a local `requestAnimationFrame`
  / interval tick between SDK updates so the bar doesn't jump once per second.
- **Volume:** value = `volume`; `onChange` → `setVolume(0-100)`.
- **Disabled / premium state:** when `error === 'premium_required'` or `!isReady`, disable
  transport controls and show a subtle "Premium required" / "Connecting…" hint (tooltip or
  muted text) — never silently no-op.

### 2. Per-track play triggers

- **`TrackRow.tsx`** — add a play button (hover-revealed on the thumbnail, Spotify-style)
  that calls `playTrack({ uris: ['spotify:track:' + track.id] })`. If this row is the current
  track, swap the icon to a pause/equalizer indicator and call `togglePlay()` instead.
- **`AlbumTracksView.tsx`** — each track row plays within the **album context** so next/prev
  walk the album: `playTrack({ contextUri: 'spotify:album:' + albumId, offset: { uri:
  'spotify:track:' + track.id } })`. (Falls back to `uris` if no album id.)
- Reuse a single small presentational component for the row play button to avoid duplication
  (e.g. `src/components/PlayButton.tsx` or co-located) — match the existing component-pattern
  skill conventions.
- **Optional (only if a large "play" CTA already exists in the design):** wire the artist
  hero / album header play button to `playTrack({ contextUri })`. Skip if not in the screens.

### 3. i18n

Add keys under `player.*` for the new strings: `player.nothingPlaying`,
`player.premiumRequired`, `player.connecting`, and aria-labels if any are user-facing text.
Add to both `en-US.json` and `pt-BR.json`. Transport `aria-label`s that are currently
hard-coded English ("Shuffle", "Previous"…) should move to `t()` too.

## Acceptance Criteria

- Clicking play on any `TrackRow` / `AlbumTracksView` row starts that track in the browser
  (Premium) and the `PlayerBar` immediately reflects it (cover, title, artist, playing state).
- `PlayerBar` transport buttons all work end-to-end: pause/resume, next, previous, seek,
  volume, shuffle toggle, repeat cycle — verified against a real Premium session.
- Progress bar advances smoothly and stays in sync with the actual track; seeking jumps
  playback to the dragged position.
- The currently-playing row shows a distinct "playing" state; clicking it again pauses.
- Idle state (nothing playing) and premium-required state both render cleanly with no console
  errors and disabled-but-labeled controls.
- No remaining references to `MOCK_TRACK` or local playback `useState` in `PlayerBar`.
- All new strings go through `t()`; layout/visual parity with the screens is preserved.

## Notes / Constraints

- Full-track audio needs a **live Premium token** — with `USE_SPOTIFY_MOCK = true` the bar
  can show a fabricated "now playing" but won't emit sound (documented in Phase 10).
- Don't reintroduce polling: prefer the SDK's `player_state_changed` push from
  `PlayerContext`; the only local timer allowed is the cosmetic progress-tick interpolation.
- Keep `PlayerBar`'s markup/classes intact — this is a behavior change, not a redesign.
