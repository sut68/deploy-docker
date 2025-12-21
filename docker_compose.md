# เอกสารประกอบการสอน: การใช้งาน Docker Compose

## 1. Docker Compose คืออะไร

Docker Compose คือเครื่องมือที่ใช้สำหรับ **จัดการและรันหลาย Container พร้อมกัน** โดยอาศัยไฟล์กำหนดค่าเพียงไฟล์เดียวคือ `docker-compose.yml` ทำให้สามารถนิยามสภาพแวดล้อมของระบบ (System Environment) ได้อย่างเป็นระบบและทำซ้ำได้ง่าย

### ปัญหาที่ Docker Compose ช่วยแก้ไข
- ระบบหนึ่งประกอบด้วยหลายบริการ เช่น Web, API, Database, Cache
- ต้องรันหลายคำสั่ง `docker run` ซึ่งซับซ้อนและจำยาก
- การตั้งค่า Network, Volume, Port ต้องจัดการเองทั้งหมด

Docker Compose ช่วยให้เราสามารถ:
- กำหนดทุกบริการไว้ในไฟล์เดียว
- สั่งรัน/หยุดระบบทั้งหมดด้วยคำสั่งเดียว
- เหมาะสำหรับ Development, Testing และ Prototype

### ตัวอย่างระบบที่เหมาะกับ Docker Compose
- Web Application (Frontend + Backend + Database)
- IoT Platform (MQTT + Node-RED + Database)
- Microservices ขนาดเล็กถึงกลาง

### องค์ประกอบหลักของ Docker Compose
- **services** : บริการหรือ container ที่ต้องการรัน
- **networks** : เครือข่ายสำหรับเชื่อม container
- **volumes** : พื้นที่เก็บข้อมูลถาวร

ตัวอย่างโครงสร้างไฟล์:
```yaml
version: "3.9"
services:
  web:
    image: nginx
    ports:
      - "80:80"
```

---

## 2. คำสั่งใน Docker Compose

### 2.1 คำสั่งพื้นฐานที่ใช้บ่อย

#### เริ่มต้นระบบ (Start Services)
```bash
docker compose up
```
- สร้าง container, network, volume ตามไฟล์ `docker-compose.yml`

รันแบบ background (Detached mode)
```bash
docker compose up -d
```

---

#### หยุดและลบ Container
```bash
docker compose down
```
- หยุด container
- ลบ container และ network ที่สร้างขึ้น

ลบ volume ด้วย
```bash
docker compose down -v
```

---

### 2.2 การจัดการสถานะของ Service

#### ตรวจสอบสถานะ container
```bash
docker compose ps
```

#### ดู log ของทุก service
```bash
docker compose logs
```

ดู log ของ service ใด service หนึ่ง
```bash
docker compose logs api
```

ดู log แบบ real-time
```bash
docker compose logs -f
```

---

### 2.3 การ Build Image

กรณีใช้ Dockerfile
```bash
docker compose build
```

Build ใหม่และรัน
```bash
docker compose up --build
```

---

### 2.4 การสั่งงานภายใน Container

เข้าไปใน container
```bash
docker compose exec web sh
```

รันคำสั่งชั่วคราว
```bash
docker compose run api npm install
```

---

### 2.5 การจัดการ Service รายตัว

Restart service เดียว
```bash
docker compose restart db
```

Stop service เดียว
```bash
docker compose stop web
```

Start service เดียว
```bash
docker compose start web
```

---

## 3. รายละเอียดคำสั่งในไฟล์ docker-compose.yml (พร้อมตัวอย่าง)

ไฟล์ `docker-compose.yml` ใช้สำหรับกำหนดโครงสร้างและพฤติกรรมของระบบทั้งหมด โดยประกอบด้วยคำสั่ง (Directive) ต่าง ๆ ดังนี้

---

### 3.1 version — ระบุเวอร์ชันของ Compose file

ใช้กำหนดว่าไฟล์ `docker-compose.yml` นี้อ้างอิงตามมาตรฐานเวอร์ชันใด ซึ่งมีผลกับคำสั่งที่สามารถใช้งานได้

```yaml
version: "3.9"
```

**คำอธิบาย**
- ใช้บอก Docker ว่าไฟล์นี้เขียนตาม Compose Specification เวอร์ชันใด
- เวอร์ชันที่นิยมใช้งาน: 3.7, 3.8, 3.9

---

### 3.2 services — กำหนดบริการ (Container)

เป็นส่วนหลักของไฟล์ ใช้กำหนด container แต่ละตัวในระบบ

