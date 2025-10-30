import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: false
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;

  constructor(
    private cartService: CartService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(data => {
      this.items = data;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.total = this.items.reduce((sum, item) => {
      return sum + (item.product.price * (item.quantity || 1));
    }, 0);
  }

  removeItem(id: number): void {
    this.cartService.removeFromCart(id);
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) return;
    item.quantity = quantity;
    this.calculateTotal();
  }

  incrementQuantity(item: CartItem): void {
    item.quantity = (item.quantity || 1) + 1;
    this.calculateTotal();
  }

  decrementQuantity(item: CartItem): void {
    if ((item.quantity || 1) > 1) {
      item.quantity = (item.quantity || 1) - 1;
      this.calculateTotal();
    }
  }

  checkout(): void {
    if (this.items.length === 0) return;
    this.router.navigate(['/checkout']);
  }
}