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
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Định tuyến API HTTP thông thường (Đăng ký / Đăng nhập)
app.use('/api/auth', authRoutes);

// 4. Tạo một HTTP Server bằng Express
const server = http.createServer(app);

// 5. Khởi tạo cấu hình cho Socket.io Server (Cấp quyền CORS cho Frontend nhận diện)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// 6. Kích hoạt bộ lắng nghe sự kiện Socket bằng cách truyền biến 'io' vào
socketHandler(io);

const PORT = process.env.PORT || 5000;

// ⚠️ LƯU Ý QUAN TRỌNG: Đổi từ app.listen() sang server.listen() thì Socket mới hoạt động!
server.listen(PORT, () => {
    console.log(`🚀 Server & Socket.io đang chạy mượt mà tại cổng ${PORT}`);
});