import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // File css mặc định của bạn (nếu có)
import { SocketProvider } from './context/SocketContext.jsx' // Import Provider vừa làm

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* Bọc ngoài cùng để kích hoạt dòng máu Real-time cho toàn bộ ứng dụng */}
        <SocketProvider>
            <App />
        </SocketProvider>
    </React.StrictMode>,
)