import { Component } from '@angular/core';
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

  constructor(private router: Router) { }

  // ฟังก์ชันที่เรียกเมื่อผู้ใช้คลิก login
  login(): void {
    const user = { username: this.username, password: this.password };
    
    // สมมติว่า login สำเร็จแล้ว
    // เปลี่ยนหน้าไปยัง Home หรือที่ต้องการ
    this.router.navigate(['/home']);
  }

  // ฟังก์ชันที่ไปหน้า signup
  goToSignup(): void {
    this.router.navigate(['/sign-up']);
  }
}
