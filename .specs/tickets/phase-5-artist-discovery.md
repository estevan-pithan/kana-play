# Phase 5 — Artist Discovery Page

## Goal

Implement the Home / Artist Discovery page with Filter Chips liquid glass, search integrated in the navbar, and 5 personalized content sections for the authenticated user. No hero banner.

## Status: Done ✅ — refactored by Change ticket (`change-navbar-discovery.md`)

> ⚠️ **This page is being refactored.** The original delivery (Hero Banner + 2-column layout) is superseded by the Change ticket (`change-navbar-discovery.md`). The new implementation replaces HeroBanner, FeaturedArtistCard, and TopPickItem with 5 user-data sections.

## Original delivery (Phase 5)

- `useArtistDiscovery` hook (useInfiniteQuery, debounce 300ms, IntersectionObserver)
- `ArtistDiscovery.tsx` page (Hero + Featured Artists + Top Picks)
- `HeroBanner.tsx`, `FeaturedArtistCard.tsx`, `TopPickItem.tsx`
- `PlayerBar.tsx` (fixed footer, global)
- Loading skeleton, error state, empty state

## New implementation (Change ticket)

### Two modes

**Home mode** (no `?q=` in URL):
- `FilterChips` at top (All / Artists / Albums / Music / Playlists)
- 5 horizontal scroll sections via `SectionRow`:
  1. Top Playlists — `getUserPlaylists` — `PlaylistCard`
  2. Top Artists — `getUserTopArtists` — `ArtistCard` (circular photo)
  3. Top Tracks — `getUserTopTracks` — `TrackRow`
  4. Followed Artists — `getFollowedArtists` — `ArtistCard`
  5. Saved Albums — `getSavedAlbums` — `AlbumCard`
- Background: `#0d0d0d`, no hero banner, no blobs
- No tables anywhere

**Search mode** (`?q=` present in URL):
- Infinite scroll results grid
- Type filtered by `?type=` (all / artist / album / track / playlist)
- Loading skeleton + error state + empty state

### Components (new)

| Component | Description |
|---|---|
| `FilterChips.tsx` | Liquid glass chips, synced with `?type=` URL param |
| `SectionRow.tsx` | Generic section with horizontal scroll + skeleton |
| `PlaylistCard.tsx` | 160px cover + name + track count |
| `ArtistCard.tsx` | 140px circular photo + name + genre → `/artist/:id` |
| `TrackRow.tsx` | 48px thumbnail + name + artist + duration + "+" button |
| `AlbumCard.tsx` | 160px cover + name + artist + year |

### Hooks (new)

| Hook | Description |
|---|---|
| `useHomeData.ts` | 5 parallel useQuery calls for home sections |
| `useSearchResults.ts` | useInfiniteQuery for search mode (20 items/page) |

### Components to remove

- `HeroBanner.tsx`
- `FeaturedArtistCard.tsx`
- `TopPickItem.tsx`

## Acceptance Criteria

- Home displays 5 sections with real or mock user data
- FilterChips filter visible sections correctly
- Active chip synced with `?type=` URL param
- Search mode activated by typing in navbar: infinite scroll 20 items/page
- Scrolling to bottom triggers `fetchNextPage()`
- No tables in any section
- Loading skeletons per section during fetch
- Error state when API fails
- Empty state when search returns 0 results
- Click on artist card navigates to `/artist/:id`
- No hero banner "TRENDING NOW"
- All strings via `t()`
