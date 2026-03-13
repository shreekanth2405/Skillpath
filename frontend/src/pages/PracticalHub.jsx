import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ─── Shared Data (Static fallback) ───
const PRACTICAL_DOMAINS = [
    {
        id: 'webdev',
        name: 'Web Development',
        icon: 'fa-globe',
        gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        color: '#3b82f6',
        description: 'Build modern, responsive web applications',
        stats: { labs: 42, projects: 18, users: '12.5k' },
        labs: [] // Fetched dynamically
    },
    {
        id: 'aiml',
        name: 'AI & Machine Learning',
        icon: 'fa-brain',
        gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
        color: '#8b5cf6',
        description: 'Train models and build intelligent systems',
        stats: { labs: 35, projects: 15, users: '9.8k' },
        labs: []
    },
    {
        id: 'datascience',
        name: 'Data Science',
        icon: 'fa-chart-line',
        gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
        color: '#10b981',
        description: 'Analyze data and create powerful visualizations',
        stats: { labs: 38, projects: 20, users: '11.2k' },
        labs: []
    },
    {
        id: 'cybersecurity',
        name: 'Cybersecurity',
        icon: 'fa-shield-halved',
        gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
        color: '#ef4444',
        description: 'Defend systems and learn ethical hacking',
        stats: { labs: 30, projects: 12, users: '7.3k' },
        labs: []
    },
    {
        id: 'cloud',
        name: 'Cloud & DevOps',
        icon: 'fa-cloud',
        gradient: 'linear-gradient(135deg, #f59e0b, #eab308)',
        color: '#f59e0b',
        description: 'Deploy, scale, and automate infrastructure',
        stats: { labs: 28, projects: 14, users: '8.1k' },
        labs: []
    },
    {
        id: 'mobile',
        name: 'Mobile Development',
        icon: 'fa-mobile-screen-button',
        gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
        color: '#06b6d4',
        description: 'Build native & cross-platform mobile apps',
        stats: { labs: 25, projects: 10, users: '6.5k' },
        labs: []
    },
    {
        id: 'blockchain',
        name: 'Blockchain & Web3',
        icon: 'fa-link',
        gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
        color: '#6366f1',
        description: 'Build decentralized applications',
        stats: { labs: 20, projects: 8, users: '4.2k' },
        labs: []
    }
];

// ─── Internal Sub-Components ───
const DifficultyBadge = ({ level }) => {
    const colors = {
        'Beginner': '#10b981',
        'Intermediate': '#3b82f6',
        'Advanced': '#f59e0b',
        'Expert': '#ef4444'
    };
    return (
        <span style={{
            background: `${colors[level]}15`,
            color: colors[level],
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            border: `1px solid ${colors[level]}30`
        }}>{level}</span>
    );
};

const StatusTag = ({ status }) => {
    const map = {
        'popular': { icon: 'fa-fire', label: 'Popular', color: '#f97316' },
        'new': { icon: 'fa-sparkles', label: 'New', color: '#8b5cf6' },
        'hot': { icon: 'fa-bolt', label: 'Hot', color: '#ef4444' },
        'featured': { icon: 'fa-award', label: 'Featured', color: '#3b82f6' }
    };
    const s = map[status?.toLowerCase()] || map['new'];
    return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: s.color, fontSize: '0.65rem', fontWeight: 800 }}>
            <i className={`fa-solid ${s.icon}`}></i> {s.label}
        </span>
    );
};

const LabCard = ({ lab, domainColor }) => {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: `0 12px 30px ${domainColor}22` }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => navigate(`/labs/${lab.id}`)}
            style={{
                background: 'white', borderRadius: '16px', padding: '1.25rem',
                border: `1px solid ${hovered ? domainColor + '44' : '#f1f5f9'}`,
                cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
            }}
        >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: domainColor, opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <StatusTag status={lab.status || 'new'} />
                <DifficultyBadge level={lab.difficulty} />
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a', lineHeight: 1.3 }}>{lab.title}</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                {(lab.tech || ['Coding']).map((t, i) => (
                    <span key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 600, color: '#64748b' }}>{t}</span>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-solid fa-bolt" style={{ color: '#f59e0b', fontSize: '0.8rem' }}></i>
                    <span style={{ fontWeight: 800, fontSize: '0.8rem', color: domainColor }}>{lab.xpReward || lab.xp || 100} XP</span>
                </div>
                <button 
                    style={{ background: domainColor, color: 'white', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                >
                    Start
                </button>
            </div>
        </motion.div>
    );
};

