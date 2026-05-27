const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// [GET] /api/chat/messages/:roomId
router.get('/messages/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        const { before } = req.query; // Mốc thời gian tin nhắn cũ nhất mà client đang có

        const limit = 20; // Mỗi lần chỉ lấy đúng 20 tin
        let query = { room: roomId };

        // Nếu client gửi lên mốc "before", chỉ tìm các tin nhắn có thời gian tạo ra TRƯỚC mốc đó
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 }) // Sắp xếp ngược từ tin mới nhất về cũ nhất để lấy đoạn gối đầu
            .limit(limit);

        // Đảo ngược lại mảng để khi trả về client tin nhắn vẫn theo đúng thứ tự thời gian tăng dần
        res.status(200).json(messages.reverse());
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tải lịch sử tin nhắn', error: error.message });
    }
});

module.exports = router;