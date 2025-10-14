import { Component } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-admin-page',
  standalone: false,
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {
  product = {
    name: '',
    category: '',
    price: 0,
    image_url: '',
    description: ''
  };

  constructor(private apiService: ApiService) {}

  // ฟังก์ชันเพื่อเพิ่มสินค้า
  addProduct() {
    this.apiService.addProduct(this.product).subscribe(
      response => {
        console.log('Product added:', response);
        alert('Product added successfully');
        
        // รีเซ็ตฟอร์มหลังจากเพิ่มสินค้า
        this.product = { name: '', category: '', price: 0, image_url: '', description: '' };
      },
      error => {
        console.error('Error adding product:', error);
        alert('Failed to add product');
      }
    );
  }


}
