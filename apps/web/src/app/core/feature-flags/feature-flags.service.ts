import { Injectable, computed, signal } from '@angular/core';

type FlagName = 'guest_checkout_enabled' | 'account_upsell_after_guest';

/**
 * Front-end mirror of the server-side flag system.
 * In production, the page bootstrap injects flag values from a `<meta>` tag
 * or a `/api/config` call. For the workshop, all flags are seeded OFF.
 *
 * Read with `ff.isEnabled('flag_name')` or via the `*ffEnabled` directive in templates.
 */
@Injectable({ providedIn: 'root' })
export class FeatureFlagsService {
  // Workshop default — production hydrates from a `/api/config` call wired
  // into APP_INITIALIZER. Flipped on here so the local dev server matches the
  // BE flag set via FF_GUEST_CHECKOUT_ENABLED=true.
  private readonly _flags = signal<Record<FlagName, boolean>>({
    guest_checkout_enabled: true,
    account_upsell_after_guest: false,
  });

  readonly flags = this._flags.asReadonly();
  readonly guestCheckoutEnabled = computed(() => this._flags().guest_checkout_enabled);

  isEnabled(name: FlagName): boolean {
    return this._flags()[name] === true;
  }

  /** Bootstrap helper — called from `app.config` after fetching server-side flags. */
  hydrate(values: Partial<Record<FlagName, boolean>>): void {
    this._flags.update((current) => ({ ...current, ...values }));
  }
}
