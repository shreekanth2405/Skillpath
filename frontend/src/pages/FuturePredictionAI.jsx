import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PREDICTIONS = [
    { id: 1, title: "Market Sentiment: Q3 2026", type: "Market", confidence: 92, status: "Bullish", desc: "Expect a 24% surge in demand for Quantum Computing and Bio-Tech integration in Enterprise systems." },
    { id: 2, title: "Automation Risk: Backend Dev", type: "Vulnerability", confidence: 88, status: "Moderate", desc: "AI-driven code generation will automate 40% of standard CRUD operations. Transition to Architecture recommended." },
    { id: 3, title: "Salary Trend: AI Ethicist", type: "Financial", confidence: 95, status: "Rising", desc: "Entry-level roles expected to start at $145k due to new EU and US AI safety regulations." },
    { id: 4, title: "Skill Obsolescence: Legacy Java", type: "Vulnerability", confidence: 76, status: "Critical", desc: "Maintenance of legacy systems is shifting to automated migration tools. Pivot to Rust/Go for high-tier roles." }
];

const MARKET_TRENDS = [
    { label: "Generative AI", value: 98, color: "#6366f1" },
    { label: "Green Tech", value: 85, color: "#10b981" },
    { label: "Cyber Security", value: 92, color: "#f59e0b" },
    { label: "Robotics", value: 78, color: "#ef4444" },
    { label: "Web3/Blockchain", value: 45, color: "#8b5cf6" }
];

const FuturePredictionAI = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    const runAnalysis = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setReportGenerated(true);
            setShowReportModal(true);
        }, 3500);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', color: 'white', padding: '4rem 2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                
                {/* Report Generation Modal */}
                <AnimatePresence>
                    {showReportModal && (
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                style={{ background: '#1e293b', padding: '3rem', borderRadius: '40px', maxWidth: '1000px', width: '100%', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}
                            >
                                <button onClick={() => setShowReportModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', color: '#38bdf8' }}>Report Ready.</h2>
                                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2rem' }}>
                                            Your Full Career Trajectory Report (2026-2030) has been meticulously analyzed and compiled by our neural engine.
                                        </p>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '2.5rem' }}>
                                            <button style={{ padding: '1.2rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', borderRadius: '15px', color: '#38bdf8', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <i className="fa-solid fa-file-pdf"></i> Download PDF Report
                                            </button>
                                            <button style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <i className="fa-solid fa-file-word"></i> Export as Document (.docx)
                                            </button>
                                            <button style={{ padding: '1.2rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '15px', color: '#10b981', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <i className="fa-solid fa-paper-plane"></i> Email Full Analysis to Me
                                            </button>
                                        </div>

                                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                            * This report includes market sensitivity charts, skill pivot recommendations, and personalized salary projections.
                                        </p>
                                    </div>
                                    <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                                        <img 
                                            src="/images/report_preview.png" 
                                            alt="AI Report Preview" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Hero Header */}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(56, 189, 248, 0.1)', padding: '10px 25px', borderRadius: '100px', border: '1px solid rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '2rem' }}>
                        <i className="fa-solid fa-crystal-ball"></i>
                        Next-Gen Future Prediction AI
                    </div>
                    <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem', background: 'linear-gradient(to bottom, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        The Future. <span style={{ color: '#38bdf8' }}>Simulated.</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                        Our AI engine processes over 18 Billion data points from global markets, job boards, and technology whitepapers to predict your career trajectory with 94% accuracy.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
                    <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Predict Your Survival in the AI Era</h2>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                            We don't just guess. We analyze emerging patterns in LLMs, industrial automation, and demographic shifts to show you exactly which skills will make you indispensable.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '3rem' }}>
                            {[
                                { icon: "fa-shield-halved", title: "Skill Vulnerability Mapping", color: "#10b981" },
                                { icon: "fa-arrow-trend-up", title: "Market Demand Forecasting", color: "#38bdf8" },
                                { icon: "fa-sack-dollar", title: "Predictive Salary Analytics", color: "#f59e0b" }
                            ].map(item => (
                                <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ width: '50px', height: '50px', background: `${item.color}20`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, fontSize: '1.2rem' }}>
                                        <i className={`fa-solid ${item.icon}`}></i>
                                    </div>
                                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{item.title}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={runAnalysis}
                            disabled={analyzing}
                            style={{ width: '100%', padding: '1.5rem', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', border: 'none', borderRadius: '20px', color: 'white', fontSize: '1.2rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 40px rgba(56, 189, 248, 0.4)', position: 'relative', overflow: 'hidden' }}
                        >
                            {analyzing ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                                    <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                    Processing Global Variables...
                                </div>
                            ) : "Run Global Career Simulation"}
                        </button>
                    </motion.div>

                    <motion.div 
                        initial={{ x: 50, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }} 
                        transition={{ delay: 0.4 }}
                        style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '40px', padding: '3rem', backdropFilter: 'blur(10px)', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}
                    >
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fa-solid fa-chart-line" style={{ color: '#38bdf8' }}></i>
                            2026-2030 Market Index
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {MARKET_TRENDS.map(t => (
                                <div key={t.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 800 }}>
                                        <span style={{ color: '#94a3b8' }}>{t.label}</span>
                                        <span>{t.value}% Demand</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <motion.div 
                                            initial={{ width: 0 }} 
                                            animate={{ width: `${t.value}%` }} 
                                            transition={{ duration: 1, delay: 1 }}
                                            style={{ height: '100%', background: t.color, borderRadius: '10px', boxShadow: `0 0 15px ${t.color}60` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {reportGenerated && (
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}
                        >
                            {PREDICTIONS.map(p => (
                                <motion.div 
                                    key={p.id}
                                    whileHover={{ y: -10 }}
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '30px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '15px' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#38bdf8', padding: '5px 12px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '100px' }}>{p.type}</span>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981' }}>{p.confidence}%</div>
                                    </div>
                                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '10px 0' }}>{p.title}</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                                    <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px', color: p.status === 'Bullish' || p.status === 'Rising' ? '#10b981' : '#f59e0b', fontSize: '0.8rem', fontWeight: 900 }}>
                                        <i className={`fa-solid ${p.status === 'Bullish' || p.status === 'Rising' ? 'fa-arrow-trend-up' : 'fa-triangle-exclamation'}`}></i>
                                        {p.status}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Integration Notice */}
                <div style={{ padding: '3rem', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(129, 140, 248, 0.05))', borderRadius: '40px', border: '1px solid rgba(56, 189, 248, 0.1)', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>Global Prediction Engine Active</h3>
                    <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
                        Connected to World Bank, IMF, LinkedIn Economic Graph, and 2,400+ tech journals. Predictions updated every 6 hours.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default FuturePredictionAI;
