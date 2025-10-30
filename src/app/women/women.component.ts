import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product, ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { FavoritesService } from '../services/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-women',
  templateUrl: './women.component.html',
  styleUrls: ['./women.component.css'],
  standalone: false
})
export class WomenComponent implements OnInit {
  products: Product[] = [];
  displayed: Product[] = [];
  selectedSize = 'all';
  sortOrder: 'none' | 'asc' | 'desc' = 'none';
  savedIds = new Set<number>();
  private favSub?: Subscription;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private favService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts('women').subscribe(data => {
      this.products = data;
      this.applyFilters();
    });
    this.favSub = this.favService.favIds$.subscribe(ids => this.savedIds = new Set(ids || []));
  }

  ngOnDestroy(): void {
    this.favSub?.unsubscribe();
  }

  trackByProduct(_index: number, item: Product) {
    return item?.id;
  }

  applyFilters() {
    let list = [...this.products];
    if (this.selectedSize && this.selectedSize !== 'all') {
      list = list.filter(p => p.sizes && p.sizes.includes(this.selectedSize));
    }
    if (this.sortOrder === 'asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'desc') {
      list.sort((a, b) => b.price - a.price);
    }
    this.displayed = list;
  }

  addToCart(p: Product) {
    this.cartService.addToCart(p);
  }

  toggleSave(p: Product) {
    // optimistic UI update
    if (this.savedIds.has(p.id)) this.savedIds.delete(p.id); else this.savedIds.add(p.id);
    this.favService.toggle(p);
  }

  isSaved(p: Product) {
    return this.savedIds.has(p.id);
  }
}
