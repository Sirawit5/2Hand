import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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

  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit(): void {

    this.buildBreadcrumbs(this.router.url);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.buildBreadcrumbs(e.urlAfterRedirects || e.url);
    });
  }

  private titleCase(s: string) {
    return s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Translate some common route/category labels to Thai for the breadcrumb.
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

  private buildBreadcrumbs(url: string) {
  if (url === '/home' || url === '/') {
    this.breadcrumbs = [];
    return;
  }

  const parts = url.split('/').filter(p => p);
  const crumbs: Array<{ label: string; url: string }> = [];
  let acc = '';
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    acc += '/' + part;
    const label = /^\d+$/.test(part) ? `#${part}` : this.titleCase(decodeURIComponent(part));
    crumbs.push({ label: this.translateLabel(label), url: acc });
  }
  this.breadcrumbs = crumbs;
}

  
}
