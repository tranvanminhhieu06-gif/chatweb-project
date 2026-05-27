const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }, // Tin nhắn thuộc phòng nào
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ai là người gửi
    text: { type: String, required: true, trim: true }, // Nội dung chữ
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);