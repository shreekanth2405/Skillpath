import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AiRecommendations = () => {
    const [profiles, setProfiles] = useState([
        { id: 1, name: 'Dr. Elena Vance', role: 'AI Research Lead', match: 98, avatar: 'https://i.pravatar.cc/150?u=elena', skills: ['Neural Networks', 'LLMs'], reason: 'Follows AI & Cloud topics' },
        { id: 2, name: 'Marcus Chen', role: 'Cloud Architect', match: 94, avatar: 'https://i.pravatar.cc/150?u=marcus', skills: ['AWS', 'Kubernetes'], reason: 'Shared interest in Cloud Native' },
        { id: 3, name: 'Sarah Jenkins', role: 'ML Engineer', match: 89, avatar: 'https://i.pravatar.cc/150?u=sarah', skills: ['PyTorch', 'Computer Vision'], reason: 'Active in AI Community' },
        { id: 4, name: 'Vikram Singh', role: 'Data Scientist', match: 87, avatar: 'https://i.pravatar.cc/150?u=vikram', skills: ['Statistics', 'R'], reason: 'Data Science enthusiast' },
    ]);

    const [discussions, setDiscussions] = useState([
        { id: 1, title: 'The Future of Agentic AI', author: 'AI Inside', match: 99, tag: 'AI', content: 'Exploring the shift from reactive to proactive AI agents in enterprise...', reason: 'High match with your Skill Tree' },
        { id: 2, title: 'Scaling K8s in 2026', author: 'CloudMaster', match: 92, tag: 'Cloud', content: 'New patterns for managing massive clusters across multi-cloud regions...', reason: 'Recommended based on follow history' },
    ]);

    return (
        <div style={{ padding: '2rem', background: '#020617', minHeight: '100vh', color: 'white', fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
                        <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}>
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            SKILL PATH AI NEURAL RECOMMENDATIONS
                        </h1>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px' }}>
                        Our neural engine has analyzed your skill tree and follow patterns to curate these exclusive matches.
                    </p>
                </div>

                {/* Suggested Connections Carousel Section */}
                <section style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>SUGGESTED CONNECTIONS</h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><i className="fa-solid fa-chevron-left"></i></button>
                            <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><i className="fa-solid fa-chevron-right"></i></button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
                        {profiles.map((user, index) => (
                            <motion.div
                                key={user.id}
                                whileHover={{ y: -10 }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    minWidth: '280px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                                    <img src={user.avatar} alt={user.name} style={{ width: '90px', height: '90px', borderRadius: '50%', border: '3px solid #3b82f6', padding: '3px' }} />
                                    <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#10b981', color: 'white', padding: '4px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900, boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>
                                        {user.match}% MATCH
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', margin: '0 0 5px 0' }}>{user.name}</h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>{user.role}</p>

                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    {user.skills.map(s => (
                                        <span key={s} style={{ fontSize: '0.65rem', padding: '4px 10px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '8px', fontWeight: 700 }}>{s}</span>
                                    ))}
                                </div>

                                <div style={{ marginBottom: '1.5rem', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                                    "Recommended because you follow AI & Cloud topics."
                                </div>

                                <button style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)' }}>
                                    CONNECT
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Recommended Discussions Section */}
                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>RECOMMENDED DISCUSSIONS</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                        {discussions.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ scale: 1.02 }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    padding: '2rem',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <div style={{ color: '#10b981', fontWeight: 900, fontSize: '1.2rem' }}>{post.match}%</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>NEURAL SCORE</div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                    <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', color: '#3b82f6', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>#{post.tag}</span>
                                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}>by {post.author}</span>
                                </div>

                                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: '#f8fafc' }}>{post.title}</h3>
                                <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.5rem' }}>{post.content}</p>

                                <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <i className="fa-solid fa-circle-info" style={{ color: '#3b82f6' }}></i>
                                    <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>{post.reason}</span>
                                </div>

                                <button style={{ marginTop: '2rem', background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    READ FULL ARTICLE <i className="fa-solid fa-arrow-right-long"></i>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AiRecommendations;
