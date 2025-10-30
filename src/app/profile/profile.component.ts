import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FavoritesService, FavoriteItem } from '../services/favorites.service';
import { OrderService, Order } from '../services/order.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: false,
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  saved: FavoriteItem[] = [];
  orders: Order[] = [];
  editMode = false;
  editedUser: any = {};

  constructor(
    private authService: AuthService,
    private favService: FavoritesService,
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.editedUser = { 
      name: this.user?.username, 
      email: this.user?.email, 
      address: this.user?.address || '', 
      phone: this.user?.phone || '' 
    };
    
    this.saved = this.favService.getAll();
    this.orders = this.orderService.getOrders();
    
    // Subscribe to changes
    this.favService.fav$.subscribe(list => this.saved = list);
  }

  enableEdit(): void {
    this.editMode = true;
    this.editedUser = { 
      ...this.user, 
      name: this.user?.username, 
      email: this.user?.email, 
      address: this.user?.address || '', 
      phone: this.user?.phone || '' 
    };
  }

  cancelEdit(): void {
    this.editMode = false;
  }

  saveProfile(): void {
    const toSave = { 
      username: this.editedUser.name || this.editedUser.username, 
      email: this.editedUser.email, 
      address: this.editedUser.address, 
      phone: this.editedUser.phone 
    };
    this.authService.updateCurrentUser(toSave);
    this.user = this.authService.getCurrentUser();
    this.editMode = false;
  }

  toggleOrder(o: Order): void {
    (o as any)._open = !(o as any)._open;
  }

  isOrderOpen(o: Order): boolean {
    return !!(o as any)._open;
  }

  orderOpenSymbol(o: Order): string {
    return (o as any)._open ? '▲' : '▼';
  }

  removeSaved(id: number): void {
    const fav = this.saved.find(x => x.product.id === id);
    if (fav) {
      if (confirm('คุณต้องการลบสินค้านี้ออกจากรายการโปรดหรือไม่?')) {
        this.favService.toggle(fav.product);
      }
    }
  }

  // Order status helpers
  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': '⏳ รอดำเนินการ',
      'processing': '📦 กำลังเตรียมสินค้า',
      'shipped': '🚚 กำลังจัดส่ง',
      'delivered': '✅ จัดส่งสำเร็จ',
      'cancelled': '❌ ยกเลิกแล้ว'
    };
    return statusMap[status] || '⏳ รอดำเนินการ';
  }

  getPaymentMethodText(method: string): string {
    const methodMap: { [key: string]: string } = {
      'bank_transfer': 'โอนเงินธนาคาร',
      'cod': 'ชำระเงินปลายทาง',
      'qr': 'สแกน QR Code',
      'credit_card': 'บัตรเครดิต'
    };
    return methodMap[method] || method;
  }

  getSubtotal(order: Order): number {
    return order.items.reduce((sum, item) => {
      return sum + (item.product.price * (item.quantity || 1));
    }, 0);
  }

  canCancelOrder(status: string): boolean {
    return status === 'pending' || status === 'processing';
  }

  reorder(order: Order): void {
    if (confirm('คุณต้องการสั่งซื้อสินค้าเหล่านี้อีกครั้งหรือไม่?')) {
      // เพิ่มสินค้าทั้งหมดลงตะกร้า
      order.items.forEach(item => {
        this.cartService.addToCart(item.product, item.quantity || 1, item.size);
      });
      alert('เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว');
      this.router.navigate(['/cart']);
    }
  }

  viewReceipt(order: Order): void {
    // TODO: Implement receipt view
    alert(`ดูใบเสร็จคำสั่งซื้อ #${order.id}`);
  }

  cancelOrder(order: Order): void {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคำสั่งซื้อนี้?')) {
      // TODO: Implement order cancellation
      alert(`ยกเลิกคำสั่งซื้อ #${order.id} สำเร็จ`);
      // Update order status
      order.status = 'cancelled';
    }
  }
}