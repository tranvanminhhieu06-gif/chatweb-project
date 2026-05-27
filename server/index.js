require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/userRoutes');
const socketHandler = require('./sockets/socketHandler');

const app = express();

connectDB();

// Middlewares cơ bản
app.use(cors({
    origin: ["http://localhost:5173", "https://ten-app-frontend-cua-ban.vercel.app"],
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/rooms', roomRoutes);

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