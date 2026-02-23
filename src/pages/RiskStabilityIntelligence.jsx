import React from 'react';
import { motion } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';

const RiskStabilityIntelligence = () => {
    // Mock Data
    const stabilityTrend = [
        { month: 'Jan', score: 82, volatility: 5 },
        { month: 'Feb', score: 81, volatility: 8 },
        { month: 'Mar', score: 85, volatility: 4 },
        { month: 'Apr', score: 84, volatility: 6 },
        { month: 'May', score: 88, volatility: 3 },
        { month: 'Jun', score: 90, volatility: 2 },
    ];

    const riskFactors = [
        { name: 'Automation', value: 15, color: '#3b82f6' },
        { name: 'Market Shift', value: 25, color: '#8b5cf6' },
        { name: 'Skill Decay', value: 10, color: '#2dd4bf' },
        { name: 'Stability Buffer', value: 50, color: '#10b981' },
    ];

    const signals = [
        { id: 1, type: 'Stability', icon: 'fa-shield-check', color: '#10b981', title: 'High Demand Node', desc: 'React 19 & Next.js ecosystem demand increased by 14% globally.', impact: '+4.2%' },
        { id: 2, type: 'Risk', icon: 'fa-bolt', color: '#f59e0b', title: 'Automation Pressure', desc: 'Junior QA manual roles shifted toward AI-automated pipelines.', impact: '-2.1%' },
        { id: 3, type: 'Insight', icon: 'fa-brain-circuit', color: '#8b5cf6', title: 'Niche Expansion', desc: 'AI-agent orchestration is a high-yield transition path for your stack.', impact: '+8.5%' },
    ];

    return (
        <div style={{ padding: '2rem 3rem', background: '#020617', minHeight: '100vh', color: 'white', fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto' }}>

                {/* Dashboard Header */}
                <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}
                        >
                            <span style={{ height: '2px', width: '30px', background: 'linear-gradient(90deg, #3b82f6, transparent)' }}></span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#3b82f6', letterSpacing: '2px', textTransform: 'uppercase' }}>Defense Intelligence</span>
                        </motion.div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: 0, letterSpacing: '-1.5px' }}>Skill Path AI Risk & Stability Intelligence</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block' }}>SYSTEM SCAN STATUS</span>
                            <span style={{ color: '#10b981', fontWeight: 800, fontSize: '1rem' }}><i className="fa-solid fa-circle-check" style={{ marginRight: '6px' }}></i> ALL NODES SECURE</span>
                        </div>
                        <button style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', padding: '12px 24px', borderRadius: '14px', fontWeight: 700, cursor: 'pointer' }}>
                            <i className="fa-solid fa-download" style={{ marginRight: '10px' }}></i> FULL REPORT
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>

                    {/* Main Stability Index Gauge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ gridColumn: 'span 4', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem' }}>Career Stability Index</h3>
                        <div style={{ position: 'relative', width: '240px', height: '140px', overflow: 'hidden' }}>
                            <svg width="240" height="120">
                                <path d="M 20 120 A 100 100 0 0 1 220 120" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="18" strokeLinecap="round" />
                                <motion.path
                                    d="M 20 120 A 100 100 0 0 1 220 120" fill="none"
                                    stroke="url(#stabilityGrad)" strokeWidth="18" strokeLinecap="round"
                                    strokeDasharray="314"
                                    initial={{ strokeDashoffset: 314 }}
                                    animate={{ strokeDashoffset: 314 * (1 - 0.92) }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                />
                                <defs>
                                    <linearGradient id="stabilityGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#f59e0b" />
                                        <stop offset="50%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div style={{ position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center' }}>
                                <span style={{ fontSize: '3.5rem', fontWeight: 900, display: 'block', lineHeight: 1 }}>92%</span>
                                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>OPTIMAL STABILITY</span>
                            </div>
                        </div>
                        <div style={{ width: '100%', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ padding: '15px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>DIVERSIFICATION SCORE</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>High</span>
                                </div>
                                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} style={{ height: '100%', background: '#10b981' }} />
                                </div>
                            </div>
                            <div style={{ padding: '15px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3b82f6' }}>ADAPTABILITY RATING</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>Superb</span>
                                </div>
                                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} style={{ height: '100%', background: '#3b82f6' }} />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stability Trend Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ gridColumn: 'span 8', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '2.5rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>System Stability Trend</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '5px' }}>Predictive stability vs. market volatility over 6 months.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '10px', height: '100%', background: '#3b82f6', borderRadius: '2px' }}></span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>STABILITY</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '10px', height: '100%', background: '#f59e0b', borderRadius: '2px' }}></span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>VOLATILITY</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stabilityTrend}>
                                    <defs>
                                        <linearGradient id="colorStability" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} hide />
                                    <Tooltip
                                        contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStability)" strokeWidth={3} />
                                    <Line type="monotone" dataKey="volatility" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Risk Distribution & Mitigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ gridColumn: 'span 5', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '2.5rem' }}
                    >
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem' }}>Risk Taxonomy</h3>
                        <div style={{ width: '100%', height: '220px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={riskFactors}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {riskFactors.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#020617', borderRadius: '12px', border: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '1rem' }}>
                            {riskFactors.map(risk => (
                                <div key={risk.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: risk.color }}></div>
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{risk.name}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 800, marginLeft: 'auto' }}>{risk.value}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Signal Intelligence Feed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ gridColumn: 'span 7', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '2.5rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Signals & Mitigations</h3>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '5px 12px', borderRadius: '100px' }}>LIVE STREAM</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {signals.map(signal => (
                                <div key={signal.id} style={{ display: 'flex', gap: '20px', padding: '16px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${signal.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: signal.color, fontSize: '1.2rem' }}>
                                        <i className={`fa-solid ${signal.icon}`}></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{signal.title}</h4>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: signal.impact.startsWith('+') ? '#10b981' : '#f59e0b' }}>{signal.impact}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>{signal.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>

                {/* Mitigation Action Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ marginTop: '3rem', background: 'linear-gradient(90deg, #1e1b4b, #1e293b)', borderRadius: '32px', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                        <div style={{ padding: '20px', borderRadius: '24px', background: '#3b82f6', color: 'white', fontSize: '1.8rem', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}>
                            <i className="fa-solid fa-user-shield"></i>
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>Stabilize Your Trajectory</h3>
                            <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '1rem' }}>AI has calculated <b>2 proactive nodes</b> that will increase your stability to <b>96%</b>.</p>
                        </div>
                    </div>
                    <button style={{ padding: '16px 32px', borderRadius: '18px', border: 'none', background: '#fff', color: '#000', fontWeight: 900, cursor: 'pointer', fontSize: '1rem', transition: '0.3s' }}>
                        INITIALIZE STABILIZATION
                    </button>
                </motion.div>

            </div>
        </div>
    );
};

export default RiskStabilityIntelligence;
