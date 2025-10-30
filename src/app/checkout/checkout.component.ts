import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { AddressService, Address, SavedAddress } from '../services/address.service';

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

  // สำหรับแสดงรายการที่อยู่ที่บันทึกไว้
  savedAddresses: SavedAddress[] = [];
  selectedAddressId: number | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService,
    private addressService: AddressService
  ) {}

  ngOnInit(): void {
    // โหลดสินค้าในตะกร้า
    this.items = this.cartService.getCart();
    this.computeTotals();

    // โหลดที่อยู่ที่บันทึกไว้
    this.savedAddresses = this.addressService.getAllAddresses();

    // ใช้ที่อยู่หลักหรือที่อยู่ล่าสุด
    const defaultAddr = this.addressService.getDefaultAddress();
    const lastUsedAddr = this.addressService.getLastUsedAddress();
    
    if (defaultAddr) {
      this.loadAddress(defaultAddr);
      this.selectedAddressId = defaultAddr.id;
    } else if (lastUsedAddr) {
      this.loadAddress(lastUsedAddr);
      this.selectedAddressId = lastUsedAddr.id;
    } else {
      // ลองดึงจาก user profile
      const user = this.authService.getCurrentUser();
      if (user) {
        this.addressObj.line1 = user.address || '';
        this.addressObj.phone = user.phone || '';
        this.addressObj.city = user.city || '';
        this.addressObj.postcode = user.postcode || '';
      }
    }

    // โหลด payment method ที่ใช้ล่าสุด
    const lastPayment = localStorage.getItem('lastPaymentMethod');
    if (lastPayment) {
      this.paymentMethod = lastPayment;
    }
  }

  // โหลดที่อยู่ที่เลือก
  loadAddress(address: SavedAddress | Address): void {
    this.addressObj = {
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      postcode: address.postcode,
      phone: address.phone
    };
  }

  // เปลี่ยนที่อยู่ที่เลือก
  onAddressSelect(addressId: number): void {
    const address = this.savedAddresses.find(a => a.id === addressId);
    if (address) {
      this.loadAddress(address);
      this.selectedAddressId = addressId;
    }
  }

  onSelectPayment(method: string): void {
    this.paymentMethod = method;
    // จำ payment method ที่เลือก
    localStorage.setItem('lastPaymentMethod', method);
  }

  updateQuantityFor(item: CartItem, newQty: number): void {
    if (!item || !item.product) return;
    const n = Math.max(1, Math.floor(Number(newQty) || 1));
    this.cartService.updateItem(item.product.id, n, item.size, item.size);
    this.items = this.cartService.getCart();
    this.computeTotals();
  }

  updateSizeFor(item: CartItem, newSize?: string): void {
    if (!item || !item.product) return;
    this.cartService.updateItem(item.product.id, item.quantity || 1, newSize, item.size);
    this.items = this.cartService.getCart();
    this.computeTotals();
  }

  confirmOrder(): void {
    // ตรวจสอบข้อมูล
    if (!this.paymentMethod) {
      alert('กรุณาเลือกช่องทางการชำระเงิน');
      return;
    }
    
    if (!this.addressObj.line1) {
      alert('กรุณากรอกที่อยู่จัดส่ง');
      return;
    }

    if (!this.addressObj.phone) {
      alert('กรุณากรอกเบอร์โทรศัพท์');
      return;
    }

    // สร้างคำสั่งซื้อ
    const orderTotal = this.subtotal + this.shipping + this.marketplaceFee;
    this.orderService.createOrder({
      items: this.items,
      total: orderTotal,
      paymentMethod: this.paymentMethod,
      address: this.thaiAddress
    });

    // บันทึกที่อยู่ (ถ้ายังไม่มีในระบบ)
    if (!this.selectedAddressId) {
      this.addressService.saveAddress(this.addressObj, 'ที่อยู่จัดส่ง', this.savedAddresses.length === 0);
    }

    // เคลียร์ตะกร้า
    this.cartService.clearCart();

    // ไปหน้าสำเร็จ
    this.router.navigate(['/order-success']);
  }

  computeTotals(): void {
    this.subtotal = this.items.reduce((s, c) => s + (c.product.price * (c.quantity || 1)), 0);
    this.marketplaceFee = 0;
    this.total = this.subtotal + this.shipping + this.marketplaceFee;
  }

  setShipping(value: number): void {
    this.shipping = value || 0;
    this.computeTotals();
  }

  editAddress(): void {
    this.editingAddress = true;
  }

  saveAddress(): void {
    if (!this.addressObj.line1) {
      alert('กรุณากรอกที่อยู่');
      return;
    }

    // ถ้าเป็นการแก้ไขที่อยู่ที่มีอยู่
    if (this.selectedAddressId) {
      this.addressService.updateAddress(this.selectedAddressId, this.addressObj);
    } else {
      // บันทึกที่อยู่ใหม่
      const newAddr = this.addressService.saveAddress(
        this.addressObj, 
        'ที่อยู่จัดส่ง', 
        this.savedAddresses.length === 0
      );
      this.selectedAddressId = newAddr.id;
      this.savedAddresses = this.addressService.getAllAddresses();
    }

    this.editingAddress = false;
  }

  deleteSelectedAddress(): void {
    if (this.selectedAddressId && confirm('คุณต้องการลบที่อยู่นี้หรือไม่?')) {
      this.addressService.deleteAddress(this.selectedAddressId);
      this.savedAddresses = this.addressService.getAllAddresses();
      this.selectedAddressId = null;
      this.addressObj = { line1: '' };
    }
  }

  // ที่อยู่แบบบรรทัดเดียว
  get thaiAddress(): string {
    const parts: string[] = [];
    if (this.addressObj.line1) parts.push(this.addressObj.line1);
    if (this.addressObj.line2) parts.push(this.addressObj.line2);
    const cityPart = [this.addressObj.city, this.addressObj.postcode].filter(Boolean).join(' ');
    if (cityPart) parts.push(cityPart);
    if (this.addressObj.phone) parts.push(`โทร ${this.addressObj.phone}`);
    return parts.join(', ');
  }

  // QR URL
  get qrUrl(): string {
    try {
      const payload = `ยอดชำระ: ${this.total.toFixed(2)} บาท\n${this.thaiAddress}`;
      return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`;
    } catch (e) {
      return '';
    }
  }
}