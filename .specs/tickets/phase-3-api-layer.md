# Phase 3 — Spotify API Service Layer

## Goal

Implement all Spotify API service functions with Zod validation, mocks, and the authentication token fetch.

## Status: Done ✅ (new /me/* endpoints pending)

## Tasks

### Original endpoints (delivered)

| Service | Method | Endpoint |
|---|---|---|
| `get-token.ts` | POST | `/api/token` (Client Credentials) |
| `search-artists.ts` | GET | `/search?type=artist` |
| `get-artist.ts` | GET | `/artists/{id}` |
| `get-artist-top-tracks.ts` | GET | `/artists/{id}/top-tracks` |
| `get-artist-albums.ts` | GET | `/artists/{id}/albums` |

### New user-scoped endpoints (required by Change ticket)

| Service | Method | Endpoint | Returns |
|---|---|---|---|
| `get-user-playlists.ts` | GET | `/me/playlists` | `SpotifyPaging<SpotifyPlaylist>` |
| `get-user-top-artists.ts` | GET | `/me/top/artists` | `SpotifyPaging<SpotifyArtist>` |
| `get-user-top-tracks.ts` | GET | `/me/top/tracks` | `SpotifyPaging<SpotifyTrack>` |
| `get-followed-artists.ts` | GET | `/me/following?type=artist` | cursor-based paging |
| `get-saved-albums.ts` | GET | `/me/albums` | `SpotifyPaging<SpotifySavedAlbum>` |
| `get-user-profile.ts` | GET | `/me` | `SpotifyUserProfile` |

All new endpoints:
- Require PKCE access token (stored in `AppContext`)
- Have Zod schemas co-located in the service file
- Have mocks with `successMock`, `emptyMock`, `errorMock`

### New Zod schemas needed

- `SpotifyPlaylistSchema`: id, name, description, images, tracks.total, owner
- `SpotifySavedAlbumSchema`: added_at + album (SpotifyAlbum)
- `SpotifyUserProfileSchema`: id, display_name, images, followers, country

## Acceptance Criteria

- All service functions return correctly typed data (TypeScript infers from Zod)
- `USE_SPOTIFY_MOCK = true` → mock data, no network calls
- `USE_SPOTIFY_MOCK = false` → real API calls, Zod validated
- All 6 `/me/*` endpoints work with PKCE access token
- `getUserProfile()` returns display_name and avatar image URL
