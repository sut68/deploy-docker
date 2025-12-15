# สรุปคำสั่งใน Dockerfile

เอกสารนี้สรุปคำสั่งพื้นฐานที่ใช้ใน Dockerfile พร้อมคำอธิบายแบบกระชับ เหมาะสำหรับการเรียนรู้และอ้างอิง

---

## FROM
กำหนด Base Image ที่ใช้เป็นพื้นฐานของ Image
```dockerfile
FROM ubuntu:24.04
```

---

## WORKDIR
กำหนดโฟลเดอร์หลักสำหรับทำงานภายใน Container
```dockerfile
WORKDIR /app
```

---

## COPY
คัดลอกไฟล์จากเครื่อง Host ไปยัง Container
```dockerfile
COPY . .
```

---

## ADD
คล้าย COPY แต่สามารถแตกไฟล์ `.tar` และโหลดจาก URL ได้
```dockerfile
ADD app.tar.gz /app
```

---

## RUN
รันคำสั่งขณะ Build Image
```dockerfile
RUN apt update && apt install -y nginx
```

---

## CMD
กำหนดคำสั่งเริ่มต้นเมื่อ Container ถูก Run
```dockerfile
CMD ["nginx", "-g", "daemon off;"]
```

---

## ENTRYPOINT
กำหนดคำสั่งหลักของ Container
```dockerfile
ENTRYPOINT ["python3", "app.py"]
```

---

## EXPOSE
ระบุพอร์ตที่ Container ใช้งาน
```dockerfile
EXPOSE 80
```

---

## ENV
กำหนด Environment Variable
```dockerfile
ENV NODE_ENV=production
```

---

## ARG
กำหนดตัวแปรเฉพาะตอน Build
```dockerfile
ARG VERSION=1.0
```

---

## USER
กำหนดผู้ใช้งานภายใน Container
```dockerfile
USER root
```

---

## VOLUME
กำหนดโฟลเดอร์สำหรับเก็บข้อมูลถาวร
```dockerfile
VOLUME /data
```

---

## LABEL
เพิ่มข้อมูล metadata ให้ Image
```dockerfile
LABEL maintainer="admin@example.com"
```

---

## HEALTHCHECK
ตรวจสอบสถานะการทำงานของ Container
```dockerfile
HEALTHCHECK CMD curl --fail http://localhost || exit 1
```

---

## ตารางสรุปคำสั่ง

| คำสั่ง | หน้าที่ |
|------|--------|
| FROM | เลือก base image |
| WORKDIR | กำหนด directory |
| COPY / ADD | คัดลอกไฟล์ |
| RUN | รันคำสั่งตอน build |
| CMD | คำสั่งเริ่ม container |
| ENTRYPOINT | คำสั่งหลัก |
| EXPOSE | ระบุพอร์ต |
| ENV | ตัวแปรแวดล้อม |
| VOLUME | เก็บข้อมูลถาวร |
| HEALTHCHECK | ตรวจสอบ container |
