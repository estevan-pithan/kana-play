# Phase 9 — Quality & Tests (LEAN STRATEGY 2026-06-15)

> **Strategy pivot:** the previous version of this ticket aimed at 12+ unit tests
> across every hook + context + an 80 % coverage gate. That made the suite hard to
> explain in a portfolio context (lots of similar-looking React Query mocks, plus a
> very expensive `PlayerContext` test that mocks the whole Spotify Web Playback SDK).
>
> This rewrite picks **5 unit tests + 2 E2E specs**, each illustrating a _different_
> testing pattern. Anyone reading the suite sees one example per pattern and can
> generalize from there.

## Goal

Demonstrate the testing approach for KanaPlay with a minimal, representative suite —
unit + component + E2E — that runs offline against the bundled Spotify mocks.

## Decisions already made (do not re-litigate)

1. **E2E runs against the bundled mocks, driven by env.** Playwright never hits the
   real Spotify API (it would need OAuth + Premium + a live token, and is non-deterministic).
2. **No coverage thresholds.** The portfolio value is _patterns_, not the percentage.
   Coverage reporting is still on (`bun run test:coverage`) for visibility, just not gated.

## ✅ Fase A — Infra (DONE & VERIFIED)

- [x] [src/api/services/spotify/api.ts](../../src/api/services/spotify/api.ts) — `USE_SPOTIFY_MOCK`
      is `import.meta.env.VITE_USE_SPOTIFY_MOCK === 'true'` (default `false`).
- [x] [playwright.config.ts](../../playwright.config.ts) — `webServer.env.VITE_USE_SPOTIFY_MOCK = 'true'`.
- [x] [src/vite-env.d.ts](../../src/vite-env.d.ts) — `VITE_USE_SPOTIFY_MOCK` typed.
- [x] [.env.example](../../.env.example) — documents the new var.
- [x] [src/test/utils.tsx](../../src/test/utils.tsx) — `renderWithProviders`,
      `renderHookWithProviders`, `createTestQueryClient`.
- [x] [vite.config.ts](../../vite.config.ts) — `coverage` block (provider `v8`,
      include scoped to contexts + hooks, **no thresholds**).
- [x] [eslint.config.js](../../eslint.config.js) — relaxed rules for `**/*.test.{ts,tsx}` and `src/test/**`.
- [x] [package.json](../../package.json) — `test:coverage` script; `@vitest/coverage-v8` installed.

## ✅ Fase B — Unit & component tests (5 files, one per pattern)

Each file demonstrates a distinct pattern. The rest of the codebase reuses the same
shapes — anyone who reads these can extend the suite.

| File                                                                                                                | Pattern demonstrated                                                                                  |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [src/utils/storage.test.ts](../../src/utils/storage.test.ts) ✅                                                     | pure function + `localStorage`                                                                        |
| [src/contexts/FavoritesContext.test.tsx](../../src/contexts/FavoritesContext.test.tsx) ✅                           | context + reducer + persistence (`renderHook` w/ wrapper)                                             |
| [src/api/services/spotify/search/search.test.ts](../../src/api/services/spotify/search/search.test.ts) ✅           | service with real branching logic — round-robin interleave, dedupe, limit clamp, `apiSpotify.get` spy |
| [src/pages/home/hooks/useSearchResults.test.ts](../../src/pages/home/hooks/useSearchResults.test.ts) ✅             | React Query hook — `vi.mock` the service, `renderHookWithProviders`, assert on mapped data + states   |
| [src/components/favorites/AddFavoriteDialog.test.tsx](../../src/components/favorites/AddFavoriteDialog.test.tsx) ✅ | RTL component test — form validation, `userEvent`, i18n strings, toast spy                            |

## ✅ Fase C — E2E specs (2 specs, golden paths only)

Both run with `VITE_USE_SPOTIFY_MOCK=true` (Playwright `webServer.env`). The login
mock short-circuit logs straight in without a real OAuth redirect.

| File                                                    | What it covers                                                                                                                                     |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [e2e/login.spec.ts](../../e2e/login.spec.ts) ✅         | `/login` → click "Continue with Spotify" → land on `/` and persist `kanaplay_token`                                                                |
| [e2e/favorites.spec.ts](../../e2e/favorites.spec.ts) ✅ | login → click heart on a track → submit dialog → heart flips to "Remove from favorites" (proves component + context + persistence work end-to-end) |

`smoke.spec.ts` (pre-existing) stays — boots the app, asserts the title.

## Acceptance Criteria — all green

- `bun run test` — 5 files, 33 tests passing.
- `bun run test:e2e` — 3 specs passing (login, favorites, smoke).
- `bun run build` (tsc) — clean.
- `bun run lint` — clean (warnings only, all in pre-existing files).

## Patterns reference (for extending the suite later)

- **Pure functions:** plain Vitest, `window.localStorage.clear()` in `afterEach`.
- **Contexts:** `renderHook(() => useX(), { wrapper })` or `renderHookWithProviders`,
  wrap state changes in `act()`, `waitFor` for async.
- **React Query hooks:** `vi.mock('@/api/services/.../service')`, then
  `renderHookWithProviders` with a fresh `createTestQueryClient()` per test.
- **Components (RTL):** `renderWithProviders(<Comp/>)`, `@testing-library/user-event`,
  query by role/label, assert the real i18n (enUS) strings.
- **Async services with axios:** `vi.spyOn(apiSpotify, 'get').mockResolvedValue({ data })`;
  feed it the shape from the matching `*.mock.ts` raw fixture.

## What was intentionally cut from the original ticket

- **Per-hook tests for every page** — they're all variations of the React Query
  pattern already shown by `useSearchResults`. Adding 6 more would not teach anything new.
- **`PlayerContext.test.tsx`** — required mocking the entire Spotify Web Playback SDK
  (`window.Spotify`, the script loader, all listeners). Highest cost, lowest pedagogical
  value of the original list.
- **`AppContext.test.tsx`** — `FavoritesContext` already demonstrates the
  context+reducer+persistence pattern.
- **`type.test.ts`** — the slim-artist regression is implicitly covered by `search.test.ts`,
  which round-trips real `/search` payloads through the schema.
- **80 % coverage gate** — replaced by "one test per pattern" so the bar is _clarity_,
  not a percentage.
- **`home.spec.ts` / `search.spec.ts`** — `favorites.spec.ts` exercises the same
  navigation + rendering path; redundant for a portfolio.
