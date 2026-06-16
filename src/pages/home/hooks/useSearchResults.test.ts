import { describe, it, expect, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderHookWithProviders } from '@/test/utils'
import { useSearchResults } from './useSearchResults'

vi.mock('@/api/services/spotify/search/search', () => ({
  searchPage: vi.fn(),
  SEARCH_PAGE_SIZE: 20,
}))

describe('useSearchResults', () => {
  it('returns flattened items from pages', async () => {
    const { searchPage } = await import('@/api/services/spotify/search/search')

    vi.mocked(searchPage).mockResolvedValue({
      items: [
        { kind: 'artist', data: { id: 'a1', name: 'Artist', images: [], external_urls: { spotify: 'https://s' } } },
      ],
      total: 20,
      limit: 10,
      offset: 0,
      hasMore: true,
    })

    const { result } = renderHookWithProviders(() => useSearchResults('test query', 'all'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0]!.kind).toBe('artist')
    expect(result.current.hasNextPage).toBe(true)
  })

  it('does not fetch when query is empty', async () => {
    const { searchPage } = await import('@/api/services/spotify/search/search')
    vi.mocked(searchPage).mockClear()

    const { result } = renderHookWithProviders(() => useSearchResults('', 'artist'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(searchPage).not.toHaveBeenCalled()
    expect(result.current.items).toEqual([])
  })

  it('handles error state', async () => {
    const { searchPage } = await import('@/api/services/spotify/search/search')
    vi.mocked(searchPage).mockRejectedValue(new Error('Network'))

    const { result } = renderHookWithProviders(() => useSearchResults('fail', 'artist'))

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
