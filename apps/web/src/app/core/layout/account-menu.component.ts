import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service.js';
import { SsAccountIcon, SsChevronDownIcon } from './icons.js';

@Component({
  selector: 'ss-account-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SsAccountIcon, SsChevronDownIcon],
  template: `
    @if (auth.isAuthenticated()) {
      <button
        type="button"
        class="ss-acct__trigger"
        [attr.aria-expanded]="open()"
        aria-haspopup="menu"
        (click)="toggle()"
      >
        <span class="ss-acct__avatar" aria-hidden="true">{{ initials() }}</span>
        <span class="ss-acct__hello">Hi, {{ auth.user()?.firstName ?? '' }}</span>
        <ss-chevron-down-icon />
      </button>

      @if (open()) {
        <div class="ss-acct__menu" role="menu">
          <div class="ss-acct__identity">
            <p class="ss-acct__name">{{ fullName() }}</p>
            <p class="ss-acct__email">{{ auth.user()?.email }}</p>
          </div>
          <hr class="ss-acct__rule" />
          <a routerLink="/account" class="ss-acct__item" role="menuitem" (click)="close()">Account</a>
          <a routerLink="/account/orders" class="ss-acct__item" role="menuitem" (click)="close()">Orders</a>
          <button type="button" class="ss-acct__item ss-acct__item--btn" role="menuitem" (click)="signOut()">
            Sign out
          </button>
        </div>
      }
    } @else {
      <a routerLink="/account/login" class="ss-acct__signin">
        <ss-account-icon />
        <span>Sign in</span>
      </a>
    }
  `,
  styles: [
    `
      :host { position: relative; display: inline-flex; }

      .ss-acct__trigger {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 6px 10px;
        background: transparent;
        border: 1px solid transparent;
        border-radius: var(--rounded-sm);
        color: var(--color-ink);
        cursor: pointer;
        font: inherit;
        font-size: 14px;
        font-weight: 500;
      }
      .ss-acct__trigger:hover { border-color: var(--color-hairline); }
      .ss-acct__avatar {
        width: 28px; height: 28px;
        border-radius: 9999px;
        background: var(--color-primary);
        color: var(--color-on-primary);
        font-size: 12px; font-weight: 700; line-height: 1;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .ss-acct__hello { white-space: nowrap; }
      .ss-acct__trigger ss-chevron-down-icon { --ss-icon-size: 14px; color: var(--color-muted); }

      .ss-acct__menu {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        width: 240px;
        background: var(--color-canvas);
        border: 1px solid var(--color-hairline);
        border-radius: var(--rounded-md);
        box-shadow: var(--shadow-floating);
        padding: 8px 0;
        z-index: 50;
        display: flex;
        flex-direction: column;
      }
      .ss-acct__identity {
        padding: 8px 16px 12px;
      }
      .ss-acct__name { margin: 0 0 2px; font-size: 16px; font-weight: 600; color: var(--color-ink); }
      .ss-acct__email { margin: 0; font-size: 14px; color: var(--color-muted); }
      .ss-acct__rule { border: none; border-top: 1px solid var(--color-hairline); margin: 4px 0; }

      .ss-acct__item {
        padding: 10px 16px;
        font-size: 14px;
        color: var(--color-ink);
        text-decoration: none;
        background: transparent;
        border: none;
        text-align: left;
        cursor: pointer;
        font: inherit;
      }
      .ss-acct__item:hover { background: var(--color-surface-soft); }
      .ss-acct__item--btn { font-weight: 500; }

      .ss-acct__signin {
        display: inline-flex; align-items: center; gap: 6px;
        color: var(--color-ink);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        padding: 6px 8px;
      }
      .ss-acct__signin:hover { text-decoration: underline; text-underline-offset: 2px; }
      .ss-acct__signin ss-account-icon { --ss-icon-size: 20px; }
    `,
  ],
})
export class AccountMenuComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly open = signal(false);

  protected initials(): string {
    const u = this.auth.user();
    if (!u) return '';
    return `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase();
  }

  protected fullName(): string {
    const u = this.auth.user();
    return u ? `${u.firstName} ${u.lastName}` : '';
  }

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }

  signOut(): void {
    this.close();
    this.auth.logout();
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent): void {
    if (!this.open()) return;
    if (!this.host.nativeElement.contains(ev.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.open()) this.close();
  }
}
