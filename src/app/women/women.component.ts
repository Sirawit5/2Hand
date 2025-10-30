// women.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product, ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { FavoritesService } from '../services/favorites.service';
import { Subscription } from 'rxjs';

interface CategorySizes {
  [key: string]: string[];
}

@Component({
  selector: 'app-women',
  templateUrl: './women.component.html',
  styleUrls: ['./women.component.css'],
  standalone: false
})
export class WomenComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  displayed: Product[] = [];
  selectedCategory = 'all';
  selectedSize = 'all';
  sortOrder: 'none' | 'asc' | 'desc' = 'none';
  savedIds = new Set<number>();
  availableSizes: string[] = [];
  
  private favSub?: Subscription;
  
  // กำหนดขนาดตามหมวดหมู่
  private categorySizes: CategorySizes = {
    'all': ['XS', 'S', 'M', 'L', 'XL', '36', '37', '38', '39'],
    'tops': ['XS', 'S', 'M', 'L', 'XL'],
    'pants': ['XS', 'S', 'M', 'L', 'XL'],
    'skirts': ['XS', 'S', 'M', 'L'],
    'shoes': ['36', '37', '38', '39', '40'],
    'jackets': ['S', 'M', 'L', 'XL']
  };

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private favService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts('women').subscribe(data => {
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