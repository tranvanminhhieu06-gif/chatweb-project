const Room = require('../models/Room');

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().sort({ createdAt: -1 });
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách phòng', error: error.message });
    }
};

const createRoom = async (req, res) => {
    try {
        const { roomName } = req.body;
        if (!roomName) {
            return res.status(400).json({ message: 'Vui lòng nhập tên phòng.' });
        }
        
        let room = await Room.findOne({ roomName });
        if (room) {
            return res.status(200).json({ message: 'Phòng đã tồn tại', room });
        }

        room = await Room.create({ roomName });
        res.status(201).json({ message: 'Tạo phòng thành công', room });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo phòng', error: error.message });
    }
};

module.exports = { getRooms, createRoom };
