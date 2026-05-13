# Component Inventory — `web`

> Apps-internal components only (standalone Angular 17). For reusable primitives, see [Component Inventory — UI](./component-inventory-ui.md).

## Catalog

| Component | File | Role |
|-----------|------|------|
| `CatalogPageComponent` | `app/catalog/catalog-page.component.ts` | Product grid, filters, search |
| `ProductDetailComponent` | `app/catalog/product-detail.component.ts` | Single product view + add-to-cart |

## Cart

| Component | File | Role |
|-----------|------|------|
| `CartPageComponent` | `app/cart/cart-page.component.ts` | Cart UI |

Supporting:
- `cart.service.ts` — API calls + persistence bridge
- `cart.store.ts` — `@ngrx/signals` store

## Checkout — Shell + Shared

| Component | File | Role |
|-----------|------|------|
| `CheckoutShellComponent` | `app/checkout/checkout-shell.component.ts` | Stepper container |
| `OrderSummaryComponent` | `app/checkout/order-summary.component.ts` | Persistent summary rail |

Supporting:
- `checkout.routes.ts` — wizard routing (logged-in + guest branches)
- `checkout.service.ts` — API calls
- `checkout.store.ts` — `@ngrx/signals` store
- `shipping-methods.ts` — shipping option enum/data
- `saudi-cities.ts` — KSA city autocomplete data

## Checkout — Logged-in Steps

| Component | File | Role |
|-----------|------|------|
| `ShippingStepComponent` | `app/checkout/steps/shipping-step.component.ts` | Address + ship method |
| `PaymentStepComponent` | `app/checkout/steps/payment-step.component.ts` | Saved cards + payx-sdk iframe |
| `ReviewStepComponent` | `app/checkout/steps/review-step.component.ts` | Final review + place |

## Checkout — Guest Steps

| Component | File | Role |
|-----------|------|------|
| `GuestContactStepComponent` | `app/checkout/steps/guest-contact-step.component.ts` | Email capture (top of guest flow) |
| `GuestShippingPaymentStepComponent` | `app/checkout/steps/guest-shipping-payment-step.component.ts` | Combined shipping + payment for guest |
| `GuestReviewStepComponent` | `app/checkout/steps/guest-review-step.component.ts` | Final review + place |

## Orders

| Component | File | Role |
|-----------|------|------|
| `OrderConfirmationComponent` | `app/orders/order-confirmation.component.ts` | Post-purchase page (resolves via `GET /api/orders/:id?email=`) |

## Account

| Component | File | Role |
|-----------|------|------|
| `LoginComponent` | `app/account/login.component.ts` | Email + password |
| `RegisterComponent` | `app/account/register.component.ts` | Registration |
| `DashboardComponent` | `app/account/dashboard.component.ts` | Account home |
| `OrdersListComponent` | `app/account/orders-list.component.ts` | Authenticated user's orders |

Supporting:
- `account.routes.ts` — protected by `AuthGuard`

## Core Layout

| Component | File | Role |
|-----------|------|------|
| `TopNavComponent` | `app/core/layout/top-nav.component.ts` | Header with auth state + cart count |
| `AppFooterComponent` | `app/core/layout/app-footer.component.ts` | Footer |
| `BreadcrumbComponent` | `app/core/layout/breadcrumb.component.ts` | Step indicator (reused in checkout wizard per `docs/brief.md`) |
| `AccountMenuComponent` | `app/core/layout/account-menu.component.ts` | User dropdown |

Supporting:
- `icons.ts` — icon set / symbol registry

## Core Services / Directives

| Symbol | File | Role |
|--------|------|------|
| `ApiService` | `app/core/http/api.service.ts` | The only HttpClient caller |
| `RequestIdInterceptor` | `app/core/http/request-id.interceptor.ts` | Adds `X-Request-ID` |
| `AuthInterceptor` | `app/core/http/auth.interceptor.ts` | Attaches `Authorization` (honors `X-Skip-Auth`) |
| `ErrorInterceptor` | `app/core/http/error.interceptor.ts` | Central error handling |
| `AuthService` | `app/core/auth/auth.service.ts` | Session state |
| `AuthGuard` | `app/core/auth/auth.guard.ts` | Route protection |
| `FeatureFlagsService` | `app/core/feature-flags/feature-flags.service.ts` | Flag resolution |
| `FfEnabledDirective` | `app/core/feature-flags/ff-enabled.directive.ts` | Structural directive |
| `SavedCardsService` | `app/core/payments/saved-cards.service.ts` | Saved card mgmt |
| `card-utils.ts` | `app/core/payments/card-utils.ts` | Card formatting/validation helpers |
| `card.types.ts` | `app/core/payments/card.types.ts` | Card domain types |
| `telemetry.bootstrap.ts` | `app/core/telemetry/telemetry.bootstrap.ts` | OTel web tracer init |

## Categorization

| Category | Count |
|----------|-------|
| Page-level (route-rendered) | 12 |
| Step components | 6 |
| Layout chrome | 4 |
| Core services | 7 |
| Interceptors | 3 |
| Directives | 1 |
