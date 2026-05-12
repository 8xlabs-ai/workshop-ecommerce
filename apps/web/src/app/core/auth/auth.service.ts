import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import type { User } from '@shopstream/shared-types';
import { environment } from '../../../environments/environment.js';

interface AuthResponse {
  token: string;
  user: User;
}

const STORAGE_KEY = 'shopstream.auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _user = signal<User | null>(this.hydrateUser());
  private readonly _token = signal<string | null>(this.hydrateToken());

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBase}/auth/login`, { email, password })
      .pipe(tap((res) => this.persist(res)));
  }

  register(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBase}/auth/register`, input)
      .pipe(tap((res) => this.persist(res)));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._user.set(null);
    this._token.set(null);
  }

  private persist(res: AuthResponse): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
    this._user.set(res.user);
    this._token.set(res.token);
  }

  private hydrateToken(): string | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthResponse).token : null;
    } catch {
      return null;
    }
  }

  private hydrateUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthResponse).user : null;
    } catch {
      return null;
    }
  }
}
