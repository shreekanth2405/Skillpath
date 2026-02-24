import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuth }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleDeveloperLogin = () => {
        setAuth(true);
        navigate('/dashboard');
    };

    const handleStandardLogin = async (e) => {
        e.preventDefault();

        let loginEmail = email;
        // Map shorthand "admin" to the seeded email
        if (loginEmail.toLowerCase() === 'admin') {
            loginEmail = 'admin@admin.com';
        }

        if (email && password) {
            try {
                const res = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: loginEmail, password })
                });

                const data = await res.json();

                if (data.success) {
                    localStorage.setItem('token', data.token);
                    // Can also save user data to localStorage if needed
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setAuth(true);
                    navigate('/dashboard');
                } else {
                    alert(data.error || 'Login failed');
                }
            } catch (err) {
                console.error('Login error:', err);
                alert('Could not connect to the backend server. Is it running?');
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', padding: '3rem', borderRadius: '24px', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', margin: '0 auto 1.5rem', boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}>
                        <i className="fa-solid fa-brain"></i>
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Log in to access your AI learning paths.</p>
                </div>

                <form onSubmit={handleStandardLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Email Address or Username</label>
                        <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin or you@example.com" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: '0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#cbd5e1'} required />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Password</label>
                            <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>Forgot?</span>
                        </div>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: '0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#cbd5e1'} required />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '1rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: '0.2s', marginTop: '0.5rem' }} onMouseOver={e => e.target.style.background = '#1e293b'} onMouseOut={e => e.target.style.background = '#0f172a'}>
                        Sign In
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>OR CONTINUE WITH</span>
                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <button style={{ padding: '0.75rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '1.2rem', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.target.style.background = '#f8fafc'} onMouseOut={e => e.target.style.background = 'white'}>
                        <i className="fa-brands fa-google" style={{ color: '#ea4335' }}></i>
                    </button>
                    <button style={{ padding: '0.75rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '1.2rem', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.target.style.background = '#f8fafc'} onMouseOut={e => e.target.style.background = 'white'}>
                        <i className="fa-brands fa-github"></i>
                    </button>
                    <button style={{ padding: '0.75rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '1.2rem', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.target.style.background = '#f8fafc'} onMouseOut={e => e.target.style.background = 'white'}>
                        <i className="fa-brands fa-microsoft" style={{ color: '#00a4ef' }}></i>
                    </button>
                    <button style={{ padding: '0.75rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '1.2rem', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.target.style.background = '#f8fafc'} onMouseOut={e => e.target.style.background = 'white'}>
                        <i className="fa-solid fa-phone" style={{ color: '#10b981' }}></i>
                    </button>
                </div>

                <button onClick={handleDeveloperLogin} style={{ width: '100%', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px dashed #3b82f6', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onMouseOver={e => e.target.style.background = 'rgba(59, 130, 246, 0.15)'} onMouseOut={e => e.target.style.background = 'rgba(59, 130, 246, 0.1)'}>
                    <i className="fa-solid fa-code"></i> ONE-CLICK DEVELOPER LOGIN
                </button>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b', fontSize: '0.9rem' }}>
                    Don't have an account? <span onClick={() => navigate('/register')} style={{ color: '#3b82f6', fontWeight: 700, cursor: 'pointer' }}>Sign up</span>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
