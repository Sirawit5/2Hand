import { Component } from '@angular/core';
import { ApiService } from '../api.service';  // Import ApiService
import { Router } from '@angular/router';    // ใช้สำหรับการเปลี่ยนหน้า

@Component({
  selector: 'app-signup-page',
  standalone: false,
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css'],
})
export class SignupPageComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';  // เพิ่มตัวแปรนี้

  constructor(private apiService: ApiService, private router: Router) {}

  // ฟังก์ชันที่เรียกเมื่อผู้ใช้คลิกสมัคร
  signup(): void {
  const user = { username: this.username, email: this.email, password: this.password };

  this.apiService.signup(user).subscribe(
    (response) => {
      console.log('Signup successful:', response); // ค่าที่ได้รับจะเป็น JSON
      this.router.navigate(['/login']);  // เปลี่ยนหน้าไปที่ login page
    },
    (error) => {
      console.error('Error during signup:', error);
    }
  );
}

}
