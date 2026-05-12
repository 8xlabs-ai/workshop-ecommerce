import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../core/auth/auth.service.js';

@Component({
  selector: 'ss-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  template: `
    <section class="ss-auth">
      <h1>Sign in</h1>
      @if (error()) {
        <mat-card class="ss-auth__error">
          <mat-card-content>
            <mat-icon>error</mat-icon>
            <div>
              <strong>We couldn't sign you in</strong>
              <p>{{ error() }}</p>
            </div>
          </mat-card-content>
        </mat-card>
      }
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" autocomplete="email" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password" autocomplete="current-password" />
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || pending()">Sign in</button>
      </form>
      <p>No account yet? <a routerLink="/account/register">Create one</a>.</p>
    </section>
  `,
  styles: [
    `
      .ss-auth { max-width: 420px; margin: 0 auto; padding: 56px 24px; display: flex; flex-direction: column; gap: 16px; }
      form { display: flex; flex-direction: column; gap: 8px; }
      mat-form-field { width: 100%; }
      .ss-auth__error mat-card-content { display: flex; align-items: flex-start; gap: 12px; padding: 12px; color: #b91c1c; }
      .ss-auth__error mat-icon { color: #b91c1c; }
      .ss-auth__error p { margin: 4px 0 0; }
    `,
  ],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  protected readonly pending = signal(false);
  protected readonly error = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) return;
    this.pending.set(true);
    this.error.set(null);
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/';
        this.router.navigateByUrl(redirect);
      },
      error: (err: { error?: { message?: string } }) => {
        this.pending.set(false);
        this.error.set(err.error?.message ?? 'Sign-in failed');
      },
    });
  }
}
