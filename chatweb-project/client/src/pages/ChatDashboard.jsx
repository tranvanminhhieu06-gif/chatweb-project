import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

function ChatDashboard() {
    const socket = useContext(SocketContext); // Lấy mạch máu socket từ Context ra dùng

    // Giả định dữ liệu ban đầu (Sau này bạn sẽ gọi API từ `chatController` để lấy)
    const [currentRoomId, setCurrentRoomId] = useState('ROOM_ID_TEST_123');
    const [userId, setUserId] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.id : 'USER_ID_ANONYMOUS';
    });

    const [messages, setMessages] = useState([]); // Mảng lưu danh sách tin nhắn hiển thị trên màn hình
    const [textInput, setTextInput] = useState(''); // Lưu trữ chữ người dùng đang gõ

    // Sử dụng useEffect để lắng nghe cổng nhận tin nhắn liên tục từ Server
    useEffect(() => {
        if (!socket) return;

        // Báo cho server biết mình muốn vào phòng chat này
        socket.emit('join_room', currentRoomId);

        // LẮNG NGHE SỰ KIỆN: Nhận tin nhắn real-time từ server phát về
        socket.on('receive_message', (newMessage) => {
            // Cập nhật tin nhắn mới vào mảng cũ mà không làm mất lịch sử chat hiện tại
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // Hàm dọn dẹp để tránh việc component bị đăng ký lắng nghe lặp đi lặp lại nhiều lần (Tránh nhân đôi tin nhắn)
        return () => {
            socket.off('receive_message');
        };
    }, [socket, currentRoomId]);

    // Hàm xử lý khi người dùng bấm nút "Gửi" hoặc nhấn Enter
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!textInput.trim() || !socket) return;

        // Định dạng gói dữ liệu tin nhắn gửi đi
        const messageData = {
            room: currentRoomId,
            sender: userId,
            text: textInput
        };

        // KÍCH HOẠT LỆNH GỬI REAL-TIME LÊN SERVER
        socket.emit('send_message', messageData);

        setTextInput(''); // Xóa trắng thanh nhập liệu sau khi gửi thành công
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* 1. Sidebar bên trái (Danh sách phòng) */}
            <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px' }}>
                <h3>Danh sách phòng</h3>
                <div style={{ padding: '10px', background: '#e0e0e0', cursor: 'pointer' }}>
                    Phòng Test Real-time
                </div>
            </div>

            {/* 2. Khung Chat bên phải */}
            <div style={{ width: '70%', display: 'flex', flexDirection: 'column', padding: '10px' }}>
                <h3>Hộp thoại hiển thị</h3>

                {/* Khu vực hiện bong bóng tin nhắn */}
                <div style={{ flex: 1, border: '1px solid #ddd', padding: '10px', overflowY: 'auto', marginBottom: '10px' }}>
                    {messages.map((msg, index) => (
                        <div key={msg._id || index} style={{
                            textAlign: msg.sender === userId ? 'right' : 'left',
                            margin: '5px 0'
                        }}>
                            <span style={{
                                background: msg.sender === userId ? '#dcf8c6' : '#fff',
                                padding: '8px 12px',
                                borderRadius: '10px',
                                display: 'inline-block',
                                border: '1px solid #eee'
                            }}>
                                {msg.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Thanh nhập liệu & nút gửi */}
                <form onSubmit={handleSendMessage} style={{ display: 'flex' }}>
                    <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        style={{ flex: 1, padding: '10px' }}
                    />
                    <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none' }}>
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatDashboard;