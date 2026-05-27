// Object lưu trữ danh sách user đang online ngầm trên RAM server { userId: socketId }
const onlineUsers = {};

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`⚡ Kết nối mới: ${socket.id}`);

        // 1. ĐỊNH DANH & TRẠNG THÁI ONLINE
        socket.on('setup_user', (userId) => {
            // Lưu userId (có thể là tên người dùng) vào danh sách online
            onlineUsers[userId] = socket.id;

            // Phát tín hiệu thông báo cho TẤT CẢ mọi người biết user này vừa Online
            io.emit('user_status_change', { onlineUsers: Object.keys(onlineUsers) });
            console.log(`🟢 User [${userId}] đang Online.`);
        });

        // 2. PHÂN CHIA PHÒNG CHAT (JOIN ROOM)
        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            console.log(`🚪 Phòng [${roomId}] có thêm kết nối từ: ${socket.id}`);
        });

        // CORE LOGIC: Nhận và gửi tin nhắn trong phòng chỉ định (io.to)
        socket.on('send_message', (data) => {
            const { room, sender, text } = data;
            
            const messageToSend = {
                _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                room,
                sender, // sender lúc này là Tên hiển thị
                text,
                createdAt: new Date()
            };

            // ⚠️ CHỈ PHÁT TIN NHẮN ĐẾN NHỮNG AI ĐANG Ở TRONG PHÒNG NÀY
            io.to(room).emit('receive_message', messageToSend);
        });

        // 3. TÍNH NĂNG "AI ĐÓ ĐANG NHẬP TIN NHẮN..."
        socket.on('typing', (data) => {
            socket.to(data.room).emit('user_typing', { room: data.room, user: data.user });
        });

        socket.on('stop_typing', (data) => {
            socket.to(data.room).emit('user_stop_typing', { room: data.room });
        });

        // 4. XỬ LÝ KHI NGẮT KẾT NỐI (OFFLINE)
        socket.on('disconnect', () => {
            for (let userId in onlineUsers) {
                if (onlineUsers[userId] === socket.id) {
                    delete onlineUsers[userId];
                    console.log(`🔴 User [${userId}] đã Offline.`);
                    break;
                }
            }
            io.emit('user_status_change', { onlineUsers: Object.keys(onlineUsers) });
            console.log(`❌ Kết nối đóng: ${socket.id}`);
        });
    });
};