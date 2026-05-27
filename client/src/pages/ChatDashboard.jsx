import React, { useState, useEffect, useContext, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';

function ChatDashboard() {
    const socket = useContext(SocketContext);

    // Khởi tạo thông tin cá nhân từ localStorage
    const [currentUser, setCurrentUser] = useState(() => {
        return JSON.parse(localStorage.getItem('user')) || { id: 'ANON', username: 'Ẩn danh' };
    });

    const [currentRoomId, setCurrentRoomId] = useState('ROOM_ID_TEST_123');
    const [messages, setMessages] = useState([]);
    const [textInput, setTextInput] = useState('');

    // Các State mới cho Giai đoạn 6
    const [listOnline, setListOnline] = useState([]); // Lưu mảng các userId đang online
    const [isSomeoneTyping, setIsSomeoneTyping] = useState(false); // Trạng thái hiển thị dấu 3 chấm
    const [typingUser, setTypingUser] = useState(''); // Tên người đang gõ chữ

    const typingTimeoutRef = useRef(null); // Quản lý thời gian dừng gõ (Debounce)

    useEffect(() => {
        if (!socket) return;

        // Vào phòng chat chỉ định
        socket.emit('join_room', currentRoomId);

        // Lắng nghe tin nhắn mới
        socket.on('receive_message', (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        // A. Lắng nghe cập nhật trạng thái Online / Offline từ server
        socket.on('user_status_change', (data) => {
            setListOnline(data.onlineUsers);
        });

        // B. Lắng nghe tín hiệu gõ chữ từ bạn bè
        socket.on('user_typing', (data) => {
            if (data.room === currentRoomId) {
                setIsSomeoneTyping(true);
                setTypingUser(data.user);
            }
        });

        // C. Lắng nghe tín hiệu dừng gõ chữ
        socket.on('user_stop_typing', (data) => {
            if (data.room === currentRoomId) {
                setIsSomeoneTyping(false);
                setTypingUser('');
            }
        });

        return () => {
            socket.off('receive_message');
            socket.off('user_status_change');
            socket.off('user_typing');
            socket.off('user_stop_typing');
        };
    }, [socket, currentRoomId]);

    // XỬ LÝ KHI NGƯỜI DÙNG ĐANG GÕ CHỮ (Xây dựng bộ Debounce)
    const handleInputChange = (e) => {
        setTextInput(e.target.value);
        if (!socket) return;

        // Phát tín hiệu "Tôi đang gõ chữ nè" lên Server
        socket.emit('typing', { room: currentRoomId, user: currentUser.username });

        // Xóa bộ đếm thời gian cũ đi nếu người dùng vẫn đang tiếp tục bấm phím
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Tạo một bộ đếm thời gian mới: Nếu sau 1.5 giây không gõ nữa -> Bắn lệnh dừng gõ
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { room: currentRoomId });
        }, 1500);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!textInput.trim() || !socket) return;

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        socket.emit('stop_typing', { room: currentRoomId }); // Gửi tin nhắn xong thì tắt trạng thái gõ luôn

        socket.emit('send_message', {
            room: currentRoomId,
            sender: currentUser.id,
            text: textInput
        });

        setTextInput('');
    };

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
            {/* 1. Sidebar trái: Danh sách phòng & Trạng thái bạn bè */}
            <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '15px', background: '#f5f7fb' }}>
                <h3>Phòng Chat & Bạn Bè</h3>
                <div style={{ padding: '12px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', marginBottom: '10px' }}>
                    🟢 <b>Phòng Test Hệ Thống</b>
                </div>

                <h4 style={{ marginTop: '20px' }}>Thành viên trực tuyến:</h4>
                <ul>
                    {listOnline.map((id) => (
                        <li key={id} style={{ color: 'green', margin: '5px 0' }}>
                            👤 {id === currentUser.id ? "Bạn (Đang chạy)" : `User: ${id.substring(0, 5)}...`}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 2. Khung Chat phải */}
            <div style={{ width: '70%', display: 'flex', flexDirection: 'column', padding: '15px' }}>
                <div style={{ paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                    <h2>Hộp Thoại Real-time</h2>
                </div>

                {/* Khu vực hiển thị tin nhắn */}
                <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '15px', overflowY: 'auto', marginBottom: '10px', background: '#fafafa' }}>
                    {messages.map((msg, index) => (
                        <div key={msg._id || index} style={{
                            textAlign: msg.sender === currentUser.id ? 'right' : 'left',
                            margin: '8px 0'
                        }}>
                            <span style={{
                                background: msg.sender === currentUser.id ? '#007bff' : '#fff',
                                color: msg.sender === currentUser.id ? '#fff' : '#333',
                                padding: '10px 14px',
                                borderRadius: '12px',
                                display: 'inline-block',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                border: msg.sender === currentUser.id ? 'none' : '1px solid #e0e0e0'
                            }}>
                                {msg.text}
                            </span>
                        </div>
                    ))}

                    {/* HIỂN THỊ HIỆU ỨNG TYPING INDICATOR */}
                    {isSomeoneTyping && (
                        <div style={{ textAlign: 'left', color: '#888', fontStyle: 'italic', margin: '10px 0' }}>
                            ✍️ {typingUser} đang gõ tin nhắn...
                        </div>
                    )}
                </div>

                {/* Thanh gõ tin nhắn */}
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={textInput}
                        onChange={handleInputChange}
                        placeholder="Nhập nội dung tin nhắn..."
                        style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ padding: '12px 24px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Gửi đi
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatDashboard;