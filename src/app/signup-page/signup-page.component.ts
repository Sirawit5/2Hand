import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup-page',
  standalone: false,
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSignup(event: Event) {
    event.preventDefault();

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const success = this.authService.register(this.username, this.password, this.email);
    if (success) {
      alert('Registration successful!');
      this.router.navigate(['/login']);
    } else {
      alert('Username already exists!');
    }
  }
}
