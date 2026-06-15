import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import Login from '@/pages/login/Login'
import Callback from '@/pages/callback/Callback'
import Home from '@/pages/home/Home'
import ArtistProfile from '@/pages/artist-profile/ArtistProfile'
import Playlist from '@/pages/playlist/Playlist'
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
          { index: true, element: <Home /> },
          { path: 'artist/:id', element: <ArtistProfile /> },
          { path: 'playlist/:id', element: <Playlist /> },
          { path: 'collection', element: <MyCollection /> },
          { path: 'insights', element: <Insights /> },
        ],
      },
    ],
  },
])
