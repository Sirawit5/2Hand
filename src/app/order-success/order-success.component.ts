import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css'],
  standalone: false
})
export class OrderSuccessComponent implements OnInit {
  orderNumber: string = '';
  countdown: number = 5;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Generate random order number
    this.orderNumber = this.generateOrderNumber();
    
    // Auto redirect after 5 seconds (optional)
    // this.startCountdown();
  }

  generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${year}${month}${day}${random}`;
  }

  startCountdown(): void {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.router.navigate(['/']);
      }
    }, 1000);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  viewOrders(): void {
    this.router.navigate(['/profile']);
  }
}