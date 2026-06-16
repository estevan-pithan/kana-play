import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SEARCH_TYPES, type SearchType } from '@/api/services/spotify/search/search'

const TYPE_KEYS: Record<SearchType, string> = {
  all: 'nav.typeAll',
  artist: 'nav.typeArtists',
  album: 'nav.typeAlbums',
  track: 'nav.typeMusic',
  playlist: 'nav.typePlaylists',
}

function isSearchType(value: string | null): value is SearchType {
  return value !== null && (SEARCH_TYPES as readonly string[]).includes(value)
}

export function SearchTypeSelect() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const raw = searchParams.get('type')
  const current: SearchType = isSearchType(raw) ? raw : 'all'

  function handleChange(next: SearchType) {
    const params = new URLSearchParams(searchParams)
    if (next === 'all') {
      params.delete('type')
    } else {
      params.set('type', next)
    }
    setSearchParams(params, { replace: true })
  }

  return (
    <Select value={current} onValueChange={(v) => handleChange(v as SearchType)}>
      <SelectTrigger
        className="h-8 w-[110px] gap-2 rounded-full border-0 bg-transparent px-3 text-sm text-white/70 hover:text-white focus:ring-0 focus:ring-offset-0"
        aria-label={t('common.search')}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className="rounded-xl border border-white/10 bg-[rgba(20,20,20,0.92)] text-white backdrop-blur-xl"
        align="end"
      >
        {SEARCH_TYPES.map((type) => (
          <SelectItem
            key={type}
            value={type}
            className="text-sm text-white/85 focus:bg-white/10 focus:text-white"
          >
            {t(TYPE_KEYS[type])}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
