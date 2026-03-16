import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

const Header = ({
    setActiveTab,
    activeTab,
    isRecording,
    handleVoiceToggle,
    setIsAuthenticated,
    isUploading,
    handleFileUpload,
    knowledgeBaseRef,
    userXP,
    userLevel,
    userCoins,
    user,
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [megamenuOpen, setMegamenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Megamenu stable hover refs
    const megaOpenTimer = useRef(null);
    const megaCloseTimer = useRef(null);
    const megaWrapRef = useRef(null);

    const openMegamenu = () => {
        if (window.innerWidth < 1024) return;
        clearTimeout(megaCloseTimer.current);
        megaOpenTimer.current = setTimeout(() => setMegamenuOpen(true), 120);
    };
    const closeMegamenu = () => {
        if (window.innerWidth < 1024) return;
        clearTimeout(megaOpenTimer.current);
        megaCloseTimer.current = setTimeout(() => setMegamenuOpen(false), 250);
    };
    const cancelClose = () => clearTimeout(megaCloseTimer.current);

    // Close megamenu on tab change
    useEffect(() => { setMegamenuOpen(false); setMobileMenuOpen(false); }, [activeTab]);

    const navigate = useNavigate();
    const profileMenuRef = useRef(null);
    const notificationsRef = useRef(null);
    const searchRef = useRef(null);
    const searchInputRef = useRef(null);

    // ─── Scroll detection ────────────────────────────────────────────────
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ─── Close dropdowns on outside click ───────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) setShowProfileMenu(false);
            if (notificationsRef.current && !notificationsRef.current.contains(e.target)) setShowNotifications(false);
            if (searchRef.current && !searchRef.current.contains(e.target)) setSearchExpanded(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ─── Fullscreen ──────────────────────────────────────────────────────
    const toggleGlobalFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.error(err));
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFsChange);
        return () => document.removeEventListener('fullscreenchange', onFsChange);
    }, []);

    // ─── Search expand ───────────────────────────────────────────────────
    const handleSearchToggle = () => {
        setSearchExpanded(prev => !prev);
        if (!searchExpanded) {
            setTimeout(() => searchInputRef.current?.focus(), 150);
        }
    };

    // ─── Logout ─────────────────────────────────────────────────────────
    const handleLogout = () => {
        localStorage.removeItem('auth');
        setIsAuthenticated(false);
        navigate('/');
    };

    // ─── Navigation Data ─────────────────────────────────────────────────
    const solutionsMenu = {
        'Learning & Career': [
            { id: 'dashboard', label: 'Main Dashboard', icon: 'fa-house', desc: 'Central command & overview' },
            { id: 'careeradvisor', label: 'AI Career Advisor', icon: 'fa-wand-magic-sparkles', desc: 'Analyse by Notify by AI' },
            { id: 'learning', label: 'Learning Hub', icon: 'fa-book-open', desc: '1000+ courses & tutorials' },
            { id: 'career', label: 'Career Hub', icon: 'fa-briefcase', desc: 'Resumes, trackers, roadmaps' },
            { id: 'practical', label: 'Practical Hub', icon: 'fa-flask-vial', desc: '500+ hands-on labs' },
            { id: 'resources', label: 'Resources Hub', icon: 'fa-box-archive', desc: 'Digital library & files' },
        ],
        'Job Search & Portals': [
            { id: 'resources?tab=career', label: 'Global Job Portals', icon: 'fa-globe', desc: 'LinkedIn, Naukri, & 20+ more' },
            { id: 'resources?tab=career', label: 'Tech Job Boards', icon: 'fa-code-branch', desc: 'Hired, Dice, StackOverflow' },
            { id: 'resources?tab=career', label: 'Remote Roles', icon: 'fa-laptop-house', desc: 'Remote.co, WeWorkRemotely' },
        ],
        'Communication & Growth': [
            { id: 'communicationhub', label: 'Communication Hub', icon: 'fa-comments', desc: 'Speaking & Language' },
            { id: 'habittracker', label: 'Habit Tracker', icon: 'fa-fire', desc: 'Daily consistency monitor' },
            { id: 'events', label: 'Global Event Hub', icon: 'fa-calendar-star', desc: 'Join global events' },
        ],
        'Mentorship & Expert Help': [
            { id: 'mentorship?cat=academic', label: 'Academic & Coding', icon: 'fa-user-graduate', desc: 'DSA, Software, All Departments' },
            { id: 'mentorship?cat=gov_exams', label: 'Government Exams', icon: 'fa-building-columns', desc: 'RRB, TET, GST, SSC & UPSC' },
            { id: 'mentorship?cat=job_prep', label: 'Job & Career', icon: 'fa-briefcase', desc: 'Mock Interviews & Professional Prep' },
            { id: 'mentorship?cat=entrance', label: 'Entrance Exams', icon: 'fa-pen-to-square', desc: 'JEE, NEET, GATE & More' },
        ],
        'Future & Events': [
            { id: 'events', label: 'Upcoming Events Calendar', icon: 'fa-calendar-days', desc: 'Global exams, conferences & fairs' },
            { id: 'futureprediction', label: 'Future Prediction AI', icon: 'fa-crystal-ball', desc: 'Market demand & career simulation' },
        ]
    };

    const mainLinks = [
        { id: 'community', label: 'Community' },
        { id: 'mentorship', label: 'Mentorship & Mentor' },
        { id: 'games', label: 'Games' },
        { id: 'learning/chatbot', label: 'AI Chatbot', isSpecial: true },
        { id: 'contact', label: 'Contact' }
    ];

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const auth = JSON.parse(localStorage.getItem('auth'));
                if (!auth) return;
                const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/notifications`, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setNotifications(data.data.map(n => ({
                        id: n.id,
                        icon: n.icon || 'fa-info-circle',
                        color: n.color || '#3b82f6',
                        bg: n.color ? `${n.color}10` : '#eff6ff',
                        title: n.title,
                        desc: n.message,
                        time: new Date(n.createdAt).toLocaleLowerCase().includes('today') ? 'Recently' : new Date(n.createdAt).toLocaleDateString(),
                        read: n.read
                    })));
                }
            } catch (err) {
                console.error("Header notif fetch error:", err);
            }
        };

        fetchNotifs();
        // Refresh every 30 seconds for real-time feel
        const interval = setInterval(fetchNotifs, 30000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = async () => {
        try {
            const auth = JSON.parse(localStorage.getItem('auth'));
            await fetch(`${import.meta.env.VITE_API_URL}/v1/notifications/read-all`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error("Mark all read error:", err);
        }
    };

    // ─── Minimal Mode ───────────────────────────────────────────────────
    const minimalNavModes = ['escapechallenge', 'aisurvivalclimb', 'codeescapehouse', 'elearning', 'multiplayer'];
    const isMinimal = minimalNavModes.includes(activeTab);

    if (isMinimal) {
        return (
            <header className="unified-navbar minimal-mode">
                <div className="unav-container" style={{ justifyContent: 'space-between' }}>
                    <div className="unav-brand" onClick={() => setActiveTab('dashboard')}>
                        <div className="unav-logo"><i className="fa-solid fa-brain" /></div>
                        <div className="unav-brand-text">
                            <span className="unav-brand-name">SkillPark AI</span>
                        </div>
                    </div>
                    <button onClick={() => setActiveTab('dashboard')} className="unav-exit-btn">
                        <i className="fa-solid fa-arrow-left" style={{ marginRight: '6px' }} />
                        Exit Focus Mode
                    </button>
                </div>
            </header>
        );
    }

    return (
        <header className={`unified-navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="unav-container">

                {/* ── LEFT: Brand ─────────────────────────────── */}
                <div className="unav-brand" onClick={() => setActiveTab('dashboard')}>
                    <div className="unav-logo">
                        <i className="fa-solid fa-brain" />
                    </div>
                    <div className="unav-brand-text">
                        <span className="unav-brand-name">SkillPark AI</span>
                        <span className="unav-brand-sub">INTELLIGENT PLATFORM</span>
                    </div>
                </div>

                {/* ── CENTER: Nav Links (Desktop) ──────────────── */}
                <nav className="unav-links">
                    {/* Solutions Megamenu — stable hover with delay timers */}
                    <div
                        ref={megaWrapRef}
                        className="unav-dropdown-wrap"
                        onMouseEnter={openMegamenu}
                        onMouseLeave={closeMegamenu}
                        style={{ position: 'relative' }}
                    >
                        <button
                            className={`unav-link-btn ${megamenuOpen ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setMegamenuOpen(!megamenuOpen);
                            }}
                        >
                            Solutions <ChevronDown size={13} className={megamenuOpen ? 'rotated' : ''} />
                        </button>

                        {/* Invisible bridge: fills gap between button bottom and menu top */}
                        {megamenuOpen && (
                            <div
                                style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: '8px', zIndex: 199 }}
                                onMouseEnter={cancelClose}
                                onMouseLeave={closeMegamenu}
                            />
                        )}

                        {megamenuOpen && (
                            <div
                                className="unav-megamenu"
                                style={{ animation: 'megaSlideIn 0.2s cubic-bezier(0.16,1,0.3,1) forwards' }}
                                onMouseEnter={cancelClose}
                                onMouseLeave={closeMegamenu}
                            >
                                {Object.keys(solutionsMenu).map((cat, i) => (
                                    <div key={i} className="unav-mega-col">
                                        <h4 className="unav-mega-cat">{cat}</h4>
                                        {solutionsMenu[cat].map(item => (
                                            <div
                                                key={item.id}
                                                className="unav-mega-item hover-3d"
                                                onClick={() => { setActiveTab(item.id); setMegamenuOpen(false); }}
                                            >
                                                <div className="unav-mega-icon">
                                                    <i className={`fa-solid ${item.icon}`} />
                                                </div>
                                                <div>
                                                    <span className="unav-mega-label">{item.label}</span>
                                                    <span className="unav-mega-desc">{item.desc}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Direct Links */}
                    {mainLinks.map(link => (
                        <button
                            key={link.id}
                            onClick={() => setActiveTab(link.id)}
                            className={`unav-link-btn ${link.isSpecial ? 'special' : ''} ${activeTab === link.id ? 'active' : ''}`}
                        >
                            {link.isSpecial && <i className="fa-solid fa-sparkles" style={{ marginRight: '5px' }} />}
                            {link.label}
                        </button>
                    ))}
                </nav>

                {/* ── RIGHT: Control Panel ─────────────────────── */}
                <div className="unav-controls">

                    {/* XP Stats Pill */}
                    <div className="unav-stats-pill">
                        <span className="unav-lvl">LVL {userLevel}</span>
                        <div className="unav-xp-bar">
                            <div className="unav-xp-fill" style={{ width: `${(userXP % 1500) / 15}%` }} />
                        </div>
                        <span className="unav-coins"><i className="fa-solid fa-coins" /> {(userCoins || 0).toLocaleString()}</span>
                    </div>

                    {/* Upload Knowledge Base */}
                    <label className="unav-icon-btn tooltip-wrapper" title="Supply Context">
                        <i className={`fa-solid ${isUploading ? 'fa-spinner fa-spin' : 'fa-file-arrow-up'}`} />
                        <input type="file" accept=".txt,.md,.json,.csv" style={{ display: 'none' }} onChange={handleFileUpload} />
                        <span className="unav-tooltip">Supply Context</span>
                    </label>

                    {/* Search */}
                    <div className={`unav-search-wrap ${searchExpanded ? 'expanded' : ''}`} ref={searchRef}>
                        <button className="unav-icon-btn" onClick={handleSearchToggle} title="Search">
                            <i className="fa-solid fa-magnifying-glass" />
                        </button>
                        <div className="unav-search-input-wrap">
                            <input
                                ref={searchInputRef}
                                type="text"
                                className="unav-search-input"
                                placeholder="Search skills, courses, users..."
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                            />
                            {searchValue && (
                                <button className="unav-search-clear" onClick={() => setSearchValue('')}>
                                    <i className="fa-solid fa-xmark" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="unav-dropdown-anchor" ref={notificationsRef}>
                        <button
                            className={`unav-icon-btn notif-btn ${showNotifications ? 'active' : ''}`}
                            onClick={() => { setShowNotifications(p => !p); setShowProfileMenu(false); }}
                            title="Notifications"
                        >
                            <i className="fa-solid fa-bell" />
                            {unreadCount > 0 && <span className="unav-badge">{unreadCount}</span>}
                        </button>
                        {showNotifications && (
                            <div className="unav-dropdown notif-panel slide-down">
                                <div className="unav-drop-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <h4>Notifications</h4>
                                        {unreadCount > 0 && <span className="unav-count-badge">{unreadCount} New</span>}
                                    </div>
                                    <button className="unav-mark-read" onClick={markAllRead}>
                                        <i className="fa-solid fa-check-double" /> Mark all read
                                    </button>
                                </div>
                                <div className="unav-drop-list">
                                    {notifications.map((n, i) => (
                                        <div key={i} className="unav-notif-item hover-3d" style={{ borderLeftColor: n.color }}>
                                            <div className="unav-notif-icon" style={{ background: n.bg, color: n.color }}>
                                                <i className={`fa-solid ${n.icon}`} />
                                            </div>
                                            <div>
                                                <p className="unav-notif-title">{n.title}</p>
                                                <p className="unav-notif-desc">{n.desc}</p>
                                                <p className="unav-notif-time">{n.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="unav-drop-footer">
                                    <button onClick={() => { setActiveTab('notificationhub'); setShowNotifications(false); }}>
                                        View all notifications <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px', fontSize: '0.75rem' }} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Microphone */}
                    <button
                        className={`unav-icon-btn mic-btn ${isRecording ? 'recording' : ''}`}
                        onClick={handleVoiceToggle}
                        title="Voice Commands"
                    >
                        <i className={`fa-solid ${isRecording ? 'fa-stop fa-beat' : 'fa-microphone'}`} />
                    </button>

                    {/* Fullscreen */}
                    <button
                        className={`unav-icon-btn ${isFullscreen ? 'active' : ''}`}
                        onClick={toggleGlobalFullscreen}
                        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    >
                        <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} />
                    </button>

                    {/* Profile */}
                    <div className="unav-dropdown-anchor" ref={profileMenuRef}>
                        <div
                            className="unav-profile-trigger"
                            onClick={() => { setShowProfileMenu(p => !p); setShowNotifications(false); }}
                        >
                            <div className="unav-profile-info">
                                <span className="unav-profile-name">{user?.name || 'Student'}</span>
                                <span className="unav-profile-role">{user?.role === 'admin' ? 'Administrator' : 'Pro Member'}</span>
                            </div>
                            <div className="unav-avatar-wrap">
                                <img
                                    src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name || 'Student'}&background=6366f1&color=fff&size=80`}
                                    alt="Avatar"
                                    className="unav-avatar"
                                />
                                <span className="unav-avatar-online" />
                            </div>
                        </div>
                        {showProfileMenu && (
                            <div className="unav-dropdown profile-panel slide-down">
                                <div className="unav-profile-header">
                                    <img
                                        src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name || 'Student'}&background=6366f1&color=fff&size=80`}
                                        alt="Avatar"
                                        className="unav-profile-big-avatar"
                                    />
                                    <div>
                                        <p className="unav-profile-big-name">{user?.name || 'Student'}</p>
                                        <p className="unav-profile-big-role">{user?.role === 'admin' ? 'Administrator' : 'Pro Member'} · LVL {userLevel}</p>
                                    </div>
                                </div>
                                <div className="unav-profile-menu">
                                    {[
                                        { icon: 'fa-regular fa-user', label: 'View Profile', action: () => { setActiveTab('profile'); setShowProfileMenu(false); } },
                                        { icon: 'fa-solid fa-gear', label: 'Settings', action: () => setShowProfileMenu(false) },
                                        { icon: 'fa-regular fa-credit-card', label: 'Subscription', action: () => setShowProfileMenu(false) },
                                    ].map((item, i) => (
                                        <button key={i} className="unav-profile-item" onClick={item.action}>
                                            <i className={item.icon} />
                                            {item.label}
                                        </button>
                                    ))}
                                    <div className="unav-profile-divider" />
                                    <button className="unav-profile-item danger" onClick={handleLogout}>
                                        <i className="fa-solid fa-arrow-right-from-bracket" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button className="unav-hamburger" onClick={() => setMobileMenuOpen(p => !p)}>
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* ── Mobile Menu ─────────────────────────────────── */}
            {mobileMenuOpen && (
                <div className="unav-mobile-menu slide-down">
                    <p className="unav-mobile-cat">Solutions</p>
                    {Object.keys(solutionsMenu).map(cat =>
                        solutionsMenu[cat].map(item => (
                            <div key={item.id} className="unav-mobile-item" onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}>
                                <i className={`fa-solid ${item.icon}`} />
                                {item.label}
                            </div>
                        ))
                    )}
                    <p className="unav-mobile-cat" style={{ marginTop: '1.5rem' }}>Quick Links</p>
                    {mainLinks.map(link => (
                        <div key={link.id} className={`unav-mobile-item ${link.isSpecial ? 'special' : ''}`} onClick={() => { setActiveTab(link.id); setMobileMenuOpen(false); }}>
                            {link.isSpecial && <i className="fa-solid fa-sparkles" />}
                            {link.label}
                        </div>
                    ))}
                </div>
            )}
        </header>
    );
};

export default Header;
