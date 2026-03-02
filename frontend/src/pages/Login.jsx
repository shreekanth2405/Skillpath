import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuth }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dbStatus, setDbStatus] = useState('Checking...');

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/health`);
                const data = await res.json();
                if (data.database && data.database.includes('Connected')) {
                    setDbStatus('Connected');
                } else {
                    setDbStatus('Database Offline');
                }
            } catch (err) {
                setDbStatus('Server Offline');
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleDeveloperLogin = () => {
        setAuth(true);
        navigate('/dashboard');
    };

    const handleStandardLogin = async (e) => {
        e.preventDefault();

        if (email && password) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setAuth(true);
                    navigate('/dashboard');
                } else {
                    alert(data.error || 'Login failed');
                }
            } catch (err) {
                console.error('Login error:', err);
                alert('Could not connect to the server. Make sure the backend is running.');
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', padding: '3rem', borderRadius: '24px', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: dbStatus === 'Connected' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: dbStatus === 'Connected' ? '#10b981' : '#ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: dbStatus === 'Connected' ? '#10b981' : '#ef4444', animation: dbStatus === 'Connected' ? 'pulse 2s infinite' : 'none' }}></div>
                        DB STATUS: {dbStatus.toUpperCase()}
                    </div>
                    <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', margin: '0 auto 1.5rem', boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}>
                        <i className="fa-solid fa-brain"></i>
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>SkillPath Login</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Enter your credentials to continue.</p>
                </div>

                <form onSubmit={handleStandardLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: '0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#cbd5e1'} required />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Password</label>
                        </div>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: '0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#cbd5e1'} required />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '1rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: '0.2s', marginTop: '0.5rem' }} onMouseOver={e => e.target.style.background = '#1e293b'} onMouseOut={e => e.target.style.background = '#0f172a'}>
                        Sign In
                    </button>
                </form>

                <button onClick={handleDeveloperLogin} style={{ width: '100%', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px dashed #3b82f6', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '1.5rem' }}>
                    <i className="fa-solid fa-code"></i> ONE-CLICK DEVELOPER LOGIN
                </button>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b', fontSize: '0.9rem' }}>
                    Don't have an account? <span onClick={() => navigate('/register')} style={{ color: '#3b82f6', fontWeight: 700, cursor: 'pointer' }}>Sign up</span>
                </p>
            </motion.div>
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Login;
