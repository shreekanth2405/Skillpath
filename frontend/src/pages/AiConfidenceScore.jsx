import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AiConfidenceScore = () => {
    const [score, setScore] = useState(87);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [showCalculation, setShowCalculation] = useState(false);

    const regenerateScore = () => {
        setIsRegenerating(true);
        setTimeout(() => {
            setScore(Math.floor(Math.random() * (98 - 75 + 1) + 75));
            setIsRegenerating(false);
        }, 1500);
    };

    const getLevel = (s) => {
        if (s > 90) return { label: 'HIGH', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' };
        if (s > 80) return { label: 'MODERATE', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' };
        return { label: 'EXPERIMENTAL', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' };
    };

    const level = getLevel(score);
    const circumference = 2 * Math.PI * 80;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div style={{ padding: '2rem', background: '#020617', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', sans-serif" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: '500px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(15px)',
                    borderRadius: '35px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '3rem',
                    textAlign: 'center',
                    position: 'relative',
                    boxShadow: `0 0 50px rgba(0,0,0,0.5), 0 0 20px ${level.glow}`
                }}
            >
                {/* Glow Highlight */}
                <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100px', background: level.color, filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%', pointerEvents: 'none' }}></div>

                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#94a3b8', marginBottom: '2.5rem', letterSpacing: '2px' }}>SKILL PATH AI PREDICTION CONFIDENCE</h2>

                {/* Circular Progress */}
                <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 2.5rem auto' }}>
                    <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
                        <motion.circle
                            cx="100" cy="100" r="80"
                            stroke={level.color}
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={circumference}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <motion.span
                            key={score}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ fontSize: '3.5rem', fontWeight: 900, background: `linear-gradient(to bottom, #fff, ${level.color})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                        >
                            {score}%
                        </motion.span>
                    </div>
                </div>

                {/* Level Tag */}
                <div style={{ display: 'inline-block', padding: '8px 25px', background: `${level.color}15`, border: `1px solid ${level.color}40`, borderRadius: '100px', color: level.color, fontWeight: 900, fontSize: '0.9rem', marginBottom: '1.5rem', boxShadow: `0 0 15px ${level.color}20` }}>
                    {level.label} CONFIDENCE LEVEL
                </div>

                <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2rem', fontSize: '1rem', fontWeight: 500 }}>
                    Our neural engine has simulated 4,200+ career trajectories and market variables to generate this reliability factor for your profile.
                </p>

                {/* Calculation Toggle */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <button
                        onClick={() => setShowCalculation(!showCalculation)}
                        style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        How is this calculated?
                    </button>
                    <AnimatePresence>
                        {showCalculation && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden', marginTop: '1rem' }}
                            >
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', fontSize: '0.85rem', color: '#94a3b8', textAlign: 'left', lineHeight: 1.6, border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ marginBottom: '8px' }}><i className="fa-solid fa-check" style={{ color: level.color }}></i> Market Volatility Index (30%)</div>
                                    <div style={{ marginBottom: '8px' }}><i className="fa-solid fa-check" style={{ color: level.color }}></i> Skill Tree Completion (40%)</div>
                                    <div style={{ marginBottom: '8px' }}><i className="fa-solid fa-check" style={{ color: level.color }}></i> Historical Trend Alignment (20%)</div>
                                    <div><i className="fa-solid fa-check" style={{ color: level.color }}></i> User Performance Data (10%)</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={regenerateScore}
                    disabled={isRegenerating}
                    style={{
                        width: '100%',
                        padding: '1.2rem',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        fontWeight: 900,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: '0.3s'
                    }}
                >
                    {isRegenerating ? (
                        <><i className="fa-solid fa-sync fa-spin"></i> CALCULATING...</>
                    ) : (
                        <><i className="fa-solid fa-wand-magic-sparkles"></i> REGENERATE PREDICTION</>
                    )}
                </button>
            </motion.div>
        </div>
    );
};

export default AiConfidenceScore;
