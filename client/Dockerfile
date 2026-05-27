# --- Giai đoạn 1: Build mã nguồn React ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Giai đoạn 2: Khởi chạy môi trường Nginx để phục vụ file tĩnh ---
FROM nginx:alpine
# Copy toàn bộ file đã build từ giai đoạn 1 vào thư mục phục vụ của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]