import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function RoomSelection() {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Kiểm tra đăng nhập
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchRooms();
        }
    }, [navigate]);

    const fetchRooms = async () => {
        try {
            const res = await API.get('/rooms');
            setRooms(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setError('');
        if (!newRoomName.trim()) return;

        setLoading(true);
        try {
            const res = await API.post('/rooms', { roomName: newRoomName });
            if (res.status === 201 || res.status === 200) {
                // Navigate to the chat room immediately
                navigate(`/chat/${res.data.room.roomName}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tạo phòng');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = (roomName) => {
        navigate(`/chat/${roomName}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div style={{ minHeight: '100vh', padding: '40px 20px', background: 'linear-gradient(to bottom right, #fdf2f8, #fce7f3, #fdf2f8)', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(244, 114, 182, 0.1)', border: '1px solid #fbcfe8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '32px' }}>🌸</span>
                        <div>
                            <h2 style={{ margin: 0, color: '#be185d' }}>Xin chào, {user.username}!</h2>
                            <p style={{ margin: '5px 0 0 0', color: '#ec4899', fontSize: '14px' }}>Chọn phòng hoặc tạo phòng mới</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#fff', color: '#be185d', border: '1px solid #fbcfe8', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(244, 114, 182, 0.1)', transition: 'all 0.2s' }}>Đăng xuất</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                    {/* Panel Tạo phòng mới */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '25px', borderRadius: '20px', boxShadow: '0 8px 20px rgba(244, 114, 182, 0.15)', border: '1px solid #fbcfe8', height: 'fit-content' }}>
                        <h3 style={{ color: '#831843', marginTop: 0, marginBottom: '20px' }}>Tạo Phòng Mới</h3>
                        {error && <div style={{ color: '#e11d48', fontSize: '13px', marginBottom: '10px' }}>{error}</div>}
                        <form onSubmit={handleCreateRoom}>
                            <input 
                                type="text" 
                                placeholder="Nhập tên phòng (vd: Phong-123)" 
                                value={newRoomName}
                                onChange={e => setNewRoomName(e.target.value)}
                                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px', border: '1px solid #fbcfe8', outline: 'none', marginBottom: '15px', background: '#fff' }}
                            />
                            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'linear-gradient(to right, #fb7185, #f472b6)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: 'transform 0.2s', opacity: loading ? 0.7 : 1 }}>
                                {loading ? 'Đang tạo...' : '+ Tạo Phòng Mới'}
                            </button>
                        </form>
                    </div>

                    {/* Panel Danh sách phòng */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '25px', borderRadius: '20px', boxShadow: '0 8px 20px rgba(244, 114, 182, 0.15)', border: '1px solid #fbcfe8' }}>
                        <h3 style={{ color: '#831843', marginTop: 0, marginBottom: '20px' }}>Danh Sách Phòng Đang Mở</h3>
                        
                        {rooms.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                                🌸 Chưa có phòng chat nào. Hãy tạo một phòng mới!
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {rooms.map((room) => (
                                    <div key={room._id} onClick={() => handleJoinRoom(room.roomName)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', background: '#fff', border: '1px solid #fbcfe8', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(244, 114, 182, 0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ background: '#fce7f3', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#be185d', fontWeight: 'bold' }}>#</div>
                                            <b style={{ color: '#831843', fontSize: '16px' }}>{room.roomName}</b>
                                        </div>
                                        <button style={{ background: 'transparent', color: '#ec4899', border: '1px solid #fbcfe8', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Tham gia</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomSelection;
