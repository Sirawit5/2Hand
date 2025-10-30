import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Product Interface
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  image: string;
  sale?: number;
  new?: boolean;
  rating: number;
  sizes: string[];
  description?: string; // เพิ่ม description
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [
    // Women's Products
    { 
      id: 1, 
      name: 'Summer Floral Dress', 
      price: 32.99, 
      originalPrice: 59.99, 
      category: 'women', 
      subcategory: 'tops', 
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8o6qlxGrNGO8BOcJ3D6XUtnQQynmyMczvng&s', 
      sale: 45, 
      rating: 5, 
      sizes: ['S', 'M', 'L'],
      description: 'ชุดเดรสลายดอกไม้สไตล์ฤดูร้อน ผ้าเบาสบาย ระบายอากาศได้ดี เหมาะสำหรับวันสบายๆ หรือไปเที่ยวทะเล ตัดเย็บอย่างประณีตด้วยผ้าคุณภาพดี ใส่สบาย ไม่ร้อน เนื้อผ้านุ่ม ลายสวย สีสดใส'
    },
    { 
      id: 2, 
      name: 'Elegant Silk Blouse', 
      price: 41.99, 
      originalPrice: 59.99, 
      category: 'women', 
      subcategory: 'tops', 
      image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=500', 
      sale: 30, 
      rating: 4, 
      sizes: ['S', 'M', 'L'],
      description: 'เสื้อไหมแท้เนื้อละเอียด ดีไซน์หรูหรา เหมาะสำหรับการทำงานหรืองานสำคัญ ผ้าไหมเกรดพรีเมียม ระบายอากาศได้ดี สวมใส่สบาย ดูดีมีระดับ เพิ่มความมั่นใจในทุกโอกาส'
    },
    { 
      id: 3, 
      name: 'High-Waist Skinny Jeans', 
      price: 29.99, 
      originalPrice: 59.99, 
      category: 'women', 
      subcategory: 'pants', 
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', 
      sale: 50, 
      rating: 5, 
      sizes: ['S', 'M', 'L'],
      description: 'กางเกงยีนส์ขายาวเอวสูง ทรงสกินนี่เข้ารูป ยืดหยุ่นได้ดี สวมใส่สบาย เนื้อผ้าคอตตอนผสมสแปนเด็กซ์ ช่วยให้ขาดูเรียวยาว ทรงสวย ใส่แล้วสบายมากค่ะ ไม่อึดอัด'
    },
    { 
      id: 4, 
      name: 'Leather Jacket', 
      price: 129.99, 
      category: 'women', 
      subcategory: 'jackets', 
      image: 'https://cdn-images.farfetch-contents.com/17/81/19/24/17811924_37690679_600.jpg', 
      new: true, 
      rating: 5, 
      sizes: ['M', 'L'],
      description: 'แจ็คเก็ตหนังแท้สไตล์ไบค์เกอร์ ดีไซน์คลาสสิก เท่ห์สุดๆ ผลิตจากหนังวัวแท้คุณภาพเกรดพรีเมียม ตัดเย็บประณีต ซิปแข็งแรง มีซับในกันลม ใส่แล้วดูมีสไตล์ ทนทานมาก ยิ่งใช้ยิ่งสวย'
    },
    { 
      id: 5, 
      name: 'Classic Heels', 
      price: 47.99, 
      originalPrice: 79.99, 
      category: 'women', 
      subcategory: 'shoes', 
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLcV3dm4NlpW35gzMOtH-9XIZ6RTT6wBFUTw&s', 
      sale: 40, 
      rating: 4, 
      sizes: ['36', '37', '38'],
      description: 'รองเท้าส้นสูงคลาสสิก ส้นสูง 3 นิ้ว สวมใส่สบาย มีเบาะรองรับฝ่าเท้า วัสดุคุณภาพดี หนังแท้นิ่ม ทรงสวยเพรียว เสริมความมั่นใจ เหมาะกับทุกโอกาส ทั้งทำงานและงานปาร์ตี้'
    },

    // Men's Products
    { 
      id: 6, 
      name: 'Classic Dress Shirt', 
      price: 35.99, 
      originalPrice: 59.99, 
      category: 'men', 
      subcategory: 'tops', 
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ90dbEVU7U63VdmWdM7XMFsiaSD3iaN3j7mA&s', 
      sale: 40, 
      rating: 5, 
      sizes: ['M', 'L', 'XL'],
      description: 'เสื้อเชิ้ตแขนยาวทางการ ผ้าคอตตอน 100% เนื้อละเอียด ระบายอากาศได้ดี ตัดเย็บเรียบร้อย ทรงสวย ใส่สบาย เหมาะสำหรับทำงานออฟฟิศหรืองานสำคัญ ดูดีมีระดับ รีดง่าย ไม่ยับง่าย'
    },
    { 
      id: 7, 
      name: 'Premium Denim Jeans', 
      price: 79.99, 
      category: 'men', 
      subcategory: 'pants', 
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlarkCaVRRt1Zi16EMdt0oDFkFlpMOElfnpQ&s', 
      new: true, 
      rating: 5, 
      sizes: ['M', 'L', 'XL'],
      description: 'กางเกงยีนส์เดนิมพรีเมียม ผ้าคุณภาพสูงจากญี่ปุ่น ทรงสวยเข้ารูปพอดี ไม่คับ ใส่สบาย เนื้อผ้าทนทานมาก ซักได้ไม่หลุดจาง ดีไซน์เรียบหรู เท่ห์สุดๆ เหมาะกับทุกโอกาส'
    },
    { 
      id: 8, 
      name: 'Leather Jacket', 
      price: 129.99, 
      originalPrice: 199.99, 
      category: 'men', 
      subcategory: 'jackets', 
      image: 'https://images-cdn.ubuy.co.in/65a9738aa4a7283d7f7a7678-dtydtpe-leather-jacket-men-men-s-winter.jpg', 
      sale: 35, 
      rating: 4, 
      sizes: ['L', 'XL'],
      description: 'แจ็คเก็ตหนังแท้สำหรับผู้ชาย สไตล์เท่ห์ ดีไซน์คลาสสิก ผลิตจากหนังวัวแท้คุณภาพเกรด A ตัดเย็บอย่างประณีตด้วยช่างฝีมือ มีซับในกันหนาว กันลม ใส่แล้วดูดี มีสไตล์ ทนทานใช้ได้นานหลายปี'
    },

    // Kids' Products
    { 
      id: 9, 
      name: 'Cartoon T-Shirt Set', 
      price: 17.99, 
      originalPrice: 29.99, 
      category: 'kids', 
      subcategory: 'tops', 
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500', 
      sale: 40, 
      rating: 5, 
      sizes: ['XS', 'S', 'M'],
      description: 'ชุดเสื้อยืดเด็กลายการ์ตูนน่ารัก ผ้าคอตตอน 100% นุ่มสบาย ระบายอากาศได้ดี สีสดไม่หลุดลอก ปลอดภัยสำหรับเด็ก พิมพ์ลายคมชัด สีสวย เด็กๆ ชอบมากค่ะ ซักง่าย แห้งไว'
    },
    { 
      id: 10, 
      name: 'Princess Party Dress', 
      price: 34.99, 
      category: 'kids', 
      subcategory: 'tops', 
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTCAStuUsiizRZjYMDqT3VnU2mexnvANsXOQ&s', 
      new: true, 
      rating: 5, 
      sizes: ['XS', 'S'],
      description: 'ชุดเดรสเจ้าหญิงสำหรับงานปาร์ตี้ ผ้าซาตินเนื้อนุ่ม ตกแต่งด้วยลูกไม้ประดับเลื่อม สวยหรูระดับพรีเมียม ตัดเย็บประณีต เนื้อผ้าคุณภาพดี ใส่แล้วลูกสาวน่ารักมาก เหมาะสำหรับงานวันเกิด งานแต่งงาน หรืองานสำคัญ'
    },
    { 
      id: 11, 
      name: 'Denim Jeans', 
      price: 19.99, 
      originalPrice: 30.99, 
      category: 'kids', 
      subcategory: 'pants', 
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIYK4wHimv9dsmLoDGQ3q81i27vdF07HtUtQ&s', 
      sale: 35, 
      rating: 4, 
      sizes: ['XS', 'S', 'M'],
      description: 'กางเกงยีนส์เด็ก เนื้อผ้าคอตตอนผสมสแปนเด็กซ์ ยืดหยุ่นได้ดี สวมใส่สบาย ไม่เข็ดขัด ทนทาน ทรงสวย ซักได้ ไม่หดไม่ย้วย มีกระเป๋าใช้งานได้จริง เหมาะสำหรับเด็กวัยเรียน ใส่ไปโรงเรียนหรือเที่ยวก็เท่ห์'
    },

    // Additional Products
    { 
      id: 12, 
      name: 'Striped Casual Shirt', 
      price: 24.99, 
      category: 'men', 
      subcategory: 'tops', 
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', 
      new: true, 
      rating: 4, 
      sizes: ['M', 'L', 'XL'],
      description: 'เสื้อเชิ้ตลายทางแนวเท่ๆ ผ้าคอตตอนผสมลินิน เนื้อบาง ระบายอากาศได้ดี เหมาะกับอากาศร้อน สีสวยไม่จาง ใส่ไปทำงานหรือเที่ยวก็ดูดี มีสไตล์ ซักง่าย ไม่ต้องรีด'
    },
    { 
      id: 13, 
      name: 'Maxi Flowy Skirt', 
      price: 38.99, 
      originalPrice: 55.99, 
      category: 'women', 
      subcategory: 'skirts', 
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500', 
      sale: 30, 
      rating: 5, 
      sizes: ['S', 'M', 'L'],
      description: 'กระโปรงยาวผ้าชีฟอง โปร่งบางพริ้วสวย สวมใส่สบาย เดินลุย เหมาะกับสาวๆ ที่ชอบลุคสบายๆ แต่มีสไตล์ ใส่ไปเที่ยวทะเล ไปงานเลี้ยง หรือใส่เที่ยวทั่วไปก็สวยดูดีมีระดับ'
    },
    { 
      id: 14, 
      name: 'Sport Sneakers', 
      price: 59.99, 
      category: 'men', 
      subcategory: 'shoes', 
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 
      new: true, 
      rating: 5, 
      sizes: ['40', '41', '42', '43'],
      description: 'รองเท้าผ้าใบกีฬา ดีไซน์สปอร์ต พื้นนุ่มรองรับแรงกระแทกได้ดี เหมาะสำหรับวิ่ง ออกกำลังกาย หรือใส่เที่ยวก็ได้ วัสดุคุณภาะดี ระบายอากาศได้ดี น้ำหนักเบา สวมใส่สบายมาก'
    }
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
    if (!q) return of([]);
    return of(this.products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    ));
  }
}