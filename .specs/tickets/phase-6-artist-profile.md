# Phase 6 — Artist Profile Page (Details + Paginated Table)

## Goal

Implement the Artist Profile page showing artist details and a tabbed, paginated table of Top Tracks and Albums.

## Reference

Reference screen: `screens/artist-profile.png` — agent must request the user to upload this image before implementing.

> ⚠️ Instruction for the agent: Before starting the implementation of this screen, ask the user to upload the `artist-profile.png` image directly in the chat. Analyze the image pixel by pixel to ensure the layout, spacing, colors, typography, and element arrangement are identical to the screenshot. Do not assume any visual detail without confirming it in the image.

## Tasks

### Page: `src/pages/artist-profile/ArtistProfile.tsx`

Layout faithful to the `artist-profile.png` screenshot:

- **Navbar** same as Discovery (logo + links Discover/Browse/Radio + search + avatar)
- **Full-width hero**: background with the artist photo + dark gradient overlay · "VERIFIED ARTIST" badge centered · artist name in `#E8B84B`, large and centered · stats (Monthly Listeners + Followers) as pills · buttons: ▶ circular play (yellow), Follow (outline), … (ghost)
- **2-column layout** below the hero:
  - **Left**: "Top Tracks" — numbered list with thumbnail, name, artist, play count, duration · "See More ↓" link
  - **Right**: "About the Artist" (card with large stat + text + "Read Full Bio") + "Fans Also Like" (3 circular avatars with names)
- **Player bar** fixed at the footer
- Queries: `useQuery(['artist', id], getArtist)` + `useQuery(['top-tracks', id], getArtistTopTracks)`

### Component: `src/pages/artist-profile/components/ArtistHero.tsx`

- Full-width hero with a background photo (blur + dark overlay)
- "VERIFIED ARTIST" badge with a yellow dot, centered
- Artist name in `#E8B84B`, large font (48px+), centered
- Stat pills: Monthly Listeners and Followers with icons
- Centered buttons: circular yellow play, Follow (outline), … (ghost)

### Component: `src/pages/artist-profile/components/TopTracksList.tsx`

- Numbered list (not a table) with rows: number · thumbnail · name + artist · play count · duration
- A row with a favorited track shows a yellow heart icon
- "See More" button at the end
- Click on a row → opens `AddFavoriteDialog`

### Component: `src/pages/artist-profile/components/AboutArtistCard.tsx`

- Large stat (e.g., "4.2M Monthly Listeners")
- Truncated descriptive text with a "Read Full Bio" link

### Component: `src/pages/artist-profile/components/FansAlsoLike.tsx`

- 3 circular avatars with names below
- Click → navigates to the related artist's profile

### Component: `src/pages/artist-profile/components/AddFavoriteDialog.tsx`

- Shadcn `Dialog` controlled by the parent
- React Hook Form + Zod pre-filled with the track data
- Fields: Track Name (required), Artist (required), Album, Notes (optional)
- On submit: `useFavorites().addFavorite(track)` → closes dialog → success toast

## Acceptance Criteria

- Artist data loads and displays in the hero section
- Top Tracks tab shows paginated table (10 per page)
- Albums tab shows paginated table with album covers
- Duration formatted as mm:ss
- "Save" button opens pre-filled dialog
- Saving from dialog adds to FavoritesContext and persists to localStorage
- Loading and error states handled for both queries
- All strings use `t()`
