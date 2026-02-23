import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BookReader = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('light');
    const [zoom, setZoom] = useState(100);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

    const isDark = theme === 'dark';

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100vh',
            background: isDark ? '#0f172a' : '#f8fafc',
            color: isDark ? '#f8fafc' : '#0f172a',
            transition: 'all 0.3s ease'
        }}>
            {/* Header Toolbar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 2rem', background: isDark ? '#1e293b' : 'white',
                borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/resources')} style={{
                        background: 'transparent', border: 'none', color: isDark ? '#cbd5e1' : '#64748b', cursor: 'pointer', fontSize: '1.2rem'
                    }}><i className="fa-solid fa-arrow-left"></i></button>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800 }}>Data Structures & Algorithms in Java</h2>
                        <span style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b' }}>By Robert Lafore • Computer Science</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: isDark ? '#334155' : '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
                        <button onClick={handleZoomOut} style={{ background: 'transparent', border: 'none', padding: '6px 10px', color: isDark ? 'white' : 'black', cursor: 'pointer' }}><i className="fa-solid fa-minus"></i></button>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '45px', textAlign: 'center' }}>{zoom}%</span>
                        <button onClick={handleZoomIn} style={{ background: 'transparent', border: 'none', padding: '6px 10px', color: isDark ? 'white' : 'black', cursor: 'pointer' }}><i className="fa-solid fa-plus"></i></button>
                    </div>

                    <button onClick={toggleTheme} style={{
                        background: isDark ? '#334155' : '#f1f5f9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', color: isDark ? '#fbf8cc' : '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
                    </button>
                </div>
            </div>

            {/* Reader Area */}
            <div style={{ flex: 1, padding: '2rem', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                        width: '100%', height: '100%', maxWidth: '1000px', transform: `scale(${zoom / 100})`, transformOrigin: 'top center',
                        background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
                    }}
                >
                    {/* Embedded PDF Viewer Placeholder - 
                        In production, replace this with an actual PDF URL or react-pdf component. 
                        We use iframe to render a sample document natively. */}
                    <iframe
                        src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf#toolbar=0&navpanes=0&scrollbar=0"
                        title="Book Reader"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                    ></iframe>
                </motion.div>
            </div>

            {/* Footer Navigation */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem',
                padding: '1rem', background: isDark ? '#1e293b' : 'white',
                borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
            }}>
                <button style={{ background: 'transparent', border: 'none', color: isDark ? '#cbd5e1' : '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}><i className="fa-solid fa-chevron-left"></i></button>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Page 1 of 432</div>
                <button style={{ background: 'transparent', border: 'none', color: isDark ? '#cbd5e1' : '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
        </div>
    );
};

export default BookReader;
