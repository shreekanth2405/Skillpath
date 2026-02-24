import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { genAI } from '../services/gemini';
import { MASTER_COURSES } from '../data/coursesMaster';

const SkillPaths = ({ setActiveTab }) => {
    const [activeTabState, setActiveTabState] = useState('generator');
    const [isGenerating, setIsGenerating] = useState(false);
    const [personalizedPath, setPersonalizedPath] = useState(null);
    const [savedPath, setSavedPath] = useState(() => JSON.parse(localStorage.getItem('activeLearningPath')) || null);

    // Form Stats
    const [formData, setFormData] = useState({
        currentLevel: 'Beginner',
        department: 'Computer Science',
        domain: 'Web Development',
        careerGoal: 'Full-stack Architect'
    });

    const generateAIPath = async () => {
        setIsGenerating(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Act as an Elite AI Career Master. 
            USER PROFILE:
            - Current Level: ${formData.currentLevel}
            - Department: ${formData.department}
            - Domain: ${formData.domain}
            - Goal: ${formData.careerGoal}
            
            TASK: Generate a Personalized 6-Month Skill Path.
            INCLUDE:
            1. 5 Targeted Course Names from ${formData.domain}.
            2. Weekly Learning Timeline description.
            3. Daily 2-hour study routine description.
            4. 2 Milestone Projects.
            
            Return ONLY valid JSON format with this exact structure: { "pathTitle": "...", "timeline": "...", "dailyPlan": "...", "courses": [...], "projects": [...] }`;

            const result = await model.generateContent(prompt);
            let text = result.response.text();
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(text);
            setPersonalizedPath(parsed);
        } catch (e) {
            console.error("AI Generation Error: Make sure your API key is valid.", e);
            alert("Failed to generate path. Please ensure your Gemini AI API is correctly configured or try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const lockPath = () => {
        if (!personalizedPath) return;
        localStorage.setItem('activeLearningPath', JSON.stringify(personalizedPath));
        setSavedPath(personalizedPath);
        alert("ACTIVE PATH SECURED! \nYour dashboard has been updated to track this curriculum. Your ecosystem is now routing traffic to these goals.");
        setActiveTab('dashboard'); // Redirect to dashboard to see it
    };

    const clearPath = () => {
        if (window.confirm("Are you sure you want to delete your currently locked path? You will lose active tracking data.")) {
            localStorage.removeItem('activeLearningPath');
            setSavedPath(null);
            setPersonalizedPath(null);
        }
    };

    const styles = {
        container: {
            padding: '2rem',
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            maxWidth: '1600px',
            margin: '0 auto',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
        },
        input: {
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            color: '#1e293b',
            padding: '1rem',
            borderRadius: '12px',
            width: '100%',
            marginBottom: '1rem',
            fontWeight: 600
        },
        btn: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            padding: '1.25rem',
            borderRadius: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            width: '100%',
            transition: '0.3s',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)'
        },
        phaseCard: {
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            position: 'relative'
        },
        linkBtn: {
            background: 'transparent',
            border: '1px solid #cbd5e1',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '10px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0' }}>AI Skill Path Editor</h1>
                    <p style={{ color: '#64748b', fontWeight: 600, margin: 0, fontSize: '1.1rem' }}>Forge your unique career trajectory with custom agentic learning routes.</p>
                </div>
                {savedPath && (
                    <div style={{ background: '#dcfce7', color: '#166534', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #bbf7d0' }}>
                        <i className="fa-solid fa-lock"></i> PATH LOCKED & ACTIVE
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
                <button
                    onClick={() => setActiveTabState('generator')}
                    style={{ background: activeTabState === 'generator' ? '#3b82f6' : 'transparent', border: 'none', borderRadius: '12px', padding: '12px 24px', color: activeTabState === 'generator' ? 'white' : '#64748b', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}
                >
                    <i className="fa-solid fa-wand-magic-sparkles"></i> AI Path Generator
                </button>
                <button
                    onClick={() => setActiveTabState('active')}
                    style={{ background: activeTabState === 'active' ? '#10b981' : 'transparent', border: 'none', borderRadius: '12px', padding: '12px 24px', color: activeTabState === 'active' ? 'white' : '#64748b', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}
                >
                    <i className="fa-solid fa-road"></i> My Locked Journey
                </button>
            </div>

            {activeTabState === 'generator' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '3rem' }}>

                    {/* INPUT FORM */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ background: '#f1f5f9', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: '#0f172a', fontWeight: 800 }}><i className="fa-solid fa-sliders" style={{ color: '#3b82f6' }}></i> Configuration Node</h3>

                        <label style={{ color: '#475569', fontWeight: 700, fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Current Level</label>
                        <select style={styles.input} value={formData.currentLevel} onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}>
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                            <option>Expert</option>
                        </select>

                        <label style={{ color: '#475569', fontWeight: 700, fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Department</label>
                        <select style={styles.input} value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                            <option>Computer Science</option>
                            <option>Information Technology</option>
                            <option>AI & Machine Learning</option>
                            <option>Business & Data Analytics</option>
                        </select>

                        <label style={{ color: '#475569', fontWeight: 700, fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Specific Domain focus</label>
                        <input type="text" style={styles.input} placeholder="e.g. Frontend React" value={formData.domain} onChange={(e) => setFormData({ ...formData, domain: e.target.value })} />

                        <label style={{ color: '#475569', fontWeight: 700, fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Ultimate Career Goal</label>
                        <input type="text" style={styles.input} placeholder="e.g. Senior DevOps at Google" value={formData.careerGoal} onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })} />

                        <button style={styles.btn} onClick={generateAIPath} disabled={isGenerating}>
                            {isGenerating ? <><i className="fa-solid fa-spinner fa-spin"></i> MODEL PROCESSING...</> : 'GENERATE CUSTOM PATH'}
                        </button>
                    </motion.div>

                    {/* OUTPUT DISPLAY */}
                    <div>
                        <AnimatePresence mode="wait">
                            {isGenerating ? (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '5rem' }}>
                                    <div style={{ width: '100px', height: '100px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
                                        <i className="fa-solid fa-brain fa-spin" style={{ fontSize: '3.5rem', color: '#3b82f6' }}></i>
                                    </div>
                                    <h2 style={{ color: '#0f172a', fontWeight: 900 }}>Scanning 1,000+ Internal Nodes...</h2>
                                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Structuring neural learning pathways and mapping relevant curriculum blocks.</p>
                                </motion.div>
                            ) : personalizedPath ? (
                                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                    <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '2rem', borderRadius: '24px', marginBottom: '2rem', color: 'white' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '10px' }}>GENERATED RESULT</div>
                                                <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', fontWeight: 900 }}>{personalizedPath.pathTitle}</h2>
                                                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', color: '#cbd5e1', fontWeight: 600 }}>
                                                    <span><i className="fa-solid fa-calendar" style={{ color: '#10b981' }}></i> {personalizedPath.timeline}</span>
                                                    <span><i className="fa-solid fa-trophy" style={{ color: '#f59e0b' }}></i> High Market Demand</span>
                                                </div>
                                            </div>
                                            <button onClick={lockPath} style={{ background: '#10b981', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}
                                                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
                                                <i className="fa-solid fa-lock"></i> LOCK & SET ACTIVE
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        {/* Curriculum Column */}
                                        <div>
                                            <h4 style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <i className="fa-solid fa-book-open"></i> Core Curriculum
                                            </h4>
                                            {personalizedPath.courses.map((course, i) => (
                                                <div key={i} style={styles.phaseCard}>
                                                    <div style={{ color: '#3b82f6', fontWeight: 900, fontSize: '0.8rem', marginBottom: '5px' }}>MODULE {i + 1}</div>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{course}</div>

                                                    {/* DYNAMIC SYSTEM ROUTING BUTTONS */}
                                                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                                                        <button style={styles.linkBtn} onClick={() => setActiveTab('elearning')} onMouseOver={e => e.target.style.background = '#eff6ff'} onMouseOut={e => e.target.style.background = 'transparent'}>
                                                            <i className="fa-brands fa-youtube" style={{ color: '#ef4444' }}></i> Start Course
                                                        </button>
                                                        <button style={styles.linkBtn} onClick={() => setActiveTab('chatbot')} onMouseOver={e => e.target.style.background = '#eff6ff'} onMouseOut={e => e.target.style.background = 'transparent'}>
                                                            <i className="fa-solid fa-robot" style={{ color: '#8b5cf6' }}></i> Ask Mentor
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Execution Column */}
                                        <div>
                                            <h4 style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <i className="fa-solid fa-list-check"></i> Execution Strategy
                                            </h4>

                                            <div style={{ ...styles.phaseCard, borderLeft: '4px solid #f59e0b', background: '#fffbeb', borderColor: '#fde68a' }}>
                                                <h5 style={{ color: '#d97706', fontSize: '0.9rem', fontWeight: 800, margin: '0 0 10px 0' }}>DAILY ROUTINE</h5>
                                                <p style={{ fontSize: '0.95rem', color: '#92400e', lineHeight: 1.6, margin: 0 }}>{personalizedPath.dailyPlan}</p>
                                                <button style={{ ...styles.linkBtn, borderColor: '#fcd34d', color: '#d97706', marginTop: '15px' }} onClick={() => setActiveTab('habittracker')}>
                                                    <i className="fa-solid fa-fire"></i> Add to Habit Tracker
                                                </button>
                                            </div>

                                            <h4 style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '1.5rem', marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <i className="fa-solid fa-diagram-project"></i> Milestone Projects
                                            </h4>
                                            {personalizedPath.projects.map((p, i) => (
                                                <div key={i} style={{ ...styles.phaseCard, borderLeft: '4px solid #10b981', background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                                                    <div style={{ color: '#059669', fontWeight: 900, fontSize: '0.8rem', marginBottom: '5px' }}>PROJECT {i + 1}</div>
                                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{p}</div>
                                                    <button style={{ ...styles.linkBtn, borderColor: '#86efac', color: '#059669', marginTop: '15px' }} onClick={() => setActiveTab('codereviewer')}>
                                                        <i className="fa-solid fa-code-merge"></i> Validate AI Code
                                                    </button>
                                                </div>
                                            ))}

                                            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '16px' }}>
                                                <h5 style={{ color: '#6d28d9', margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 800 }}>Career Target Alignment</h5>
                                                <p style={{ color: '#4c1d95', fontSize: '0.9rem', margin: '0 0 15px 0' }}>This path is directly linked to your ultimate goal. Start building your portfolio instantly.</p>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button style={{ ...styles.linkBtn, background: '#7c3aed', color: 'white', border: 'none' }} onClick={() => setActiveTab('jobtracker')}>
                                                        <i className="fa-solid fa-briefcase"></i> View Job Matches
                                                    </button>
                                                    <button style={{ ...styles.linkBtn, background: '#7c3aed', color: 'white', border: 'none' }} onClick={() => setActiveTab('resume')}>
                                                        <i className="fa-solid fa-file-invoice"></i> Build Resume
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '8rem', color: '#64748b', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #cbd5e1' }}>
                                    <i className="fa-solid fa-route" style={{ fontSize: '4rem', marginBottom: '1.5rem', color: '#94a3b8' }}></i>
                                    <h3 style={{ color: '#0f172a', fontWeight: 800, margin: '0 0 10px 0' }}>Awaiting Configuration Node</h3>
                                    <p style={{ margin: 0, fontSize: '1.1rem' }}>Your future path is a series of nodes waiting to be connected across our ecosystem.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {activeTabState === 'active' && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    {savedPath ? (
                        <div style={{ background: '#fff', border: '1px solid #10b981', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <div>
                                    <div style={{ color: '#10b981', fontWeight: 900, letterSpacing: '2px', fontSize: '0.85rem', marginBottom: '10px' }}><i className="fa-solid fa-satellite-dish"></i> ACTIVE ECOSYSTEM JOURNEY</div>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>{savedPath.pathTitle}</h2>
                                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '10px' }}>Your dashboard and related modules are currently optimizing around this path.</p>
                                </div>
                                <button onClick={clearPath} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}>
                                    <i className="fa-solid fa-trash-can"></i> CLEAR ACTIVE PATH
                                </button>
                            </div>

                            <div style={{ background: '#f1f5f9', padding: '2rem', borderRadius: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>Remaining Content</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981' }}>{savedPath.courses.length} <span style={{ fontSize: '1rem', color: '#64748b' }}>Modules</span></div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>Estimated XP</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b' }}>4,500 <span style={{ fontSize: '1rem', color: '#64748b' }}>XP</span></div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <button style={{ ...styles.btn, background: '#10b981', boxShadow: 'none' }} onClick={() => setActiveTab('dashboard')}>
                                        RETURN TO DASHBOARD HUB <i className="fa-solid fa-arrow-right" style={{ marginLeft: '5px' }}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '8rem', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                            <i className="fa-solid fa-lock-open" style={{ fontSize: '4rem', color: '#94a3b8', marginBottom: '1.5rem' }}></i>
                            <h2 style={{ color: '#0f172a', fontWeight: 800 }}>No Active Path Locked</h2>
                            <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>You currently do not have an active learning trajectory anchored to the ecosystem.</p>
                            <button style={{ ...styles.btn, width: 'auto', padding: '15px 40px' }} onClick={() => setActiveTabState('generator')}>
                                USE AI PATH GENERATOR
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SkillPaths;
