import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const Resources = () => {
    const navigate = useNavigate();

    // --- State Management ---
    const [level, setLevel] = useState(1); // 1: Category, 2: SubCategory, 3: Subject/Books
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [bookmarkedGames, setBookmarkedGames] = useState({});

    useEffect(() => {
        // Fetch User's existing bookmarks from backend on load
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
        // Complex Hierarchy
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
                { title: 'Paramedical', subjects: [{ name: 'Lab Tech', books: ['Lab Manuals'] }] },
                { title: 'Nursing', subjects: [{ name: 'Child Health', books: ['Pediatrics Nursing'] }] },
                { title: 'Allied Health', subjects: [{ name: 'Physiotherapy', books: ['Biomechanics'] }] }
            ]
        },
        { title: 'Diploma', icon: 'fa-certificate', color: '#f59e0b', subs: [{ title: 'Polytechnic Sub', subjects: [] }] },
        { title: 'Other Courses', icon: 'fa-graduation-cap', color: '#8b5cf6', subs: [{ title: 'Commerce/Arts', subjects: [] }] },

        // Flat Categories (Treated as having 1 subcategory with dummy subject or direct books mapping logic)
        {
            title: 'Novels', icon: 'fa-book-open', color: '#ec4899',
            subs: [{ title: 'All Novels', subjects: [{ name: 'Classic Novels', books: ['The Great Gatsby', '1984'] }] }]
        },
        {
            title: 'Love Stories', icon: 'fa-heart', color: '#ef4444',
            subs: [{ title: 'Romance', subjects: [{ name: 'Bestsellers', books: ['The Notebook', 'Pride and Prejudice'] }] }]
        },
        {
            title: 'Fiction', icon: 'fa-wand-magic-sparkles', color: '#a855f7',
            subs: [{ title: 'Sci-Fi & Fantasy', subjects: [{ name: 'Top Rated', books: ['Dune', 'Harry Potter'] }] }]
        },
        {
            title: 'Career Growth', icon: 'fa-chart-line', color: '#0ea5e9',
            subs: [{ title: 'Professional Dev', subjects: [{ name: 'Career Strategy', books: ['So Good They Can’t Ignore You', 'Deep Work'] }] }]
        },
        {
            title: 'Self Development', icon: 'fa-person-arrow-up-from-line', color: '#14b8a6',
            subs: [{ title: 'Growth Mindset', subjects: [{ name: 'Mindset & Habits', books: ['Atomic Habits', 'The Power of Habit'] }] }]
        },
        {
            title: 'Productivity', icon: 'fa-stopwatch', color: '#eab308',
            subs: [{ title: 'Time Management', subjects: [{ name: 'Efficiency', books: ['Getting Things Done', 'Eat That Frog!'] }] }]
        },
        {
            title: 'Simulations', icon: 'fa-vr-cardboard', color: '#6366f1',
            subs: [{ title: '3D Cosmic Exploration', subjects: [{ name: 'Space Simulations', books: ['3D Solar System Experience'] }] }]
        }
    ];

    // --- Action Handlers ---
    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        setLevel(2);
    };

    const handleSubCategoryClick = (sub) => {
        setSelectedSubCategory(sub);
        setLevel(3);
    };

    const handleBack = () => {
        if (level === 2) {
            setSelectedCategory(null);
            setLevel(1);
        } else if (level === 3) {
            setSelectedSubCategory(null);
            setLevel(2);
        }
    };

    const toggleBookmark = async (e, book, categoryContext) => {
        e.stopPropagation();
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

        try {
            // Un-bookmark (Delete from DB)
            if (bookmarkedGames[book]) {
                const bookmarkId = bookmarkedGames[book];
                await axios.delete(`${import.meta.env.VITE_API_URL}/v1/bookmarks/${bookmarkId}`, { headers });

                const newBookmarks = { ...bookmarkedGames };
                delete newBookmarks[book];
                setBookmarkedGames(newBookmarks);
            }
            // Bookmark (Add to DB)
            else {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/v1/bookmarks`, {
                    title: book,
                    category: categoryContext,
                    isArchiveOrg: false
                }, { headers });

                if (res.data.success) {
                    setBookmarkedGames(prev => ({
                        ...prev,
                        [book]: res.data.data.id
                    }));
                }
            }
        } catch (err) {
            console.error("Bookmark toggle failed:", err);
            // Fallback for optimism in local dev
            const newBookmarks = { ...bookmarkedGames };
            if (newBookmarks[book]) delete newBookmarks[book];
            else newBookmarks[book] = 'temp-id';
            setBookmarkedGames(newBookmarks);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', minHeight: '80vh' }}>

            {/* Header Area */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {level > 1 && (
                        <button onClick={handleBack} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s', color: '#64748b' }}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                    )}
                    <div>
                        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                            <i className="fa-solid fa-book-bookmark" style={{ color: '#3b82f6', marginRight: '15px' }}></i>
                            Bookmark Digital Library
                        </motion.h1>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>
                            {level === 1 ? "Explore thousands of categorized resources and books." :
                                level === 2 ? `Library > ${selectedCategory.title}` :
                                    `Library > ${selectedCategory.title} > ${selectedSubCategory.title}`}
                        </p>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* LEVEL 1: Main Categories */}
                {level === 1 && (
                    <motion.div key="level1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {libraryData.map((cat, i) => (
                            <motion.div key={i} whileHover={{ y: -5, scale: 1.02 }} onClick={() => handleCategoryClick(cat)} className="glass-panel" style={{ background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.5rem', transition: '0.3s' }}>
                                <div style={{ width: '70px', height: '70px', borderRadius: '18px', background: `${cat.color}20`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                                    <i className={`fa-solid ${cat.icon}`}></i>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 5px 0', color: '#0f172a' }}>{cat.title}</h3>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{cat.subs?.length || 0} Sub-categories</p>
                                </div>
                                <i className="fa-solid fa-chevron-right" style={{ marginLeft: 'auto', color: '#cbd5e1' }}></i>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* LEVEL 2: Sub-Categories */}
                {level === 2 && selectedCategory && (
                    <motion.div key="level2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {selectedCategory.subs.map((sub, i) => (
                            <motion.div key={i} whileHover={{ y: -5, scale: 1.02 }} onClick={() => handleSubCategoryClick(sub)} className="glass-panel" style={{ background: 'white', padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: '0.3s' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{sub.title}</h3>
                                <div style={{ background: '#f8fafc', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>
                                    {sub.subjects?.length || 0} Sections
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* LEVEL 3: Subjects & Book Shelves */}
                {level === 3 && selectedSubCategory && (
                    <motion.div key="level3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        {selectedSubCategory.subjects.map((subj, i) => (
                            <div key={i} style={{ marginBottom: '4rem' }}>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                                    <i className="fa-solid fa-swatchbook" style={{ color: '#3b82f6' }}></i> {subj.name}
                                </h2>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
                                    {subj.books.map((book, j) => (
                                        <motion.div key={j} whileHover={{ y: -10 }}
                                            className="hover-3d" style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', transition: '0.3s' }}>
                                            {/* Book Cover Placeholder */}
                                            <div style={{ height: '260px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                                                <h4 style={{ color: 'white', fontSize: '1.1rem', margin: 0, fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{book}</h4>
                                            </div>
                                            {/* Book Details */}
                                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                                                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>{book}</h4>
                                                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                                    <button onClick={() => { if (book === '3D Solar System Experience') navigate('/solarsystem'); else navigate('/book-reader'); }} style={{ flex: 1, padding: '8px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Read</button>
                                                    <button onClick={(e) => { e.stopPropagation(); window.open(`https://archive.org/search.php?query=${encodeURIComponent(book + ' book')}`, '_blank'); }} title="Search on Archive.org" style={{ width: '40px', padding: '8px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '8px', cursor: 'pointer' }}><i className="fa-solid fa-building-columns"></i></button>
                                                    <button onClick={(e) => toggleBookmark(e, book, selectedSubCategory.title)} style={{ width: '40px', padding: '8px', background: bookmarkedGames[book] ? '#3b82f6' : '#f8fafc', color: bookmarkedGames[book] ? 'white' : '#64748b', border: bookmarkedGames[book] ? '1px solid #3b82f6' : '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                                                        <i className={bookmarkedGames[book] ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {selectedSubCategory.subjects.length === 0 && (
                            <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                                <i className="fa-solid fa-folder-open" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>No subjects available in this category yet.</h3>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Resources;
