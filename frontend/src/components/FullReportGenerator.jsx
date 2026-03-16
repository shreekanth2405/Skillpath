import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FullReportGenerator = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showReport, setShowReport] = useState(false);

    const startAnalysis = () => {
        setIsAnalyzing(true);
        // Simulate deep analysis of platform data
        setTimeout(() => {
            setIsAnalyzing(false);
            setShowReport(true);
        }, 4000);
    };

    return (
        <>
            {/* Report Generation Bar / Trigger */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                    background: 'linear-gradient(135deg, #0f172a, #1e293b)', 
                    padding: '1.2rem 2.5rem', 
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                    marginBottom: '2rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Backdrop Pulse Effect */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.1) 0%, transparent 70%)', zIndex: 0 }} />
                
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '50px', height: '50px', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontSize: '1.4rem' }}>
                        <i className={`fa-solid ${isAnalyzing ? 'fa-spinner fa-spin' : 'fa-brain-circuit'}`}></i>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '2px', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                                ANALYSE BY NOTIFY BY AI
                            </span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <i className="fa-solid fa-circle" style={{ fontSize: '6px' }}></i> ENGINE ACTIVE
                            </span>
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', margin: 0 }}>Full Platform Intelligence & Analysis Report</h3>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0 0' }}>Insights from Mentorship Hub, Career Advisor, Games, and Skill Progress.</p>
                    </div>
                </div>

                <button 
                    onClick={startAnalysis}
                    disabled={isAnalyzing}
                    style={{ 
                        position: 'relative', zIndex: 1,
                        background: 'linear-gradient(to right, #38bdf8, #818cf8)', 
                        color: 'white', 
                        border: 'none', 
                        padding: '12px 30px', 
                        borderRadius: '14px', 
                        fontWeight: 900, 
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
                >
                    {isAnalyzing ? "Processing Data..." : "Generate Full Report"}
                    {!isAnalyzing && <i className="fa-solid fa-wand-magic-sparkles"></i>}
                </button>
            </motion.div>

            {/* FULL REPORT MODAL */}
            <AnimatePresence>
                {showReport && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(15px)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={{ 
                                background: '#ffffff', 
                                width: '100%', 
                                maxWidth: '1100px', 
                                height: '90vh', 
                                borderRadius: '32px', 
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
                                color: '#0f172a'
                            }}
                        >
                            {/* Modal Header */}
                            <div style={{ padding: '2rem 3rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '45px', height: '45px', background: '#0f172a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                        <i className="fa-solid fa-brain"></i>
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>Platform Intelligence Report</h2>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Period: Q1 2026 • Serial: SP-AI-77291</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fa-solid fa-download"></i> Save Report
                                    </button>
                                    <button onClick={() => setShowReport(false)} style={{ width: '45px', height: '45px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Report Content (Scrollable) */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '3rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem' }}>
                                    
                                    {/* Summary Card */}
                                    <div style={{ gridColumn: 'span 12', padding: '2.5rem', background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '24px', color: 'white' }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Executive Summary</div>
                                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Your Professional Trajectory is <span style={{ color: '#38bdf8' }}>Exponential.</span></h1>
                                        <p style={{ fontSize: '1.2rem', color: '#94a3b8', lineHeight: 1.8, maxWidth: '800px' }}>
                                            Based on our multi-dimensional analysis of your <strong>Mentorship Sessions</strong>, <strong>Game Performance</strong>, and <strong>Skill Acquisitions</strong>, you are currently on track to reach Senior Architect competency within 12 months.
                                        </p>
                                    </div>

                                    {/* Mentorship Analysis */}
                                    <div style={{ gridColumn: 'span 6', padding: '2rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <i className="fa-solid fa-users-viewfinder" style={{ color: '#8b5cf6' }}></i> Mentorship Engagement
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            {[
                                                { label: 'Academic & Coding', val: '84%', color: '#8b5cf6' },
                                                { label: 'Job Prep', val: '92%', color: '#10b981' },
                                                { label: 'Future Predictions', val: '76%', color: '#38bdf8' }
                                            ].map(item => (
                                                <div key={item.label}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
                                                        <span>{item.label}</span>
                                                        <span>{item.val}</span>
                                                    </div>
                                                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                                                        <div style={{ width: item.val, height: '100%', background: item.color, borderRadius: '10px' }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Career Advisor Insights */}
                                    <div style={{ gridColumn: 'span 6', padding: '2rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#38bdf8' }}></i> Career Roadmap Status
                                        </h3>
                                        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                            <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '5px' }}>Target Goal: Software Architect</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Projected Completion: Oct 2026</div>
                                            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <div style={{ width: '65%', height: '100%', background: 'linear-gradient(to right, #38bdf8, #818cf8)', borderRadius: '10px' }}></div>
                                                </div>
                                                <span style={{ fontWeight: 800, color: '#38bdf8' }}>65%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full Analysis Sections */}
                                    <div style={{ gridColumn: 'span 12' }}>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '1.5rem' }}>Global Sentiment & Future Analytics</h3>
                                        <img 
                                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" 
                                            alt="Analytics Graph" 
                                            style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '24px', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer: Action Bar */}
                            <div style={{ padding: '2rem 3rem', background: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '5px' }}>Share & Export Full Analysis</div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        {[
                                            { name: 'PDF', icon: 'fa-file-pdf', color: '#ef4444' },
                                            { name: 'Doc', icon: 'fa-file-word', color: '#3b82f6' },
                                            { name: 'Mail', icon: 'fa-envelope', color: '#f59e0b' },
                                            { name: 'Image', icon: 'fa-image', color: '#ec4899' },
                                            { name: 'WhatsApp', icon: 'fa-whatsapp', color: '#10b981' }
                                        ].map(opt => (
                                            <button 
                                                key={opt.name}
                                                style={{ 
                                                    background: 'rgba(255,255,255,0.05)', 
                                                    border: '1px solid rgba(255,255,255,0.1)', 
                                                    color: 'white', 
                                                    padding: '10px 18px', 
                                                    borderRadius: '12px', 
                                                    fontSize: '0.85rem', 
                                                    fontWeight: 800, 
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = opt.color; }}
                                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                            >
                                                <i className={`fa-brands ${opt.icon} fa-solid`} style={{ color: opt.color }}></i>
                                                {opt.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white' }}>94% Accuracy</div>
                                    <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 900 }}>NOTIFY BY AI CERTIFIED</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FullReportGenerator;
