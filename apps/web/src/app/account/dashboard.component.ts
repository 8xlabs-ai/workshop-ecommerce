import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../core/auth/auth.service.js';

@Component({
  selector: 'ss-account-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <section class="ss-account">
      <header class="ss-account__head">
        <span class="ss-account__avatar" aria-hidden="true">{{ initials() }}</span>
        <div>
          <h1 class="ss-account__name">{{ fullName() }}</h1>
          <p class="ss-account__email">{{ auth.user()?.email }}</p>
        </div>
      </header>

      <div class="ss-account__cards">
        <mat-card class="ss-account__card" routerLink="/account/orders" tabindex="0">
          <mat-card-header>
            <mat-icon mat-card-avatar>receipt_long</mat-icon>
            <mat-card-title>Orders</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>View past purchases, shipment status, and order details.</p>
          </mat-card-content>
        </mat-card>
        <mat-card class="ss-account__card" routerLink="/cart" tabindex="0">
          <mat-card-header>
            <mat-icon mat-card-avatar>shopping_cart</mat-icon>
            <mat-card-title>Cart</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Review items in your cart and proceed to checkout.</p>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="ss-account__actions">
        <button mat-stroked-button type="button" (click)="signOut()">
          <mat-icon>logout</mat-icon>
          Sign out
        </button>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .ss-account { max-width: 880px; margin: 0 auto; padding: 32px 24px 56px; display: flex; flex-direction: column; gap: 32px; }
      .ss-account__head { display: flex; align-items: center; gap: 16px; }
      .ss-account__avatar {
        width: 56px; height: 56px;
        border-radius: 9999px;
        background: var(--mat-sys-primary, #006a6a);
        color: var(--mat-sys-on-primary, #fff);
        font-size: 20px; font-weight: 700;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .ss-account__name { margin: 0; font-size: 24px; font-weight: 700; }
      .ss-account__email { margin: 2px 0 0; color: rgba(0,0,0,0.6); }

      .ss-account__cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .ss-account__card { cursor: pointer; transition: transform 120ms ease, box-shadow 120ms ease; }
      .ss-account__card:hover { transform: translateY(-2px); }
      .ss-account__card mat-card-content p { margin: 0; color: rgba(0,0,0,0.6); }

      .ss-account__actions { display: flex; justify-content: flex-start; }

      @media (max-width: 640px) { .ss-account__cards { grid-template-columns: 1fr; } }
    `,
  ],
})
export class AccountDashboardComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected initials(): string {
    const u = this.auth.user();
    if (!u) return '';
    return `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase();
  }

  protected fullName(): string {
    const u = this.auth.user();
    return u ? `${u.firstName} ${u.lastName}` : '';
  }

  signOut(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
