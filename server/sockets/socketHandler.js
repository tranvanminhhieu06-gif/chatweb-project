const Message = require('../models/Message');
const Room = require('../models/Room');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`⚡ Kết nối mới: ${socket.id}`);

        // 1. Định danh User khi vừa đăng nhập
        socket.on('setup_user', (userId) => {
            socket.join(userId);
            console.log(`👤 User [${userId}] đã kích hoạt Socket.`);
        });

        // 2. Sự kiện khi User bấm chọn một phòng chat cụ thể
        socket.on('join_room', (roomId) => {
            socket.join(roomId); // Đưa Socket này vào phòng chat chung
            console.log(`🚪 Phòng chat [${roomId}] vừa có 1 thành viên mở lên.`);
        });

        // 3. CORE LOGIC: Lắng nghe tin nhắn mới từ Client gửi lên
        socket.on('send_message', async (data) => {
            const { room, sender, text } = data;

            try {
                // Bước A: Lưu tin nhắn trực tiếp vào Database trên đám mây Atlas
                const newMessage = await Message.create({ room, sender, text });

                // Đồng thời cập nhật tin nhắn cuối cùng cho phòng chat đó
                await Room.findByIdAndUpdate(room, { lastMessage: newMessage._id });

                // Gộp thêm thông tin thời gian khởi tạo để Client hiển thị
                const messageToSend = {
                    _id: newMessage._id,
                    room,
                    sender,
                    text,
                    createdAt: newMessage.createdAt
                };

                // Bước B: Phát (Emit) tin nhắn này tới TẤT CẢ các thành viên đang có mặt trong phòng
                io.to(room).emit('receive_message', messageToSend);

            } catch (error) {
                console.error("Lỗi khi xử lý tin nhắn real-time:", error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`❌ Kết nối đóng: ${socket.id}`);
        });
    });
};