import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts';

// ─── CONSTANTS ────────────────────────────────────────────────────────
const COLORS = { primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', purple: '#8b5cf6', cyan: '#06b6d4' };

const CATEGORIES_MAP = {
    'Health': { icon: 'fa-heart-pulse', color: '#ef4444' },
    'Learning': { icon: 'fa-book-open', color: '#6366f1' },
    'Fitness': { icon: 'fa-dumbbell', color: '#f59e0b' },
    'Mindfulness': { icon: 'fa-brain', color: '#8b5cf6' },
    'Productivity': { icon: 'fa-bolt', color: '#06b6d4' },
    'Social': { icon: 'fa-people-group', color: '#10b981' },
};

const INITIAL_HABITS = [
    { id: 1, title: 'Code for 1 Hour', category: 'Learning', frequency: 'Daily', streak: 15, completedToday: false, totalDone: 45, target: 30, xpPerCompletion: 50, color: '#6366f1' },
    { id: 2, title: 'Morning Run (3km)', category: 'Fitness', frequency: 'Daily', streak: 8, completedToday: true, totalDone: 28, target: 30, xpPerCompletion: 40, color: '#10b981' },
    { id: 3, title: 'Read 30 Minutes', category: 'Learning', frequency: 'Daily', streak: 22, completedToday: false, totalDone: 60, target: 60, xpPerCompletion: 30, color: '#f59e0b' },
    { id: 4, title: '10 min Meditation', category: 'Mindfulness', frequency: 'Daily', streak: 5, completedToday: false, totalDone: 12, target: 21, xpPerCompletion: 25, color: '#8b5cf6' },
];

const WEEKLY_DATA = [
    { day: 'Mon', completed: 3, total: 4, xp: 120 },
    { day: 'Tue', completed: 2, total: 4, xp: 80 },
    { day: 'Wed', completed: 4, total: 4, xp: 160 },
    { day: 'Thu', completed: 3, total: 4, xp: 130 },
    { day: 'Fri', completed: 4, total: 4, xp: 160 },
    { day: 'Sat', completed: 2, total: 4, xp: 90 },
    { day: 'Sun', completed: 3, total: 4, xp: 140 },
];

const MONTHLY_HEATMAP = Array.from({ length: 35 }, (_, i) => ({
    day: i + 1,
    value: Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0,
}));

const ACHIEVEMENTS = [
    { icon: 'fa-fire', label: '30-Day Streak', color: '#ef4444', bg: '#fef2f2', unlocked: false },
    { icon: 'fa-star', label: 'First Week Done', color: '#f59e0b', bg: '#fffbeb', unlocked: true },
    { icon: 'fa-trophy', label: '100 Completions', color: '#6366f1', bg: '#eef2ff', unlocked: true },
    { icon: 'fa-crown', label: 'Habit Master', color: '#8b5cf6', bg: '#f5f3ff', unlocked: false },
    { icon: 'fa-bolt', label: 'Perfect Week', color: '#06b6d4', bg: '#ecfeff', unlocked: true },
    { icon: 'fa-medal', label: 'Top 10%', color: '#10b981', bg: '#f0fdf4', unlocked: false },
];

const LEADERBOARD = [
    { rank: 1, name: 'AlexTheDev', xp: 5400, streak: 32, avatar: 'A', color: '#ef4444' },
    { rank: 2, name: 'CodeMasterX', xp: 4900, streak: 28, avatar: 'C', color: '#6366f1' },
    { rank: 3, name: 'Shreyas (You)', xp: 2450, streak: 15, avatar: 'S', color: '#10b981', isUser: true },
    { rank: 4, name: 'DevGirl99', xp: 2100, streak: 11, avatar: 'D', color: '#f59e0b' },
    { rank: 5, name: 'PythonKing', xp: 1800, streak: 8, avatar: 'P', color: '#8b5cf6' },
];

// ─── PROGRESS RING ───────────────────────────────────────────────────
const ProgressRing = ({ pct, size = 80, stroke = 8, color = '#6366f1' }) => {
    const r = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
    );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────
const HabitTracker = ({ userXP = 2450, userLevel = 3, setActiveTab: setGlobalTab }) => {
    const [tab, setTab] = useState('tracker');
    const [habits, setHabits] = useState(INITIAL_HABITS);
    const [totalXP, setTotalXP] = useState(userXP);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newHabit, setNewHabit] = useState({ title: '', category: 'Learning', frequency: 'Daily', reminder: '08:00' });
    const [notification, setNotification] = useState(null);

    const showNotif = useCallback((msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const completeHabit = useCallback((id) => {
        setHabits(prev => prev.map(h => {
            if (h.id !== id || h.completedToday) return h;
            setTotalXP(x => x + h.xpPerCompletion);
            showNotif(`+${h.xpPerCompletion} XP — "${h.title}" completed! 🎉`);
            return { ...h, completedToday: true, streak: h.streak + 1, totalDone: h.totalDone + 1 };
        }));
    }, [showNotif]);

    const addHabit = () => {
        if (!newHabit.title.trim()) return;
        const catInfo = CATEGORIES_MAP[newHabit.category];
        setHabits(p => [...p, { id: Date.now(), ...newHabit, streak: 0, completedToday: false, totalDone: 0, target: 30, xpPerCompletion: 30, color: catInfo?.color || '#6366f1' }]);
        setNewHabit({ title: '', category: 'Learning', frequency: 'Daily', reminder: '08:00' });
        setShowAddModal(false);
        showNotif('New habit added! Keep it up! 💪');
    };

    const completed = habits.filter(h => h.completedToday).length;
    const completionRate = habits.length ? Math.round((completed / habits.length) * 100) : 0;
    const longestStreak = Math.max(...habits.map(h => h.streak));
    const aiInsights = [
        { icon: 'fa-chart-line', color: COLORS.success, text: `Your consistency improved by 18% this month. Keep it up!` },
        { icon: 'fa-clock', color: COLORS.warning, text: `You tend to skip habits on Tuesdays. Try setting a 9 AM reminder.` },
        { icon: 'fa-fire', color: COLORS.danger, text: `"${habits[0]?.title}" is your strongest habit at ${habits[0]?.streak} days streak!` },
        { icon: 'fa-lightbulb', color: COLORS.primary, text: `Adding a mindfulness habit could improve your coding focus by ~30%.` },
    ];

    const heatColor = (v) => {
        if (v === 0) return '#f1f5f9';
        if (v === 1) return '#c7d2fe';
        if (v === 2) return '#818cf8';
        if (v === 3) return '#6366f1';
        return '#4338ca';
    };

    return (
        <div style={{ width: '100%', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif", color: '#0f172a' }}>

            {/* ── NOTIFICATION TOAST ──────────────────── */}
            <AnimatePresence>
                {notification && (
                    <motion.div initial={{ opacity: 0, y: -60, x: '-50%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -60 }} style={{ position: 'fixed', top: '90px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: COLORS.success, color: 'white', padding: '0.85rem 1.5rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 8px 24px rgba(16,185,129,0.4)', whiteSpace: 'nowrap' }}>
                        {notification.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── HEADER ──────────────────────────────── */}
            <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '3rem 3rem 5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '5%', width: '250px', height: '250px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />

                <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Productivity Engine</p>
                            <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, margin: '0 0 0.75rem', lineHeight: 1.1 }}>Habit Command Center</h1>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', margin: 0 }}>Build unstoppable routines. Track streaks. Level up every day.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '1rem 1.5rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fde68a' }}>LVL {userLevel}</div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Current Level</div>
                                <div style={{ marginTop: '8px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${(totalXP % 1500) / 15}%`, height: '100%', background: '#fde68a', borderRadius: '4px', transition: '0.5s' }} />
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{totalXP.toLocaleString()} XP</div>
                            </div>
                            <button onClick={() => setShowAddModal(true)} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '14px', padding: '0.85rem 1.5rem', color: 'white', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '7px', transition: 'background 0.2s' }}>
                                <i className="fa-solid fa-plus" /> Add Habit
                            </button>
                        </div>
                    </div>

                    {/* Stats strip */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                        {[
                            { label: "Today's Progress", value: `${completed}/${habits.length}`, icon: 'fa-circle-check', color: '#a5f3fc' },
                            { label: 'Completion Rate', value: `${completionRate}%`, icon: 'fa-chart-pie', color: '#c4b5fd' },
                            { label: 'Longest Streak', value: `${longestStreak} days`, icon: 'fa-fire', color: '#fde68a' },
                            { label: 'Total XP Earned', value: totalXP.toLocaleString(), icon: 'fa-star', color: '#6ee7b7' },
                        ].map(({ label, value, icon, color }) => (
                            <div key={label} style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1rem 1.5rem', flex: '1', minWidth: '150px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                                    <i className={`fa-solid ${icon}`} style={{ color }} /> {label}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── TABS ─────────────────────────────────── */}
            <div style={{ maxWidth: '1400px', margin: '-2rem auto 0', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
                <div style={{ background: 'white', borderRadius: '18px', padding: '6px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.08)', display: 'flex', gap: '4px', width: 'fit-content' }}>
                    {[['tracker', 'fa-calendar-check', 'My Habits'], ['analytics', 'fa-chart-area', 'Analytics'], ['insights', 'fa-robot', 'AI Insights'], ['achievements', 'fa-trophy', 'Achievements'], ['leaderboard', 'fa-ranking-star', 'Leaderboard']].map(([id, icon, label]) => (
                        <button key={id} onClick={() => setTab(id)} style={{ padding: '0.65rem 1.2rem', borderRadius: '12px', border: 'none', background: tab === id ? `linear-gradient(135deg, #6366f1, #8b5cf6)` : 'transparent', color: tab === id ? 'white' : '#64748b', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                            <i className={`fa-solid ${icon}`} style={{ fontSize: '0.8rem' }} /> {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── CONTENT ──────────────────────────────── */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
                <AnimatePresence mode="wait">

                    {/* TRACKER */}
                    {tab === 'tracker' && (
                        <motion.div key="tracker" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
                                {/* Habit list */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>Today&apos;s Habits</h2>
                                        <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
                                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {habits.map((h, i) => {
                                            const catInfo = CATEGORIES_MAP[h.category] || {};
                                            const progress = Math.round((h.totalDone / h.target) * 100);
                                            return (
                                                <motion.div key={h.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} style={{ background: 'white', borderRadius: '18px', border: `1.5px solid ${h.completedToday ? h.color + '30' : '#e2e8f0'}`, padding: '1.5rem', boxShadow: h.completedToday ? `0 4px 20px ${h.color}15` : '0 2px 8px rgba(15,23,42,0.04)', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                    <button onClick={() => completeHabit(h.id)} style={{ width: '48px', height: '48px', borderRadius: '50%', border: `2.5px solid ${h.completedToday ? h.color : '#e2e8f0'}`, background: h.completedToday ? h.color : 'transparent', color: h.completedToday ? 'white' : '#e2e8f0', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.25s ease' }}>
                                                        <i className={`fa-solid fa-${h.completedToday ? 'check' : 'circle'}`} />
                                                    </button>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                            <i className={`fa-solid ${catInfo.icon}`} style={{ color: catInfo.color, fontSize: '0.85rem' }} />
                                                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: h.completedToday ? '#94a3b8' : '#0f172a', textDecoration: h.completedToday ? 'line-through' : 'none' }}>{h.title}</h3>
                                                            <span style={{ marginLeft: 'auto', background: `${h.color}15`, color: h.color, padding: '2px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800 }}>{h.frequency}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '8px' }}>
                                                            <span style={{ color: '#ef4444', fontSize: '0.82rem', fontWeight: 700 }}><i className="fa-solid fa-fire" style={{ marginRight: '3px' }} />{h.streak} day streak</span>
                                                            <span style={{ color: '#6366f1', fontSize: '0.82rem', fontWeight: 700 }}><i className="fa-solid fa-star" style={{ marginRight: '3px' }} />+{h.xpPerCompletion} XP</span>
                                                            <span style={{ color: '#64748b', fontSize: '0.82rem' }}>{h.totalDone}/{h.target} total</span>
                                                        </div>
                                                        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${Math.min(progress, 100)}%`, height: '100%', background: `linear-gradient(90deg, ${h.color}, ${h.color}bb)`, borderRadius: '999px', transition: 'width 0.8s ease' }} />
                                                        </div>
                                                    </div>
                                                    <div style={{ position: 'relative', flexShrink: 0 }}>
                                                        <ProgressRing pct={progress} size={64} stroke={6} color={h.color} />
                                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, color: h.color }}>{Math.min(progress, 100)}%</div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Weekly heatmap */}
                                    <div style={{ background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '1.5rem', marginTop: '2rem', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                                        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className="fa-solid fa-calendar-days" style={{ color: '#6366f1' }} /> Monthly Streak Heatmap
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                                <div key={i} style={{ textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, paddingBottom: '4px' }}>{d}</div>
                                            ))}
                                            {MONTHLY_HEATMAP.map((cell, i) => (
                                                <div key={i} title={`${cell.value} completions`} style={{ height: '32px', borderRadius: '6px', background: heatColor(cell.value), transition: 'transform 0.15s', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: cell.value >= 2 ? 'white' : '#94a3b8', fontWeight: 700 }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                                                    {cell.value > 0 && cell.value}
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem', justifyContent: 'flex-end' }}>
                                            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Less</span>
                                            {['#f1f5f9', '#c7d2fe', '#818cf8', '#6366f1', '#4338ca'].map(c => (
                                                <div key={c} style={{ width: '18px', height: '18px', borderRadius: '4px', background: c }} />
                                            ))}
                                            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>More</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right panel */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* Today's ring */}
                                    <div style={{ background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '1.5rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                                        <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today&apos;s Progress</h3>
                                        <div style={{ position: 'relative', display: 'inline-flex' }}>
                                            <ProgressRing pct={completionRate} size={120} stroke={12} color={completionRate === 100 ? COLORS.success : COLORS.primary} />
                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontSize: '2rem', fontWeight: 900, color: completionRate === 100 ? COLORS.success : COLORS.primary }}>{completionRate}%</span>
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>{completed}/{habits.length} done</span>
                                            </div>
                                        </div>
                                        {completionRate === 100 && <p style={{ color: COLORS.success, fontWeight: 800, fontSize: '0.9rem', marginTop: '0.75rem' }}>🎉 Perfect Day!</p>}
                                    </div>

                                    {/* Weekly bar */}
                                    <div style={{ background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                                        <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '7px' }}>
                                            <i className="fa-solid fa-chart-column" style={{ color: '#6366f1' }} /> This Week
                                        </h3>
                                        <div style={{ height: '140px' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={WEEKLY_DATA} barSize={24}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                    <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                    <YAxis hide />
                                                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 8px 24px rgba(15,23,42,0.1)', fontSize: '0.8rem', fontWeight: 700 }} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                                                    <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Quick stats */}
                                    {[
                                        { label: 'Best Streak', val: `${longestStreak} days`, icon: 'fa-fire', color: COLORS.danger },
                                        { label: 'Week XP', val: '880 XP', icon: 'fa-star', color: COLORS.warning },
                                        { label: 'Habits Active', val: habits.length, icon: 'fa-list-check', color: COLORS.primary },
                                    ].map(({ label, val, icon, color }) => (
                                        <div key={label} style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}15`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}><i className={`fa-solid ${icon}`} /></div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>{label}</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{val}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ANALYTICS */}
                    {tab === 'analytics' && (
                        <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                                {[
                                    {
                                        title: 'Weekly Completion Trend', icon: 'fa-chart-area', color: '#6366f1',
                                        chart: <AreaChart data={WEEKLY_DATA}><defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 700 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 8px 24px rgba(15,23,42,0.1)' }} /><Area type="monotone" dataKey="completed" stroke="#6366f1" fill="url(#g1)" strokeWidth={3} /></AreaChart>
                                    },
                                    {
                                        title: 'XP Earned Per Day', icon: 'fa-star', color: '#f59e0b',
                                        chart: <BarChart data={WEEKLY_DATA}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} /><XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 700 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 8px 24px rgba(15,23,42,0.1)' }} /><Bar dataKey="xp" fill="#f59e0b" radius={[6, 6, 0, 0]} /></BarChart>
                                    },
                                    {
                                        title: 'Category Breakdown', icon: 'fa-chart-pie', color: '#8b5cf6',
                                        span2: true,
                                        chart: <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                            <PieChart width={200} height={200}><Pie data={Object.entries(CATEGORIES_MAP).map(([k, v]) => ({ name: k, value: habits.filter(h => h.category === k).length * 25 + 5, color: v.color }))} cx={100} cy={100} innerRadius={55} outerRadius={85} dataKey="value">
                                                {Object.entries(CATEGORIES_MAP).map(([k, v], i) => <Cell key={i} fill={v.color} />)}
                                            </Pie><Tooltip /></PieChart>
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {Object.entries(CATEGORIES_MAP).map(([k, v]) => (
                                                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: v.color, flexShrink: 0 }} />
                                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', flex: 1 }}>{k}</span>
                                                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: v.color }}>{habits.filter(h => h.category === k).length} habits</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    },
                                ].map(({ title, icon, color, chart, span2 }, i) => (
                                    <div key={i} style={{ background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15,23,42,0.04)', gridColumn: span2 ? '1 / -1' : 'auto' }}>
                                        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className={`fa-solid ${icon}`} style={{ color }} /> {title}
                                        </h3>
                                        <div style={{ height: span2 ? 'auto' : '240px' }}>
                                            {span2 ? chart : <ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* AI INSIGHTS */}
                    {tab === 'insights' && (
                        <motion.div key="insights" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                            <div style={{ maxWidth: '760px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}><i className="fa-solid fa-robot" /></div>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>AI Habit Coach</h2>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Personalized insights based on your behavior patterns</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                    {aiInsights.map((ins, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${ins.color}15`, color: ins.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}><i className={`fa-solid ${ins.icon}`} /></div>
                                            <p style={{ margin: 0, color: '#374151', lineHeight: 1.6, fontWeight: 500, fontSize: '0.9rem' }}>{ins.text}</p>
                                        </motion.div>
                                    ))}
                                </div>
                                <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))', border: '1.5px solid rgba(99,102,241,0.15)', borderRadius: '18px', padding: '2rem' }}>
                                    <h3 style={{ margin: '0 0 1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fa-solid fa-lightbulb" style={{ color: '#f59e0b' }} /> Suggested New Habits
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        {[['Deep Work (2hrs)', '#6366f1', 'fa-laptop-code', 60, 'Productivity'], ['Cold Shower', '#06b6d4', 'fa-shower', 20, 'Health'], ['Gratitude Journal', '#10b981', 'fa-pen', 15, 'Mindfulness'], ['No Screen 9PM', '#f59e0b', 'fa-mobile-screen-button', 10, 'Health']].map(([t, c, icon, xp, cat]) => (
                                            <div key={t} style={{ background: 'white', borderRadius: '12px', border: `1px solid ${c}25`, padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${c}15`, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><i className={`fa-solid ${icon}`} /></div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '0.875rem' }}>{t}</p>
                                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>+{xp} XP · {cat}</p>
                                                </div>
                                                <button onClick={() => { setNewHabit({ title: t, category: cat, frequency: 'Daily', reminder: '08:00' }); setShowAddModal(true); }} style={{ background: `${c}15`, border: 'none', color: c, width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}><i className="fa-solid fa-plus" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ACHIEVEMENTS */}
                    {tab === 'achievements' && (
                        <motion.div key="achievements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                            <h2 style={{ margin: '0 0 2rem', fontSize: '1.5rem', fontWeight: 900 }}>Achievement Gallery</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
                                {ACHIEVEMENTS.map((a, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -5 }} style={{ background: 'white', borderRadius: '18px', border: `1.5px solid ${a.unlocked ? a.color + '30' : '#e2e8f0'}`, padding: '1.75rem', textAlign: 'center', opacity: a.unlocked ? 1 : 0.5, filter: a.unlocked ? 'none' : 'grayscale(100%)', boxShadow: a.unlocked ? `0 4px 16px ${a.color}20` : '0 2px 8px rgba(15,23,42,0.04)' }}>
                                        <div style={{ width: '64px', height: '64px', background: a.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.75rem', color: a.color }}>
                                            {a.unlocked ? <i className={`fa-solid ${a.icon}`} /> : <i className="fa-solid fa-lock" />}
                                        </div>
                                        <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{a.label}</p>
                                        <span style={{ fontSize: '0.75rem', color: a.unlocked ? a.color : '#94a3b8', fontWeight: 700 }}>{a.unlocked ? '✓ Unlocked' : 'Locked'}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* LEADERBOARD */}
                    {tab === 'leaderboard' && (
                        <motion.div key="lb" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ maxWidth: '700px' }}>
                            <h2 style={{ margin: '0 0 2rem', fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fa-solid fa-crown" style={{ color: '#f59e0b' }} /> Global Leaderboard
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {LEADERBOARD.map((u, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} style={{ background: 'white', borderRadius: '16px', border: `1.5px solid ${u.isUser ? '#6366f1' : '#e2e8f0'}`, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: u.isUser ? '0 4px 20px rgba(99,102,241,0.12)' : '0 2px 8px rgba(15,23,42,0.04)' }}>
                                        <div style={{ width: '32px', textAlign: 'center', fontWeight: 900, fontSize: '1.2rem', color: u.rank <= 3 ? '#f59e0b' : '#94a3b8' }}>#{u.rank}</div>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg, ${u.color}, ${u.color}bb)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', flexShrink: 0 }}>{u.avatar}</div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: '0 0 2px', fontWeight: 800, fontSize: '0.95rem', color: u.isUser ? '#6366f1' : '#0f172a' }}>{u.name}</p>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}><i className="fa-solid fa-fire" style={{ color: '#ef4444', marginRight: '3px' }} />{u.streak} day streak</p>
                                        </div>
                                        <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#6366f1' }}>{u.xp.toLocaleString()} XP</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* ── ADD HABIT MODAL ──────────────────────── */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setShowAddModal(false)}>
                        <motion.div initial={{ y: 40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(15,23,42,0.2)' }}>
                            <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '1.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, color: 'white', fontWeight: 900, fontSize: '1.2rem' }}><i className="fa-solid fa-plus" style={{ marginRight: '8px' }} />Add New Habit</h3>
                                <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-xmark" /></button>
                            </div>
                            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {[
                                    { label: 'Habit Title', el: <input value={newHabit.title} onChange={e => setNewHabit(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Read for 30 minutes" /> },
                                    { label: 'Category', el: <select value={newHabit.category} onChange={e => setNewHabit(p => ({ ...p, category: e.target.value }))}>{Object.keys(CATEGORIES_MAP).map(c => <option key={c}>{c}</option>)}</select> },
                                    { label: 'Frequency', el: <select value={newHabit.frequency} onChange={e => setNewHabit(p => ({ ...p, frequency: e.target.value }))}><option>Daily</option><option>Weekly</option><option>Mon–Fri</option></select> },
                                    { label: 'Reminder Time', el: <input type="time" value={newHabit.reminder} onChange={e => setNewHabit(p => ({ ...p, reminder: e.target.value }))} /> },
                                ].map(({ label, el }) => (
                                    <div key={label}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#374151' }}>{label}</label>
                                        {React.cloneElement(el, { style: { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', background: '#f8fafc', color: '#0f172a', boxSizing: 'border-box', transition: 'border-color 0.2s', ...el.props.style } })}
                                    </div>
                                ))}
                                <button onClick={addHabit} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>
                                    <i className="fa-solid fa-plus" /> Create Habit
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HabitTracker;
