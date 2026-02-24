import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CertificationHub = ({ setActiveTab }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    const categories = [
        'All', 'AI & Machine Learning', 'Cyber Security', 'Cloud & DevOps',
        'Development', 'Data Science', 'Networking', 'Project Management', 'UI/UX Design'
    ];

    const courseData = [
        // AI & MACHINE LEARNING
        { title: 'AWS Certified AI Practitioner', provider: 'Amazon Web Services', cat: 'AI & Machine Learning', level: 'Beginner', link: 'https://aws.amazon.com/certification/' },
        { title: 'Google Professional Machine Learning Engineer', provider: 'Google Cloud', cat: 'AI & Machine Learning', level: 'Expert', link: 'https://cloud.google.com/certification' },
        { title: 'Deep Learning Specialization', provider: 'DeepLearning.AI', cat: 'AI & Machine Learning', level: 'Intermediate', link: 'https://www.deeplearning.ai/' },
        { title: 'Machine Learning Engineering for Production (MLOps)', provider: 'DeepLearning.AI', cat: 'AI & Machine Learning', level: 'Expert', link: 'https://www.coursera.org/' },
        { title: 'Azure AI Engineer Associate', provider: 'Microsoft', cat: 'AI & Machine Learning', level: 'Intermediate', link: 'https://learn.microsoft.com/' },
        { title: 'NVIDIA Deep Learning Institute Certifications', provider: 'NVIDIA', cat: 'AI & Machine Learning', level: 'Intermediate', link: 'https://www.nvidia.com/en-us/training/' },
        { title: 'Natural Language Processing Specialization', provider: 'DeepLearning.AI', cat: 'AI & Machine Learning', level: 'Intermediate', link: 'https://www.coursera.org/' },
        { title: 'Generative AI with Large Language Models', provider: 'AWS / DeepLearning.AI', cat: 'AI & Machine Learning', level: 'Expert', link: 'https://www.coursera.org/' },
        { title: 'Reinforcement Learning Professional', provider: 'IBM', cat: 'AI & Machine Learning', level: 'Intermediate', link: 'https://www.ibm.com/training' },
        { title: 'Computer Vision Practitioner', provider: 'OpenCV', cat: 'AI & Machine Learning', level: 'Intermediate', link: 'https://opencv.org/university/' },
        { title: 'TensorFlow Developer Certificate', provider: 'Google', cat: 'AI & Machine Learning', level: 'Expert', link: 'https://www.tensorflow.org/certificate' },
        { title: 'IBM AI Engineering Professional Certificate', provider: 'IBM', cat: 'AI & Machine Learning', level: 'Intermediate', link: 'https://www.coursera.org/' },

        // CYBER SECURITY
        { title: 'CompTIA Security+', provider: 'CompTIA', cat: 'Cyber Security', level: 'Beginner', link: 'https://www.comptia.org/' },
        { title: 'Certified Ethical Hacker (CEH)', provider: 'EC-Council', cat: 'Cyber Security', level: 'Intermediate', link: 'https://www.eccouncil.org/' },
        { title: 'OSCP (Offensive Security Certified Professional)', provider: 'OffSec', cat: 'Cyber Security', level: 'Expert', link: 'https://www.offsec.com/' },
        { title: 'CISSP (Certified Information Systems Security Professional)', provider: 'ISC2', cat: 'Cyber Security', level: 'Expert', link: 'https://www.isc2.org/' },
        { title: 'CISM (Certified Information Security Manager)', provider: 'ISACA', cat: 'Cyber Security', level: 'Expert', link: 'https://www.isaca.org/' },
        { title: 'Certified in Cybersecurity (CC)', provider: 'ISC2', cat: 'Cyber Security', level: 'Beginner', link: 'https://www.isc2.org/' },
        { title: 'CompTIA PenTest+', provider: 'CompTIA', cat: 'Cyber Security', level: 'Intermediate', link: 'https://www.comptia.org/' },
        { title: 'GSEC (GIAC Security Essentials)', provider: 'SANS Institute', cat: 'Cyber Security', level: 'Beginner', link: 'https://www.giac.org/' },
        { title: 'Certified Cloud Security Professional (CCSP)', provider: 'ISC2', cat: 'Cyber Security', level: 'Expert', link: 'https://www.isc2.org/' },
        { title: 'Cyber Ops Associate', provider: 'Cisco', cat: 'Cyber Security', level: 'Beginner', link: 'https://www.cisco.com/' },
        { title: 'eWPT (Web Pentesting)', provider: 'eLearnSecurity', cat: 'Cyber Security', level: 'Intermediate', link: 'https://ine.com/' },
        { title: 'Burp Suite Certified Practitioner', provider: 'PortSwigger', cat: 'Cyber Security', level: 'Expert', link: 'https://portswigger.net/' },

        // CLOUD & DEVOPS
        { title: 'AWS Solutions Architect Associate', provider: 'Amazon', cat: 'Cloud & DevOps', level: 'Intermediate', link: 'https://aws.amazon.com/certification/' },
        { title: 'Azure Fundamentals (AZ-900)', provider: 'Microsoft', cat: 'Cloud & DevOps', level: 'Beginner', link: 'https://learn.microsoft.com/' },
        { title: 'Google Cloud Associate Engineer', provider: 'Google Cloud', cat: 'Cloud & DevOps', level: 'Intermediate', link: 'https://cloud.google.com/certification' },
        { title: 'Certified Kubernetes Administrator (CKA)', provider: 'CNCF', cat: 'Cloud & DevOps', level: 'Expert', link: 'https://training.linuxfoundation.org/' },
        { title: 'Terraform Associate', provider: 'HashiCorp', cat: 'Cloud & DevOps', level: 'Intermediate', link: 'https://www.hashicorp.com/certification' },
        { title: 'Red Hat Certified System Administrator (RHCSA)', provider: 'Red Hat', cat: 'Cloud & DevOps', level: 'Intermediate', link: 'https://www.redhat.com/' },
        { title: 'Docker Certified Associate (DCA)', provider: 'Docker', cat: 'Cloud & DevOps', level: 'Intermediate', link: 'https://training.mirantis.com/certification/' },
        { title: 'AWS DevOps Engineer Professional', provider: 'Amazon', cat: 'Cloud & DevOps', level: 'Expert', link: 'https://aws.amazon.com/certification/' },
        { title: 'Azure DevOps Engineer Expert (AZ-400)', provider: 'Microsoft', cat: 'Cloud & DevOps', level: 'Expert', link: 'https://learn.microsoft.com/' },
        { title: 'Oracle Cloud Infrastructure Foundations', provider: 'Oracle', cat: 'Cloud & DevOps', level: 'Beginner', link: 'https://education.oracle.com/' },
        { title: 'Alumni Cloud Architecture Pro', provider: 'IBM', cat: 'Cloud & DevOps', level: 'Expert', link: 'https://www.ibm.com/training' },

        // DEVELOPMENT (Web, Mobile, Software)
        { title: 'Oracle Certified Professional: Java SE 17 Developer', provider: 'Oracle', cat: 'Development', level: 'Expert', link: 'https://education.oracle.com/' },
        { title: 'Meta Front-End Developer Professional Certificate', provider: 'Meta', cat: 'Development', level: 'Intermediate', link: 'https://www.coursera.org/' },
        { title: 'Meta Back-End Developer Professional Certificate', provider: 'Meta', cat: 'Development', level: 'Intermediate', link: 'https://www.coursera.org/' },
        { title: 'App Development with Swift', provider: 'Apple', cat: 'Development', level: 'Intermediate', link: 'https://developer.apple.com/' },
        { title: 'Associate Android Developer', provider: 'Google', cat: 'Development', level: 'Beginner', link: 'https://developers.google.com/certification' },
        { title: 'Spring Certified Professional', provider: 'VMware', cat: 'Development', level: 'Expert', link: 'https://pathway.vmware.com/' },
        { title: 'MongoDB Associate Developer', provider: 'MongoDB', cat: 'Development', level: 'Intermediate', link: 'https://university.mongodb.com/' },
        { title: 'React Development Certificate', provider: 'Meta / Coursera', cat: 'Development', level: 'Intermediate', link: 'https://www.coursera.org/' },
        { title: 'Flutter App Development Expert', provider: 'Google / Udacity', cat: 'Development', level: 'Expert', link: 'https://www.udacity.com/' },
        { title: 'Unity Certified User: Programmer', provider: 'Unity', cat: 'Development', level: 'Beginner', link: 'https://unity.com/certification' },
        { title: 'Salesforce Platform Developer I', provider: 'Salesforce', cat: 'Development', level: 'Intermediate', link: 'https://trailhead.salesforce.com/' },

        // DATA SCIENCE & ANALYTICS
        { title: 'IBM Data Science Professional Certificate', provider: 'IBM', cat: 'Data Science', level: 'Intermediate', link: 'https://www.coursera.org/' },
        { title: 'Google Data Analytics Professional Certificate', provider: 'Google', cat: 'Data Science', level: 'Beginner', link: 'https://grow.google/certificates/' },
        { title: 'Microsoft Certified: Azure Data Scientist Associate', provider: 'Microsoft', cat: 'Data Science', level: 'Intermediate', link: 'https://learn.microsoft.com/' },
        { title: 'Snowflake Core Professional', provider: 'Snowflake', cat: 'Data Science', level: 'Expert', link: 'https://www.snowflake.com/university' },
        { title: 'Tableau Desktop Specialist', provider: 'Tableau', cat: 'Data Science', level: 'Beginner', link: 'https://www.tableau.com/learn/certification' },
        { title: 'Power BI Data Analyst Associate', provider: 'Microsoft', cat: 'Data Science', level: 'Intermediate', link: 'https://learn.microsoft.com/' },
        { title: 'Databricks Certified Data Engineer Associate', provider: 'Databricks', cat: 'Data Science', level: 'Intermediate', link: 'https://www.databricks.com/learn/certification' },
        { title: 'SAS Certified Specialist: Base Programming', provider: 'SAS', cat: 'Data Science', level: 'Intermediate', link: 'https://www.sas.com/' },
        { title: 'Big Data Engineering Professional', provider: 'IBM', cat: 'Data Science', level: 'Expert', link: 'https://www.ibm.com/training' },

        // NETWORKING
        { title: 'CCNA (Cisco Certified Network Associate)', provider: 'Cisco', cat: 'Networking', level: 'Beginner', link: 'https://www.cisco.com/' },
        { title: 'CCNP Enterprise', provider: 'Cisco', cat: 'Networking', level: 'Expert', link: 'https://www.cisco.com/' },
        { title: 'CompTIA Network+', provider: 'CompTIA', cat: 'Networking', level: 'Beginner', link: 'https://www.comptia.org/' },
        { title: 'Juniper Networks Certified Associate (JNCIA-Junos)', provider: 'Juniper', cat: 'Networking', level: 'Beginner', link: 'https://www.juniper.net/' },
        { title: 'Aruba Certified Mobility Associate', provider: 'HP Enterprise', cat: 'Networking', level: 'Beginner', link: 'https://www.arubanetworks.com/' },
        { title: 'Wireshark Certified Network Analyst (WCNA)', provider: 'Protocol Analysis Institute', cat: 'Networking', level: 'Intermediate', link: 'https://www.wireshark.org/training' },
        { title: 'F5 Certified Technology Specialist', provider: 'F5 Networks', cat: 'Networking', level: 'Expert', link: 'https://www.f5.com/' },

        // PROJECT MANAGEMENT & BUSINESS
        { title: 'PMP (Project Management Professional)', provider: 'Project Management Institute', cat: 'Project Management', level: 'Expert', link: 'https://www.pmi.org/' },
        { title: 'Certified Scrum Master (CSM)', provider: 'Scrum Alliance', cat: 'Project Management', level: 'Intermediate', link: 'https://www.scrumalliance.org/' },
        { title: 'Prince2 Foundation', provider: 'AXELOS', cat: 'Project Management', level: 'Beginner', link: 'https://www.axelos.com/' },
        { title: 'Six Sigma Green Belt', provider: 'IASSC', cat: 'Project Management', level: 'Intermediate', link: 'https://iassc.org/' },
        { title: 'CAPM (Certified Associate in Project Management)', provider: 'PMI', cat: 'Project Management', level: 'Beginner', link: 'https://www.pmi.org/' },
        { title: 'ITIL 4 Foundation', provider: 'AXELOS', cat: 'Project Management', level: 'Beginner', link: 'https://www.axelos.com/' },
        { title: 'CBAP (Certified Business Analysis Professional)', provider: 'IIBA', cat: 'Project Management', level: 'Expert', link: 'https://www.iiba.org/' },

        // UI/UX DESIGN
        { title: 'Google UX Design Professional Certificate', provider: 'Google', cat: 'UI/UX Design', level: 'Beginner', link: 'https://grow.google/certificates/' },
        { title: 'Interaction Design Foundation Certifications', provider: 'IxDF', cat: 'UI/UX Design', level: 'Intermediate', link: 'https://www.interaction-design.org/' },
        { title: 'NN/g UX Certification', provider: 'Nielsen Norman Group', cat: 'UI/UX Design', level: 'Expert', link: 'https://www.nngroup.com/' },
        { title: 'Adobe Certified Professional: Visual Design', provider: 'Adobe', cat: 'UI/UX Design', level: 'Intermediate', link: 'https://certifiedprofessional.adobe.com/' },
        { title: 'Figma Design Specialist', provider: 'Skillshare / Udemy', cat: 'UI/UX Design', level: 'Beginner', link: 'https://www.figma.com/' },
        { title: 'HCI Specialization', provider: 'Georgia Tech / Coursera', cat: 'UI/UX Design', level: 'Expert', link: 'https://www.coursera.org/' }
    ];

    const filteredCourses = courseData.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.provider.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || course.cat === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#020617',
            color: 'white',
            zIndex: 9999,
            overflowY: 'auto',
            fontFamily: "'Outfit', sans-serif",
            padding: '4rem 2rem'
        }}>
            {/* IMMERSIVE TOOLBAR */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                background: 'rgba(2, 6, 23, 0.8)',
                backdropFilter: 'blur(10px)',
                padding: '1rem 2rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10000
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-graduation-cap" style={{ fontSize: '1.2rem' }}></i>
                    </div>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: '0.9rem', letterSpacing: '1px' }}>GLOBAL ACCREDITATION HUB</div>
                        <div style={{ fontSize: '0.6rem', color: '#60a5fa', fontWeight: 800 }}>LIVE CLOUD SYNC ACTIVE</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={toggleFullScreen}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i> {isFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN'}
                    </button>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        style={{ background: '#ef4444', border: 'none', color: 'white', padding: '10px 25px', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <i className="fa-solid fa-xmark"></i> CLOSE HUB
                    </button>
                </div>
            </div>

            {/* TOP HEADER */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
                <h1 style={{ fontSize: '4.5rem', fontWeight: 900, background: 'linear-gradient(to right, #60a5fa, #c084fc, #60a5fa)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, animation: 'glowText 5s linear infinite' }}>
                    SKILL PATH AI VAULT
                </h1>
                <p style={{ fontSize: '1.4rem', color: '#94a3b8', marginTop: '1rem', fontWeight: 600, letterSpacing: '2px' }}>
                    DECODING 150+ GLOBAL CAREER NODES
                </p>
            </motion.div>

            {/* SEARCH & FILTER BAR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
                <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <input
                        type="text"
                        placeholder="Search by course name or provider (e.g. AWS, Google, Cyber Security...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '1.5rem 2rem 1.5rem 4rem', borderRadius: '24px', background: 'rgba(30, 41, 59, 0.4)', border: '2px solid rgba(255,255,255,0.05)', color: 'white', fontSize: '1.2rem', outline: 'none', transition: '0.3s' }}
                    />
                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem', color: '#60a5fa' }}></i>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: activeCategory === cat ? '#3b82f6' : 'rgba(30, 41, 59, 0.4)', border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.05)', color: 'white', fontWeight: 700, cursor: 'pointer', transition: '0.3s' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* COURSE GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                <AnimatePresence>
                    {filteredCourses.map((course, idx) => (
                        <motion.div
                            key={course.title}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                            style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5))', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}
                        >
                            <div style={{ position: 'absolute', top: -10, right: -10, fontSize: '6rem', opacity: 0.03, color: 'white' }}>
                                <i className="fa-solid fa-award"></i>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '2px', background: 'rgba(96, 165, 250, 0.1)', padding: '5px 12px', borderRadius: '8px' }}>
                                    {course.level}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>ID: CERT-{1000 + idx}</span>
                            </div>

                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.75rem 0', lineHeight: 1.3, minHeight: '3.6rem' }}>{course.title}</h3>
                            <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>{course.provider}</p>

                            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}>
                                <i className="fa-solid fa-folder-open" style={{ color: '#60a5fa' }}></i> {course.cat}
                            </div>

                            <button
                                onClick={() => window.open(course.link, '_blank')}
                                style={{ width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 800, cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                onMouseEnter={(e) => e.target.style.background = '#3b82f6'}
                                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                            >
                                LEARN MORE <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.8rem' }}></i>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* EMPTY STATE */}
            {filteredCourses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '10rem 0' }}>
                    <i className="fa-solid fa-satellite-dish" style={{ fontSize: '5rem', color: '#334155', marginBottom: '2rem' }}></i>
                    <h2 style={{ color: '#94a3b8' }}>No results match your neural scan.</h2>
                    <p style={{ color: '#475569' }}>Try adjusting your search parameters or selecting a different category.</p>
                </div>
            )}

            {/* HUB STATS */}
            <div style={{ marginTop: '6rem', padding: '4rem', background: 'linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(167, 139, 250, 0.05))', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.02)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
                <div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#60a5fa' }}>150+</div>
                    <div style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Total Courses</div>
                </div>
                <div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#c084fc' }}>9</div>
                    <div style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Domains Covered</div>
                </div>
                <div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#4ade80' }}>100%</div>
                    <div style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Verified Nodes</div>
                </div>
                <div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f87171' }}>24/7</div>
                    <div style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>AI Live Sync</div>
                </div>
            </div>
            <style>{`
                @keyframes glowText {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #020617;
                }
                ::-webkit-scrollbar-thumb {
                    background: #1e293b;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #334155;
                }
            `}</style>
        </div>
    );
};

export default CertificationHub;
