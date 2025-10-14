import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-men',
  standalone: false,
  templateUrl: './men.component.html',
  styleUrls: ['./men.component.css']
})
export class MenComponent implements OnInit {
  products: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getProductsByCategory('Men').subscribe(
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
