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
  errorMessage: string = '';     // ตัวแปรสำหรับเก็บข้อความแจ้งเตือน

  constructor(private apiService: ApiService, private router: Router) {}

  // ฟังก์ชันที่เรียกเมื่อผู้ใช้คลิกสมัคร
  signup(): void {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword // ส่ง confirmPassword ไปด้วย
    };

    this.apiService.signup(user).subscribe(
      (response) => {
        console.log('Signup successful:', response); // ค่าที่ได้รับจะเป็น JSON
        this.router.navigate(['/login']);  // เปลี่ยนหน้าไปที่ login page
      },
      (error) => {
        // ตรวจสอบข้อผิดพลาดที่เกิดจาก Backend
        if (error.status === 400) {
          this.errorMessage = error.error.message; // เก็บข้อความแจ้งเตือนจาก Backend
        } else {
          this.errorMessage = 'Something went wrong, please try again later.'; // ข้อความผิดพลาดทั่วไป
        }
        console.error('Error during signup:', error);
      }
    );
  }
}
