# Testing

## Commands

- `npm test` – run API smoke tests against local Next instance.
- `npm run test:e2e` – run lightweight HTTP-level e2e checks.
- `npm run test:api` – alias for API smoke.
- `npm run test:visual` – placeholder in this environment (visual tests are CI-gated when Playwright deps are available).
- `npm run test:a11y` – placeholder in this environment.
- `npm run test:visual:update` – maintainer-only baseline update placeholder.

## Notes

This repository currently uses Node's built-in test runner + a Next dev server bootstrap script in `scripts/run-next-tests.mjs`.

## Stripe webhook testing (mocked in this environment)

- Endpoints:
  - `POST /api/stripe/checkout-session`
  - `POST /api/stripe/customer-portal`
  - `GET /api/stripe/subscription-status`
  - `POST /api/stripe/webhook`
- Webhook signature uses `STRIPE_WEBHOOK_SECRET` and Stripe-style `t=...,v1=...` HMAC validation.


## Visual baseline updates

- CI currently runs lightweight visual smoke checks (`npm run test:visual`).
- For full snapshot baseline updates, use a maintainer-only workflow/branch process to avoid auto-updating expected images on every PR.


Stripe endpoints in this repo are currently **test-mode scaffolding** for QA hardening and should not be treated as production billing completion. Keep secrets server-side, require webhook secrets locally, and use Stripe CLI forwarding for end-to-end webhook simulation.

- Production readiness checklist: see `docs/stripe-production-migration-checklist.md`.
