import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SectionRowProps {
  title: string
  isLoading?: boolean
  isError?: boolean
  isEmpty?: boolean
  skeletonShape?: 'square' | 'circle' | 'row'
  skeletonCount?: number
  onReachEnd?: () => void
  isFetchingMore?: boolean
  children: ReactNode
}

const PREFETCH_THRESHOLD = 320

function Skeleton({ shape, count }: { shape: NonNullable<SectionRowProps['skeletonShape']>; count: number }) {
  if (shape === 'row') {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-xl bg-white/[0.05]"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={
            shape === 'circle'
              ? 'h-[140px] w-[140px] shrink-0 animate-pulse rounded-full bg-white/[0.05]'
              : 'h-[200px] w-[160px] shrink-0 animate-pulse rounded-xl bg-white/[0.05]'
          }
        />
      ))}
    </div>
  )
}

function ArrowButton({
  side,
  visible,
  onClick,
}: {
  side: 'left' | 'right'
  visible: boolean
  onClick: () => void
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      aria-label={side}
      tabIndex={visible ? 0 : -1}
      onClick={onClick}
      className={`absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur transition-opacity duration-200 hover:bg-black/80 ${
        side === 'left' ? 'left-0' : 'right-0'
      } ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}

export function SectionRow({
  title,
  isLoading,
  isError,
  isEmpty,
  skeletonShape = 'square',
  skeletonCount = 6,
  onReachEnd,
  isFetchingMore,
  children,
}: SectionRowProps) {
  const { t } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const syncScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const maxScroll = scrollWidth - clientWidth
    setCanScrollLeft(scrollLeft > 8)
    setCanScrollRight(scrollLeft < maxScroll - 8)
    if (scrollLeft >= maxScroll - PREFETCH_THRESHOLD) {
      onReachEnd?.()
    }
  }, [onReachEnd])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    syncScrollState()
    el.addEventListener('scroll', syncScrollState, { passive: true })
    const observer = new ResizeObserver(syncScrollState)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', syncScrollState)
      observer.disconnect()
    }
  }, [syncScrollState])

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  const showCarousel = !isLoading && !isError && !isEmpty

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>

      {isLoading && <Skeleton shape={skeletonShape} count={skeletonCount} />}

      {!isLoading && isError && (
        <p className="text-sm text-white/50">{t('artistDiscovery.errorTitle')}</p>
      )}

      {!isLoading && !isError && isEmpty && (
        <p className="text-sm text-white/40">{t('common.empty')}</p>
      )}

      {showCarousel && (
        <div className="group relative">
          <ArrowButton
            side="left"
            visible={canScrollLeft}
            onClick={() => scrollByPage(-1)}
          />
          <div
            ref={scrollRef}
            className="hide-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-2"
            style={{ scrollSnapType: 'x proximity' }}
          >
            {children}
            {isFetchingMore && (
              <div className="grid w-30 shrink-0 place-items-center">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
              </div>
            )}
          </div>
          <ArrowButton
            side="right"
            visible={canScrollRight}
            onClick={() => scrollByPage(1)}
          />
        </div>
      )}
    </section>
  )
}
