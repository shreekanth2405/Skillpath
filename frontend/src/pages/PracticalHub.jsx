import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Domain Data ───
const domains = [
    {
        id: 'webdev',
        name: 'Web Development',
        icon: 'fa-globe',
        gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        color: '#3b82f6',
        description: 'Build modern, responsive web applications',
        stats: { labs: 42, projects: 18, users: '12.5k' },
        labs: [
            { id: 1, title: 'Build a React Dashboard', difficulty: 'Intermediate', xp: 500, duration: '2h', tech: ['React', 'CSS', 'Chart.js'], completion: 72, status: 'popular' },
            { id: 2, title: 'REST API with Express & Prisma', difficulty: 'Advanced', xp: 750, duration: '3h', tech: ['Node.js', 'Express', 'PostgreSQL'], completion: 45, status: 'new' },
            { id: 3, title: 'Responsive Landing Page', difficulty: 'Beginner', xp: 200, duration: '1h', tech: ['HTML', 'CSS', 'JS'], completion: 91, status: 'hot' },
            { id: 4, title: 'Full-Stack Auth System', difficulty: 'Advanced', xp: 800, duration: '4h', tech: ['JWT', 'bcrypt', 'React'], completion: 34, status: 'new' },
            { id: 5, title: 'Next.js E-Commerce Store', difficulty: 'Expert', xp: 1200, duration: '6h', tech: ['Next.js', 'Stripe', 'Tailwind'], completion: 18, status: 'featured' },
            { id: 6, title: 'CSS Grid & Flexbox Mastery', difficulty: 'Beginner', xp: 150, duration: '45m', tech: ['CSS', 'HTML'], completion: 88, status: 'popular' },
        ]
    },
    {
        id: 'aiml',
        name: 'AI & Machine Learning',
        icon: 'fa-brain',
        gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
        color: '#8b5cf6',
        description: 'Train models and build intelligent systems',
        stats: { labs: 35, projects: 15, users: '9.8k' },
        labs: [
            { id: 1, title: 'Build a Sentiment Analyzer', difficulty: 'Intermediate', xp: 600, duration: '2.5h', tech: ['Python', 'NLTK', 'Flask'], completion: 58, status: 'popular' },
            { id: 2, title: 'Image Classification with CNN', difficulty: 'Advanced', xp: 900, duration: '4h', tech: ['TensorFlow', 'Keras', 'Python'], completion: 32, status: 'featured' },
            { id: 3, title: 'Chatbot with LangChain', difficulty: 'Advanced', xp: 850, duration: '3.5h', tech: ['LangChain', 'OpenAI', 'Python'], completion: 41, status: 'hot' },
            { id: 4, title: 'Linear Regression from Scratch', difficulty: 'Beginner', xp: 250, duration: '1.5h', tech: ['Python', 'NumPy'], completion: 85, status: 'popular' },
            { id: 5, title: 'RAG Pipeline with Vector DB', difficulty: 'Expert', xp: 1100, duration: '5h', tech: ['Pinecone', 'LangChain', 'GPT-4'], completion: 15, status: 'new' },
            { id: 6, title: 'Object Detection with YOLO', difficulty: 'Advanced', xp: 950, duration: '4h', tech: ['YOLO', 'OpenCV', 'Python'], completion: 28, status: 'new' },
        ]
    },
    {
        id: 'datascience',
        name: 'Data Science',
        icon: 'fa-chart-line',
        gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
        color: '#10b981',
        description: 'Analyze data and create powerful visualizations',
        stats: { labs: 38, projects: 20, users: '11.2k' },
        labs: [
            { id: 1, title: 'Exploratory Data Analysis', difficulty: 'Beginner', xp: 300, duration: '2h', tech: ['Pandas', 'Matplotlib', 'Python'], completion: 82, status: 'popular' },
            { id: 2, title: 'Sales Prediction Model', difficulty: 'Intermediate', xp: 550, duration: '3h', tech: ['Scikit-learn', 'Pandas', 'Seaborn'], completion: 55, status: 'hot' },
            { id: 3, title: 'Dashboard with Streamlit', difficulty: 'Intermediate', xp: 500, duration: '2.5h', tech: ['Streamlit', 'Plotly', 'Python'], completion: 63, status: 'featured' },
            { id: 4, title: 'Web Scraping Pipeline', difficulty: 'Intermediate', xp: 450, duration: '2h', tech: ['BeautifulSoup', 'Selenium', 'Python'], completion: 70, status: 'popular' },
            { id: 5, title: 'Time Series Forecasting', difficulty: 'Advanced', xp: 800, duration: '4h', tech: ['Prophet', 'ARIMA', 'Python'], completion: 30, status: 'new' },
            { id: 6, title: 'Big Data with PySpark', difficulty: 'Expert', xp: 1000, duration: '5h', tech: ['PySpark', 'Hadoop', 'SQL'], completion: 20, status: 'new' },
        ]
    },
    {
        id: 'cybersecurity',
        name: 'Cybersecurity',
        icon: 'fa-shield-halved',
        gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
        color: '#ef4444',
        description: 'Defend systems and learn ethical hacking',
        stats: { labs: 30, projects: 12, users: '7.3k' },
        labs: [
            { id: 1, title: 'XSS Attack & Prevention', difficulty: 'Intermediate', xp: 600, duration: '2h', tech: ['JavaScript', 'HTML', 'Security'], completion: 65, status: 'hot' },
            { id: 2, title: 'SQL Injection Lab', difficulty: 'Beginner', xp: 350, duration: '1.5h', tech: ['SQL', 'Python', 'Security'], completion: 78, status: 'popular' },
            { id: 3, title: 'Network Packet Analysis', difficulty: 'Advanced', xp: 800, duration: '3h', tech: ['Wireshark', 'TCP/IP', 'Linux'], completion: 35, status: 'featured' },
            { id: 4, title: 'Password Cracking & Hashing', difficulty: 'Intermediate', xp: 500, duration: '2h', tech: ['bcrypt', 'hashcat', 'Python'], completion: 55, status: 'popular' },
            { id: 5, title: 'Capture The Flag Challenge', difficulty: 'Advanced', xp: 900, duration: '4h', tech: ['CTF', 'Linux', 'Crypto'], completion: 25, status: 'hot' },
            { id: 6, title: 'Reverse Engineering Binaries', difficulty: 'Expert', xp: 1200, duration: '6h', tech: ['Ghidra', 'Assembly', 'C'], completion: 12, status: 'new' },
        ]
    },
    {
        id: 'cloud',
        name: 'Cloud & DevOps',
        icon: 'fa-cloud',
        gradient: 'linear-gradient(135deg, #f59e0b, #eab308)',
        color: '#f59e0b',
        description: 'Deploy, scale, and automate infrastructure',
        stats: { labs: 28, projects: 14, users: '8.1k' },
        labs: [
            { id: 1, title: 'Docker Container Basics', difficulty: 'Beginner', xp: 300, duration: '1.5h', tech: ['Docker', 'Linux', 'CLI'], completion: 80, status: 'popular' },
            { id: 2, title: 'CI/CD with GitHub Actions', difficulty: 'Intermediate', xp: 550, duration: '2.5h', tech: ['GitHub Actions', 'YAML', 'Node.js'], completion: 60, status: 'hot' },
            { id: 3, title: 'Deploy to AWS EC2', difficulty: 'Intermediate', xp: 600, duration: '2h', tech: ['AWS', 'SSH', 'Nginx'], completion: 50, status: 'featured' },
            { id: 4, title: 'Kubernetes Orchestration', difficulty: 'Advanced', xp: 900, duration: '4h', tech: ['K8s', 'Docker', 'Helm'], completion: 28, status: 'new' },
            { id: 5, title: 'Infrastructure as Code', difficulty: 'Advanced', xp: 800, duration: '3.5h', tech: ['Terraform', 'AWS', 'HCL'], completion: 32, status: 'new' },
            { id: 6, title: 'Monitoring with Grafana', difficulty: 'Intermediate', xp: 500, duration: '2h', tech: ['Grafana', 'Prometheus', 'Docker'], completion: 45, status: 'popular' },
        ]
    },
    {
        id: 'mobile',
        name: 'Mobile Development',
        icon: 'fa-mobile-screen-button',
        gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
        color: '#06b6d4',
        description: 'Build native & cross-platform mobile apps',
        stats: { labs: 25, projects: 10, users: '6.5k' },
        labs: [
            { id: 1, title: 'React Native Todo App', difficulty: 'Beginner', xp: 300, duration: '2h', tech: ['React Native', 'Expo', 'JS'], completion: 75, status: 'popular' },
            { id: 2, title: 'Flutter Weather App', difficulty: 'Intermediate', xp: 500, duration: '3h', tech: ['Flutter', 'Dart', 'API'], completion: 55, status: 'hot' },
            { id: 3, title: 'SwiftUI Instagram Clone', difficulty: 'Advanced', xp: 850, duration: '5h', tech: ['SwiftUI', 'Firebase', 'iOS'], completion: 22, status: 'featured' },
            { id: 4, title: 'Kotlin Chat App', difficulty: 'Advanced', xp: 800, duration: '4h', tech: ['Kotlin', 'Firebase', 'Android'], completion: 30, status: 'new' },
            { id: 5, title: 'Push Notifications System', difficulty: 'Intermediate', xp: 450, duration: '2h', tech: ['FCM', 'React Native', 'Node.js'], completion: 48, status: 'popular' },
            { id: 6, title: 'Offline-First App with SQLite', difficulty: 'Intermediate', xp: 550, duration: '2.5h', tech: ['SQLite', 'React Native', 'Redux'], completion: 40, status: 'new' },
        ]
    },
    {
        id: 'blockchain',
        name: 'Blockchain & Web3',
        icon: 'fa-link',
        gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
        color: '#6366f1',
        description: 'Build decentralized applications & smart contracts',
        stats: { labs: 20, projects: 8, users: '4.2k' },
        labs: [
            { id: 1, title: 'Solidity Smart Contracts', difficulty: 'Intermediate', xp: 600, duration: '3h', tech: ['Solidity', 'Hardhat', 'Ethereum'], completion: 50, status: 'popular' },
            { id: 2, title: 'NFT Marketplace dApp', difficulty: 'Advanced', xp: 1000, duration: '5h', tech: ['React', 'ethers.js', 'IPFS'], completion: 25, status: 'featured' },
            { id: 3, title: 'DeFi Token Swap', difficulty: 'Expert', xp: 1200, duration: '6h', tech: ['Uniswap', 'Solidity', 'Web3'], completion: 15, status: 'hot' },
            { id: 4, title: 'Wallet Integration', difficulty: 'Beginner', xp: 250, duration: '1.5h', tech: ['MetaMask', 'ethers.js', 'React'], completion: 70, status: 'popular' },
            { id: 5, title: 'DAO Governance System', difficulty: 'Advanced', xp: 900, duration: '4h', tech: ['Solidity', 'OpenZeppelin', 'React'], completion: 18, status: 'new' },
            { id: 6, title: 'Cross-Chain Bridge', difficulty: 'Expert', xp: 1500, duration: '8h', tech: ['Solidity', 'LayerZero', 'Rust'], completion: 8, status: 'new' },
        ]
    },
    {
        id: 'gamedev',
        name: 'Game Development',
        icon: 'fa-gamepad',
        gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
        color: '#ec4899',
        description: 'Create immersive games and interactive experiences',
        stats: { labs: 22, projects: 9, users: '5.8k' },
        labs: [
            { id: 1, title: '2D Platformer with Phaser.js', difficulty: 'Beginner', xp: 350, duration: '2.5h', tech: ['Phaser.js', 'JavaScript', 'HTML5'], completion: 68, status: 'popular' },
            { id: 2, title: 'Unity 3D FPS Controller', difficulty: 'Intermediate', xp: 600, duration: '3h', tech: ['Unity', 'C#', '3D'], completion: 45, status: 'hot' },
            { id: 3, title: 'RPG Inventory System', difficulty: 'Advanced', xp: 800, duration: '4h', tech: ['Unity', 'C#', 'UI'], completion: 30, status: 'featured' },
            { id: 4, title: 'Multiplayer with Socket.io', difficulty: 'Advanced', xp: 900, duration: '5h', tech: ['Socket.io', 'Node.js', 'Canvas'], completion: 22, status: 'new' },
            { id: 5, title: 'Pixel Art Animation Engine', difficulty: 'Intermediate', xp: 500, duration: '2h', tech: ['Canvas', 'JavaScript', 'Sprites'], completion: 55, status: 'popular' },
            { id: 6, title: 'Unreal Engine Basics', difficulty: 'Beginner', xp: 400, duration: '3h', tech: ['Unreal', 'Blueprints', 'C++'], completion: 40, status: 'new' },
        ]
    }
];

