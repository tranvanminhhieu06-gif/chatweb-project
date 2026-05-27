# Bước 1: Sử dụng Node.js phiên bản chính thức làm nền tảng
FROM node:18-alpine

# Bước 2: Thiết lập thư mục làm việc bên trong Container
WORKDIR /app

# Bước 3: Copy các file quản lý thư viện vào trước để tận dụng Docker Cache
COPY package*.json ./

# Bước 4: Cài đặt các thư viện phụ thuộc (dependencies)
RUN npm install --production

# Bước 5: Copy toàn bộ mã nguồn Backend vào trong Container
COPY . .

# Bước 6: Mở cổng 5000 để Container có thể giao tiếp bên ngoài
EXPOSE 5000

# Bước 7: Lệnh khởi chạy Server khi Container bắt đầu chạy
CMD ["node", "index.js"]