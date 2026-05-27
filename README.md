<div align="center">
  <img src="https://img.icons8.com/?size=512&id=v9e0fFz0hWv2&format=png" alt="Cherry Blossom Logo" width="100"/>

  # 🌸 Chat Hoa Anh Đào (Cherry Blossom Chat) 🌸

  *Một ứng dụng trò chuyện thời gian thực với giao diện lãng mạn, ngọt ngào và tối giản.*
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

<br />

## 📖 Giới thiệu
**Chat Hoa Anh Đào** là một dự án ứng dụng trò chuyện thời gian thực (Real-time Chat App) được xây dựng với mục tiêu mang lại trải nghiệm mượt mà, riêng tư và có tính thẩm mỹ cao. Lấy cảm hứng từ vẻ đẹp của hoa anh đào, giao diện được thiết kế với tông màu gradient hồng phấn, hiệu ứng kính mờ (glassmorphism) và các tiểu tiết bóng bẩy để tạo nên một không gian chat thư giãn tuyệt đối.

## ✨ Tính năng nổi bật
- **⚡ Real-time Messaging:** Gửi và nhận tin nhắn ngay lập tức không có độ trễ nhờ sức mạnh của Socket.IO.
- **🎨 Giao diện Cherry Blossom:** Thiết kế UI/UX ấn tượng, hiện đại với TailwindCSS và Vanilla CSS kết hợp.
- **👀 Nhận diện trạng thái gõ phím:** Hiển thị *"... đang gõ"* (Typing Indicator) theo thời gian thực.
- **🚪 Quản lý phòng Chat (Room):** Hỗ trợ tạo và tham gia các phòng chat riêng biệt. Chỉ những người trong cùng một phòng mới có thể nhìn thấy tin nhắn của nhau.
- **🚀 Volatile Chat (Quyền riêng tư cao):** Tin nhắn chỉ lưu trên bộ nhớ tạm (RAM) của máy chủ và sẽ biến mất khi người dùng tải lại trang, đảm bảo tối đa quyền riêng tư (áp dụng cho chế độ chat nhanh).

## 🛠️ Công nghệ sử dụng

### Frontend (Client)
- **Framework:** React.js (Vite)
- **Styling:** CSS3, Tailwind CSS (qua CDN ở trang đích)
- **Router:** React Router v6
- **Real-time:** Socket.IO-Client

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-time:** Socket.IO
- **Database:** MongoDB (Đang được quy hoạch để lưu trữ dữ liệu vĩnh viễn trong tương lai)

## 🚀 Cài đặt và Chạy dự án (Local)

Để chạy dự án trên máy của bạn, hãy đảm bảo bạn đã cài đặt sẵn **Node.js** và **npm**.

### 1. Clone dự án
```bash
git clone https://github.com/tranvanminhhieu06-gif/chatweb-project.git
cd chatweb-project
```

### 2. Cài đặt và chạy Backend (Server)
Mở một terminal mới và chạy:
```bash
cd server
npm install
npm run start
# Server mặc định sẽ chạy ở cổng 5000 (http://localhost:5000)
```

### 3. Cài đặt và chạy Frontend (Client)
Mở một terminal khác và chạy:
```bash
cd client
npm install
npm run dev
# Vite sẽ khởi động Frontend, thường là ở http://localhost:5173
```

## 📁 Cấu trúc thư mục

```text
chatweb-project/
├── client/                 # Mã nguồn Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Các thành phần giao diện nhỏ lẻ
│   │   ├── context/        # Chứa SocketContext để quản lý kết nối
│   │   ├── pages/          # Các trang chính (Login, ChatDashboard...)
│   │   ├── services/       # Cấu hình gọi API (Axios)
│   │   └── App.jsx         # Component gốc quản lý Routing
│   └── package.json
├── server/                 # Mã nguồn Backend (Node.js + Express)
│   ├── config/             # Cấu hình kết nối CSDL
│   ├── controllers/        # Xử lý logic API
│   ├── models/             # Schema cho MongoDB (User, Room, Message)
│   ├── routes/             # Định tuyến API
│   ├── sockets/            # Logic xử lý Socket.IO (socketHandler.js)
│   ├── index.js            # Entry point của server
│   └── package.json
├── index.html              # Trang giới thiệu (Landing Page)
└── style.css               # File CSS dùng chung cho Landing Page
```

## 🤝 Đóng góp
Mọi ý kiến đóng góp, báo cáo lỗi (issues) hoặc pull requests (PR) đều được chào đón! 
Hãy mở một Issue mới trên GitHub để thảo luận về những thay đổi bạn muốn mang đến.

---
*Được phát triển với ❤️ và sự sáng tạo!*
