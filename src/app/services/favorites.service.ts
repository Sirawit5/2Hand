import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

export interface FavoriteItem {
  product: Product;
  likedAt: string; // ISO timestamp
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private favItems: FavoriteItem[] = [];
  private favSubject = new BehaviorSubject<FavoriteItem[]>([]);
  fav$ = this.favSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      try { this.favItems = JSON.parse(saved); } catch { this.favItems = []; }
      this.favSubject.next(this.favItems);
    }
  }

  private persist() {
    localStorage.setItem('favorites', JSON.stringify(this.favItems));
  }

  toggle(product: Product) {
    const idx = this.favItems.findIndex(p => p.product.id === product.id);
    if (idx >= 0) {
      this.favItems.splice(idx, 1);
    } else {
      this.favItems.push({ product, likedAt: new Date().toISOString() });
    }
    this.favSubject.next([...this.favItems]);
    this.persist();
  }

  isSaved(id: number) {
    return !!this.favItems.find(p => p.product.id === id);
  }

  getAll(): FavoriteItem[] {
    return [...this.favItems];
  }
}
