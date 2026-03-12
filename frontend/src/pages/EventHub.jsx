import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// ─── DATA ──────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'AI & Tech', 'Career', 'Hackathon', 'Design', 'Health', 'Finance'];

const EVENTS = [
    {
        id: 1, title: 'Global AI Summit 2026', organizer: 'Stanford University',
        date: '2026-03-15', time: '10:00 AM EST', mode: 'Online', type: 'Conference',
        category: 'AI & Tech', price: 'Free', attendees: 4250, recommended: true,
        tag: 'Flagship', color: '#6366f1',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        desc: 'The world\'s largest convergence of AI researchers, engineers, and visionaries shaping the future of intelligent systems.',
        speakers: ['Dr. Fei-Fei Li', 'Yann LeCun', 'Andrew Ng'],
    },
    {
        id: 2, title: 'Next-Gen Fintech Hackathon', organizer: 'Goldman Sachs',
        date: '2026-04-10', time: '09:00 AM GMT', mode: 'Offline', type: 'Hackathon',
        category: 'Finance', price: 'Free', attendees: 800, recommended: true,
        tag: 'Prize $50K', color: '#10b981',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
        desc: 'Build the next generation of financial products. 48 hours, $50K prize pool, and direct investor access.',
        speakers: ['Jane Fraser', 'Adena Friedman'],
    },
    {
        id: 3, title: 'UX Design Masterclass 2026', organizer: 'Adobe & RISD',
        date: '2026-03-18', time: '09:00 AM EST', mode: 'Online', type: 'Workshop',
        category: 'Design', price: 'Free', attendees: 1200, recommended: true,
        tag: 'Certificate', color: '#f59e0b',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
        desc: 'Deep-dive workshop on human-centered design principles with expert mentors from Google, Meta, and Apple.',
        speakers: ['Scott Belsky', 'Ivy Ross'],
    },
    {
        id: 7, title: 'Code Escape House: Practical Mastery', organizer: 'SkillPark AI',
        date: '2026-03-20', time: '09:00 AM EST', mode: 'Online', type: 'Workshop',
        category: 'AI & Tech', price: 'Free', attendees: 15600, recommended: true,
        tag: '120 Rooms', color: '#8b5cf6',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
        desc: 'Enter the virtual house of 120 rooms. Solve practical coding labs across 12 domains to unlock your potential and earn exclusive badges.',
        speakers: ['AI Guide', 'Cyber Overlord'],
    },
    {
        id: 4, title: 'Cloud Architecture Masterclass', organizer: 'Amazon Web Services',
        date: '2026-03-28', time: '11:00 AM PST', mode: 'Online', type: 'Certification',
        category: 'AI & Tech', price: 'Paid', attendees: 3200, recommended: false,
        tag: 'AWS Certified', color: '#ec4899',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
        desc: 'Earn your AWS Solutions Architect certification with hands-on labs guided by senior AWS engineers.',
        speakers: ['Werner Vogels', 'Swami Sivasubramanian'],
    },
    {
        id: 5, title: 'Career Growth Summit', organizer: 'LinkedIn & McKinsey',
        date: '2026-05-05', time: '10:00 AM BST', mode: 'Online', type: 'Seminar',
        category: 'Career', price: 'Free', attendees: 6500, recommended: true,
        tag: 'Popular', color: '#3b82f6',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
        desc: 'A global summit focused on career transitions, leadership growth, and the future of work in the AI era.',
        speakers: ['Satya Nadella', 'Sheryl Sandberg', 'Reid Hoffman'],
    },
    {
        id: 6, title: 'BioTech Innovation Forum', organizer: 'Harvard Medical School',
        date: '2026-03-22', time: '02:00 PM EST', mode: 'Offline', type: 'Workshop',
        category: 'Health', price: 'Paid', attendees: 350, recommended: false,
        tag: 'Invite Only', color: '#8b5cf6',
        image: 'https://images.unsplash.com/photo-1532187875605-1ef6c016b148?auto=format&fit=crop&q=80&w=800',
        desc: 'Cutting-edge biotech research presentations and labs exploring gene editing, CRISPR, and personalised medicine.',
        speakers: ['Jennifer Doudna', 'David Liu'],
    },
];

