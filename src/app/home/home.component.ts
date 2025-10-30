import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product, ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { FavoritesService } from '../services/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredProducts: Product[] = [];
  displayed: Product[] = [];
  savedIds = new Set<number>();
  private favSub?: Subscription;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private favService: FavoritesService
  ) {}

  ngOnInit(): void {
    // โหลดสินค้าแนะนำ (สินค้าที่มี sale หรือ new)
    this.productService.getProducts().subscribe(products => {
      this.featuredProducts = products
        .filter(p => p.sale || p.new)
        .slice(0, 8); // แสดง 8 ชิ้น
      this.displayed = this.featuredProducts;
    });

    // Subscribe favorites
    this.favSub = this.favService.favIds$.subscribe(ids => {
      this.savedIds = new Set(ids || []);
    });
  }

  ngOnDestroy(): void {
    this.favSub?.unsubscribe();
  }

  trackByProduct(_index: number, item: Product) {
    return item?.id;
  }

  toggleSave(product: Product) {
    if (this.savedIds.has(product.id)) {
      this.savedIds.delete(product.id);
    } else {
      this.savedIds.add(product.id);
    }
    this.favService.toggle(product);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}