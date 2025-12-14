
# Multi-stage Dockerfile for the Go backend using sqlite3 (cgo)
# Builder stage: uses Alpine and installs sqlite dev packages to allow cgo linking
FROM golang:1.20 AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
	build-essential \
	libsqlite3-dev \
	git \
	ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Cache modules
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build for linux/amd64 with cgo enabled (required by mattn/go-sqlite3)
ENV CGO_ENABLED=1
ENV GOOS=linux
ENV GOARCH=amd64

RUN go build -o /se-68-api ./

# Final stage: Debian slim with sqlite runtime
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
	libsqlite3-0 \
	ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Copy binary from builder
COPY --from=builder /se-68-api /se-68-api

EXPOSE 8080

ENTRYPOINT ["/se-68-api"]

