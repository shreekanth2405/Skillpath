import React from 'react';
import { motion } from 'framer-motion';

const CareerHub = ({ setActiveTab }) => {
    const modules = [
        { id: 'careerroadmap', title: 'Roadmap Page', desc: 'View your AI-generated career roadmap.', icon: 'fa-route', color: '#8b5cf6' },
        { id: 'careergenie', title: 'Career Genie', desc: 'Discover your ideal department path.', icon: 'fa-wand-magic-sparkles', color: '#f59e0b' },
        { id: 'resume', title: 'Resume & ATS Tools', desc: 'Build and analyze your ATS resume.', icon: 'fa-file-invoice', color: '#ef4444' },
        { id: 'jobtracker', title: 'AI Job Tracker', desc: 'Track jobs perfectly matching your profile.', icon: 'fa-map-location-dot', color: '#3b82f6' },
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>
                <i className="fa-solid fa-briefcase" style={{ color: '#3b82f6', marginRight: '15px' }}></i>
                CAREER DEVELOPMENT HUB
            </motion.h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {modules.map(mod => (
                    <motion.div key={mod.id} whileHover={{ y: -5, scale: 1.02 }}
                        onClick={() => setActiveTab(mod.id)}
                        style={{ cursor: 'pointer', background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: `${mod.color}20`, color: mod.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
                            <i className={`fa-solid ${mod.icon}`}></i>
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>{mod.title}</h3>
                        <p style={{ color: '#64748b', lineHeight: 1.6 }}>{mod.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CareerHub;
