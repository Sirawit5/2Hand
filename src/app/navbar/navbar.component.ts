import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string | null = null;
  isLoggedIn: boolean = false;
  private loginStatusSubject = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) { }

  ngOnInit(): void {
    // ตรวจสอบสถานะการล็อกอินจาก localStorage ทุกครั้งที่หน้าโหลด
    this.checkLoginStatus();
    
    // ใช้ BehaviorSubject เพื่อฟังการเปลี่ยนแปลงสถานะ
    this.loginStatusSubject.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.username = localStorage.getItem('username');  // ดึง username จาก localStorage
    });
  }

  // ฟังก์ชันเพื่อตรวจสอบสถานะการล็อกอินจาก localStorage
  checkLoginStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('token');  // ถ้ามี token แสดงว่า login แล้ว
    this.username = localStorage.getItem('username');  // ดึง username จาก localStorage

    // ส่งสถานะการล็อกอินให้ BehaviorSubject
    this.loginStatusSubject.next(this.isLoggedIn);
  }

  // ฟังก์ชันสำหรับการ Sign Out
  signOut(): void {
    // ลบข้อมูลจาก localStorage เมื่อออกจากระบบ
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    this.isLoggedIn = false;  // ตั้งค่า isLoggedIn เป็น false
    this.username = null;  // ล้างข้อมูลชื่อผู้ใช้
    this.router.navigate(['/login']);  // เปลี่ยนไปหน้า Login

    // เรียก checkLoginStatus อีกครั้งหลังจาก Sign Out
    this.checkLoginStatus();
  }
}
