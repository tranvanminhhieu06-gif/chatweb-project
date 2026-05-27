const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// [GET] /api/chat/messages/:roomName
router.get('/messages/:roomName', async (req, res) => {
    try {
        const { roomName } = req.params;
        const { before } = req.query; // Mốc thời gian tin nhắn cũ nhất mà client đang có

        const roomDoc = await require('../models/Room').findOne({ roomName });
        if (!roomDoc) {
            return res.status(200).json([]);
        }

        const limit = 20; // Mỗi lần chỉ lấy đúng 20 tin
        let query = { room: roomDoc._id };

        if (before && before !== 'undefined') {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('sender', 'username avatar bannerColor customStatus notes createdAt');

        res.status(200).json(messages.reverse());
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tải lịch sử tin nhắn', error: error.message });
    }
});

module.exports = router;
