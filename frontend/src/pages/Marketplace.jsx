import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Marketplace = ({ userCoins, setUserCoins }) => {
    const [purchaseStatus, setPurchaseStatus] = useState(null);

    const storeItems = [
        { id: 1, name: 'Cyberpunk Theme', category: 'UI Themes', price: 500, icon: 'fa-palette', color: '#b14fff', desc: 'Transform your dashboard with high-fidelity neon aesthetics.' },
        { id: 2, name: 'XP Booster (2x)', category: 'Power-ups', price: 1200, icon: 'fa-rocket', color: '#f59e0b', desc: 'Double your XP gains for the next 24 hours of learning.' },
        { id: 3, name: 'Resume Pro Template', category: 'Templates', price: 300, icon: 'fa-file-invoice', color: '#3b82f6', desc: 'Unlock an exclusive ATS-optimized executive resume layout.' },
        { id: 4, name: 'AI Avatar: Glitch', category: 'Avatars', price: 800, icon: 'fa-user-ninja', color: '#10b981', desc: 'A premium animated profile avatar with glitch effects.' },
        { id: 5, name: 'Mock Interview Key', category: 'Access', price: 1500, icon: 'fa-key', color: '#ef4444', desc: 'Instant access to a live 1-on-1 AI behavioral interview.' },
        { id: 6, name: 'Secret Sector Hint', category: 'Game Help', price: 150, icon: 'fa-magnifying-glass-plus', color: '#06b6d4', desc: 'reveal hidden shortcuts in the AI Survival Climb.' }
    ];

    const handleBuy = (item) => {
        if (userCoins >= item.price) {
            setUserCoins(prev => prev - item.price);
            setPurchaseStatus({ success: true, name: item.name });
            setTimeout(() => setPurchaseStatus(null), 3000);
        } else {
            setPurchaseStatus({ success: false, name: item.name });
            setTimeout(() => setPurchaseStatus(null), 3000);
        }
    };

    return (
        <div style={{ padding: '2rem', background: '#020617', color: 'white', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                        SKILL PATH AI MARKETPLACE
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginTop: '0.5rem' }}>Spend your hard-earned SkillCoins on premium career nodes.</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{ background: 'rgba(59, 130, 246, 0.1)', border: '2px solid #3b82f6', padding: '1rem 2.5rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '15px' }}
                >
                    <i className="fa-solid fa-coins" style={{ fontSize: '2rem', color: '#f59e0b' }}></i>
                    <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase' }}>Current Balance</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900 }}>{userCoins.toLocaleString()} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>SC</span></div>
                    </div>
                </motion.div>
            </div>

            {/* Purchase Notification */}
            <AnimatePresence>
                {purchaseStatus && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        style={{ position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10000, background: purchaseStatus.success ? '#10b981' : '#ef4444', color: 'white', padding: '1rem 3rem', borderRadius: '16px', fontWeight: 800, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                    >
                        {purchaseStatus.success ? `SUCCESS: ${purchaseStatus.name} Unlocked!` : `INSUFFICIENT FUNDS: Need more coins for ${purchaseStatus.name}`}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Marketplace Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {storeItems.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -10 }}
                        style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5))', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ position: 'absolute', top: -10, right: -10, fontSize: '8rem', opacity: 0.03, color: 'white' }}>
                            <i className={`fa-solid ${item.icon}`}></i>
                        </div>

                        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, fontSize: '1.8rem', marginBottom: '1.5rem' }}>
                            <i className={`fa-solid ${item.icon}`}></i>
                        </div>

                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.category}</span>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.5rem 0' }}>{item.name}</h3>
                        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, minHeight: '3rem' }}>{item.desc}</p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f59e0b' }}>
                                {item.price} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>SC</span>
                            </div>
                            <button
                                onClick={() => handleBuy(item)}
                                style={{ background: userCoins >= item.price ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '12px 30px', borderRadius: '14px', fontWeight: 900, cursor: userCoins >= item.price ? 'pointer' : 'not-allowed', transition: '0.3s' }}
                            >
                                PURCHASE NODE
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer / Stats */}
            <div style={{ marginTop: '5rem', background: 'rgba(30, 41, 59, 0.2)', padding: '3rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' }}>
                <h3 style={{ color: '#60a5fa', marginBottom: '1rem' }}>HOW TO EARN SKILLCOINS?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                    <div>
                        <i className="fa-solid fa-mountain" style={{ fontSize: '2rem', color: '#10b981', marginBottom: '1rem' }}></i>
                        <p>Complete Survival Climb Sectors</p>
                    </div>
                    <div>
                        <i className="fa-solid fa-vial" style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '1rem' }}></i>
                        <p>Score 90%+ in Test System</p>
                    </div>
                    <div>
                        <i className="fa-solid fa-users" style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '1rem' }}></i>
                        <p>Win Multiplayer Duels</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
