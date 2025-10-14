import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-women',
  standalone: false,
  templateUrl: './women.component.html',
  styleUrls: ['./women.component.css']
})
export class WomenComponent implements OnInit {
  products: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getProductsByCategory('Women').subscribe(
      (response) => {
        this.products = response; // เก็บข้อมูลสินค้าที่ได้จาก API
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }

  buyProduct(product: any): void {
    console.log('Buying product:', product);
    // เพิ่มการดำเนินการที่ต้องการ เช่น การเพิ่มสินค้าลงในตะกร้าหรือไปที่หน้าชำระเงิน
  }
}
