import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ username: '', room: '' });
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        if (!formData.username.trim() || !formData.room.trim()) {
            alert("Vui lòng nhập đầy đủ tên và phòng!");
            return;
        }

        // Tạo id ngẫu nhiên cho user
        const user = {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            username: formData.username
        };

        // Lưu thông tin vào localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('room', formData.room);

        // Chuyển hướng người dùng vào trang Chat chính
        navigate('/chat');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #fdf2f8, #fce7f3, #fdf2f8)', fontFamily: "'Inter', sans-serif", margin: 0, padding: 0 }}>
            <div style={{ maxWidth: '400px', width: '90%', padding: '40px', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '24px', boxShadow: '0 10px 25px rgba(244, 114, 182, 0.2)', border: '1px solid #fbcfe8' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>🌸</div>
                    <h2 style={{ margin: 0, color: '#be185d', fontSize: '24px', fontWeight: 'bold' }}>Chat Hoa Anh Đào</h2>
                    <p style={{ color: '#ec4899', margin: '5px 0 0 0', fontSize: '14px' }}>Tham gia phòng trò chuyện ngay</p>
                </div>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#831843', fontWeight: 'bold', fontSize: '14px' }}>Tên hiển thị:</label>
                        <input type="text" placeholder="Ví dụ: Hải Nam" style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px', border: '1px solid #fbcfe8', outline: 'none', background: '#fff', color: '#475569', boxShadow: 'inset 0 2px 4px rgba(251,207,232,0.3)' }} required
                            onChange={e => setFormData({ ...formData, username: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#831843', fontWeight: 'bold', fontSize: '14px' }}>Tên phòng chat:</label>
                        <input type="text" placeholder="Ví dụ: Phong-123" style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px', border: '1px solid #fbcfe8', outline: 'none', background: '#fff', color: '#475569', boxShadow: 'inset 0 2px 4px rgba(251,207,232,0.3)' }} required
                            onChange={e => setFormData({ ...formData, room: e.target.value })} />
                    </div>
                    <button type="submit" style={{ width: '100%', boxSizing: 'border-box', padding: '14px', background: 'linear-gradient(to right, #fb7185, #f472b6)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 10px rgba(244, 114, 182, 0.4)', transition: 'transform 0.2s' }}>Bắt Đầu Trò Chuyện</button>
                </form>
            </div>
        </div>
    );
}

export default Login;