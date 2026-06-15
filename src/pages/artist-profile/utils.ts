/** Track length in `mm:ss`. */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Spotify release dates come at varying precision (`2024`, `2024-04`,
 * `2024-04-19`). Render a localized date when we have a full day, otherwise
 * fall back to the raw year/month string.
 */
export function formatReleaseDate(release: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(release)) {
    return new Date(release).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  return release
}
