import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';
import { LEVEL_SYSTEM, XP_RULES } from '../data/coursesMaster';

const Analytics = () => {
    const reportRef = useRef(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const userStats = {
        level: 3,
        xp: 2450,
        badges: [
            { id: 1, name: "Python Master", icon: "🐍", color: "#3776ab" },
            { id: 2, name: "AI Explorer", icon: "🤖", color: "#ff4b4b" },
            { id: 3, name: "Fast Learner", icon: "⚡", color: "#f59e0b" },
            { id: 4, name: "7-Day Streak", icon: "🔥", color: "#ef4444" },
            { id: 5, name: "Project Champion", icon: "🏆", color: "#10b981" }
        ],
        departments: [
            { name: "CSE/IT", progress: 85, color: "#3b82f6" },
            { name: "AI & ML", progress: 40, color: "#8b5cf6" },
            { name: "Electronics", progress: 15, color: "#10b981" },
            { name: "Business", progress: 60, color: "#f59e0b" }
        ]
    };

    const currentLevel = LEVEL_SYSTEM.find(l => userStats.xp >= l.xp) || LEVEL_SYSTEM[0];
    const nextLevel = LEVEL_SYSTEM[LEVEL_SYSTEM.indexOf(currentLevel) + 1] || currentLevel;
    const progressToNext = ((userStats.xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100;

    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;
        setIsGeneratingPDF(true);
        try {
            const canvas = await html2canvas(reportRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Skill_Path_AI_Report.pdf');
        } catch (e) {
            console.error(e);
            alert('Failed to generate PDF');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    return (
        <div style={{ gridColumn: '1 / -1', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Skill Path AI Career Dashboard</h1>
                    <p style={{ color: '#94a3b8' }}>Visualizing your ascent through 20 global departments.</p>
                </div>
                <button
                    className="primary-btn pulse-glow"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', height: 'fit-content' }}
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                >
                    {isGeneratingPDF ? <i className="fa-solid fa-sync fa-spin"></i> : <i className="fa-solid fa-file-pdf"></i>} EXPORT PORTFOLIO
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                {/* LEVEL WIDGET */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: '#60a5fa' }}>LVL {currentLevel.level}</div>
                        <div style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem' }}>{currentLevel.title}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', height: '12px', borderRadius: '100px', overflow: 'hidden', marginBottom: '1rem' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700 }}>
                        <span>{userStats.xp} XP</span>
                        <span style={{ color: '#94a3b8' }}>{nextLevel.xp} XP FOR LVL {nextLevel.level}</span>
                    </div>
                </motion.div>

                {/* BADGE SHOWCASE */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}><i className="fa-solid fa-award"></i> Achievement Badges</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {userStats.badges.map(badge => (
                            <motion.div
                                key={badge.id}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '1rem',
                                    borderRadius: '16px',
                                    textAlign: 'center',
                                    border: `1px solid ${badge.color}44`,
                                    width: '100px'
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{badge.icon}</div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800 }}>{badge.name}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* DEPARTMENT PROGRESS */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '2rem' }}><i className="fa-solid fa-layer-group"></i> Department Mastery Matrix</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {userStats.departments.map(dept => (
                            <div key={dept.name}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 700 }}>
                                    <span>{dept.name}</span>
                                    <span style={{ color: dept.color }}>{dept.progress}%</span>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.3)', height: '8px', borderRadius: '100px', overflow: 'hidden' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${dept.progress}%` }} style={{ height: '100%', background: dept.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* HIDDEN REPORT FOR PDF EXPORT */}
            <div style={{ position: 'absolute', left: '-9999px' }}>
                <div ref={reportRef} style={{ width: '800px', background: 'white', color: 'black', padding: '50px' }}>
                    <h1 style={{ color: '#1e3a8a' }}>Skill Path AI Official Report</h1>
                    <p>Candidate Performance Summary</p>
                    <hr />
                    <h2>Level {userStats.level} Specialist</h2>
                    <p>Total XP: {userStats.xp}</p>
                    <h3>Mastered Departments:</h3>
                    <ul>
                        {userStats.departments.map(d => <li key={d.name}>{d.name}: {d.progress}% Mastery</li>)}
                    </ul>
                    <h3>Badges Earned:</h3>
                    <p>{userStats.badges.map(b => b.name).join(' • ')}</p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
