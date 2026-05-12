import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../core/http/api.service.js';
import { AuthService } from '../core/auth/auth.service.js';
import { CartStore } from '../cart/cart.store.js';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price_cents: number;
  currency: string;
  thumbnail_url: string;
  in_stock: number;
}

@Component({
  selector: 'ss-product-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TitleCasePipe, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <section class="ss-detail">
      @if (product(); as p) {
        <div class="ss-detail__media">
          <img [src]="p.thumbnail_url" [alt]="p.title" />
        </div>
        <div class="ss-detail__body">
          <p class="ss-detail__category">{{ p.category | titlecase }}</p>
          <h1 class="ss-detail__title">{{ p.title }}</h1>
          <p class="ss-detail__price">{{ formatPrice(p.price_cents) }}</p>
          <p class="ss-detail__description">{{ p.description }}</p>
          @if (p.in_stock <= 3) {
            <p class="ss-detail__low-stock">Only {{ p.in_stock }} left in stock.</p>
          }
          @if (banner(); as b) {
            <mat-card class="ss-banner" [attr.data-tone]="b.tone">
              <mat-card-content>
                <mat-icon>{{ b.tone === 'success' ? 'check_circle' : b.tone === 'error' ? 'error' : 'info' }}</mat-icon>
                <div>
                  <strong>{{ b.title }}</strong>
                  <p>{{ b.body }}</p>
                </div>
              </mat-card-content>
            </mat-card>
          }
          <div class="ss-detail__actions">
            @if (lineFor(p.id); as line) {
              <div class="ss-stepper">
                <button mat-icon-button type="button" aria-label="Decrease" (click)="onQty(line.id, line.quantity - 1)">
                  <mat-icon>remove</mat-icon>
                </button>
                <span class="ss-stepper__value">{{ line.quantity }}</span>
                <button mat-icon-button type="button" aria-label="Increase" (click)="onQty(line.id, line.quantity + 1)">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
            } @else {
              <button mat-flat-button color="primary" type="button" (click)="addToCart(p)" [disabled]="adding()">
                @if (adding()) { Adding… } @else { Add to cart }
              </button>
            }
            <a routerLink="/">Back to shop</a>
          </div>
        </div>
      } @else if (notFound()) {
        <div class="ss-detail__empty">
          <h1>Product not found.</h1>
          <a routerLink="/">Back to shop</a>
        </div>
      } @else {
        <p>Loading…</p>
      }
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .ss-detail { max-width: 1040px; margin: 0 auto; padding: 32px 24px 56px; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
      .ss-detail__media { aspect-ratio: 1 / 1; border-radius: 8px; overflow: hidden; background: #f5f5f5; }
      .ss-detail__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .ss-detail__body { display: flex; flex-direction: column; gap: 16px; }
      .ss-detail__category { margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: rgba(0,0,0,0.6); }
      .ss-detail__title { margin: 0; font-size: 32px; font-weight: 700; line-height: 1.20; }
      .ss-detail__price { margin: 0; font-size: 22px; font-weight: 700; line-height: 1.20; font-variant-numeric: tabular-nums; }
      .ss-detail__description { margin: 0; color: rgba(0,0,0,0.7); }
      .ss-detail__low-stock { margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; color: #b45309; }
      .ss-detail__actions { margin-top: 8px; display: flex; gap: 16px; align-items: center; }
      .ss-detail__empty { grid-column: 1 / -1; padding: 56px 0; text-align: center; }
      .ss-banner mat-card-content { display: flex; gap: 12px; align-items: flex-start; padding: 12px; }
      .ss-banner p { margin: 4px 0 0; }
      .ss-banner[data-tone='success'] { background: #e7f5ec; }
      .ss-banner[data-tone='error'] { background: #fde2e2; }
      .ss-banner[data-tone='info'] { background: #e0f0ff; }
      .ss-stepper { display: inline-flex; align-items: center; gap: 4px; }
      .ss-stepper__value { min-width: 24px; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums; }
      @media (max-width: 1024px) { .ss-detail { grid-template-columns: 1fr; gap: 24px; } }
    `,
  ],
})
export class ProductDetailComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly cartStore = inject(CartStore);

  protected readonly product = signal<Product | null>(null);
  protected readonly notFound = signal(false);
  protected readonly banner = signal<{ tone: 'success' | 'info' | 'error'; title: string; body: string } | null>(null);
  protected readonly adding = this.cartStore.loading;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound.set(true);
      return;
    }
    this.api.get<Product>(`/catalog/products/${id}`).subscribe({
      next: (p) => this.product.set(p),
      error: () => this.notFound.set(true),
    });
  }

  formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  addToCart(p: Product): void {
    this.banner.set(null);
    if (!this.auth.isAuthenticated()) {
      this.banner.set({
        tone: 'info',
        title: 'Sign in to use your saved cart',
        body: 'Or check out as a guest — your items will be carried through the guest flow.',
      });
      return;
    }
    this.cartStore.addItem(p.id, 1);
    this.banner.set({ tone: 'success', title: 'Added to cart', body: `${p.title} is in your cart.` });
  }

  lineFor(productId: string) {
    return this.cartStore.cart()?.items.find((it) => it.productId === productId);
  }

  onQty(itemId: string, qty: number): void {
    this.cartStore.setQuantity(itemId, Math.max(0, qty));
  }
}
