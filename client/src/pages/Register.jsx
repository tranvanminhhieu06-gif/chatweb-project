import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await API.post('/auth/register', formData);
            alert(response.data.message);
            // Đăng ký xong tự động lưu token hoặc đẩy thẳng qua trang Login
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Đăng Ký Tài Khoản</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Tên người dùng:</label>
                    <input type="text" style={{ width: '100%', padding: '8px' }} required
                        onChange={e => setFormData({ ...formData, username: e.target.value })} />
                </div>
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
                <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none' }}>Đăng Ký</button>
            </form>
        </div>
    );
}

export default Register;