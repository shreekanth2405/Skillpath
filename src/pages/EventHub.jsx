import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, MapPin, Tag, Filter, Search, Bookmark,
    Bell, ChevronRight, Globe, Users, Trophy, ExternalLink,
    CheckCircle, Clock, Plus, Download, LayoutGrid, CalendarDays
} from 'lucide-react';

const EventHub = () => {
    // --- STATE MANAGEMENT ---
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'calendar'
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [filters, setFilters] = useState({
        type: 'All',
        mode: 'All',
        price: 'All',
        date: 'All'
    });

    // --- MOCK DATA ---
    const eventCategories = ['All', 'Engineering', 'Medical', 'Management', 'Arts & Science', 'Law', 'Design'];

    const mockEvents = [
        {
            id: 1,
            title: "Global AI Summit 2026",
            organizer: "Stanford University",
            date: "2026-03-15",
            time: "10:00 AM EST",
            mode: "Online",
            type: "Conference",
            department: "Engineering",
            domain: "Artificial Intelligence",
            price: "Free",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
            attendees: 1250,
            recommended: true
        },
        {
            id: 2,
            title: "Next-Gen Fintech Hackathon",
            organizer: "Goldman Sachs",
            date: "2026-04-10",
            time: "09:00 AM GMT",
            mode: "Offline",
            location: "London, UK",
            type: "Hackathon",
            department: "Management",
            domain: "Finance",
            price: "Free",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
            attendees: 500,
            recommended: true
        },
        {
            id: 3,
            title: "Advanced Bio-Genetics Workshop",
            organizer: "Harvard Medical School",
            date: "2026-03-22",
            time: "02:00 PM EST",
            mode: "Online",
            type: "Workshop",
            department: "Medical",
            domain: "Biotechnology",
            price: "Paid",
            image: "https://images.unsplash.com/photo-1532187875605-1ef6c016b148?auto=format&fit=crop&q=80&w=800",
            attendees: 200,
            recommended: false
        },
        {
            id: 4,
            title: "Cloud Architecture Masterclass",
            organizer: "Amazon Web Services",
            date: "2026-03-28",
            time: "11:00 AM PST",
            mode: "Online",
            type: "Certification",
            department: "Engineering",
            domain: "Cloud Computing",
            price: "Paid",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
            attendees: 3000,
            recommended: true
        },
        {
            id: 5,
            title: "International Law Review 2026",
            organizer: "Oxford University",
            date: "2026-05-05",
            time: "10:00 AM BST",
            mode: "Offline",
            location: "Oxford, UK",
            type: "Seminar",
            department: "Law",
            domain: "Corporate Law",
            price: "Free",
            image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
            attendees: 450,
            recommended: false
        },
        {
            id: 6,
            title: "Design for the Future Marathon",
            organizer: "Adobe & RISD",
            date: "2026-03-18",
            time: "09:00 AM EST",
            mode: "Online",
            type: "Workshop",
            department: "Design",
            domain: "UX/UI Design",
            price: "Free",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
            attendees: 800,
            recommended: true
        }
    ];

    // --- FILTERING LOGIC ---
    const filteredEvents = useMemo(() => {
        return mockEvents.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'All' || event.department === activeCategory;
            const matchesType = filters.type === 'All' || event.type === filters.type;
            const matchesMode = filters.mode === 'All' || event.mode === filters.mode;
            const matchesPrice = filters.price === 'All' || event.price === filters.price;

            return matchesSearch && matchesCategory && matchesType && matchesMode && matchesPrice;
        });
    }, [searchQuery, activeCategory, filters]);

    const recommendedEvents = mockEvents.filter(e => e.recommended);

    // --- HANDLERS ---
    const toggleBookmark = (id) => {
        setBookmarkedEvents(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const registerForEvent = (title) => {
        setRegisteredEvents(prev => [...prev, title]);
        alert(`Successfully registered for: ${title}. A calendar invite has been sent to your email!`);
    };

    return (
        <div style={{
            width: '100%',
            maxWidth: '1600px',
            margin: '0 auto',
            padding: '2rem',
            color: 'white',
            fontFamily: "'Outfit', sans-serif",
            background: '#020617',
            minHeight: '100vh'
        }}>
            {/* --- HEADER SECTION --- */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '3rem',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.4))',
                padding: '2.5rem',
                borderRadius: '32px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)'
            }}>
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Skill Path AI Global Event Hub
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                        Intelligent Academic & Professional Opportunities Across 100+ Domains
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <div style={{ background: 'rgba(96, 165, 250, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(96, 165, 250, 0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Trophy size={18} color="#60a5fa" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>128 New Hackathons</span>
                        </div>
                        <div style={{ background: 'rgba(167, 139, 250, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(167, 139, 250, 0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Globe size={18} color="#a78bfa" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>50+ Global Universities</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="primary-btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '14px' }}>
                        <Plus size={20} /> Post Event
                    </button>
                    <button className="primary-btn pulse-glow" style={{ background: '#4f46e5', padding: '12px 25px', borderRadius: '14px' }}>
                        <Bell size={20} /> Notifications
                    </button>
                </div>
            </div>

            {/* --- SEARCH & CATEGORIES --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="text"
                            placeholder="Search events, organizers, or domains..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '18px',
                                padding: '1.25rem 1.25rem 1.25rem 3.5rem',
                                color: 'white',
                                fontSize: '1.1rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{ padding: '10px 15px', borderRadius: '10px', background: viewMode === 'grid' ? '#3b82f6' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            style={{ padding: '10px 15px', borderRadius: '10px', background: viewMode === 'calendar' ? '#3b82f6' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <CalendarDays size={20} />
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {eventCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '100px',
                                background: activeCategory === cat ? 'white' : 'rgba(255,255,255,0.05)',
                                color: activeCategory === cat ? '#0f172a' : '#94a3b8',
                                border: '1px solid rgba(255,255,255,0.1)',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '2.5rem' }}>
                {/* --- MAIN CONTENT AREA --- */}
                <div>
                    {/* RECOMMENDED SECTION */}
                    <div style={{ marginBottom: '4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Trophy size={20} color="#a855f7" />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>AI Personalized for You</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                            {recommendedEvents.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    isBookmarked={bookmarkedEvents.includes(event.id)}
                                    onBookmark={() => toggleBookmark(event.id)}
                                    onRegister={() => registerForEvent(event.title)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* GLOBAL FEED */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Global Opportunity Feed</h2>
                            <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 700 }}>Showing {filteredEvents.length} Events</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {filteredEvents.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    compact
                                    isBookmarked={bookmarkedEvents.includes(event.id)}
                                    onBookmark={() => toggleBookmark(event.id)}
                                    onRegister={() => registerForEvent(event.title)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- FILTER & STATS SIDEBAR --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* FILTERS PANEL */}
                    <div style={{
                        background: 'rgba(30, 41, 59, 0.3)',
                        padding: '2rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        position: 'sticky',
                        top: '2rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                            <Filter size={20} color="#60a5fa" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Smart Filters</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <FilterGroup
                                label="Event Type"
                                options={['All', 'Conference', 'Workshop', 'Hackathon', 'Certification']}
                                value={filters.type}
                                onChange={(val) => setFilters(f => ({ ...f, type: val }))}
                            />
                            <FilterGroup
                                label="Attendance Mode"
                                options={['All', 'Online', 'Offline']}
                                value={filters.mode}
                                onChange={(val) => setFilters(f => ({ ...f, mode: val }))}
                            />
                            <FilterGroup
                                label="Pricing"
                                options={['All', 'Free', 'Paid']}
                                value={filters.price}
                                onChange={(val) => setFilters(f => ({ ...f, price: val }))}
                            />
                            <FilterGroup
                                label="Date Range"
                                options={['All', 'Today', 'This Week', 'This Month']}
                                value={filters.date}
                                onChange={(val) => setFilters(f => ({ ...f, date: val }))}
                            />
                        </div>

                        <button
                            className="primary-btn"
                            style={{
                                width: '100%',
                                marginTop: '2.5rem',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '12px',
                                borderRadius: '12px'
                            }}
                            onClick={() => setFilters({ type: 'All', mode: 'All', price: 'All', date: 'All' })}
                        >
                            Reset All Filters
                        </button>
                    </div>

                    {/* STATS PANEL */}
                    <div style={{ background: '#3b82f610', padding: '1.5rem', borderRadius: '24px', border: '1px dashed #3b82f640' }}>
                        <h4 style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>Your Event Activity</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <ActivityItem icon={<Bookmark size={16} />} count={bookmarkedEvents.length} label="Saved Opportunities" />
                            <ActivityItem icon={<CheckCircle size={16} />} count={registeredEvents.length} label="Successfully Registered" />
                            <ActivityItem icon={<Clock size={16} />} count={2} label="Upcoming Reminders" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const EventCard = ({ event, compact = false, isBookmarked, onBookmark, onRegister }) => {
    return (
        <motion.div
            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
            className="glass-panel"
            style={{
                background: 'rgba(30, 41, 59, 0.4)',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <div style={{ position: 'relative', height: compact ? '160px' : '220px', overflow: 'hidden' }}>
                <img src={event.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={event.title} />
                <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onBookmark(); }}
                        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: 'none', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isBookmarked ? '#ef4444' : 'white', cursor: 'pointer' }}>
                        <Bookmark size={18} fill={isBookmarked ? "#ef4444" : "none"} />
                    </button>
                </div>
                {event.recommended && (
                    <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: '#4f46e5', padding: '5px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Trophy size={12} /> AI RECOMMENDED
                    </div>
                )}
                <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {event.type}
                </div>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 800 }}>{event.department.toUpperCase()}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{event.price}</span>
                </div>
                <h3 style={{ fontSize: compact ? '1.1rem' : '1.3rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.3 }}>{event.title}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.85rem' }}>
                        <Users size={14} /> <span>{event.organizer}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                        <Calendar size={14} /> <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {event.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                        <MapPin size={14} /> <span>{event.mode === 'Online' ? 'Worldwide (Online)' : event.location}</span>
                    </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onRegister}
                        className="primary-btn"
                        style={{ flex: 3, background: '#3b82f6', color: 'white', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                        Register Now
                    </button>
                    <button className="primary-btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <ExternalLink size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const FilterGroup = ({ label, options, value, onChange }) => {
    return (
        <div>
            <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginBottom: '0.75rem', display: 'block' }}>{label}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => onChange(opt)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            background: value === opt ? 'rgba(96, 165, 250, 0.2)' : 'rgba(255,255,255,0.03)',
                            color: value === opt ? '#60a5fa' : '#94a3b8',
                            border: `1px solid ${value === opt ? '#60a5fa40' : 'rgba(255,255,255,0.05)'}`,
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

const ActivityItem = ({ icon, count, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ color: '#60a5fa' }}>{icon}</div>
        <div style={{ fontSize: '0.9rem' }}>
            <span style={{ fontWeight: 900 }}>{count}</span> <span style={{ color: '#94a3b8' }}>{label}</span>
        </div>
    </div>
);

export default EventHub;
