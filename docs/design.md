# ShopStream — Design DNA

> Source of truth: `apps/web/src/styles/_tokens.scss`, `_typography.scss`, `_breakpoints.scss`, `global.scss`. Every value below maps to a CSS custom property or Sass mixin already shipped. Don't hand-roll new tokens — extend these.

## Overview

ShopStream is a mid-market consumer marketplace running on **Angular 17 standalone + Angular Material 17**. The base canvas is **pure white** (`{colors.canvas}` — `#FFFFFF`) with deep slate-near-black ink (`{colors.ink}` — `#1A2330`) for headlines and body, and a single voltage of **ShopStream Blue** (`{colors.primary}` — `#0B5FAE`) carrying every primary CTA, the focused selected state on radio cards, and the brand mark. There is **no secondary brand color in mainline product** — the **legacy coral** (`{colors.accent-legacy}` — `#E5594A`) is kept *only* for the `/promo` route and must not be reused elsewhere.

Type runs **Inter** via Google Fonts (`Inter, -apple-system, system-ui, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`). There is no custom or licensed display family — Inter carries everything from the homepage h1 to the price tabular figures. Display weights run **600–700** and body sits at **400**, with `font-variant-numeric: tabular-nums` reserved for the `price` and `price-lg` mixins so currency lines align column-true on cart/review pages.

The shape language is **moderately rounded, not pillowy**. Buttons and inputs use 6px radius (`{rounded.sm}`), cards/summaries/modals use 12px (`{rounded.md}`), the legacy cart-line items and quantity steppers still use 4px (`{rounded.xs}` — a design-debt holdover), and only badges/avatars/search-pills hit `{rounded.full}` (9999px). This is intentionally tighter than Airbnb/Stripe — ShopStream optics lean "commerce-clean," not "editorial-soft."

**Key Characteristics:**
- Single accent color: `{colors.primary}` (`#0B5FAE` — "ShopStream Blue") for primary CTAs, selected radio-card border, focus rings, and inline brand links. Most pages are 90% white + ink with one or two blue moments.
- System type: **Inter VF** at 400 / 500 / 600 / 700. No display-family split — Inter carries the whole scale.
- Pricing typography is special: `{typography.price}` and `{typography.price-lg}` apply `tabular-nums` for column-aligned currency. Use them anywhere a number sits next to other numbers.
- 8px-base spacing with a tighter major section step (`{spacing.section}` — **56px**, *not* 64px). Marketplace density wins over editorial breathing room.
- Two elevation recipes — `{shadow.card}` for new work, `{shadow.floating}` retained only for `AccountMenuComponent` and `CurrencyPickerComponent`. **This is documented design debt** (see `docs/design-debt.md`).
- Material 17 is wrapped, not styled-over. Custom tokens flow through Material via the indigo-pink prebuilt theme + per-component class skins (`.ss-radio-card`, `.ss-step__actions`, etc.). No `::ng-deep`.
- Focus state is **2px outline in `{colors.ink}` with 2px offset** — applied globally via `:focus-visible`. No glow rings.

## Colors

### Brand & Accent
- **ShopStream Blue** (`{colors.primary}` — `#0B5FAE`): The single brand color. Backs primary CTAs ("Continue", "Place order", "Add to cart"), the selected radio-card outline, and brand wordmark.
- **Primary Active** (`{colors.primary-active}` — `#084E91`): The pressed / pointer-down state for primary buttons. No transform, no shadow change.
- **Primary Disabled** (`{colors.primary-disabled}` — `#B5CFE6`): A pale tint for disabled CTAs.
- **Primary Soft** (`{colors.primary-soft}` — `#E8F1FA`): Background tint for selected radio-card fills, inline info banners, and "Jeddah discount applied" success-info hybrids.
- **On Primary** (`{colors.on-primary}` — `#FFFFFF`): White text/icons on blue surfaces.
- **Accent Legacy** (`{colors.accent-legacy}` — `#E5594A`): **Promo route only.** Do not re-introduce on new pages. Retained for backward compatibility per `_tokens.scss` comment.

