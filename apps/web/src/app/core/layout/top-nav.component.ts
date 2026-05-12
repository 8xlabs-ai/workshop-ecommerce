import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service.js';
import { CartStore } from '../../cart/cart.store.js';
import { AccountMenuComponent } from './account-menu.component.js';
import { SsCartIcon } from './icons.js';

@Component({
  selector: 'ss-top-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, AccountMenuComponent, SsCartIcon],
  template: `
    <header class="ss-top-nav" role="banner">
      <div class="ss-top-nav__inner">
        <a routerLink="/" class="ss-top-nav__wordmark" aria-label="ShopStream — home">ShopStream</a>
        <nav class="ss-top-nav__categories" aria-label="Browse">
          <a routerLink="/" routerLinkActive="ss-top-nav__cat--active" [routerLinkActiveOptions]="{ exact: true }">Shop</a>
          <a routerLink="/sale" routerLinkActive="ss-top-nav__cat--active">Sale</a>
          <a routerLink="/new" routerLinkActive="ss-top-nav__cat--active">New</a>
        </nav>
        <div class="ss-top-nav__actions">
          <ss-account-menu />
          <a routerLink="/cart" class="ss-top-nav__cart" aria-label="Cart">
            <ss-cart-icon />
            @if (count() > 0) {
              <span class="ss-top-nav__badge" [attr.aria-label]="count() + ' items in cart'">{{ count() }}</span>
            }
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .ss-top-nav {
        height: 64px;
        background: var(--color-canvas);
        border-bottom: 1px solid var(--color-hairline);
      }
      .ss-top-nav__inner {
        max-width: 1200px;
        margin: 0 auto;
        height: 100%;
        padding: 0 24px;
        display: flex; align-items: center; gap: 24px;
      }
      .ss-top-nav__wordmark {
        font-size: 20px; font-weight: 700; color: var(--color-ink); text-decoration: none;
      }
      .ss-top-nav__categories { display: flex; gap: 24px; }
      .ss-top-nav__categories a {
        font-size: 15px;
        font-weight: 500;
        line-height: 1.25;
        color: var(--color-muted);
        text-decoration: none;
        padding: 4px 0;
        border-bottom: 2px solid transparent;
      }
      .ss-top-nav__categories a.ss-top-nav__cat--active {
        color: var(--color-ink);
        border-bottom-color: var(--color-primary);
      }

      .ss-top-nav__actions {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .ss-top-nav__cart {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        color: var(--color-ink);
        text-decoration: none;
        border-radius: var(--rounded-sm);
      }
      .ss-top-nav__cart:hover { background: var(--color-surface-soft); }
      .ss-top-nav__cart ss-cart-icon { --ss-icon-size: 22px; }

      .ss-top-nav__badge {
        position: absolute;
        top: 4px;
        right: 4px;
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        background: var(--color-primary);
        color: var(--color-on-primary);
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
        border-radius: 9999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-variant-numeric: tabular-nums;
      }

      @media (max-width: 640px) {
        .ss-top-nav { height: 56px; }
        .ss-top-nav__categories { display: none; }
      }
    `,
  ],
})
export class TopNavComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly cartStore = inject(CartStore);

  protected readonly count = this.cartStore.itemCount;

  constructor() {
    // Re-load when auth flips (login → cart appears; logout → reset).
    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.cartStore.load();
      } else {
        this.cartStore.clear();
      }
    });
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.cartStore.load();
    }
  }
}
