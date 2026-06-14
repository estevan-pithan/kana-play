# Phase 4 — Login Page & Spotify Authentication

## Goal

Implement the Login page with the Spotify Client Credentials authentication flow, connecting it to `AppContext`.

## Reference

Reference screen: `screens/login.png` — agent must request the user to upload this image before implementing.

> ⚠️ Instruction for the agent: Before starting the implementation of this screen, ask the user to upload the `login.png` image directly in the chat. Analyze the image pixel by pixel to ensure the layout, spacing, colors, typography, and element arrangement are identical to the screenshot. Do not assume any visual detail without confirming it in the image.

## Tasks

### Page: `src/pages/login/Login.tsx`

- Liquid Glass card centered on a gradient background
- **Form** (React Hook Form + Zod):
  - Fields: `clientId` (required), `clientSecret` (required)
  - Zod schema: both fields `z.string().min(1)`
  - On submit: call `getToken(clientId, clientSecret)` → dispatch `SET_TOKEN(access_token)` → navigate to `/`
  - Loading state: button shows spinner while fetching
  - Error state: toast error if token fetch fails
- Language switcher in top-right corner (calls `i18n.changeLanguage`)
- All strings via `t('login.*')`

### Hook: `src/pages/login/hooks/useLoginForm.ts`

- Encapsulates form logic, `useMutation` for token fetch, navigation on success
- Returns: `form`, `onSubmit`, `isPending`

### Visual

- Full-viewport **warm dark gradient** background: `#1a0e00 → #2a1800 → #111111`
- Animated floating amber/ochre blobs in background (CSS `@keyframes`)
- Glass card with `backdrop-filter: blur(24px)`
- **Yellow Ochre** (`#C8922A → #E8B84B` gradient) for the primary CTA button
- Logo: cheese-wedge image (`src/assets/logo.png`) displayed at 72px height, centered above the app name
- App name **KanaPlay** in white, bold, below the logo

## Acceptance Criteria

- Form validates — empty fields show inline error messages
- Successful token fetch navigates to `/`
- Token is stored in AppContext and used by the Axios interceptor on subsequent requests
- Failed token fetch shows a toast error
- Language switcher changes all UI strings immediately
- Page matches the Liquid Glass aesthetic from the wireframe
