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
  editMode = false;
  editedUser: any = {};

  constructor(
    private authService: AuthService,
    private favService: FavoritesService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
  this.user = this.authService.getCurrentUser();
  // ensure editedUser has fields we'll allow editing
  this.editedUser = { name: this.user?.username, email: this.user?.email, address: this.user?.address || '', phone: this.user?.phone || '' };
  this.saved = this.favService.getAll();
  this.orders = this.orderService.getOrders();
  // subscribe to changes (optional)
  this.favService.fav$.subscribe(list => this.saved = list);
  }

  enableEdit() {
    this.editMode = true;
    this.editedUser = { ...this.user, name: this.user?.username, email: this.user?.email, address: this.user?.address || '', phone: this.user?.phone || '' };
  }

  cancelEdit() {
    this.editMode = false;
  }

  saveProfile() {
    // update localStorage through auth service
    const toSave = { username: this.editedUser.name || this.editedUser.username, email: this.editedUser.email, address: this.editedUser.address, phone: this.editedUser.phone };
    this.authService.updateCurrentUser(toSave);
    this.user = this.authService.getCurrentUser();
    this.editMode = false;
  }

  toggleOrder(o: Order) {
    // add a UI helper flag to show/hide details
    (o as any)._open = !(o as any)._open;
  }

  isOrderOpen(o: Order) {
    return !!(o as any)._open;
  }

  orderOpenSymbol(o: Order) {
    return (o as any)._open ? '▲' : '▼';
  }

  removeSaved(id: number) {
    const fav = this.saved.find(x => x.product.id === id);
    if (fav) this.favService.toggle(fav.product);
  }
}
