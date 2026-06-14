---
name: folder-structure
description: Standardize directory organization in React SPA projects with TypeScript. Use when reviewing, creating, or moving files to ensure they follow the established folder structure conventions.
---

# Skill — Folder Structure for React SPA Projects

## Purpose

Standardize directory organization in React SPA projects with TypeScript, ensuring scalability, separation of concerns, and predictable file locations.

---

## Base Structure

```
project-root/
├── public/                         # Static assets served directly (favicon, manifest, etc.)
├── src/
│   ├── main.tsx                    # Entry point — mounts providers to the DOM
│   ├── Providers.tsx               # Hierarchical composition of all providers
│   │
│   ├── api/                        # API communication layer
│   │   ├── mocks/                  # Mock data for development/testing
│   │   │   └── [domain]/           # Grouped by domain (auth/, user/, etc.)
│   │   └── services/               # Request functions
│   │       └── [domain]/           # Grouped by domain (auth/, user/, etc.)
│   │
│   ├── assets/                     # Bundler-imported files (images, SVGs, fonts)
│   │
│   ├── components/                 # Reusable components (not tied to a specific page)
│   │   ├── ui/                     # UI primitives (button, card, input, form, etc.)
│   │   ├── icon/                   # Icon system
│   │   ├── layout/                 # Structural components (Navbar, Footer, etc.)
│   │   └── [feature]/              # Shared feature components (dashboard/, etc.)
│   │
│   ├── config/                     # App configuration (HTTP instance, feature flags, etc.)
│   │
│   ├── contexts/                   # React Contexts for global state
│   │
│   ├── hooks/                      # Reusable custom hooks
│   │
│   ├── icons/                      # Custom SVG icon components
│   │
│   ├── langs/                      # Internationalization (i18n config + translation files)
│   │
│   ├── lib/                        # Library utilities (wrappers, adapters)
│   │
│   ├── pages/                      # Application pages (one folder per route/feature)
│   │   └── [page-name]/            # Each page is a folder
│   │       ├── PageName.tsx        # Main page component
│   │       ├── components/         # Components exclusive to this page
│   │       └── hooks/              # Hooks exclusive to this page
│   │
│   ├── routes/                     # Route definitions and configuration
│   │
│   ├── scripts/                    # Automation and code generation scripts
│   │
│   ├── styles/                     # Global styles and design tokens
│   │
│   ├── types/                      # Shared TypeScript types
│   │
│   └── utils/                      # Pure utility functions (no React dependency)
│
├── components.json                 # Component library CLI config (shadcn/ui, etc.)
├── vite.config.ts                  # Bundler config
├── tsconfig.json                   # Root TypeScript config
├── tsconfig.app.json               # Application TypeScript config
├── eslint.config.js                # Linting config
├── prettier.config.js              # Formatting config
└── package.json
```

---

## Organization Rules

### 1. `api/` — Request Layer

- Each **API domain** (auth, user, product, etc.) has its own subfolder inside `services/` and `mocks/`.
- One file per endpoint. The filename describes the action: `authenticate.ts`, `create-user.ts`, `get-user.ts`.
- Mocks mirror the same structure as `services/`.

```
api/
├── mocks/
│   ├── auth/
│   │   └── get-refresh-token.mock.ts
│   └── user/
│       └── get-user.mock.ts
└── services/
    ├── auth/
    │   ├── authenticate.ts
    │   ├── deauthenticate.ts
    │   └── get-refresh-token.ts
    └── user/
        ├── create-user.ts
        ├── get-user.ts
        └── get-user-me.ts
```

### 2. `components/` — Reusable Components

Organized by abstraction layers:

| Subfolder      | Contents                                                                 |
|----------------|--------------------------------------------------------------------------|
| `ui/`          | Atomic primitives (Button, Input, Card, etc.) — from a library or custom |
| `icon/`        | Generic icon component and dynamic resolution system                     |
| `layout/`      | Page structure (Navbar, Sidebar, Footer, PageWrapper)                    |
| `[feature]/`   | Components for a shared feature across pages (dashboard/, etc.)          |
| root           | Standalone global components (ProtectedRoute, ToggleDarkMode, etc.)      |

**Rule**: if a component is used in **only one page**, it belongs inside `pages/[page]/components/`, not in `components/`.

### 3. `pages/` — Feature-Based Pages

Each page is a **folder** containing:

```
pages/
└── login/
    ├── Login.tsx              # Main component (exported)
    ├── components/            # Components used ONLY in this page
    │   └── LoginForm.tsx
    └── hooks/                 # Hooks used ONLY in this page
        └── useLoginForm.ts
```

