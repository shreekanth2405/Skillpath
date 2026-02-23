import React from 'react';
import { motion } from 'framer-motion';

const TrendingSection = () => {
    const trendingData = [
        {
            id: 1,
            topic: "Generative AI in DevOps",
            tag: "AI",
            likes: "4.2k",
            comments: "850",
            growth: "+24%",
            isIndustryHot: true,
            color: "#3b82f6"
        },
        {
            id: 2,
            topic: "Rust for Systems Design",
            tag: "Systems",
            likes: "2.8k",
            comments: "420",
            growth: "+18%",
            isIndustryHot: false,
            color: "#ef4444"
        },
        {
            id: 3,
            topic: "Next.js 15 Server Actions",
            tag: "Frontend",
            likes: "3.5k",
            comments: "630",
            growth: "+32%",
            isIndustryHot: true,
            color: "#000000"
        },
        {
            id: 4,
            topic: "Web3 Security Patterns",
            tag: "Blockchain",
            likes: "1.9k",
            comments: "210",
            growth: "+12%",
            isIndustryHot: false,
            color: "#8b5cf6"
        },
        {
            id: 5,
            topic: "Tailwind CSS v4 Alpha",
            tag: "Design",
            likes: "5.1k",
            comments: "1.2k",
            growth: "+45%",
            isIndustryHot: true,
            color: "#0ea5e9"
        }
    ];

    return (
        <div style={{ padding: '2rem', background: '#020617', minHeight: '100vh', color: 'white', fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ maxWidth: '450px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: '1.5rem', boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)' }}>
                        <i className="fa-solid fa-fire"></i>
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>SKILL PATH AI TRENDING PULSE</h1>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Real-time global developer activity</p>
                    </div>
                </div>

                {/* Trending List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {trendingData.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, x: 10 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '20px',
                                padding: '1.5rem',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}
                        >
                            {/* Accent Line */}
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: item.color }}></div>

                            {/* Top Row: AI Badge & Growth */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {item.isIndustryHot ? (
                                    <div style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <i className="fa-solid fa-wand-magic-sparkles"></i> HOT IN YOUR INDUSTRY
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>COMMUNITY PICK</div>
                                )}
                                <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <i className="fa-solid fa-arrow-trend-up"></i> {item.growth}
                                </div>
                            </div>

                            {/* Topic Title */}
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#f8fafc', lineHeight: 1.4 }}>
                                {item.topic}
                            </h3>

                            {/* Bottom Row: Stats & Tag */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                                <div style={{ display: 'flex', gap: '15px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                                    <span><i className="fa-regular fa-heart" style={{ marginRight: '5px' }}></i> {item.likes}</span>
                                    <span><i className="fa-regular fa-comment" style={{ marginRight: '5px' }}></i> {item.comments}</span>
                                </div>
                                <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    #{item.tag}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Insight */}
                <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '20px', border: '1px dashed rgba(59, 130, 246, 0.2)', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, lineHeight: 1.6 }}>
                        <i className="fa-solid fa-robot" style={{ color: '#60a5fa', marginRight: '8px' }}></i>
                        AI predicts a <b style={{ color: '#fff' }}>42% increase</b> in discussions regarding <b style={{ color: '#fff' }}>Distributed Systems</b> next week.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrendingSection;
