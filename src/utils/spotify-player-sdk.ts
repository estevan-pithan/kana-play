const SDK_SRC = 'https://sdk.scdn.co/spotify-player.js'

let loadPromise: Promise<void> | null = null

/**
 * Injects the Spotify Web Playback SDK script exactly once and resolves when
 * `window.onSpotifyWebPlaybackSDKReady` fires (or immediately if `window.Spotify`
 * is already available). Subsequent calls return the same promise.
 */
export function loadSpotifyPlayerSDK(): Promise<void> {
  if (window.Spotify) return Promise.resolve()
  if (loadPromise) return loadPromise

  loadPromise = new Promise<void>((resolve, reject) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      resolve()
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_SRC}"]`)
    if (existing) return

    const script = document.createElement('script')
    script.src = SDK_SRC
    script.async = true
    script.onerror = () => {
      loadPromise = null
      reject(new Error('Failed to load the Spotify Web Playback SDK'))
    }
    document.body.appendChild(script)
  })

  return loadPromise
}
