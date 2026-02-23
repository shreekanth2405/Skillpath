import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isUploading, handleFileUpload, knowledgeBaseRef, userXP, userLevel, userCoins }) => {
    const [scrolled, setScrolled] = useState(false);
    const [megamenuOpen, setMegamenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const solutionsMenu = {
        'Learning & Career': [
            { id: 'dashboard', label: 'Main Dashboard', icon: 'fa-house', desc: 'Central command & overview' },
            { id: 'learning', label: 'Learning Hub', icon: 'fa-book-open', desc: '1000+ courses & tutorials' },
            { id: 'career', label: 'Career Hub', icon: 'fa-briefcase', desc: 'Resumes, trackers, roadmaps' },
            { id: 'skillpaths', label: 'AI Skill Path Editor', icon: 'fa-road', desc: 'Generate custom curricula' },
        ],
        'Communication & Growth': [
            { id: 'communicationhub', label: 'Communication Hub', icon: 'fa-comments', desc: 'Speaking & Language' },
            { id: 'habittracker', label: 'Habit Tracker', icon: 'fa-fire', desc: 'Daily consistency monitor' },
            { id: 'eventhub', label: 'Global Event Hub', icon: 'fa-calendar-star', desc: 'Join global events' },
        ]
    };

    const mainLinks = [
        { id: 'communityhub', label: 'Community' },
        { id: 'resources', label: 'Resources' },
        { id: 'games', label: 'Games' },
        { id: 'chatbot', label: 'AI Chatbot', isSpecial: true },
        { id: 'contact', label: 'Contact' }
    ];

    const minimalNavModes = ['escapechallenge', 'aisurvivalclimb', 'codeescapehouse', 'elearning', 'multiplayer'];
    const isMinimal = minimalNavModes.includes(activeTab);

    // If it's a minimal mode, render a simplified navbar
    if (isMinimal) {
        return (
            <nav className="top-navbar glass-panel minimal-mode" style={{ padding: '0.5rem 2rem', backdropFilter: 'blur(30px)', background: 'rgba(255, 255, 255, 0.8)' }}>
                <div className="top-navbar-container" style={{ justifyContent: 'space-between' }}>
                    <div className="brand" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer', gap: '0.5rem' }}>
                        <div className="brand-logo" style={{ width: '30px', height: '30px', fontSize: '1rem' }}>
                            <i className="fa-solid fa-brain"></i>
                        </div>
                        <div className="brand-text">
                            <h2 style={{ fontSize: '1.1rem' }}>Skill Path AI</h2>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => setActiveTab('dashboard')} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '6px 16px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', transition: '0.2s' }}>
                            <i className="fa-solid fa-arrow-left"></i> Exit Focus Mode
                        </button>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className={`top-navbar ${scrolled ? 'scrolled glass-panel' : ''}`} style={{ transition: 'all 0.3s ease', borderBottom: scrolled ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid transparent', background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'white' }}>
            <div className="top-navbar-container">
                <div className="brand" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
                    <div className="brand-logo">
                        <i className="fa-solid fa-brain"></i>
                    </div>
                    <div className="brand-text">
                        <h2>Skill Path AI</h2>
                        <span>INTELLIGENT PLATFORM</span>
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="nav-menu">
                    {/* Solutions Dropdown */}
                    <div
                        className="nav-dropdown-wrapper"
                        onMouseEnter={() => setMegamenuOpen(true)}
                        onMouseLeave={() => setMegamenuOpen(false)}
                    >
                        <button className={`nav-dropdown-btn ${megamenuOpen ? 'active-dropdown' : ''}`} style={{ fontWeight: 700 }}>
                            Solutions <ChevronDown size={14} className={megamenuOpen ? "rotated" : ""} />
                        </button>

                        {megamenuOpen && (
                            <div className="megamenu glass-panel fade-in" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', top: '120%' }}>
                                {Object.keys(solutionsMenu).map((category, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <h4 style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>{category}</h4>
                                        <div style={{ display: 'grid', gap: '1rem' }}>
                                            {solutionsMenu[category].map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="megamenu-modern-item"
                                                    onClick={() => { setActiveTab(item.id); setMegamenuOpen(false); }}
                                                    style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.75rem', borderRadius: '12px', cursor: 'pointer', transition: '0.2s' }}
                                                >
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                                                        <i className={`fa-solid ${item.icon}`}></i>
                                                    </div>
                                                    <div>
                                                        <span style={{ display: 'block', fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{item.label}</span>
                                                        <span style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>{item.desc}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Direct Links */}
                    {mainLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => setActiveTab(link.id)}
                            className={`nav-link-btn ${activeTab === link.id ? 'active' : ''}`}
                            style={{
                                background: link.isSpecial ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                                color: link.isSpecial ? 'white' : '#64748b',
                                border: 'none',
                                padding: '0.6rem 1rem',
                                borderRadius: '12px',
                                fontWeight: link.isSpecial ? 800 : 600,
                                cursor: 'pointer',
                                transition: '0.2s'
                            }}
                        >
                            {link.isSpecial && <i className="fa-solid fa-sparkles" style={{ marginRight: '5px' }}></i>}
                            {link.label}
                        </button>
                    ))}
                </div>

                <div className="nav-actions">
                    <div className="stats-pill" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '999px', padding: '0.4rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span className="level-badge" style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>LVL {userLevel}</span>
                        <div className="xp-bar" style={{ width: '80px', height: '6px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                            <div className="xp-fill" style={{ width: `${(userXP % 1500) / 15}%`, height: '100%', background: '#3b82f6' }}></div>
                        </div>
                        <span className="coins-text" style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.85rem' }}><i className="fa-solid fa-coins"></i> {userCoins.toLocaleString()}</span>
                    </div>

                    <label className="upload-btn tooltip-wrapper" style={{ cursor: 'pointer', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', borderRadius: '12px', color: '#64748b', transition: '0.2s' }}>
                        <i className={`fa-solid ${isUploading ? 'fa-spinner fa-spin' : 'fa-file-arrow-up'}`}></i>
                        <input type="file" accept=".txt,.md,.json,.csv" style={{ display: 'none' }} onChange={handleFileUpload} />
                        <span className="tooltip">Supply Context</span>
                    </label>

                    <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0f172a' }}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu glass-panel slide-down" style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', padding: '2rem', borderTop: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Solutions</h3>
                    {Object.keys(solutionsMenu).map((cat) => (
                        solutionsMenu[cat].map(item => (
                            <div key={item.id} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }} style={{ padding: '1rem', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>
                                <i className={`fa-solid ${item.icon}`} style={{ width: '25px', color: '#3b82f6' }}></i> {item.label}
                            </div>
                        ))
                    ))}
                    <h3 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1rem', marginTop: '2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Links</h3>
                    {mainLinks.map(link => (
                        <div key={link.id} onClick={() => { setActiveTab(link.id); setMobileMenuOpen(false); }} style={{ padding: '1rem', fontWeight: link.isSpecial ? 800 : 600, color: link.isSpecial ? '#3b82f6' : '#0f172a' }}>
                            {link.label}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Sidebar;

