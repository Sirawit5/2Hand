import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-men',
  templateUrl: './men.component.html',
  styleUrls: ['./men.component.css'],
  standalone: false
})
export class MenComponent implements OnInit {
  products: Product[] = [];
  displayed: Product[] = [];
  selectedSize = 'all';
  sortOrder: 'none' | 'asc' | 'desc' = 'none';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private favService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts('men').subscribe(data => {
      this.products = data;
      this.applyFilters();
    });
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
    this.favService.toggle(p);
  }

  isSaved(p: Product) {
    return this.favService.isSaved(p.id);
  }
}
