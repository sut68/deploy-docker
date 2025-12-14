## Builder stage: สร้างไบนารี Go ด้วยการติดตั้ง dependencies ที่จำเป็นสำหรับ cgo (sqlite)
FROM golang:1.20 AS builder

# ติดตั้งเครื่องมือสำหรับคอมไพล์ (build-essential) และไลบรารี dev ของ sqlite
# รวมถึง git และใบรับรอง CA เพื่อให้สามารถดาวน์โหลดโมดูลและ build ได้
RUN apt-get update && apt-get install -y --no-install-recommends \
	build-essential \
	libsqlite3-dev \
	git \
	ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# กำหนดไดเรกทอรีทำงานภายใน container
WORKDIR /app

# คัดลอกไฟล์โมดูลก่อนแล้วดาวน์โหลด dependencies เพื่อให้ Docker layer cache ทำงานได้ดี
COPY go.mod go.sum ./
RUN go mod download

# คัดลอกซอร์สโค้ดทั้งหมดไปยัง container
COPY . .

# ตั้งค่าสภาพแวดล้อมเพื่อให้ Go ใช้ cgo และคอมไพล์เป็นไบนารีสำหรับ Linux/amd64
ENV CGO_ENABLED=1
ENV GOOS=linux
ENV GOARCH=amd64

# สร้างไบนารีของแอปและวางไว้ที่ /se-68-api
RUN go build -o /se-68-api ./

## Final stage: runtime image ขนาดเล็กบน Debian slim ที่มี runtime library ของ sqlite
FROM debian:bookworm-slim

# ติดตั้งไลบรารี runtime ที่จำเป็น (libsqlite3) และใบรับรอง CA
RUN apt-get update && apt-get install -y --no-install-recommends \
	libsqlite3-0 \
	ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# คัดลอกไบนารีที่สร้างจาก builder stage มาไว้ใน image ตัวสุดท้าย
COPY --from=builder /se-68-api /se-68-api

# เปิดพอร์ตที่แอปจะฟัง (ตามที่กำหนดในโค้ดเป็น 8080)
EXPOSE 8080

# คำสั่งเริ่มต้นเมื่อรัน container: เรียกใช้งานไบนารี
ENTRYPOINT ["/se-68-api"]

