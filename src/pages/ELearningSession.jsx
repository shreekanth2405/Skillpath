import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ELearningSession = () => {
    const [activeVideo, setActiveVideo] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');

    const curriculum = [
        { id: 0, title: 'Introduction to Generative AI', duration: '12:45', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=300&q=80' },
        { id: 1, title: 'Understanding Transformers Architecture', duration: '24:10', thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=300&q=80' },
        { id: 2, title: 'Fine-Tuning Large Language Models', duration: '45:30', thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&q=80' },
        { id: 3, title: 'Deploying AI Agents in Production', duration: '18:15', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80' },
        { id: 4, title: 'Ethical Implications of AI', duration: '32:00', thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80' },
        { id: 5, title: 'Future of Neural Networks', duration: '21:40', thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=300&q=80' }
    ];

    return (
        <div style={{ padding: '2rem', background: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', maxWidth: '1600px', margin: '0 auto' }}>

                {/* LEFT SIDE: MAIN PLAYER AREA */}
                <div>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '56.25%',
                        background: 'black',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        {/* Mock Video Placeholder */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(45deg, #1e293b, #0f172a)'
                        }}>
                            <img
                                src={curriculum[activeVideo].thumbnail}
                                style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
                                alt="Video Background"
                            />
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
                            >
                                <i className="fa-solid fa-play" style={{ fontSize: '3rem', marginLeft: '8px' }}></i>
                            </motion.div>
                            <h2 style={{ zIndex: 10, marginTop: '2rem', fontWeight: 800 }}>Now Playing: {curriculum[activeVideo].title}</h2>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{curriculum[activeVideo].title}</h1>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button style={{ border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                    <i className="fa-solid fa-thumbs-up"></i> 15.2k
                                </button>
                                <button style={{ border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                    <i className="fa-solid fa-share"></i> Share
                                </button>
                                <button style={{ border: 'none', background: '#3b82f6', color: 'white', padding: '10px 25px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>
                                    <i className="fa-solid fa-download"></i> Download
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
                            {['overview', 'resources', 'notes', 'announcements'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '1rem 2rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: activeTab === tab ? '#3b82f6' : '#94a3b8',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        fontSize: '0.8rem',
                                        letterSpacing: '1px',
                                        cursor: 'pointer',
                                        borderBottom: activeTab === tab ? '3px solid #3b82f6' : '3px solid transparent'
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div style={{ color: '#cbd5e1', lineHeight: '1.8' }}>
                            {activeTab === 'overview' && (
                                <div>
                                    <p>Welcome to the first module of our Generative AI Mastery course. In this session, we dive deep into the foundations of LLMs and how they are reshaping the technical landscape of 2026.</p>
                                    <p style={{ marginTop: '1rem' }}>Lecturer: <strong>Dr. Emma Vision</strong> (Lead AI Architect)</p>
                                    <div style={{ display: 'flex', gap: '3rem', marginTop: '2.5rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>LEVEL</div>
                                            <div style={{ fontWeight: 800 }}>Intermediate</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>EST. XP</div>
                                            <div style={{ fontWeight: 800, color: '#f59e0b' }}>1200 XP</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>ENROLLED</div>
                                            <div style={{ fontWeight: 800 }}>45,200 Students</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'resources' && (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Course Syllabus (PDF)</span>
                                        <i className="fa-solid fa-file-pdf" style={{ color: '#ef4444' }}></i>
                                    </li>
                                    <li style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Transformer Whitepaper</span>
                                        <i className="fa-solid fa-file-pdf" style={{ color: '#ef4444' }}></i>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: SYLLABUS LIST */}
                <div style={{ background: 'rgba(30, 41, 59, 0.3)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', height: 'fit-content', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                        <h3 style={{ margin: 0 }}>Course Curriculum</h3>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>6 Sessions • 2h 45m Total</div>
                    </div>

                    <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        {curriculum.map((item, idx) => (
                            <motion.div
                                key={idx}
                                onClick={() => setActiveVideo(idx)}
                                whileHover={{ background: 'rgba(59, 130, 246, 0.1)' }}
                                style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    gap: '1rem',
                                    background: activeVideo === idx ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                    borderLeft: activeVideo === idx ? '4px solid #3b82f6' : '4px solid transparent'
                                }}
                            >
                                <div style={{ position: 'relative', width: '120px', height: '68px', borderRadius: '8px', overflow: 'hidden' }}>
                                    <img src={item.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Thumb" />
                                    <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'black', color: 'white', fontSize: '0.6rem', padding: '2px 4px', borderRadius: '4px' }}>{item.duration}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: activeVideo === idx ? '#3b82f6' : 'white' }}>{item.title}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>Session {idx + 1}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                        <button style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}>
                            UPGRADE TO PRO PASS
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ELearningSession;
