import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { Product } from '../services/product.service';
import { AuthService } from '../services/auth.service';

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
    , private authService: AuthService
  ) {}

  ngOnInit(): void {
  // load cart items
  this.items = this.cartService.getCart();
  this.computeTotals();

    // prefer address from logged-in profile
    const user = this.authService.getCurrentUser();
    if (user) {
      // assume profile stored username/email/address/phone
      this.addressObj.line1 = user.address || user.line1 || '';
      this.addressObj.phone = user.phone || user.tel || user.phoneNumber || '';
      // allow city/postcode fields if present
      this.addressObj.city = user.city || '';
      this.addressObj.postcode = user.postcode || '';
    }

    // fallback to saved address from localStorage
    const saved = localStorage.getItem('shippingAddress');
    if (saved && !this.addressObj.line1) {
      try { this.addressObj = JSON.parse(saved); } catch { }
    }
  }

  // keep paymentMethod only; QR removed
  onSelectPayment(method: string) {
    this.paymentMethod = method;

  }

  updateQuantityFor(item: CartItem, newQty: number) {
    if (!item || !item.product) return;
    // clamp newQty to minimum 1
    const n = Math.max(1, Math.floor(Number(newQty) || 1));
    this.cartService.updateItem(item.product.id, n, item.size, item.size);
    // reload items and recompute totals
    this.items = this.cartService.getCart();
    this.computeTotals();
  }

  updateSizeFor(item: CartItem, newSize?: string) {
    if (!item || !item.product) return;
    // call updateItem with newSize and oldSize
    this.cartService.updateItem(item.product.id, item.quantity || 1, newSize, item.size);
    this.items = this.cartService.getCart();
    this.computeTotals();
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
    this.subtotal = this.items.reduce((s, c) => s + (c.product.price * (c.quantity || 1)), 0);
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

  // Return a single-line Thai-formatted address for display or QR payloads
  get thaiAddress(): string {
    const parts: string[] = [];
    if (this.addressObj.line1) parts.push(this.addressObj.line1);
    if (this.addressObj.line2) parts.push(this.addressObj.line2);
    const cityPart = [this.addressObj.city, this.addressObj.postcode].filter(Boolean).join(' ');
    if (cityPart) parts.push(cityPart);
    if (this.addressObj.phone) parts.push(`โทร ${this.addressObj.phone}`);
    // Join with comma and ensure Thai punctuation where appropriate
    return parts.join(', ');
  }

  // Build a public QR image URL encoding the Thai address and amount.
  get qrUrl(): string {
    try {
      const payload = this.thaiAddress || `ยอด: ${this.total}`;
      return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`;
    } catch (e) {
      return '';
    }
  }
}
