import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import Login from '@/pages/login/Login'
import Callback from '@/pages/callback/Callback'
import ArtistDiscovery from '@/pages/artist-discovery/ArtistDiscovery'
import ArtistProfile from '@/pages/artist-profile/ArtistProfile'
import MyCollection from '@/pages/my-collection/MyCollection'
import Insights from '@/pages/insights/Insights'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/callback',
    element: <Callback />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          { index: true, element: <ArtistDiscovery /> },
          { path: 'artist/:id', element: <ArtistProfile /> },
          { path: 'collection', element: <MyCollection /> },
          { path: 'insights', element: <Insights /> },
        ],
      },
    ],
  },
])
