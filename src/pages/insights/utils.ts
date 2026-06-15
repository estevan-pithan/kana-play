/** Track length in `mm:ss`. */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/** Localized "x minutes/hours/days ago" for a play timestamp. */
export function formatRelativeTime(iso: string, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diffMs / 60_000)

  if (minutes < 60) return rtf.format(-Math.max(minutes, 1), 'minute')
  const hours = Math.round(minutes / 60)
  if (hours < 24) return rtf.format(-hours, 'hour')
  const days = Math.round(hours / 24)
  return rtf.format(-days, 'day')
}
