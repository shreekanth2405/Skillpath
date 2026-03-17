import React from 'react';
import { motion } from 'framer-motion';
import { 
    Cpu, 
    Rocket, 
    Target, 
    FileText, 
    Briefcase, 
    TrendingUp, 
    Zap, 
    ArrowRight,
    ShieldCheck,
    Search,
    BarChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Project2HireHub = ({ setActiveTab }) => {
    const navigate = useNavigate();

    const features = [
        {
            title: "Project Learning Engine",
            desc: "Skip courses, build real-world systems. Master tech by doing.",
            icon: <Cpu size={32} />,
            color: "#3b82f6",
            path: "/p2h/projects"
        },
        {
            title: "Auto-ATS Optimizer",
            desc: "Projects automatically sync with your resume. Never manually edit again.",
            icon: <FileText size={32} />,
            color: "#10b981",
            path: "/career/resume"
        },
        {
            title: "AI Job Fit Analyzer",
            desc: "Match your projects against global roles to find your perfect job.",
            icon: <Target size={32} />,
            color: "#6366f1",
            path: "/career/fit-analyzer"
        },
        {
            title: "Trend Predator AI",
            desc: "Predict future skills and get project suggestions that put you ahead.",
            icon: <TrendingUp size={32} />,
            color: "#f59e0b",
            path: "/trending"
        }
    ];

    const styles = {
        container: {
            minHeight: '100vh',
            background: '#0f172a',
            color: 'white',
            padding: '4rem 2rem',
            fontFamily: "'Inter', sans-serif"
        },
        hero: {
            textAlign: 'center',
            maxWidth: '1000px',
            margin: '0 auto 5rem auto'
        },
        title: {
            fontSize: '4.5rem',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-3px',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        },
        card: {
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: '2rem',
            transition: '0.4s',
            cursor: 'pointer',
            height: '100%'
        }
    };

    return (
        <div style={styles.container}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={styles.hero}
            >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '8px 20px', borderRadius: '100px', fontWeight: '800', fontSize: '0.8rem', marginBottom: '2rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <Zap size={16} fill="#3b82f6" /> INTRODUCING PROJECT2HIRE AI
                </div>
                <h1 style={styles.title}>From Building Projects <br/> to <span style={{ color: '#3b82f6' }}>Getting Hired</span>.</h1>
                <p style={{ fontSize: '1.3rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 3rem auto' }}>
                    The world's first automated career system. Master tech by building from <b>150+ real-world projects</b>. We auto-update your resume and build your career roadmap.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                    <button 
                        onClick={() => navigate('/p2h/projects')}
                        style={{ padding: '1.2rem 2.5rem', background: '#3b82f6', border: 'none', borderRadius: '16px', color: 'white', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.5)' }}
                    >
                        Start Your First Project <Rocket size={20} />
                    </button>
                    <button 
                        onClick={() => navigate('/career/fit-analyzer')}
                        style={{ padding: '1.2rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: 'white', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer' }}
                    >
                        Analyze Job Fit
                    </button>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
                {features.map((f, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -10, borderColor: `${f.color}40`, background: `${f.color}05` }}
                        onClick={() => navigate(f.path)}
                        style={styles.card}
                    >
                        <div style={{ color: f.color, marginBottom: '1.5rem' }}>{f.icon}</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{f.title}</h3>
                        <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '0.95rem' }}>{f.desc}</p>
                        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '8px', color: f.color, fontWeight: '800', fontSize: '0.8rem' }}>
                            EXPLORE MODULE <ArrowRight size={16} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ marginTop: '8rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', maxWidth: '1200px', margin: '8rem auto 0 auto' }}>
                <div>
                    <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem' }}>Automated <br/><span style={{ color: '#10b981' }}>Resume Evolution</span></h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                        Every time you move a step forward in a project, Project2Hire AI updates your profile. When a project is finished, your resume is automatically optimized with technical keywords and achievement descriptions that ATS systems crave.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ShieldCheck color="#10b981" /> <span style={{ fontWeight: 700 }}>ATS Score Tracking</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ShieldCheck color="#10b981" /> <span style={{ fontWeight: 700 }}>Auto-Skill Extraction</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ShieldCheck color="#10b981" /> <span style={{ fontWeight: 700 }}>Keyword Optimization</span>
                        </div>
                    </div>
                </div>
                <div style={{ position: 'relative' }}>
                    <div style={{ ...styles.card, padding: '3rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h4 style={{ color: '#3b82f6' }}>RESUME STATUS</h4>
                            <span style={{ fontSize: '0.8rem', background: '#10b981', padding: '4px 12px', borderRadius: '100px', fontWeight: 900 }}>88 ATS SCORE</span>
                        </div>
                        <div style={{ spaceY: '1rem' }}>
                            <div style={{ height: '12px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}></div>
                            <div style={{ height: '12px', width: '80%', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginTop: '1rem' }}></div>
                            <div style={{ height: '12px', width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginTop: '1rem' }}></div>
                            <div style={{ marginTop: '2.5rem', border: '1px dashed #3b82f6', padding: '1rem', borderRadius: '12px', textAlign: 'center', color: '#3b82f6', fontWeight: 700, fontSize: '0.85rem' }}>
                                + NEW PROJECT: AI PORTFOLIO ADDED
                            </div>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', background: '#3b82f6', filter: 'blur(80px)', zIndex: -1 }}></div>
                </div>
            </div>
        </div>
    );
};

export default Project2HireHub;