// ─── Difficulty Badge ───
const DifficultyBadge = ({ level }) => {
    const colors = {
        'Beginner': { bg: '#dcfce7', text: '#16a34a' },
        'Intermediate': { bg: '#dbeafe', text: '#2563eb' },
        'Advanced': { bg: '#fef3c7', text: '#d97706' },
        'Expert': { bg: '#fce7f3', text: '#db2777' }
    };
    const c = colors[level] || colors['Beginner'];
    return (
        <span style={{ background: c.bg, color: c.text, padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>
            {level}
        </span>
    );
};

// ─── Status Tag ───
const StatusTag = ({ status }) => {
    const map = {
        'popular': { icon: 'fa-fire', label: 'Popular', color: '#f97316' },
        'new': { icon: 'fa-sparkles', label: 'New', color: '#8b5cf6' },
        'hot': { icon: 'fa-bolt', label: 'Hot', color: '#ef4444' },
        'featured': { icon: 'fa-award', label: 'Featured', color: '#3b82f6' }
    };
    const s = map[status] || map['new'];
    return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: s.color, fontSize: '0.7rem', fontWeight: 700 }}>
            <i className={`fa-solid ${s.icon}`}></i> {s.label}
        </span>
    );
};

// ─── Lab Card ───
const LabCard = ({ lab, domainColor }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: `0 12px 30px ${domainColor}22` }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                border: `1px solid ${hovered ? domainColor + '44' : '#f1f5f9'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Top glow */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: domainColor, opacity: hovered ? 1 : 0, transition: 'opacity 0.3s'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <StatusTag status={lab.status} />
                <DifficultyBadge level={lab.difficulty} />
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1e293b', lineHeight: 1.3 }}>
                {lab.title}
            </h4>

            {/* Tech Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                {lab.tech.map((t, i) => (
                    <span key={i} style={{
                        background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 8px',
                        borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, color: '#64748b'
                    }}>{t}</span>
                ))}
            </div>

            {/* Progress */}
            <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                    <span>{lab.completion}% avg completion</span>
                    <span>{lab.duration}</span>
                </div>
                <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${lab.completion}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{ height: '100%', background: domainColor, borderRadius: '4px' }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-solid fa-bolt" style={{ color: '#f59e0b', fontSize: '0.8rem' }}></i>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: domainColor }}>{lab.xp} XP</span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        background: domainColor, color: 'white', border: 'none', padding: '8px 18px',
                        borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                >
                    <i className="fa-solid fa-play" style={{ fontSize: '0.65rem' }}></i> Start Lab
                </motion.button>
            </div>
        </motion.div>
    );
};

// ─── Domain Section ───
const DomainSection = ({ domain, isExpanded, onToggle }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '2rem' }}
        >
            {/* Domain Header */}
            <motion.div
                whileHover={{ scale: 1.005 }}
                onClick={onToggle}
                style={{
                    background: domain.gradient,
                    borderRadius: isExpanded ? '20px 20px 0 0' : '20px',
                    padding: '1.5rem 2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: `0 8px 25px ${domain.color}33`,
                    transition: 'border-radius 0.3s'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '52px', height: '52px', borderRadius: '14px',
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: 'white'
                    }}>
                        <i className={`fa-solid ${domain.icon}`}></i>
                    </div>
                    <div>
                        <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 900, marginBottom: '2px' }}>
                            {domain.name}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 500 }}>
                            {domain.description}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {[
                            { label: 'Labs', value: domain.stats.labs },
                            { label: 'Projects', value: domain.stats.projects },
                            { label: 'Learners', value: domain.stats.users },
                        ].map((s, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem' }}>{s.value}</div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', fontWeight: 600 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        style={{ color: 'white', fontSize: '1.2rem' }}
                    >
                        <i className="fa-solid fa-chevron-down"></i>
                    </motion.div>
                </div>
            </motion.div>

            {/* Expanded Labs Grid */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            overflow: 'hidden',
                            background: '#fafbfe',
                            borderRadius: '0 0 20px 20px',
                            border: `1px solid ${domain.color}22`,
                            borderTop: 'none'
                        }}
                    >
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.25rem',
                            padding: '1.5rem'
                        }}>
                            {domain.labs.map((lab) => (
                                <LabCard key={lab.id} lab={lab} domainColor={domain.color} />
                            ))}
                        </div>

                        {/* View All button */}
                        <div style={{ textAlign: 'center', paddingBottom: '1.5rem' }}>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    background: 'transparent', border: `2px solid ${domain.color}`,
                                    color: domain.color, padding: '10px 28px', borderRadius: '12px',
                                    fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                                    display: 'inline-flex', alignItems: 'center', gap: '8px'
                                }}
                            >
                                View All {domain.stats.labs} Labs <i className="fa-solid fa-arrow-right"></i>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─── Main Page ───
const PracticalHub = () => {
    const [expandedDomains, setExpandedDomains] = useState(['webdev']);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');

    const toggleDomain = (id) => {
        setExpandedDomains(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    };

    const filteredDomains = domains.map(d => ({
        ...d,
        labs: d.labs.filter(l => {
            const matchesSearch = searchQuery === '' ||
                l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesDifficulty = selectedDifficulty === 'All' || l.difficulty === selectedDifficulty;
            return matchesSearch && matchesDifficulty;
        })
    })).filter(d => d.labs.length > 0 || searchQuery === '');

    const totalLabs = domains.reduce((sum, d) => sum + d.stats.labs, 0);
    const totalProjects = domains.reduce((sum, d) => sum + d.stats.projects, 0);

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>

            {/* ─── Hero Header ─── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                    borderRadius: '24px',
                    padding: '2.5rem 3rem',
                    marginBottom: '2rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative elements */}
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-30px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent)', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
                                Hands-On Practice
                            </span>
                            <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800 }}>LIVE</span>
                        </div>
                        <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                            <i className="fa-solid fa-flask-vial" style={{ marginRight: '12px', color: '#3b82f6' }}></i>
                            Practical Hub
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '550px', lineHeight: 1.6 }}>
                            Master real-world skills with hands-on labs, projects, and challenges across <b style={{ color: '#e2e8f0' }}>{domains.length} domains</b>.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {[
                            { icon: 'fa-flask', value: totalLabs, label: 'Labs', color: '#3b82f6' },
                            { icon: 'fa-diagram-project', value: totalProjects, label: 'Projects', color: '#10b981' },
                            { icon: 'fa-layer-group', value: domains.length, label: 'Domains', color: '#8b5cf6' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -3 }}
                                style={{
                                    background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
                                    padding: '1.25rem 1.5rem', textAlign: 'center', minWidth: '100px'
                                }}
                            >
                                <i className={`fa-solid ${stat.icon}`} style={{ color: stat.color, fontSize: '1.2rem', marginBottom: '8px', display: 'block' }}></i>
                                <div style={{ color: 'white', fontWeight: 900, fontSize: '1.4rem' }}>{stat.value}</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Search & Filters */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <i className="fa-solid fa-search" style={{ position: 'absolute', left: '16px', top: '14px', color: '#64748b' }}></i>
                        <input
                            type="text"
                            placeholder="Search labs by name, technology, or skill..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px 12px 44px', borderRadius: '14px',
                                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.07)',
                                color: 'white', fontSize: '0.95rem', outline: 'none',
                                backdropFilter: 'blur(10px)'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map(d => (
                            <motion.button
                                key={d}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedDifficulty(d)}
                                style={{
                                    background: selectedDifficulty === d ? '#3b82f6' : 'rgba(255,255,255,0.07)',
                                    color: selectedDifficulty === d ? 'white' : '#94a3b8',
                                    border: '1px solid ' + (selectedDifficulty === d ? '#3b82f6' : 'rgba(255,255,255,0.1)'),
                                    padding: '10px 18px', borderRadius: '12px',
                                    fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {d}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ─── Domain Sections ─── */}
            {filteredDomains.map((domain) => (
                <DomainSection
                    key={domain.id}
                    domain={domain}
                    isExpanded={expandedDomains.includes(domain.id)}
                    onToggle={() => toggleDomain(domain.id)}
                />
            ))}

            {filteredDomains.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        textAlign: 'center', padding: '4rem', color: '#94a3b8'
                    }}
                >
                    <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>No labs found</h3>
                    <p>Try adjusting your search or filters</p>
                </motion.div>
            )}
        </div>
    );
};

export default PracticalHub;
