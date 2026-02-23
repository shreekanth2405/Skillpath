import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CareerAlerts = () => {
    const [expandedIds, setExpandedIds] = useState([]);

    const toggleExpand = (id) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const decliningCareers = [
        {
            id: 1,
            title: 'Manual Data Entry Clerk',
            decline: '-42%',
            risk: 'High',
            reason: 'High automation potential through LLM-based OCR and data processing agents.',
            upskill: 'Focus on Data Analytics & AI Orchestration.',
            details: 'The adoption of autonomous agents has reduced the need for manual validation by 60% in the last 18 months.'
        },
        {
            id: 2,
            title: 'Junior Copywriter',
            decline: '-28%',
            risk: 'Moderate',
            reason: 'Content generation is being heavily handled by generative AI tools.',
            upskill: 'Focus on AI Content Strategy & Brand Storytelling.',
            details: 'Entry-level creative writing roles are shifting towards "AI Editor" positions where human oversight is the primary value.'
        },
        {
            id: 3,
            title: 'Basic Tech Support',
            decline: '-15%',
            risk: 'Low',
            reason: 'Self-correcting code and AI chatbots are resolving tier-1 issues instantly.',
            upskill: 'Focus on Cloud Infrastructure & SRE (Site Reliability Engineering).',
            details: 'Standard troubleshooting is now automated, moving the human element into complex multi-system architectural support.'
        },
        {
            id: 4,
            title: 'Administrative Assistant',
            decline: '-22%',
            risk: 'Moderate',
            reason: 'AI scheduling and email management tools are maturing rapidly.',
            upskill: 'Focus on Executive Operations & Strategic Management.',
            details: 'Legacy admin tasks are being phased out in favor of system management and executive level strategy support.'
        }
    ];

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'High': return '#ef4444';
            case 'Moderate': return '#f59e0b';
            case 'Low': return '#64748b';
            default: return '#64748b';
        }
    };

    return (
        <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Header Card */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '2rem', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '1.5rem' }}>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{ width: '60px', height: '60px', background: '#fee2e2', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}
                        >
                            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '1.8rem' }}></i>
                        </motion.div>
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Skill Path AI Career Risk Alerts</h1>
                            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.95rem' }}>Labor market shifts detected via AI sentiment analysis</p>
                        </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '16px', borderLeft: '4px solid #ef4444', color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        <b style={{ color: '#0f172a' }}>AI Insight:</b> The following career paths are showing a significant downward trend in demand. We recommend reviewing these shifts and planning upskill trajectories accordingly.
                    </div>
                </div>

                {/* Careers List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {decliningCareers.map((career) => (
                        <div key={career.id} style={{ background: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                            <div
                                onClick={() => toggleExpand(career.id)}
                                style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ color: '#ef4444', fontSize: '1.2rem' }}>
                                        <i className="fa-solid fa-arrow-trend-down"></i>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{career.title}</div>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                                            <span style={{ color: '#ef4444', fontWeight: 900, fontSize: '0.85rem' }}>{career.decline} Decline</span>
                                            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>•</span>
                                            <span style={{ color: getRiskColor(career.risk), fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>{career.risk} Risk</span>
                                        </div>
                                    </div>
                                </div>
                                <i className={`fa-solid fa-chevron-${expandedIds.includes(career.id) ? 'up' : 'down'}`} style={{ color: '#cbd5e1' }}></i>
                            </div>

                            <AnimatePresence>
                                {expandedIds.includes(career.id) && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid #f8fafc' }}>
                                            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>DEEP REASONING</div>
                                                    <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>{career.reason}</p>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6', marginBottom: '8px', textTransform: 'uppercase' }}>STRATEGIC UPSKILLING</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#eff6ff', padding: '10px', borderRadius: '12px', color: '#1d4ed8', fontSize: '0.85rem', fontWeight: 700 }}>
                                                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                                                        {career.upskill}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: '#fdf2f2', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', marginBottom: '5px' }}>LABOR MARKET DATA</div>
                                                <p style={{ fontSize: '0.85rem', color: '#7f1d1d', margin: 0 }}>{career.details}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Disclaimer */}
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', marginTop: '3rem', padding: '0 2rem' }}>
                    Disclaimer: These alerts are based on current market trends and automation velocity. "Declining" refers to job volume decrease, not total obsolescence. Always verify with specific regional industry leaders.
                </p>
            </div>
        </div>
    );
};

export default CareerAlerts;
