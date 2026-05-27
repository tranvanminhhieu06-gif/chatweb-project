import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Khởi tạo Context
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Kiểm tra xem người dùng đã đăng nhập chưa từ localStorage
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            const user = JSON.parse(storedUser);
            const token = user ? user.token : null; // Bốc tách JWT Token được lưu từ API Đăng nhập

            // 1. Gửi kèm Token vào cấu hình 'auth' để vượt qua chốt chặn bảo mật của Server
            const newSocket = io("https://chatweb-server-hieu.onrender.com", {
                auth: {
                    token: token
                },
                autoConnect: true // Tự động kích hoạt kết nối an toàn
            });

            setSocket(newSocket);

            // 2. CHUẨN HOÁ LOGIC: Đợi Socket kết nối thành công (Xác thực JWT xong) rồi mới định danh user
            newSocket.on('connect', () => {
                console.log('📶 Socket đã vượt qua kiểm tra JWT và kết nối thành công!');
                newSocket.emit('setup_user', user.id);
            });

            // Lắng nghe nếu có lỗi xác thực (Token sai hoặc hết hạn) trả về từ Middleware Server
            newSocket.on('connect_error', (err) => {
                console.error('🔒 Lỗi bảo mật Socket:', err.message);
                // Bạn có thể xử lý xóa localStorage hoặc đá user về trang Login ở đây nếu Token hết hạn
            });

            // Hàm dọn dẹp (cleanup): Tự động ngắt kết nối Socket khi người dùng tắt ứng dụng
            return () => {
                newSocket.off('connect');
                newSocket.off('connect_error');
                newSocket.disconnect();
            };
        } else {
            // Nếu không tìm thấy thông tin đăng nhập, đảm bảo Socket cũ đã được ngắt kết nối hoàn toàn
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, []); // Chạy 1 lần duy nhất khi ứng dụng được tải lên lần đầu

    return (
        // Chia sẻ thực thể 'socket' này cho toàn bộ hệ thống Frontend sử dụng
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};