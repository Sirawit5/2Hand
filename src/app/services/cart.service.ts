import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  addedAt: string; // ISO timestamp
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cartSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try { this.cartItems = JSON.parse(saved); } catch { this.cartItems = []; }
      this.cartSubject.next(this.cartItems);
    }
  }

  private persist() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  addToCart(product: Product, quantity: number = 1, size?: string) {
    // if same product+size exists, increase quantity
    const existing = this.cartItems.find(c => c.product.id === product.id && c.size === size);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity, size, addedAt: new Date().toISOString() });
    }
    this.cartSubject.next([...this.cartItems]);
    this.persist();
  }

  removeFromCart(id: number) {
    this.cartItems = this.cartItems.filter(c => c.product.id !== id);
    this.cartSubject.next([...this.cartItems]);
    this.persist();
  }

  /** Update quantity for specific product (and optional size). If quantity <= 0 remove item. */
  updateQuantity(productId: number, quantity: number, size?: string) {
    const idx = this.cartItems.findIndex(c => c.product.id === productId && c.size === size);
    if (idx === -1) return;
    // enforce minimum quantity of 1
    const q = Math.max(1, Math.floor(Number(quantity) || 1));
    this.cartItems[idx].quantity = q;
    this.cartSubject.next([...this.cartItems]);
    this.persist();
  }

  /** Update an item's quantity and/or size. If newSize differs and another entry exists for the newSize, merge them. */
  updateItem(productId: number, quantity: number, newSize?: string, oldSize?: string) {
    // find the existing item by oldSize (if provided) otherwise by productId
    const idx = this.cartItems.findIndex(c => c.product.id === productId && (oldSize === undefined || c.size === oldSize));
    if (idx === -1) return;

    // if newSize provided and different, check for an existing target slot
    if (newSize && newSize !== this.cartItems[idx].size) {
      const target = this.cartItems.find(c => c.product.id === productId && c.size === newSize);
      if (target) {
        // merge quantities and enforce min 1
        const addQ = Math.max(1, Math.floor(Number(quantity) || 1));
        target.quantity = (target.quantity || 0) + addQ;
        // remove old
        this.cartItems.splice(idx, 1);
      } else {
        // change size on the existing item, enforce min 1
        const q = Math.max(1, Math.floor(Number(quantity) || 1));
        this.cartItems[idx].size = newSize;
        this.cartItems[idx].quantity = q;
      }
    } else {
      // same size (or no size change) - enforce min 1
      const q = Math.max(1, Math.floor(Number(quantity) || 1));
      this.cartItems[idx].quantity = q;
    }

    this.cartSubject.next([...this.cartItems]);
    this.persist();
  }

  clearCart() {
    this.cartItems = [];
    this.cartSubject.next([]);
    this.persist();
  }

  getCart(): CartItem[] {
    return [...this.cartItems];
  }
}
