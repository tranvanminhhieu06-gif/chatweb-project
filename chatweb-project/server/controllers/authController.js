const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Hàm tạo JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// [POST] /api/auth/register
const register = async (req, res) => {
    try {
        const { username, email, password, avatar } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email này đã được đăng ký tài khoản khác.' });
        }

        const user = await User.create({ username, email, password, avatar });

        res.status(201).json({
            message: 'Đăng ký tài khoản thành công!',
            token: generateToken(user._id),
            user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi đăng ký.', error: error.message });
    }
};

// [POST] /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }

        res.status(200).json({
            message: 'Đăng nhập thành công!',
            token: generateToken(user._id),
            user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi đăng nhập.', error: error.message });
    }
};

module.exports = { register, login };