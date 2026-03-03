import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CertificationHub = ({ setActiveTab }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    const categories = [
        'All', 'AI & Machine Learning', 'Cyber Security', 'Cloud & DevOps',
        'Development', 'Data Science', 'Networking', 'Project Management', 'UI/UX Design'
    ];

    const [courseData, setCourseData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/certifications`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.data.success && res.data.data) {
                    setCourseData(res.data.data);
                } else {
                    setCourseData([]);
                }
            } catch (err) {
                console.error("Failed to fetch certifications", err);
                setCourseData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCertifications();
    }, []);

    const filteredCourses = courseData.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.provider.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#020617',
            color: 'white',
            zIndex: 9999,
            overflowY: 'auto',
            fontFamily: "'Outfit', sans-serif",
            padding: '4rem 2rem'
        }}>
            {/* IMMERSIVE TOOLBAR */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                background: 'rgba(2, 6, 23, 0.8)',
                backdropFilter: 'blur(10px)',
                padding: '1rem 2rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10000
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-graduation-cap" style={{ fontSize: '1.2rem' }}></i>
                    </div>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: '0.9rem', letterSpacing: '1px' }}>GLOBAL ACCREDITATION HUB</div>
                        <div style={{ fontSize: '0.6rem', color: '#60a5fa', fontWeight: 800 }}>LIVE CLOUD SYNC ACTIVE</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={toggleFullScreen}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i> {isFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN'}
                    </button>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        style={{ background: '#ef4444', border: 'none', color: 'white', padding: '10px 25px', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <i className="fa-solid fa-xmark"></i> CLOSE HUB
                    </button>
                </div>
            </div>

            {/* TOP HEADER */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
                <h1 style={{ fontSize: '4.5rem', fontWeight: 900, background: 'linear-gradient(to right, #60a5fa, #c084fc, #60a5fa)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, animation: 'glowText 5s linear infinite' }}>
                    SKILL PATH AI VAULT
                </h1>
                <p style={{ fontSize: '1.4rem', color: '#94a3b8', marginTop: '1rem', fontWeight: 600, letterSpacing: '2px' }}>
                    DECODING 150+ GLOBAL CAREER NODES
                </p>
            </motion.div>

            {/* SEARCH & FILTER BAR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
                <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <input
                        type="text"
                        placeholder="Search by course name or provider (e.g. AWS, Google, Cyber Security...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '1.5rem 2rem 1.5rem 4rem', borderRadius: '24px', background: 'rgba(30, 41, 59, 0.4)', border: '2px solid rgba(255,255,255,0.05)', color: 'white', fontSize: '1.2rem', outline: 'none', transition: '0.3s' }}
                    />
                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem', color: '#60a5fa' }}></i>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: activeCategory === cat ? '#3b82f6' : 'rgba(30, 41, 59, 0.4)', border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.05)', color: 'white', fontWeight: 700, cursor: 'pointer', transition: '0.3s' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* COURSE GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                <AnimatePresence>
                    {filteredCourses.map((course, idx) => (
                        <motion.div
                            key={course.title}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                            style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5))', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}
                        >
                            <div style={{ position: 'absolute', top: -10, right: -10, fontSize: '6rem', opacity: 0.03, color: 'white' }}>
                                <i className="fa-solid fa-award"></i>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '2px', background: 'rgba(96, 165, 250, 0.1)', padding: '5px 12px', borderRadius: '8px' }}>
                                    {course.level}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>ID: CERT-{1000 + idx}</span>
                            </div>

                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.75rem 0', lineHeight: 1.3, minHeight: '3.6rem' }}>{course.title}</h3>
                            <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>{course.provider}</p>

                            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}>
                                <i className="fa-solid fa-folder-open" style={{ color: '#60a5fa' }}></i> {course.category}
                            </div>

                            <button
                                onClick={() => window.open(course.link, '_blank')}
                                style={{ width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 800, cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                onMouseEnter={(e) => e.target.style.background = '#3b82f6'}
                                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                            >
                                LEARN MORE <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.8rem' }}></i>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* EMPTY STATE */}
            {filteredCourses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '10rem 0' }}>
                    <i className="fa-solid fa-satellite-dish" style={{ fontSize: '5rem', color: '#334155', marginBottom: '2rem' }}></i>
                    <h2 style={{ color: '#94a3b8' }}>No results match your neural scan.</h2>
                    <p style={{ color: '#475569' }}>Try adjusting your search parameters or selecting a different category.</p>
                </div>
            )}

            {/* HUB STATS */}
            <div style={{ marginTop: '6rem', padding: '4rem', background: 'linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(167, 139, 250, 0.05))', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.02)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
                <div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#60a5fa' }}>150+</div>
                    <div style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Total Courses</div>
                </div>
                <div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#c084fc' }}>9</div>
                    <div style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Domains Covered</div>
                </div>
                <div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#4ade80' }}>100%</div>
                    <div style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Verified Nodes</div>
                </div>
                <div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f87171' }}>24/7</div>
                    <div style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>AI Live Sync</div>
                </div>
            </div>
            <style>{`
                @keyframes glowText {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #020617;
                }
                ::-webkit-scrollbar-thumb {
                    background: #1e293b;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #334155;
                }
            `}</style>
        </div>
    );
};

export default CertificationHub;
