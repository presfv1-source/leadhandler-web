# Firebase Auth (Path B) — Test Steps

## Prerequisites

- Set `AUTH_SECRET` (or `SESSION_SECRET` ≥ 16 chars) and Firebase Admin env vars (`FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`).
- Firebase client config (defaults or `NEXT_PUBLIC_FIREBASE_*`) for Google/Apple sign-in.

## Test Steps

1. **Login → Google → dashboard**
   - Open `/login`.
   - Click **Google**, complete sign-in.
   - After redirect, you should land on `/app/dashboard` (or `callbackUrl`).
   - No bounce back to `/login`.

2. **Refresh stays logged in**
   - While on `/app/dashboard`, refresh the page.
   - You should remain on the dashboard (session cookie `lh_session` is valid).

3. **Logout clears session**
   - Click logout (topbar or account page).
   - `POST /api/auth/logout` runs and clears `lh_session`.
   - You should be redirected to `/login`. Visiting `/app/*` should redirect to `/login`.

## Debug

- Session route logs (do not log tokens): `[firebase/session] verified email: … role: … cookie will be set`.
- If Google/Apple popup is blocked, allow popups for the site.
- If session is not set after login, check `AUTH_SECRET` and Firebase Admin config; ensure cookie is set (DevTools → Application → Cookies).
