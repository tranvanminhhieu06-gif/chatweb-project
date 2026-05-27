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

            // 1. Chỉ kết nối Socket khi người dùng đã có danh tính (đăng nhập thành công)
            const newSocket = io("http://localhost:5000");
            setSocket(newSocket);

            // 2. Gửi (emit) sự kiện "setup_user" kèm User ID lên server để định danh
            newSocket.emit('setup_user', user.id);

            // Hàm dọn dẹp (cleanup): Tự động ngắt kết nối Socket khi người dùng tắt ứng dụng
            return () => {
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