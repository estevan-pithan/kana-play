import { type ReactElement, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { render, renderHook, type RenderOptions } from '@testing-library/react'

import i18n from '@/langs/i18n'
import { AppProvider } from '@/contexts/AppContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'

/**
 * A QueryClient tuned for tests: no retries (so rejected queries surface
 * immediately) and no caching between tests.
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  })
}

interface ProvidersOptions {
  /** Pass an existing client to assert on its cache; one is created otherwise. */
  queryClient?: QueryClient
  /** Initial router entries for components that read the URL. */
  routerEntries?: string[]
  /** Wrap children in FavoritesProvider (default true). */
  withFavorites?: boolean
}

function AllProviders({
  children,
  queryClient,
  routerEntries = ['/'],
  withFavorites = true,
}: ProvidersOptions & { children: ReactNode }) {
  const client = queryClient ?? createTestQueryClient()
  const tree = (
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <AppProvider>
          <MemoryRouter initialEntries={routerEntries}>{children}</MemoryRouter>
        </AppProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
  return withFavorites ? wrapFavorites(tree) : tree
}

function wrapFavorites(tree: ReactElement): ReactElement {
  return <FavoritesProvider>{tree}</FavoritesProvider>
}

/** Render a component inside the app's provider stack (QueryClient + i18n + contexts + router). */
export function renderWithProviders(
  ui: ReactElement,
  { queryClient, routerEntries, withFavorites, ...options }: ProvidersOptions & RenderOptions = {},
) {
  const client = queryClient ?? createTestQueryClient()
  return {
    queryClient: client,
    ...render(ui, {
      wrapper: ({ children }) => (
        <AllProviders
          queryClient={client}
          routerEntries={routerEntries}
          withFavorites={withFavorites}
        >
          {children}
        </AllProviders>
      ),
      ...options,
    }),
  }
}

/** Render a hook inside the same provider stack (for React Query / context hooks). */
export function renderHookWithProviders<Result, Props>(
  hook: (props: Props) => Result,
  { queryClient, routerEntries, withFavorites, ...options }: ProvidersOptions = {},
) {
  const client = queryClient ?? createTestQueryClient()
  return {
    queryClient: client,
    ...renderHook(hook, {
      wrapper: ({ children }) => (
        <AllProviders
          queryClient={client}
          routerEntries={routerEntries}
          withFavorites={withFavorites}
        >
          {children}
        </AllProviders>
      ),
      ...options,
    }),
  }
}
