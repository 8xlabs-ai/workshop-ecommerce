# ShopStream — the brief

ShopStream is a mid-market consumer marketplace selling home goods,
apparel, and small electronics. ~50k orders / month. Three years old.
Growth has plateaued. The retention team has run a series of cart
abandonment studies and found that **35% of mobile cart abandons
happen on the sign-in / create-account wall**.

The product bet: **let guests check out**. Capture the email at the
top of the flow; offer the account upsell only after the order is
placed. If the bet works, mobile cart conversion goes from 1.6% to
2.4% — a ~50% lift on a ~$80m/yr GMV.

## Scope of this workshop

Build the guest-checkout slice **behind a feature flag** so we can
turn it on for 5% of mobile traffic next week, watch the funnel, and
decide whether to ramp.

Out of scope:

- Anonymous-cart persistence across visits (we accept the cart in the
  checkout request body for now).
- Guest order history page (guests look up by order id + email).
- The full account-upsell post-purchase nudge (banner only — actual
  account creation is a Phase 2 ticket).
- Step-indicator pill design (use the existing `BreadcrumbComponent`).
- Wishlist / saved items.

In scope:

- `POST /api/checkout/guest` (feature-flagged).
- Guest-friendly `GET /api/orders/:id?email=...`.
- `/checkout/guest/contact|shipping-payment|review` Angular flow.
- `guest_checkout_enabled` feature flag (default OFF).
- Rate limiting on the new endpoint.

## Success criteria

1. With `FF_GUEST_CHECKOUT_ENABLED=true` on staging, a fresh browser
   can complete an order without signing in or registering.
2. The order shows up in `orders` with `user_id IS NULL` and
   `guest_email` populated.
3. The post-purchase confirmation page resolves via
   `GET /api/orders/:id?email=...` only.
4. With the flag OFF, the `POST /api/checkout/guest` endpoint returns
   `403 FEATURE_DISABLED` and the guest-flow links are hidden on the
   client.
