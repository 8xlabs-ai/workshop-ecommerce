import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { formatMoney, isGuestOrder, type Order, type GuestOrder } from '@shopstream/shared-types';
import { ApiService } from '../core/http/api.service.js';
import { AuthService } from '../core/auth/auth.service.js';

@Component({
  selector: 'ss-order-confirmation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="ss-confirm">
      @if (order(); as o) {
        <div class="ss-confirm__badge" aria-hidden="true">✓</div>
        <h1>Thanks{{ greeting() }}.</h1>
        <p class="ss-confirm__sub">Order <code>{{ o.id }}</code> is placed.</p>
        <p class="ss-confirm__amount">{{ formatMoney(o.amount) }}</p>
        <a routerLink="/" class="ss-text-link">Back to shop</a>
      } @else if (error()) {
        <h1>We couldn't find that order.</h1>
        <p>{{ error() }}</p>
      } @else {
        <p>Loading…</p>
      }
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .ss-confirm {
        max-width: 640px;
        margin: 0 auto;
        padding: 56px 24px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }
      .ss-confirm__badge {
        width: 56px; height: 56px;
        border-radius: 9999px;
        background: var(--color-success-soft);
        color: var(--color-success);
        font-size: 24px;
        font-weight: 700;
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 12px;
      }
      .ss-confirm h1 { margin: 0; font-size: 32px; font-weight: 700; }
      .ss-confirm__sub { margin: 0; color: var(--color-body); }
      .ss-confirm__amount { margin: 8px 0; font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; }
    `,
  ],
})
export class OrderConfirmationComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);

  protected readonly order = signal<Order | GuestOrder | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly greeting = computed(() => {
    const o = this.order();
    if (!o) return '';
    if (this.auth.user()) return `, ${this.auth.user()!.firstName}`;
    if (o && isGuestOrder(o)) {
      // Guest — no first name reachable on order; greet by first name on shipping address.
      const first = o.shippingAddress.fullName.split(' ')[0];
      return first ? `, ${first}` : '';
    }
    return '';
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const email = this.route.snapshot.queryParamMap.get('email');
    if (!id) {
      this.error.set('Missing order id');
      return;
    }

    const opts = email
      ? { params: { email }, skipAuth: !this.auth.isAuthenticated() }
      : {};
    this.api.get<Order>(`/orders/${id}`, opts).subscribe({
      next: (o) => this.order.set(o),
      error: (err: { error?: { message?: string } }) =>
        this.error.set(err.error?.message ?? 'Could not load order.'),
    });
  }

  protected formatMoney = formatMoney;
}
