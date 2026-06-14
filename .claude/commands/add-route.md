# Add Route

Add a new route to the application following the established routing conventions.

## Routing Architecture

The router lives entirely in `src/routes/router.tsx`. It uses **react-router v7** (`createBrowserRouter`) and exports two things:

- `routes: RouteObject[]` — the raw route config array
- `router` — the browser router instance consumed by `Providers.tsx`

The router is wired into the app via:

```
src/main.tsx
  → <Providers router={router} />
      → <RouterProvider router={props.router} />  (src/Providers.tsx)
```

No other file creates or modifies the router. All route additions go in `src/routes/router.tsx`.

## Route Categories

### Public routes
Accessible without authentication. Add directly to the `routes` array at the top level.

```tsx
{
  path: '/your-path',
  Component: YourPage,
}
```

### Protected routes
Nested under the `ProtectedRoute` wrapper. The parent `path: '/'` entry uses `element: <ProtectedRoute />` and its children are guarded.

```tsx
{
  path: '/',
  element: <ProtectedRoute />,
  children: [
    {
      path: '',          // renders at "/"
      Component: Home,
      children: [
        {
          path: 'your-path',   // renders at "/your-path" inside Home
          Component: YourPage,
        },
      ],
    },
  ],
}
```

To add a protected route, append to `Home`'s `children` array (or create a new sibling of `Home` inside `ProtectedRoute.children` if it needs its own layout).

## How ProtectedRoute Works

`src/components/ProtectedRoute.tsx` reads `useAuth()` from `AuthContext`:

- While auth is initializing → shows `<Loading />`.
- If not authenticated → redirects to `/login` (preserving `location` in state).
- If authenticated → renders `<Outlet />`, allowing children to mount.

## Step-by-Step: Adding a New Route

1. **Create the page component** under `src/pages/<route-name>/<RouteName>.tsx`.

2. **Import it** at the top of `src/routes/router.tsx`:
   ```tsx
   import YourPage from '@/pages/your-page/YourPage'
   ```

3. **Add the route object** to `routes` in `router.tsx`:
   - Public → top-level entry in the array.
   - Protected → inside the `Home` component's `children` array (or as a new sibling of `Home` under `ProtectedRoute.children`).

4. **No changes needed** to `main.tsx`, `Providers.tsx`, or `ProtectedRoute.tsx` for standard routes.

## Path Conventions

| Pattern | Renders at | Notes |
|---|---|---|
| `path: '/about'` | `/about` | top-level public |
| `path: ''` inside `ProtectedRoute > children` | `/` | root protected page |
| `path: 'test'` inside `Home.children` | `/test` | nested inside Home layout |

- Do **not** add a leading `/` to nested paths (`'test'`, not `'/test'`).
- Use kebab-case for multi-word paths (`'budget-tracker'`).

## Current Route Map

```
/about         → LandingPage        (public)
/login         → Login              (public)
/sign-up       → SignUp             (public)
/              → ProtectedRoute
  /            → Home
    /test      → ComponentsTest
```

## Example: Adding a protected `/settings` route

```tsx
// src/routes/router.tsx
import Settings from '@/pages/settings/Settings'   // ← add import

// inside routes, under Home.children:
{
  path: 'settings',
  Component: Settings,
}
```

Result path: `/settings`, rendered inside the `Home` layout, behind auth.
