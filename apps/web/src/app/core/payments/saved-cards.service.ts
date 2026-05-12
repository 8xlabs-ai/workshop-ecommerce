import { Injectable, computed, signal } from '@angular/core';
import type { SavedCard } from './card.types.js';

const STORAGE_KEY = 'ss.saved_cards.v1';

@Injectable({ providedIn: 'root' })
export class SavedCardsService {
  private readonly _cards = signal<SavedCard[]>(this.load());

  readonly cards = computed(() => this._cards());
  readonly hasCards = computed(() => this._cards().length > 0);

  add(card: SavedCard): void {
    const next = [...this._cards().filter((c) => c.id !== card.id), card];
    this._cards.set(next);
    this.persist(next);
  }

  remove(id: string): void {
    const next = this._cards().filter((c) => c.id !== id);
    this._cards.set(next);
    this.persist(next);
  }

  find(id: string): SavedCard | undefined {
    return this._cards().find((c) => c.id === id);
  }

  private load(): SavedCard[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as SavedCard[];
      if (!Array.isArray(parsed)) return [];
      let mutated = false;
      const migrated = parsed.map((c) => {
        if (c.token?.startsWith('tok_local_')) {
          mutated = true;
          const fixed = c.token.replace(/^tok_local_/, 'tok_test_local_');
          return { ...c, token: fixed, id: fixed };
        }
        return c;
      });
      if (mutated) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated)); } catch { /* noop */ }
      }
      return migrated;
    } catch {
      return [];
    }
  }

  private persist(cards: SavedCard[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch {
      /* quota exceeded or disabled — silent in workshop scope */
    }
  }
}
