import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import { AddFavoriteDialog } from './AddFavoriteDialog'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

describe('AddFavoriteDialog', () => {
  const onOpenChange = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
  })

  function renderDialog(defaults: { trackName: string; artist: string; album: string } | null = null) {
    return renderWithProviders(
      <AddFavoriteDialog defaults={defaults} open={true} onOpenChange={onOpenChange} />,
    )
  }

  it('shows validation errors when trackName and artist are empty', async () => {
    renderDialog()

    const submitBtn = screen.getByRole('button', { name: /add to collection/i })
    await user.click(submitBtn)

    await waitFor(() => {
      const errors = screen.getAllByText('This field is required.')
      expect(errors.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('calls addFavorite and closes on valid submit', async () => {
    const { toast } = await import('sonner')
    renderDialog()

    const inputs = screen.getAllByRole('textbox')
    const trackInput = inputs[0]!
    const artistInput = inputs[1]!

    await user.clear(trackInput)
    await user.type(trackInput, 'My Song')
    await user.clear(artistInput)
    await user.type(artistInput, 'My Artist')

    const submitBtn = screen.getByRole('button', { name: /add to collection/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Added to your collection.')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('pre-fills form when defaults prop is provided', async () => {
    renderDialog({ trackName: 'Prefilled Track', artist: 'Prefilled Artist', album: 'Prefilled Album' })

    await waitFor(() => {
      expect(screen.getByDisplayValue('Prefilled Track')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Prefilled Artist')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Prefilled Album')).toBeInTheDocument()
    })
  })
})
