import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrlSignup = 'http://localhost:3000/api/signup';  // URL สำหรับ signup
  private apiUrlLogin = 'http://localhost:3000/api/login';    // URL สำหรับ login
  private apiUrlProducts = 'http://localhost:3000/api/products';  // URL สำหรับ API ที่เชื่อมกับ Backend

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

  // ฟังก์ชันเพิ่มสินค้า
  addProduct(product: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };  // ตั้งค่า Content-Type เป็น JSON
    return this.http.post<any>(this.apiUrlProducts, product, { headers });  // ส่ง POST request ไปที่ /api/products
  }

  // ฟังก์ชันดึงข้อมูลสินค้า
  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrlProducts);  // ดึงข้อมูลสินค้าทั้งหมดจาก /api/products
  }

  // ฟังก์ชันดึงข้อมูลสินค้าตามประเภท (category)
  getProductsByCategory(category: string): Observable<any> {
    // URL ปรับให้ใช้ category ใน URL (เช่น /api/products/Men)
    return this.http.get<any>(`${this.apiUrlProducts}/${category}`);  
  }
}
