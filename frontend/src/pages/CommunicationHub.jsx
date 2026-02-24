import React from 'react';
import { motion } from 'framer-motion';

const CommunicationHub = ({ setActiveTab }) => {
    const modules = [
        { id: 'englishlearning', title: 'Language Learning', desc: 'Improve your English fluency with AI.', icon: 'fa-language', color: '#3b82f6' },
        { id: 'communication', title: 'Emilia AI Voice Tutor', desc: 'Real-time voice-to-voice English practice with 3D avatar.', icon: 'fa-microphone-lines', color: '#6366f1' },
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>
                <i className="fa-solid fa-comments" style={{ color: '#3b82f6', marginRight: '15px' }}></i>
                COMMUNICATION HUB
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

export default CommunicationHub;
