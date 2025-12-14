# ใช้ official Node.js base image แบบ light (Alpine) เป็นขั้นตอน build
# stage นี้จะติดตั้ง dependencies และ build แอปพลิเคชัน
FROM node:22-alpine as builder

# เปลี่ยนไดเรกทอรีทำงานภายใน container เป็น /app
WORKDIR /app

# คัดลอกไฟล์ package.json เข้ามาก่อนเพื่อให้สามารถใช้ cache ของ layer
# เมื่อ dependencies ไม่เปลี่ยน จะไม่ต้องติดตั้งใหม่ทุกครั้งที่ build
COPY package.json ./

# คัดลอก source code ทั้งหมดของโปรเจคไปยัง container
COPY . .

# ติดตั้ง dependency ที่ระบุใน package.json (npm install)
RUN npm install

# รันคำสั่ง build ของโปรเจค (สร้างไฟล์ production ในโฟลเดอร์ dist)
RUN npm run build


# สร้าง final image โดยใช้ Nginx เป็น web server ขนาดเล็กสำหรับเสิร์ฟไฟล์สแตติก
FROM nginx:alpine

# คัดลอกไฟล์การตั้งค่า Nginx ของโปรเจคไปแทนค่าดีฟอลต์
COPY nginx.conf /etc/nginx/nginx.conf

# ตั้งไดเรกทอรีทำงานเป็นโฟลเดอร์ที่ Nginx จะเสิร์ฟไฟล์
WORKDIR /usr/share/nginx/html

# คัดลอกผลลัพธ์การ build จาก stage 'builder' มาที่โฟลเดอร์ของ Nginx
# --from=builder ระบุ multi-stage source
COPY --from=builder /app/dist .
