import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppProvider } from '@/contexts/AppContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { PlayerProvider } from '@/contexts/PlayerContext'
import { router } from '@/routes/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <FavoritesProvider>
          <PlayerProvider>
            <RouterProvider router={router} />
            <Toaster theme="dark" richColors position="top-right" />
          </PlayerProvider>
        </FavoritesProvider>
      </AppProvider>
    </QueryClientProvider>
  )
}
