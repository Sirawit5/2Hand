import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: false,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  username = '';
  searchQuery = '';
  cartCount = 0;
  private cartSub?: Subscription;

  constructor(private authService: AuthService, private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.isLoggedIn = true;
      this.username = user.username;
    }
    // subscribe to cart count
    this.cartSub = this.cartService.cart$.subscribe(items => {
      this.cartCount = items.length;
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.username = '';
    this.router.navigate(['/login']);
  }

  onSearch() {
    const q = (this.searchQuery || '').trim();
    if (!q) {
      return;
    }
    this.router.navigate(['/search'], { queryParams: { q } });
    // Optionally clear input: this.searchQuery = '';
  }

  ngOnDestroy(): void {
    if (this.cartSub) this.cartSub.unsubscribe();
  }
}
