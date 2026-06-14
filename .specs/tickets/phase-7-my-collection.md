# Phase 7 — My Collection Page (Favorites + Form)

## Goal

Implement the My Collection page with the favorites list and the Add Favorite form.

## Reference

Reference screen: `screens/my-collection.png` — agent must request the user to upload this image before implementing.

> ⚠️ Instruction for the agent: Before starting the implementation of this screen, ask the user to upload the `my-collection.png` image directly in the chat. Analyze the image pixel by pixel to ensure the layout, spacing, colors, typography, and element arrangement are identical to the screenshot. Do not assume any visual detail without confirming it in the image.

## Tasks

### Page: `src/pages/my-collection/MyCollection.tsx`

Layout faithful to the `my-collection.png` screenshot:

- **Navbar** at top: logo + links (Discover/Browse/Radio/My Collection active) + search + avatar
- **Left sidebar** "YOUR LIBRARY":
  - Liked Songs (active, yellow heart icon)
  - Artists
  - Albums
  - Playlists
  - "+ New Playlist" button at the bottom of the sidebar
- **Main content**: "Liked Songs" title + "342 Tracks" counter + "⇄ Shuffle All" button (yellow) on the right
- **Album/playlist grid** (4 columns): each card has a square cover, name, and artist below
- **Player bar** fixed at the footer

### Component: `src/pages/my-collection/components/LibrarySidebar.tsx`

- Fixed left sidebar with the "YOUR LIBRARY" label
- Items: Liked Songs (active), Artists, Albums, Playlists
- Yellow heart icon on the active item
- "+ New Playlist" button at the bottom

### Component: `src/pages/my-collection/components/LikedSongsGrid.tsx`

- "Liked Songs" title + track count
- "Shuffle All" button with ochre gradient
- 4-column grid of `AlbumCard` with cover, name, and artist
- Click on a card → opens details or plays

### Component: `src/pages/my-collection/components/AddFavoriteForm.tsx`

- React Hook Form + Zod form (accessible via dialog or a separate route)
- Schema:
- On submit: dispatch `ADD_FAVORITE` with `id` (`crypto.randomUUID()`) and `addedAt` → reset form → success toast

## Acceptance Criteria

- Favorites list renders all items from FavoritesContext
- Form validates with Zod — errors shown inline
- Submitting valid form adds item to list and resets form
- Remove button removes item from list and localStorage
- Data persists across page refreshes
- Empty state shown when no favorites
- All strings use `t()`