**Scope rule**: files inside `pages/[page]/` are never imported by another page. If sharing is needed, move them to `components/` or `hooks/` at the `src/` root.

### 4. `contexts/` — Global State

- One file per context.
- Each file exports: the **Provider**, the **consumer hook** (`useAuth`, `useTheme`), and the **types**.
- Naming: `[Name]Context.tsx` → exports `[Name]Provider` + `use[Name]`.

### 5. `hooks/` — Global Hooks

- Only reusable hooks that **do not belong to a specific page**.
- Page-specific hooks go in `pages/[page]/hooks/`.
- Naming: `use-[name].ts` (kebab-case).

### 6. `config/` — Configuration

- HTTP client instance (configured Axios/Fetch).
- Feature flags, environment constants, third-party configurations.
- **Do not confuse** with root config files (`vite.config.ts`, `eslint.config.js`).

### 7. `langs/` — Internationalization

```
langs/
├── i18n.ts            # i18next initialization and config
├── resources.ts       # Language mapping and metadata
├── en-US.json         # Translations
└── pt-BR.json
```

### 8. `styles/` — Global Styles

```
styles/
├── index.css          # Entry CSS — imports, design tokens (light/dark)
└── colors.css         # Custom color palette
```

- Design tokens are defined as CSS variables (`:root` and variants).
- Component styles are inline (Tailwind classes), not in separate CSS files.

### 9. `types/` — Shared Types

- Types used across **more than one module**.
- Module-specific types stay in the module's own file.

### 10. `utils/` — Pure Utilities

- Functions with no React dependency (no hooks, no JSX).
- Generic reusable helpers.

### 11. `lib/` — Library Adapters

- Thin wrappers over external libraries (e.g., `cn()` combining `clsx` + `tailwind-merge`).
- Abstraction point — if the library changes, only this layer is affected.

---

## Naming Conventions

| Type                    | Convention            | Example                      |
|-------------------------|-----------------------|------------------------------|
| React Component         | PascalCase            | `Login.tsx`, `Sidebar.tsx`   |
| Hook                    | kebab-case with `use-`| `use-toast.ts`               |
| API Request             | kebab-case with verb  | `get-user.ts`, `create-user.ts` |
| Mock                    | kebab-case with `.mock`| `get-user.mock.ts`          |
| Context                 | PascalCase + `Context`| `AuthContext.tsx`            |
| Type/Interface          | PascalCase            | `icons-type.ts`              |
| Utility                 | kebab-case            | `helpers.ts`                 |
| Config file             | kebab-case            | `api.ts`                     |
| Page folder             | kebab-case            | `landing-page/`, `sign-up/`  |
| API domain folder       | kebab-case            | `auth/`, `user/`             |

---

## File Placement — Quick Decision Guide

| Question                                       | Destination                      |
|------------------------------------------------|----------------------------------|
| Is it a UI primitive (button, input)?           | `components/ui/`                |
| Is it a layout structure (navbar, sidebar)?     | `components/layout/`            |
| Is it shared across pages?                      | `components/` or `components/[feature]/` |
| Is it used in ONE page only?                    | `pages/[page]/components/`      |
| Is it a global hook?                            | `hooks/`                        |
| Is it a hook for ONE page?                      | `pages/[page]/hooks/`           |
| Is it an API call?                              | `api/services/[domain]/`        |
| Is it a mock?                                   | `api/mocks/[domain]/`           |
| Is it global state (context)?                   | `contexts/`                     |
| Is it a lib/service configuration?              | `config/`                       |
| Is it a shared type?                            | `types/`                        |
| Is it a pure function without React?            | `utils/`                        |
| Is it an external library wrapper?              | `lib/`                          |
| Is it a translation?                            | `langs/`                        |
| Is it a global style/token?                     | `styles/`                       |
| Is it a custom SVG icon?                        | `icons/`                        |
| Is it an automation script?                     | `scripts/`                      |

---

## Recommended Path Aliases

| Alias       | Path              | Usage                                    |
|-------------|-------------------|------------------------------------------|
| `@/`        | `src/`            | Default import for any src file          |
| `@pages/`   | `src/pages/`      | Direct access to pages                   |
| `@types/`   | `src/types/`      | Access to shared types                   |
| `@contexts/`| `src/contexts/`   | Access to contexts                       |

Aliases must be configured in both the **bundler** (`vite.config.ts`) and **TypeScript** (`tsconfig.app.json`).
