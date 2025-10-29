import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string; // emoji หรือ url
  sale?: number; // % off
  rating: number; // 1-5
  new?: boolean;
  sizes?: string[]; // optional sizes available for product
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [
    // Women's
  { id: 1, name: 'Summer Floral Dress', price: 32.99, originalPrice: 59.99, category: 'women', image: '👗', sale: 45, rating: 5, sizes: ['S','M','L'] },
  { id: 2, name: 'Elegant Silk Blouse', price: 41.99, originalPrice: 59.99, category: 'women', image: '👚', sale: 30, rating: 4, sizes: ['S','M','L'] },
  { id: 3, name: 'High-Waist Skinny Jeans', price: 29.99, originalPrice: 59.99, category: 'women', image: '👖', sale: 50, rating: 5, sizes: ['S','M','L'] },
  { id: 4, name: 'Leather Jacket', price: 129.99, category: 'women', image: '🧥', new: true, rating: 5, sizes: ['M','L'] },
  { id: 5, name: 'Classic Heels', price: 47.99, originalPrice: 79.99, category: 'women', image: '👠', sale: 40, rating: 4, sizes: ['36','37','38'] },

    // Men's
  { id: 6, name: 'Classic Dress Shirt', price: 35.99, originalPrice: 59.99, category: 'men', image: '👔', sale: 40, rating: 5, sizes: ['M','L','XL'] },
  { id: 7, name: 'Premium Denim Jeans', price: 79.99, category: 'men', image: '👖', new: true, rating: 5, sizes: ['M','L','XL'] },
  { id: 8, name: 'Leather Jacket', price: 129.99, originalPrice: 199.99, category: 'men', image: '🧥', sale: 35, rating: 4, sizes: ['L','XL'] },

    // Kids
  { id: 9, name: 'Cartoon T-Shirt Set', price: 17.99, originalPrice: 29.99, category: 'kids', image: '👕', sale: 40, rating: 5, sizes: ['XS','S','M'] },
  { id: 10, name: 'Princess Party Dress', price: 34.99, category: 'kids', image: '👗', new: true, rating: 5, sizes: ['XS','S'] },
  { id: 11, name: 'Denim Jeans', price: 19.99, originalPrice: 30.99, category: 'kids', image: '👖', sale: 35, rating: 4, sizes: ['XS','S','M'] },
  ];

  constructor() { }

  getProducts(category?: string): Observable<Product[]> {
    if (category) {
      return of(this.products.filter(p => p.category === category));
    }
    return of(this.products);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
  }

  searchProducts(query: string): Observable<Product[]> {
    const q = query.trim().toLowerCase();
    if (!q) {
      return of([]);
    }
    return of(this.products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
  }
}
