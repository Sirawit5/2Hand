import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product, ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { FavoritesService } from '../services/favorites.service';
import { Subscription } from 'rxjs';

interface CategorySizes {
  [key: string]: string[];
}

@Component({
  selector: 'app-kids',
  templateUrl: './kids.component.html',
  styleUrls: ['./kids.component.css'],
  standalone: false
})
export class KidsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  displayed: Product[] = [];
  selectedCategory = 'all';
  selectedSize = 'all';
  sortOrder: 'none' | 'asc' | 'desc' = 'none';
  savedIds = new Set<number>();
  availableSizes: string[] = [];
  
  private favSub?: Subscription;
  
  // กำหนดขนาดตามหมวดหมู่สำหรับเด็ก
  private categorySizes: CategorySizes = {
    'all': ['2Y', '3Y', '4Y', '5Y', '6Y', '8Y', '10Y', '12Y', 'XS', 'S', 'M'],
    'tops': ['2Y', '3Y', '4Y', '5Y', '6Y', '8Y', '10Y', '12Y', 'XS', 'S', 'M'],
    'pants': ['2Y', '3Y', '4Y', '5Y', '6Y', '8Y', '10Y', '12Y', 'XS', 'S', 'M'],
    'dresses': ['2Y', '3Y', '4Y', '5Y', '6Y', '8Y', '10Y', '12Y', 'XS', 'S'],
    'shoes': ['25', '26', '27', '28', '29', '30', '31', '32', '33', '34']
  };

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private favService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts('kids').subscribe(data => {
      this.products = data;
      this.updateAvailableSizes();
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

  onCategoryChange() {
    this.updateAvailableSizes();
    this.selectedSize = 'all';
    this.applyFilters();
  }

  updateAvailableSizes() {
    this.availableSizes = this.categorySizes[this.selectedCategory] || [];
  }

  applyFilters() {
    let list = [...this.products];
    
    // กรองตามหมวดหมู่ย่อย
    if (this.selectedCategory && this.selectedCategory !== 'all') {
      list = list.filter(p => p.subcategory === this.selectedCategory);
    }
    
    // กรองตามขนาด
    if (this.selectedSize && this.selectedSize !== 'all') {
      list = list.filter(p => p.sizes && p.sizes.includes(this.selectedSize));
    }
    
    // เรียงลำดับ
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
    if (this.savedIds.has(p.id)) {
      this.savedIds.delete(p.id);
    } else {
      this.savedIds.add(p.id);
    }
    this.favService.toggle(p);
  }

  isSaved(p: Product) {
    return this.savedIds.has(p.id);
  }
}