import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { SpotifyAlbum } from '@/api/services/spotify/type'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { ALBUMS_PER_PAGE } from '../hooks/useArtistProfile'
import { formatReleaseDate } from '../utils'

interface AlbumsTableProps {
  albums: SpotifyAlbum[]
  total: number
  page: number
  totalPages: number
  isLoading: boolean
  isError: boolean
  isFetching: boolean
  onPageChange: (page: number) => void
  onSelect: (album: SpotifyAlbum) => void
  selectedAlbumId?: string
}

export function AlbumsTable({
  albums,
  total,
  page,
  totalPages,
  isLoading,
  isError,
  isFetching,
  onPageChange,
  onSelect,
  selectedAlbumId,
}: AlbumsTableProps) {
  const { t } = useTranslation()

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold text-white">
        {t('artistProfile.albums')}
      </h2>

      <div className="glass-card overflow-hidden rounded-2xl">
        {isLoading ? (
          <div className="flex flex-col gap-px">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : isError ? (
          <p className="p-10 text-center text-sm text-white/50">
            {t('artistDiscovery.errorTitle')}
          </p>
        ) : albums.length === 0 ? (
          <p className="p-10 text-center text-sm text-white/40">{t('common.empty')}</p>
        ) : (
          <Table className={cn('transition-opacity', isFetching && 'opacity-60')}>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="w-12 text-white/40">#</TableHead>
                <TableHead className="text-white/60">
                  {t('artistProfile.tableTitle')}
                </TableHead>
                <TableHead className="hidden text-white/60 sm:table-cell">
                  {t('artistProfile.tableType')}
                </TableHead>
                <TableHead className="hidden text-white/60 md:table-cell">
                  {t('artistProfile.tableReleaseDate')}
                </TableHead>
                <TableHead className="text-right text-white/60">
                  {t('artistProfile.tableTracks')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {albums.map((album, index) => (
                <TableRow
                  key={album.id}
                  onClick={() => {
                    onSelect(album)
                  }}
                  className={cn(
                    'cursor-pointer border-white/6 hover:bg-white/5',
                    selectedAlbumId === album.id && 'bg-white/10 hover:bg-white/10',
                  )}
                >
                  <TableCell className="text-sm font-medium text-white/40">
                    {page * ALBUMS_PER_PAGE + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/10">
                        {album.images[0]?.url && (
                          <img
                            src={album.images[0].url}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <span className="line-clamp-2 font-medium text-white">
                        {album.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden capitalize text-white/50 sm:table-cell">
                    {album.album_type}
                  </TableCell>
                  <TableCell className="hidden text-white/50 md:table-cell">
                    {formatReleaseDate(album.release_date)}
                  </TableCell>
                  <TableCell className="text-right text-white/50">
                    {album.total_tracks}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pager */}
      {!isLoading && !isError && total > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-white/40">
            {t('artistProfile.pageOf', { page: page + 1, total: totalPages })}
          </span>
          <div className="flex items-center gap-2">
            <PagerButton
              ariaLabel={t('common.previous')}
              disabled={page === 0 || isFetching}
              onClick={() => {
                onPageChange(page - 1)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </PagerButton>
            <PagerButton
              ariaLabel={t('common.next')}
              disabled={page >= totalPages - 1 || isFetching}
              onClick={() => {
                onPageChange(page + 1)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </PagerButton>
          </div>
        </div>
      )}
    </section>
  )
}

function PagerButton({
  ariaLabel,
  disabled,
  onClick,
  children,
}: {
  ariaLabel: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  )
}
