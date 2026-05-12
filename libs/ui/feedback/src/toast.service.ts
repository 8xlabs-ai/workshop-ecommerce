import { Injectable, signal } from '@angular/core';
import type { BannerTone } from './inline-banner.component.js';

export interface Toast {
  id: number;
  message: string;
  tone: BannerTone;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  private nextId = 1;

  readonly toasts = this._toasts.asReadonly();

  show(message: string, tone: BannerTone = 'info', timeoutMs = 4000): void {
    const id = this.nextId++;
    this._toasts.update((list) => [...list, { id, message, tone }]);
    if (timeoutMs > 0) {
      setTimeout(() => this.dismiss(id), timeoutMs);
    }
  }

  dismiss(id: number): void {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
