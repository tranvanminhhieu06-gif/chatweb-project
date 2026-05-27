const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomName: { type: String, trim: true }, // Tên nhóm (nếu là chat nhóm)
    isGroup: { type: Boolean, default: false }, // true: chat nhóm, false: chat đôi (1vs1)
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Danh sách người trong phòng
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' } // Dùng để hiển thị bản xem trước ở Sidebar
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);