### Surface
- **Canvas** (`{colors.canvas}` — `#FFFFFF`): Default page floor on every public + authenticated page. No dark mode in scope.
- **Surface Soft** (`{colors.surface-soft}` — `#F6F7F9`): Lightest fill — disabled fields, panel sub-backgrounds, hover surfaces.
- **Surface Strong** (`{colors.surface-strong}` — `#ECEEF2`): Heavier fill — used on the cart-summary panel divider band and step-progress backgrounds.

### Hairlines & Borders
- **Hairline** (`{colors.hairline}` — `#DDE2EA`): Default 1px border — card outlines, form-field borders at rest, footer column splitters.
- **Hairline Soft** (`{colors.hairline-soft}` — `#ECEEF2`): Same value as `surface-strong` (intentional alias) — used as long-form row dividers.
- **Border Strong** (`{colors.border-strong}` — `#B7BDC8`): Heavier stroke for disabled outlined buttons and post-focus form outlines.

### Text
- **Ink** (`{colors.ink}` — `#1A2330`): Dominant text on light surfaces. Display, body, primary nav. Never pure black.
- **Body** (`{colors.body}` — `#3C4554`): Secondary running-text — long-form review/description copy where ink would feel too heavy.
- **Muted** (`{colors.muted}` — `#6B7385`): Sub-titles, meta lines, inactive labels, footer secondary text.
- **Muted Soft** (`{colors.muted-soft}` — `#9098A6`): **Placeholders only.** Don't use for live text — fails contrast on white at body sizes.

### Semantic
- **Success** (`{colors.success}` — `#1F7A45`): Inline success text — "Order confirmed", check-circle icon fills.
- **Success Soft** (`{colors.success-soft}` — `#E4F3EB`): Success banner background (`.ss-banner[data-tone='success']`).
- **Warning** (`{colors.warning}` — `#A55F00`): Inline warning text.
- **Warning Soft** (`{colors.warning-soft}` — `#FBF1DC`): Warning banner background.
- **Error** (`{colors.error}` — `#B0271C`): Inline form errors (`<mat-error>` content), error banner border.
- **Error Soft** (`{colors.error-soft}` — `#F8E6E3`): Error banner background.

### Scrim
- **Scrim** (`{colors.scrim}` — `rgba(11, 18, 28, 0.5)`): Global modal/overlay backdrop. Stored pre-alpha-blended at the ink hue, *not* black — keeps overlays feeling cool-toned with the brand rather than neutral.

## Typography

