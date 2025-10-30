import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: false
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  selectedSize = '';
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private favService: FavoritesService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.productService.getProductById(id).subscribe(p => {
      this.product = p;
      if (p && p.sizes && p.sizes.length) this.selectedSize = p.sizes[0];
    });
  }

  addToBag() {
    if (!this.product) return;
    this.cartService.addToCart(this.product, this.quantity, this.selectedSize || undefined);
    alert(`${this.product.name} (x${this.quantity}) added to bag.`);
  }

  buyNow() {
    if (!this.product) return;
    this.cartService.addToCart(this.product, this.quantity, this.selectedSize || undefined);
    this.router.navigate(['/checkout']);
  }

  toggleSave() {
    if (!this.product) return;
    this.favService.toggle(this.product);
  }

  isSaved(): boolean {
    return !!this.product && this.favService.isSaved(this.product.id);
  }

  decrement() {
    this.quantity = Math.max(1, (this.quantity || 1) - 1);
  }

  increment() {
    this.quantity = (this.quantity || 1) + 1;
  }
}
