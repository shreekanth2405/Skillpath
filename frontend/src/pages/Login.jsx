import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DEMO_ACCOUNTS = [
    { label: 'Admin', email: 'admin@admin.com', password: 'admin123', role: 'Administrator', color: '#8b5cf6', icon: 'fa-shield-halved' },
    { label: 'Developer', email: 'dev@skillpath.ai', password: 'dev123456', role: 'Developer', color: '#3b82f6', icon: 'fa-code' },
    { label: 'Student', email: 'student@skillpath.ai', password: 'student123', role: 'Student', color: '#10b981', icon: 'fa-graduation-cap' },
];

const Login = ({ setAuth }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@admin.com');
    const [password, setPassword] = useState('admin123');
    const [dbStatus, setDbStatus] = useState('Checking...');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('credentials'); // 'credentials' | 'social'
    const [error, setError] = useState('');

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/health`);
                const data = await res.json();
                setDbStatus(data.database?.includes('Connected') ? 'Connected' : 'Offline');
            } catch {
                setDbStatus('Server Offline');
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, 10000);
        return () => clearInterval(interval);
    }, []);

    const fillDemo = (account) => {
        setEmail(account.email);
        setPassword(account.password);
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
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
                setError(data.error || 'Invalid credentials. Please try again.');
            }
        } catch {
            setError('Cannot connect to server. Make sure the backend is running on port 5000.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeveloperLogin = () => {
        setAuth(true);
        navigate('/dashboard');
    };

    const handleSocialLogin = (provider) => {
        // OAuth providers would redirect here in production
        // For now, inform user these require OAuth setup
        setError(`${provider} OAuth requires production setup. Use demo credentials below.`);
        setActiveTab('credentials');
    };

    const isConnected = dbStatus === 'Connected';

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            padding: '2rem',
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* Animated background blobs */}
            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', animation: 'blobFloat 8s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', animation: 'blobFloat 10s ease-in-out infinite reverse' }} />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(20px)',
                    padding: '2.5rem',
                    borderRadius: '28px',
                    width: '100%',
                    maxWidth: '480px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'white'
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    {/* DB Status Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: isConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isConnected ? '#10b981' : '#ef4444',
                        padding: '4px 14px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800,
                        marginBottom: '1.5rem', border: `1px solid ${isConnected ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isConnected ? '#10b981' : '#ef4444', animation: isConnected ? 'pulse 2s infinite' : 'none' }} />
                        DB: {dbStatus.toUpperCase()}
                    </div>

                    {/* Logo */}
                    <motion.div
                        animate={{ rotateY: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        style={{
                            width: '60px', height: '60px',
                            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                            borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '1.6rem', margin: '0 auto 1.25rem',
                            boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
                        }}
                    >
                        <i className="fa-solid fa-brain" />
                    </motion.div>
                    <h1 style={{ fontSize: '1.9rem', fontWeight: 900, marginBottom: '0.35rem', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        SkillPath AI
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Sign in to your intelligent career platform</p>
                </div>

                {/* Tab Switcher */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '4px', marginBottom: '1.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {[['credentials', 'fa-key', 'Credentials'], ['social', 'fa-share-nodes', 'Social Login']].map(([tab, icon, label]) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setError(''); }}
                            style={{
                                flex: 1, padding: '0.65rem', borderRadius: '10px', border: 'none',
                                background: activeTab === tab ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                                color: activeTab === tab ? '#c4b5fd' : '#64748b',
                                fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                                transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                            }}
                        >
                            <i className={`fa-solid ${icon}`} /> {label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'credentials' && (
                        <motion.div key="creds" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>

                            {/* Demo Accounts */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.73rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>
                                    Quick Access — Click to Fill
                                </div>
                                <div style={{ display: 'flex', gap: '0.6rem' }}>
                                    {DEMO_ACCOUNTS.map((acc) => (
                                        <motion.button
                                            key={acc.label}
                                            whileHover={{ scale: 1.04, y: -2 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => fillDemo(acc)}
                                            style={{
                                                flex: 1, padding: '0.75rem 0.5rem',
                                                background: `${acc.color}18`,
                                                border: `1px solid ${acc.color}40`,
                                                borderRadius: '12px', color: acc.color,
                                                fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                                                transition: '0.2s'
                                            }}
                                        >
                                            <i className={`fa-solid ${acc.icon}`} style={{ fontSize: '1.1rem' }} />
                                            {acc.label}
                                            <span style={{ fontSize: '0.62rem', opacity: 0.7, fontWeight: 600 }}>{acc.role}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Credential Preview Banner */}
                            {email && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                    style={{
                                        background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99,102,241,0.25)',
                                        borderRadius: '10px', padding: '0.6rem 1rem', marginBottom: '1.25rem',
                                        display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#a5b4fc'
                                    }}
                                >
                                    <i className="fa-solid fa-circle-info" />
                                    Logging in as <strong style={{ color: 'white' }}>{email}</strong>
                                </motion.div>
                            )}

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '0.7rem 1rem', marginBottom: '1rem', fontSize: '0.83rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fa-solid fa-triangle-exclamation" /> {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Login Form */}
                            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.5rem' }}>
                                        <i className="fa-solid fa-envelope" style={{ marginRight: '6px', color: '#8b5cf6' }} /> Email Address
                                    </label>
                                    <input
                                        type="email" value={email} onChange={e => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.95rem', outline: 'none', transition: '0.2s', boxSizing: 'border-box' }}
                                        onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.5rem' }}>
                                        <i className="fa-solid fa-lock" style={{ marginRight: '6px', color: '#8b5cf6' }} /> Password
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            style={{ width: '100%', padding: '0.9rem 3rem 0.9rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.95rem', outline: 'none', transition: '0.2s', boxSizing: 'border-box' }}
                                            onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            required
                                        />
                                        <i onClick={() => setShowPassword(!showPassword)}
                                            className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        width: '100%', padding: '1rem',
                                        background: loading ? 'rgba(139,92,246,0.4)' : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                        color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800,
                                        fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                                        boxShadow: loading ? 'none' : '0 8px 25px rgba(139, 92, 246, 0.35)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        marginTop: '0.25rem'
                                    }}
                                >
                                    {loading ? (
                                        <><i className="fa-solid fa-circle-notch fa-spin" /> Authenticating...</>
                                    ) : (
                                        <><i className="fa-solid fa-right-to-bracket" /> Sign In</>
                                    )}
                                </motion.button>
                            </form>

                            {/* Divider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                                <span style={{ color: '#475569', fontSize: '0.78rem', fontWeight: 600 }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                            </div>

                            {/* Developer Login */}
                            <motion.button
                                onClick={handleDeveloperLogin}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    width: '100%', padding: '0.9rem',
                                    background: 'rgba(59, 130, 246, 0.08)',
                                    color: '#60a5fa', border: '1px dashed rgba(59,130,246,0.4)',
                                    borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                <i className="fa-solid fa-bolt" /> ONE-CLICK BYPASS (Dev Mode)
                            </motion.button>
                        </motion.div>
                    )}

                    {activeTab === 'social' && (
                        <motion.div key="social" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                            <AnimatePresence>
                                {error && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '0.7rem 1rem', marginBottom: '1.25rem', fontSize: '0.83rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fa-solid fa-triangle-exclamation" /> {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                                Connect with your existing account from a trusted provider.
                            </p>

                            {[
                                { provider: 'Google', icon: 'fa-google', color: '#ea4335', bg: 'rgba(234, 67, 53, 0.1)', border: 'rgba(234,67,53,0.3)', label: 'Continue with Google' },
                                { provider: 'GitHub', icon: 'fa-github', color: '#e2e8f0', bg: 'rgba(226, 232, 240, 0.08)', border: 'rgba(226,232,240,0.15)', label: 'Continue with GitHub' },
                                { provider: 'Microsoft', icon: 'fa-microsoft', color: '#00a4ef', bg: 'rgba(0, 164, 239, 0.1)', border: 'rgba(0,164,239,0.3)', label: 'Continue with Microsoft' },
                                { provider: 'LinkedIn', icon: 'fa-linkedin', color: '#0a66c2', bg: 'rgba(10, 102, 194, 0.1)', border: 'rgba(10,102,194,0.3)', label: 'Continue with LinkedIn' },
                            ].map((s) => (
                                <motion.button
                                    key={s.provider}
                                    onClick={() => handleSocialLogin(s.provider)}
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        width: '100%', padding: '0.9rem 1.25rem', marginBottom: '0.65rem',
                                        background: s.bg, border: `1px solid ${s.border}`,
                                        borderRadius: '12px', color: s.color,
                                        fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left'
                                    }}
                                >
                                    <i className={`fa-brands ${s.icon}`} style={{ fontSize: '1.2rem', width: '20px' }} />
                                    {s.label}
                                    <i className="fa-solid fa-arrow-right" style={{ marginLeft: 'auto', opacity: 0.5, fontSize: '0.8rem' }} />
                                </motion.button>
                            ))}

                            <div style={{ background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.2)', borderRadius: '10px', padding: '0.75rem 1rem', marginTop: '0.5rem', fontSize: '0.78rem', color: '#fbbf24', display: 'flex', gap: '8px' }}>
                                <i className="fa-solid fa-circle-info" style={{ marginTop: '2px', flexShrink: 0 }} />
                                Social OAuth providers require production domain setup. Use the <strong>Credentials</strong> tab to login with demo accounts during development.
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer */}
                <p style={{ textAlign: 'center', marginTop: '1.75rem', color: '#475569', fontSize: '0.83rem' }}>
                    Don't have an account?{' '}
                    <span onClick={() => navigate('/register')} style={{ color: '#8b5cf6', fontWeight: 700, cursor: 'pointer' }}>Create Account</span>
                </p>
            </motion.div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                }
                @keyframes blobFloat {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-30px) scale(1.05); }
                }
                input::placeholder { color: #475569; }
            `}</style>
        </div>
    );
};

export default Login;
