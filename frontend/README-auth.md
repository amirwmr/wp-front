# Frontend Auth Flow

SvelteKit OTP auth with SSR-aware tokens, auto-refresh, and onboarding for couples/vendors.

## Tokens & Storage

- Access token: set via `/api/auth/session` to a non-HttpOnly cookie (SameSite=Lax, Secure per `AUTH_COOKIE_SECURE`, max-age 5m) and cached in `sessionStorage` for client fetch headers.
- Refresh token: HttpOnly cookie (SameSite=Lax, max-age 7d) written by `/api/auth/session`; rotated by `/api/auth/refresh` which also updates the access cookie.
- Logout: `auth.logout()` → DELETE `/api/auth/session` clears both cookies + client cache.

## Server-Side Loading

- `src/hooks.server.ts` reads cookies on every request, fetches `/api/auth/me/`, and refreshes via `/api/auth/jwt/refresh/` when the access token is expired. Locals: `user`, `accessToken`, `refreshToken`.
- `handleFetch` auto-injects `Authorization` for server-side requests hitting `API_BASE`.
- Root layout (`+layout.server.ts`) trusts `locals.user` and still handles locale/theme cookies.

## Client Helpers

- `src/lib/auth/index.ts`: `requestOtp`, `verifyOtp`, `fetchMeClient`, `refreshSessionClient`, `logout`, `user` store, and `isAuthenticated`.
- `src/lib/auth/status.ts`: `isOnboardingComplete(user)` for role-aware onboarding gating.
- `src/lib/utils/api.ts`: `apiFetch` prepends `PUBLIC_API_BASE_URL`, attaches `Authorization`, and transparently retries once on 401 via `/api/auth/refresh`. Throws friendly errors from backend validation (OTP invalid/expired, 429, etc.).
- Session utilities: `src/lib/auth/tokens.ts` handles `/api/auth/session` persistence and local access token cache.

## Routes & Guards

- Login (`/login`): phone + actor (couple/vendor) → OTP request/verify → tokens persisted → fetch `/api/auth/me/` → redirect to `/onboarding` when needed, otherwise to `next` or `/dashboard`.
- Onboarding (`/onboarding`): couple → PATCH `/api/onboarding/profile/`; vendor → PATCH `/api/onboarding/vendor/`. Honors `next` query param after completion.
- Protected pages: `dashboard`, `website`, `guests`, `checklist`, `vendors` use `requireOnboardedUser` in `+page.server.ts` to redirect anonymous/incomplete users to `/login`/`/onboarding`.
- Role helpers: `requireRole(user, ['vendor'])` in `src/lib/server/guards.ts` for vendor-only surfaces if added later.

## Extending or Adding Routes

- New protected page: create `+page.server.ts` with `requireOnboardedUser(locals.user, url)` (or `requireRole`) and rely on layout `data.user`.
- New onboarding fields: extend `src/lib/auth/status.ts` if completion rules change, add inputs to `onboarding/+page.svelte`, and PATCH the appropriate onboarding endpoint.
- API calls from the client should go through `apiFetch` for auto refresh + error handling; server-side calls can use `event.fetch` (Authorization is injected for API_BASE requests).

## Test Scenarios Covered

1. First-time couple/vendor OTP login → onboarding → dashboard.
2. Returning user skips onboarding and hits `/dashboard` directly (SSR works).
3. Invalid/expired OTP shows toasts, no tokens stored.
4. Expired access during browsing auto-refreshes via `/api/auth/refresh`, otherwise clears session and redirects on next guarded page.
5. Logout clears cookies/server state; guarded routes bounce to `/login`.