```yaml
services:
  web:
    image: nginx
```

**คำอธิบาย**
- 1 service = 1 container (โดยทั่วไป)
- สามารถมีหลาย service ในไฟล์เดียว

---

### 3.3 image — ระบุ Docker Image ที่จะใช้งาน

```yaml
image: nginx:latest
```

**คำอธิบาย**
- ดึง image จาก Docker Hub หรือ private registry
- หากไม่มี image ในเครื่อง ระบบจะ pull อัตโนมัติ

---

### 3.4 build — สร้าง Image จาก Dockerfile

```yaml
build:
  context: .
  dockerfile: Dockerfile
```

**คำอธิบาย**
- ใช้กรณีมี Dockerfile ของตัวเอง
- context คือ path ของ source code

---

### 3.5 container_name — กำหนดชื่อ Container

```yaml
container_name: my_web
```

**คำอธิบาย**
- หากไม่กำหนด Docker จะตั้งชื่ออัตโนมัติ
- ช่วยให้เรียก container ได้ง่าย

---

### 3.6 ports — เชื่อมต่อ Port ระหว่าง Host และ Container

```yaml
ports:
  - "8080:80"
```

**คำอธิบาย**
- รูปแบบ: HOST:CONTAINER
- ใช้เปิดให้เข้าถึง service จากภายนอก

---

### 3.7 volumes — จัดการข้อมูลถาวร (Persistent Data)

```yaml
volumes:
  - ./data:/var/lib/mysql
```

**คำอธิบาย**
- ป้องกันข้อมูลหายเมื่อ container ถูกลบ
- ใช้กับ Database เป็นหลัก

---

### 3.8 environment — กำหนด Environment Variables

```yaml
environment:
  DB_HOST: db
  DB_USER: root
```

**คำอธิบาย**
- ใช้ส่งค่าการตั้งค่าให้ container
- นิยมใช้กับ DB, API Key

---

### 3.9 env_file — ดึงค่าจากไฟล์ .env

```yaml
env_file:
  - .env
```

**คำอธิบาย**
- แยกค่าลับออกจากไฟล์หลัก
- เหมาะสำหรับใช้งานร่วมกับ Git

---

### 3.10 depends_on — กำหนดลำดับการเริ่มต้น Service

```yaml
depends_on:
  - db
```

**คำอธิบาย**
- บอกว่า service นี้ต้องรอ service อื่นก่อน
- ไม่ได้ตรวจสอบว่า service ปลายทางพร้อมใช้งาน

---

### 3.11 command — คำสั่งที่รันเมื่อ Container เริ่มทำงาน

```yaml
command: npm run dev
```

---

### 3.12 restart — นโยบายการ Restart Container

```yaml
restart: always
```

ค่าที่ใช้บ่อย:
- no
- always
- on-failure
- unless-stopped

---

### 3.13 networks — การกำหนด Network

```yaml
networks:
  backend:
    driver: bridge
```

---

### 3.14 volumes (ระดับ global)

```yaml
volumes:
  db_data:
```

---

### ตัวอย่าง docker-compose.yml (n8n + MariaDB + phpMyAdmin + MongoDB)

ตัวอย่างนี้เป็นระบบที่ใช้บ่อยในงาน Automation / Data / Workflow โดยประกอบด้วย
- **n8n** : Workflow Automation
- **MariaDB** : ฐานข้อมูลหลัก
- **phpMyAdmin** : เครื่องมือจัดการ MariaDB ผ่านเว็บ
- **MongoDB** : ฐานข้อมูลเสริมสำหรับบาง workflow

```yaml
version: "3.9"

services:
  mariadb:
    image: mariadb:10.11
    container_name: mariadb
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: n8n
      MYSQL_USER: n8n
      MYSQL_PASSWORD: n8npass
    volumes:
      - mariadb_data:/var/lib/mysql
    ports:
      - "3306:3306"

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: phpmyadmin
    restart: always
    depends_on:
      - mariadb
    environment:
      PMA_HOST: mariadb
      PMA_PORT: 3306
    ports:
      - "8081:80"

  mongodb:
    image: mongo:7
    container_name: mongodb
    restart: always
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: always
    depends_on:
      - mariadb
      - mongodb
    environment:
      DB_TYPE: mariadb
      DB_MYSQLDB_HOST: mariadb
      DB_MYSQLDB_DATABASE: n8n
      DB_MYSQLDB_USER: n8n
      DB_MYSQLDB_PASSWORD: n8npass
      N8N_BASIC_AUTH_ACTIVE: "true"
      N8N_BASIC_AUTH_USER: admin
      N8N_BASIC_AUTH_PASSWORD: admin123
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  mariadb_data:
  mongo_data:
  n8n_data:
```

