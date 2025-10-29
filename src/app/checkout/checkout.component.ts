import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { Product } from '../services/product.service';

interface Address {
  line1: string;
  line2?: string;
  city?: string;
  postcode?: string;
  phone?: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: false
})
export class CheckoutComponent implements OnInit {
  paymentMethod = '';
  addressObj: Address = { line1: '' };
  editingAddress = false;
  items: CartItem[] = [];
  subtotal = 0;
  shipping = 0;
  marketplaceFee = 0;
  total = 0;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
  // load cart items
  this.items = this.cartService.getCart();
  this.computeTotals();

    // try to load saved address from localStorage
    const saved = localStorage.getItem('shippingAddress');
    if (saved) {
      try { this.addressObj = JSON.parse(saved); } catch { }
    }
  }

  confirmOrder() {
    if (!this.paymentMethod || !this.addressObj.line1) return alert('กรุณากรอกข้อมูลให้ครบ');
    const items = this.cartService.getCart();
    const orderTotal = this.subtotal + this.shipping + this.marketplaceFee;
    this.orderService.createOrder({
      items,
      total: orderTotal,
      paymentMethod: this.paymentMethod,
      address: `${this.addressObj.line1} ${this.addressObj.line2 || ''} ${this.addressObj.city || ''} ${this.addressObj.postcode || ''} ${this.addressObj.phone || ''}`.trim()
    });
    this.cartService.clearCart();
    // optionally save address
    localStorage.setItem('shippingAddress', JSON.stringify(this.addressObj));
    this.router.navigate(['/order-success']);
  }

  computeTotals() {
    this.subtotal = this.items.reduce((s, c) => s + c.product.price, 0);
    // marketplaceFee could be a percent; for now fixed 0
    this.marketplaceFee = 0;
    this.total = this.subtotal + this.shipping + this.marketplaceFee;
  }

  setShipping(value: number) {
    this.shipping = value || 0;
    this.computeTotals();
  }

  editAddress() {
    this.editingAddress = true;
  }

  saveAddress() {
    this.editingAddress = false;
    localStorage.setItem('shippingAddress', JSON.stringify(this.addressObj));
  }
}
