import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const Landing = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        { icon: 'fa-brain', title: 'Generative Curriculums', desc: 'AI builds personalized learning paths based on your exact career goals.' },
        { icon: 'fa-user-tie', title: 'AI Mock Interviews', desc: 'Practice technical interviews with our intelligent voice-enabled recruiter.' },
        { icon: 'fa-file-invoice', title: 'ATS Resume Builder', desc: 'Generate industry-standard resumes that bypass automated filters.' }
    ];

    const marketplacePreviws = [
        { icon: 'fa-gamepad', title: 'Escape AI Games', color: '#8b5cf6', link: '/login' },
        { icon: 'fa-code-merge', title: 'Code Reviewer', color: '#10b981', link: '/login' },
        { icon: 'fa-map-location-dot', title: 'Job Tracker', color: '#f59e0b', link: '/login' },
        { icon: 'fa-language', title: 'Language Tutor', color: '#3b82f6', link: '/login' }
    ];

    const faqs = [
        { q: 'Is Skill Path AI free?', a: 'Yes, our core AI tools and basic learning paths are entirely free. We offer premium tiers for extensive API usage.' },
        { q: 'Do I need coding experience?', a: 'Not at all. The AI adapts to your current level, whether you are a beginner or a senior developer.' },
        { q: 'How does the Developer Login work?', a: 'It is a one-click bypass system designed for evaluators to instantly access the dashboard without credentials.' }
    ];

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a', overflowX: 'hidden' }}>
            <PublicNavbar scrolled={scrolled} />

            {/* HERO SECTION */}
            <section style={{ position: 'relative', overflow: 'hidden', paddingTop: '150px', paddingBottom: '100px' }}>
                {/* Background Particles Container */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none' }}>
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            background: '#3b82f6',
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 4 + 4}s`
                        }}></div>
                    ))}
                </div>

                <div style={{ position: 'relative', zIndex: 1, paddingLeft: '2rem', paddingRight: '2rem', maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4rem', minHeight: '80vh' }}>
                    <div style={{ flex: 1, maxWidth: '600px' }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: 'full', fontWeight: 800, fontSize: '0.85rem', marginBottom: '1.5rem', borderRadius: '999px' }}>
                                <i className="fa-solid fa-sparkles"></i> THE FUTURE OF LEARNING
                            </div>
                            <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', color: '#0f172a', letterSpacing: '-1px' }}>
                                Master Any Skill <br />
                                <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Powered By AI</span>
                            </h1>
                            <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                                An intelligent platform that watches how you learn, adapts to your pacing, and mathematically guarantees your career progression.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => navigate('/register')} className="hover-3d btn-glow" style={{ background: '#0f172a', color: 'white', padding: '1.2rem 2.5rem', borderRadius: '14px', border: 'none', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    Get Started <i className="fa-solid fa-arrow-right"></i>
                                </button>
                                <button onClick={() => navigate('/login')} className="hover-3d" style={{ background: 'white', color: '#0f172a', padding: '1.2rem 2.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fa-solid fa-code"></i> Developer Demo
                                </button>
                            </div>
                        </motion.div>
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            style={{ position: 'relative', zIndex: 2 }}
                        >
                            <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" alt="AI Core" className="tilt-float-img" style={{ width: '100%', borderRadius: '30px', boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)' }} />

                            {/* Floating UI Card 1 */}
                            <motion.div
                                className="glass-panel hover-3d"
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                style={{ position: 'absolute', top: '10%', right: '-5%', padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.95)' }}
                            >
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}><i className="fa-solid fa-check"></i></div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Analysis</span>
                                    <span style={{ display: 'block', fontSize: '1.1rem', color: '#0f172a', fontWeight: 900 }}>98.5% Mastery</span>
                                </div>
                            </motion.div>

                            {/* Floating UI Card 2 */}
                            <motion.div
                                className="glass-panel hover-3d"
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                                style={{ position: 'absolute', bottom: '15%', left: '-10%', padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.95)' }}
                            >
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #c084fc)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(139,92,246,0.3)' }}><i className="fa-solid fa-bolt"></i></div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Processing</span>
                                    <span style={{ display: 'block', fontSize: '1.1rem', color: '#0f172a', fontWeight: 900 }}>45ms Latency</span>
                                </div>
                            </motion.div>

                        </motion.div>
                    </div>
                </div>
            </section>

            {/* AI FEATURES SECTION */}
            <section style={{ padding: '100px 2rem', background: 'white', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a' }}>Intelligence Inside.</h2>
                        <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '1rem auto 0' }}>We don't just provide courses. We actively monitor your coding context to deliver exact knowledge precisely when you need it.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                        {features.map((feat, i) => (
                            <motion.div key={i} whileHover={{ y: -10 }} style={{ background: '#f8fafc', padding: '3rem', borderRadius: '24px', border: '1px solid #e2e8f0' }} className="hover-3d">
                                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'white', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <i className={`fa-solid ${feat.icon}`}></i>
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>{feat.title}</h3>
                                <p style={{ color: '#64748b', lineHeight: 1.6 }}>{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MARKETPLACE PREVIEW */}
            <section style={{ padding: '100px 2rem', background: '#f8fafc' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '3rem' }}>Explore the Ecosystem</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        {marketplacePreviws.map((item, i) => (
                            <div key={i} className="hover-3d glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <i className={`fa-solid ${item.icon}`} style={{ fontSize: '3rem', color: item.color }}></i>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{item.title}</h3>
                                <button onClick={() => navigate(item.link)} style={{ marginTop: 'auto', background: 'transparent', border: '1px solid #e2e8f0', padding: '0.8rem 1.5rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>View Module</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section style={{ padding: '120px 2rem', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', textAlign: 'center' }}>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Start Building Your Future.</h2>
                <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 3rem' }}>Join the fastest growing platform of AI-powered engineers.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/register')} className="hover-3d" style={{ background: '#3b82f6', color: 'white', padding: '1.2rem 3rem', borderRadius: '14px', border: 'none', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer' }}>
                        Create Free Account
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;
