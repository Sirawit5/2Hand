import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth.service'; // <- ปรับ path ตามโปรเจกต์คุณ

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  // ใช้ observable แล้วไป async pipe ใน HTML จะอัปเดตทันที
  isLoggedIn$!: Observable<boolean>;
  username$!: Observable<string | null>;
  isAdmin$!: Observable<boolean>;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.auth.isLoggedIn;
    this.username$  = this.auth.username;
    this.isAdmin$   = this.auth.role.pipe(map(r => r === 'ADMIN'));
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }
}
