import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { FeatureFlagsService } from './feature-flags.service.js';

type FlagName = 'guest_checkout_enabled' | 'account_upsell_after_guest';

/**
 * Structural directive — renders content only when the named flag is on.
 *
 *     <a routerLink="/checkout/guest" *ffEnabled="'guest_checkout_enabled'">
 *       Continue as guest
 *     </a>
 *
 * Flags are read once when the input binding is evaluated. For workshop scope
 * this is sufficient; in production a hot-reload of flags would re-render
 * via a separate FeatureFlagsService observer hooked into ChangeDetector.
 */
@Directive({
  selector: '[ffEnabled]',
  standalone: true,
})
export class FfEnabledDirective {
  private readonly tpl = inject(TemplateRef<unknown>);
  private readonly vc = inject(ViewContainerRef);
  private readonly ff = inject(FeatureFlagsService);

  @Input() set ffEnabled(name: FlagName) {
    this.vc.clear();
    if (this.ff.isEnabled(name)) {
      this.vc.createEmbeddedView(this.tpl);
    }
  }
}
