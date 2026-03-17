import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ACADEMIC_DOMAINS = [
    { name: "Artificial Intelligence", trend: "+95%", color: "#8b5cf6" },
    { name: "Quantum Computing", trend: "+88%", color: "#d946ef" },
    { name: "Cybersecurity", trend: "+92%", color: "#ef4444" },
    { name: "Cloud Architecture", trend: "+85%", color: "#0ea5e9" },
    { name: "Full Stack Development", trend: "+82%", color: "#3b82f6" },
    { name: "Data Science", trend: "+90%", color: "#10b981" },
    { name: "Blockchain & Web3", trend: "+75%", color: "#6366f1" },
    { name: "Machine Learning", trend: "+94%", color: "#8b5cf6" },
    { name: "Embedded Systems", trend: "+65%", color: "#f59e0b" },
    { name: "Internet of Things", trend: "+80%", color: "#06b6d4" },
    { name: "Augmented Reality", trend: "+72%", color: "#f43f5e" },
    { name: "Virtual Reality", trend: "+70%", color: "#ec4899" },
    { name: "Bioinformatics", trend: "+85%", color: "#22c55e" },
    { name: "Robotics Engineering", trend: "+89%", color: "#f97316" },
    { name: "Edge Computing", trend: "+83%", color: "#64748b" },
    { name: "5G & 6G Networks", trend: "+78%", color: "#06b6d4" },
    { name: "Digital Forensics", trend: "+82%", color: "#ef4444" },
    { name: "Ethics in AI", trend: "+98%", color: "#8b5cf6" },
    { name: "Natural Language Processing", trend: "+96%", color: "#8b5cf6" },
    { name: "Computer Vision", trend: "+93%", color: "#8b5cf6" },
    { name: "Game Development", trend: "+68%", color: "#f59e0b" },
    { name: "Mobile App Dev (iOS)", trend: "+75%", color: "#3b82f6" },
    { name: "Mobile App Dev (Android)", trend: "+73%", color: "#3b82f6" },
    { name: "DevOps & SRE", trend: "+87%", color: "#0ea5e9" },
    { name: "Distributed Systems", trend: "+89%", color: "#6366f1" },
    { name: "Microservices", trend: "+81%", color: "#0ea5e9" },
    { name: "Database Engineering", trend: "+70%", color: "#10b981" },
    { name: "GraphQL & Modern APIs", trend: "+79%", color: "#ec4899" },
    { name: "Rust Programming", trend: "+91%", color: "#f97316" },
    { name: "Go Programming", trend: "+84%", color: "#06b6d4" },
    { name: "TypeScript Specialist", trend: "+86%", color: "#3178c6" },
    { name: "React Ecosystem", trend: "+80%", color: "#61dafb" },
    { name: "Next.js & SSR", trend: "+88%", color: "#000000" },
    { name: "Vue.js & Pinia", trend: "+65%", color: "#42b883" },
    { name: "Angular & RXJS", trend: "+62%", color: "#dd0031" },
    { name: "Python for Data", trend: "+92%", color: "#3776ab" },
    { name: "R Statistics", trend: "+55%", color: "#276dc3" },
    { name: "Hadoop & Big Data", trend: "+50%", color: "#ffed00" },
    { name: "Spark & Streaming", trend: "+78%", color: "#e25a1c" },
    { name: "Kafka Architecture", trend: "+85%", color: "#000000" },
    { name: "Elasticsearch Specialist", trend: "+72%", color: "#005571" },
    { name: "Kubernetes Ops", trend: "+90%", color: "#326ce5" },
    { name: "Docker Containerization", trend: "+85%", color: "#2496ed" },
    { name: "Terraform & IaC", trend: "+89%", color: "#7b42bc" },
    { name: "Ansible Automation", trend: "+70%", color: "#ee0000" },
    { name: "Jenkins & CI/CD", trend: "+75%", color: "#d24939" },
    { name: "GitHub Actions", trend: "+84%", color: "#24292e" },
    { name: "Serverless (AWS Lambda)", trend: "+88%", color: "#ff9900" },
    { name: "Azure Cloud Services", trend: "+82%", color: "#0089d6" },
    { name: "GCP Cloud Run", trend: "+81%", color: "#4285f4" },
    { name: "Prometheus Monitoring", trend: "+76%", color: "#e6522c" },
    { name: "Grafana Visualization", trend: "+80%", color: "#f46800" },
    { name: "Splunk Observability", trend: "+74%", color: "#000000" },
    { name: "Penetration Testing", trend: "+88%", color: "#ef4444" },
    { name: "Malware Analysis", trend: "+84%", color: "#ef4444" },
    { name: "SOC Analyst", trend: "+81%", color: "#64748b" },
    { name: "Cloud Security (CCSP)", trend: "+93%", color: "#0ea5e9" },
    { name: "Zero Trust Architecture", trend: "+96%", color: "#10b981" },
    { name: "Identity Management", trend: "+82%", color: "#6366f1" },
    { name: "Cryptography", trend: "+89%", color: "#8b5cf6" },
    { name: "Network Engineering", trend: "+60%", color: "#3b82f6" },
    { name: "SD-WAN Systems", trend: "+72%", color: "#3b82f6" },
    { name: "Wireless Tech", trend: "+55%", color: "#3b82f6" },
    { name: "Satellite Internet (Starlink)", trend: "+87%", color: "#0ea5e9" },
    { name: "Drone Communications", trend: "+79%", color: "#f97316" },
    { name: "Firmware Development", trend: "+70%", color: "#64748b" },
    { name: "VLSI Design", trend: "+75%", color: "#f59e0b" },
    { name: "Hardware Security", trend: "+91%", color: "#ef4444" },
    { name: "Smart Grids", trend: "+82%", color: "#10b981" },
    { name: "Renewable Energy AI", trend: "+94%", color: "#10b981" },
    { name: "FinTech Regulations", trend: "+78%", color: "#6366f1" },
    { name: "InsurTech AI", trend: "+83%", color: "#6366f1" },
    { name: "HealthTech Interoperability", trend: "+89%", color: "#22c55e" },
    { name: "Telemedicine Tech", trend: "+86%", color: "#22c55e" },
    { name: "Precision Agriculture", trend: "+81%", color: "#10b981" },
    { name: "Supply Chain Traceability", trend: "+79%", color: "#64748b" },
    { name: "Logistics Automation", trend: "+82%", color: "#f97316" },
    { name: "EdTech Engineering", trend: "+85%", color: "#8b5cf6" },
    { name: "Self-Driving Algorithms", trend: "+95%", color: "#f97316" },
    { name: "Electric Vehicle Tech", trend: "+92%", color: "#10b981" },
    { name: "SpaceTech Data", trend: "+90%", color: "#0ea5e9" },
    { name: "Computational Chemistry", trend: "+84%", color: "#22c55e" },
    { name: "Synthetic Biology", trend: "+96%", color: "#22c55e" },
    { name: "Crispr Sequencing", trend: "+98%", color: "#22c55e" },
    { name: "Neurotechnology", trend: "+97%", color: "#8b5cf6" },
    { name: "Brain-Computer Interface", trend: "+99%", color: "#8b5cf6" },
    { name: "Deep Tech Entrepreneurship", trend: "+88%", color: "#f59e0b" },
    { name: "Venture Capital Tech", trend: "+75%", color: "#10b981" },
    { name: "SaaS Multi-tenancy", trend: "+80%", color: "#0ea5e9" },
    { name: "Customer Data Platforms", trend: "+72%", color: "#3b82f6" },
    { name: "AdTech Real-time Bidding", trend: "+68%", color: "#ec4899" },
    { name: "HRTech People Analytics", trend: "+76%", color: "#6366f1" },
    { name: "UAV Flight Control", trend: "+84%", color: "#64748b" },
    { name: "Deep Sea Exploration AI", trend: "+89%", color: "#0ea5e9" },
    { name: "Civil Engineering Digital Twin", trend: "+81%", color: "#64748b" },
    { name: "Smart Cities Architecture", trend: "+85%", color: "#10b981" },
    { name: "PropTech Engineering", trend: "+78%", color: "#6366f1" },
    { name: "GovTech Open Data", trend: "+72%", color: "#3b82f6" },
    { name: "LegalTech AI Contracts", trend: "+87%", color: "#64748b" },
    { name: "E-commerce Headless tech", trend: "+81%", color: "#f97316" },
    { name: "Digital Twins (Industrial)", trend: "+90%", color: "#f59e0b" },
    { name: "3D Printing Tech", trend: "+75%", color: "#64748b" },
    { name: "Sustainable Manufacturing", trend: "+82%", color: "#10b981" },
    { name: "Lean Startup Tech", trend: "+65%", color: "#f59e0b" },
    { name: "Growth Hacking Tools", trend: "+70%", color: "#ec4899" },
    { name: "Product Management (Tech)", trend: "+85%", color: "#6366f1" },
    { name: "System Design for Scale", trend: "+93%", color: "#6366f1" },
    { name: "Algorithm Trading", trend: "+91%", color: "#10b981" },
    { name: "High-Frequency Tech", trend: "+94%", color: "#8b5cf6" },
    { name: "DeFi Protocols", trend: "+82%", color: "#6366f1" },
    { name: "Metabolism AI", trend: "+86%", color: "#22c55e" },
    { name: "Microbiome Data", trend: "+88%", color: "#22c55e" },
    { name: "Drug Discovery AI", trend: "+96%", color: "#22c55e" },
    { name: "Clinical Trial Tech", trend: "+84%", color: "#22c55e" },
    { name: "Wearable Tech (Health)", trend: "+90%", color: "#ec4899" },
    { name: "Gamified Learning Tech", trend: "+80%", color: "#8b5cf6" },
    { name: "Online Safety Platforms", trend: "+87%", color: "#ef4444" },
    { name: "Content Moderation AI", trend: "+92%", color: "#ef4444" },
    { name: "Web Accessibility (A11y)", trend: "+95%", color: "#6366f1" },
    { name: "Design Systems (Figma/Code)", trend: "+88%", color: "#ec4899" },
    { name: "Animation Libraries", trend: "+72%", color: "#ec4899" },
    { name: "Vector Databases (Pinecone)", trend: "+98%", color: "#8b5cf6" },
    { name: "LangChain & LLM Apps", trend: "+99%", color: "#8b5cf6" },
    { name: "AI Agents Architecture", trend: "+99%", color: "#8b5cf6" },
    { name: "Autonomous Workflows", trend: "+97%", color: "#6366f1" },
    { name: "No-Code Platform Engineering", trend: "+81%", color: "#f59e0b" },
    { name: "Low-Code Enterprise Integration", trend: "+78%", color: "#f59e0b" },
    { name: "Open Source Sustainability", trend: "+85%", color: "#10b981" },
    { name: "Data Privacy (GDPR/CCPA Tech)", trend: "+92%", color: "#ef4444" },
    { name: "Personal Data Vaults", trend: "+88%", color: "#6366f1" },
    { name: "Cloud Native Databases", trend: "+89%", color: "#10b981" },
    { name: "Post-Quantum Cryptography", trend: "+94%", color: "#ef4444" },
    { name: "Secure Multi-party Computation", trend: "+91%", color: "#8b5cf6" },
    { name: "Homomorphic Encryption", trend: "+93%", color: "#8b5cf6" },
    { name: "AI Observability", trend: "+95%", color: "#0ea5e9" },
    { name: "LLM Fine-tuning", trend: "+97%", color: "#8b5cf6" },
    { name: "Prompt Engineering Specialist", trend: "+90%", color: "#6366f1" },
    { name: "Synthetic Data Generation", trend: "+93%", color: "#10b981" },
    { name: "Automated Data Labeling", trend: "+86%", color: "#3b82f6" },
    { name: "MLOps Lifecycle", trend: "+94%", color: "#8b5cf6" },
    { name: "Feature Stores", trend: "+88%", color: "#10b981" },
    { name: "Data Mesh & Fabric", trend: "+85%", color: "#6366f1" },
    { name: "Graph Neural Networks", trend: "+91%", color: "#8b5cf6" },
    { name: "Diffusion Models", trend: "+96%", color: "#ec4899" },
    { name: "Transformer Architectures", trend: "+98%", color: "#8b5cf6" },
    { name: "Small Language Models (SLM)", trend: "+95%", color: "#0ea5e9" },
    { name: "On-device AI", trend: "+94%", color: "#f97316" },
    { name: "AI Hardware Acceleration", trend: "+96%", color: "#f59e0b" },
    { name: "Carbon Tracking Software", trend: "+92%", color: "#10b981" },
    { name: "Circular Economy Tech", trend: "+88%", color: "#10b981" },
    { name: "Water Tech (HydroTech)", trend: "+85%", color: "#0ea5e9" },
    { name: "Climate Modeling Data", trend: "+93%", color: "#3b82f6" },
    { name: "Biodiversity Monitoring AI", trend: "+91%", color: "#22c55e" }
];

