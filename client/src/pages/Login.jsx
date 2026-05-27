import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Khôi phục email nếu người dùng đã chọn Ghi nhớ thông tin
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
        
        // Tự động chuyển hướng nếu đã có token
        const token = localStorage.getItem('token');
        if (token) {
             navigate('/rooms');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!formData.email.trim() || !formData.password.trim()) {
            setError("Vui lòng nhập đầy đủ email và mật khẩu!");
            return;
        }

        setLoading(true);
        try {
            const response = await API.post('/auth/login', formData);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            navigate('/rooms');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #fdf2f8, #fce7f3, #fdf2f8)', fontFamily: "'Inter', sans-serif", margin: 0, padding: 0 }}>
            <div style={{ maxWidth: '400px', width: '90%', padding: '40px', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '24px', boxShadow: '0 10px 25px rgba(244, 114, 182, 0.2)', border: '1px solid #fbcfe8' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>🌸</div>
                    <h2 style={{ margin: 0, color: '#be185d', fontSize: '24px', fontWeight: 'bold' }}>Đăng Nhập</h2>
                    <p style={{ color: '#ec4899', margin: '5px 0 0 0', fontSize: '14px' }}>Chào mừng bạn quay trở lại</p>
                </div>

                {error && <div style={{ color: '#e11d48', background: '#ffe4e6', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#831843', fontWeight: 'bold', fontSize: '14px' }}>Email:</label>
                        <input type="email" placeholder="Ví dụ: name@example.com" value={formData.email} style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px', border: '1px solid #fbcfe8', outline: 'none', background: '#fff', color: '#475569', boxShadow: 'inset 0 2px 4px rgba(251,207,232,0.3)' }} required
                            onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#831843', fontWeight: 'bold', fontSize: '14px' }}>Mật khẩu:</label>
                        <input type="password" placeholder="Nhập mật khẩu" value={formData.password} style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px', border: '1px solid #fbcfe8', outline: 'none', background: '#fff', color: '#475569', boxShadow: 'inset 0 2px 4px rgba(251,207,232,0.3)' }} required
                            onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    </div>

                    <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
                        <input type="checkbox" id="remember" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ marginRight: '8px', accentColor: '#fb7185' }} />
                        <label htmlFor="remember" style={{ color: '#831843', fontSize: '14px', cursor: 'pointer' }}>Ghi nhớ thông tin</label>
                    </div>

                    <button type="submit" disabled={loading} style={{ width: '100%', boxSizing: 'border-box', padding: '14px', background: 'linear-gradient(to right, #fb7185, #f472b6)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 10px rgba(244, 114, 182, 0.4)', transition: 'transform 0.2s', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                    </button>
                </form>
                
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#831843' }}>
                    Chưa có tài khoản? <Link to="/register" style={{ color: '#ec4899', fontWeight: 'bold', textDecoration: 'none' }}>Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;