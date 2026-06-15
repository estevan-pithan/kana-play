import { afterEach, describe, expect, it } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'

import { FavoritesProvider, useFavorites, type FavoriteTrack } from './FavoritesContext'

const STORAGE_KEY = 'kanaplay_favorites'

function makeFavorite(over: Partial<FavoriteTrack> = {}): FavoriteTrack {
  return {
    id: 'id-1',
    trackName: 'Track',
    artist: 'Artist',
    album: 'Album',
    addedAt: '2026-01-01T00:00:00.000Z',
    ...over,
  }
}

function renderFavorites() {
  return renderHook(() => useFavorites(), { wrapper: FavoritesProvider })
}

describe('FavoritesContext', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('throws when used outside the provider', () => {
    expect(() => renderHook(() => useFavorites())).toThrow(
      /must be used within a FavoritesProvider/,
    )
  })

  it('loads favorites from localStorage on mount', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([makeFavorite()]))
    const { result } = renderFavorites()

    await waitFor(() => {
      expect(result.current.loaded).toBe(true)
    })
    expect(result.current.favorites).toHaveLength(1)
  })

  it('addFavorite assigns id + addedAt and prepends the entry', async () => {
    const { result } = renderFavorites()
    await waitFor(() => expect(result.current.loaded).toBe(true))

    let created: FavoriteTrack
    act(() => {
      created = result.current.addFavorite({
        trackName: 'New',
        artist: 'A',
        album: 'B',
      })
    })

    expect(created!.id).toBeTruthy()
    expect(created!.addedAt).toBeTruthy()
    expect(result.current.favorites[0]).toMatchObject({ trackName: 'New' })
  })

  it('persists favorites to localStorage after a change', async () => {
    const { result } = renderFavorites()
    await waitFor(() => expect(result.current.loaded).toBe(true))

    act(() => {
      result.current.addFavorite({ trackName: 'Persisted', artist: 'A', album: 'B' })
    })

    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]') as FavoriteTrack[]
      expect(stored.some((f) => f.trackName === 'Persisted')).toBe(true)
    })
  })

  it('removeFavorite deletes by id', async () => {
    const { result } = renderFavorites()
    await waitFor(() => expect(result.current.loaded).toBe(true))

    let created: FavoriteTrack
    act(() => {
      created = result.current.addFavorite({ trackName: 'X', artist: 'A', album: 'B' })
    })
    act(() => {
      result.current.removeFavorite(created!.id)
    })

    expect(result.current.favorites).toHaveLength(0)
  })

  it('dispatch ADD_FAVORITE ignores duplicate ids', async () => {
    const { result } = renderFavorites()
    await waitFor(() => expect(result.current.loaded).toBe(true))

    const dupe = makeFavorite({ id: 'dupe' })
    act(() => {
      result.current.dispatch({ type: 'ADD_FAVORITE', payload: dupe })
    })
    act(() => {
      result.current.dispatch({ type: 'ADD_FAVORITE', payload: dupe })
    })

    expect(result.current.favorites.filter((f) => f.id === 'dupe')).toHaveLength(1)
  })

  it('isFavorited matches via predicate', async () => {
    const { result } = renderFavorites()
    await waitFor(() => expect(result.current.loaded).toBe(true))

    act(() => {
      result.current.addFavorite({ trackName: 'Match', artist: 'Me', album: 'B' })
    })

    expect(result.current.isFavorited((f) => f.trackName === 'Match' && f.artist === 'Me')).toBe(
      true,
    )
    expect(result.current.isFavorited((f) => f.trackName === 'Nope')).toBe(false)
  })
})
