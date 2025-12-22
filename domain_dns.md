# คู่มือการตั้งค่า Domain และ DNS

เอกสารฉบับนี้จัดทำขึ้นเพื่อเป็นคู่มือสำหรับผู้ดูแลระบบ นักศึกษา หรือผู้พัฒนาระบบ ในการตั้งค่า Domain และ DNS เพื่อใช้งานกับเว็บไซต์ ระบบ API หรือบริการต่าง ๆ บน Server หรือ Cloud

---

## 1. ความรู้พื้นฐานเกี่ยวกับ Domain และ DNS

### 1.1 Domain คืออะไร
Domain คือชื่อที่ใช้เรียกเว็บไซต์แทน IP Address เช่น
- example.com
- api.example.com

ช่วยให้ผู้ใช้งานจดจำและเข้าถึงระบบได้ง่าย

### 1.2 DNS (Domain Name System) คืออะไร
DNS คือระบบที่ทำหน้าที่แปลงชื่อ Domain ให้เป็น IP Address ของ Server

ตัวอย่าง:
```
example.com  →  203.150.xxx.xxx
```

---

## 2. องค์ประกอบสำคัญของ Domain

- **Root Domain** : example.com
- **Subdomain** : www.example.com, api.example.com
- **Nameserver (NS)** : ตัวกำหนดว่า Domain นี้ใช้ DNS ของผู้ให้บริการใด

---

## 3. ประเภทของ DNS Record ที่ใช้บ่อย

| Record Type | หน้าที่ | ตัวอย่าง |
|------------|--------|----------|
| A Record | ชี้ Domain ไปยัง IPv4 | example.com → 203.150.xxx.xxx |
| AAAA Record | ชี้ Domain ไปยัง IPv6 | example.com → IPv6 |
| CNAME | ชี้ชื่อ Domain ไปยังอีก Domain | www → example.com |
| MX | ใช้สำหรับ Email Server | mail.example.com |
| TXT | ใช้ยืนยันตัวตน/ความปลอดภัย | SPF, DKIM |

---

## 4. ขั้นตอนการตั้งค่า Domain (ภาพรวม)

1. ซื้อ Domain จากผู้ให้บริการ (Registrar)
2. กำหนด Nameserver
3. เพิ่ม DNS Record
4. ตรวจสอบการทำงาน
5. เชื่อมต่อกับ Server หรือ Application

---

## 5. การตั้งค่า Nameserver

### 5.1 ใช้ Nameserver ของผู้ให้บริการ Domain

ตัวอย่าง:
```
ns1.provider.com
ns2.provider.com
```

### 5.2 ใช้ Nameserver ของ Cloud / Hosting

เช่น AWS Route53, Cloudflare, Google Cloud DNS

---

## 6. การตั้งค่า DNS Record (ตัวอย่าง)

### 6.1 ชี้ Domain ไปยัง Server

**A Record**
| Name | Type | Value |
|-----|------|-------|
| @ | A | 203.150.xxx.xxx |

### 6.2 ตั้งค่า Subdomain

**api.example.com**
| Name | Type | Value |
|-----|------|-------|
| api | A | 203.150.xxx.xxx |

หรือ

| Name | Type | Value |
|-----|------|-------|
| api | CNAME | example.com |

---

## 7. การใช้งาน Domain กับ Web Server

### 7.1 ตัวอย่างการใช้งานกับ Web Server (แนวคิด)

- Web Server ฟังที่ Port 80 / 443
- Virtual Host / Server Block แยกตาม Domain

---

## 8. การตรวจสอบ Domain และ DNS

### 8.1 ตรวจสอบด้วยคำสั่ง

- ping example.com
- nslookup example.com
- dig example.com

### 8.2 ตรวจสอบผ่านเว็บไซต์

- DNS Checker
- WhatsMyDNS

> หมายเหตุ: DNS อาจใช้เวลา 1–48 ชั่วโมงในการอัปเดต (DNS Propagation)

---

## 9. การตั้งค่า HTTPS (แนะนำ)

- ใช้ SSL/TLS Certificate
- แนะนำ Let’s Encrypt (ฟรี)
- ใช้งานผ่าน Port 443

---

## 10. ปัญหาที่พบบ่อยและแนวทางแก้ไข

| ปัญหา | สาเหตุ | แนวทางแก้ |
|------|--------|-----------|
| Domain เข้าไม่ได้ | DNS ยังไม่อัปเดต | รอ DNS Propagation |
| ชี้ IP ผิด | กรอก IP ไม่ถูกต้อง | ตรวจสอบ A Record |
| https ใช้ไม่ได้ | ไม่มี SSL | ติดตั้ง Certificate |

---

## 11. Best Practice

- แยก Subdomain ตามหน้าที่ (api, admin, dev)
- ใช้ HTTPS ทุกระบบ
- จัดทำเอกสาร DNS Mapping
- จำกัดสิทธิ์การแก้ไข DNS

---

## 12. สรุป

การตั้งค่า Domain และ DNS เป็นพื้นฐานสำคัญของระบบ IT ทุกประเภท การเข้าใจโครงสร้างและขั้นตอนจะช่วยให้สามารถดูแลระบบได้อย่างถูกต้อง ปลอดภัย และขยายระบบในอนาคตได้ง่าย

