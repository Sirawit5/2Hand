import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  standalone: false
})
export class SearchResultsComponent implements OnInit {
  query = '';
  results: Product[] = [];
  displayed: Product[] = [];
  selectedSize = 'all';
  sortOrder: 'none' | 'asc' | 'desc' = 'none';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private favService: FavoritesService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      if (this.query) {
        this.productService.searchProducts(this.query).subscribe(r => this.results = r);
      } else {
        this.results = [];
      }
      this.applyFilters();
    });
  }

  applyFilters() {
    let list = [...this.results];
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
