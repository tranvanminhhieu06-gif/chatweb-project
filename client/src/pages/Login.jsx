import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await API.post('/auth/login', formData);

            // LƯU JWT TOKEN VÀ USER INFO VÀO LOCALSTORAGE
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            alert(response.data.message);
            // Chuyển hướng người dùng vào trang Chat chính
            navigate('/chat');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Đăng Nhập</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input type="email" style={{ width: '100%', padding: '8px' }} required
                        onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Mật khẩu:</label>
                    <input type="password" style={{ width: '100%', padding: '8px' }} required
                        onChange={e => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', background: 'green', color: 'white', border: 'none' }}>Đăng Nhập</button>
            </form>
        </div>
    );
}

export default Login;