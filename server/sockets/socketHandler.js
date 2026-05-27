const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Room = require('../models/Room');

// Object lưu trữ danh sách user đang online ngầm trên RAM server { userId: socketId }
const onlineUsers = {};

module.exports = (io) => {
    io.use((socket, next) => {
        // Lấy token được gửi kèm từ Frontend qua mục auth
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication error: Không tìm thấy Token bảo mật!"));
        }

        try {
            // Giải mã và kiểm tra tính hợp lệ của Token với JWT_SECRET trong file .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Gắn thông tin User đã được xác thực trực tiếp vào thực thể socket để các hàm bên dưới dùng luôn
            socket.user = decoded;
            next(); // Token hợp lệ, mở cửa cho đi tiếp
        } catch (err) {
            return next(new Error("Authentication error: Token không hợp lệ hoặc đã hết hạn!"));
        }
    });
    io.on('connection', (socket) => {
        console.log(`⚡ Kết nối mới: ${socket.id}`);

        // 1. ĐỊNH DANH & TRẠNG THÁI ONLINE
        socket.on('setup_user', (userId) => {
            socket.join(userId);

            // Lưu userId vào danh sách online
            onlineUsers[userId] = socket.id;

            // Phát tín hiệu thông báo cho TẤT CẢ mọi người biết user này vừa Online
            io.emit('user_status_change', { onlineUsers: Object.keys(onlineUsers) });
            console.log(`🟢 User [${userId}] đang Online.`);
        });

        // 2. PHÂN CHIA PHÒNG CHAT (JOIN ROOM)
        socket.on('join_room', (roomId) => {
            // Trước khi vào phòng mới, có thể rời khỏi phòng cũ nếu muốn (tùy chọn tối ưu)
            socket.join(roomId);
            console.log(`🚪 Phòng [${roomId}] có thêm kết nối từ: ${socket.id}`);
        });

        // CORE LOGIC: Nhận và gửi tin nhắn trong phòng chỉ định (io.to)
        socket.on('send_message', async (data) => {
            const { room, sender, text } = data;
            try {
                const newMessage = await Message.create({ room, sender, text });
                await Room.findByIdAndUpdate(room, { lastMessage: newMessage._id });

                const messageToSend = {
                    _id: newMessage._id,
                    room,
                    sender,
                    text,
                    createdAt: newMessage.createdAt
                };

                // ⚠️ CHỈ PHÁT TIN NHẮN ĐẾN NHỮNG AI ĐANG Ở TRONG PHÒNG NÀY
                io.to(room).emit('receive_message', messageToSend);
            } catch (error) {
                console.error("Lỗi gửi tin nhắn:", error);
            }
        });

        // 3. TÍNH NĂNG "AI ĐÓ ĐANG NHẬP TIN NHẮN..."
        // Lắng nghe khi đang gõ chữ
        socket.on('typing', (data) => {
            // Gửi thông báo tới tất cả mọi người TRONG PHÒNG trừ chính người gõ (broadcast)
            socket.to(data.room).emit('user_typing', { room: data.room, user: data.user });
        });

        // Lắng nghe khi dừng gõ chữ
        socket.on('stop_typing', (data) => {
            socket.to(data.room).emit('user_stop_typing', { room: data.room });
        });

        // 4. XỬ LÝ KHI NGẮT KẾT NỐI (OFFLINE)
        socket.on('disconnect', () => {
            // Tìm và xóa userId ra khỏi object onlineUsers khi họ tắt web
            for (let userId in onlineUsers) {
                if (onlineUsers[userId] === socket.id) {
                    delete onlineUsers[userId];
                    console.log(`🔴 User [${userId}] đã Offline.`);
                    break;
                }
            }
            // Cập nhật lại danh sách online mới cho các Client khác thay đổi giao diện
            io.emit('user_status_change', { onlineUsers: Object.keys(onlineUsers) });
            console.log(`❌ Kết nối đóng: ${socket.id}`);
        });
    });
};