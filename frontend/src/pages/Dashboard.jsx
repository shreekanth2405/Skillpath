import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const Dashboard = ({ setActiveTab, userXP, userLevel, userCoins, user }) => {
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
                            Welcome back, {user?.name || 'Student'} 👋
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
                        { title: 'Market Readiness', val: `${Math.min(100, (userXP / 5000) * 100).toFixed(0)}%`, icon: 'fa-fire', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
                        { title: 'Global Rank', val: userLevel > 5 ? 'Top 1%' : 'Top 5%', icon: 'fa-trophy', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
                        { title: 'Current Wallet', val: userCoins.toLocaleString(), icon: 'fa-coins', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
                        { title: 'Total XP Earned', val: userXP.toLocaleString(), icon: 'fa-star', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' }
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

                    {/* ═══════════ SOLUTIONS — UNIFIED SECTION ═══════════ */}
                    <motion.div variants={itemVariants} style={{ gridColumn: 'span 12', borderRadius: '24px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}>

                        {/* Solutions Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
                            padding: '2rem 2.5rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent)', pointerEvents: 'none' }}></div>
                            <div style={{ position: 'absolute', bottom: '-30px', left: '40%', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent)', pointerEvents: 'none' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'white' }}>
                                        <i className="fa-solid fa-flask-vial"></i>
                                    </div>
                                    <div>
                                        <h2 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 900, margin: '0 0 4px 0' }}>
                                            <i className="fa-solid fa-sparkles" style={{ color: '#f59e0b', marginRight: '8px' }}></i>
                                            Solutions — Domain Practical Hub
                                        </h2>
                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                                            Master any domain with 500+ hands-on labs, real projects, and guided challenges across 20 domains
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {[
                                            { val: '500+', label: 'Labs' },
                                            { val: '20', label: 'Domains' },
                                            { val: '76k+', label: 'XP' },
                                        ].map((s, i) => (
                                            <div key={i} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '8px 14px' }}>
                                                <div style={{ color: 'white', fontWeight: 900, fontSize: '1rem' }}>{s.val}</div>
                                                <div style={{ color: '#64748b', fontSize: '0.6rem', fontWeight: 700 }}>{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setActiveTab('practical')} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none', padding: '12px 22px', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        Explore All <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Domain Cards Grid — Inside the same section */}
                        <div style={{ background: '#f8fafc', padding: '1.5rem 2rem 2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem' }}>
                                {[
                                    { name: 'Web Development', icon: 'fa-globe', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)', labs: 42, xp: '3.6k', desc: 'React, Next.js, APIs' },
                                    { name: 'AI & Machine Learning', icon: 'fa-brain', gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)', labs: 35, xp: '4.5k', desc: 'TensorFlow, LangChain' },
                                    { name: 'Data Science', icon: 'fa-chart-line', gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', labs: 38, xp: '3.1k', desc: 'Pandas, PySpark' },
                                    { name: 'Cybersecurity', icon: 'fa-shield-halved', gradient: 'linear-gradient(135deg, #ef4444, #f97316)', labs: 30, xp: '4.2k', desc: 'CTF, Ethical Hacking' },
                                    { name: 'Cloud & DevOps', icon: 'fa-cloud', gradient: 'linear-gradient(135deg, #f59e0b, #eab308)', labs: 28, xp: '3.6k', desc: 'Docker, K8s, Terraform' },
                                    { name: 'Mobile Dev', icon: 'fa-mobile-screen-button', gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)', labs: 25, xp: '3.2k', desc: 'React Native, Flutter' },
                                    { name: 'Blockchain & Web3', icon: 'fa-link', gradient: 'linear-gradient(135deg, #6366f1, #a855f7)', labs: 20, xp: '4.8k', desc: 'Solidity, NFTs, DeFi' },
                                    { name: 'Game Dev', icon: 'fa-gamepad', gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)', labs: 22, xp: '3.5k', desc: 'Unity, Phaser.js' },
                                    { name: 'DSA & CP', icon: 'fa-code', gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)', labs: 50, xp: '4.1k', desc: 'DP, Graphs, Contests' },
                                    { name: 'Database & SQL', icon: 'fa-database', gradient: 'linear-gradient(135deg, #059669, #10b981)', labs: 32, xp: '3.3k', desc: 'PostgreSQL, MongoDB' },
                                    { name: 'UI/UX Design', icon: 'fa-palette', gradient: 'linear-gradient(135deg, #e11d48, #f43f5e)', labs: 26, xp: '2.8k', desc: 'Figma, Design Systems' },
                                    { name: 'Testing & QA', icon: 'fa-vial-circle-check', gradient: 'linear-gradient(135deg, #16a34a, #22c55e)', labs: 24, xp: '3.0k', desc: 'Jest, Cypress, Selenium' },
                                    { name: 'System Design', icon: 'fa-sitemap', gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)', labs: 20, xp: '4.7k', desc: 'Microservices, CDN' },
                                    { name: 'IoT & Embedded', icon: 'fa-microchip', gradient: 'linear-gradient(135deg, #ca8a04, #eab308)', labs: 18, xp: '3.3k', desc: 'Arduino, MQTT, TinyML' },
                                    { name: 'AR / VR / XR', icon: 'fa-vr-cardboard', gradient: 'linear-gradient(135deg, #be185d, #ec4899)', labs: 15, xp: '3.6k', desc: 'Three.js, WebXR, Unity' },
                                    { name: 'NLP', icon: 'fa-language', gradient: 'linear-gradient(135deg, #4f46e5, #818cf8)', labs: 22, xp: '3.8k', desc: 'spaCy, BERT, LoRA' },
                                    { name: 'Computer Vision', icon: 'fa-eye', gradient: 'linear-gradient(135deg, #0d9488, #14b8a6)', labs: 20, xp: '3.7k', desc: 'OpenCV, SAM, GANs' },
                                    { name: 'Quantum Computing', icon: 'fa-atom', gradient: 'linear-gradient(135deg, #7e22ce, #a855f7)', labs: 12, xp: '5.0k', desc: 'Qiskit, Grover, Shor' },
                                    { name: 'Networking', icon: 'fa-network-wired', gradient: 'linear-gradient(135deg, #0369a1, #0284c7)', labs: 18, xp: '3.1k', desc: 'TCP/IP, gRPC, DNS' },
                                    { name: 'Linux & OS', icon: 'fa-terminal', gradient: 'linear-gradient(135deg, #374151, #6b7280)', labs: 22, xp: '3.3k', desc: 'Bash, systemd, Kernel' },
                                ].map((domain, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5, boxShadow: '0 16px 35px rgba(0,0,0,0.1)' }}
                                        onClick={() => setActiveTab('practical')}
                                        style={{
                                            background: '#ffffff',
                                            borderRadius: '16px',
                                            padding: '1.2rem',
                                            cursor: 'pointer',
                                            border: '1px solid #f1f5f9',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: domain.gradient }} />
                                        <div style={{
                                            width: '44px', height: '44px', borderRadius: '12px',
                                            background: domain.gradient, display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontSize: '1.1rem', color: 'white', marginBottom: '0.6rem',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                        }}>
                                            <i className={`fa-solid ${domain.icon}`}></i>
                                        </div>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', margin: '0 0 3px 0', lineHeight: 1.2 }}>{domain.name}</h4>
                                        <p style={{ color: '#94a3b8', fontSize: '0.72rem', margin: '0 0 0.6rem 0', fontWeight: 500 }}>{domain.desc}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', fontWeight: 700, color: '#64748b' }}>
                                                <i className="fa-solid fa-flask" style={{ color: '#3b82f6' }}></i> {domain.labs} Labs
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', fontWeight: 700, color: '#f59e0b' }}>
                                                <i className="fa-solid fa-bolt"></i> {domain.xp} XP
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
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
