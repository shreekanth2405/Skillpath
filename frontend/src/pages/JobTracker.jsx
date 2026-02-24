import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const JobTracker = ({ setActiveTab: appSetActiveTab }) => {
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'tracker', 'analytics', 'portals'
    const [activeFilter, setActiveFilter] = useState('All');
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [logs, setLogs] = useState([
        "System: Initializing Distributed Scraping Clusters...",
        "Proxy: Rotating to US-East-1 Nodes.",
        "Engine: Matching NLP vectors for global job search..."
    ]);

    const generateRandomJobs = (query) => {
        const role = query || "Software Developer";
        const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Apple', 'Stripe', 'Airbnb', 'Spotify', 'Uber'];
        const locations = ['Remote', 'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'London, UK'];
        const types = ['Direct', 'Partner', 'Internal', 'Official'];

        return Array.from({ length: 5 }).map((_, i) => ({
            id: Date.now() + i,
            title: `Senior ${role.split(' ')[0]} Engineer`,
            company: companies[Math.floor(Math.random() * companies.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            exp: `${Math.floor(Math.random() * 5) + 1}+ Yrs`,
            score: Math.floor(Math.random() * 20) + 80, // 80-99
            type: types[Math.floor(Math.random() * types.length)],
            time: `${Math.floor(Math.random() * 59) + 1}m ago`,
            link: '#',
            domain: 'Software',
            status: 'New',
            matchingSkills: [role.split(' ')[0], 'React', 'Node.js', 'Python'].slice(0, 3),
            missingSkills: ['Go', 'Rust'].slice(0, 1)
        }));
    };

    const [jobs, setJobs] = useState(generateRandomJobs(''));

    const categories = ['All', 'Software', 'AI/ML', 'Data Science', 'Core Eng', 'Remote'];

    const jobWebsites = [
        { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs', icon: 'fa-brands fa-linkedin', color: '#0A66C2' },
        { name: 'Indeed', url: 'https://www.indeed.com/', icon: 'fa-solid fa-briefcase', color: '#2164f3' },
        { name: 'Glassdoor', url: 'https://www.glassdoor.com/Job/index.htm', icon: 'fa-solid fa-building', color: '#0CAA41' },
        { name: 'Wellfound (AngelList)', url: 'https://wellfound.com/jobs', icon: 'fa-brands fa-angellist', color: '#FFF' },
        { name: 'Dice', url: 'https://www.dice.com/', icon: 'fa-solid fa-cube', color: '#cc0000' },
        { name: 'Monster', url: 'https://www.monster.com/', icon: 'fa-solid fa-ghost', color: '#6d4c41' },
        { name: 'ZipRecruiter', url: 'https://www.ziprecruiter.com/', icon: 'fa-solid fa-bolt', color: '#108a38' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com/', icon: 'fa-solid fa-house-laptop', color: '#eb4b23' },
        { name: 'Remote.co', url: 'https://remote.co/', icon: 'fa-solid fa-globe', color: '#37a7e8' },
        { name: 'Y Combinator Jobs', url: 'https://www.ycombinator.com/jobs', icon: 'fa-brands fa-y-combinator', color: '#F26522' },
        { name: 'Hired', url: 'https://hired.com/', icon: 'fa-solid fa-handshake', color: '#FFF' },
        { name: 'FlexJobs', url: 'https://www.flexjobs.com/', icon: 'fa-solid fa-calendar-check', color: '#165c7d' },
        { name: 'SimplyHired', url: 'https://www.simplyhired.com/', icon: 'fa-solid fa-magnifying-glass', color: '#FFF' },
        { name: 'Naukri', url: 'https://www.naukri.com/', icon: 'fa-solid fa-user-tie', color: '#ff7555' },
        { name: 'Upwork', url: 'https://www.upwork.com/', icon: 'fa-solid fa-laptop-code', color: '#14a800' },
        { name: 'Fiverr', url: 'https://www.fiverr.com/', icon: 'fa-solid fa-star', color: '#1dbf73' }
    ];

    // Simulation of live scanning
    useEffect(() => {
        if (isScanning) {
            const targetRole = searchQuery || "Software Developer";
            const interval = setInterval(() => {
                setScanProgress(p => {
                    if (p >= 100) {
                        setIsScanning(false);
                        setJobs(generateRandomJobs(targetRole));
                        setActiveTab('dashboard'); // Force view back to dashboard to see new items
                        return 0;
                    }
                    return p + 0.5;
                });

                if (Math.random() > 0.6) {
                    const engine = jobWebsites[Math.floor(Math.random() * jobWebsites.length)].name;
                    const logOptions = [
                        `Scraper: Connecting to ${engine} cluster...`,
                        `NLP: Analyzing ${engine} listings for '${targetRole}'`,
                        `Engine: Bypassing bot protection on ${engine}...`,
                        `AI Match: Found high-confidence match on ${engine}`,
                        `Proxy: Routing traffic matrix for ${engine}`
                    ];
                    const selectedLog = logOptions[Math.floor(Math.random() * logOptions.length)];
                    setLogs(prev => [selectedLog, ...prev].slice(0, 10));
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, [isScanning, searchQuery]);

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('jobId', id);
    };

    const handleDrop = (e, newStatus) => {
        e.preventDefault();
        const id = parseInt(e.dataTransfer.getData('jobId'));
        setJobs(jobs.map(j => j.id === id ? { ...j, status: newStatus } : j));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const styles = {
        container: {
            fontFamily: "'Outfit', sans-serif",
            backgroundColor: '#FFFFFF',
            color: '#111827',
            minHeight: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            padding: '2rem',
            overflowY: 'auto',
            zIndex: 9999,
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            borderBottom: '1px solid #E5E7EB',
            paddingBottom: '1.5rem'
        },
        navTabs: {
            display: 'flex',
            gap: '1.5rem',
            marginBottom: '2rem',
            borderBottom: '2px solid #E5E7EB',
            paddingBottom: '0.5rem'
        },
        tab: (isActive) => ({
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: 'none',
            color: isActive ? '#3B82F6' : '#6B7280',
            fontWeight: '900',
            fontSize: '1.1rem',
            cursor: 'pointer',
            borderBottom: isActive ? '3px solid #3B82F6' : '3px solid transparent',
            marginBottom: '-0.6rem',
            transition: '0.3s'
        }),
        scanBtn: {
            background: isScanning ? '#EFF6FF' : '#FFFFFF',
            color: '#3B82F6',
            border: '1px solid #3B82F6',
            padding: '0.8rem 2rem',
            borderRadius: '12px',
            fontWeight: '800',
            cursor: isScanning ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease'
        },
        glassCard: {
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
        jobCard: {
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1rem',
            transition: 'all 0.3s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        },
        kanbanCol: {
            flex: 1,
            background: '#F5F7FA',
            borderRadius: '16px',
            padding: '1rem',
            minHeight: '400px',
            border: '1px solid #E5E7EB'
        },
        kanbanCard: {
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1rem',
            cursor: 'grab',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s',
        },
        scoreCircle: (score) => ({
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#FFFFFF',
            border: `3px solid ${score > 90 ? '#10B981' : score > 80 ? '#3B82F6' : '#F59E0B'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: '900',
            color: score > 90 ? '#10B981' : score > 80 ? '#3B82F6' : '#F59E0B',
            boxShadow: `0 4px 12px rgba(0,0,0,0.05)`
        }),
        skillBadge: {
            background: '#EFF6FF',
            color: '#3B82F6',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '700',
            marginRight: '6px'
        },
        missingBadge: {
            background: '#FEF2F2',
            color: '#EF4444',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '700',
            marginRight: '6px'
        },
    };

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes scan-anim {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .job-card-hover:hover {
                    border-color: #3B82F6 !important;
                    background: #EFF6FF !important;
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
                }
                .scroll-panel::-webkit-scrollbar { width: 4px; }
                .scroll-panel::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
            `}</style>

            <header style={styles.header}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {appSetActiveTab && (
                        <button
                            onClick={() => appSetActiveTab('dashboard')}
                            style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#111827', padding: '1rem', borderRadius: '50%', cursor: 'pointer', transition: '0.2s', alignSelf: 'flex-start', marginTop: '5px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                            title="Back to Dashboard"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                    )}
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px', marginBottom: '4px' }}>
                            SKILL PATH AI <span style={{ color: '#3B82F6' }}>JOB ENGINE</span>
                        </h1>
                        <p style={{ color: '#6B7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-cloud-bolt" style={{ color: '#3B82F6' }}></i>
                            Continuous monitoring of 192/200 official career portals
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }}></i>
                        <input
                            type="text"
                            placeholder="Predict Job Path (e.g. AI Engineer)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '12px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '1rem', color: '#111827', width: '280px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                        />
                    </div>
                    <button
                        style={styles.scanBtn}
                        onClick={() => {
                            setIsScanning(true);
                            setLogs(prev => [`Triggering smart prediction scan across all platforms for ${searchQuery || 'any role'}...`, ...prev]);
                        }}
                        disabled={isScanning}
                    >
                        {isScanning ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                SCANNING {Math.floor(scanProgress)}%
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                                PREDICT & SCAN
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Navbar Tabs */}
            <div style={styles.navTabs}>
                <button style={styles.tab(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>LIVE ALERTS</button>
                <button style={styles.tab(activeTab === 'tracker')} onClick={() => setActiveTab('tracker')}>KANBAN TRACKER</button>
                <button style={styles.tab(activeTab === 'analytics')} onClick={() => setActiveTab('analytics')}>SKILL GAPS & ANALYSIS</button>
                <button style={styles.tab(activeTab === 'portals')} onClick={() => setActiveTab('portals')}>GLOBAL JOB PORTALS</button>
            </div>

            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
                    <div className="scroll-panel" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 350px)', paddingRight: '1rem' }}>

                        {/* Filters */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    style={{
                                        padding: '0.6rem 1.5rem',
                                        borderRadius: '10px',
                                        border: '1px solid #E5E7EB',
                                        background: activeFilter === cat ? '#EFF6FF' : '#FFFFFF',
                                        color: activeFilter === cat ? '#3B82F6' : '#6B7280',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        transition: '0.2s'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                            <select style={{ background: '#FFFFFF', color: '#111827', border: '1px solid #E5E7EB', padding: '0.6rem 1.5rem', borderRadius: '10px', fontWeight: '700', outline: 'none' }}>
                                <option>Exp: All</option>
                                <option>Fresher</option>
                                <option>1-3 Yrs</option>
                                <option>3+ Yrs</option>
                            </select>
                        </div>

                        {/* Live Job Cards */}
                        <AnimatePresence>
                            {jobs.filter(j => activeFilter === 'All' || j.domain === activeFilter || (activeFilter === 'Remote' && j.location.includes('Remote'))).map((job, idx) => (
                                <motion.div
                                    key={job.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="job-card-hover"
                                    style={styles.jobCard}
                                >
                                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                        <div style={styles.scoreCircle(job.score)}>
                                            {job.score}%
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{job.title}</h3>
                                                <span style={{ fontSize: '0.7rem', background: '#3B82F6', padding: '2px 8px', borderRadius: '4px', fontWeight: '900' }}>{job.type}</span>
                                            </div>
                                            <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '10px' }}>
                                                <span style={{ color: '#111827', fontWeight: '700' }}>{job.company}</span> • {job.location} • <b style={{ color: '#3B82F6' }}>{job.exp}</b>
                                            </p>
                                            <div style={{ display: 'flex' }}>
                                                {job.matchingSkills.map(s => <span key={s} style={styles.skillBadge}>{s}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#6B7280', fontSize: '0.8rem', fontWeight: '700', marginBottom: '1rem' }}>
                                            <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '6px' }}></i> {job.time}
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                style={{ background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}
                                                onClick={() => setJobs(jobs.map(j => j.id === job.id ? { ...j, status: 'Saved' } : j))}
                                            >
                                                <i className="fa-regular fa-bookmark"></i>
                                            </button>
                                            <button
                                                style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                                onClick={() => { window.open(job.link, '_blank'); setJobs(jobs.map(j => j.id === job.id ? { ...j, status: 'Applied' } : j)); }}
                                            >
                                                APPLY <i className="fa-solid fa-external-link" style={{ fontSize: '0.8rem' }}></i>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Right Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={styles.glassCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#3B82F6' }}>ENGINE LOGS</h4>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }}></div>
                            </div>
                            <div style={{ height: '220px', background: '#F8FAFC', borderRadius: '12px', padding: '1rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#10B981', overflowY: 'hidden', border: '1px solid #E5E7EB', position: 'relative' }}>
                                {isScanning && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#3B82F6', boxShadow: '0 0 15px #3b82f6', animation: 'scan-anim 3s infinite linear' }} />}
                                {logs.map((log, i) => (
                                    <div key={i} style={{ marginBottom: '6px', opacity: 1 - (i * 0.1) }}>{`> ${log}`}</div>
                                ))}
                            </div>
                        </div>

                        <div style={{ ...styles.glassCard, background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: '900', marginBottom: '1rem', color: '#111827' }}>NOTIFICATION ENGINE</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem' }}><i className="fa-brands fa-whatsapp" style={{ color: '#25D366', marginRight: '8px' }}></i> WhatsApp Alerts</span>
                                    <span style={{ color: '#25D366', fontSize: '0.7rem', fontWeight: '900' }}>ACTIVE</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem' }}><i className="fa-solid fa-envelope" style={{ color: '#3B82F6', marginRight: '8px' }}></i> Email (Score &gt; 85%)</span>
                                    <span style={{ color: '#3B82F6', fontSize: '0.7rem', fontWeight: '900' }}>ACTIVE</span>
                                </div>
                            </div>
                            <button style={{ width: '100%', marginTop: '1.5rem', background: '#FFFFFF', color: '#111827', border: '1px solid #E5E7EB', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Manage Alert Rules</button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* TAB: KANBAN TRACKER */}
            {activeTab === 'tracker' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', minHeight: '60vh' }}>
                    {['New', 'Saved', 'Viewed', 'Applied', 'Rejected'].map(statusCol => (
                        <div key={statusCol} style={styles.kanbanCol} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, statusCol)}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '1.5rem', color: '#6B7280', borderBottom: '2px solid #E5E7EB', paddingBottom: '0.5rem' }}>
                                {statusCol.toUpperCase()} <span style={{ float: 'right', background: '#E5E7EB', color: '#111827', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>{jobs.filter(j => j.status === statusCol).length}</span>
                            </h3>
                            {jobs.filter(j => j.status === statusCol).map(job => (
                                <div key={job.id} draggable onDragStart={(e) => handleDragStart(e, job.id)} style={styles.kanbanCard}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#111827' }}>{job.company}</h4>
                                        <span style={{ color: '#10B981', fontWeight: '900' }}>{job.score}%</span>
                                    </div>
                                    <p style={{ margin: '0 0 10px 0', color: '#6B7280', fontSize: '0.9rem' }}>{job.title}</p>
                                    <button style={{ width: '100%', background: 'transparent', border: '1px solid #3B82F6', color: '#3B82F6', borderRadius: '6px', padding: '5px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}>View Details</button>
                                </div>
                            ))}
                        </div>
                    ))}
                </motion.div>
            )}

            {/* TAB: ANALYTICS & SKILLS */}
            {activeTab === 'analytics' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={styles.glassCard}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#F59E0B' }}></i> CRITICAL SKILL GAPS
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {[{ skill: 'Go (Golang)', freq: 'In 45 High-Match Jobs', impact: '85%' }, { skill: 'Kafka', freq: 'In 32 High-Match Jobs', impact: '60%' }, { skill: 'GraphQL', freq: 'In 28 High-Match Jobs', impact: '45%' }].map(gap => (
                                <div key={gap.skill} style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#EF4444' }}>{gap.skill}</h4>
                                        <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>{gap.freq}</span>
                                    </div>
                                    <div style={{ height: '6px', background: '#E5E7EB', borderRadius: '3px', marginBottom: '15px' }}>
                                        <div style={{ width: gap.impact, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #EF4444)', borderRadius: '3px' }}></div>
                                    </div>
                                    <button style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
                                        <i className="fa-solid fa-play"></i> Auto-Generate Study Plan
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={styles.glassCard}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '1.5rem' }}>WHY AI REJECTED JOBS (Filtered Out)</h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '1.5rem', flex: '1 1 45%', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#EF4444' }}>412</div>
                                <div style={{ fontSize: '0.8rem', color: '#111827', marginTop: '5px' }}>Low Score (&lt; 60%)</div>
                            </div>
                            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '1.5rem', flex: '1 1 45%', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#F59E0B' }}>156</div>
                                <div style={{ fontSize: '0.8rem', color: '#111827', marginTop: '5px' }}>Experience Too High</div>
                            </div>
                            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '1.5rem', flex: '1 1 45%', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#3B82F6' }}>89</div>
                                <div style={{ fontSize: '0.8rem', color: '#111827', marginTop: '5px' }}>Mismatched Location</div>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginTop: '2.5rem', marginBottom: '1.5rem', color: '#111827' }}>TRENDING DOMAINS</h3>
                        <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
                            <p style={{ margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between', color: '#7C3AED', fontWeight: 'bold' }}><span>Generative AI</span> <span>+145% this week</span></p>
                            <p style={{ margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 'bold' }}><span>Cloud Architecture</span> <span>+80% this week</span></p>
                            <p style={{ margin: '0 0 0 0', display: 'flex', justifyContent: 'space-between', color: '#3B82F6', fontWeight: 'bold' }}><span>Frontend (React)</span> <span>Stable</span></p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* TAB: JOB PORTALS */}
            {activeTab === 'portals' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '1rem 0' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '2rem', color: '#111827' }}>
                        <i className="fa-solid fa-globe" style={{ marginRight: '10px', color: '#3B82F6' }}></i>
                        Supported External Job Integrations
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {jobWebsites.map((site) => (
                            <a
                                key={site.name}
                                href={site.url}
                                target="_blank"
                                rel="noreferrer"
                                className="job-card-hover"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1.5rem',
                                    background: '#FFFFFF',
                                    borderRadius: '16px',
                                    border: '1px solid #E5E7EB',
                                    textDecoration: 'none',
                                    color: '#111827',
                                    transition: '0.3s',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}
                            >
                                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#F8FAFC', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', border: `1px solid ${site.color}` }}>
                                    <i className={site.icon} style={{ color: site.color }}></i>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{site.name}</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280', marginTop: '4px' }}>Visit Original Portal &rarr;</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default JobTracker;
