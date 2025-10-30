import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Address {
  line1: string;
  line2?: string;
  city?: string;
  postcode?: string;
  phone?: string;
}

export interface SavedAddress extends Address {
  id: number;
  name: string; // ชื่อที่อยู่ เช่น "บ้าน", "ที่ทำงาน"
  isDefault: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AddressService {
  private addresses: SavedAddress[] = [];
  private addressSubject = new BehaviorSubject<SavedAddress[]>([]);
  address$ = this.addressSubject.asObservable();

  constructor() {
    this.loadAddresses();
  }

  private loadAddresses(): void {
    const saved = localStorage.getItem('savedAddresses');
    if (saved) {
      try {
        this.addresses = JSON.parse(saved);
      } catch {
        this.addresses = [];
      }
      this.addressSubject.next(this.addresses);
    }
  }

  private persist(): void {
    localStorage.setItem('savedAddresses', JSON.stringify(this.addresses));
    this.addressSubject.next([...this.addresses]);
  }

  // บันทึกที่อยู่ใหม่
  saveAddress(address: Address, name: string = 'ที่อยู่หลัก', isDefault: boolean = false): SavedAddress {
    const newAddress: SavedAddress = {
      id: Date.now(),
      ...address,
      name,
      isDefault,
      createdAt: new Date().toISOString()
    };

    // ถ้าตั้งเป็น default ให้ยกเลิก default เดิม
    if (isDefault) {
      this.addresses.forEach(addr => addr.isDefault = false);
    }

    this.addresses.push(newAddress);
    this.persist();
    return newAddress;
  }

  // อัพเดทที่อยู่
  updateAddress(id: number, address: Partial<Address>): void {
    const index = this.addresses.findIndex(a => a.id === id);
    if (index >= 0) {
      this.addresses[index] = { ...this.addresses[index], ...address };
      this.persist();
    }
  }

  // ลบที่อยู่
  deleteAddress(id: number): void {
    const index = this.addresses.findIndex(a => a.id === id);
    if (index >= 0) {
      this.addresses.splice(index, 1);
      this.persist();
    }
  }

  // ตั้งเป็นที่อยู่หลัก
  setDefault(id: number): void {
    this.addresses.forEach(addr => {
      addr.isDefault = addr.id === id;
    });
    this.persist();
  }

  // ดึงที่อยู่หลัก
  getDefaultAddress(): SavedAddress | undefined {
    return this.addresses.find(a => a.isDefault);
  }

  // ดึงที่อยู่ทั้งหมด
  getAllAddresses(): SavedAddress[] {
    return [...this.addresses];
  }

  // ดึงที่อยู่ล่าสุด
  getLastUsedAddress(): SavedAddress | undefined {
    if (this.addresses.length === 0) return undefined;
    return this.addresses.reduce((latest, current) => 
      new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
    );
  }
}