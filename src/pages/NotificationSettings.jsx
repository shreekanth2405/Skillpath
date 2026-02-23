import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationSettings = () => {
    // --- Default State ---
    const DEFAULTS = {
        toggles: {
            confidence: true,
            market: true,
            risk: true,
            profile: false,
            disruption: true,
            reminders: true
        },
        priority: 'High',
        frequency: 'Instant',
        delivery: { email: true, inApp: true },
        sensitivity: 50,
        quietHours: { start: '22:00', end: '07:00' },
        weekdays: ['M', 'T', 'W', 'T', 'F']
    };

    const [toggles, setToggles] = useState(DEFAULTS.toggles);
    const [priority, setPriority] = useState(DEFAULTS.priority);
    const [frequency, setFrequency] = useState(DEFAULTS.frequency);
    const [delivery, setDelivery] = useState(DEFAULTS.delivery);
    const [sensitivity, setSensitivity] = useState(DEFAULTS.sensitivity);
    const [quietHours, setQuietHours] = useState(DEFAULTS.quietHours);
    const [weekdays, setWeekdays] = useState(DEFAULTS.weekdays);
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleReset = () => {
        setToggles(DEFAULTS.toggles);
        setPriority(DEFAULTS.priority);
        setFrequency(DEFAULTS.frequency);
        setDelivery(DEFAULTS.delivery);
        setSensitivity(DEFAULTS.sensitivity);
        setQuietHours(DEFAULTS.quietHours);
        setWeekdays(DEFAULTS.weekdays);
    };

    const toggleWeekday = (day) => {
        setWeekdays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    const toggleSwitch = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // --- Components ---
    const SettingRow = ({ icon, title, desc, active, onClick }) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                    <i className={`fa-solid ${icon}`}></i>
                </div>
                <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{title}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{desc}</p>
                </div>
            </div>
            <div
                onClick={onClick}
                style={{
                    width: '46px',
                    height: '24px',
                    background: active ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#1e293b',
                    borderRadius: '100px',
                    padding: '3px',
                    cursor: 'pointer',
                    transition: '0.3s',
                    boxShadow: active ? '0 0 10px rgba(59, 130, 246, 0.3)' : 'none'
                }}
            >
                <motion.div
                    animate={{ x: active ? 22 : 0 }}
                    style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%' }}
                />
            </div>
        </div>
    );

    return (
        <div style={{ padding: '2rem 3rem', background: '#020617', minHeight: '100vh', color: 'white', fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto' }}>

                {/* Header Overlay */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(to right, #8b5cf6, #3b82f6, #2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, letterSpacing: '-1px' }}>Skill Path AI Response Center</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '5px', fontWeight: 500 }}>Calibrate the AI neural notification matrix.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={handleReset}
                            style={{ padding: '12px 24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: '#94a3b8', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', transition: '0.3s' }}
                        >
                            RESTORE DEFAULTS
                        </button>
                        <button
                            onClick={handleSave}
                            style={{ padding: '12px 32px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)', fontSize: '0.85rem' }}
                        >
                            SYNC CHANGES
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2.5rem' }}>

                    {/* Panel 1: Direct Alerts */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '2.5rem' }}
                    >
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '2rem', color: '#8b5cf6', letterSpacing: '1px' }}>Neural Alert Matrix</h3>
                        <SettingRow icon="fa-brain" title="Confidence Score" desc="Real-time reliability fluctuations" active={toggles.confidence} onClick={() => toggleSwitch('confidence')} />
                        <SettingRow icon="fa-chart-line" title="Market Pulse" desc="Hyper-speed market data shifts" active={toggles.market} onClick={() => toggleSwitch('market')} />
                        <SettingRow icon="fa-radiation" title="Disruption Radar" desc="High-risk industry displacement" active={toggles.risk} onClick={() => toggleSwitch('risk')} />
                        <SettingRow icon="fa-sparkles" title="Growth Projections" desc="AI-directed upskill suggestions" active={toggles.profile} onClick={() => toggleSwitch('profile')} />
                        <SettingRow icon="fa-envelope-open-text" title="Smart Reminders" desc="Adaptive learning persistence" active={toggles.reminders} onClick={() => toggleSwitch('reminders')} />
                    </motion.div>

                    {/* Panel 2: Preferences */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
                    >
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '2rem' }}>Priority & Intensity</h3>

                            {/* Sensitivity Slider */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#64748b' }}>AI MONITORING SENSITIVITY</label>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#3b82f6' }}>{sensitivity}%</span>
                                </div>
                                <div style={{ position: 'relative', height: '6px', background: '#1e293b', borderRadius: '100px' }}>
                                    <motion.div
                                        style={{ position: 'absolute', height: '100%', left: 0, background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', borderRadius: '100px', width: `${sensitivity}%`, boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={sensitivity}
                                        onChange={(e) => setSensitivity(e.target.value)}
                                        style={{ position: 'absolute', top: '-10px', width: '100%', zIndex: 2, opacity: 0, cursor: 'pointer' }}
                                    />
                                </div>
                                <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>
                                    {sensitivity > 75 ? "High sensitivity: Intensive oversight across global data points." : "Standard sensitivity: Optimized for long-term career stability."}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                                <div
                                    onClick={() => setDelivery(prev => ({ ...prev, email: !prev.email }))}
                                    style={{ padding: '1.5rem', borderRadius: '20px', border: delivery.email ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.05)', background: delivery.email ? '#3b82f610' : 'transparent', textAlign: 'center', cursor: 'pointer', transition: '0.2s' }}
                                >
                                    <i className="fa-solid fa-at" style={{ fontSize: '1.5rem', marginBottom: '10px', display: 'block', color: delivery.email ? '#3b82f6' : '#64748b' }}></i>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>EMAIL HUB</span>
                                </div>
                                <div
                                    onClick={() => setDelivery(prev => ({ ...prev, inApp: !prev.inApp }))}
                                    style={{ padding: '1.5rem', borderRadius: '20px', border: delivery.inApp ? '2px solid #8b5cf6' : '1px solid rgba(255,255,255,0.05)', background: delivery.inApp ? '#8b5cf610' : 'transparent', textAlign: 'center', cursor: 'pointer', transition: '0.2s' }}
                                >
                                    <i className="fa-solid fa-satellite-dish" style={{ fontSize: '1.5rem', marginBottom: '10px', display: 'block', color: delivery.inApp ? '#8b5cf6' : '#64748b' }}></i>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>NEURAL APP</span>
                                </div>
                            </div>
                        </div>

                        {/* Quiet Hours Expansion */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '2rem' }}>Silent Mode Matrix</h3>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => toggleWeekday(day)}
                                        style={{
                                            flex: 1,
                                            padding: '12px 0',
                                            borderRadius: '12px',
                                            border: weekdays.includes(day) ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.05)',
                                            background: weekdays.includes(day) ? '#3b82f620' : 'transparent',
                                            color: weekdays.includes(day) ? '#3b82f6' : '#64748b',
                                            fontWeight: 900,
                                            fontSize: '0.8rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#475569', marginBottom: '8px', display: 'block' }}>START TIME</label>
                                    <div style={{ background: '#1e293b', padding: '12px', borderRadius: '12px', textAlign: 'center', fontWeight: 800 }}>{quietHours.start}</div>
                                </div>
                                <div style={{ paddingTop: '20px', color: '#475569' }}><i className="fa-solid fa-arrows-left-right"></i></div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#475569', marginBottom: '8px', display: 'block' }}>END TIME</label>
                                    <div style={{ background: '#1e293b', padding: '12px', borderRadius: '12px', textAlign: 'center', fontWeight: 800 }}>{quietHours.end}</div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>

                {/* Economic Indicator Strip */}
                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                        <i className="fa-solid fa-shield-halved" style={{ marginRight: '10px', color: '#2dd4bf' }}></i>
                        Your data is encrypted. System sync: <b style={{ color: '#94a3b8' }}>Real-time</b>
                    </p>
                </div>

            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        style={{
                            position: 'fixed', bottom: '40px', right: '40px',
                            background: '#0ea5e9', color: 'white', padding: '1.2rem 2.5rem',
                            borderRadius: '20px', fontWeight: 900, boxShadow: '0 10px 40px rgba(14, 165, 233, 0.4)',
                            display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10000
                        }}
                    >
                        <i className="fa-solid fa-satellite fa-spin"></i>
                        NEURAL CONFIG SYNCED
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationSettings;
