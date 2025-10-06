import { Component } from '@angular/core';
import { ApiService } from '../api.service';  // Import ApiService
import { Router } from '@angular/router';    // ใช้สำหรับการเปลี่ยนหน้า

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';

  constructor(private apiService: ApiService, private router: Router) { }

  // ฟังก์ชันที่เรียกเมื่อผู้ใช้คลิกเข้าสู่ระบบ
  login(): void {
    const user = { username: this.username, password: this.password };

    this.apiService.login(user).subscribe(
      (response) => {
        console.log('Login successful:', response);
        // เก็บ token เพื่อใช้ในการเข้าถึงข้อมูลที่ต้องการสิทธิ์
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']);  // เปลี่ยนหน้าไปที่หน้า home หรือหน้า dashboard
      },
      (error) => {
        console.error('Error during login:', error);
      }
    );
  }

  // ฟังก์ชันที่ไปหน้า signup
  goToSignup(): void {
    this.router.navigate(['/sign-up']);
  }
}
