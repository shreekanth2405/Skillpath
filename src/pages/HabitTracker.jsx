import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line, ScatterChart, Scatter, ZAxis, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const HabitTracker = ({ userXP, userLevel, setActiveTab: setGlobalActiveTab }) => {
    const [activeTab, setActiveTab] = useState('tracker'); // 'tracker', 'challenges', 'leaderboard', 'analytics'
    const [energy, setEnergy] = useState(85);

    const useEnergy = (amount) => {
        setEnergy(prev => Math.max(0, prev - amount));
    };

    const recoverEnergy = () => {
        setEnergy(prev => Math.min(100, prev + 20));
    };

    const habitData = [
        { day: 'Mon', "Coding": 120, "Reading": 30 },
        { day: 'Tue', "Coding": 90, "Reading": 45 },
        { day: 'Wed', "Coding": 150, "Reading": 60 },
        { day: 'Thu', "Coding": 60, "Reading": 30 },
        { day: 'Fri', "Coding": 180, "Reading": 20 },
        { day: 'Sat', "Coding": 45, "Reading": 90 },
        { day: 'Sun', "Coding": 200, "Reading": 120 },
    ];

    const leaderboardData = [
        { rank: 1, name: 'AlexTheDev', xp: 5400, streak: 32, avatar: 'fa-user-ninja' },
        { rank: 2, name: 'CodeMasterX', xp: 4900, streak: 28, avatar: 'fa-user-astronaut' },
        { rank: 3, name: 'Syed User (You)', xp: userXP || 2450, streak: 15, avatar: 'fa-user-tie', isUser: true },
        { rank: 4, name: 'DevGirl99', xp: 2100, streak: 11, avatar: 'fa-user-graduate' },
        { rank: 5, name: 'PythonKing', xp: 1800, streak: 8, avatar: 'fa-user-secret' },
    ];

    const monthlyData = [
        { month: 'Jan', "Hours": 45, "Consistency": 70 },
        { month: 'Feb', "Hours": 55, "Consistency": 75 },
        { month: 'Mar', "Hours": 60, "Consistency": 65 },
        { month: 'Apr', "Hours": 75, "Consistency": 85 },
        { month: 'May', "Hours": 85, "Consistency": 92 },
        { month: 'Jun', "Hours": 110, "Consistency": 96 },
    ];

    const platformData = [
        { name: 'LeetCode', value: 45, color: '#f59e0b' },
        { name: 'HackerRank', value: 25, color: '#10b981' },
        { name: 'Codeforces', value: 15, color: '#3b82f6' },
        { name: 'FreeCodeCamp', value: 15, color: '#8b5cf6' },
    ];

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8, rotateX: 30, y: 50 },
        visible: (i) => ({
            opacity: 1,
            scale: 1,
            rotateX: 0,
            y: 0,
            transition: { type: 'spring', damping: 15, delay: i * 0.1 }
        })
    };

    return (
        <div style={{ padding: '2rem', background: '#f8fafc', color: '#0f172a', fontFamily: "'Inter', sans-serif", position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflowY: 'auto', zIndex: 9999, boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                    <button onClick={() => setGlobalActiveTab('dashboard')} style={{ background: 'white', border: '1px solid #cbd5e1', padding: '0.8rem 1.2rem', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i> Exit
                    </button>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, lineHeight: 1 }}>
                            Skill Path AI Habit Tracker
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>Build strong learning habits and conquer task challenges.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', background: 'white', padding: '0.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <button onClick={() => setActiveTab('tracker')} style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', border: 'none', background: activeTab === 'tracker' ? '#3b82f6' : 'transparent', color: activeTab === 'tracker' ? 'white' : '#64748b', fontWeight: 700, cursor: 'pointer', transition: '0.3s' }}>
                        <i className="fa-solid fa-calendar-check" style={{ marginRight: '8px' }}></i> Tracker
                    </button>
                    <button onClick={() => setActiveTab('challenges')} style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', border: 'none', background: activeTab === 'challenges' ? '#8b5cf6' : 'transparent', color: activeTab === 'challenges' ? 'white' : '#64748b', fontWeight: 700, cursor: 'pointer', transition: '0.3s' }}>
                        <i className="fa-solid fa-bolt" style={{ marginRight: '8px' }}></i> Challenges
                    </button>
                    <button onClick={() => setActiveTab('leaderboard')} style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', border: 'none', background: activeTab === 'leaderboard' ? '#f59e0b' : 'transparent', color: activeTab === 'leaderboard' ? 'white' : '#64748b', fontWeight: 700, cursor: 'pointer', transition: '0.3s' }}>
                        <i className="fa-solid fa-trophy" style={{ marginRight: '8px' }}></i> Leaderboard
                    </button>
                    <button onClick={() => setActiveTab('analytics')} style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', border: 'none', background: activeTab === 'analytics' ? '#10b981' : 'transparent', color: activeTab === 'analytics' ? 'white' : '#64748b', fontWeight: 700, cursor: 'pointer', transition: '0.3s' }}>
                        <i className="fa-solid fa-chart-pie" style={{ marginRight: '8px' }}></i> Analytics
                    </button>
                </div>
            </div>

            <div style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
                <AnimatePresence mode="wait">

                    {/* HABIT TRACKER TAB */}
                    {activeTab === 'tracker' && (
                        <motion.div key="tracker" initial={{ opacity: 0, rotateY: -30, x: -100 }} animate={{ opacity: 1, rotateY: 0, x: 0 }} exit={{ opacity: 0, rotateY: 30, x: 100 }} transition={{ duration: 0.5, type: 'spring' }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', transformStyle: 'preserve-3d' }}>
                            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5, z: 50 }} style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', transformStyle: 'preserve-3d', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-15px', right: '-15px', background: '#3b82f6', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(59,130,246,0.4)', transform: 'translateZ(30px)' }}>
                                    <i className="fa-solid fa-fire"></i>
                                </div>
                                <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.4rem', fontWeight: 800, transform: 'translateZ(20px)' }}>Current Streak</h3>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', transform: 'translateZ(20px)' }}>
                                    <span style={{ fontSize: '4rem', fontWeight: 900, color: '#3b82f6', lineHeight: 1 }}>15</span>
                                    <span style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 600 }}>Days</span>
                                </div>
                                <p style={{ color: '#10b981', fontWeight: 700, marginTop: '1rem', transform: 'translateZ(20px)' }}><i className="fa-solid fa-arrow-trend-up"></i> Top 5% consistency this month!</p>
                            </motion.div>

                            <motion.div custom={0.5} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.05, rotateX: -5, rotateY: -5, z: 50 }} style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', transformStyle: 'preserve-3d', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-15px', right: '-15px', background: '#f59e0b', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(245,158,11,0.4)', transform: 'translateZ(30px)' }}>
                                    <i className="fa-solid fa-bolt"></i>
                                </div>
                                <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.4rem', fontWeight: 800, transform: 'translateZ(20px)' }}>Neural Stamina</h3>
                                <div style={{ transform: 'translateZ(20px)', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 700, color: energy < 30 ? '#ef4444' : '#64748b' }}>
                                        <span>Capacity</span>
                                        <span>{energy}%</span>
                                    </div>
                                    <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${energy}%` }}
                                            style={{ height: '100%', background: energy < 30 ? '#ef4444' : 'linear-gradient(90deg, #f59e0b, #fbbf24)', boxShadow: '0 0 10px rgba(245,158,11,0.3)' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', transform: 'translateZ(20px)' }}>
                                    <button onClick={() => useEnergy(15)} disabled={energy < 15} style={{ flex: 1, padding: '0.6rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: energy < 15 ? 'not-allowed' : 'pointer', opacity: energy < 15 ? 0.5 : 1 }}>Deep Work</button>
                                    <button onClick={recoverEnergy} style={{ flex: 1, padding: '0.6rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Rest & Recharge</button>
                                </div>
                            </motion.div>

                            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.02, rotateX: -2, z: 30 }} style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', gridColumn: '1 / -1', transformStyle: 'preserve-3d' }}>
                                <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', fontSize: '1.4rem', fontWeight: 800, transform: 'translateZ(20px)' }}><i className="fa-solid fa-chart-column" style={{ color: '#8b5cf6', marginRight: '10px' }}></i> 3D Consistency Analysis</h3>
                                <div style={{ height: '350px', transform: 'translateZ(30px)' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={habitData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="day" stroke="#64748b" fontWeight={700} />
                                            <YAxis stroke="#64748b" />
                                            <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 600 }} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
                                            <Legend wrapperStyle={{ fontWeight: 700 }} />
                                            <Bar dataKey="Coding" stackId="a" fill="#3b82f6" radius={[0, 0, 8, 8]} animationDuration={1500} />
                                            <Bar dataKey="Reading" stackId="a" fill="#8b5cf6" radius={[8, 8, 0, 0]} animationDuration={1500} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* CHALLENGES TAB */}
                    {activeTab === 'challenges' && (
                        <motion.div key="challenges" initial={{ opacity: 0, rotateX: -30, y: -100 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} exit={{ opacity: 0, rotateX: 30, y: 100 }} transition={{ duration: 0.5, type: 'spring' }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', transformStyle: 'preserve-3d' }}>
                            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.05, rotateY: 5, z: 40 }} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(16,185,129,0.3)', position: 'relative', overflow: 'hidden' }}>
                                <i className="fa-solid fa-check-double" style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '8rem', opacity: 0.2 }}></i>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 800 }}>Daily Quest</h3>
                                <p style={{ opacity: 0.9, marginBottom: '1.5rem', fontWeight: 600 }}>Complete 3 Algorithm Problems</p>
                                <div style={{ background: 'rgba(255,255,255,0.2)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
                                    <div style={{ width: '66%', background: 'white', height: '100%', borderRadius: '5px' }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                                    <span>2 / 3</span>
                                    <span>+50 XP</span>
                                </div>
                                <button style={{ width: '100%', marginTop: '1.5rem', background: 'white', color: '#059669', border: 'none', padding: '1rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>Go to Practice</button>
                            </motion.div>

                            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.05, rotateY: -5, z: 40 }} style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', color: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(139,92,246,0.3)', position: 'relative', overflow: 'hidden' }}>
                                <i className="fa-solid fa-book-open" style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '8rem', opacity: 0.2 }}></i>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 800 }}>Weekly Challenge</h3>
                                <p style={{ opacity: 0.9, marginBottom: '1.5rem', fontWeight: 600 }}>Read 2 System Design Chapters</p>
                                <div style={{ background: 'rgba(255,255,255,0.2)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
                                    <div style={{ width: '50%', background: 'white', height: '100%', borderRadius: '5px' }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                                    <span>1 / 2</span>
                                    <span>+150 XP</span>
                                </div>
                                <button style={{ width: '100%', marginTop: '1.5rem', background: 'white', color: '#6d28d9', border: 'none', padding: '1rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>Open Library</button>
                            </motion.div>

                            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.05, rotateX: 5, z: 40 }} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(245,158,11,0.3)', position: 'relative', overflow: 'hidden' }}>
                                <i className="fa-solid fa-medal" style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '8rem', opacity: 0.2 }}></i>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 800 }}>Mastery Objective</h3>
                                <p style={{ opacity: 0.9, marginBottom: '1.5rem', fontWeight: 600 }}>Deploy a Full-Stack React App</p>
                                <div style={{ background: 'rgba(255,255,255,0.2)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
                                    <div style={{ width: '10%', background: 'white', height: '100%', borderRadius: '5px' }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                                    <span>Pending</span>
                                    <span>+500 XP</span>
                                </div>
                                <button style={{ width: '100%', marginTop: '1.5rem', background: 'white', color: '#d97706', border: 'none', padding: '1rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>View Project Specs</button>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* LEADERBOARD TAB */}
                    {activeTab === 'leaderboard' && (
                        <motion.div key="leaderboard" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5, type: 'spring' }} style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', transformStyle: 'preserve-3d' }}>
                            <h3 style={{ margin: '0 0 2rem 0', color: '#1e293b', fontSize: '1.6rem', fontWeight: 900, textAlign: 'center', transform: 'translateZ(20px)' }}><i className="fa-solid fa-crown" style={{ color: '#f59e0b', marginRight: '10px' }}></i> Global Learning Leaderboard</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', transform: 'translateZ(30px)' }}>
                                {leaderboardData.map((user, idx) => (
                                    <motion.div key={user.rank} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ scale: 1.02, x: 10, background: '#f8fafc' }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem', borderRadius: '12px', border: user.isUser ? '2px solid #3b82f6' : '1px solid #e2e8f0', background: user.isUser ? '#eff6ff' : 'white', transition: '0.2s' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: user.rank <= 3 ? '#f59e0b' : '#94a3b8', width: '30px', textAlign: 'center' }}>#{user.rank}</div>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: user.isUser ? '#3b82f6' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: user.isUser ? 'white' : '#64748b', fontSize: '1.2rem' }}>
                                                <i className={`fa-solid ${user.avatar}`}></i>
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{user.name}</h4>
                                                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}><i className="fa-solid fa-fire" style={{ color: '#ef4444' }}></i> {user.streak} Day Streak</span>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#3b82f6' }}>
                                            {user.xp} XP
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ANALYTICS TAB */}
                    {activeTab === 'analytics' && (
                        <motion.div key="analytics" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5, type: 'spring' }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', transformStyle: 'preserve-3d' }}>
                            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.02, rotateX: 2, z: 20 }} style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', transformStyle: 'preserve-3d' }}>
                                <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', fontSize: '1.4rem', fontWeight: 800, transform: 'translateZ(20px)' }}><i className="fa-solid fa-chart-area" style={{ color: '#10b981', marginRight: '10px' }}></i> Monthly Learning Consistency</h3>
                                <div style={{ height: '300px', transform: 'translateZ(30px)' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="month" stroke="#64748b" fontWeight={700} />
                                            <YAxis stroke="#64748b" />
                                            <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                                            <Area type="monotone" dataKey="Consistency" stroke="#10b981" fill="#10b981" fillOpacity={0.3} animationDuration={1500} />
                                            <Area type="monotone" dataKey="Hours" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} animationDuration={1500} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.02, rotateX: -2, z: 20 }} style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', transformStyle: 'preserve-3d' }}>
                                <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', fontSize: '1.4rem', fontWeight: 800, transform: 'translateZ(20px)' }}><i className="fa-solid fa-code" style={{ color: '#f59e0b', marginRight: '10px' }}></i> Coding Platform Distribution</h3>
                                <div style={{ height: '300px', transform: 'translateZ(30px)' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={platformData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none" animationDuration={1500}>
                                                {platformData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                                            <Legend wrapperStyle={{ fontWeight: 700 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.02, rotateY: 2, z: 20 }} style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', gridColumn: '1 / -1', transformStyle: 'preserve-3d' }}>
                                <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', fontSize: '1.4rem', fontWeight: 800, transform: 'translateZ(20px)' }}><i className="fa-solid fa-chart-line" style={{ color: '#8b5cf6', marginRight: '10px' }}></i> Monthly XP Growth vs. Challenges Done</h3>
                                <div style={{ height: '300px', transform: 'translateZ(30px)' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="month" stroke="#64748b" fontWeight={700} />
                                            <YAxis stroke="#64748b" />
                                            <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                                            <Legend wrapperStyle={{ fontWeight: 700 }} />
                                            <Line type="monotone" dataKey="Consistency" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6, strokeWidth: 3 }} animationDuration={1500} />
                                            <Line type="monotone" dataKey="Hours" stroke="#f43f5e" strokeWidth={4} dot={{ r: 6, strokeWidth: 3 }} animationDuration={1500} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default HabitTracker;
