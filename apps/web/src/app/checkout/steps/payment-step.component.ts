import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { SavedCardsService } from '../../core/payments/saved-cards.service.js';
import {
  brandLabel,
  detectBrand,
  formatCardNumberInput,
  formatExpiryInput,
  generateLocalToken,
  last4Of,
  parseExpiry,
} from '../../core/payments/card-utils.js';
import { injectCheckoutStore } from '../checkout.store.js';

const NEW_CARD_VALUE = '__new__';

@Component({
  selector: 'ss-payment-step',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
  ],
  template: `
    <div class="ss-step">
      <h2 class="ss-step__title">Payment</h2>

      @if (savedOptions().length > 1) {
        <p class="ss-step__hint">Choose a saved card or enter a new one.</p>
        <mat-radio-group [formControl]="selection" aria-label="Saved cards" class="ss-radio-group">
          @for (opt of savedOptions(); track opt.value) {
            <mat-card class="ss-radio-card" [class.ss-radio-card--selected]="selection.value === opt.value">
              <mat-card-content>
                <mat-radio-button [value]="opt.value">
                  <div class="ss-radio-card__body">
                    <span class="ss-radio-card__label">{{ opt.label }}</span>
                    <span class="ss-radio-card__desc">{{ opt.description }}</span>
                  </div>
                </mat-radio-button>
              </mat-card-content>
            </mat-card>
          }
        </mat-radio-group>
      }

      @if (showNewCardForm()) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="ss-step__form">
          <mat-form-field appearance="outline">
            <mat-label>Card number</mat-label>
            <input matInput formControlName="number" inputmode="numeric" autocomplete="cc-number" (input)="onNumberInput($event)" />
            @if (brandHint()) { <mat-hint>{{ brandHint() }}</mat-hint> }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Cardholder name</mat-label>
            <input matInput formControlName="holder" autocomplete="cc-name" />
          </mat-form-field>

          <div class="ss-step__row">
            <mat-form-field appearance="outline">
              <mat-label>Expiry (MM/YY)</mat-label>
              <input matInput formControlName="expiry" inputmode="numeric" autocomplete="cc-exp" (input)="onExpiryInput($event)" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>CVV</mat-label>
              <input matInput formControlName="cvv" inputmode="numeric" autocomplete="cc-csc" />
            </mat-form-field>
          </div>

          <mat-checkbox [formControl]="save">Save this card for future orders</mat-checkbox>

          <div class="ss-step__actions">
            <button mat-stroked-button type="button" (click)="back()">Back</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Review order</button>
          </div>
        </form>
      } @else {
        <div class="ss-step__actions">
          <button mat-stroked-button type="button" (click)="back()">Back</button>
          <button mat-flat-button color="primary" type="button" [disabled]="!selection.value || selection.value === NEW_CARD" (click)="onUseSavedCard()">Review order</button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ss-step { display: flex; flex-direction: column; gap: 16px; }
      .ss-step__title { margin: 0 0 8px; font-size: 24px; font-weight: 600; }
      .ss-step__hint { margin: 0; font-size: 14px; color: rgba(0,0,0,0.6); }
      .ss-step__form { display: flex; flex-direction: column; gap: 8px; }
      .ss-step__row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .ss-step__actions { margin-top: 16px; display: flex; justify-content: space-between; }
      mat-form-field { width: 100%; }
      .ss-radio-group { display: flex; flex-direction: column; gap: 8px; }
      .ss-radio-card mat-card-content { padding: 12px 16px; }
      .ss-radio-card__body { display: inline-flex; flex-direction: column; }
      .ss-radio-card__label { font-weight: 600; }
      .ss-radio-card__desc { font-size: 13px; color: rgba(0,0,0,0.6); }
      .ss-radio-card--selected { border: 2px solid var(--mat-sys-primary, #006a6a); }
      @media (max-width: 640px) { .ss-step__row { grid-template-columns: 1fr; } }
    `,
  ],
})
export class PaymentStepComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = injectCheckoutStore();
  private readonly router = inject(Router);
  private readonly savedCards = inject(SavedCardsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly NEW_CARD = NEW_CARD_VALUE;

  protected readonly selection = new FormControl<string>(
    this.savedCards.hasCards() ? this.savedCards.cards()[0].id : NEW_CARD_VALUE,
    { nonNullable: true },
  );

  protected readonly save = new FormControl<boolean>(false, { nonNullable: true });

  protected readonly form = this.fb.nonNullable.group({
    number: ['', [Validators.required, Validators.minLength(12)]],
    holder: ['', [Validators.required, Validators.minLength(2)]],
    expiry: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  protected readonly savedOptions = computed(() => {
    const cards = this.savedCards.cards();
    return [
      ...cards.map((c) => ({
        value: c.id,
        label: `${brandLabel(c.brand)} •••• ${c.last4}`,
        description: `Exp ${String(c.expMonth).padStart(2, '0')}/${String(c.expYear).slice(-2)} · ${c.holderName}`,
      })),
      { value: NEW_CARD_VALUE, label: 'Use a new card', description: 'Enter new card details' },
    ];
  });

  private readonly selectionSignal = signal(this.selection.value);

  protected readonly showNewCardForm = computed(
    () => !this.savedCards.hasCards() || this.selectionSignal() === NEW_CARD_VALUE,
  );

  protected readonly brandHint = signal('');

  constructor() {
    this.selection.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => this.selectionSignal.set(v));
  }

  onNumberInput(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const formatted = formatCardNumberInput(target.value);
    target.value = formatted;
    this.form.controls.number.setValue(formatted, { emitEvent: false });
    const brand = detectBrand(formatted);
    this.brandHint.set(brand === 'card' ? '' : brandLabel(brand));
  }

  onExpiryInput(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const formatted = formatExpiryInput(target.value);
    target.value = formatted;
    this.form.controls.expiry.setValue(formatted, { emitEvent: false });
  }

  back(): void {
    this.router.navigate(['/checkout/shipping']);
  }

  onUseSavedCard(): void {
    const id = this.selection.value;
    if (!id || id === NEW_CARD_VALUE) return;
    const card = this.savedCards.find(id);
    if (!card) return;
    this.store.setPaymentToken(card.token);
    this.router.navigate(['/checkout/review']);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const digits = raw.number.replace(/\D/g, '');
    const expiry = parseExpiry(raw.expiry);
    if (!expiry) return;
    const token = generateLocalToken();

    if (this.save.value) {
      this.savedCards.add({
        id: token,
        brand: detectBrand(digits),
        last4: last4Of(digits),
        expMonth: expiry.month,
        expYear: expiry.year,
        holderName: raw.holder,
        token,
      });
    }

    this.store.setPaymentToken(token);
    this.router.navigate(['/checkout/review']);
  }
}
