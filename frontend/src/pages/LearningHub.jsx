import React from 'react';
import { motion } from 'framer-motion';

const LearningHub = ({ setActiveTab }) => {
    const modules = [
        { id: 'codereviewer', title: 'IDE Practice & AI Mentor', desc: 'Full LeetCode-style platform with AI code review and problem generation.', icon: 'fa-code', color: '#6366f1' },
        { id: 'practical', title: 'Practical Solutions Hub', desc: 'Master 20+ tech domains through 500+ interactive hands-on labs.', icon: 'fa-flask-vial', color: '#10b981' },
        { id: 'elearning', title: 'E-Learning Section', desc: 'Access 1000+ interactive courses.', icon: 'fa-youtube', color: '#ef4444' },
        { id: 'certificationhub', title: 'Certification Hub', desc: 'Find and apply for top certifications.', icon: 'fa-graduation-cap', color: '#8b5cf6' },
        { id: 'resources?tab=career', title: 'Global Job Solutions', desc: 'Access 20+ job portals and AI career insights.', icon: 'fa-briefcase', color: '#3b82f6' },
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>
                <i className="fa-solid fa-book-open" style={{ color: '#10b981', marginRight: '15px' }}></i>
                LEARNING HUB
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

export default LearningHub;
