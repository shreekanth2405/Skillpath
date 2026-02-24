import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const Dashboard = ({ setActiveTab }) => {
    // --- MOCK DATA ---
    const activePath = JSON.parse(localStorage.getItem('activeLearningPath'));

    const learningProgress = [
        { day: 'Mon', xp: 120 }, { day: 'Tue', xp: 210 }, { day: 'Wed', xp: 180 },
        { day: 'Thu', xp: 250 }, { day: 'Fri', xp: 320 }, { day: 'Sat', xp: 150 }, { day: 'Sun', xp: 400 }
    ];

    const marketDemand = [
        { month: 'Jan', ai: 40, web: 60, cloud: 30 },
        { month: 'Feb', ai: 50, web: 55, cloud: 35 },
        { month: 'Mar', ai: 65, web: 50, cloud: 45 },
        { month: 'Apr', ai: 85, web: 45, cloud: 60 },
        { month: 'May', ai: 100, web: 40, cloud: 80 }
    ];

    const skillDistribution = [
        { name: 'Frontend', value: 45, color: '#3b82f6' },
        { name: 'Backend', value: 25, color: '#10b981' },
        { name: 'AI/ML', value: 20, color: '#8b5cf6' },
        { name: 'DevOps', value: 10, color: '#f59e0b' }
    ];

    const upcomingTasks = [
        { id: 1, title: 'Complete React Router Module', time: 'Today', type: 'Course', icon: 'fa-book' },
        { id: 2, title: 'AI Python Assessment', time: 'Tomorrow', type: 'Test', icon: 'fa-code' },
        { id: 3, title: 'Mock Interview: System Design', time: 'In 3 Days', type: 'Prep', icon: 'fa-video' }
    ];

    // --- ANIMATIONS ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0, opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <div style={{ padding: '0 1.5rem 3rem 1.5rem', maxWidth: '1600px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                            Welcome back, Student 👋
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>
                            Ready to level up your career today? Here's your overview.
                        </p>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {activePath && (
                    <motion.div variants={itemVariants} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '1.5rem 2rem', borderRadius: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
                        <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '1px', marginBottom: '5px', color: '#d1fae5' }}><i className="fa-solid fa-satellite-dish fa-beat"></i> ACTIVE LEARNING JOURNEY</div>
                            <h2 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 900 }}>{activePath.pathTitle}</h2>
                            <p style={{ margin: '5px 0 0 0', color: '#ecfdf5', fontWeight: 600 }}>Curriculum Target: {activePath.courses?.length || 0} Modules left • System tracking initialized.</p>
                        </div>
                        <button onClick={() => setActiveTab('skillpaths')} style={{ background: 'white', color: '#059669', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
                            VIEW PATH DETAILS <i className="fa-solid fa-arrow-right" style={{ marginLeft: '5px' }}></i>
                        </button>
                    </motion.div>
                )}

                {/* QUICK STATS ROW */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { title: 'Readiness Score', val: '88%', icon: 'fa-fire', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
                        { title: 'Global Rank', val: 'Top 5%', icon: 'fa-trophy', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
                        { title: 'Active Courses', val: '4', icon: 'fa-book-open-reader', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
                        { title: 'Total XP', val: '2,450', icon: 'fa-star', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' }
                    ].map((stat, i) => (
                        <motion.div key={i} variants={itemVariants} className="hover-3d"
                            style={{
                                background: '#ffffff', padding: '2rem', borderRadius: '20px',
                                border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1.5rem',
                                cursor: 'pointer', overflow: 'hidden', position: 'relative'
                            }}>
                            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: stat.bg, opacity: 0.5, borderRadius: '50%', filter: 'blur(30px)' }}></div>
                            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                                <i className={`fa-solid ${stat.icon}`}></i>
                            </div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h4 style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 0.25rem 0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.title}</h4>
                                <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{stat.val}</h2>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* MAIN DASHBOARD GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>

                    {/* CHART: Learning Activity */}
                    <motion.div variants={itemVariants} whileHover={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
                        style={{ gridColumn: 'span 8', background: '#fff', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Learning Activity (XP)</h3>
                            <button style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>This Week <i className="fa-solid fa-chevron-down ms-2"></i></button>
                        </div>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={learningProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 500 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '5 5' }} />
                                    <Area type="monotone" dataKey="xp" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorXp)" activeDot={{ r: 8, strokeWidth: 0, fill: '#8b5cf6' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* SIDEBAR: Upcoming Tasks & Skills */}
                    <motion.div variants={itemVariants} style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Upcoming Tasks */}
                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', flex: 1 }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fa-solid fa-calendar-check" style={{ color: '#3b82f6' }}></i> Upcoming Schedule
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {upcomingTasks.map(task => (
                                    <motion.div key={task.id} whileHover={{ x: 5 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1', cursor: 'pointer' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                            <i className={`fa-solid ${task.icon}`}></i>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: 0, color: '#1e293b', fontSize: '0.95rem', fontWeight: 700 }}>{task.title}</h4>
                                            <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>{task.time} • {task.type}</p>
                                        </div>
                                        <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1', fontSize: '0.8rem' }}></i>
                                    </motion.div>
                                ))}
                            </div>
                            <button onClick={() => setActiveTab('jobtracker')} style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '12px', marginTop: '1rem', color: '#3b82f6', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseOver={(e) => { e.target.style.background = '#f0f9ff'; e.target.style.borderColor = '#bae6fd'; }}
                                onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = '#e2e8f0'; }}>
                                View Full Calendar
                            </button>
                        </div>

                    </motion.div>

                    {/* CHART: Market Demand */}
                    <motion.div variants={itemVariants} whileHover={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
                        style={{ gridColumn: 'span 6', background: '#fff', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s ease' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fa-solid fa-chart-line" style={{ color: '#ec4899' }}></i> Industry Demand Trends
                        </h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={marketDemand} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 500 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                    <Line type="monotone" dataKey="ai" name="AI/ML" stroke="#ec4899" strokeWidth={4} dot={false} activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="cloud" name="Cloud/DevOps" stroke="#3b82f6" strokeWidth={4} dot={false} />
                                    <Line type="monotone" dataKey="web" name="Web Dev" stroke="#10b981" strokeWidth={4} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* CHART: Skill Distribution */}
                    <motion.div variants={itemVariants} whileHover={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
                        style={{ gridColumn: 'span 6', background: '#fff', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s ease' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fa-solid fa-radar-region" style={{ color: '#8b5cf6' }}></i> Skill Proficiency
                        </h3>
                        <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'center' }}>
                            <ResponsiveContainer width="60%" height="100%">
                                <PieChart>
                                    <Pie data={skillDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                                        {skillDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {skillDistribution.map((skill, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>{skill.name}</span>
                                            <span style={{ color: skill.color, fontWeight: 900, fontSize: '0.9rem' }}>{skill.value}%</span>
                                        </div>
                                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${skill.value}%`, height: '100%', background: skill.color, borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
