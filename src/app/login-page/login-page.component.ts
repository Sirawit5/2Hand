import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // ปรับ path ตามโปรเจกต์

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private auth: AuthService
  ) {}

  login(): void {
    const user = { username: this.username, password: this.password };

    this.apiService.login(user).subscribe(
      (response) => {
        // ✅ อัปเดตสถานะผ่าน AuthService
        this.auth.login(response.username, response.token, response.role);

        // ✅ เปลี่ยนหน้าไปที่ Home หลัง login สำเร็จ
        this.router.navigate(['/home']);  // ปรับ redirect ไปหน้า home เท่านั้น
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Login failed: Incorrect username or password');
      }
    );
  }

  goToSignup(): void {
    this.router.navigate(['/sign-up']);
  }
}
