import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrlSignup = 'http://localhost:3000/api/signup';  // URL สำหรับ signup
  private apiUrlLogin = 'http://localhost:3000/api/login';    // URL สำหรับ login

  constructor(private http: HttpClient) { }

  // ฟังก์ชันสำหรับ signup
  signup(user: { username: string; email: string; password: string; confirmPassword: string }): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };  // ตั้งค่า Content-Type เป็น JSON
    return this.http.post<any>(this.apiUrlSignup, user, { headers });
  }

  // ฟังก์ชันสำหรับ login
  login(user: { username: string; password: string }): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };  // ตั้งค่า Content-Type เป็น JSON
    return this.http.post<any>(this.apiUrlLogin, user, { headers });
  }

  
}
