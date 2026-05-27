require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const socketHandler = require('./sockets/socketHandler');

const app = express();

// Middlewares cơ bản
app.use(cors({
    origin: ["http://localhost:5173", "https://ten-app-frontend-cua-ban.vercel.app"],
    credentials: true
}));
app.use(express.json());

// Tạo HTTP Server bằng Express
const server = http.createServer(app);

// Khởi tạo cấu hình cho Socket.io Server
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://ten-app-frontend-cua-ban.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Kích hoạt bộ lắng nghe sự kiện Socket
socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server & Socket.io đang chạy mượt mà tại cổng ${PORT}`);
});