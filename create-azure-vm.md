# ขั้นตอนการสร้าง Virtual Machine บน Microsoft Azure

เอกสารนี้อธิบายขั้นตอนการสร้าง Virtual Machine (VM) บน Microsoft Azure โดยกำหนดค่าตามภาพตัวอย่างในหน้า **Create a virtual machine (Basics)**

---

## 1. เข้าเมนูสร้าง Virtual Machine
1. เข้าสู่ระบบที่ **Microsoft Azure Portal**
2. เลือกเมนู **Virtual machines**
3. คลิก **Create → Azure virtual machine**

---

## 2. ตั้งค่าแท็บ Basics

### 2.1 Project details
- **Subscription**: Azure for Students  
- **Resource group**: se-68_group  

---

### 2.2 Instance details
- **Virtual machine name**: se  
- **Region**: (Asia Pacific) East Asia  
- **Availability options**: Availability zone  
- **Zone options**: Self-selected zone  
- **Availability zone**: Zone 1  

---

### 2.3 Security
- **Security type**: Trusted launch virtual machines  

---

### 2.4 Image
- **Image**: Ubuntu Server 24.04 LTS - x64 Gen2  
- **VM architecture**: x64  

---

### 2.5 Size
- **Virtual machine size**: Standard B2als  
  - 2 vCPUs  
  - 4 GiB RAM  
  - ประมาณ $38.40 ต่อเดือน  

---

### 2.6 Administrator account
- **Authentication type**: Password  
- **Username**: azureuser  
- **Password**: กำหนดรหัสผ่าน  
- **Confirm password**: ยืนยันรหัสผ่าน  

---

### 2.7 Inbound port rules
- **Public inbound ports**: Allow selected ports  
- **Selected ports**:
  - SSH (22)
  - HTTP (80)
  - HTTPS (443)

> หมายเหตุ: การเปิดพอร์ตเหล่านี้จะอนุญาตให้ทุก IP จากอินเทอร์เน็ตเข้าถึง VM  
> เหมาะสำหรับการทดสอบ ควรจำกัด IP ในการใช้งานจริง

---

## 3. ดำเนินการขั้นถัดไป
- คลิก **Next: Disks** เพื่อกำหนดค่าดิสก์ (ถ้ามี)
- หรือคลิก **Review + create**

---

## 4. ตรวจสอบและสร้าง Virtual Machine
1. ตรวจสอบการตั้งค่าทั้งหมดในหน้า Review
2. หากไม่มีข้อผิดพลาด คลิก **Create**
3. รอระบบ Azure ทำการสร้าง Virtual Machine

---

## 5. การเชื่อมต่อ Virtual Machine
หลังจากสร้างเสร็จ สามารถเชื่อมต่อผ่าน SSH ได้ด้วยคำสั่ง:

```bash
ssh azureuser@<Public-IP-Address>
