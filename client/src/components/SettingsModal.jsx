import React from 'react';

function SettingsModal({ onClose }) {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={onClose}>
            
            <div 
                style={{
                    width: '400px',
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    overflow: 'hidden',
                    fontFamily: "'Inter', sans-serif",
                    color: '#334155',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ padding: '20px', borderBottom: '1px solid #fbcfe8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, #fff0f5, #ffe4e1)' }}>
                    <h3 style={{ margin: 0, color: '#be185d', fontSize: '18px' }}>⚙️ Cài đặt</h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#be185d' }}>✖</button>
                </div>
                
                <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>🛠️</div>
                    <h4 style={{ margin: '0 0 10px 0', color: '#831843' }}>Tính năng đang phát triển</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>
                        Phần cài đặt giao diện, âm thanh và thông báo đang được đội ngũ hoàn thiện. Vui lòng quay lại sau nhé! 🌸
                    </p>
                </div>
                
                <div style={{ padding: '15px 20px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', textAlign: 'right' }}>
                    <button onClick={onClose} style={{ padding: '8px 20px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng</button>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;
