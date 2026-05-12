import { loadEnv } from '../config/env.js';
import { logger } from './logger.js';

type FlagName = 'guest_checkout_enabled' | 'account_upsell_after_guest';

interface Context {
  userId?: string;
  ip?: string;
}

class FeatureFlags {
  private flags: Record<FlagName, boolean> = this.read();

  private read(): Record<FlagName, boolean> {
    const env = loadEnv();
    return {
      guest_checkout_enabled: env.FF_GUEST_CHECKOUT_ENABLED,
      account_upsell_after_guest: env.FF_ACCOUNT_UPSELL_AFTER_GUEST,
    };
  }

  /**
   * Server-side flag check. Pass context if the flag becomes user-scoped
   * (rollout cohort, geographic gate, etc.) — current implementation
   * is global, but the signature is forward-compatible.
   */
  isEnabled(name: FlagName, _context?: Context): boolean {
    return this.flags[name] === true;
  }

  /** SIGHUP-triggered hot-reload from env. */
  reload(): void {
    this.flags = this.read();
    logger.info({ flags: this.flags }, 'feature flags reloaded');
  }
}

export const featureFlags = new FeatureFlags();

process.on('SIGHUP', () => featureFlags.reload());
