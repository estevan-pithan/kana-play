import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'
import { spotifyImageSchema } from '../type'
import { getPlaylistSuccessMock } from '@/api/mocks/spotify/playlist/get-playlist.mock'

const playlistFields =
  'id,name,description,images,owner(id,display_name),tracks(total),external_urls'

export const playlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().default(null),
  images: z.array(spotifyImageSchema).default([]),
  owner: z.object({
    id: z.string(),
    display_name: z.string().nullable().default(null),
  }),
  tracks: z.object({ total: z.number() }).optional().default({ total: 0 }),
  external_urls: z.object({ spotify: z.string() }),
})

export type Playlist = z.infer<typeof playlistSchema>

export async function getPlaylist(id: string): Promise<Playlist> {
  if (USE_SPOTIFY_MOCK) return getPlaylistSuccessMock

  const response = await apiSpotify.get(`/playlists/${id}`, {
    params: { fields: playlistFields },
  })
  return playlistSchema.parse(response.data)
}
