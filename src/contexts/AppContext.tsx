import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import i18n from '@/langs/i18n'
import { type LanguageKey } from '@/langs/resources'
import { setSpotifyAuthHandlers, setSpotifyTokenGetter } from '@/api/services/spotify/api'
import { readStorage, writeStorage } from '@/utils/storage'

type Theme = 'light' | 'dark'

export interface AppState {
  token: string | null
  language: LanguageKey
  theme: Theme
  isAuthLoading: boolean
}

export type AppAction =
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_LANGUAGE'; payload: LanguageKey }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_AUTH_LOADING'; payload: boolean }

const TOKEN_KEY = 'kanaplay_token'
const LANGUAGE_KEY = 'kanaplay_language'

const initialState: AppState = {
  token: readStorage<string | null>(TOKEN_KEY, null),
  language: readStorage<LanguageKey>(LANGUAGE_KEY, 'enUS'),
  theme: 'dark',
  isAuthLoading: false,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.payload }
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_AUTH_LOADING':
      return { ...state, isAuthLoading: action.payload }
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  setToken: (token: string | null) => void
  setLanguage: (language: LanguageKey) => void
  setTheme: (theme: Theme) => void
  setAuthLoading: (loading: boolean) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    setSpotifyTokenGetter(() => state.token)
  }, [state.token])

  useEffect(() => {
    setSpotifyAuthHandlers({
      onUnauthorized: () => dispatch({ type: 'SET_TOKEN', payload: null }),
    })
  }, [])

  useEffect(() => {
    writeStorage(TOKEN_KEY, state.token)
  }, [state.token])

  useEffect(() => {
    writeStorage(LANGUAGE_KEY, state.language)
    void i18n.changeLanguage(state.language)
  }, [state.language])

  const setToken = useCallback(
    (token: string | null) => dispatch({ type: 'SET_TOKEN', payload: token }),
    [],
  )
  const setLanguage = useCallback(
    (language: LanguageKey) => dispatch({ type: 'SET_LANGUAGE', payload: language }),
    [],
  )
  const setTheme = useCallback(
    (theme: Theme) => dispatch({ type: 'SET_THEME', payload: theme }),
    [],
  )
  const setAuthLoading = useCallback(
    (loading: boolean) => dispatch({ type: 'SET_AUTH_LOADING', payload: loading }),
    [],
  )

  const value = useMemo<AppContextValue>(
    () => ({ state, dispatch, setToken, setLanguage, setTheme, setAuthLoading }),
    [state, setToken, setLanguage, setTheme, setAuthLoading],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}
