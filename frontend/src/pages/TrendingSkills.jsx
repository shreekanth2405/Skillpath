import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const TrendingSkills = () => {
    const [timeRange, setTimeRange] = useState('6M');
    const [region, setRegion] = useState('Global');
    const [darkMode, setDarkMode] = useState(true);

    const skillsData = [
        {
            id: 1,
            name: 'Generative AI',
            icon: 'fa-brain',
            growth: '+142%',
            score: 98,
            color: '#3b82f6',
            trend: [
                { val: 10 }, { val: 25 }, { val: 20 }, { val: 45 }, { val: 60 }, { val: 85 }, { val: 98 }
            ]
        },
        {
            id: 2,
            name: 'Rust Programming',
            icon: 'fa-gears',
            growth: '+68%',
            score: 85,
            color: '#ef4444',
            trend: [
                { val: 30 }, { val: 35 }, { val: 50 }, { val: 48 }, { val: 65 }, { val: 78 }, { val: 85 }
            ]
        },
        {
            id: 3,
            name: 'Cybersecurity Architecture',
            icon: 'fa-shield-halved',
            growth: '+45%',
            score: 92,
            color: '#10b981',
            trend: [
                { val: 40 }, { val: 45 }, { val: 55 }, { val: 65 }, { val: 75 }, { val: 88 }, { val: 92 }
            ]
        },
        {
            id: 4,
            name: 'Cloud Computing (AWS/Azure)',
            icon: 'fa-cloud',
            growth: '+32%',
            score: 88,
            color: '#0ea5e9',
            trend: [
                { val: 60 }, { val: 58 }, { val: 65 }, { val: 70 }, { val: 78 }, { val: 82 }, { val: 88 }
            ]
        },
        {
            id: 5,
            name: 'Prompt Engineering',
            icon: 'fa-terminal',
            growth: '+210%',
            score: 75,
            color: '#8b5cf6',
            trend: [
                { val: 5 }, { val: 12 }, { val: 28 }, { val: 40 }, { val: 55 }, { val: 68 }, { val: 75 }
            ]
        }
    ];

    const theme = {
        bg: darkMode ? '#020617' : '#f8fafc',
        card: darkMode ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
        border: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#e2e8f0',
        text: darkMode ? '#f8fafc' : '#0f172a',
        subText: darkMode ? '#94a3b8' : '#64748b',
        shadow: darkMode ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)'
    };

    return (
        <div style={{ padding: '2rem', background: theme.bg, minHeight: '100vh', color: theme.text, fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Header Section with Filters */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: 0 }}>Skill Path AI Market Skills Pulse</h1>
                        <p style={{ color: theme.subText, fontWeight: 600 }}>Real-time demand forecasting & trend analysis</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {/* Region Selector */}
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            style={{ padding: '10px 20px', borderRadius: '12px', background: theme.card, border: `1px solid ${theme.border}`, color: theme.text, fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                        >
                            <option>Global</option>
                            <option>US</option>
                            <option>India</option>
                            <option>Europe</option>
                        </select>

                        {/* Time Range */}
                        <div style={{ display: 'flex', background: theme.card, padding: '4px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
                            {['1M', '6M', '1Y'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    style={{
                                        padding: '6px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: timeRange === range ? '#3b82f6' : 'transparent',
                                        color: timeRange === range ? 'white' : theme.subText,
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        transition: '0.3s'
                                    }}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            style={{ width: '45px', height: '45px', borderRadius: '12px', background: theme.card, border: `1px solid ${theme.border}`, color: theme.text, cursor: 'pointer' }}
                        >
                            <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                        </button>
                    </div>
                </div>

                {/* Skills Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
                    {skillsData.map((skill, index) => (
                        <motion.div
                            key={skill.id}
                            whileHover={{ y: -5, boxShadow: theme.shadow }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                background: theme.card,
                                borderRadius: '24px',
                                padding: '1.5rem',
                                border: `1px solid ${theme.border}`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{ width: '50px', height: '50px', background: `${skill.color}15`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: skill.color, fontSize: '1.4rem' }}>
                                        <i className={`fa-solid ${skill.icon}`}></i>
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{skill.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.9rem', fontWeight: 700, marginTop: '4px' }}>
                                            <i className="fa-solid fa-arrow-trend-up"></i> {skill.growth} growth
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.7rem', color: theme.subText, fontWeight: 900, letterSpacing: '1px' }}>DEMAND SCORE</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: skill.color }}>{skill.score}</div>
                                </div>
                            </div>

                            {/* Center Section: Sparkline */}
                            <div style={{ height: '80px', width: '100%', padding: '0 10px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={skill.trend}>
                                        <Line
                                            type="monotone"
                                            dataKey="val"
                                            stroke={skill.color}
                                            strokeWidth={3}
                                            dot={false}
                                            animationDuration={1500}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Bottom Section: Actions */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <span style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '100px', background: theme.border, fontWeight: 800 }}>TECH ADOPTION</span>
                                    <span style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '100px', background: '#3b82f615', color: '#3b82f6', fontWeight: 800 }}>HIGH VOLUME</span>
                                </div>
                                <button style={{ padding: '10px 20px', borderRadius: '12px', background: 'transparent', border: `1px solid ${theme.border}`, color: theme.text, fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: '0.3s' }}>
                                    VIEW DETAILS <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginLeft: '8px', fontSize: '0.7rem' }}></i>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Insight */}
                <div style={{ marginTop: '3rem', padding: '2rem', background: '#3b82f610', borderRadius: '24px', border: '1px dashed #3b82f640', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: 600, color: theme.subText }}>
                        <i className="fa-solid fa-lightbulb" style={{ color: '#f59e0b', marginRight: '10px' }}></i>
                        Market Insight: <b style={{ color: theme.text }}>{skillsData[0].name}</b> is currently outperforming all other skills in the <b style={{ color: '#3b82f6' }}>{region}</b> market.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrendingSkills;
