import React from 'react';
import { motion } from 'framer-motion';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, AreaChart, Area
} from 'recharts';

const SmartProfileAnalytics = () => {
    // Mock Data
    const skillData = [
        { subject: 'AI/ML', A: 85, fullMark: 100 },
        { subject: 'Frontend', A: 95, fullMark: 100 },
        { subject: 'Backend', A: 70, fullMark: 100 },
        { subject: 'System Design', A: 65, fullMark: 100 },
        { subject: 'Cloud Architecture', A: 80, fullMark: 100 },
        { subject: 'Cybersecurity', A: 40, fullMark: 100 },
    ];

    const growthForecast = [
        { month: 'Jan', salary: 85000, potential: 85000 },
        { month: 'Mar', salary: 88000, potential: 92000 },
        { month: 'May', salary: 92000, potential: 105000 },
        { month: 'Jul', salary: 95000, potential: 118000 },
        { month: 'Sep', salary: 98000, potential: 135000 },
        { month: 'Nov', salary: 105000, potential: 155000 },
    ];

    return (
        <div style={{ padding: '2rem 3rem', background: '#020617', minHeight: '100vh', color: 'white', fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto' }}>

                {/* Header Section */}
                <header style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ color: '#8b5cf6', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
                            Neural Intelligence Layer
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            style={{ fontSize: '3rem', fontWeight: 900, margin: '10px 0 0 0', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Skill Path AI Smart Profile Analytics
                        </motion.h1>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>GLOBAL RANK</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#3b82f6' }}>TOP 2.4%</span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>SYNC STATUS</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981' }}>OPTIMIZED</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2.5rem' }}>

                    {/* Module 1: Neural Strength Core */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '2.5rem', color: '#fff', textAlign: 'center' }}>Neural Strength Matrix</h3>

                        <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
                            <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                                <motion.circle
                                    cx="100" cy="100" r="90" fill="none"
                                    stroke="url(#blueGradient)" strokeWidth="12" strokeLinecap="round"
                                    strokeDasharray="565.48"
                                    initial={{ strokeDashoffset: 565.48 }}
                                    animate={{ strokeDashoffset: 565.48 * (1 - 0.88) }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                                <defs>
                                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div style={{ position: 'absolute', textAlign: 'center' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 900, display: 'block', lineHeight: 1 }}>88</span>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, letterSpacing: '1px' }}>PROFILE SCORE</span>
                            </div>
                        </div>

                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Skill Integrity</span>
                                <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 800 }}>95%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: '95%' }} transition={{ duration: 1 }} style={{ height: '100%', background: '#3b82f6' }} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Market Reach</span>
                                <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 800 }}>72%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1, delay: 0.2 }} style={{ height: '100%', background: '#8b5cf6' }} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Neural Visibility</span>
                                <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 800 }}>90%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: '90%' }} transition={{ duration: 1, delay: 0.4 }} style={{ height: '100%', background: '#2dd4bf' }} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Module 2: Market Alignment Radar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '2.5rem' }}
                    >
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1rem', color: '#fff' }}>Market Skill Alignment</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem' }}>How your expert layer matches current industry standards.</p>

                        <div style={{ width: '100%', height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                    <Radar
                                        name="Skills"
                                        dataKey="A"
                                        stroke="#8b5cf6"
                                        fill="#8b5cf6"
                                        fillOpacity={0.3}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={{ background: '#3b82f610', padding: '20px', borderRadius: '20px', marginTop: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#3b82f6', marginBottom: '5px' }}>AI RECOMMENDATION</span>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#93c5fd', lineHeight: 1.5 }}>
                                "Strong focus in <b>Frontend & AI</b>. Consider scaling <b>Cybersecurity</b> to enter the top 0.1% of multi-domain architects."
                            </p>
                        </div>
                    </motion.div>

                    {/* Module 3: Expansion Forecast */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '2.5rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', margin: 0 }}>Expansion Forecast</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '5px' }}>Projected growth with new skill nodes.</p>
                            </div>
                            <div style={{ background: '#2dd4bf20', color: '#2dd4bf', padding: '5px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>
                                +58% ROI
                            </div>
                        </div>

                        <div style={{ width: '100%', height: '250px', marginBottom: '2rem' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthForecast}>
                                    <defs>
                                        <linearGradient id="colorPot" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                                        itemStyle={{ fontWeight: 800 }}
                                    />
                                    <Area type="monotone" dataKey="potential" stroke="#2dd4bf" fillOpacity={1} fill="url(#colorPot)" strokeWidth={3} />
                                    <Line type="monotone" dataKey="salary" stroke="#94a3b8" strokeDasharray="5 5" dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>PROJECTED VALUATION</span>
                                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>$152k<small style={{ fontSize: '0.8rem', color: '#2dd4bf', marginLeft: '5px' }}>/yr</small></span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>EST. GROWTH TIME</span>
                                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>9.4 <small style={{ fontSize: '0.8rem', color: '#8b5cf6', marginLeft: '5px' }}>Months</small></span>
                                </div>
                            </div>
                            <button style={{ width: '100%', padding: '15px', borderRadius: '18px', border: '1px solid #2dd4bf30', background: '#2dd4bf10', color: '#2dd4bf', fontWeight: 800, cursor: 'pointer', transition: '0.3s' }}>
                                ACTIVATE GROWTH PATH
                            </button>
                        </div>
                    </motion.div>

                </div>

                {/* Footer Insight Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{ marginTop: '3rem', background: 'linear-gradient(90deg, #3b82f615, #8b5cf615)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '45px', height: '45px', background: '#3b82f620', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                            <i className="fa-solid fa-wand-sparkles"></i>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, color: '#94a3b8' }}>
                            Your profile neural map is currently synchronized with <b style={{ color: '#fff' }}>500+ global markets</b> and <b>2,400+ hiring algorithms</b>.
                        </p>
                    </div>
                    <button style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#fff', color: '#000', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>EXPORT DOSSIER</button>
                </motion.div>

            </div>
        </div>
    );
};

export default SmartProfileAnalytics;
