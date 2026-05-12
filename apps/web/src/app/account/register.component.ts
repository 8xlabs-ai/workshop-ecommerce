import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../core/auth/auth.service.js';

@Component({
  selector: 'ss-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <section class="ss-auth">
      <h1>Create account</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>First name</mat-label>
          <input matInput formControlName="firstName" autocomplete="given-name" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Last name</mat-label>
          <input matInput formControlName="lastName" autocomplete="family-name" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" autocomplete="email" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password" autocomplete="new-password" />
          <mat-hint>At least 8 characters.</mat-hint>
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || pending()">Create account</button>
      </form>
      <p>Already have one? <a routerLink="/account/login">Sign in</a>.</p>
    </section>
  `,
  styles: [
    `
      .ss-auth { max-width: 420px; margin: 0 auto; padding: 56px 24px; display: flex; flex-direction: column; gap: 16px; }
      form { display: flex; flex-direction: column; gap: 8px; }
      mat-form-field { width: 100%; }
    `,
  ],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  protected readonly pending = signal(false);

  submit(): void {
    if (this.form.invalid) return;
    this.pending.set(true);
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.pending.set(false),
    });
  }
}
