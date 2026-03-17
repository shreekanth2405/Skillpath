import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Zap, 
    FileText, 
    AlertTriangle, 
    CheckCircle, 
    BarChart, 
    Terminal, 
    Lightbulb,
    ArrowUpRight
} from 'lucide-react';

const AIResumeAnalyzer = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [file, setFile] = useState(null);

    const runAnalysis = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setResults({
                score: 72,
                parsedSkills: ["React", "Node.js", "Python", "SQL", "Git", "REST APIs"],
                missingSkills: ["Docker", "Kubernetes", "AWS Lambda", "CI/CD Pipelines"],
                improvements: [
                    "Quantify your achievements (e.g., 'Improved performance by 30%')",
                    "Add more industry-standard keywords related to Cloud Computing",
                    "The experience section for 'DevOps Engineer' role is weak in infrastructure automation details."
                ],
                atsCompatibility: "Good",
                jobRoleFit: "Full Stack Developer (85%)"
            });
            setIsAnalyzing(false);
        }, 3000);
    };

    const styles = {
        container: {
            padding: '3rem',
            maxWidth: '1200px',
            margin: '0 auto',
            color: 'white',
            background: '#0f172a',
            minHeight: '100vh',
            fontFamily: "'Inter', sans-serif"
        },
        card: {
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: '2.5rem',
            backdropFilter: 'blur(10px)'
        }
    };

    return (
        <div style={styles.container}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-2px' }}>
                    AI Resume <span style={{ color: '#3b82f6' }}>Analyzer</span>
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Evaluate your resume against ATS standards and industry requirements in seconds.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: results ? '400px 1fr' : '1fr', gap: '3rem' }}>
                <div style={styles.card}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FileText size={24} color="#3b82f6" /> Upload Document
                    </h2>
                    
                    <div style={{ 
                        border: '2px dashed rgba(59, 130, 246, 0.3)', 
                        padding: '3rem 2rem', 
                        borderRadius: '20px', 
                        textAlign: 'center',
                        background: 'rgba(59, 130, 246, 0.02)',
                        marginBottom: '2rem'
                    }}>
                        <Search size={48} color="#3b82f6" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Drag and drop your resume (PDF/DOCX) or use our ATS builder.</p>
                        <input type="file" id="resume" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} />
                        <label htmlFor="resume" style={{ padding: '10px 24px', background: '#3b82f6', color: 'white', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>
                            {file ? file.name : 'Choose File'}
                        </label>
                    </div>

                    <button 
                        onClick={runAnalysis}
                        disabled={isAnalyzing || !file}
                        style={{ 
                            width: '100%', 
                            padding: '1.2rem', 
                            background: isAnalyzing ? '#1e293b' : 'linear-gradient(135deg, #3b82f6, #6366f1)', 
                            border: 'none', 
                            borderRadius: '16px', 
                            color: 'white', 
                            fontWeight: '900', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            opacity: isAnalyzing || !file ? 0.7 : 1
                        }}
                    >
                        {isAnalyzing ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Zap size={20} /></motion.div> : <Zap size={20} />}
                        {isAnalyzing ? 'Analyzing Neural Data...' : 'Start AI Analysis'}
                    </button>
                </div>

                <AnimatePresence>
                    {results && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div style={styles.card}>
                                    <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', marginBottom: '1rem' }}>OVERALL ATS SCORE</h4>
                                    <div style={{ fontSize: '4rem', fontWeight: 900, color: '#10b981' }}>{results.score}%</div>
                                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginTop: '1rem' }}>
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${results.score}%` }}
                                            transition={{ duration: 1 }}
                                            style={{ height: '100%', background: '#10b981' }}
                                        />
                                    </div>
                                </div>
                                <div style={styles.card}>
                                    <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', marginBottom: '1rem' }}>JOB ROLE FIT</h4>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{results.jobRoleFit}</div>
                                    <p style={{ color: '#94a3b8', marginTop: '1rem', fontSize: '0.9rem' }}>High compatibility with your current project background.</p>
                                </div>
                            </div>

                            <div style={styles.card}>
                                <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <AlertTriangle size={24} color="#f59e0b" /> Critical Skill Gaps
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                    {results.missingSkills.map(skill => (
                                        <div key={skill} style={{ padding: '12px 20px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontWeight: 700 }}>
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                                    <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}><Lightbulb size={18} color="#3b82f6" /> AI RECOMMENDATION</h5>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                        Complete the <b>"Automated Threat Detection System"</b> project to bridge the Kubernetes and CI/CD gap. This will increase your ATS score to 85%+.
                                    </p>
                                </div>
                            </div>

                            <div style={styles.card}>
                                <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <BarChart size={24} color="#10b981" /> Suggested Improvements
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    {results.improvements.map((imp, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '15px' }}>
                                            <div style={{ color: '#10b981' }}><CheckCircle size={20} /></div>
                                            <div style={{ color: '#94a3b8' }}>{imp}</div>
                                        </div>
                                    ))}
                                </div>
                                <button style={{ marginTop: '2rem', width: 'fit-content', padding: '10px 24px', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Go to Resume Builder <ArrowUpRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AIResumeAnalyzer;
