import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { FavoritesService } from '../services/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  standalone: false
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  query = '';
  results: Product[] = [];
  displayed: Product[] = [];
  selectedSize = 'all';
  sortOrder: 'none' | 'asc' | 'desc' = 'none';
  savedIds = new Set<number>();
  private favSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private favService: FavoritesService
  ) { }

  ngOnInit(): void {
    // Subscribe to favorites
    this.favSub = this.favService.favIds$.subscribe(ids => {
      this.savedIds = new Set(ids || []);
    });

    // Subscribe to query params
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      if (this.query) {
        this.productService.searchProducts(this.query).subscribe(r => {
          this.results = r;
          this.applyFilters();
        });
      } else {
        this.results = [];
        this.displayed = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.favSub?.unsubscribe();
  }

  trackByProduct(_index: number, item: Product) {
    return item?.id;
  }

  applyFilters() {
    let list = [...this.results];
    
    // Filter by size
    if (this.selectedSize && this.selectedSize !== 'all') {
      list = list.filter(p => p.sizes && p.sizes.includes(this.selectedSize));
    }
    
    // Sort by price
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
    // Optimistic update
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