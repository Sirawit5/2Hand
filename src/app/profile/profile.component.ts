import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FavoritesService } from '../services/favorites.service';
import { OrderService, Order } from '../services/order.service';
import { Product } from '../services/product.service';
import { FavoriteItem } from '../services/favorites.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: false,
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  saved: FavoriteItem[] = [];
  orders: Order[] = [];

  constructor(
    private authService: AuthService,
    private favService: FavoritesService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
  this.user = this.authService.getCurrentUser();
  this.saved = this.favService.getAll();
  this.orders = this.orderService.getOrders();
  // subscribe to changes (optional)
  this.favService.fav$.subscribe(list => this.saved = list);
  }

  removeSaved(id: number) {
    const fav = this.saved.find(x => x.product.id === id);
    if (fav) this.favService.toggle(fav.product);
  }
}
