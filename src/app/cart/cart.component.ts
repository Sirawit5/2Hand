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

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(data => {
      this.items = data;
      this.total = this.items.reduce((sum, c) => sum + (c.product.price * (c.quantity || 1)), 0);
    });
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
