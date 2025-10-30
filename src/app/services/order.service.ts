import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';
import { CartItem } from './cart.service';

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  address: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor() {
    this.loadOrders();
  }

  // โหลดคำสั่งซื้อจาก localStorage
  private loadOrders(): void {
    const saved = localStorage.getItem('orders');
    if (saved) {
      try {
        this.orders = JSON.parse(saved);
        // เรียงตามวันที่ล่าสุด
        this.orders.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } catch {
        this.orders = [];
      }
      this.ordersSubject.next(this.orders);
    }
  }

  // บันทึกลง localStorage
  private persist(): void {
    localStorage.setItem('orders', JSON.stringify(this.orders));
    this.ordersSubject.next([...this.orders]);
  }

  // สร้างคำสั่งซื้อใหม่
  createOrder(order: Omit<Order, 'id' | 'status' | 'createdAt'>): Order {
    const newOrder: Order = {
      id: Date.now(), // ใช้ timestamp เป็น ID
      ...order,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedDelivery: this.calculateEstimatedDelivery()
    };
    
    this.orders.unshift(newOrder); // เพิ่มที่ด้านบน (ล่าสุด)
    this.persist();
    
    console.log('🧾 Order created:', newOrder);
    return newOrder;
  }

  // ดึงคำสั่งซื้อทั้งหมด
  getOrders(): Order[] {
    return [...this.orders];
  }

  // ดึงคำสั่งซื้อตาม ID
  getOrderById(id: number): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  // อัพเดทสถานะคำสั่งซื้อ
  updateOrderStatus(
    id: number, 
    status: Order['status'], 
    trackingNumber?: string
  ): boolean {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      if (trackingNumber) {
        order.trackingNumber = trackingNumber;
      }
      this.persist();
      console.log(`📦 Order #${id} status updated to: ${status}`);
      return true;
    }
    return false;
  }

  // ยกเลิกคำสั่งซื้อ
  cancelOrder(id: number, notes?: string): boolean {
    const order = this.orders.find(o => o.id === id);
    if (order && this.canCancelOrder(order.status)) {
      order.status = 'cancelled';
      order.updatedAt = new Date().toISOString();
      if (notes) {
        order.notes = notes;
      }
      this.persist();
      console.log(`❌ Order #${id} cancelled`);
      return true;
    }
    return false;
  }

  // ตรวจสอบว่าสามารถยกเลิกได้หรือไม่
  canCancelOrder(status: Order['status']): boolean {
    return status === 'pending' || status === 'processing';
  }

  // ลบคำสั่งซื้อ (สำหรับ admin หรือคำสั่งซื้อที่ยกเลิกแล้ว)
  deleteOrder(id: number): boolean {
    const index = this.orders.findIndex(o => o.id === id);
    if (index >= 0) {
      this.orders.splice(index, 1);
      this.persist();
      console.log(`🗑️ Order #${id} deleted`);
      return true;
    }
    return false;
  }

  // คำนวณวันที่จัดส่งโดยประมาณ (3-5 วันทำการ)
  private calculateEstimatedDelivery(): string {
    const today = new Date();
    const deliveryDays = 5; // 5 วันทำการ
    let addedDays = 0;
    let currentDate = new Date(today);

    while (addedDays < deliveryDays) {
      currentDate.setDate(currentDate.getDate() + 1);
      const dayOfWeek = currentDate.getDay();
      // นับเฉพาะวันจันทร์-ศุกร์
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        addedDays++;
      }
    }

    return currentDate.toISOString();
  }

  // ดึงคำสั่งซื้อตามสถานะ
  getOrdersByStatus(status: Order['status']): Order[] {
    return this.orders.filter(o => o.status === status);
  }

  // ดึงคำสั่งซื้อล่าสุด
  getRecentOrders(limit: number = 5): Order[] {
    return this.orders.slice(0, limit);
  }

  // คำนวณยอดรวมทั้งหมด
  getTotalRevenue(): number {
    return this.orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }

  // นับจำนวนคำสั่งซื้อตามสถานะ
  getOrderCountByStatus(): { [key: string]: number } {
    return this.orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  // เคลียร์คำสั่งซื้อทั้งหมด (ใช้ระวัง!)
  clearAllOrders(): void {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคำสั่งซื้อทั้งหมด?')) {
      this.orders = [];
      this.persist();
      console.log('🗑️ All orders cleared');
    }
  }

  // Export คำสั่งซื้อเป็น JSON
  exportOrders(): string {
    return JSON.stringify(this.orders, null, 2);
  }

  // Import คำสั่งซื้อจาก JSON
  importOrders(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      if (Array.isArray(imported)) {
        this.orders = imported;
        this.persist();
        console.log(`✅ Imported ${imported.length} orders`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to import orders:', error);
      return false;
    }
  }

  // สร้างคำสั่งซื้อตัวอย่าง (สำหรับ demo)
  createSampleOrders(): void {
    const sampleOrders: Omit<Order, 'id' | 'status' | 'createdAt'>[] = [
      {
        items: [],
        total: 1299.00,
        paymentMethod: 'bank_transfer',
        address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
        estimatedDelivery: this.calculateEstimatedDelivery()
      },
      {
        items: [],
        total: 899.50,
        paymentMethod: 'cod',
        address: '456 ถนนพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310',
        estimatedDelivery: this.calculateEstimatedDelivery()
      }
    ];

    sampleOrders.forEach(order => this.createOrder(order));
    console.log('✅ Sample orders created');
  }
}