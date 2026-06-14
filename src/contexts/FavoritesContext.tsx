import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { readStorage, writeStorage } from '@/utils/storage'

export interface FavoriteTrack {
  id: string
  trackName: string
  artist: string
  album: string
  notes?: string
  addedAt: string
}

export interface FavoritesState {
  favorites: FavoriteTrack[]
  loaded: boolean
}

export type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: FavoriteTrack }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'LOAD_FAVORITES'; payload: FavoriteTrack[] }

const STORAGE_KEY = 'kanaplay_favorites'

const initialState: FavoritesState = {
  favorites: [],
  loaded: false,
}

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'ADD_FAVORITE':
      if (state.favorites.some((f) => f.id === action.payload.id)) return state
      return { ...state, favorites: [action.payload, ...state.favorites] }
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter((f) => f.id !== action.payload),
      }
    case 'LOAD_FAVORITES':
      return { favorites: action.payload, loaded: true }
  }
}

interface FavoritesContextValue {
  favorites: FavoriteTrack[]
  loaded: boolean
  dispatch: React.Dispatch<FavoritesAction>
  addFavorite: (track: Omit<FavoriteTrack, 'id' | 'addedAt'>) => FavoriteTrack
  removeFavorite: (id: string) => void
  isFavorited: (predicate: (track: FavoriteTrack) => boolean) => boolean
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState)

  useEffect(() => {
    const stored = readStorage<FavoriteTrack[]>(STORAGE_KEY, [])
    dispatch({ type: 'LOAD_FAVORITES', payload: stored })
  }, [])

  useEffect(() => {
    if (!state.loaded) return
    writeStorage(STORAGE_KEY, state.favorites)
  }, [state.favorites, state.loaded])

  const addFavorite = useCallback<FavoritesContextValue['addFavorite']>((track) => {
    const entry: FavoriteTrack = {
      ...track,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_FAVORITE', payload: entry })
    return entry
  }, [])

  const removeFavorite = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id })
  }, [])

  const isFavorited = useCallback<FavoritesContextValue['isFavorited']>(
    (predicate) => state.favorites.some(predicate),
    [state.favorites],
  )

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites: state.favorites,
      loaded: state.loaded,
      dispatch,
      addFavorite,
      removeFavorite,
      isFavorited,
    }),
    [state.favorites, state.loaded, addFavorite, removeFavorite, isFavorited],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider')
  return ctx
}
