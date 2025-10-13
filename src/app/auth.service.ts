import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // === state หลัก ===
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role')); // ✅ เพิ่ม role

  constructor() {}

  // === actions ===
  login(username: string, token: string, role: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);

    this.loggedIn.next(true);
    this.usernameSubject.next(username);
    this.roleSubject.next(role);
  }

  signOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    this.loggedIn.next(false);
    this.usernameSubject.next(null);
    this.roleSubject.next(null);
  }

  // === selectors (observables) ===
  get isLoggedIn() { return this.loggedIn.asObservable(); }
  get username()   { return this.usernameSubject.asObservable(); }
  get role()       { return this.roleSubject.asObservable(); }

  // === sync snapshot ถ้าจำเป็น ===
  get currentRole(): string | null { return this.roleSubject.value; }
}
