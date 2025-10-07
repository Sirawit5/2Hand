import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // สร้าง BehaviorSubject สำหรับเก็บสถานะการล็อกอิน
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));

  constructor() { }

  // ฟังก์ชันที่เช็คว่า token มีอยู่ใน localStorage หรือไม่
  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // ฟังก์ชันที่สมัครสมาชิกและล็อกอิน
  login(username: string, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    this.loggedIn.next(true);
    this.usernameSubject.next(username);
  }

  // ฟังก์ชันสำหรับออกจากระบบ
  signOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.loggedIn.next(false);
    this.usernameSubject.next(null);
  }

  // Observable สำหรับตรวจสอบสถานะการล็อกอิน
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  // Observable สำหรับชื่อผู้ใช้
  get username() {
    return this.usernameSubject.asObservable();
  }
}
