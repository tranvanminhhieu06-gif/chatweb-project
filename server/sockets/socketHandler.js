const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Room = require('../models/Room');

const onlineUsers = {};

module.exports = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication error: Không tìm thấy Token bảo mật!"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            return next(new Error("Authentication error: Token không hợp lệ hoặc đã hết hạn!"));
        }
    });

    io.on('connection', (socket) => {
        console.log(`⚡ Kết nối mới: ${socket.id}`);

        socket.on('setup_user', (userId) => {
            onlineUsers[userId] = socket.id;
            io.emit('user_status_change', { onlineUsers: Object.keys(onlineUsers) });
            console.log(`🟢 User [${userId}] đang Online.`);
        });

        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            console.log(`🚪 Phòng [${roomId}] có thêm kết nối từ: ${socket.id}`);
            socket.emit('user_status_change', { onlineUsers: Object.keys(onlineUsers) });
        });

        socket.on('send_message', async (data) => {
            const { room, text } = data; // room is roomName
            try {
                const userId = socket.user.id;
                
                let roomDoc = await Room.findOne({ roomName: room });
                if (!roomDoc) {
                    roomDoc = await Room.create({ roomName: room });
                }

                const userDoc = await require('../models/User').findById(userId);

                const newMessage = await Message.create({ room: roomDoc._id, sender: userId, text });
                await Room.findByIdAndUpdate(roomDoc._id, { lastMessage: newMessage._id });

                const messageToSend = {
                    _id: newMessage._id,
                    room: room,
                    sender: {
                        _id: userDoc._id,
                        username: userDoc.username,
                        avatar: userDoc.avatar,
                        bannerColor: userDoc.bannerColor,
                        customStatus: userDoc.customStatus,
                        notes: userDoc.notes,
                        createdAt: userDoc.createdAt
                    },
                    text,
                    createdAt: newMessage.createdAt
                };

                io.to(room).emit('receive_message', messageToSend);
            } catch (error) {
                console.error("Lỗi gửi tin nhắn:", error);
            }
        });

        socket.on('typing', (data) => {
            socket.to(data.room).emit('user_typing', { room: data.room, user: data.user });
        });

        socket.on('stop_typing', (data) => {
            socket.to(data.room).emit('user_stop_typing', { room: data.room });
        });

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