import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  standalone: false,
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(event: Event) {
    event.preventDefault();
    const success = this.authService.login(this.username, this.password);
    if (success) {
      alert('Login successful!');
      this.router.navigate(['/home']);
    } else {
      alert('Invalid username or password!');
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
