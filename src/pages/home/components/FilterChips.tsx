import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { SEARCH_TYPES, type SearchType } from '@/api/services/spotify/search'

const TYPE_LABELS: Record<SearchType, string> = {
  all: 'nav.typeAll',
  artist: 'nav.typeArtists',
  album: 'nav.typeAlbums',
  track: 'nav.typeMusic',
  playlist: 'nav.typePlaylists',
}

function isSearchType(value: string | null): value is SearchType {
  return value !== null && (SEARCH_TYPES as readonly string[]).includes(value)
}

/**
 * Liquid-glass chips synced with `?type=` URL param. Shares the source of
 * truth with `<SearchTypeSelect>` in the navbar so changing one updates both.
 */
export function FilterChips() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const raw = searchParams.get('type')
  const current: SearchType = isSearchType(raw) ? raw : 'all'

  function setType(next: SearchType) {
    const params = new URLSearchParams(searchParams)
    if (next === 'all') {
      params.delete('type')
    } else {
      params.set('type', next)
    }
    setSearchParams(params, { replace: true })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {SEARCH_TYPES.map((type) => {
        const isActive = current === type
        return (
          <button
            key={type}
            type="button"
            onClick={() => {
              setType(type)
            }}
            aria-pressed={isActive}
            className={cn(
              'inline-flex items-center rounded-[20px] px-4 py-1.5 text-sm font-medium transition-all',
              isActive
                ? 'shadow-md'
                : 'text-white/60 hover:text-white',
            )}
            style={
              isActive
                ? {
                    background:
                      'linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%)',
                    color: '#1a0e00',
                  }
                : {
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                  }
            }
          >
            {t(TYPE_LABELS[type])}
          </button>
        )
      })}
    </div>
  )
}