// ─── Main Hub Component ───
const PracticalHub = ({ embedded = false }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [expandedDomains, setExpandedDomains] = useState([]);
    const [domainLabs, setDomainLabs] = useState({});
    const [fetchingLabs, setFetchingLabs] = useState(false);

    const toggleDomain = async (domain) => {
        const id = domain.id;
        const name = domain.name;

        if (expandedDomains.includes(id)) {
            setExpandedDomains(prev => prev.filter(d => d !== id));
            return;
        }

        setExpandedDomains(prev => [...prev, id]);

        if (!domainLabs[name]) {
            try {
                setFetchingLabs(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/labs?domain=${name}`);
                const data = await res.json();
                if (data.success) {
                    setDomainLabs(prev => ({ ...prev, [name]: data.data }));
                }
            } catch (err) {
                console.error("Failed to fetch labs", err);
            } finally {
                setFetchingLabs(false);
            }
        }
    };

    const filteredDomains = PRACTICAL_DOMAINS.filter(domain => 
        domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const content = (
        <div style={{ padding: embedded ? '0' : '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {!embedded && (
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
                        <i className="fa-solid fa-flask-vial" style={{ color: '#3b82f6', marginRight: '15px' }}></i>
                        PRACTICAL SOLUTIONS HUB
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500 }}>
                        Master 20+ domains with hands-on labs and real-world technical challenges.
                    </p>
                </div>
            )}

            <div style={{ background: '#f8fafc', borderRadius: '30px', padding: '2rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
                        <i className="fa-solid fa-search" style={{ position: 'absolute', left: '15px', top: '15px', color: '#94a3b8' }}></i>
                        <input
                            type="text"
                            placeholder="Search by technology (React, AI, Cloud...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 15px 12px 45px', borderRadius: '14px',
                                border: '1px solid #e2e8f0', background: 'white', color: '#1e293b',
                                fontSize: '0.95rem', fontWeight: 600, outline: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['All', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
                            <button
                                key={diff}
                                onClick={() => setSelectedDifficulty(diff)}
                                style={{
                                    padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700,
                                    cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                                    background: selectedDifficulty === diff ? '#0f172a' : 'white',
                                    color: selectedDifficulty === diff ? 'white' : '#64748b',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                            >{diff}</button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredDomains.map((domain) => {
                        const isExpanded = expandedDomains.includes(domain.id);
                        return (
                            <div key={domain.id} style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                <motion.div
                                    whileHover={{ scale: 1.005, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                                    onClick={() => toggleDomain(domain)}
                                    style={{
                                        background: domain.gradient, padding: '1.25rem 2rem', cursor: 'pointer',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                        <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>
                                            <i className={`fa-solid ${domain.icon}`}></i>
                                        </div>
                                        <div>
                                            <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>{domain.name}</h3>
                                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 600, margin: 0 }}>{domain.description}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ color: 'white', fontWeight: 900, fontSize: '1rem' }}>{domain.stats.labs}</div>
                                                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', fontWeight: 700 }}>LABS</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ color: 'white', fontWeight: 900, fontSize: '1rem' }}>{domain.stats.users}</div>
                                                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', fontWeight: 700 }}>USERS</div>
                                            </div>
                                        </div>
                                        <motion.i animate={{ rotate: isExpanded ? 180 : 0 }} className="fa-solid fa-chevron-down" style={{ color: 'white' }}></motion.i>
                                    </div>
                                </motion.div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            style={{ background: 'white' }}
                                        >
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', padding: '1.5rem' }}>
                                                {fetchingLabs && !domainLabs[domain.name] ? (
                                                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
                                                        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: domain.color }}></i>
                                                    </div>
                                                ) : (
                                                    (domainLabs[domain.name] || []).filter(l => selectedDifficulty === 'All' || l.difficulty === selectedDifficulty).map(lab => (
                                                        <LabCard key={lab.id} lab={lab} domainColor={domain.color} />
                                                    ))
                                                )}
                                                {(domainLabs[domain.name]?.length === 0) && (
                                                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No labs available in this domain yet.</div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return content;
};

export default PracticalHub;
