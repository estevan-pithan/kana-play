# Phase 1 — Project Bootstrap & Dependency Installation

## Goal

Transform the bare Vite scaffold into a fully configured project with all required dependencies installed and base infrastructure in place.

## Tasks

### 1. Install all dependencies

**Production dependencies:**

- `react-router-dom` (v7)
- `@tanstack/react-query`
- `axios`
- `zod`
- `react-hook-form`
- `@hookform/resolvers`
- `i18next`
- `react-i18next`
- `recharts`
- `lucide-react`
- `tailwindcss`
- `@tailwindcss/vite`
- `shadcn` (CLI) + `@radix-ui/*` primitives
- `sonner` (toast notifications)
- `clsx`
- `tailwind-merge`

**Dev dependencies:**

- `prettier`
- `eslint-plugin-react-hooks` (already present)
- `vitest`
- `@testing-library/react`
- `@testing-library/user-event`
- `@playwright/test`
- `@types/recharts`

### 2. Configure Tailwind CSS

- Add `@tailwindcss/vite` plugin to `vite.config.ts`
- Replace `src/index.css` with Tailwind directives (`@import "tailwindcss"`)
- Create `src/styles/glass.css` with:
  - Liquid Glass CSS variables (`--glass-bg`, `--glass-border`, `--glass-blur`, `--glass-shadow`, `--glass-radius`)
  - **Yellow Ochre brand tokens** (`--brand: #C8922A`, `--brand-light: #E8B84B`, `--brand-dark: #9A6E1A`, `--brand-muted`, `--brand-border`)
  - Animated background blob `@keyframes` in amber/ochre tones
  - Dark warm background gradient (`#1a0e00 → #2a1800 → #111111`)
- Create `tailwind.config.ts` with custom utility classes: `glass`, `glass-card`, `glass-input`, `btn-brand`, `accent-brand`

### 2b. Copy Logo Asset

- Copy the provided cheese-wedge logo image to `src/assets/logo.png`
- Also copy to `public/favicon.png` for the browser tab icon
- Update `index.html` `<link rel="icon">` to point to `/favicon.png`

### 3. Configure Shadcn UI

- Create `components.json` at project root (style: `default`, baseColor: `slate`, cssVariables: `true`)
- Run `shadcn init` equivalent configuration
- Add initial components: `Button`, `Input`, `Card`, `Dialog`, `Table`, `Badge`, `Tabs`, `Tooltip`, `Select`

### 4. Configure path aliases

In `vite.config.ts`:

```ts
resolve: { aliases: { '@': '/src', '@pages': '/src/pages', '@types': '/src/types', '@contexts': '/src/contexts' } }
```

Mirror in `tsconfig.app.json` under `compilerOptions.paths`.

### 5. Configure ESLint + Prettier

- Update `eslint.config.js` to enable `typescript-eslint` strict type-checked rules
- Create `prettier.config.js` with standard settings (single quotes, trailing commas, 2-space indent, 100 char print width)

### 6. Configure Vitest

- Add `test` config block to `vite.config.ts` (environment: `jsdom`, globals: `true`, setupFiles: `src/test/setup.ts`)
- Create `src/test/setup.ts` importing `@testing-library/jest-dom`

### 7. Configure Playwright

- Create `playwright.config.ts` at root (baseURL: `http://localhost:5173`, browsers: chromium)
- Create `e2e/` folder with a placeholder spec

### 8. Create `.specs/` documentation folder

Create a `.specs/` folder at the project root with markdown files mirroring the Epic artifacts, so the documentation is versioned alongside the code in Git.

File structure:

```
.specs/
├── README.md                  ← Index listing all spec files with one-line descriptions
├── master-spec.md             ← Full master specification (branding, stack, architecture, wireframe descriptions, acceptance criteria)
├── tickets/
│   ├── phase-1-bootstrap.md
│   ├── phase-2-infrastructure.md
│   ├── phase-3-api-layer.md
│   ├── phase-4-login.md
│   ├── phase-5-artist-discovery.md
│   ├── phase-6-artist-profile.md
│   ├── phase-7-my-collection.md
│   ├── phase-8-insights.md
│   └── phase-9-quality.md
```

**Rules for the markdown files:**

- `master-spec.md`: copy the full content of the master spec — including branding, tech stack, folder structure, API integration, functional requirements, design tokens, routing, and acceptance criteria. Omit the raw HTML wireframe blocks (replace each with a one-paragraph description of the screen layout).
- Each `tickets/phase-N-*.md`: copy the corresponding ticket content (goal, tasks, acceptance criteria).
- `README.md`: brief project description + table linking to each spec file.
- All files must be valid GitHub-flavored Markdown.
- **Do NOT** add `.specs/` to `.gitignore`; it should be committed to the repo.

## Acceptance Criteria

- `bun install` (or `npm install`) completes without errors
- `bun run dev` starts the dev server
- Tailwind classes apply correctly in `App.tsx`
- Path alias `@/` resolves in TypeScript without errors
- `bun run lint` passes
- `bun run test` runs Vitest (0 tests, no errors)
- `bun run test:e2e` runs Playwright (0 tests, no errors)
- `.specs/` folder exists at project root with `README.md`, `master-spec.md`, and all 9 ticket files under `.specs/tickets/`
- All `.specs/` files are valid Markdown and committed to the repository
