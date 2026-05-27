import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Khởi tạo Context
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Lấy thông tin user từ localStorage (được set ở trang Login)
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            const user = JSON.parse(storedUser);

            // Kết nối Socket trực tiếp không cần Token (Phiên bản tối giản)
            // Thay bằng URL thật của bạn nếu deploy, hoặc để io("http://localhost:5000") khi chạy local
            const newSocket = io("http://localhost:5000", { 
                autoConnect: true 
            });

            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('📶 Socket kết nối thành công!');
                newSocket.emit('setup_user', user.username);
            });

            newSocket.on('connect_error', (err) => {
                console.error('🔒 Lỗi kết nối Socket:', err.message);
            });

            return () => {
                newSocket.off('connect');
                newSocket.off('connect_error');
                newSocket.disconnect();
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, []); // Chạy 1 lần duy nhất khi ứng dụng được tải lên lần đầu

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};