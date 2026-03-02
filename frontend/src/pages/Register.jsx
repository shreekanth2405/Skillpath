import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Register = ({ setAuth }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (name && email && password && password === confirm) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await res.json();

                if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setAuth(true);
                    navigate('/dashboard');
                } else {
                    alert(data.error || 'Registration failed');
                }
            } catch (err) {
                console.error('Registration error:', err);
                alert('Could not connect to the server. Make sure the backend is running.');
            }
        } else if (password !== confirm) {
            alert('Passwords do not match');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', padding: '3rem', borderRadius: '24px', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', margin: '0 auto 1.5rem', boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}>
                        <i className="fa-solid fa-user-plus"></i>
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Join SkillPath today.</p>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: '0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#cbd5e1'} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: '0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#cbd5e1'} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: '0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#cbd5e1'} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Confirm Password</label>
                        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: '0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#cbd5e1'} required />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: '0.2s', marginTop: '0.5rem' }} onMouseOver={e => e.target.style.background = '#2563eb'} onMouseOut={e => e.target.style.background = '#3b82f6'}>
                        Get Started
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                    Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#3b82f6', fontWeight: 700, cursor: 'pointer' }}>Log in</span>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
