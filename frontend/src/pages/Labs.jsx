import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Labs = ({ setActiveTab }) => {
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ domain: '', difficulty: '' });
    const navigate = useNavigate();

    const domains = [
        'Algorithms', 'Data Structures', 'Web Development', 'Machine Learning',
        'Artificial Intelligence', 'Cybersecurity', 'Databases', 'Operating Systems',
        'Computer Networks', 'Mathematics'
    ];

    const fetchLabs = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filter).toString();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/labs?${query}`);
            const data = await res.json();
            if (data.success) {
                setLabs(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch labs", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLabs();
    }, [filter]);

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Beginner': return '#10b981';
            case 'Intermediate': return '#f59e0b';
            case 'Advanced': return '#ef4444';
            default: return '#6366f1';
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                        <i className="fa-solid fa-flask-vial" style={{ color: '#6366f1', marginRight: '15px' }}></i>
                        SKILL LABS
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 600 }}>Interactive virtual rooms to master your technical craft.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ background: '#f1f5f9', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fa-solid fa-trophy" style={{ color: '#f59e0b' }}></i>
                        <span style={{ fontWeight: 800 }}>{labs.length} Labs Available</span>
                    </div>
                </div>
            </div>

            {/* FILTERS */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                <button
                    onClick={() => setFilter({ ...filter, domain: '' })}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '30px',
                        border: 'none',
                        background: filter.domain === '' ? '#6366f1' : 'white',
                        color: filter.domain === '' ? 'white' : '#64748b',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        transition: '0.2s',
                        whiteSpace: 'nowrap'
                    }}
                >
                    All Domains
                </button>
                {domains.map(d => (
                    <button
                        key={d}
                        onClick={() => setFilter({ ...filter, domain: d })}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '30px',
                            border: 'none',
                            background: filter.domain === d ? '#6366f1' : 'white',
                            color: filter.domain === d ? 'white' : '#64748b',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            transition: '0.2s',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {d}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '10rem' }}>
                    <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '3rem', color: '#6366f1' }}></i>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    <AnimatePresence>
                        {labs.map((lab, index) => (
                            <motion.div
                                key={lab.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                onClick={() => navigate(`/labs/${lab.id}`)}
                                style={{
                                    background: 'white',
                                    borderRadius: '24px',
                                    padding: '2rem',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    padding: '10px 20px',
                                    background: getDifficultyColor(lab.difficulty),
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    borderRadius: '0 0 0 20px',
                                    textTransform: 'uppercase'
                                }}>
                                    {lab.difficulty}
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '12px',
                                        background: '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        color: '#6366f1',
                                        marginBottom: '1rem'
                                    }}>
                                        <i className={`fa-solid ${lab.domain === 'Web Development' ? 'fa-code' : lab.domain === 'Databases' ? 'fa-database' : 'fa-microchip'}`}></i>
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
                                        {lab.title}
                                    </h3>
                                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem', height: '3rem', overflow: 'hidden' }}>
                                        {lab.description}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 700 }}>
                                        <i className="fa-solid fa-bolt" style={{ color: '#f59e0b', marginRight: '5px' }}></i>
                                        {lab.xpReward} XP
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
                                        ROOM #{lab.roomNumber}
                                    </div>
                                </div>

                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                                    <button style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: '#6366f1',
                                        color: 'white',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        transition: '0.2s'
                                    }}>
                                        ENTER LAB
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default Labs;
