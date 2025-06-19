import React from 'react';

const WelcomeCard = ({ userName, imageUrl }) => {
    return (
        <div className="dashboard-card welcome-card">
            <div className="welcome-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                <div className="welcome-text" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <h1 style={{
                        fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                        fontWeight: 800,
                        fontSize: '2.6rem',
                        color: '#1976d2',
                        letterSpacing: '1px',
                        textShadow: '0 2px 12px rgba(33,203,243,0.10)',
                        margin: 0,
                        padding: 0,
                        lineHeight: 1.2,
                    }}>
                        Welcome <span style={{ color: '#43a047', textShadow: '0 2px 8px rgba(67,160,71,0.10)' }}>{userName}!</span>
                    </h1>
                </div>
                {imageUrl && (
                    <div className="welcome-image" style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #e0f7fa 0%, #fffde4 100%)',
                        borderRadius: '24px',
                        boxShadow: '0 4px 24px rgba(33,203,243,0.10)',
                        margin: '2rem',
                        height: '260px',
                        minWidth: '260px',
                        maxWidth: '320px',
                        overflow: 'hidden',
                    }}>
                        <img src={imageUrl} alt="Welcome" style={{
                            width: '70%',
                            height: '70%',
                            objectFit: 'contain',
                            background: 'transparent',
                            borderRadius: '18px',
                            boxShadow: '0 2px 12px rgba(33,203,243,0.08)',
                        }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default WelcomeCard; 