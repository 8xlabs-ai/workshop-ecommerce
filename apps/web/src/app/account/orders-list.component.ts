import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { formatMoney, type Order } from '@shopstream/shared-types';
import { ApiService } from '../core/http/api.service.js';

@Component({
  selector: 'ss-orders-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, TitleCasePipe],
  template: `
    <section class="ss-orders">
      <header class="ss-orders__head">
        <h1>Orders</h1>
        <a routerLink="/account" class="ss-text-link">← Back to account</a>
      </header>

      @if (loading()) {
        <p>Loading…</p>
      } @else if (error()) {
        <p class="ss-orders__error">{{ error() }}</p>
      } @else if (orders().length === 0) {
        <div class="ss-orders__empty">
          <p>No orders yet — <a routerLink="/" class="ss-text-link">start shopping</a>.</p>
        </div>
      } @else {
        <ul class="ss-orders__list">
          @for (o of orders(); track o.id) {
            <li>
              <a [routerLink]="['/orders', o.id]" class="ss-orders__row">
                <div class="ss-orders__col">
                  <p class="ss-orders__id">#{{ shortId(o.id) }}</p>
                  <p class="ss-orders__date">{{ o.placedAt | date: 'mediumDate' }}</p>
                </div>
                <div class="ss-orders__col ss-orders__col--items">
                  <p>{{ o.cartSnapshot.items.length }} item(s)</p>
                </div>
                <div class="ss-orders__col">
                  <span class="ss-orders__status" [attr.data-status]="o.status">{{ o.status | titlecase }}</span>
                </div>
                <div class="ss-orders__col ss-orders__col--amount">
                  <p class="ss-orders__amount">{{ formatMoney(o.amount) }}</p>
                </div>
              </a>
            </li>
          }
        </ul>
      }
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .ss-orders { max-width: 880px; margin: 0 auto; padding: 32px 24px 56px; display: flex; flex-direction: column; gap: 24px; }
      .ss-orders__head { display: flex; align-items: baseline; justify-content: space-between; }
      .ss-orders__head h1 { margin: 0; font-size: 28px; font-weight: 700; }

      .ss-orders__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
      .ss-orders__row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr auto;
        gap: 16px;
        align-items: center;
        padding: 16px 20px;
        background: var(--color-canvas);
        border: 1px solid var(--color-hairline);
        border-radius: var(--rounded-md);
        text-decoration: none;
        color: var(--color-ink);
        transition: border-color 120ms ease;
      }
      .ss-orders__row:hover { border-color: var(--color-ink); }
      .ss-orders__col { display: flex; flex-direction: column; gap: 2px; }
      .ss-orders__col--amount { text-align: right; }
      .ss-orders__id { margin: 0; font-weight: 600; }
      .ss-orders__date { margin: 0; font-size: 13px; color: var(--color-muted); }
      .ss-orders__status {
        display: inline-block;
        padding: 2px 10px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
        background: var(--color-surface-soft);
        color: var(--color-ink);
      }
      .ss-orders__status[data-status='delivered'] { background: var(--color-success-soft, #d8f3df); color: var(--color-success, #1a7a4c); }
      .ss-orders__status[data-status='cancelled'] { background: var(--color-error-soft, #fde2e2); color: var(--color-error, #b91c1c); }
      .ss-orders__amount { margin: 0; font-weight: 700; font-variant-numeric: tabular-nums; }

      .ss-orders__empty { padding: 40px 0; text-align: center; color: var(--color-body); }
      .ss-orders__error { color: var(--color-error, #b91c1c); }

      @media (max-width: 640px) {
        .ss-orders__row { grid-template-columns: 1fr 1fr; }
        .ss-orders__col--items { display: none; }
      }
    `,
  ],
})
export class OrdersListComponent implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly orders = signal<Order[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly formatMoney = formatMoney;

  ngOnInit(): void {
    this.api.get<Order[]>('/orders').subscribe({
      next: (list) => {
        this.orders.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load orders.');
        this.loading.set(false);
      },
    });
  }

  shortId(id: string): string {
    return id.slice(0, 8);
  }
}
