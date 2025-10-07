import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string | null = null;
  isLoggedIn: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // ตรวจสอบสถานะการล็อกอินจาก localStorage
    this.isLoggedIn = !!localStorage.getItem('token');
    this.username = localStorage.getItem('username');
  }

  // ฟังก์ชันสำหรับการ Sign Out
  signOut(): void {
    // ลบข้อมูลจาก localStorage เมื่อออกจากระบบ
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    this.isLoggedIn = false;  // ตั้งค่า isLoggedIn เป็น false
    this.router.navigate(['/login']);  // เปลี่ยนไปหน้า Login
  }
}
