import { HttpClient, HttpHeaders, type HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.js';

interface RequestOptions {
  params?: HttpParams | Record<string, string | number | boolean>;
  skipAuth?: boolean;
}

interface ClientOptions {
  params?: HttpParams | Record<string, string | number | boolean>;
  headers?: HttpHeaders;
}

/**
 * The single front-door for ALL HTTP from the Angular app.
 * Components must not import HttpClient directly — they go through here.
 *
 * The `skipAuth: true` flag is the contract for guest endpoints — it tells
 * the auth interceptor not to attach the JWT.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  get<T>(path: string, opts: RequestOptions = {}): Observable<T> {
    return this.http.get<T>(this.url(path), this.clientOptions(opts));
  }

  post<T>(path: string, body: unknown, opts: RequestOptions = {}): Observable<T> {
    return this.http.post<T>(this.url(path), body, this.clientOptions(opts));
  }

  patch<T>(path: string, body: unknown, opts: RequestOptions = {}): Observable<T> {
    return this.http.patch<T>(this.url(path), body, this.clientOptions(opts));
  }

  delete<T>(path: string, opts: RequestOptions = {}): Observable<T> {
    return this.http.delete<T>(this.url(path), this.clientOptions(opts));
  }

  private url(path: string): string {
    return path.startsWith('http') ? path : `${environment.apiBase}${path}`;
  }

  /** Build options object only with the fields that have values — avoids
   * the `exactOptionalPropertyTypes` mismatch with Angular's HttpClient overloads. */
  private clientOptions(opts: RequestOptions): ClientOptions {
    const out: ClientOptions = {};
    if (opts.params !== undefined) out.params = opts.params;
    if (opts.skipAuth) out.headers = new HttpHeaders({ 'X-Skip-Auth': '1' });
    return out;
  }
}
