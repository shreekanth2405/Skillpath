import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-Components ---

const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success': return 'fa-circle-check';
            case 'warning': return 'fa-triangle-exclamation';
            case 'error': return 'fa-circle-xmark';
            default: return 'fa-circle-info';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return '#10b981';
            case 'warning': return '#f59e0b';
            case 'error': return '#ef4444';
            default: return '#3b82f6';
        }
    };

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '1rem 1.5rem',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                minWidth: '300px'
            }}
        >
            <div style={{ color: getColor(), fontSize: '1.2rem' }}>
                <i className={`fa-solid ${getIcon()}`}></i>
            </div>
            <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{message}</div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                <i className="fa-solid fa-xmark"></i>
            </button>
        </motion.div>
    );
};

const NotificationCard = ({ type, title, content, timestamp, extra, icon, onDismiss }) => {
    const getPriorityColor = () => {
        switch (type) {
            case 'critical': return '#ef4444';
            case 'warning': return '#f59e0b';
            case 'suggestion': return '#10b981';
            default: return '#3b82f6';
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1rem',
                marginBottom: '1rem',
                position: 'relative',
                transition: '0.3s'
            }}
        >
            <div style={{ position: 'absolute', left: 0, top: '15px', bottom: '15px', width: '3px', background: getPriorityColor(), borderRadius: '0 4px 4px 0' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingLeft: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ color: getPriorityColor() }}><i className={`fa-solid ${icon}`}></i></div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>{title}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{timestamp}</div>
            </div>

            <div style={{ paddingLeft: '8px', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '10px' }}>
                {content}
            </div>

            {extra && <div style={{ paddingLeft: '8px', marginBottom: '10px' }}>{extra}</div>}

            <div style={{ display: 'flex', gap: '10px', paddingLeft: '8px' }}>
                <button style={{ border: 'none', background: 'transparent', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', padding: 0 }}>Mark as Read</button>
                <button onClick={onDismiss} style={{ border: 'none', background: 'transparent', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', padding: 0 }}>Dismiss</button>
            </div>
        </motion.div>
    );
};

const NotificationHub = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'info',
            icon: 'fa-chart-line',
            title: 'Confidence Score Updated',
            content: 'Your AI Confidence Score has increased significantly following your recent project additions.',
            timestamp: '2 mins ago',
            extra: (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>82% → 87%</div>
                    <div style={{ color: '#10b981', fontWeight: 900 }}><i className="fa-solid fa-arrow-up"></i> +5%</div>
                </div>
            )
        },
        {
            id: 2,
            type: 'warning',
            icon: 'fa-bolt-lightning',
            title: 'Prediction Volatility Detected',
            content: 'Recent market changes are affecting prediction stability for Cloud roles.',
            timestamp: '1 hour ago',
            extra: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800 }}>MODERATE RISK</div>
                    <button style={{ background: 'white', color: '#0f172a', border: 'none', padding: '4px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>VIEW BREAKDOWN</button>
                </div>
            )
        },
        {
            id: 3,
            type: 'suggestion',
            icon: 'fa-wand-magic-sparkles',
            title: 'Improve Your Confidence Score',
            content: 'Add "Neural Networks" to your skill tree to boost confidence.',
            timestamp: '3 hours ago',
            extra: (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, border: '1px dashed #10b981', padding: '8px', borderRadius: '8px', color: '#10b981', fontSize: '0.8rem', textAlign: 'center' }}>+4% Potential</div>
                    <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>UPDATE PROFILE</button>
                </div>
            )
        }
    ]);

    const [toasts, setToasts] = useState([]);

    const addToast = (msg, type) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, msg, type }]);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div style={{ padding: '2rem', background: '#020617', minHeight: '100vh', color: 'white', fontFamily: "'Outfit', sans-serif" }}>

            {/* Header / Demo Area */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>SKILL PATH AI NOTIFICATION HUB</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '10px' }}>Real-time event tracking & priority alerts.</p>
                    </div>

                    {/* Notification Bell Component */}
                    <div style={{ position: 'relative' }}>
                        <motion.button
                            onClick={() => setIsOpen(!isOpen)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1.5rem', cursor: 'pointer', position: 'relative' }}
                        >
                            <i className="fa-solid fa-bell"></i>
                            {notifications.length > 0 && (
                                <span style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', background: '#ef4444', border: '3px solid #020617', borderRadius: '50%', fontSize: '0.7rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {notifications.length}
                                </span>
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                    style={{
                                        position: 'absolute',
                                        top: '80px',
                                        right: 0,
                                        width: '400px',
                                        background: '#0f172a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '24px',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                        padding: '1.5rem',
                                        zIndex: 1000
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>ALERTS</h3>
                                        <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>Mark all as read</button>
                                    </div>

                                    <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '5px' }}>
                                        {notifications.length > 0 ? (
                                            notifications.map(n => (
                                                <NotificationCard key={n.id} {...n} onDismiss={() => removeNotification(n.id)} />
                                            ))
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                                <i className="fa-solid fa-circle-check" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                                                <p style={{ fontWeight: 600 }}>All caught up!</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem' }}>

                    {/* Playground */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed rgba(59, 130, 246, 0.3)', borderRadius: '24px', padding: '2.5rem' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>Toast Notifications Playground</h2>
                            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Trigger real-time floating alerts for various system events.</p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button onClick={() => addToast('AI Model Retrained Successfully', 'success')} style={{ padding: '12px 24px', borderRadius: '12px', background: '#10b981', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Success Toast</button>
                                <button onClick={() => addToast('New Market Data Available', 'info')} style={{ padding: '12px 24px', borderRadius: '12px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Info Toast</button>
                                <button onClick={() => addToast('Volatility Peak Detected', 'warning')} style={{ padding: '12px 24px', borderRadius: '12px', background: '#f59e0b', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Warning Toast</button>
                                <button onClick={() => addToast('Prediction Engine Offline', 'error')} style={{ padding: '12px 24px', borderRadius: '12px', background: '#ef4444', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Error Toast</button>
                            </div>
                        </div>

                        {/* Confidence Card Demo */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Current Confidence Level</h3>
                                <p style={{ margin: '5px 0 0 0', color: '#94a3b8' }}>Tracking 250+ individual skill nodes.</p>
                            </div>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3b82f6' }}>87%</div>

                                {/* New Market Data Available Badge */}
                                <motion.div
                                    animate={{ boxShadow: ['0 0 0px #3b82f6', '0 0 20px #3b82f6', '0 0 0px #3b82f6'] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    style={{
                                        background: '#3b82f6',
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: '100px',
                                        fontSize: '0.65rem',
                                        fontWeight: 900,
                                        cursor: 'help'
                                    }}
                                    title="New market data has been integrated into your latest prediction."
                                >
                                    NEW MARKET DATA AVAILABLE
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Alert Demo (Static) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ background: '#f59e0b10', border: '1px solid #f59e0b30', borderRadius: '24px', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                <div style={{ color: '#f59e0b' }}><i className="fa-solid fa-triangle-exclamation"></i></div>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>UNSTABLE PREDICTION</h4>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 10px 0' }}>Job market volatility in "Cloud Computing" is currently at 78% due to macro-economic shifts.</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#ef4444', fontWeight: 900, fontSize: '0.8rem' }}>HIGH VOLATILITY</span>
                                <button style={{ border: 'none', background: 'white', color: '#0f172a', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>REFRESH DATA</button>
                            </div>
                        </div>

                        <div style={{ background: '#10b98110', border: '1px solid #10b98130', borderRadius: '24px', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                <div style={{ color: '#10b981' }}><i className="fa-solid fa-graduation-cap"></i></div>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>UPSKILL OPPORTUNITY</h4>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 15px 0' }}>Adding <b>Python Scikit-Learn</b> could increase your matchmaking reliability by up to 12%.</p>
                            <button style={{ width: '100%', background: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>START LEARNING</button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Toast Container */}
            <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 10000 }}>
                <AnimatePresence>
                    {toasts.map(toast => (
                        <Toast key={toast.id} message={toast.msg} type={toast.type} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
                    ))}
                </AnimatePresence>
            </div>

        </div>
    );
};

export default NotificationHub;
