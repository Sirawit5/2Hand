import { Injectable } from '@angular/core';
import { Product } from './product.service';
import { CartItem } from './cart.service';

export interface Order {
  id: number;
  items: CartItem[]; // preserve when items were added
  total: number;
  paymentMethod: string;
  address: string;
  status: 'pending' | 'success';
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];

  createOrder(order: Omit<Order, 'id' | 'status'>) {
    const newOrder: Order = {
      id: this.orders.length + 1,
      ...order,
      status: 'success'
    };
    this.orders.push(newOrder);
    console.log('🧾 Order created:', newOrder);
  }

  getOrders() {
    return this.orders;
  }
}