### Font Family
The system runs **Inter** for everything — display, body, navigation, captions, pricing. Fallback walks `-apple-system, system-ui, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`. Loaded via Google Fonts in `apps/web/src/index.html` at weights **300 / 400 / 500 / 700** — `300` exists but is unused (don't introduce it on new pages).

No separate display family. No custom variable font. The whole scale lives in `_typography.scss` mixins.

### Hierarchy (Sass mixins in `apps/web/src/styles/_typography.scss`)

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.display-xl}` | 32px | 700 | 1.20 | Page-level h1 (default for `<h1>`) |
| `{typography.display-lg}` | 24px | 600 | 1.25 | Page-header titles (`ss-page-header__title`), section h2 |
| `{typography.display-md}` | 20px | 600 | 1.30 | Sub-section h3, empty-state title |
| `{typography.display-sm}` | 18px | 600 | 1.33 | Card titles, h4 |
| `{typography.title-md}` | 16px | 600 | 1.25 | Radio-card label, summary line headers |
| `{typography.title-sm}` | 14px | 600 | 1.30 | Compact card titles, table headers |
| `{typography.body-md}` | 16px | 400 | 1.50 | Default running text (applied on `<body>` globally) |
| `{typography.body-sm}` | 14px | 400 | 1.43 | Meta lines, card descriptions, hints |
| `{typography.price}` | 16px | 600 | 1.30 | Inline prices — **`tabular-nums`** |
| `{typography.price-lg}` | 22px | 700 | 1.20 | Hero / review-step total — **`tabular-nums`** |
| `{typography.caption}` | 13px | 500 | 1.30 | Field segment labels, small UI labels |
| `{typography.caption-sm}` | 12px | 400 | 1.33 | Footer legal, micro meta |
| `{typography.uppercase-tag}` | 11px | 700 | 1.20 (`0.4px` tracking, uppercase) | "NEW", "BETA", "PROMO" pill badges |
| `{typography.button}` | **15px** | 600 | 1.25 | **Button-only size** — do not reuse for body |
| `{typography.link}` | 14px | 500 | 1.43 | Inline body links |
| `{typography.nav}` | 15px | 500 | 1.25 | Top nav labels, account-menu items |

### Principles
Display weights stay practical — the page-level h1 at 32px / 700 is the largest typographic moment in the system. There is no "rating display" mega-size; pricing carries the loudest moments via `{typography.price-lg}` (22px) on review-step totals and confirmation pages.

**The 15px button quirk is intentional** — labels sit *between* `body-sm` (14px) and `body-md` (16px) so primary CTAs feel slightly heavier than card-meta but never compete with display headlines. Documented as a deliberate odd size in `_typography.scss`. Don't reuse 15px for anything that isn't a button or top-nav.

**Tabular numerics**: any time a number appears in a column or next to another number (cart line totals, review subtotal/tax/total stack, qty steppers), use `{typography.price}` or `{typography.price-lg}` — they apply `font-variant-numeric: tabular-nums` so digit widths lock and columns visually align.

### Note on Font Substitutes
If Inter fails to load, the system stack (`-apple-system, system-ui`) is the fallback. On Apple devices that resolves to **SF Pro Text**, which is ~2% tighter on cap height than Inter — display headlines stay readable without adjustment.

## Layout

### Spacing System
- **Base unit:** 4px (with a 4px micro-step — there is no 2px).
- **Tokens:** `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.base}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` **56px**.
- **Section padding (vertical):** `{spacing.section}` (56px) — deliberately tighter than the 64–96px range typical of editorial sites. Marketplace pages need higher card density per scroll.
- **Card internal padding:** `{spacing.lg}` (24px) for empty-state and reservation/summary cards; `{spacing.base}` (16px) for property/product cards; `{spacing.sm}` (8px) for dense control rows.
- **Form layout gaps:** `{spacing.sm}` (8px) between adjacent form fields in a column; `{spacing.md}` (12px) between columns in a two-column `.ss-step__row` grid.
- **Step action bars** (`.ss-step__actions`): `margin-top: 16px`, `justify-content: space-between` — used on every checkout step.

### Grid & Container
- **Max content width:** ~1280px centered (matches `$bp-wide`). Checkout/cart pages narrow to ~960px to keep forms readable.
- **Checkout step layout:** single column with `mat-form-field { width: 100% }` and a `.ss-step__row` two-column grid (`grid-template-columns: 1fr 1fr`) that collapses to one column below 640px.
- **Catalog grid:** flex/grid of product cards at 4-up desktop, 2-up tablet, 1-up mobile.
- **App shell** (`ss-app-shell`): `min-height: 100vh`, vertical flex with `[slot=nav]` → `<main>` → `[slot=footer]`.

### Whitespace Philosophy
Marketplace-dense at the cards, comfortable at the page edges. Forms breathe with 8–12px gaps but never wider than 16px between fields. The "open hero + dense grid" pattern from editorial marketplaces is *not* applied here — every page is consistently medium-density.

## Elevation

The system has **two shadow recipes** (a known design-debt split, called out in `_tokens.scss`):

- **`{shadow.card}`** — `0 1px 2px rgba(11,18,28,0.04), 0 2px 8px rgba(11,18,28,0.06)`. **Use this for anything NEW.** Property cards, summary cards, hover-floated tiles, dropdowns going forward.
- **`{shadow.floating}`** — `0 2px 4px rgba(0,0,0,0.05), 0 8px 16px rgba(0,0,0,0.08)`. **Retained only for `AccountMenuComponent` and `CurrencyPickerComponent`.** Do not introduce on new surfaces. To be unified in a future cleanup.
- **Flat (no shadow):** Default — body, hero, footer, all editorial bands, form fields at rest.
- **Modal scrim:** `{colors.scrim}` at 50% alpha over ink hue — applied to all overlay backdrops.

Depth comes from hairlines + rounded clipping + ink hue contrast, *not* layered shadows. Material components inherit their own elevation tokens — do not override them.

## Components

### Tokens for Material
All Material 17 modules are wrapped via standalone imports — see `docs/material/` for per-module specs. Below are the **project-specific** classes that skin Material components.

### Buttons
**`button-primary`** — `mat-flat-button color="primary"`. Maps to ShopStream Blue fill, white text, 6px radius (`{rounded.sm}`), 14×24px padding, 15px / 600 label. Most common CTA across checkout and account flows.

**`button-primary-active`** — Press state. Background flips to `{colors.primary-active}`.

**`button-primary-disabled`** — `[disabled]` on `mat-flat-button` — pale tint at `{colors.primary-disabled}`. Cursor not-allowed.

**`button-secondary`** — `mat-stroked-button`. White fill with ink text + 1px hairline border at `{colors.hairline}`. Used for "Back", "Cancel", and inverse CTAs.

**`button-icon`** — `mat-icon-button`. Circular 40×40px hit area for quantity steppers and inline destructive actions. Always paired with `aria-label`.

### Step / Form Layout
**`ss-step`** — Vertical flex column with 8px gap. Wraps every checkout step (`guest-contact`, `address`, `shipping`, `payment`, `review`). Pairs with `.ss-step__title` (24px / 600 ink) and `.ss-step__hint` (16px body).

**`ss-step__row`** — Two-column form grid (`grid-template-columns: 1fr 1fr; gap: 12px`). Collapses to one column under 640px. Standard for paired fields (first/last name, expiry/CVV).

**`ss-step__actions`** — Action bar at the bottom of every step. `display: flex; justify-content: space-between; align-items: center; margin-top: 16px`. Always pairs a `button-secondary` back action (or text link) with the `button-primary` forward CTA.

### Radio-Card Pattern
**`ss-radio-card`** — A `mat-card` containing a `mat-radio-button`. Selected state binds `[class.ss-radio-card--selected]="ctrl.value === opt.value"`. Selected style: `border: 2px solid var(--mat-sys-primary, #006a6a)` (Material indigo-pink default token referenced — replace with `{colors.primary}` when refactoring). 12px inner padding, 12px gap between cards.

**`ss-radio-card__body`** — `inline-flex` column for label + description.
**`ss-radio-card__label`** — `{typography.title-md}` (16px / 600 ink).
**`ss-radio-card__desc`** — `{typography.body-sm}` muted.
**`ss-radio-card__trailing`** — Right-aligned price or meta.

Used on `shipping-step` and `payment-step` (saved-card picker).

### Quantity Stepper
**`ss-stepper`** — Horizontal inline-flex group of `mat-icon-button` (minus) + value display + `mat-icon-button` (plus). Used on the cart page and catalog page line items. 4px radius corner-set, tabular figures for the count.

### Banner
**`ss-banner`** — Inline status banner with a tone modifier:
- `[data-tone='success']` — `{colors.success-soft}` background, success ink, `<mat-icon>check_circle</mat-icon>` in `{colors.success}`.
- `[data-tone='info']` — `{colors.primary-soft}` background.
- `[data-tone='warning']` — `{colors.warning-soft}` background.
- `[data-tone='error']` — `{colors.error-soft}` background.

Layout: 12×16px padding, 12px radius, icon + text body in a flex row. Used on the Jeddah-discount notice in `address-step`.

### Layout Primitives (`libs/ui/layout`)
**`ss-app-shell`** — Root container. Vertical flex, `min-height: 100vh`, slots for `[slot=nav]` and `[slot=footer]`.

**`ss-page-header`** — Page-title block. 24px / 600 ink title with `-0.2px` letter-spacing; optional 16px body description. 8px gap between title and description.

**`ss-empty-state`** — Centered empty-state. 56×24px padding, 16px gap, `text-align: center`. Title at 20px / 600 ink, description at body muted, max-width 480px. Used on cart-empty and catalog-zero-results.

### Feedback (`libs/ui/feedback`)
**`ToastService`** — Project's own toast state (signal-backed) consumed via `inline-banner` components. **For transient OS-level toasts use `MatSnackBar` instead** (see `docs/material/snack-bar.md`).

**`inline-banner`** — Same visual as `ss-banner` above; component-wrapped for the `ToastService` flow.

### Forms
**Form field** — Always `mat-form-field appearance="outline"`. White surface, 1px hairline outline at rest, 2px ink outline on focus. 56px height. `{typography.body-md}` for value, `{typography.caption}` muted for label. See `docs/material/form-field.md` and `docs/material/input.md`.

**Focus ring** — Global `:focus-visible` rule applies `2px solid var(--color-ink)` with `2px` offset. No blue glow. Applies to buttons, links, and any focusable element outside Material's own focus styling.

## Responsive Behavior

Breakpoints live in `apps/web/src/styles/_breakpoints.scss` as Sass mixins (`@include tablet`, `@include desktop`, `@include wide`).

| Name | Width | Mixin | Key Changes |
|---|---|---|---|
| Mobile | < 640px | (default) | Single column for all forms; `.ss-step__row` collapses to 1-col; product cards stack 1-up; nav collapses to logo + hamburger; step action bars stay side-by-side. |
| Tablet | ≥ 640px | `@include tablet` | `.ss-step__row` shows 2 columns; product cards 2-up; nav shows full link set. |
| Desktop | ≥ 1024px | `@include desktop` | Product cards 4-up; checkout pages cap at ~960px centered; sidebar account menu visible. |
| Wide | ≥ 1280px | `@include wide` | Content cap at 1280px; gutters absorb remainder. |

### Touch Targets
- Primary CTAs at minimum 48×48px hit area (`mat-flat-button` default).
- Icon buttons (`mat-icon-button`) at 40×40px — slightly under the 48px ideal but compensated by spacing.
- Form fields at 56px height — comfortable on mobile.

### Collapsing Strategy
- Form row grids drop column counts cleanly at 640px (`grid-template-columns: 1fr`).
- Step action bars (`.ss-step__actions`) keep `space-between` on mobile — never stack vertically.
- Account menu / currency picker dropdowns reposition to top-anchored sheets on mobile.

## Known Gaps & Design Debt

> See `docs/design-debt.md` for the full register. Highlights:

- **Two shadow recipes** (`{shadow.card}` vs `{shadow.floating}`). Use `{shadow.card}` for all new work; do not introduce `{shadow.floating}` on new components.
- **Legacy promo accent** (`{colors.accent-legacy}` — `#E5594A`) — restricted to `/promo` route only. Do not reintroduce in mainline.
- **Radius split** between `{rounded.xs}` (4px legacy cart/stepper) and `{rounded.sm}` (6px buttons/inputs). Future unification planned — when adding new components, **use `{rounded.sm}` for controls and `{rounded.md}` for surfaces**.
- **`libs/ui/forms`** is being deprecated in favor of native Material modules. New components should consume `@angular/material/*` directly (see `docs/material/README.md`). Do not import from `libs/ui/forms` in new code.
- **15px button-only font size** is a deliberate odd-step in the scale. Do not reuse for non-button surfaces.
- **Dark mode**: not in scope. All tokens assume a light canvas.
- **Material custom theme tokens** (`--mat-sys-primary`) currently leak in some component styles (e.g. `ss-radio-card--selected`). When refactoring those components, replace with `var(--color-primary)`.
- **Loading skeletons / shimmer states**: not defined. Empty states + spinners cover the gap for now.
- **Form validation error styling**: relies entirely on Material's `<mat-error>` defaults. No custom error-banner pattern unified across pages yet.

## Quick reference — token cheatsheet

```scss
// Most-used tokens in everyday work
color:           var(--color-ink);           // default text
background:      var(--color-canvas);        // default surface
border:          1px solid var(--color-hairline);
border-radius:   var(--rounded-sm);          // controls
border-radius:   var(--rounded-md);          // surfaces
padding:         var(--space-base);          // 16px standard
gap:             var(--space-sm);            // 8px between adjacent items
box-shadow:      var(--shadow-card);         // NEW components only
@include type.body-md;                       // default text
@include type.price;                         // any price number
@include type.button;                        // 15px buttons
@include tablet { ... }                      // ≥640px
@include desktop { ... }                     // ≥1024px
```