const Labs = ({ setActiveTab }) => {
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ domain: '', difficulty: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchLabs = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filter).toString();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/labs?${query}`);
            const data = await res.json();
            if (data.success) {
                setLabs(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch labs", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLabs();
    }, [filter]);

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Beginner': return '#10b981';
            case 'Intermediate': return '#f59e0b';
            case 'Advanced': return '#ef4444';
            default: return '#6366f1';
        }
    };

    const filteredDomainsList = ACADEMIC_DOMAINS.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                        <i className="fa-solid fa-microscope" style={{ color: '#06b6d4', marginRight: '15px' }}></i>
                        SKILL LABS
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 600 }}>
                        <i className="fa-solid fa-chart-line" style={{ color: '#10b981', marginRight: '8px' }}></i>
                        PREDICTIVE MARKET TRENDS: Exploring 150+ Future-Ready Domains
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ background: '#f1f5f9', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fa-solid fa-bolt" style={{ color: '#06b6d4' }}></i>
                        <span style={{ fontWeight: 800 }}>{ACADEMIC_DOMAINS.length} Domains Enabled</span>
                    </div>
                </div>
            </div>

            {/* DOMAIN HUB - 150 DOMAINS */}
            <div style={{ background: 'white', borderRadius: '30px', padding: '2rem', border: '1px solid #e2e8f0', marginBottom: '3rem', boxShadow: '0 20px 50px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b' }}>
                        <i className="fa-solid fa-layer-group" style={{ color: '#6366f1', marginRight: '10px' }}></i>
                        Choose Domain
                    </h2>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <i className="fa-solid fa-search" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                        <input 
                            type="text" 
                            placeholder="Search among 150 domains..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '12px 15px 12px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setFilter({ ...filter, domain: '' })}
                        style={{
                            padding: '1.5rem', borderRadius: '20px', border: 'none',
                            background: filter.domain === '' ? '#0f172a' : '#f1f5f9',
                            color: filter.domain === '' ? 'white' : '#64748b',
                            textAlign: 'left', cursor: 'pointer', transition: '0.2s', position: 'relative'
                        }}
                    >
                        <div style={{ fontWeight: 900, fontSize: '1rem' }}>Show All Labs</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Unified Explorer</div>
                    </motion.button>

                    {filteredDomainsList.map((d, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ y: -4, background: filter.domain === d.name ? d.color : 'white', color: filter.domain === d.name ? 'white' : '#1e293b' }}
                            onClick={() => setFilter({ ...filter, domain: d.name })}
                            style={{
                                padding: '1.25rem', borderRadius: '20px', border: `1px solid ${filter.domain === d.name ? d.color : '#e2e8f0'}`,
                                background: filter.domain === d.name ? d.color : 'white',
                                color: filter.domain === d.name ? 'white' : '#1e293b',
                                textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s ease',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <span style={{ 
                                    background: filter.domain === d.name ? 'rgba(255,255,255,0.2)' : `${d.color}15`,
                                    color: filter.domain === d.name ? 'white' : d.color,
                                    padding: '4px 8px', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 900
                                }}>{d.trend} TREND</span>
                            </div>
                            <div style={{ fontWeight: 800, fontSize: '0.85rem', lineHeight: 1.2 }}>{d.name}</div>
                        </motion.button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                    {filter.domain ? `Active Labs in ${filter.domain}` : 'All Interactive Simulations'}
                </h3>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '10rem' }}>
                    <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '3rem', color: '#06b6d4' }}></i>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {labs.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                            <i className="fa-solid fa-flask" style={{ fontSize: '3rem', color: '#94a3b8', marginBottom: '1.5rem' }}></i>
                            <h3 style={{ color: '#1e293b', fontSize: '1.2rem' }}>No dynamic labs found for "{filter.domain || 'All'}"</h3>
                            <p style={{ color: '#64748b' }}>Try rotating to another department or checking High-Trend areas.</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {labs.map((lab, index) => (
                                <motion.div
                                    key={lab.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    onClick={() => navigate(`/labs/${lab.id}`)}
                                    style={{
                                        background: 'white',
                                        borderRadius: '24px',
                                        padding: '2rem',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        padding: '10px 20px',
                                        background: getDifficultyColor(lab.difficulty),
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                        borderRadius: '0 0 0 20px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {lab.difficulty}
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '12px',
                                            background: '#f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem',
                                            color: '#06b6d4',
                                            marginBottom: '1rem'
                                        }}>
                                            <i className="fa-solid fa-code"></i>
                                        </div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
                                            {lab.title}
                                        </h3>
                                        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem', height: '3rem', overflow: 'hidden' }}>
                                            {lab.description}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 700 }}>
                                            <i className="fa-solid fa-bolt" style={{ color: '#f59e0b', marginRight: '5px' }}></i>
                                            {lab.xpReward} XP
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
                                            ROOM #{lab.roomNumber}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                                        <button style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: '#06b6d4',
                                            color: 'white',
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            transition: '0.2s'
                                        }}>
                                            ENTER LAB
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            )}
        </div>
    );
};

export default Labs;