const SPEAKERS = [
    { name: 'Dr. Fei-Fei Li', role: 'AI Research Director, Stanford', img: 'https://ui-avatars.com/api/?name=Fei-Fei+Li&background=6366f1&color=fff&size=120', topic: 'Future of Computer Vision' },
    { name: 'Yann LeCun', role: 'Chief AI Scientist, Meta', img: 'https://ui-avatars.com/api/?name=Yann+LeCun&background=ec4899&color=fff&size=120', topic: 'Deep Learning Frontiers' },
    { name: 'Andrew Ng', role: 'Founder, DeepLearning.AI', img: 'https://ui-avatars.com/api/?name=Andrew+Ng&background=10b981&color=fff&size=120', topic: 'AI for Everyone' },
    { name: 'Reid Hoffman', role: 'Co-Founder, LinkedIn', img: 'https://ui-avatars.com/api/?name=Reid+Hoffman&background=f59e0b&color=fff&size=120', topic: 'Building Impactful Networks' },
];

const SCHEDULE = [
    { time: '09:00', title: 'Registration & Welcome', type: 'setup', icon: 'fa-door-open' },
    { time: '10:00', title: 'Opening Keynote: AI in 2026', speaker: 'Dr. Fei-Fei Li', type: 'keynote', icon: 'fa-microphone' },
    { time: '11:30', title: 'Panel: Building At Scale', speaker: 'Yann LeCun & Andrew Ng', type: 'panel', icon: 'fa-people-group' },
    { time: '13:00', title: 'Networking Lunch Break', type: 'break', icon: 'fa-utensils' },
    { time: '14:00', title: 'Workshop: LLM Engineering', speaker: 'AI Track Leads', type: 'workshop', icon: 'fa-laptop-code' },
    { time: '16:00', title: 'Career Pathways in AI', speaker: 'Reid Hoffman', type: 'keynote', icon: 'fa-road' },
    { time: '17:30', title: 'Awards & Closing', type: 'setup', icon: 'fa-trophy' },
];

const FAQ = [
    { q: 'How do I register?', a: 'Click "Register Now" on any event card. You\'ll receive an email confirmation with your digital ticket and calendar invite.' },
    { q: 'Are events free to attend?', a: 'Most events are free. Some premium workshops and certifications have a fee — always displayed on the event card.' },
    { q: 'Can I attend online?', a: 'Yes! Many events are fully online or hybrid. Filter by "Online" to see virtual options.' },
    { q: 'Do I get a certificate?', a: 'Certification events and workshops issue verifiable digital certificates upon completion.' },
    { q: 'Can I bookmark events?', a: 'Yes — hit the bookmark icon. Your saved events appear in the Activity panel on the right.' },
];