---

## การแยกไฟล์ .env เพื่อความปลอดภัยของระบบ (Security Best Practice)

ในการพัฒนาระบบจริง **ไม่ควรเขียนรหัสผ่านหรือข้อมูลสำคัญลงในไฟล์ `docker-compose.yml` โดยตรง** เนื่องจากไฟล์ดังกล่าวมักถูกจัดเก็บในระบบควบคุมเวอร์ชัน (เช่น Git) ซึ่งมีความเสี่ยงต่อการรั่วไหลของข้อมูล

แนวปฏิบัติที่ถูกต้องคือการแยกข้อมูลสำคัญออกมาไว้ในไฟล์ `.env` และให้ Docker Compose เรียกใช้งานตัวแปรเหล่านั้นแทน

เพื่อความปลอดภัย ไม่ควรเขียนรหัสผ่านหรือข้อมูลสำคัญไว้ในไฟล์ `docker-compose.yml` โดยตรง ควรแยกไปไว้ในไฟล์ `.env`

### ### ตัวอย่างไฟล์ .env (ไฟล์เก็บค่าความลับของระบบ)

```env
# MariaDB
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=n8n
MYSQL_USER=n8n
MYSQL_PASSWORD=n8npass

# n8n Basic Auth
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin123
```

> ⚠️ หมายเหตุ: ไม่ควร commit ไฟล์ `.env` ขึ้น Git (ควรใส่ใน `.gitignore`)

---

### การเรียกใช้ค่าใน docker-compose.yml

```yaml
environment:
  MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
  MYSQL_DATABASE: ${MYSQL_DATABASE}
  MYSQL_USER: ${MYSQL_USER}
  MYSQL_PASSWORD: ${MYSQL_PASSWORD}
```

**ข้อดีด้าน Security**
- ป้องกันการรั่วไหลของรหัสผ่าน
- แยก config ตาม environment (dev / prod)
- ง่ายต่อการเปลี่ยนค่าโดยไม่ต้องแก้ compose file

---

## ตัวอย่าง docker-compose.yml หลังแยกไฟล์ .env (ตัวอย่างสำหรับการเรียนการสอน)

ตัวอย่างนี้คือไฟล์ `docker-compose.yml` ที่ **ไม่เขียนข้อมูลสำคัญลงไปโดยตรง** แต่ดึงค่าจากไฟล์ `.env` แทน เหมาะสำหรับใช้สอนเรื่อง Security Best Practice

```yaml
version: "3.9"

services:
  mariadb:
    image: mariadb:10.11
    container_name: mariadb
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mariadb_data:/var/lib/mysql
    ports:
      - "3306:3306"

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: phpmyadmin
    restart: always
    depends_on:
      - mariadb
    environment:
      PMA_HOST: mariadb
      PMA_PORT: 3306
    ports:
      - "8081:80"

  mongodb:
    image: mongo:7
    container_name: mongodb
    restart: always
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: always
    depends_on:
      - mariadb
      - mongodb
    environment:
      DB_TYPE: mariadb
      DB_MYSQLDB_HOST: mariadb
      DB_MYSQLDB_DATABASE: ${MYSQL_DATABASE}
      DB_MYSQLDB_USER: ${MYSQL_USER}
      DB_MYSQLDB_PASSWORD: ${MYSQL_PASSWORD}
      N8N_BASIC_AUTH_ACTIVE: ${N8N_BASIC_AUTH_ACTIVE}
      N8N_BASIC_AUTH_USER: ${N8N_BASIC_AUTH_USER}
      N8N_BASIC_AUTH_PASSWORD: ${N8N_BASIC_AUTH_PASSWORD}
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  mariadb_data:
  mongo_data:
  n8n_data:
```

---

## ตารางอธิบายหน้าที่ของแต่ละ Service ในระบบ

| Service | หน้าที่ | ใช้งานอะไร |
|-------|--------|------------|
| n8n | ระบบ Workflow Automation | สร้าง automation, เชื่อม API, IoT, Data |
| MariaDB | ฐานข้อมูลหลัก | เก็บข้อมูล workflow และ credential |
| phpMyAdmin | เครื่องมือจัดการ DB ผ่านเว็บ | ดูตาราง, แก้ไขข้อมูล, สอนโครงสร้าง DB |
| MongoDB | ฐานข้อมูลเสริม (NoSQL) | เก็บข้อมูล JSON, log, workflow บางประเภท |




