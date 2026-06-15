import { useTranslation } from 'react-i18next'

import type { SpotifyPlaylist } from '@/api/services/spotify/type'

interface PlaylistCardProps {
  playlist: SpotifyPlaylist
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const { t } = useTranslation()
  const cover = playlist.images[0]?.url

  return (
    <a
      href={playlist.external_urls.spotify}
      target="_blank"
      rel="noreferrer noopener"
      className="group block w-[160px] shrink-0 space-y-2"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-white/10">
        {cover && (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div>
        <p className="truncate text-sm font-semibold text-white">{playlist.name}</p>
        <p className="truncate text-xs text-white/50">
          {t('artistDiscovery.trackCount', {
            count: playlist.tracks.total,
          })}
        </p>
      </div>
    </a>
  )
}
