import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SkillTree = () => {
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Frontend', 'Backend', 'Data & AI', 'DevOps', 'Mobile & Web3'];

    const skills = [
        // Frontend
        { id: 1, name: 'HTML5', category: 'Frontend', level: 95, icon: 'fa-html5', color: '#e34c26', desc: 'The backbone of the web. Semantic structure and SEO mastery.' },
        { id: 2, name: 'CSS3', category: 'Frontend', level: 90, icon: 'fa-css3-alt', color: '#264de4', desc: 'Modern styling, Flexbox, Grid, and complex animations.' },
        { id: 3, name: 'JavaScript', category: 'Frontend', level: 85, icon: 'fa-js', color: '#f7df1e', desc: 'ES6+, Async logic, and functional programming paradigms.' },
        { id: 4, name: 'React', category: 'Frontend', level: 88, icon: 'fa-react', color: '#61dafb', desc: 'Component-based architecture and state management hooks.' },
        { id: 5, name: 'Vue.js', category: 'Frontend', level: 70, icon: 'fa-vuejs', color: '#42b883', desc: 'Progressive framework for building user interfaces.' },
        { id: 6, name: 'Angular', category: 'Frontend', level: 65, icon: 'fa-angular', color: '#dd0031', desc: 'Enterprise-grade framework with TypeScript integration.' },
        { id: 7, name: 'Next.js', category: 'Frontend', level: 80, icon: 'fa-n', color: '#ffffff', desc: 'Server-side rendering and static site generation.' },
        { id: 8, name: 'Tailwind CSS', category: 'Frontend', level: 92, icon: 'fa-wind', color: '#38bdf8', desc: 'Utility-first CSS framework for rapid UI development.' },
        { id: 9, name: 'TypeScript', category: 'Frontend', level: 82, icon: 'fa-code', color: '#3178c6', desc: 'Strongly typed JavaScript for scalable applications.' },
        { id: 10, name: 'Svelte', category: 'Frontend', level: 60, icon: 'fa-bolt', color: '#ff3e00', desc: 'Compile-time framework for ultra-fast performance.' },

        // Backend
        { id: 11, name: 'Node.js', category: 'Backend', level: 85, icon: 'fa-node-js', color: '#339933', desc: 'Server-side JavaScript runtime for scalable backends.' },
        { id: 12, name: 'Python', category: 'Backend', level: 95, icon: 'fa-python', color: '#3776ab', desc: 'Versatile scripting for backend, data, and automation.' },
        { id: 13, name: 'Java', category: 'Backend', level: 80, icon: 'fa-java', color: '#007396', desc: 'Robust enterprise backend development and JVM apps.' },
        { id: 14, name: 'PHP', category: 'Backend', level: 75, icon: 'fa-php', color: '#777bb4', desc: 'Server-side scripting powering millions of websites.' },
        { id: 15, name: 'C++', category: 'Backend', level: 70, icon: 'fa-c', color: '#00599c', desc: 'High-performance computing and systems programming.' },
        { id: 16, name: 'Go', category: 'Backend', level: 65, icon: 'fa-google', color: '#00add8', desc: 'Concurrency-focused language for cloud services.' },
        { id: 17, name: 'Ruby on Rails', category: 'Backend', level: 60, icon: 'fa-gem', color: '#cc0000', desc: 'Productive web framework following the MVC pattern.' },
        { id: 18, name: 'Rust', category: 'Backend', level: 55, icon: 'fa-gears', color: '#dea584', desc: 'Memory-safe systems language for low-level performance.' },
        { id: 19, name: 'PostgreSQL', category: 'Backend', level: 88, icon: 'fa-database', color: '#336791', desc: 'Advanced open-source relational database system.' },
        { id: 20, name: 'MongoDB', category: 'Backend', level: 82, icon: 'fa-leaf', color: '#47a248', desc: 'Flexible, document-oriented NoSQL database.' },

        // Data & AI
        { id: 21, name: 'Machine Learning', category: 'Data & AI', level: 75, icon: 'fa-robot', color: '#10b981', desc: 'Building predictive models and neural network logic.' },
        { id: 22, name: 'Deep Learning', category: 'Data & AI', level: 68, icon: 'fa-brain', color: '#8b5cf6', desc: 'Advanced neural networks using PyTorch and TensorFlow.' },
        { id: 23, name: 'Data Analysis', category: 'Data & AI', level: 85, icon: 'fa-chart-area', color: '#3b82f6', desc: 'Interpreting complex datasets for business insights.' },
        { id: 24, name: 'Computer Vision', category: 'Data & AI', level: 65, icon: 'fa-eye', color: '#f59e0b', desc: 'Image recognition and processing using OpenCV/AI.' },
        { id: 25, name: 'NLP', category: 'Data & AI', level: 70, icon: 'fa-comments', color: '#ec4899', desc: 'Natural Language Processing for chatbots and translation.' },
        { id: 26, name: 'Big Data', category: 'Data & AI', level: 72, icon: 'fa-server', color: '#06b6d4', desc: 'Managing massive datasets with Spark and Hadoop.' },
        { id: 27, name: 'Pandas / NumPy', category: 'Data & AI', level: 90, icon: 'fa-table', color: '#ff6f00', desc: 'Core Python libraries for numerical data handling.' },
        { id: 28, name: 'Statistics', category: 'Data & AI', level: 80, icon: 'fa-calculator', color: '#7c3aed', desc: 'The mathematical foundation of data science.' },
        { id: 29, name: 'Generative AI', category: 'Data & AI', level: 82, icon: 'fa-wand-magic-sparkles', color: '#ffffff', desc: 'LLMs, Prompt Engineering, and synthetic media.' },
        { id: 30, name: 'TensorFlow', category: 'Data & AI', level: 68, icon: 'fa-cube', color: '#ff9100', desc: 'End-to-end open source platform for machine learning.' },

        // DevOps
        { id: 31, name: 'Docker', category: 'DevOps', level: 85, icon: 'fa-docker', color: '#2496ed', desc: 'Containerization for consistent deployment environments.' },
        { id: 32, name: 'Kubernetes', category: 'DevOps', level: 65, icon: 'fa-dharmachakra', color: '#326ce5', desc: 'Orchestrating containerized apps at scale.' },
        { id: 33, name: 'AWS', category: 'DevOps', level: 78, icon: 'fa-aws', color: '#ff9900', desc: 'Global cloud infrastructure and serverless solutions.' },
        { id: 34, name: 'Git / GitHub', category: 'DevOps', level: 95, icon: 'fa-github', color: '#ffffff', desc: 'Version control and collaborative CI/CD workflows.' },
        { id: 35, name: 'Linux', category: 'DevOps', level: 88, icon: 'fa-linux', color: '#fca311', desc: 'Command line mastery and server administration.' },
        { id: 36, name: 'CI/CD Pipelines', category: 'DevOps', level: 80, icon: 'fa-infinity', color: '#10b981', desc: 'Automating build, test, and deployment cycles.' },
        { id: 37, name: 'Terraform', category: 'DevOps', level: 70, icon: 'fa-cloud', color: '#7b42bc', desc: 'Infrastructure as Code for managing cloud resources.' },
        { id: 38, name: 'Cybersecurity', category: 'DevOps', level: 75, icon: 'fa-shield-halved', color: '#ef4444', desc: 'Securing networks, apps, and data integrity.' },
        { id: 39, name: 'Azure', category: 'DevOps', level: 60, icon: 'fa-microsoft', color: '#0089d6', desc: 'Microsoft enterprise cloud and AI services.' },
        { id: 40, name: 'Nginx', category: 'DevOps', level: 82, icon: 'fa-network-wired', color: '#009639', desc: 'High-performance web server and reverse proxy.' },

        // Mobile & Web3
        { id: 41, name: 'React Native', category: 'Mobile & Web3', level: 85, icon: 'fa-mobile-screen', color: '#61dafb', desc: 'Cross-platform mobile apps using React logic.' },
        { id: 42, name: 'Flutter', category: 'Mobile & Web3', level: 72, icon: 'fa-feather', color: '#02569b', desc: 'Google UI toolkit for multi-platform applications.' },
        { id: 43, name: 'Swift', category: 'Mobile & Web3', level: 65, icon: 'fa-apple', color: '#f05138', desc: 'Modern language for iOS and macOS development.' },
        { id: 44, name: 'Kotlin', category: 'Mobile & Web3', level: 70, icon: 'fa-android', color: '#7f52ff', desc: 'Modern language for Android development.' },
        { id: 45, name: 'Web3 / Blockchain', category: 'Mobile & Web3', level: 68, icon: 'fa-link', color: '#ff00ff', desc: 'Decentralized technologies and smart contracts.' },
        { id: 46, name: 'Solidity', category: 'Mobile & Web3', level: 60, icon: 'fa-ethereum', color: '#3c3c3d', desc: 'Language for Ethereum smart contract logic.' },
        { id: 47, name: 'Metaverse / Three.js', category: 'Mobile & Web3', level: 75, icon: 'fa-vr-cardboard', color: '#10b981', desc: '3D web experiences and virtual environments.' },
        { id: 48, name: 'PWA', category: 'Mobile & Web3', level: 82, icon: 'fa-globe', color: '#3b82f6', desc: 'Progressive Web Apps with native-like features.' },
        { id: 49, name: 'Firebase', category: 'Mobile & Web3', level: 88, icon: 'fa-fire', color: '#ffca28', desc: 'Backend-as-a-Service for rapid app development.' },
        { id: 50, name: 'AR Core / Kit', category: 'Mobile & Web3', level: 62, icon: 'fa-glasses', color: '#8b5cf6', desc: 'Augmented reality integration for mobile devices.' },
    ];

    const filteredSkills = activeCategory === 'All'
        ? skills
        : skills.filter(s => s.category === activeCategory);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: 'white', padding: '2rem', fontFamily: "'Outfit', sans-serif" }}>
            {/* Header Area */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', marginBottom: '3rem' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '3.5rem', fontWeight: 900, background: 'linear-gradient(to right, #3b82f6, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}
                >
                    SKILL PATH AI NEURAL SKILL TREE
                </motion.h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Visualize and expand your technical neural network across 50 domains.</p>
            </div>

            {/* Category Filter */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: '0.8rem 2rem', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 700,
                            background: activeCategory === cat ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                            color: activeCategory === cat ? 'white' : '#94a3b8',
                            transition: '0.3s'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Tree / Grid Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
                <AnimatePresence mode='popLayout'>
                    {filteredSkills.map((skill, index) => (
                        <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: index * 0.02 }}
                            whileHover={{ y: -5, scale: 1.05 }}
                            onClick={() => setSelectedSkill(skill)}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '24px',
                                padding: '1.5rem',
                                cursor: 'pointer',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: skill.color }}></div>
                            <div style={{ fontSize: '2.5rem', color: skill.color, marginBottom: '1rem', filter: `drop-shadow(0 0 10px ${skill.color}50)` }}>
                                <i className={`fa-brands ${skill.icon || 'fa-code'}`}></i>
                                {(!skill.icon?.startsWith('fa-')) && <i className={`fa-solid ${skill.icon || 'fa-code'}`}></i>}
                            </div>
                            <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.5rem' }}>{skill.name}</div>
                            <div className="progress-bar-small" style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                                <div style={{ width: `${skill.level}%`, height: '100%', background: skill.color, borderRadius: '10px' }}></div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Skill Detail Modal */}
            <AnimatePresence>
                {selectedSkill && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
                        onClick={() => setSelectedSkill(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            style={{ maxWidth: '600px', width: '100%', background: '#0f172a', borderRadius: '32px', border: `2px solid ${selectedSkill.color}`, padding: '3rem', position: 'relative' }}
                        >
                            <div style={{ fontSize: '5rem', color: selectedSkill.color, marginBottom: '2rem', textAlign: 'center' }}>
                                <i className={`fa-brands ${selectedSkill.icon}`}></i>
                                {(!selectedSkill.icon?.startsWith('fa-')) && <i className={`fa-solid ${selectedSkill.icon}`}></i>}
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textAlign: 'center', marginBottom: '1rem' }}>{selectedSkill.name}</h2>
                            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.2rem', marginBottom: '2rem' }}>{selectedSkill.category} Domain</div>

                            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, textAlign: 'center', color: '#cbd5e1', marginBottom: '2rem' }}>
                                {selectedSkill.desc}
                            </p>

                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '24px', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 900 }}>
                                    <span>PROFICIENCY</span>
                                    <span style={{ color: selectedSkill.color }}>{selectedSkill.level}%</span>
                                </div>
                                <div style={{ height: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '100px' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${selectedSkill.level}%` }}
                                        transition={{ duration: 1 }}
                                        style={{ height: '100%', background: selectedSkill.color, borderRadius: '100px', boxShadow: `0 0 20px ${selectedSkill.color}` }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button style={{ padding: '1.2rem', borderRadius: '16px', border: 'none', background: selectedSkill.color, color: 'white', fontWeight: 900, cursor: 'pointer' }}>START TRAINING</button>
                                <button onClick={() => setSelectedSkill(null)} style={{ padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: 900, cursor: 'pointer' }}>CLOSE NODE</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .progress-bar-small {
                    box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);
                }
            `}</style>
        </div>
    );
};

export default SkillTree;
