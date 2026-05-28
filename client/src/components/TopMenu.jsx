import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserProfileModal from './UserProfileModal';
import SettingsModal from './SettingsModal';
import FriendsModal from './FriendsModal';
import API from '../services/api';

function TopMenu() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [showProfile, setShowProfile] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showFriends, setShowFriends] = useState(false);
    
    const [fullProfile, setFullProfile] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const openProfile = async () => {
        try {
            const res = await API.get(`/users/${currentUser.username}`);
            setFullProfile(res.data);
            setShowProfile(true);
        } catch (error) {
            console.error("Lỗi khi tải thông tin cá nhân", error);
            // Fallback to basic info if API fails
            setFullProfile(currentUser);
            setShowProfile(true);
        }
    };

    // Helper for active styling
    const isActive = (path) => location.pathname === path;

    return (
        <>
            <div style={{
                height: '60px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid #fbcfe8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 30px',
                boxShadow: '0 2px 10px rgba(244, 114, 182, 0.1)',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                fontFamily: "'Inter', sans-serif"
            }}>
                {/* Logo & Brand */}
                <div 
                    onClick={() => navigate('/rooms')}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                >
                    <span style={{ fontSize: '24px' }}>🌸</span>
                    <h2 style={{ margin: 0, color: '#be185d', fontSize: '20px' }}>ChatHoaAnhDao</h2>
                </div>

                {/* Navigation Menu */}
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button 
                        onClick={() => navigate('/rooms')}
                        style={{ ...menuButtonStyle, background: isActive('/rooms') ? '#fce7f3' : 'transparent' }}
                    >
                        🏠 Trang chủ
                    </button>
                    
                    <button 
                        onClick={openProfile}
                        style={menuButtonStyle}
                    >
                        👤 Thông tin cá nhân
                    </button>

                    <button 
                        onClick={() => setShowFriends(true)}
                        style={menuButtonStyle}
                    >
                        🤝 Lời mời kết bạn
                    </button>

                    <button 
                        onClick={() => setShowSettings(true)}
                        style={menuButtonStyle}
                    >
                        ⚙️ Cài đặt
                    </button>

                    <div style={{ width: '1px', height: '24px', background: '#fbcfe8', margin: '0 10px' }}></div>

                    <button 
                        onClick={handleLogout}
                        style={{ ...menuButtonStyle, color: '#e11d48', fontWeight: 'bold' }}
                    >
                        🚪 Đăng xuất
                    </button>
                </div>
            </div>

            {/* Modals */}
            {showProfile && fullProfile && (
                <UserProfileModal 
                    userProfile={fullProfile}
                    isOwner={true}
                    onClose={() => setShowProfile(false)}
                />
            )}

            {showSettings && (
                <SettingsModal onClose={() => setShowSettings(false)} />
            )}

            {showFriends && (
                <FriendsModal onClose={() => setShowFriends(false)} />
            )}
        </>
    );
}

const menuButtonStyle = {
    padding: '8px 16px',
    color: '#831843',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    background: 'transparent',
    transition: 'background 0.2s',
};

export default TopMenu;
