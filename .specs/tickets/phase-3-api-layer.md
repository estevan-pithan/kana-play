# Phase 3 — Spotify API Service Layer

## Goal

Implement all Spotify API service functions with Zod validation, mocks, and the authentication token fetch.

## Tasks

### 1. Shared Spotify Types (`src/types/spotify.ts`)

Define Zod schemas and inferred types for all Spotify entities:

- `SpotifyArtistSchema` → `SpotifyArtist` (id, name, images, genres, followers, popularity, external_urls)
- `SpotifyTrackSchema` → `SpotifyTrack` (id, name, duration_ms, album, artists, preview_url)
- `SpotifyAlbumSchema` → `SpotifyAlbum` (id, name, album_type, release_date, total_tracks, images, artists)
- `SpotifyPagingSchema<T>` → generic paginated wrapper (items, total, limit, offset, next, previous)

### 2. Auth Token Service (`src/api/services/spotify/get-token.ts`)

- POST to `https://accounts.spotify.com/api/token` with `grant_type=client_credentials`
- Basic auth header: `btoa(clientId:clientSecret)`
- Returns `{ access_token, token_type, expires_in }`
- Validated with Zod

### 3. Search Artists (`src/api/services/spotify/search-artists.ts`)

- `searchArtists({ query, limit, offset }: SearchArtistsInput)`
- GET `/search?type=artist&q={query}&limit={limit}&offset={offset}`
- Returns `SpotifyPaging<SpotifyArtist>`
- Mock: `src/api/mocks/spotify/search-artists.mock.ts` with 20 realistic artist objects

### 4. Get Artist (`src/api/services/spotify/get-artist.ts`)

- `getArtist(id: string)`
- GET `/artists/{id}`
- Returns `SpotifyArtist`
- Mock: single artist object

### 5. Get Artist Top Tracks (`src/api/services/spotify/get-artist-top-tracks.ts`)

- `getArtistTopTracks(id: string)`
- GET `/artists/{id}/top-tracks`
- Returns `{ tracks: SpotifyTrack[] }`
- Mock: 10 track objects

### 6. Get Artist Albums (`src/api/services/spotify/get-artist-albums.ts`)

- `getArtistAlbums({ id, limit, offset }: GetArtistAlbumsInput)`
- GET `/artists/{id}/albums?limit={limit}&offset={offset}`
- Returns `SpotifyPaging<SpotifyAlbum>`
- Mock: paginated album list

### 7. Mocks

Each service has a corresponding mock file at `src/api/mocks/spotify/` with `successMock`, `emptyMock`, and `errorMock` variants. Mock data must be realistic (real-looking artist names, genres, follower counts).

## Acceptance Criteria

- All service functions return correctly typed data (TypeScript infers from Zod schemas)
- With `USE_SPOTIFY_MOCK = true`, all functions return mock data without network calls
- With `USE_SPOTIFY_MOCK = false`, real API calls are made and responses validated by Zod
- Zod parse errors surface as console errors (not silent failures)
- `get-token.ts` successfully fetches a Bearer token from Spotify accounts API
