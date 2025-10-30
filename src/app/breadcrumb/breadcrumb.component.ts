import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
  standalone: false
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Array<{ label: string; url: string }> = [];

  constructor(
    private router: Router, 
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildBreadcrumbs(this.router.url);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.buildBreadcrumbs(e.urlAfterRedirects || e.url);
    });
  }

  private titleCase(s: string) {
    return s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // แปลชื่อหมวดหมู่เป็นภาษาไทย
  translateLabel(label: string): string {
    if (!label) return label;
    const map: Record<string, string> = {
      'home': 'หน้าแรก',
      'women': 'ผู้หญิง',
      'men': 'ผู้ชาย',
      'kids': 'เด็ก',
      'about': 'เกี่ยวกับเรา',
      'cart': 'ตะกร้า',
      'profile': 'โปรไฟล์',
      'checkout': 'ชำระเงิน',
      'orders': 'คำสั่งซื้อ'
    };
    const key = label.trim().toLowerCase();
    return map[key] || label;
  }

  private async buildBreadcrumbs(url: string) {
    if (url === '/home' || url === '/') {
      this.breadcrumbs = [];
      return;
    }

    const parts = url.split('/').filter(p => p);
    const crumbs: Array<{ label: string; url: string }> = [];
    let acc = '';
    let productId: string | null = null;
    let hasCategory = false;

    // ตรวจสอบก่อนว่ามีหมวดหมู่ใน URL หรือไม่
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].toLowerCase();
      if (part === 'women' || part === 'men' || part === 'kids') {
        hasCategory = true;
        break;
      }
    }

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      acc += '/' + part;
      
      // ถ้าเป็นตัวเลข (Product ID)
      if (/^\d+$/.test(part)) {
        productId = part;
        
        // ถ้ายังไม่มีหมวดหมู่ใน URL ให้ดึงจากสินค้า
        if (!hasCategory) {
          try {
            const product = await this.productService.getProductById(+part).toPromise();
            
            if (product && product.category) {
              const categoryUrl = `/${product.category.toLowerCase()}`;
              crumbs.push({ 
                label: this.translateLabel(product.category), 
                url: categoryUrl 
              });
            }
          } catch (error) {
            console.error('Error loading product:', error);
          }
        }
        
        // เพิ่ม Product ID
        const productUrl = crumbs.length > 0 
          ? `${crumbs[crumbs.length - 1].url}/product/${productId}`
          : `/product/${productId}`;
        
        crumbs.push({ 
          label: `Product#${productId}`, 
          url: productUrl 
        });
        
        continue;
      } 
      // ถ้าเป็น "product" ให้ข้าม
      else if (part.toLowerCase() === 'product') {
        continue;
      }
      // ส่วนอื่นๆ (เช่น หมวดหมู่)
      else {
        const label = this.titleCase(decodeURIComponent(part));
        crumbs.push({ label: this.translateLabel(label), url: acc });
      }
    }
    
    this.breadcrumbs = crumbs;
  }
}