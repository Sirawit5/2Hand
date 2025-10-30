English → Thai translation mapping (used across templates)

UI string mappings:
- My Profile -> โปรไฟล์ของฉัน
- Featured Products -> สินค้าแนะนำ
- Size -> ขนาด
- All -> ทั้งหมด
- Sort -> จัดเรียง
- Default -> เริ่มต้น
- Price: Low → High -> ราคา: ต่ำ → สูง
- Price: High → Low -> ราคา: สูง → ต่ำ
- View -> ดูรายละเอียด
- Add to cart -> เพิ่มลงตะกร้า
- Buy now / Buy -> ซื้อเลย
- Cart -> ตะกร้า
- Log In -> เข้าสู่ระบบ
- Sign Up -> สมัครสมาชิก
- Welcome Back! -> ยินดีต้อนรับกลับ
- Create an Account -> สร้างบัญชีผู้ใช้
- Username -> ชื่อผู้ใช้
- Password -> รหัสผ่าน
- Confirm Password -> ยืนยันรหัสผ่าน
- Search for products... -> ค้นหาสินค้า...
- Search -> ค้นหา
- Orders -> คำสั่งซื้อ
- Order # -> คำสั่งซื้อที่ #
- Quantity -> จำนวน
- Total / Subtotal -> ยอดรวม / ยอดรวมย่อย
- Shipping -> ค่าจัดส่ง
- Address -> ที่อยู่
- Payment -> ช่องทางการชำระเงิน
- QR Code / QR -> สแกน QR
- No products found. -> ไม่พบสินค้า
- Order success -> สั่งซื้อสำเร็จ
- View -> ดู / ดูรายละเอียด (context-sensitive)

Notes:
- Currency symbols: where templates showed `$`, I replaced with `฿` in product listings and search results. Business logic still uses numeric values; only display strings changed.
- I intentionally did not change variable names (TypeScript) or router paths.
- If you prefer different wording (formal vs informal), tell me and I can search & replace the mapping consistently.

Next steps suggestions:
- (Optional) Move strings to an i18n file or Angular i18n translation file for future multi-language support.
- (Optional) Review components with dynamic messages (alerts/confirm) in TypeScript files and translate those messages as well.

How I applied changes:
- Edited templates under `src/app/*` to match the mapping above in the first pass.
- Replaced static QR image with a generated image URL using `qrserver.com` and included `thaiAddress` in the payload.

If you want, I can now:
- Translate remaining small English messages in TypeScript files (alerts, confirm, console messages).
- Replace any remaining `$` with `฿` consistently across templates.
- Extract strings to a `TRANSLATIONS.json` for future i18n work.
