import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false
})
export class FooterComponent {
  
  aboutLinks = [
    { label: 'เกี่ยวกับเรา', route: '/about' },
    { label: 'ติดต่อเรา', route: '/contact' },
    { label: 'สาขาของเรา', route: '/branches' },
    { label: 'ร่วมงานกับเรา', route: '/careers' }
  ];

  serviceLinks = [
    { label: 'วิธีการสั่งซื้อ', route: '/how-to-order' },
    { label: 'การจัดส่งและการคือสินค้า', route: '/shipping-returns' },
    { label: 'การชำระเงิน', route: '/payment' },
    { label: 'นโยบายความเป็นส่วนตัว', route: '/privacy-policy' },
    { label: 'เงื่อนไขการใช้งาน', route: '/terms' }
  ];

  categoryLinks = [
    { label: 'เสื้อผ้าผู้หญิง', route: '/women' },
    { label: 'เสื้อผ้าผู้ชาย', route: '/men' },
    { label: 'เสื้อผ้าเด็ก', route: '/kids' },
    { label: 'สินค้าลดราคา', route: '/sale' }
  ];

  socialLinks = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', url: 'https://facebook.com/2hshop' },
    { name: 'Instagram', icon: 'fab fa-instagram', url: 'https://instagram.com/2hshop' },
    { name: 'Line', icon: 'fab fa-line', url: 'https://line.me/ti/p/2hshop' },
    { name: 'TikTok', icon: 'fab fa-tiktok', url: 'https://tiktok.com/2hshop' }
  ];

  currentYear = new Date().getFullYear();
}