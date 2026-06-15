# Change — Navbar Redesign + Home Discovery Refactor

## Goal

Reimplementar a Navbar global e a página Home (Artist Discovery) com base nas novas regras de produto. Esta change substitui partes do que foi entregue nas Phases 2 e 5.

## Status: Done ✅

## Context

- **Phase 2** delivered the original Navbar (centered text links + language switcher on the right)
- **Phase 5** delivered Discovery with Hero Banner + 2-column layout
- This change **replaces both** with the new navigation architecture and content

## Part 1 — Navbar Redesign

### Layout

```

[🧀 KanaPlay  🏠] ──── [🔍 Search input... | All ▾] ──── [👤▾]
Left                   Center (SearchPill)              Right (UserMenu)

```

### Components

#### `src/components/layout/Navbar.tsx` (replace)

- Left: logo (36px) + "KanaPlay" text (#E8B84B) + Home icon (lucide:Home) → `/`
- Center: `<SearchPill>` — single pill with `backdrop-filter: blur(20px)`, `border-radius: 24px`, border `rgba(255,255,255,0.12)`
- Right: `<UserMenu>` with user avatar
- Remove: text nav links, standalone language switcher

#### `src/components/layout/SearchPill.tsx` (new)

- Controlled input writing `?q=` to URL via `useSearchParams`
- Placeholder: `t('nav.searchPlaceholder')`
- Search icon (Lucide) on the left
- Vertical divider `rgba(255,255,255,0.1)` separating input from select
- `<SearchTypeSelect>` on the right (~120px fixed width)
- Style: background `rgba(255,255,255,0.07)`, no own border (pill has it)

#### `src/components/layout/SearchTypeSelect.tsx` (new)

- Shadcn `Select` with options: `all` · `artist` · `album` · `track` · `playlist`
- Default: `all`
- Writes `?type=` to URL on change
- Style: transparent background, no border, text `rgba(255,255,255,0.7)`

#### `src/components/layout/UserMenu.tsx` (new)

- Calls `getUserProfile()` for avatar and display_name
- Shadcn `DropdownMenu` with items:
  - **Insights** → navigate to `/insights`
  - **Language** → toggle `i18n.changeLanguage('ptBR' | 'enUS')`
  - **Logout** → dispatch `SET_TOKEN(null)` + `navigate('/login')`
- Avatar: circular `<img>` 32px or fallback with initial in `#E8B84B`

### i18n — new keys

Add to `en-US.json` and `pt-BR.json`:

```json
{
  "nav": {
    "home": "Home",
    "searchPlaceholder": "Search artists, albums, tracks...",
    "insights": "Insights",
    "language": "Language",
    "logout": "Log out",
    "typeAll": "All",
    "typeArtists": "Artists",
    "typeAlbums": "Albums",
    "typeMusic": "Music",
    "typePlaylists": "Playlists"
  }
}
```

## Part 2 — Home Discovery Refactor

### Prerequisites

Ensure these services exist (Phase 3 updated):

- `getUserPlaylists`, `getUserTopArtists`, `getUserTopTracks`
- `getFollowedArtists`, `getSavedAlbums`, `getUserProfile`

### New components

#### `src/pages/artist-discovery/components/FilterChips.tsx`

- Chips: All · Artists · Albums · Music · Playlists
- Liquid glass: `backdrop-filter: blur(16px)`, `border-radius: 20px`, padding `6px 16px`
- Active chip: `linear-gradient(135deg, #C8922A, #E8B84B)`, text `#1a0e00`
- Inactive chip: glass background, text `rgba(255,255,255,0.6)`
- Synced with `?type=` URL param (same as SearchTypeSelect)

#### `src/pages/artist-discovery/components/SectionRow.tsx`

- Props: `title`, `viewAllHref?`, `isLoading`, `children`
- Horizontal scroll `overflow-x: auto`, `scrollbar-width: none`
- Skeleton when `isLoading`

#### Card components

| Component | Size | Details |
|---|---|---|
| `PlaylistCard.tsx` | 160px square | cover + name + track count |
| `ArtistCard.tsx` | 140px circular | photo + name + genre → `/artist/:id` |
| `TrackRow.tsx` | 48px thumbnail | name + artist + duration (mm:ss) + "+" button |
| `AlbumCard.tsx` | 160px square | cover + name + artist + year |

### New hooks

#### `src/pages/artist-discovery/hooks/useHomeData.ts`

- 5 parallel `useQuery` calls: playlists, topArtists, topTracks, followedArtists, savedAlbums
- Returns data + `isLoading`/`isError` per section

#### `src/pages/artist-discovery/hooks/useSearchResults.ts`

- `useInfiniteQuery` with `searchArtists({ query, type, limit: 20, offset })`
- `queryKey`: `['search', debouncedQuery, type]`
- `IntersectionObserver` on sentinel div → `fetchNextPage()`
- Only active when `query !== ''`

### Refactored page

#### `src/pages/artist-discovery/ArtistDiscovery.tsx`

**Home mode** (no `?q=`):

- `FilterChips` at top
- 5 `SectionRow` with horizontal scroll:
  1. Top Playlists → `PlaylistCard`
  2. Top Artists → `ArtistCard`
  3. Top Tracks → `TrackRow`
  4. Followed Artists → `ArtistCard`
  5. Saved Albums → `AlbumCard`
- Background `#0d0d0d`, no hero banner, no tables

**Search mode** (`?q=` present):

- Results grid with infinite scroll
- Type filtered by `?type=`
- Loading skeleton + error state + empty state

### Files to remove

- `src/pages/artist-discovery/components/HeroBanner.tsx`
- `src/pages/artist-discovery/components/FeaturedArtistCard.tsx`
- `src/pages/artist-discovery/components/TopPickItem.tsx`

## Acceptance Criteria

- [ ] Navbar has no more centered text links
- [ ] SearchPill (input + select) visible and functional on all protected pages
- [ ] Typing in search updates `?q=` and activates search mode on Home
- [ ] Changing select updates `?type=` and syncs with FilterChips
- [ ] UserMenu shows user avatar and 3 items (Insights, Language, Logout)
- [ ] Home icon navigates to `/`
- [ ] Home displays 5 sections with real or mock data
- [ ] FilterChips filter visible sections correctly
- [ ] Search mode with infinite scroll (20 items/page) works
- [ ] No hero banner "TRENDING NOW"
- [ ] No tables in any section
- [ ] Loading skeletons per section during fetch
- [ ] All strings via `t()`
- [ ] TypeScript no errors, ESLint passes
