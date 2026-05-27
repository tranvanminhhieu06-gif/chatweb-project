import React, { useState } from 'react';
import API from '../services/api';

function UserProfileModal({ userProfile, onClose, isOwner }) {
    const [isEditing, setIsEditing] = useState(false);
    const [bannerColor, setBannerColor] = useState(userProfile.bannerColor || '#00f0ff');
    const [customStatus, setCustomStatus] = useState(userProfile.customStatus || '');
    const [notes, setNotes] = useState(userProfile.notes || '');

    const handleSave = async () => {
        try {
            await API.put('/users/profile', { bannerColor, customStatus, notes });
            setIsEditing(false);
            // Optionally, you might want to refresh the parent data here
        } catch (error) {
            console.error("Lỗi khi lưu profile", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Không rõ';
        const date = new Date(dateString);
        return `${date.getDate()} thg ${date.getMonth() + 1}, ${date.getFullYear()}`;
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={onClose}>
            
            {/* Modal Container */}
            <div 
                style={{
                    width: '340px',
                    backgroundColor: '#232428', // Discord-like dark
                    borderRadius: '8px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.24)',
                    overflow: 'hidden',
                    fontFamily: "'Inter', sans-serif",
                    color: '#f2f3f5',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
            >
                {/* Banner */}
                <div style={{
                    height: '105px',
                    backgroundColor: isEditing ? 'transparent' : bannerColor,
                    position: 'relative'
                }}>
                    {isEditing && (
                        <input 
                            type="color" 
                            value={bannerColor} 
                            onChange={(e) => setBannerColor(e.target.value)}
                            style={{ width: '100%', height: '100%', border: 'none', padding: 0, cursor: 'pointer' }}
                        />
                    )}
                </div>

                {/* Avatar Section */}
                <div style={{ position: 'relative', padding: '0 16px' }}>
                    <div style={{
                        position: 'absolute',
                        top: '-45px',
                        left: '16px',
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        backgroundColor: '#232428', // Same as background to create border effect
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img 
                            src={userProfile.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'} 
                            alt="avatar"
                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        {/* Online Dot */}
                        <div style={{
                            position: 'absolute',
                            bottom: '5px',
                            right: '5px',
                            width: '20px',
                            height: '20px',
                            backgroundColor: '#23a559', // Discord green
                            borderRadius: '50%',
                            border: '3px solid #232428'
                        }}></div>
                    </div>

                    {/* Custom Status Bubble */}
                    {(customStatus || isEditing) && (
                        <div style={{
                            marginLeft: '105px',
                            marginTop: '-15px',
                            padding: '8px 12px',
                            backgroundColor: '#111214',
                            borderRadius: '8px',
                            border: '1px solid #1e1f22',
                            fontSize: '14px',
                            display: 'inline-block',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={customStatus}
                                    onChange={(e) => setCustomStatus(e.target.value)}
                                    placeholder="Nhập trạng thái..."
                                    style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '150px' }}
                                />
                            ) : (
                                <span>💬 {customStatus}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div style={{ padding: '45px 16px 16px 16px', background: '#111214', margin: '16px 16px', borderRadius: '8px' }}>
                    <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold' }}>{userProfile.username}</h2>
                    <p style={{ margin: 0, fontSize: '14px', color: '#b5bac1' }}>{userProfile.username} • {userProfile.email?.split('@')[0] || 'User'}</p>

                    {/* Action Buttons */}
                    {isOwner && (
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            {isEditing ? (
                                <button onClick={handleSave} style={{ flex: 1, padding: '8px', backgroundColor: '#5865f2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Lưu Thay Đổi
                                </button>
                            ) : (
                                <button onClick={() => setIsEditing(true)} style={{ flex: 1, padding: '8px', backgroundColor: '#5865f2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    ✏️ Sửa Hồ Sơ
                                </button>
                            )}
                        </div>
                    )}

                    <div style={{ borderTop: '1px solid #313338', margin: '15px 0' }}></div>

                    {/* Join Date */}
                    <div style={{ marginBottom: '15px' }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', textTransform: 'uppercase', color: '#b5bac1' }}>Gia Nhập Từ</h4>
                        <p style={{ margin: 0, fontSize: '14px' }}>{formatDate(userProfile.createdAt)}</p>
                    </div>

                    {/* Notes */}
                    {(isOwner || notes) && (
                        <div>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', textTransform: 'uppercase', color: '#b5bac1' }}>Ghi chú (chỉ hiển thị cho bạn)</h4>
                            {isEditing ? (
                                <textarea 
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Nhấp để thêm ghi chú"
                                    style={{ width: '100%', minHeight: '60px', background: 'transparent', border: 'none', color: '#fff', outline: 'none', resize: 'none', fontFamily: 'inherit', fontSize: '14px' }}
                                />
                            ) : (
                                <p style={{ margin: 0, fontSize: '14px', color: notes ? '#fff' : '#b5bac1' }}>
                                    {notes || 'Nhấp để thêm ghi chú'}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserProfileModal;
