import { Component } from '@angular/core';

@Component({
  selector: 'app-order-success',
  standalone: false,
  template: `
  <app-navbar></app-navbar>
    <div class="success">
      <h2>✅ ยืนยันคำสั่งซื้อสำเร็จ</h2>
      <p>ขอบคุณที่สั่งซื้อสินค้ากับเรา!</p>
      <a routerLink="/home">กลับไปหน้าแรก</a>
    </div>
  `,
  styles: [`
    .success {
      text-align: center;
      padding: 50px;
    }
  `]
})
export class OrderSuccessComponent {}
