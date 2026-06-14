# Phase 5 — Artist Discovery Page (Infinite Scroll)

## Goal

Implement the main Artist Discovery page with infinite scroll, search, and filter functionality using a card grid layout.

## Reference

Reference screen: `screens/artist-discovery.png` — agent must request the user to upload this image before implementing.

> ⚠️ Instruction for the agent: Before starting the implementation of this screen, ask the user to upload the `artist-discovery.png` image directly in the chat. Analyze the image pixel by pixel to ensure the layout, spacing, colors, typography, and element arrangement are identical to the screenshot. Do not assume any visual detail without confirming it in the image.

## Tasks

### Hook: `src/pages/artist-discovery/hooks/useArtistDiscovery.ts`

- `useInfiniteQuery` calling `searchArtists({ query, limit: 20, offset })`:
  - `queryKey`: `['artists', debouncedQuery]`
  - `getNextPageParam`: uses `offset + limit < total` to determine next offset
  - `initialPageParam`: `0`
- Debounced search query (300 ms) via `setTimeout` in `useEffect`
- `IntersectionObserver` on `loadMoreRef` sentinel div → calls `fetchNextPage()`
- Album filter: client-side filter on loaded artists' albums (or secondary search)
- Returns: `artists`, `isLoading`, `isError`, `isFetchingNextPage`, `hasNextPage`, `loadMoreRef`, `query`, `setQuery`, `albumFilter`, `setAlbumFilter`

### Page: `src/pages/artist-discovery/ArtistDiscovery.tsx`

Layout faithful to the `artist-discovery.png` screenshot:

- **Navbar** at top: logo (cheese) + KanaPlay on the left · centered links Discover / Browse / Radio · search + avatar icons on the right
- **Hero Banner**: large card with a concert photo, "TRENDING NOW" badge (yellow), artist title, description, "▶ Listen Now" button (ochre gradient) + heart button
- **Content in 2 columns**:
  - Left: "Featured Artists" section with 3 horizontal cards (square photo + name + genre)
  - Right: "Top Picks For You" — vertical list of 3 tracks with thumbnail, name, artist, and a "+" button
- **Player bar** fixed at the footer: thumbnail + name/artist + heart on the left · centered controls (shuffle, prev, play, next, repeat) + progress bar · mic/queue/volume icons on the right
- Background: `#0d0d0d` (warm black), no animated blobs

### Component: `src/pages/artist-discovery/components/HeroBanner.tsx`

- Receives `featuredArtist: SpotifyArtist` as a prop
- Card with `border-radius: 16px`, background photo with dark gradient overlay
- "TRENDING NOW" badge with an animated yellow dot
- Large title, description, action buttons

### Component: `src/pages/artist-discovery/components/FeaturedArtistCard.tsx`

- Square photo with `border-radius: 10px`
- Artist name in bold, genre in gray below
- Click → navigates to `/artist/:id`

### Component: `src/pages/artist-discovery/components/TopPickItem.tsx`

- 40x40px thumbnail, track name, artist, circular "+" button
- Background: `rgba(255,255,255,0.04)` with subtle border

### Component: `src/components/layout/PlayerBar.tsx`

- Global component, fixed at the footer on all protected pages
- Reads player state from `AppContext`
- Controls: shuffle, prev, play/pause, next, repeat
- Interactive progress bar
- Volume slider

## Acceptance Criteria

- Initial load fetches 20 artists
- Scrolling to bottom triggers `fetchNextPage()` and appends new cards
- Typing in search input debounces 300 ms then re-fetches
- No tables used anywhere on this page
- Loading skeletons shown during initial fetch
- Error state shown when API fails
- Empty state shown when search returns 0 results
- Clicking a card navigates to `/artist/:id`
- All strings use `t()`
