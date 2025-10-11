import { Component } from '@angular/core';
import { ApiService } from '../api.service';  // Import ApiService สำหรับติดต่อกับ API
import { Router } from '@angular/router';  // ใช้สำหรับการเปลี่ยนหน้า

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';  // ตัวแปรสำหรับเก็บข้อความ error

  constructor(private apiService: ApiService, private router: Router) { }

  login(): void {
    const user = { username: this.username, password: this.password };

    console.log('Attempting login with:', user);  // ล็อกข้อมูลที่ใช้ login

    this.apiService.login(user).subscribe(
      (response) => {
        console.log('Response from login API:', response);  // ตรวจสอบค่าที่ได้รับจาก API

        // เก็บข้อมูลใน localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);  // เก็บ username ใน localStorage

        // ตรวจสอบว่าเก็บข้อมูลใน localStorage ได้หรือไม่
        console.log('Stored token in localStorage:', localStorage.getItem('token'));
        console.log('Stored username in localStorage:', localStorage.getItem('username'));

        // เปลี่ยนหน้าไปยัง Home หรือที่ต้องการ
        this.router.navigate(['/home']);

        // เมื่อ login สำเร็จ เรียก checkLoginStatus เพื่อให้ Navbar อัปเดต
        setTimeout(() => {
          this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/home']);
          });
        }, 500);
      },
      (error) => {
        console.error('Login failed:', error);  // ล็อกข้อผิดพลาดที่เกิดขึ้น
        alert('Login failed: Incorrect username or password');
      }
    );
  }

  // ฟังก์ชันที่ไปหน้า signup
  goToSignup(): void {
    this.router.navigate(['/sign-up']);
  }
}
