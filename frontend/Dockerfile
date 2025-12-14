FROM node:22-alpine as builder
WORKDIR /app
COPY package.json ./
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
