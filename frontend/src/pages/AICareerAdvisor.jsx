import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PLATFORMS = [
    "Coursera", "Udemy", "edX", "LinkedIn Learning", "Udacity", "FutureLearn", "Skillshare", "Pluralsight", "Khan Academy",
    "MIT OpenCourseWare", "Stanford Online", "Harvard Online", "Google Career Certificates", "IBM SkillsBuild", "AWS Training",
    "Microsoft Learn", "Oracle University", "Cisco Networking Academy", "HubSpot Academy", "Meta Blueprint", "Alison",
    "Saylor Academy", "Great Learning", "Simplilearn", "DataCamp", "Codecademy", "FreeCodeCamp", "Scrimba", "NPTEL",
    "SWAYAM", "OpenLearn", "Kaggle Learn", "Brilliant", "DeepLearning.AI", "Scaler", "Intellipaat", "UpGrad", "LearnQuest",
    "Treehouse", "Educative", "Springboard", "Cloud Academy", "Linux Foundation Training", "Red Hat Training", "Salesforce Trailhead",
    "Digital Garage", "IBM Developer Skills Network", "MongoDB University", "Flutter Academy", "JetBrains Academy", "JetBrains Hyperskill"
];

const AICareerAdvisor = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [formData, setFormData] = useState({
        goal: '',
        skills: '',
        experience: 'Beginner',
        interest: ''
    });

    const handleGenerate = () => {
        setLoading(true);
        // Simulating AI analysis
        setTimeout(() => {
            setResults({
                goal: formData.goal,
                gap: ["Advanced System Design", "Cloud Architecture (AWS/Azure)", "Real-time Data Streaming", "Microservices Security"],
                timeline: "6 - 8 Months",
                path: [
                    { title: "Foundation & Core Principles", desc: "Mastering the fundamentals of the target domain." },
                    { title: "Advanced Tooling & Frameworks", desc: "In-depth learning of industry-standard tech stacks." },
                    { title: "Architecture & Scale", desc: "Understanding how to build systems for millions of users." },
                    { title: "Security & Optimization", desc: "Hardening the system and ensuring peak performance." }
                ],
                courses: [
                    { name: "Google Data Analytics Professional Certificate", platform: "Coursera", url: "#" },
                    { name: "Advanced React & Next.js Masterclass", platform: "Udemy", url: "#" },
                    { name: "AWS Certified Solutions Architect", platform: "AWS Training", url: "#" },
                    { name: "Full Stack Development Bootcamp", platform: "FreeCodeCamp", url: "#" },
                    { name: "Machine Learning Specialization", platform: "DeepLearning.AI", url: "#" }
                ],
                certs: ["AWS Solutions Architect Associate", "Google Professional Data Engineer", "Microsoft Azure Administrator"],
                projects: ["E-commerce Microservices Platform", "Real-time Crypto Portfolio Tracker", "AI-Powered Predictive Maintenance System"],
                practice: ["LeetCode", "HackerRank", "Codewars", "Frontend Mentor", "Cloud Academy"]
            });
            setLoading(false);
            setStep(3);
        }, 3000);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#070b14', color: 'white', padding: '4rem 2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header Section */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(99, 102, 241, 0.1)', padding: '8px 20px', borderRadius: '100px', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#818cf8', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        <i className="fa-solid fa-sparkles"></i>
                        ANALYSE BY NOTIFY BY AI
                    </div>
                    <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem', background: 'linear-gradient(to bottom, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Your AI Career Architect
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto' }}>
                        Generate high-precision learning roadmaps based on real-time market demand and your personal skill profile.
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', padding: '4rem', backdropFilter: 'blur(10px)', textAlign: 'center' }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>🎯</div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem' }}>What is your ultimate career goal?</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                                {[
                                    { label: "Software Architect", icon: "fa-layer-group" },
                                    { label: "Data Scientist", icon: "fa-chart-network" },
                                    { label: "Cybersecurity Expert", icon: "fa-shield-halved" },
                                    { label: "UX/UI Lead Designer", icon: "fa-pen-nib" },
                                    { label: "Cloud Engineer", icon: "fa-cloud" },
                                    { label: "Marketing Strategist", icon: "fa-bullseye-arrow" }
                                ].map(g => (
                                    <button 
                                        key={g.label}
                                        onClick={() => { setFormData({...formData, goal: g.label}); setStep(2); }}
                                        style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '2rem', borderRadius: '20px', color: 'white', cursor: 'pointer', transition: '0.3s' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'; e.currentTarget.style.borderColor = '#6366f1'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
                                    >
                                        <i className={`fa-solid ${g.icon}`} style={{ fontSize: '1.5rem', color: '#6366f1', marginBottom: '1rem', display: 'block' }}></i>
                                        <span style={{ fontWeight: 700 }}>{g.label}</span>
                                    </button>
                                ))}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="text" 
                                    placeholder="Or type your specific goal here..." 
                                    value={formData.goal}
                                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                                    style={{ width: '100%', maxWidth: '600px', padding: '1.2rem 2rem', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '15px', color: 'white', textAlign: 'center', fontSize: '1.1rem', outline: 'none' }}
                                />
                                {formData.goal && <button onClick={() => setStep(2)} style={{ marginTop: '20px', display: 'block', margin: '20px auto', padding: '10px 30px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>Continue</button>}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', padding: '4rem', backdropFilter: 'blur(10px)' }}
                        >
                            <button onClick={() => setStep(1)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem', fontWeight: 700 }}>
                                <i className="fa-solid fa-arrow-left"></i> Back to Goal
                            </button>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem' }}>Tell us more about your background...</h2>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 700, color: '#94a3b8' }}>Current Skills (Comma separated)</label>
                                    <textarea 
                                        rows="4"
                                        placeholder="e.g. JavaScript, Python, Basics of Cloud, Photoshop..." 
                                        value={formData.skills}
                                        onChange={(e) => setFormData({...formData, skills: e.target.value})}
                                        style={{ width: '100%', padding: '1.5rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', color: 'white', fontSize: '1.1rem', outline: 'none', resize: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 700, color: '#94a3b8' }}>Experience Level</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                                            <button 
                                                key={lvl}
                                                onClick={() => setFormData({...formData, experience: lvl})}
                                                style={{ flex: 1, padding: '1.2rem', borderRadius: '15px', border: '1px solid', borderColor: formData.experience === lvl ? '#6366f1' : 'rgba(255, 255, 255, 0.1)', background: formData.experience === lvl ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.05)', color: 'white', fontWeight: 800, cursor: 'pointer', transition: '0.3s' }}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                    <label style={{ display: 'block', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700, color: '#94a3b8' }}>Primary Domain of Interest</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. E-commerce, Finance, Healthcare..." 
                                        value={formData.interest}
                                        onChange={(e) => setFormData({...formData, interest: e.target.value})}
                                        style={{ width: '100%', padding: '1.2rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '15px', color: 'white', fontSize: '1.1rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleGenerate}
                                disabled={loading}
                                style={{ width: '100%', marginTop: '4rem', padding: '1.5rem', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', border: 'none', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 40px rgba(99, 102, 241, 0.3)', position: 'relative', overflow: 'hidden' }}
                            >
                                {loading ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                                        <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255, 255, 255, 0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                        AI Analyzing Market Trends...
                                    </div>
                                ) : "Generate Personalized Learning Path"}
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && results && (
                        <motion.div 
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {/* Skill Gap Analysis */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', padding: '2.5rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <i className="fa-solid fa-triangle-exclamation" style={{ color: '#f59e0b' }}></i>
                                        Skill Gap Analysis
                                    </h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {results.gap.map((g, i) => (
                                            <span key={i} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '8px 16px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, border: '1px solid rgba(245, 158, 11, 0.2)' }}>{g}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Step-by-Step Roadmap */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', padding: '2.5rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Recommended Learning Path</h3>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '15px', top: '0', bottom: '0', width: '2px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
                                        {results.path.map((p, i) => (
                                            <div key={i} style={{ position: 'relative', paddingLeft: '45px', marginBottom: '2.5rem' }}>
                                                <div style={{ position: 'absolute', left: '0', width: '32px', height: '32px', background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', zIndex: 1 }}>{i + 1}</div>
                                                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 5px' }}>{p.title}</h4>
                                                <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.6 }}>{p.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Courses */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', padding: '2.5rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Top Courses & Resources</h3>
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        {results.courses.map((c, i) => (
                                            <a key={i} href={c.url} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '15px', textDecoration: 'none', transition: '0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}>
                                                <div>
                                                    <h5 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 5px' }}>{c.name}</h5>
                                                    <span style={{ color: '#6366f1', fontSize: '0.85rem', fontWeight: 800 }}>{c.platform}</span>
                                                </div>
                                                <i className="fa-solid fa-arrow-up-right-from-square" style={{ color: '#94a3b8' }}></i>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {/* Timeline Card */}
                                <div style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '30px', padding: '2.5rem', textAlign: 'center' }}>
                                    <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}></i>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '5px' }}>Estimated Timeline</h3>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{results.timeline}</div>
                                    <p style={{ margin: '10px 0 0', opacity: 0.8, fontSize: '0.9rem' }}>At 10-15 hours per week</p>
                                </div>

                                {/* Certifications */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', padding: '2rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <i className="fa-solid fa-certificate" style={{ color: '#818cf8' }}></i>
                                        Target Certifications
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {results.certs.map((crt, i) => (
                                            <div key={i} style={{ padding: '12px 15px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>{crt}</div>
                                        ))}
                                    </div>
                                </div>

                                {/* Projects */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', padding: '2rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <i className="fa-solid fa-laptop-code" style={{ color: '#10b981' }}></i>
                                        Hands-on Projects
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {results.projects.map((p, i) => (
                                            <div key={i} style={{ padding: '12px 15px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>{p}</div>
                                        ))}
                                    </div>
                                </div>

                                {/* Practice Platforms */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', padding: '2rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Practice Arenas</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {results.practice.map((pr, i) => (
                                            <span key={i} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8' }}>{pr}</span>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={() => setStep(1)} style={{ padding: '1.2rem', background: 'rgba(255, 255, 255, 0.05)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', fontWeight: 800, cursor: 'pointer', transition: '0.3s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}>
                                    Run New Analysis
                                </button>
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

export default AICareerAdvisor;
