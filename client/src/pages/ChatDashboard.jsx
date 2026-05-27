import React, { useState, useEffect, useContext, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import API from '../services/api'; // Đảm bảo đã import instance axios của bạn
import axios from 'axios'; // Dùng cho hàm upload ảnh lên Cloudinary

function ChatDashboard() {
    const socket = useContext(SocketContext);

    // Khởi tạo thông tin cá nhân từ localStorage
    const [currentUser, setCurrentUser] = useState(() => {
        return JSON.parse(localStorage.getItem('user')) || { id: 'ANON', username: 'Ẩn danh' };
    });

    const [currentRoomId, setCurrentRoomId] = useState('ROOM_ID_TEST_123');
    const [messages, setMessages] = useState([]);
    const [textInput, setTextInput] = useState('');

    // Các State quản lý trạng thái Real-time (Giai đoạn 6)
    const [listOnline, setListOnline] = useState([]);
    const [isSomeoneTyping, setIsSomeoneTyping] = useState(false);
    const [typingUser, setTypingUser] = useState('');

    // Các State & Ref quản lý Cuộn vô hạn (Giai đoạn 7)
    const typingTimeoutRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // 📄 HÀM TẢI LỊCH SỬ TIN NHẮN GỐI ĐẦU (Infinite Scroll)
    const loadMoreMessages = async () => {
        if (isLoadingMore || !hasMore || messages.length === 0) return;

        setIsLoadingMore(true);
        const oldestMessageTime = messages[0].createdAt;

        try {
            const res = await API.get(`/chat/messages/${currentRoomId}?before=${oldestMessageTime}`);

            if (res.data.length === 0) {
                setHasMore(false);
                return;
            }

            // Lưu lại chiều cao khung chat trước khi đắp dữ liệu mới
            const previousScrollHeight = chatContainerRef.current.scrollHeight;

            setMessages((prevMessages) => [...res.data, ...prevMessages]);

            // Giữ nguyên vị trí cuộn màn hình cho người dùng
            setTimeout(() => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop =
                        chatContainerRef.current.scrollHeight - previousScrollHeight;
                }
            }, 0);

        } catch (error) {
            console.error('Lỗi khi tải gối đầu lịch sử tin nhắn:', error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    // Hàm bắt sự kiện cuộn chuột
    const handleScroll = () => {
        if (!chatContainerRef.current) return;

        if (chatContainerRef.current.scrollTop === 0) {
            loadMoreMessages();
        }
    };

    // 📡 ĐĂNG KÝ CÁC CỔNG LẮNG NGHE SOCKET.IO
    useEffect(() => {
        if (!socket) return;

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

    // ✍️ XỬ LÝ DEBOUNCE KHI GÕ CHỮ (Typing Indicator)
    const handleInputChange = (e) => {
        setTextInput(e.target.value);
        if (!socket) return;

        socket.emit('typing', { room: currentRoomId, user: currentUser.username });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { room: currentRoomId });
        }, 1500);
    };

    // 📸 XỬ LÝ UPLOAD VÀ GỬI ẢNH QUA CLOUDINARY
    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !socket) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default'); // Thay bằng upload preset Unsigned của bạn

        try {
            const cloudName = 'duomsfguv'; // Thay bằng Cloud Name trên Atlas/Cloudinary của bạn
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);

            const imageUrl = res.data.secure_url;

            socket.emit('send_message', {
                room: currentRoomId,
                sender: currentUser.id,
                text: imageUrl,
                isImage: true
            });
        } catch (error) {
            console.error('Lỗi khi tải ảnh lên Cloudinary:', error);
        }
    };

    // LÈNH GỬI TIN NHẮN CHỮ THÔNG THƯỜNG
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!textInput.trim() || !socket) return;

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        socket.emit('stop_typing', { room: currentRoomId });

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

                {/* Khu vực hiển thị tin nhắn (Gắn Ref và sự kiện cuộn chuột ở đây) */}
                <div
                    ref={chatContainerRef}
                    onScroll={handleScroll}
                    style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '15px', overflowY: 'auto', marginBottom: '10px', background: '#fafafa' }}
                >
                    {/* Hiển thị dòng trạng thái loading gối đầu */}
                    {isLoadingMore && (
                        <div style={{ textAlign: 'center', color: '#888', fontSize: '13px', margin: '5px 0' }}>
                            🔄 Đang tải tin nhắn cũ...
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div key={msg._id || index} style={{
                            textAlign: msg.sender === currentUser.id ? 'right' : 'left',
                            margin: '8px 0'
                        }}>
                            {/* KIỂM TRA ĐIỀU KIỆN RENDER: Nếu là ảnh thì render thẻ <img>, ngược lại render text <span> */}
                            {msg.isImage ? (
                                <img
                                    src={msg.text}
                                    alt="Sent content"
                                    style={{ maxWidth: '250px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'inline-block' }}
                                />
                            ) : (
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
                            )}
                        </div>
                    ))}

                    {/* HIỂN THỊ HIỆU ỨNG TYPING INDICATOR */}
                    {isSomeoneTyping && (
                        <div style={{ textAlign: 'left', color: '#888', fontStyle: 'italic', margin: '10px 0' }}>
                            ✍️ {typingUser} đang gõ tin nhắn...
                        </div>
                    )}
                </div>

                {/* Thanh điều khiển gõ tin và Đính kèm đa phương tiện */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* Nút đính kèm hình ảnh */}
                    <label style={{ background: '#eee', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        📷 Ảnh
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadImage}
                            style={{ display: 'none' }}
                        />
                    </label>

                    <form onSubmit={handleSendMessage} style={{ display: 'flex', flex: 1, gap: '10px' }}>
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
        </div>
    );
}

export default ChatDashboard;