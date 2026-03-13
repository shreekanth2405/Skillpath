import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Resources = () => {
    const navigate = useNavigate();

    // --- State Management ---
    const [activeTab, setActiveTab] = useState('library'); // 'library' | 'career'
    
    // Support deep-linking to tabs
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab === 'career') setActiveTab('career');
        else if (tab === 'library') setActiveTab('library');
    }, [window.location.search]);

    const [level, setLevel] = useState(1); // 1: Category, 2: SubCategory, 3: Subject/Books
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [bookmarkedGames, setBookmarkedGames] = useState({});
    const [jobSearch, setJobSearch] = useState('');

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/bookmarks`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.data.success) {
                    const loadedBookmarks = {};
                    res.data.data.forEach(b => {
                        loadedBookmarks[b.title] = b.id;
                    });
                    setBookmarkedGames(loadedBookmarks);
                }
            } catch (err) {
                console.error("Failed to fetch bookmarks:", err);
            }
        };
        fetchBookmarks();
    }, []);

    // --- Data Structure ---
    const libraryData = [
        {
            title: 'Engineering', icon: 'fa-microchip', color: '#3b82f6',
            subs: [
                {
                    title: 'Computer Science',
                    subjects: [
                        { name: 'Data Structures & Algorithms', books: ['DSA in Java by Robert Lafore', 'CLRS Intro to Algorithms', 'Grokking Algorithms'] },
                        { name: 'Operating Systems', books: ['Modern Operating Systems (Tanenbaum)', 'Dinosaur Book (Galvin)'] },
                        { name: 'Database Management', books: ['Database System Concepts (Korth)'] }
                    ]
                },
                { title: 'Mechanical', subjects: [{ name: 'Thermodynamics', books: ['Engineering Thermodynamics'] }] },
                { title: 'Civil', subjects: [{ name: 'Structural Analysis', books: ['Mechanics of Solids'] }] },
                { title: 'ECE', subjects: [{ name: 'Digital Electronics', books: ['Digital Design (Morris Mano)'] }] },
                { title: 'IT', subjects: [{ name: 'Networking', books: ['Computer Networks (Tanenbaum)'] }] }
            ]
        },
        {
            title: 'Medical', icon: 'fa-staff-snake', color: '#10b981',
            subs: [
                { title: 'MBBS', subjects: [{ name: 'Anatomy', books: ['Gray’s Anatomy', 'BD Chaurasia'] }] },
                { title: 'Nursing', subjects: [{ name: 'Child Health', books: ['Pediatrics Nursing'] }] }
            ]
        },
        { title: 'Novels', icon: 'fa-book-open', color: '#ec4899', subs: [{ title: 'All Novels', subjects: [{ name: 'Classic Novels', books: ['The Great Gatsby', '1984'] }] }] },
        { title: 'Career Growth', icon: 'fa-chart-line', color: '#0ea5e9', subs: [{ title: 'Professional Dev', subjects: [{ name: 'Career Strategy', books: ['So Good They Can’t Ignore You', 'Deep Work'] }] }] },
        { title: 'Self Development', icon: 'fa-person-arrow-up-from-line', color: '#14b8a6', subs: [{ title: 'Growth Mindset', subjects: [{ name: 'Mindset & Habits', books: ['Atomic Habits', 'The Power of Habit'] }] }] }
    ];

    const jobPortals = [
        // Top Tiers
        { name: 'Naukri', icon: 'fa-solid fa-user-tie', color: '#4a90e2', url: 'https://www.naukri.com', category: 'Premium' },
        { name: 'LinkedIn', icon: 'fa-brands fa-linkedin', color: '#0077b5', url: 'https://www.linkedin.com/jobs', category: 'Premium' },
        { name: 'Indeed', icon: 'fa-solid fa-briefcase', color: '#2557a7', url: 'https://www.indeed.com', category: 'Premium' },
        { name: 'Glassdoor', icon: 'fa-solid fa-building', color: '#08a05c', url: 'https://www.glassdoor.com', category: 'Premium' },

        // Tech & Specialized
        { name: 'Hired', icon: 'fa-solid fa-code-merge', color: '#6366f1', url: 'https://hired.com', category: 'Tech' },
        { name: 'Wellfound (AngelList)', icon: 'fa-brands fa-angellist', color: '#ff4f4f', url: 'https://wellfound.com/jobs', category: 'Tech' },
        { name: 'Dice', icon: 'fa-solid fa-dice-d20', color: '#cc0000', url: 'https://www.dice.com', category: 'Tech' },
        { name: 'Stack Overflow', icon: 'fa-brands fa-stack-overflow', color: '#f48024', url: 'https://stackoverflow.com/jobs', category: 'Tech' },

        // Remote & Global
        { name: 'Remote.co', icon: 'fa-solid fa-globe', color: '#37a7e8', url: 'https://remote.co/remote-jobs', category: 'Remote' },
        { name: 'We Work Remotely', icon: 'fa-solid fa-laptop-house', color: '#eb4b23', url: 'https://weworkremotely.com', category: 'Remote' },
        { name: 'FlexJobs', icon: 'fa-solid fa-calendar-check', color: '#165c7d', url: 'https://www.flexjobs.com', category: 'Remote' },
        { name: 'Workana', icon: 'fa-solid fa-globe-americas', color: '#314555', url: 'https://www.workana.com', category: 'Remote' },

        // General Indian Portals
        { name: 'Apna', icon: 'fa-solid fa-mobile-screen-button', color: '#25D366', url: 'https://apna.co', category: 'General' },
        { name: 'Shine', icon: 'fa-solid fa-sun', color: '#fdd835', url: 'https://www.shine.com', category: 'General' },
        { name: 'Freshersworld', icon: 'fa-solid fa-user-graduate', color: '#ff7043', url: 'https://www.freshersworld.com', category: 'General' },
        { name: 'TimesJobs', icon: 'fa-solid fa-newspaper', color: '#1e88e5', url: 'https://www.timesjobs.com', category: 'General' },
        { name: 'Naukri Gulf', icon: 'fa-solid fa-plane-up', color: '#1565c0', url: 'https://www.naukrigulf.com', category: 'General' },
        { name: 'Youth4work', icon: 'fa-solid fa-users-viewfinder', color: '#00d084', url: 'https://www.youth4work.com', category: 'General' },
        { name: 'Jooble', icon: 'fa-solid fa-magnifying-glass-location', color: '#f9a825', url: 'https://jooble.org', category: 'General' }
    ];

    const trendingJobs = [
        { title: 'AI Developer', salary: '₹12L - ₹30L', tags: ['Python', 'LLM', 'PyTorch'] },
        { title: 'Full Stack Engineer', salary: '₹8L - ₹18L', tags: ['React', 'Node.js', 'PostgreSQL'] },
        { title: 'Data Scientist', salary: '₹10L - ₹25L', tags: ['Pandas', 'ML', 'SQL'] },
        { title: 'DevOps Architect', salary: '₹15L - ₹35L', tags: ['Docker', 'AWS', 'K8s'] }
    ];

    // --- Action Handlers ---
    const handleCategoryClick = (cat) => { setSelectedCategory(cat); setLevel(2); };
    const handleSubCategoryClick = (sub) => { setSelectedSubCategory(sub); setLevel(3); };
    const handleBack = () => {
        if (level === 2) { setSelectedCategory(null); setLevel(1); }
        else if (level === 3) { setSelectedSubCategory(null); setLevel(2); }
    };

    const toggleBookmark = async (e, book, categoryContext) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };
        try {
            if (bookmarkedGames[book]) {
                await axios.delete(`${import.meta.env.VITE_API_URL}/v1/bookmarks/${bookmarkedGames[book]}`, { headers });
                setBookmarkedGames(prev => { const n = { ...prev }; delete n[book]; return n; });
            } else {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/v1/bookmarks`, { title: book, category: categoryContext }, { headers });
                if (res.data.success) setBookmarkedGames(prev => ({ ...prev, [book]: res.data.data.id }));
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <button
                    onClick={() => setActiveTab('library')}
                    style={{
                        background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer',
                        color: activeTab === 'library' ? '#3b82f6' : '#94a3b8', transition: '0.3s',
                        borderBottom: activeTab === 'library' ? '3px solid #3b82f6' : '3px solid transparent',
                        paddingBottom: '1rem', marginBottom: '-1.1rem'
                    }}
                >
                    <i className="fa-solid fa-book-open" style={{ marginRight: '10px' }}></i>
                    Digital Library
                </button>
                <button
                    onClick={() => setActiveTab('career')}
                    style={{
                        background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer',
                        color: activeTab === 'career' ? '#3b82f6' : '#94a3b8', transition: '0.3s',
                        borderBottom: activeTab === 'career' ? '3px solid #3b82f6' : '3px solid transparent',
                        paddingBottom: '1rem', marginBottom: '-1.1rem'
                    }}
                >
                    <i className="fa-solid fa-briefcase" style={{ marginRight: '10px' }}></i>
                    Job & Career Hub
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'library' ? (
                    <motion.div key="library" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        {/* Header Area */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                            {level > 1 && (
                                <button onClick={handleBack} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                            )}
                            <div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>
                                    {level === 1 ? "Resources Library" : level === 2 ? selectedCategory.title : selectedSubCategory.title}
                                </h1>
                                <p style={{ margin: 0, color: '#64748b' }}>Discover academic books, research papers, and growth guides.</p>
                            </div>
                        </div>

                        {level === 1 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                {libraryData.map((cat, i) => (
                                    <motion.div key={i} whileHover={{ y: -5 }} onClick={() => handleCategoryClick(cat)}
                                        style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', cursor: 'pointer', boxShadow: '0 8px 30px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '1.5rem', transition: '0.3s' }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `${cat.color}15`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                            <i className={`fa-solid ${cat.icon}`}></i>
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>{cat.title}</h3>
                                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>{cat.subs.length} Domains</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {level === 2 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                                {selectedCategory.subs.map((sub, i) => (
                                    <motion.div key={i} whileHover={{ y: -5 }} onClick={() => handleSubCategoryClick(sub)}
                                        style={{ background: 'white', padding: '1.5rem 2rem', borderRadius: '20px', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{sub.title}</span>
                                        <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1' }}></i>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {level === 3 && (
                            <div>
                                {selectedSubCategory.subjects.map((subj, i) => (
                                    <div key={i} style={{ marginBottom: '3rem' }}>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '4px', height: '24px', background: '#3b82f6', borderRadius: '2px' }}></div>
                                            {subj.name}
                                        </h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
                                            {subj.books.map((book, j) => (
                                                <motion.div key={j} whileHover={{ y: -8 }} style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                                    <div style={{ height: '180px', background: 'linear-gradient(135deg, #1e293b, #334155)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center' }}>
                                                        <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{book}</span>
                                                    </div>
                                                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{book}</h4>
                                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                                        <button onClick={() => navigate('/book-reader')} style={{ flex: 1, padding: '8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Read</button>
                                                        <button onClick={(e) => toggleBookmark(e, book, selectedSubCategory.title)} style={{ width: '40px', background: bookmarkedGames[book] ? '#3b82f6' : '#f8fafc', color: bookmarkedGames[book] ? 'white' : '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                                                            <i className={bookmarkedGames[book] ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="career" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        {/* Search Hero */}
                        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '4rem 2rem', borderRadius: '30px', textAlign: 'center', color: 'white', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
                            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>Find Your Dream Job</h1>
                            <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '2.5rem' }}>Search across LinkedIn, Naukri, and 10+ major portals using AI Prediction.</p>
                            
                            <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px', backdropFilter: 'blur(10px)' }}>
                                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '20px', color: '#64748b' }}></i>
                                    <input
                                        type="text"
                                        placeholder="Job title, keywords, or company..."
                                        value={jobSearch}
                                        onChange={(e) => setJobSearch(e.target.value)}
                                        style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', background: 'white', border: 'none', borderRadius: '14px', fontSize: '1.1rem', outline: 'none', color: '#0f172a' }}
                                    />
                                </div>
                                <button
                                    onClick={() => navigate(`/career/jobs?q=${encodeURIComponent(jobSearch)}`)}
                                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0 2.5rem', borderRadius: '14px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', transition: '0.3s' }}
                                >
                                    Predict Jobs
                                </button>
                            </div>
                        </div>

                        {/* Portal Integration Cards */}
                        <div style={{ marginBottom: '4rem' }}>
                            {['Premium', 'Tech', 'Remote', 'General'].map(cat => (
                                <div key={cat} style={{ marginBottom: '2.5rem' }}>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '3px', height: '20px', background: cat === 'Premium' ? '#3b82f6' : cat === 'Tech' ? '#10b981' : cat === 'Remote' ? '#ec4899' : '#f59e0b', borderRadius: '2px' }}></div>
                                        {cat} Portals
                                    </h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
                                        {jobPortals.filter(p => p.category === cat).map((portal) => (
                                            <motion.a
                                                key={portal.name}
                                                href={portal.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                whileHover={{ y: -5, background: '#f8fafc', borderColor: portal.color }}
                                                style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '18px', textAlign: 'center', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: '0.3s' }}
                                            >
                                                <div style={{ width: '45px', height: '45px', borderRadius: '10px', background: `${portal.color}15`, color: portal.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                                    <i className={portal.icon}></i>
                                                </div>
                                                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{portal.name}</span>
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trending Jobs & Market Analysis */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', color: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    Trending Roles
                                    <span style={{ fontSize: '0.9rem', color: '#3b82f6', cursor: 'pointer' }}>View All &rarr;</span>
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {trendingJobs.map((job, i) => (
                                        <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 5px 0' }}>{job.title}</h3>
                                                <p style={{ color: '#10b981', fontWeight: 700, margin: '0 0 10px 0' }}>{job.salary}</p>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    {job.tags.map(t => <span key={t} style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', color: '#64748b', fontWeight: 700 }}>{t}</span>)}
                                                </div>
                                            </div>
                                            <button onClick={() => navigate('/career/jobs')} style={{ background: '#f1f5f9', border: 'none', color: '#0f172a', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>Details</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '1.5rem' }}>AI Market Insights</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '5px' }}>Weekly Job Growth</p>
                                        <h4 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: '#3b82f6' }}>+24.5%</h4>
                                    </div>
                                    <div style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '5px' }}>Top Required Skill</p>
                                        <h4 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: '#10b981' }}>Large Language Models</h4>
                                    </div>
                                    <div style={{ marginTop: 'auto', textAlign: 'center', padding: '1rem', background: '#3b82f6', color: 'white', borderRadius: '16px', cursor: 'pointer' }} onClick={() => navigate('/career/resume')}>
                                        <h4 style={{ margin: 0 }}>Resume AI Audit</h4>
                                        <p style={{ fontSize: '0.75rem', margin: '5px 0 0 0' }}>Check your ATS Visibility</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                input::placeholder { color: #94a3b8; }
            `}</style>
        </div>
    );
};

export default Resources;
