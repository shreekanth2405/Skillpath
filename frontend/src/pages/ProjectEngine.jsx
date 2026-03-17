import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Code, 
    Layers, 
    Zap, 
    Target, 
    CheckCircle2, 
    ChevronRight, 
    Play, 
    BookOpen, 
    Award,
    Wrench,
    Binary
} from 'lucide-react';
import axios from 'axios';

const ProjectEngine = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeProject, setActiveProject] = useState(null);
    const [filter, setFilter] = useState('All');

    const API_URL = `${import.meta.env.VITE_API_URL}/v1/projects`;

    const axiosInstance = axios.create({
        baseURL: API_URL,
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

    useEffect(() => {
        fetchProjects();
    }, [filter]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(filter === 'All' ? '/' : `/?domain=${filter}`);
            setProjects(res.data.data);
        } catch (err) {
            console.error("Error fetching projects", err);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            color: 'white',
            background: '#0f172a',
            minHeight: '100vh'
        },
        card: {
            background: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            transition: '0.3s'
        },
        badge: (color) => ({
            background: `${color}10`,
            color: color,
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '0.75rem',
            fontWeight: '800',
            border: `1px solid ${color}30`
        })
    };

    if (loading && !projects.length) {
        return <div style={{...styles.container, display:'flex', justifyContent:'center', alignItems:'center'}}>Loading Project Engine...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px' }}>
                    Project-Based <span style={{ color: '#3b82f6' }}>Learning</span>
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Master real-world skills by building complex projects. Learning by doing, redefined.</p>
            </div>

            <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginBottom: '2rem', 
                overflowX: 'auto', 
                paddingBottom: '1rem',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}>
                {['All', 'Artificial Intelligence', 'Cybersecurity', 'Web Development', 'Mobile Development', 'Data Science', 'Cloud & DevOps', 'Internet of Things', 'Blockchain & Web3', 'Game Development', 'HealthTech', 'FinTech', 'E-commerce', 'Robotics'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '10px 24px',
                            background: filter === f ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '100px',
                            color: 'white',
                            fontWeight: '700',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: '0.3s'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {projects.map(project => (
                        <motion.div 
                            key={project.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setActiveProject(project)}
                            style={{ 
                                ...styles.card, 
                                cursor: 'pointer',
                                border: activeProject?.id === project.id ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={styles.badge('#3b82f6')}>{project.domain}</span>
                                <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>{project.difficulty} • {project.xpReward} XP</span>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{project.title}</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{project.description.substring(0, 100)}...</p>
                        </motion.div>
                    ))}
                </div>

                <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
                    <AnimatePresence mode="wait">
                        {activeProject ? (
                            <motion.div 
                                key={activeProject.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                style={{ ...styles.card, background: 'rgba(30, 41, 59, 1)' }}
                            >
                                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>{activeProject.title}</h2>
                                
                                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                                    <div>
                                        <h4 style={{ color: '#3b82f6', fontSize: '0.8rem', letterSpacing: '1px' }}>TOOLS REQUIRED</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                            {activeProject.tools.map(tool => (
                                                <span key={tool} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px' }}>{tool}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 style={{ color: '#10b981', fontSize: '0.8rem', letterSpacing: '1px' }}>LEARNING OUTCOMES</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                            {activeProject.outcomes.map(o => (
                                                <span key={o} style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '6px' }}>{o}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Layers size={18} /> Implementation Roadmap</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {activeProject.steps.map((s, i) => (
                                            <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ fontWeight: 800, color: '#3b82f6', marginBottom: '4px' }}>Step {i+1}: {s.step}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{s.instructions}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    style={{
                                        width: '100%',
                                        padding: '1.2rem',
                                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                        border: 'none',
                                        borderRadius: '16px',
                                        color: 'white',
                                        fontWeight: '900',
                                        fontSize: '1.1rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.4)'
                                    }}
                                >
                                    <Play size={20} fill="white" /> Enroll & Start Building
                                </button>

                                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                                    <Zap size={14} style={{ marginRight: '5px' }} /> Completing this project adds it to your ATS Resume automatically.
                                </div>
                            </motion.div>
                        ) : (
                            <div style={{ ...styles.card, textAlign: 'center', padding: '5rem' }}>
                                <BookOpen size={64} color="#3b82f6" style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <h3 style={{ color: '#94a3b8' }}>Select a project to view the roadmap</h3>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProjectEngine;
