import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SalaryInsights = () => {
    const [level, setLevel] = useState('Mid');
    const [isDownloading, setIsDownloading] = useState(false);

    const salaryData = {
        Entry: [
            { name: 'AI & ML', salary: 95000, growth: '+18.5%', icon: 'fa-microchip', color: '#3b82f6', breakdown: 'High demand for Prompt Engineers' },
            { name: 'FinTech', salary: 88000, growth: '+12.2%', icon: 'fa-building-columns', color: '#60a5fa', breakdown: 'Hedge fund analyst roles' },
            { name: 'Cloud Ops', salary: 82000, growth: '+10.8%', icon: 'fa-cloud', color: '#93c5fd', breakdown: 'DevOps Associate positions' },
            { name: 'Cybersecurity', salary: 80000, growth: '+14.5%', icon: 'fa-user-shield', color: '#bfdbfe', breakdown: 'SOC Analyst L1' },
            { name: 'Data Science', salary: 78000, growth: '+9.2%', icon: 'fa-chart-pie', color: '#dbeafe', breakdown: 'Junior Data Analyst' },
        ],
        Mid: [
            { name: 'AI & ML', salary: 165000, growth: '+22.4%', icon: 'fa-microchip', color: '#2563eb', breakdown: 'Neural Network Optimization' },
            { name: 'FinTech', salary: 145000, growth: '+15.1%', icon: 'fa-building-columns', color: '#3b82f6', breakdown: 'High-frequency trading devs' },
            { name: 'Cybersecurity', salary: 138000, growth: '+19.3%', icon: 'fa-user-shield', color: '#60a5fa', breakdown: 'Penetration Testing Specialist' },
            { name: 'Cloud Ops', salary: 132000, growth: '+13.7%', icon: 'fa-cloud', color: '#93c5fd', breakdown: 'Infrastructure Architect' },
            { name: 'Data Science', salary: 128000, growth: '+11.5%', icon: 'fa-chart-pie', color: '#bfdbfe', breakdown: 'MLOps Engineer' },
        ],
        Senior: [
            { name: 'AI & ML', salary: 285000, growth: '+25.8%', icon: 'fa-microchip', color: '#1d4ed8', breakdown: 'Principal AI Scientist' },
            { name: 'FinTech', salary: 245000, growth: '+18.2%', icon: 'fa-building-columns', color: '#2563eb', breakdown: 'VP of Engineering (Finance)' },
            { name: 'Cybersecurity', salary: 220000, growth: '+21.5%', icon: 'fa-user-shield', color: '#3b82f6', breakdown: 'Chief Information Security Officer' },
            { name: 'Cloud Ops', salary: 210000, growth: '+16.4%', icon: 'fa-cloud', color: '#60a5fa', breakdown: 'Head of Infrastructure' },
            { name: 'Data Science', salary: 195000, growth: '+14.9%', icon: 'fa-chart-pie', color: '#93c5fd', breakdown: 'Director of Data Science' },
        ]
    };

    const handleDownload = () => {
        setIsDownloading(true);
        setTimeout(() => setIsDownloading(false), 2000);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>{data.name}</p>
                    <p style={{ margin: '5px 0', color: '#3b82f6', fontWeight: 700 }}>Avg: ${data.salary.toLocaleString()}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{data.breakdown}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ padding: '2.5rem', background: '#f8fafc', minHeight: '100vh', fontFamily: "'Outfit', sans-serif", color: '#0f172a' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* Header Container */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>Skill Path AI Salary Economics</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500, marginTop: '5px' }}>Industry-wide compensation benchmarks & growth indices.</p>
                    </div>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        style={{ padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: '0.2s' }}
                    >
                        {isDownloading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-file-export"></i>}
                        {isDownloading ? 'GENERRATING...' : 'DOWNLOAD REPORT'}
                    </button>
                </div>

                {/* Main Insight Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: '#fff', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.02), 0 10px 10px -5px rgba(0,0,0,0.01)', border: '1px solid #f1f5f9' }}
                >
                    {/* Control Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', background: '#f1f5f9', padding: '6px', borderRadius: '16px' }}>
                            {['Entry', 'Mid', 'Senior'].map(lvl => (
                                <button
                                    key={lvl}
                                    onClick={() => setLevel(lvl)}
                                    style={{
                                        padding: '10px 28px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: level === lvl ? '#fff' : 'transparent',
                                        boxShadow: level === lvl ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
                                        color: level === lvl ? '#3b82f6' : '#64748b',
                                        fontWeight: 800,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        transition: '0.3s'
                                    }}
                                >
                                    {lvl.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, fontSize: '0.9rem', background: '#f0fdf4', padding: '8px 16px', borderRadius: '100px' }}>
                            <i className="fa-solid fa-arrow-trend-up"></i> MARKET UPWARD TREND
                        </div>
                    </div>

                    {/* Chart & Stats Wrapper */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', alignItems: 'center' }}>

                        {/* Horizontal Bar Chart */}
                        <div style={{ height: '450px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={salaryData[level]}
                                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#475569', fontWeight: 700, fontSize: 13 }}
                                        width={100}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                    <Bar dataKey="salary" radius={[0, 10, 10, 0]} barSize={24}>
                                        {salaryData[level].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* List Breakdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {salaryData[level].map((item, i) => (
                                <motion.div
                                    key={i}
                                    layout
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}
                                >
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <div style={{ width: '45px', height: '45px', background: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, border: '1px solid #e2e8f0' }}>
                                            <i className={`fa-solid ${item.icon}`}></i>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{item.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>AVG. COMP: <span style={{ color: '#1e293b' }}>${item.salary.toLocaleString()}</span></div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#10b981', fontWeight: 900, fontSize: '0.9rem' }}>{item.growth}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>YOY GROWTH</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Economic Indicator Strip */}
                <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                    {[
                        { label: 'Inflation Adjusted', val: '+2.4%', sub: 'Real Wage Growth', icon: 'fa-scale-balanced' },
                        { label: 'Regional Premium', val: 'Silicon Valley', sub: 'Highest Comp Location', icon: 'fa-location-dot' },
                        { label: 'Remote Index', val: '86%', sub: 'Work Flexibility Access', icon: 'fa-wifi' },
                    ].map((stat, i) => (
                        <div key={i} style={{ padding: '1.5rem', background: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                <i className={`fa-solid ${stat.icon}`}></i>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{stat.label}</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{stat.val}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{stat.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalaryInsights;
