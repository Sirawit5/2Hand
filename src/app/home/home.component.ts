import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  displayed: Product[] = [];
  selectedSize = 'all';
  sortOrder: 'none' | 'asc' | 'desc' = 'none';

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.featuredProducts = products.slice(0, 6); // แสดง 6 ชิ้น
      this.applyFilters();
    });
  }

  applyFilters() {
    let list = [...this.featuredProducts];
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

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    alert(`${product.name} has been added to cart.`);
  }
}
