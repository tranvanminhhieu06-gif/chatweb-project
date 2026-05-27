import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
            setError("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        setLoading(true);
        try {
            const response = await API.post('/auth/register', formData);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            navigate('/rooms');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #fdf2f8, #fce7f3, #fdf2f8)', fontFamily: "'Inter', sans-serif", margin: 0, padding: 0 }}>
            <div style={{ maxWidth: '400px', width: '90%', padding: '40px', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '24px', boxShadow: '0 10px 25px rgba(244, 114, 182, 0.2)', border: '1px solid #fbcfe8' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>🌸</div>
                    <h2 style={{ margin: 0, color: '#be185d', fontSize: '24px', fontWeight: 'bold' }}>Đăng Ký</h2>
                    <p style={{ color: '#ec4899', margin: '5px 0 0 0', fontSize: '14px' }}>Tạo tài khoản mới</p>
                </div>

                {error && <div style={{ color: '#e11d48', background: '#ffe4e6', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#831843', fontWeight: 'bold', fontSize: '14px' }}>Tên hiển thị:</label>
                        <input type="text" placeholder="Ví dụ: Hải Nam" value={formData.username} style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px', border: '1px solid #fbcfe8', outline: 'none', background: '#fff', color: '#475569', boxShadow: 'inset 0 2px 4px rgba(251,207,232,0.3)' }} required
                            onChange={e => setFormData({ ...formData, username: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#831843', fontWeight: 'bold', fontSize: '14px' }}>Email:</label>
                        <input type="email" placeholder="Ví dụ: name@example.com" value={formData.email} style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px', border: '1px solid #fbcfe8', outline: 'none', background: '#fff', color: '#475569', boxShadow: 'inset 0 2px 4px rgba(251,207,232,0.3)' }} required
                            onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#831843', fontWeight: 'bold', fontSize: '14px' }}>Mật khẩu:</label>
                        <input type="password" placeholder="Nhập mật khẩu" value={formData.password} style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px', border: '1px solid #fbcfe8', outline: 'none', background: '#fff', color: '#475569', boxShadow: 'inset 0 2px 4px rgba(251,207,232,0.3)' }} required
                            onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    </div>

                    <button type="submit" disabled={loading} style={{ width: '100%', boxSizing: 'border-box', padding: '14px', background: 'linear-gradient(to right, #fb7185, #f472b6)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 10px rgba(244, 114, 182, 0.4)', transition: 'transform 0.2s', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                    </button>
                </form>
                
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#831843' }}>
                    Đã có tài khoản? <Link to="/login" style={{ color: '#ec4899', fontWeight: 'bold', textDecoration: 'none' }}>Đăng nhập ngay</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;