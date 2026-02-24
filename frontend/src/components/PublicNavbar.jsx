import React from 'react';
import { useNavigate } from 'react-router-dom';

const PublicNavbar = ({ scrolled }) => {
    const navigate = useNavigate();

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1000,
            padding: scrolled ? '1rem 2rem' : '1.5rem 2rem',
            background: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
            backdropFilter: scrolled ? 'blur(24px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(15, 23, 42, 0.05)' : '1px solid transparent',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}>
                        <i className="fa-solid fa-brain"></i>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.1 }}>Skill Path AI</h2>
                        <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>ENTERPRISE LEARNING</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: 'none', padding: '0.75rem 1.5rem', fontWeight: 800, color: '#0f172a', cursor: 'pointer', fontSize: '1rem' }}>
                        Login
                    </button>
                    <button onClick={() => navigate('/register')} style={{ background: '#0f172a', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;
