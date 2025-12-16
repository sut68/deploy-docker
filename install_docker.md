# Install Docker & Docker Compose on Ubuntu 24.04

เอกสารนี้อธิบายขั้นตอนการติดตั้ง **Docker Engine** และ **Docker Compose (v2 plugin)** บน **Ubuntu 24.04 (Noble Numbat)** แบบเป็นทางการ เหมาะสำหรับใช้งานจริงทั้ง Dev และ Production

---

## 1. Update ระบบ
```bash
sudo apt update
sudo apt upgrade -y
```

---

## 2. ติดตั้ง Package ที่จำเป็น
```bash
sudo apt install -y ca-certificates curl gnupg lsb-release
```

---

## 3. เพิ่ม Docker GPG Key
```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

ตั้งค่า permission
```bash
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

---

## 4. เพิ่ม Docker Repository
```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

อัปเดต package list
```bash
sudo apt update
```

---

## 5. ติดตั้ง Docker Engine และ Docker Compose
```bash
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

---

## 6. ตรวจสอบสถานะ Docker
```bash
sudo systemctl status docker
```

ทดสอบรัน container
```bash
sudo docker run hello-world
```

---

## 7. ใช้ Docker โดยไม่ต้องใช้ sudo (แนะนำ)
เพิ่ม user เข้า docker group
```bash
sudo usermod -aG docker $USER
```

ออกจากระบบแล้วเข้าใหม่ หรือใช้คำสั่ง
```bash
newgrp docker
```

ทดสอบอีกครั้ง
```bash
docker run hello-world
```

---

## 8. ตรวจสอบ Docker Compose
> Ubuntu 24.04 ใช้คำสั่ง `docker compose` (ไม่มีเครื่องหมาย -)

```bash
docker compose version
```

ตัวอย่างการใช้งาน
```bash
docker compose up -d
```

---
