# Stripe Production Migration Checklist

Use this checklist when moving from test-mode billing scaffolding to production billing.

## Environment separation
- [ ] Confirm all client code uses publishable keys only.
- [ ] Confirm server code uses production secret key only in server runtime.
- [ ] Confirm `STRIPE_WEBHOOK_SECRET` is set per-environment and never reused between staging/prod.

## Webhook integrity
- [ ] Keep signature verification enabled for all webhook events.
- [ ] Store and enforce webhook idempotency keys/event IDs in durable storage.
- [ ] Ensure duplicate webhook deliveries do not double-apply subscription updates.
- [ ] Restrict accepted webhook event types to an allowlist.

## Subscription state sync
- [ ] Verify checkout completed updates customer/subscription records.
- [ ] Verify cancellation/renewal/payment-failed events update app state correctly.
- [ ] Verify customer-portal changes are reflected after webhook sync.

## Security and observability
- [ ] Ensure logs do not contain full card/payment payloads or PII.
- [ ] Alert on webhook verification failures and repeated 4xx/5xx responses.
- [ ] Confirm billing routes are covered by authZ checks for current user/masjid scope.
