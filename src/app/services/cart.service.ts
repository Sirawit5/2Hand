import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
price: any;
sizes: any;
name: any;
image: any;
  product: Product;
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

  addToCart(product: Product) {
    this.cartItems.push({
        product, addedAt: new Date().toISOString(),
        price: undefined,
        sizes: undefined,
        name: undefined,
        image: undefined
    });
    this.cartSubject.next([...this.cartItems]);
    this.persist();
  }

  removeFromCart(id: number) {
    this.cartItems = this.cartItems.filter(c => c.product.id !== id);
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
