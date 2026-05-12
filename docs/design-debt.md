# Design debt (known, scoped)

Items here are **known** issues left in the scaffold. Do not fix them
as part of an unrelated PR — they have owners.

1. **Two shadow recipes.** `--shadow-card` (new) and `--shadow-floating`
   (legacy). Use `--shadow-card` for anything new. Floating is still
   used by `AccountMenuComponent` and `CurrencyPickerComponent`.
2. **`--rounded-xs` leak on cart-line items** (4px instead of 6px).
   Cosmetic, low priority.
3. **Legacy `/promo` route** uses hard-coded square banners. Owned by
   marketing.
4. **No step-indicator component.** Checkout uses
   `BreadcrumbComponent`. Solution-side design wants pill segments.
5. **No save/heart on product cards.** Wishlist is a future feature.
6. **Legacy `Helvetica Neue` reference** in `legal-page.scss`.
   Harmless.
7. **Coral accent token** (`--color-accent-legacy`) is unused but kept
   for the legacy `/promo` route.
8. **Cart quantity-stepper hit area (32×32)** below WCAG AAA.
9. **Breadcrumb is not announced as a step indicator** by screen
   readers.
10. **No `tabular-nums` fallback** for browsers without OpenType
    numeric features. Minor — modern browsers all support it.
