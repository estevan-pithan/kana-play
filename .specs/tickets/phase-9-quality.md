# Phase 9 — Quality, Tests & Final Polish

## Goal

Add unit tests for critical hooks/utilities, E2E tests for key flows, and apply final visual polish.

## Tasks

### Unit Tests (Vitest + React Testing Library)

- `src/contexts/FavoritesContext.test.tsx`: test `ADD_FAVORITE`, `REMOVE_FAVORITE`, `LOAD_FAVORITES` reducer actions and localStorage persistence
- `src/utils/storage.test.ts`: test localStorage read/write helpers
- `src/pages/artist-discovery/hooks/useArtistDiscovery.test.ts`: test debounce behavior and infinite query integration (mock React Query)
- `src/pages/my-collection/components/AddFavoriteForm.test.tsx`: test form validation — required fields, min length errors, successful submit

### E2E Tests (Playwright)

- `e2e/login.spec.ts`: fill Client ID + Secret → submit → assert redirect to `/`
- `e2e/artist-search.spec.ts`: type in search box → assert artist cards appear → scroll to bottom → assert more cards load
- `e2e/favorites.spec.ts`: navigate to `/collection` → fill form → submit → assert item appears in list → remove item → assert item gone

### Final Visual Polish

- Ensure consistent **Yellow Ochre + Liquid Glass** styling across all pages:
  - All CTA buttons use `linear-gradient(135deg, #C8922A, #E8B84B)` with dark text
  - Active nav links, active tabs, and accent elements use `#E8B84B` / `#C8922A`
  - Popularity bars, chart fills, and badge borders use the ochre palette
  - Glass cards use `rgba(255,255,255,0.06)` background with `rgba(255,255,255,0.09)` border
- Background: warm dark gradient (`#1a0e00 → #2a1800 → #111111`) with animated ochre blobs
- Cheese-wedge logo appears in Navbar and Login page
- Add CSS `@keyframes` animated background blobs to the root layout
- Responsive breakpoints verified on mobile (375px), tablet (768px), desktop (1280px)
- Add `<title>KanaPlay</title>` and meta tags in `index.html`
- Add loading spinner component (`src/components/ui/Spinner.tsx`) with ochre color, used consistently across all loading states
- Verify all Lucide icons are used (no emoji fallbacks in production components)

### README Update

Update `README.md` with:

- Project description and screenshots
- Setup instructions (env vars, `bun install`, `bun run dev`)
- Architecture decisions summary
- Available scripts

## Acceptance Criteria

- `bun run test` passes all unit tests (≥ 80% coverage on contexts and hooks)
- `bun run test:e2e` passes all 3 E2E specs
- No TypeScript errors (`bun run build` succeeds)
- No ESLint errors (`bun run lint` passes)
- App is fully responsive on mobile, tablet, and desktop
- All pages use consistent Liquid Glass visual style
- README documents setup and architecture
