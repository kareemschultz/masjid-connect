# PWA Cache + Notifications hardening

## Service Worker changes

- Cache version is now explicit (`CACHE_VERSION`) to support predictable invalidation.
- Critical API data (`/api/submissions`, `/api/tracking`) is now fetched network-first to reduce stale data risk.
- Added SW `message` listener for controlled `SKIP_WAITING` updates.

## Notification CTA behavior

- Added install/display-mode helper in `lib/push-notifications.js`.
- Notification toggle is hidden on iOS non-standalone mode to avoid ghost CTA states.
