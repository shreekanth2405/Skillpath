import React from 'react';

const Footer = () => {
    const footerBlocks = [
        { title: 'Platform', links: ['Dashboard', 'AI Courses', 'Career Tracker', 'Games Hub'] },
        { title: 'Resources', links: ['Documentation', 'API Access', 'Knowledge Base', 'Community'] },
        { title: 'Company', links: ['About Us', 'Careers', 'Contact', 'Press'] },
        { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Security', 'Compliance'] }
    ];

    return (
        <footer style={{ background: 'white', borderTop: '1px solid #e2e8f0', padding: '80px 2rem 40px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>

                    {/* Brand Column */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>
                                <i className="fa-solid fa-brain"></i>
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.1 }}>Skill Path AI</h2>
                            </div>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '300px' }}>
                            Building the global standard for AI-assisted technical education and career acceleration.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: '0.2s' }}><i className="fa-brands fa-twitter"></i></a>
                            <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: '0.2s' }}><i className="fa-brands fa-github"></i></a>
                            <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: '0.2s' }}><i className="fa-brands fa-linkedin-in"></i></a>
                            <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: '0.2s' }}><i className="fa-brands fa-discord"></i></a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    {footerBlocks.map((block, i) => (
                        <div key={i}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>{block.title}</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {block.links.map((link, j) => (
                                    <li key={j}>
                                        <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem', transition: '0.2s', fontWeight: 500 }} onMouseOver={e => e.target.style.color = '#3b82f6'} onMouseOut={e => e.target.style.color = '#64748b'}>{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div style={{ paddingTop: '2rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>
                    <p>© 2026 Skill Path AI. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <span>New York, NY</span>
                        <span>hello@skillpath.ai</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
