require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// 2. Sau đó mới import file kết nối database
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const socketHandler = require('./sockets/socketHandler');

const app = express();

// Kết nối Cơ sở dữ liệu MongoDB
connectDB();

// Middlewares cơ bản
// Cấu hình CORS mở rộng để chấp nhận cả localhost và tên miền production sau này
app.use(cors({
    origin: ["http://localhost:5173", "https://ten-app-frontend-cua-ban.vercel.app"],
    credentials: true
}));
app.use(express.json());

// Định tuyến API HTTP thông thường (Đăng ký / Đăng nhập)
app.use('/api/auth', authRoutes);

// 4. Tạo một HTTP Server bằng Express
const server = http.createServer(app);

// 5. Khởi tạo cấu hình cho Socket.io Server (Cấp quyền CORS cho Frontend nhận diện)
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://ten-app-frontend-cua-ban.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// 6. Kích hoạt bộ lắng nghe sự kiện Socket bằng cách truyền biến 'io' vào
socketHandler(io);

// Cho phép nhận PORT của Render cấp, nếu không có thì mới dùng 5000 ở local
const PORT = process.env.PORT || 5000;

// ⚠️ LƯU Ý QUAN TRỌNG: Đổi từ app.listen() sang server.listen() thì Socket mới hoạt động!
server.listen(PORT, () => {
    console.log(`🚀 Server & Socket.io đang chạy mượt mà tại cổng ${PORT}`);
});