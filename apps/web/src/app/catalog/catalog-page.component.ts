import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../core/http/api.service.js';
import { AuthService } from '../core/auth/auth.service.js';
import { CartStore } from '../cart/cart.store.js';

interface ProductSummary {
  id: string;
  title: string;
  price_cents: number;
  currency: string;
  thumbnail_url: string;
}

interface ListResponse {
  page: number;
  pageSize: number;
  total: number;
  items: ProductSummary[];
}

@Component({
  selector: 'ss-catalog-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <section class="ss-catalog">
      <header class="ss-catalog__head">
        <h1>Shop</h1>
        <p>Hand-finished home goods, apparel, and small electronics.</p>
      </header>

      <div class="ss-catalog__grid">
        @for (p of products(); track p.id) {
          <article class="ss-product-card">
            <a [routerLink]="['/products', p.id]" class="ss-product-card__media">
              <img [src]="p.thumbnail_url" [alt]="p.title" loading="lazy" />
            </a>
            <h2 class="ss-product-card__title">{{ p.title }}</h2>
            <p class="ss-product-card__price">{{ formatPrice(p.price_cents) }}</p>
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
              <button mat-flat-button color="primary" type="button" (click)="addToCart(p)">Add to cart</button>
            }
          </article>
        }
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .ss-catalog { max-width: 1200px; margin: 0 auto; padding: 32px 24px 56px; display: flex; flex-direction: column; gap: 32px; }
      .ss-catalog__head h1 { margin: 0 0 8px; font-size: 32px; font-weight: 700; }
      .ss-catalog__head p { margin: 0; color: rgba(0,0,0,0.6); }

      .ss-catalog__grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }
      @media (max-width: 1024px) { .ss-catalog__grid { grid-template-columns: repeat(3, 1fr); } }
      @media (max-width: 640px)  { .ss-catalog__grid { grid-template-columns: repeat(2, 1fr); } }

      .ss-product-card { display: flex; flex-direction: column; gap: 8px; }
      .ss-product-card__media { aspect-ratio: 1 / 1; overflow: hidden; border-radius: 8px; background: #f5f5f5; }
      .ss-product-card__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .ss-product-card__title { margin: 4px 0 0; font-size: 16px; font-weight: 600; }
      .ss-product-card__price { margin: 0; font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums; }
      .ss-stepper { display: inline-flex; align-items: center; gap: 4px; }
      .ss-stepper__value { min-width: 24px; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums; }
    `,
  ],
})
export class CatalogPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cartStore = inject(CartStore);
  protected readonly products = signal<ProductSummary[]>([]);

  ngOnInit(): void {
    this.api.get<ListResponse>('/catalog/products', { params: { pageSize: 24 } }).subscribe((res) => {
      this.products.set(res.items);
    });
  }

  formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  addToCart(p: ProductSummary): void {
    if (!this.auth.isAuthenticated()) {
      this.snackBar.open('Sign in or check out as a guest to add items.', 'Dismiss', { duration: 4000 });
      this.router.navigate(['/account/login'], { queryParams: { redirect: '/cart' } });
      return;
    }
    this.cartStore.addItem(p.id, 1);
    this.snackBar.open(`${p.title} added to cart`, 'Dismiss', { duration: 3000 });
  }

  lineFor(productId: string) {
    return this.cartStore.cart()?.items.find((it) => it.productId === productId);
  }

  onQty(itemId: string, qty: number): void {
    this.cartStore.setQuantity(itemId, Math.max(0, qty));
  }
}
