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

        if (before && before !== 'undefined') {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);

        res.status(200).json(messages.reverse());
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tải lịch sử tin nhắn', error: error.message });
    }
});

module.exports = router;
