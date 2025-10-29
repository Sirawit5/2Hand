import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  username: string;
  password: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    { username: 'manager', password: '1234', email: 'manager@test.com' },
    { username: 'customer', password: '1234', email: 'customer@test.com' }
  ];

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  register(username: string, password: string, email: string): boolean {
    const userExists = this.users.some(u => u.username === username);
    if (userExists) {
      return false;
    }
    this.users.push({ username, password, email });
    return true;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}
