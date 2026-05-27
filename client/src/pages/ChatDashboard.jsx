import React, { useState, useEffect, useContext, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';

function ChatDashboard() {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);
    const [currentRoomId, setCurrentRoomId] = useState('');
    const [messages, setMessages] = useState([]);
    const [textInput, setTextInput] = useState('');

    const [listOnline, setListOnline] = useState([]);
    const [isSomeoneTyping, setIsSomeoneTyping] = useState(false);
    const [typingUser, setTypingUser] = useState('');

    const typingTimeoutRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Lấy thông tin từ localStorage khi vừa vào trang
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedRoom = localStorage.getItem('room');

        if (!storedUser || !storedRoom) {
            navigate('/login');
            return;
        }

        setCurrentUser(JSON.parse(storedUser));
        setCurrentRoomId(storedRoom);
    }, [navigate]);

    // Cuộn tự động xuống cuối khi có tin nhắn mới
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isSomeoneTyping]);

    // 📡 ĐĂNG KÝ CÁC CỔNG LẮNG NGHE SOCKET.IO
    useEffect(() => {
        if (!socket || !currentRoomId) return;

        socket.emit('join_room', currentRoomId);

        socket.on('receive_message', (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        socket.on('user_status_change', (data) => {
            setListOnline(data.onlineUsers);
        });

        socket.on('user_typing', (data) => {
            if (data.room === currentRoomId) {
                setIsSomeoneTyping(true);
                setTypingUser(data.user);
            }
        });

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

    const handleInputChange = (e) => {
        setTextInput(e.target.value);
        if (!socket || !currentUser) return;

        socket.emit('typing', { room: currentRoomId, user: currentUser.username });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { room: currentRoomId });
        }, 1500);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!textInput.trim() || !socket || !currentUser) return;

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        socket.emit('stop_typing', { room: currentRoomId });

        socket.emit('send_message', {
            room: currentRoomId,
            sender: currentUser.username,
            text: textInput
        });

        setTextInput('');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('room');
        if (socket) {
            socket.disconnect();
        }
        navigate('/login');
    };

    if (!currentUser) return <div>Đang tải...</div>;

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: "'Inter', sans-serif", background: '#fdf2f8', color: '#334155' }}>
            {/* 1. Sidebar trái */}
            <div style={{ width: '30%', borderRight: '1px solid #fbcfe8', padding: '20px', background: 'linear-gradient(to bottom, #fff0f5, #ffe4e1)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ paddingBottom: '20px', borderBottom: '1px solid #fbcfe8', marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#be185d' }}>Xin chào, {currentUser.username}!</h3>
                    <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#fff', color: '#be185d', border: '1px solid #fbcfe8', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Rời phòng</button>
                </div>
                
                <h3 style={{ margin: '0 0 10px 0' }}>Phòng Đang Tham Gia</h3>
                <div style={{ padding: '15px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(244,114,182,0.1)', cursor: 'pointer', marginBottom: '20px', border: '1px solid #fbcfe8', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>🌸</span> 
                    <b style={{ color: '#be185d', fontSize: '16px' }}>{currentRoomId}</b>
                </div>

                <h4 style={{ marginTop: 'auto', marginBottom: '10px' }}>Trạng thái server:</h4>
                <div style={{ fontSize: '12px', color: '#888' }}>
                    *Đây là phòng chat thời gian thực riêng tư. Tin nhắn sẽ không được lưu lại khi tải lại trang để đảm bảo bảo mật.
                </div>
            </div>

            {/* 2. Khung Chat phải */}
            <div style={{ width: '70%', display: 'flex', flexDirection: 'column', padding: '20px' }}>
                <div style={{ paddingBottom: '15px', borderBottom: '1px solid #fbcfe8', marginBottom: '15px' }}>
                    <h2 style={{ margin: 0, color: '#be185d' }}>Khu Vực Trò Chuyện</h2>
                </div>

                {/* Khu vực hiển thị tin nhắn */}
                <div
                    ref={chatContainerRef}
                    style={{ flex: 1, border: '1px solid #fbcfe8', borderRadius: '16px', padding: '20px', overflowY: 'auto', marginBottom: '20px', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: 'inset 0 2px 10px rgba(251, 207, 232, 0.3)' }}
                >
                    {messages.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '50px' }}>
                            🌸 Chưa có tin nhắn nào. Hãy là người đầu tiên gửi lời chào!
                        </div>
                    )}
                    {messages.map((msg, index) => {
                        const isMine = msg.sender === currentUser.username;
                        return (
                            <div key={msg._id || index} style={{
                                textAlign: isMine ? 'right' : 'left',
                                margin: '12px 0',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isMine ? 'flex-end' : 'flex-start'
                            }}>
                                <span style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', padding: '0 4px' }}>
                                    {isMine ? 'Bạn' : msg.sender}
                                </span>
                                <span style={{
                                    background: isMine ? 'linear-gradient(135deg, #f472b6, #fb7185)' : '#ffffff',
                                    color: isMine ? '#fff' : '#475569',
                                    padding: '12px 18px',
                                    borderRadius: isMine ? '16px 16px 0 16px' : '16px 16px 16px 0',
                                    display: 'inline-block',
                                    boxShadow: '0 4px 6px rgba(251, 207, 232, 0.4)',
                                    border: isMine ? 'none' : '1px solid #fbcfe8',
                                    maxWidth: '70%',
                                    wordWrap: 'break-word'
                                }}>
                                    {msg.text}
                                </span>
                            </div>
                        );
                    })}

                    {isSomeoneTyping && (
                        <div style={{ textAlign: 'left', color: '#f472b6', fontStyle: 'italic', margin: '10px 0', fontSize: '13px' }}>
                            🌸 {typingUser} đang gõ...
                        </div>
                    )}
                </div>

                {/* Thanh điều khiển gõ tin */}
                <div>
                    <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '15px' }}>
                        <input
                            type="text"
                            value={textInput}
                            onChange={handleInputChange}
                            placeholder="Nhập tin nhắn ngọt ngào..."
                            style={{ flex: 1, padding: '16px 20px', borderRadius: '12px', border: '1px solid #fbcfe8', outline: 'none', background: '#fff', boxShadow: '0 4px 10px rgba(251,207,232,0.2)', fontSize: '15px' }}
                        />
                        <button type="submit" style={{ padding: '0 30px', background: 'linear-gradient(to right, #fb7185, #f472b6)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(244, 114, 182, 0.3)', transition: 'transform 0.2s', fontSize: '15px' }}>
                            Gửi
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChatDashboard;