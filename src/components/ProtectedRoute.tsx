import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'

export function ProtectedRoute() {
  const { state } = useApp()
  const location = useLocation()

  if (!state.token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
