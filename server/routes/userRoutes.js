const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware xác thực
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Không tìm thấy Token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

// [GET] /api/users/:username
router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// [PUT] /api/users/profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { customStatus, notes, bannerColor } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { customStatus, notes, bannerColor } },
            { new: true }
        ).select('-password');
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;
