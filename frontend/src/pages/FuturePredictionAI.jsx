import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TECH_DEPARTMENTS } from '../data/departments_data';

const FuturePredictionAI = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);

    const filteredDepts = useMemo(() => {
        return TECH_DEPARTMENTS.filter(d => 
            d.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 12); // Show top 12 matches
    }, [searchTerm]);

    const runAnalysis = (dept) => {
        setAnalyzing(true);
        setSelectedDept(dept);
        
        // Simulate complex data crunching
        setTimeout(() => {
            const confidence = 85 + Math.floor(Math.random() * 10);
            const status = Math.random() > 0.3 ? "Bullish" : "Volatile";
            const demandLevel = 60 + Math.floor(Math.random() * 35);
            
            setPredictionResult({
                dept,
                confidence,
                status,
                demandLevel,
                hiringTrend: status === "Bullish" ? "+24% Growth" : "+8% Steady",
                pivotRisk: Math.floor(Math.random() * 40),
                desc: `Our neural network predicts a significant ${status.toLowerCase()} phase for ${dept} between 2026-2028. ${status === "Bullish" ? "Investment in specialized tools and cross-domain knowledge is highly recommended." : "Market saturation is high; focusing on niche architectural roles is safer."}`
            });
            setAnalyzing(false);
        }, 2000);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', color: 'white', padding: '6rem 2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                
                {/* Header Section */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(56, 189, 248, 0.1)', padding: '10px 25px', borderRadius: '100px', border: '1px solid rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '2rem' }}>
                        <i className="fa-solid fa-crystal-ball"></i>
                        Market Predator AI
                    </div>
                    <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem', background: 'linear-gradient(to bottom, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Choose Department. <span style={{ color: '#38bdf8' }}>Own the Future.</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '800px', margin: '0 auto' }}>
                        Analyze trends across 150+ technology departments. Our AI predicts market shifts, salary pivots, and skill survival rates.
                    </p>
                </motion.div>

                {/* Filter & Search Section */}
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '30px', padding: '3rem', backdropFilter: 'blur(10px)', marginBottom: '4rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                    <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
                        <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '25px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }}></i>
                        <input 
                            type="text" 
                            placeholder="Find Department (e.g. Generative AI, CyberSecurity, FinTech...)" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '1.5rem 1.5rem 1.5rem 4rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: 'white', fontSize: '1.1rem', outline: 'none', transition: '0.3s' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
                        {filteredDepts.map(dept => (
                            <motion.button 
                                key={dept}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => runAnalysis(dept)}
                                style={{ 
                                    padding: '1rem', 
                                    background: selectedDept === dept ? 'linear-gradient(135deg, #38bdf8, #818cf8)' : 'rgba(255,255,255,0.03)', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    borderRadius: '15px', 
                                    color: 'white', 
                                    fontSize: '0.9rem', 
                                    fontWeight: 700, 
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <span>{dept}</span>
                                <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', opacity: 0.5 }}></i>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Analysis Result Section */}
                <AnimatePresence mode="wait">
                    {analyzing ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ textAlign: 'center', padding: '5rem' }}
                        >
                            <div style={{ width: '80px', height: '80px', border: '5px solid rgba(56, 189, 248, 0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem' }}></div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Crunching {selectedDept} Data Points...</h3>
                            <p style={{ color: '#94a3b8' }}>Analyzing GitHub repos, Job market volatility, and VC investment trends.</p>
                        </motion.div>
                    ) : predictionResult && (
                        <motion.div 
                            key="result"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}
                        >
                            {/* Detailed Analysis Card */}
                            <div style={{ background: 'rgba(25, 33, 49, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '40px', padding: '3.5rem', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{predictionResult.dept}</h2>
                                        <span style={{ color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px' }}>Future Index Analysis</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981' }}>{predictionResult.confidence}%</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 900 }}>AI CONFIDENCE</div>
                                    </div>
                                </div>

                                <p style={{ fontSize: '1.2rem', color: '#94a3b8', lineHeight: '1.8', marginBottom: '3rem' }}>
                                    {predictionResult.desc}
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                                    {[
                                        { label: "Market Status", value: predictionResult.status, color: predictionResult.status === "Bullish" ? "#10b981" : "#f59e0b" },
                                        { label: "Annual Demand", value: predictionResult.hiringTrend, color: "#38bdf8" },
                                        { label: "Obsolescence Risk", value: `${predictionResult.pivotRisk}%`, color: predictionResult.pivotRisk > 30 ? "#ef4444" : "#10b981" }
                                    ].map(stat => (
                                        <div key={stat.label}>
                                            <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase' }}>{stat.label}</p>
                                            <p style={{ fontSize: '1.5rem', fontWeight: 900, color: stat.color }}>{stat.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* visual stats card */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '30px', padding: '2.5rem' }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <i className="fa-solid fa-chart-simple" style={{ color: '#38bdf8' }}></i>
                                        Growth Projection
                                    </h4>
                                    <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '15px', padding: '0 10px' }}>
                                        {[40, 65, 50, 85, 95, 80].map((h, i) => (
                                            <div key={i} style={{ flex: 1, background: i === 4 ? '#38bdf8' : 'rgba(255,255,255,0.05)', height: `${h}%`, borderRadius: '8px', position: 'relative' }}>
                                                {i === 4 && <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', fontWeight: 900, color: '#38bdf8' }}>PEAK</div>}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', color: '#64748b', fontSize: '0.7rem', fontWeight: 800 }}>
                                        <span>2024</span>
                                        <span>2026 (PROJECTED)</span>
                                        <span>2029</span>
                                    </div>
                                </div>

                                <div style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', borderRadius: '30px', padding: '2.5rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                                    <i className="fa-solid fa-bolt" style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '5rem', opacity: 0.1 }}></i>
                                    <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1rem' }}>Pivot Now</h4>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.9 }}>
                                        Get a personalized certification roadmap for {predictionResult.dept} to beat the 2026 automation wave.
                                    </p>
                                    <button style={{ padding: '0.8rem 1.5rem', background: 'white', border: 'none', borderRadius: '12px', color: '#38bdf8', fontWeight: 900, cursor: 'pointer' }}>
                                        Generate Roadmap
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default FuturePredictionAI;