// ─── COUNTDOWN ────────────────────────────────────────────────────────
function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState({});
    useEffect(() => {
        const tick = () => {
            const diff = new Date(targetDate) - new Date();
            if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); return; }
            setTimeLeft({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return timeLeft;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────
const EventHub = () => {
    const [eventsList, setEventsList] = useState(EVENTS); // fallback to mock, but we will overwrite with DB
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [filterMode, setFilterMode] = useState('All');
    const [filterPrice, setFilterPrice] = useState('All');
    const [bookmarks, setBookmarks] = useState([]);
    const [registered, setRegistered] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [faqOpen, setFaqOpen] = useState(null);
    const [activeSection, setActiveSection] = useState('events'); // events | schedule | speakers | faq
    const countdown = useCountdown('2026-03-15T10:00:00');

    useEffect(() => {
        // Fetch Live Schedule and Registrations from PostgreSQL Backend
        const fetchRemoteEvents = async () => {
            try {
                const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

                // Fetch all global events
                const eventsRes = await axios.get(`${import.meta.env.VITE_API_URL}/v1/events`);
                if (eventsRes.data.success && eventsRes.data.data.length > 0) {
                    setEventsList(eventsRes.data.data);
                }

                // Fetch my registrations
                const myRegRes = await axios.get(`${import.meta.env.VITE_API_URL}/v1/events/my-registrations`, { headers });
                if (myRegRes.data.success) {
                    const regIds = myRegRes.data.data.map(reg => reg.eventId);
                    setRegistered(regIds);
                }
            } catch (err) {
                console.error("Failed to load backend events. Using fallback data.", err);
            }
        };
        fetchRemoteEvents();
    }, []);

    const filtered = useMemo(() =>
        eventsList.filter(e =>
            (category === 'All' || e.category === category) &&
            (filterMode === 'All' || e.mode === filterMode) &&
            (filterPrice === 'All' || e.price === filterPrice) &&
            (search === '' || e.title.toLowerCase().includes(search.toLowerCase()) || e.organizer.toLowerCase().includes(search.toLowerCase()))
        ), [category, filterMode, filterPrice, search]);

    const toggleBookmark = (id) => setBookmarks(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

    // Send registration to Postgres
    const register = async (e) => {
        if (!registered.includes(e.id)) {
            try {
                const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
                await axios.post(`${import.meta.env.VITE_API_URL}/v1/events/${e.id}/register`, {}, { headers });
                setRegistered(p => [...p, e.id]);
            } catch (err) {
                console.error("Registration failed:", err);
                alert(err.response?.data?.error || "Registration system offline");
            }
        }
        setSelectedEvent(null);
    };

    const typeColor = { Conference: '#6366f1', Hackathon: '#10b981', Workshop: '#f59e0b', Certification: '#ec4899', Seminar: '#3b82f6' };
    const scheduleColor = { keynote: '#6366f1', panel: '#10b981', workshop: '#f59e0b', break: '#94a3b8', setup: '#e2e8f0' };

    return (
        <div style={{ width: '100%', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif", color: '#0f172a' }}>

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
                padding: '5rem 3rem 4rem',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* BG decorations */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span style={{ background: 'rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '6px 16px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid rgba(99,102,241,0.4)' }}>
                            🌐 SkillPark AI · Global Event Hub
                        </span>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: 'white', marginTop: '1.5rem', marginBottom: '1rem', lineHeight: 1.1 }}>
                            Where the World&apos;s Best<br />
                            <span style={{ background: 'linear-gradient(90deg, #818cf8, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Minds Converge
                            </span>
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '600px', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                            Discover 500+ global events — conferences, hackathons, workshops, and certifications curated by AI across 20+ domains.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                            <button onClick={() => { if (eventsList.length > 0) setSelectedEvent(eventsList[0]); }} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', padding: '0.85rem 2rem', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
                                <i className="fa-solid fa-rocket" /> Register Now — Free
                            </button>
                            <button onClick={() => setActiveSection('schedule')} style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '0.85rem 2rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(10px)' }}>
                                <i className="fa-solid fa-calendar-lines" /> View Schedule
                            </button>
                        </div>

                        {/* Countdown */}
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                🔹 Next Flagship Event: Global AI Summit 2026
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {[{ label: 'Days', val: countdown.d }, { label: 'Hours', val: countdown.h }, { label: 'Mins', val: countdown.m }, { label: 'Secs', val: countdown.s }].map(({ label, val }) => (
                                    <div key={label} style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1rem 1.5rem', textAlign: 'center', minWidth: '80px' }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#a5b4fc', lineHeight: 1 }}>{String(val ?? 0).padStart(2, '0')}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, marginTop: '4px', textTransform: 'uppercase' }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Stats ribbon */}
                <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '4rem', padding: '1.5rem 3rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
                        {[['500+', 'Global Events'], ['50+', 'Partner Universities'], ['120K+', 'Registrations'], ['200+', 'Expert Speakers']].map(([n, l]) => (
                            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#a5b4fc' }}>{n}</span>
                                <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>{l}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CONTENT ───────────────────────────────────────────────── */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>

                {/* Section Nav */}
                <div style={{ display: 'flex', gap: '0.5rem', background: 'white', padding: '6px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(15,23,42,0.05)', marginBottom: '3rem', width: 'fit-content' }}>
                    {[['events', 'fa-calendar-star', 'Events'], ['schedule', 'fa-list-timeline', 'Schedule'], ['speakers', 'fa-users', 'Speakers'], ['faq', 'fa-circle-question', 'FAQ']].map(([id, icon, label]) => (
                        <button key={id} onClick={() => setActiveSection(id)} style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', border: 'none', background: activeSection === id ? '#6366f1' : 'transparent', color: activeSection === id ? 'white' : '#64748b', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                            <i className={`fa-solid ${icon}`} style={{ fontSize: '0.85rem' }} /> {label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">

                    {/* ── EVENTS SECTION ────────────────────────── */}
                    {activeSection === 'events' && (
                        <motion.div key="events" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2.5rem', alignItems: 'start' }}>

                                {/* Main */}
                                <div>
                                    {/* Search bar */}
                                    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                                        <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }} />
                                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events, organizers..." style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', fontFamily: 'inherit', background: 'white', color: '#0f172a', outline: 'none', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }} />
                                    </div>

                                    {/* Category pills */}
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                                        {CATEGORIES.map(cat => (
                                            <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '0.5rem 1.1rem', borderRadius: '999px', border: `1.5px solid ${category === cat ? '#6366f1' : '#e2e8f0'}`, background: category === cat ? '#6366f1' : 'white', color: category === cat ? 'white' : '#64748b', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                                                {cat}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Featured row */}
                                    <div style={{ marginBottom: '3rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)', borderRadius: '4px' }} />
                                            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>Featured Events</h2>
                                            <span style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', padding: '2px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 800 }}>AI Recommended</span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                                            {eventsList.filter(e => e.recommended).map(event => (
                                                <EventCard key={event.id} event={event} isBookmarked={bookmarks.includes(event.id)} isRegistered={registered.includes(event.id)} onBookmark={() => toggleBookmark(event.id)} onOpen={() => setSelectedEvent(event)} typeColor={typeColor} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* All events */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '4px', height: '24px', background: 'linear-gradient(to bottom, #10b981, #06b6d4)', borderRadius: '4px' }} />
                                                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>All Events</h2>
                                            </div>
                                            <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>{filtered.length} events found</span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                                            {filtered.map(event => (
                                                <EventCard key={event.id} event={event} compact isBookmarked={bookmarks.includes(event.id)} isRegistered={registered.includes(event.id)} onBookmark={() => toggleBookmark(event.id)} onOpen={() => setSelectedEvent(event)} typeColor={typeColor} />
                                            ))}
                                        </div>
                                        {filtered.length === 0 && (
                                            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                                <i className="fa-solid fa-calendar-xmark" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }} />
                                                <p style={{ fontWeight: 600 }}>No events match your filters</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '80px' }}>
                                    {/* Filters */}
                                    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                                        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className="fa-solid fa-sliders" style={{ color: '#6366f1' }} /> Smart Filters
                                        </h3>
                                        <FilterGroup label="Mode" options={['All', 'Online', 'Offline']} value={filterMode} onChange={setFilterMode} />
                                        <div style={{ height: '1px', background: '#f1f5f9', margin: '1rem 0' }} />
                                        <FilterGroup label="Price" options={['All', 'Free', 'Paid']} value={filterPrice} onChange={setFilterPrice} />
                                        <button onClick={() => { setFilterMode('All'); setFilterPrice('All'); setCategory('All'); setSearch(''); }} style={{ width: '100%', marginTop: '1.25rem', padding: '0.65rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#64748b', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                                            Reset Filters
                                        </button>
                                    </div>

                                    {/* Activity */}
                                    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                                        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className="fa-solid fa-chart-simple" style={{ color: '#10b981' }} /> Your Activity
                                        </h3>
                                        {[{ icon: 'fa-bookmark', color: '#6366f1', label: 'Bookmarked', val: bookmarks.length }, { icon: 'fa-check-circle', color: '#10b981', label: 'Registered', val: registered.length }, { icon: 'fa-clock', color: '#f59e0b', label: 'Upcoming', val: 2 }].map(({ icon, color, label, val }) => (
                                            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f8fafc' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '32px', height: '32px', background: `${color}15`, color: color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                                                        <i className={`fa-solid ${icon}`} />
                                                    </div>
                                                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{label}</span>
                                                </div>
                                                <span style={{ fontWeight: 900, color, fontSize: '1.1rem' }}>{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── SCHEDULE SECTION ──────────────────────── */}
                    {activeSection === 'schedule' && (
                        <motion.div key="schedule" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                            <div style={{ maxWidth: '760px' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Event Schedule</h2>
                                <p style={{ color: '#64748b', marginBottom: '3rem' }}>Global AI Summit 2026 — March 15, 2026 · 09:00 AM EST</p>

                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '56px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, #6366f1, #8b5cf6, #e2e8f0)', borderRadius: '2px' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                        {SCHEDULE.map((s, i) => (
                                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', padding: '1.25rem 0' }}>
                                                <span style={{ width: '50px', textAlign: 'right', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, paddingTop: '6px', flexShrink: 0 }}>{s.time}</span>
                                                <div style={{ position: 'relative', zIndex: 1, width: '36px', height: '36px', borderRadius: '50%', background: s.type === 'break' || s.type === 'setup' ? '#f1f5f9' : scheduleColor[s.type] || '#6366f1', color: s.type === 'break' || s.type === 'setup' ? '#94a3b8' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem', border: '3px solid white', boxShadow: '0 0 0 2px ' + (scheduleColor[s.type] || '#e2e8f0') }}>
                                                    <i className={`fa-solid ${s.icon}`} />
                                                </div>
                                                <div style={{ flex: 1, background: 'white', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                                                    <p style={{ margin: '0 0 3px', fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{s.title}</p>
                                                    {s.speaker && <p style={{ margin: 0, color: '#6366f1', fontSize: '0.82rem', fontWeight: 700 }}><i className="fa-solid fa-microphone" style={{ marginRight: '5px', fontSize: '0.7rem' }} />{s.speaker}</p>}
                                                    <span style={{ display: 'inline-block', marginTop: '6px', padding: '2px 10px', background: `${scheduleColor[s.type] || '#e2e8f0'}20`, color: scheduleColor[s.type] || '#94a3b8', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>{s.type}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── SPEAKERS SECTION ──────────────────────── */}
                    {activeSection === 'speakers' && (
                        <motion.div key="speakers" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Featured Speakers</h2>
                            <p style={{ color: '#64748b', marginBottom: '3rem' }}>World-class experts shaping the next decade of technology and innovation</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                                {SPEAKERS.map((s, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(15,23,42,0.1)' }} style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '2rem', textAlign: 'center', cursor: 'default', transition: 'all 0.3s ease', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                                        <img src={s.img} alt={s.name} style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem', border: '3px solid #f1f5f9' }} />
                                        <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{s.name}</h3>
                                        <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{s.role}</p>
                                        <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: '10px', padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#6366f1', fontWeight: 700 }}>
                                            <i className="fa-solid fa-microphone" style={{ marginRight: '6px' }} />{s.topic}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── FAQ SECTION ───────────────────────────── */}
                    {activeSection === 'faq' && (
                        <motion.div key="faq" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ maxWidth: '720px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
                            <p style={{ color: '#64748b', marginBottom: '3rem' }}>Everything you need to know about SkillPark AI events</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {FAQ.map((item, i) => (
                                    <motion.div key={i} layout style={{ background: 'white', borderRadius: '14px', border: `1px solid ${faqOpen === i ? '#6366f1' : '#e2e8f0'}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(15,23,42,0.04)', cursor: 'pointer' }} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                                        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: faqOpen === i ? '#6366f1' : '#0f172a' }}>{item.q}</span>
                                            <i className={`fa-solid fa-chevron-${faqOpen === i ? 'up' : 'down'}`} style={{ color: faqOpen === i ? '#6366f1' : '#94a3b8', fontSize: '0.8rem', transition: '0.2s' }} />
                                        </div>
                                        <AnimatePresence>
                                            {faqOpen === i && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                                                    <p style={{ margin: 0, padding: '0 1.5rem 1.25rem', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.a}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* ── MODAL ─────────────────────────────────────────────────── */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setSelectedEvent(null)}>
                        <motion.div initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ type: 'spring', damping: 20 }} onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '620px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(15,23,42,0.25)' }}>
                            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                                <img src={selectedEvent.image} alt={selectedEvent.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.8), transparent)' }} />
                                <button onClick={() => setSelectedEvent(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-solid fa-xmark" />
                                </button>
                                <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem' }}>
                                    <span style={{ background: typeColor[selectedEvent.type] || '#6366f1', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>{selectedEvent.type}</span>
                                </div>
                            </div>
                            <div style={{ padding: '2rem' }}>
                                <span style={{ color: '#6366f1', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase' }}>{selectedEvent.category}</span>
                                <h2 style={{ margin: '0.5rem 0 0.75rem', fontSize: '1.5rem', fontWeight: 900 }}>{selectedEvent.title}</h2>
                                <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>{selectedEvent.desc}</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    {[['fa-calendar', new Date(selectedEvent.date).toLocaleDateString('en-US', { dateStyle: 'long' })], ['fa-clock', selectedEvent.time], ['fa-location-dot', selectedEvent.mode === 'Online' ? 'Worldwide (Online)' : selectedEvent.location || 'TBD'], ['fa-users', `${selectedEvent.attendees.toLocaleString()} registered`]].map(([icon, val]) => (
                                        <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '0.875rem' }}>
                                            <i className={`fa-solid ${icon}`} style={{ color: '#6366f1', width: '16px' }} /> {val}
                                        </div>
                                    ))}
                                </div>
                                {selectedEvent.speakers && (
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Speakers</p>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {selectedEvent.speakers.map(sp => (
                                                <span key={sp} style={{ background: '#f1f5f9', color: '#374151', padding: '4px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600 }}>{sp}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <button onClick={() => register(selectedEvent)} disabled={registered.includes(selectedEvent.id)} style={{ width: '100%', padding: '1rem', background: registered.includes(selectedEvent.id) ? '#10b981' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: registered.includes(selectedEvent.id) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    {registered.includes(selectedEvent.id) ? <><i className="fa-solid fa-check" /> Registered!</> : <><i className="fa-solid fa-rocket" /> Register Now — {selectedEvent.price}</>}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── EVENT CARD ──────────────────────────────────────────────────────
const EventCard = ({ event, compact, isBookmarked, isRegistered, onBookmark, onOpen, typeColor }) => (
    <motion.div whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(15,23,42,0.1)' }} style={{ background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', boxShadow: '0 2px 8px rgba(15,23,42,0.04)', transition: 'all 0.3s ease' }} onClick={onOpen}>
        <div style={{ position: 'relative', height: compact ? '160px' : '200px', overflow: 'hidden', flexShrink: 0 }}>
            <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.4), transparent)' }} />
            <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                <span style={{ background: typeColor[event.type] || '#6366f1', color: 'white', padding: '3px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800 }}>{event.type}</span>
                {event.recommended && <span style={{ background: '#0f172a', color: '#a5b4fc', padding: '3px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800 }}>✦ AI Pick</span>}
            </div>
            <button onClick={e => { e.stopPropagation(); onBookmark(); }} style={{ position: 'absolute', top: '12px', right: '12px', background: isBookmarked ? '#6366f1' : 'rgba(255,255,255,0.9)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: isBookmarked ? 'white' : '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <i className={`fa-${isBookmarked ? 'solid' : 'regular'} fa-bookmark`} />
            </button>
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: event.price === 'Free' ? '#10b98130' : '#f59e0b30', color: event.price === 'Free' ? '#10b981' : '#f59e0b', padding: '3px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, backdropFilter: 'blur(8px)' }}>{event.price}</div>
        </div>
        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>{event.category}</span>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: compact ? '1rem' : '1.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>{event.title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1rem' }}>
                {[['fa-building', event.organizer], ['fa-calendar', new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })], ['fa-location-dot', event.mode === 'Online' ? 'Online' : event.location || event.mode]].map(([icon, txt]) => (
                    <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#64748b', fontSize: '0.8rem' }}>
                        <i className={`fa-solid ${icon}`} style={{ width: '12px', color: '#94a3b8' }} /> {txt}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8', fontSize: '0.8rem' }}>
                    <i className="fa-solid fa-users" style={{ fontSize: '0.75rem' }} /> {event.attendees.toLocaleString()}
                </div>
                <div style={{ background: isRegistered ? '#10b98115' : 'rgba(99,102,241,0.08)', color: isRegistered ? '#10b981' : '#6366f1', padding: '5px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, border: `1px solid ${isRegistered ? '#10b98130' : 'rgba(99,102,241,0.15)'}` }}>
                    {isRegistered ? '✓ Registered' : 'View Details →'}
                </div>
            </div>
        </div>
    </motion.div>
);

const FilterGroup = ({ label, options, value, onChange }) => (
    <div>
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {options.map(opt => (
                <button key={opt} onClick={() => onChange(opt)} style={{ padding: '5px 14px', borderRadius: '8px', border: `1.5px solid ${value === opt ? '#6366f1' : '#e2e8f0'}`, background: value === opt ? 'rgba(99,102,241,0.08)' : 'transparent', color: value === opt ? '#6366f1' : '#64748b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

export default EventHub;
