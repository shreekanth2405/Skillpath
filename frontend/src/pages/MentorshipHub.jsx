import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';



const DEPARTMENTS = {
    academic: [
        'All', 'Computer Science', 'Data Science', 'AI & ML', 'Cybersecurity', 'Cloud Computing', 'Game Dev', 'Full Stack Dev', 'Blockchain', 'DevOps',
        'Mechanical', 'Robotics', 'Mechatronics', 'Automobile', 'Aerospace', 'Marine Engineering', 'Petroleum', 'Mining', 'Metallurgical',
        'Civil', 'Structural', 'Environmental', 'Urban Planning', 'Electronics', 'Electrical', 'Instrumentation', 'VLSI Design', 'Embedded Systems',
        'Biotechnology', 'Genetic Engineering', 'Biomedical', 'Food Technology', 'Textile Engineering', 'Agricultural Engineering', 'Nanotechnology',
        'Nuclear Engineering', 'Chemical Engineering', 'Power Engineering', 'System Biology', 'Quantum Computing', 'Web 3.0', 'Mobile Apps',
        'UI/UX Design', '3D Animation', 'VFX', 'Information Technology', 'Software Engineering', 'Control Systems', 'Communication Systems'
    ],
    gov_exams: [
        'All', 'IAS (UPSC)', 'IPS (UPSC)', 'IRS (UPSC)', 'NDA (Defense)', 'CDS (Defense)', 'IBPS PO (Banking)', 'IBPS Clerk', 'SBI PO',
        'RRB NTPC (Railway)', 'RRB ALP', 'RRB Group D', 'SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC GD', 'IB ACIO', 'RBI Grade B',
        'TET (Teacher Eligibility)', 'CTET', 'TRB Graduate Teacher', 'TRB Lecturer', 'GST Inspector', 'Tax Assistant', 'Customs Officer',
        'Village Administrative Officer (VAO)', 'TNPSC Group 1', 'TNPSC Group 2', 'TNPSC Group 4', 'Police SI', 'Police Constable',
        'Defense - Army', 'Defense - Navy', 'Defense - Airforce', 'ISRO Scientist', 'BARC OCES', 'Forest Service (IFS)', 'DRDO Scientist'
    ],
    entrance: [
        'All', 'JEE Mains', 'JEE Advanced', 'NEET (Medical)', 'GATE - CS', 'GATE - ME', 'GATE - CE', 'GATE - EE', 'GATE - EC',
        'CAT (MBA)', 'GMAT', 'GRE', 'SAT', 'IELTS', 'TOEFL', 'CLAT (Law)', 'LSAT', 'NID (Design)', 'NIFT', 'JEE B.Arch', 'CEED'
    ],
    medical: [
        'All', 'MBBS Internals', 'Medical PG (NEET PG)', 'Dental (BDS/MDS)', 'Veterinary Science', 'Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology',
        'Microbiology', 'Forensic Medicine', 'General Medicine', 'General Surgery', 'Obstetrics & Gynaecology', 'Pediatrics',
        'Ophthalmology', 'ENT', 'Dermatology', 'Psychiatry', 'Radiology', 'Anaesthesia', 'Orthopaedics', 'Cardiology', 'Neurology'
    ],
    job_prep: [
        'All', 'Mock Interviews', 'Aptitude & Reasoning', 'Resume Branding', 'Personal Branding', 'Soft Skills', 'Technical Prep',
        'Product Management', 'Data Analytics', 'Business Analysis', 'Digital Marketing', 'HR Interviews', 'Salary Negotiation'
    ]
};

const LANGUAGES = [
    'All', 'English', 'Tamil', 'Hindi', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Urdu', 'Odia', 'Assamese',
    'Mandarin', 'Spanish', 'French', 'German', 'Japanese', 'Korean'
];

const CATEGORIES = [
    { id: 'academic', label: 'Engineering & Coding', icon: 'fa-user-graduate' },
    { id: 'gov_exams', label: 'Government Exams', icon: 'fa-building-columns' },
    { id: 'entrance', label: 'Entrance Exams', icon: 'fa-pen-to-square' },
    { id: 'medical', label: 'Medical, Dental & Vet', icon: 'fa-stethoscope' },
    { id: 'job_prep', label: 'Job & Career', icon: 'fa-briefcase' },
    { id: 'reports', label: 'My Progress', icon: 'fa-chart-line' },
    { id: 'resources', label: 'Mock Tests', icon: 'fa-file-lines' }
];

const MENTORS = [
    // Academic & Engineering
    { id: 1, name: 'Dr. Sarah Chen', role: 'Robotics Pioneer', dept: 'Robotics', languages: ['English', 'Mandarin'], rating: 4.9, img: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=6366f1&color=fff&size=120', bio: 'Former NASA engineer with 15+ years in industrial robotics.', category: 'academic' },
    { id: 2, name: 'Prof. James Wilson', role: 'AI Architecture Lead', dept: 'AI & ML', languages: ['English', 'Spanish'], rating: 4.8, img: 'https://ui-avatars.com/api/?name=James+Wilson&background=10b981&color=fff&size=120', bio: 'Expert in LLMs and Neural Networks architecture.', category: 'academic' },
    { id: 10, name: 'Karthik Subramaniam', role: 'DSA Expert', dept: 'Computer Science', languages: ['English', 'Tamil'], rating: 5.0, img: 'https://ui-avatars.com/api/?name=Karthik+S&background=0ea5e9&color=fff&size=120', bio: 'Expert in algorithms and competitive programming.', category: 'academic' },
    { id: 30, name: 'Elena Gilbert', role: 'Full Stack Architect', dept: 'Full Stack Dev', languages: ['English'], rating: 4.9, img: 'https://ui-avatars.com/api/?name=Elena+G&background=8b5cf6&color=fff&size=120', bio: 'Specializing in high-scale web systems.', category: 'academic' },
    { id: 31, name: 'Siddharth Roy', role: 'VLSI Designer', dept: 'VLSI Design', languages: ['English', 'Hindi'], rating: 4.8, img: 'https://ui-avatars.com/api/?name=Siddharth+R&background=ef4444&color=fff&size=120', bio: 'Chip design specialist.', category: 'academic' },
    { id: 18, name: 'Eng. David Miller', role: 'Aerospace Architect', dept: 'Aerospace', languages: ['English', 'German'], rating: 4.9, img: 'https://ui-avatars.com/api/?name=David+M&background=10b981&color=fff&size=120', bio: 'Satellite propulsion expert.', category: 'academic' },
    
    // Government Exams
    { id: 16, name: 'Venkatesh Iyer', role: 'IAS / District Collector', dept: 'IAS (UPSC)', languages: ['Tamil', 'English', 'Hindi'], rating: 5.0, img: 'https://ui-avatars.com/api/?name=Venkatesh+I&background=6366f1&color=fff&size=120', bio: 'Guiding aspirants for UPSC CSE Mains and Interviews.', category: 'gov_exams' },
    { id: 19, name: 'Anjali Singh', role: 'IPS Superintendent', dept: 'IPS (UPSC)', languages: ['Hindi', 'English'], rating: 4.9, img: 'https://ui-avatars.com/api/?name=Anjali+S&background=ef4444&color=fff&size=120', bio: 'Preparation strategy for Police and Internal Security exams.', category: 'gov_exams' },
    { id: 12, name: 'Raj Kumar', role: 'Railway RRB Specialist', dept: 'RRB NTPC (Railway)', languages: ['Hindi', 'English'], rating: 4.7, img: 'https://ui-avatars.com/api/?name=Raj+Kumar&background=ef4444&color=fff&size=120', bio: 'Ex-Railway officer for RRB & SSC exams.', category: 'gov_exams' },
    { id: 35, name: 'Rajesh Gopinathan', role: 'ISRO Senior Scientist', dept: 'ISRO Scientist', languages: ['English', 'Malayalam'], rating: 4.9, img: 'https://ui-avatars.com/api/?name=Rajesh+G&background=8b5cf6&color=fff&size=120', bio: 'Technical exam guidance for scientific roles.', category: 'gov_exams' },
    { id: 26, name: 'Lt. Col. Vikram Singh', role: 'Army SSB Mentor', dept: 'NDA (Defense)', languages: ['English', 'Hindi'], rating: 4.9, img: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=10b981&color=fff&size=120', bio: 'SSB interview specialist.', category: 'gov_exams' },
    { id: 36, name: 'Meera Deshmukh', role: 'GST Inspector', dept: 'GST Inspector', languages: ['English', 'Marathi'], rating: 4.7, img: 'https://ui-avatars.com/api/?name=Meera+D&background=f59e0b&color=fff&size=120', bio: 'Taxation and CGL expert.', category: 'gov_exams' },
    
    // Medical (MBBS & PG)
    { id: 15, name: 'Dr. Rajesh Khanna', role: 'Consultant Neurosurgeon', dept: 'Medical PG (NEET PG)', languages: ['English', 'Hindi'], rating: 4.9, img: 'https://ui-avatars.com/api/?name=Rajesh+Khanna&background=ef4444&color=fff&size=120', bio: 'Surgical coaching for PG aspirants.', category: 'medical' },
    { id: 17, name: 'Dr. Priya Varma', role: 'Head of Pediatrics', dept: 'Pediatrics', languages: ['English', 'Malayalam'], rating: 4.8, img: 'https://ui-avatars.com/api/?name=Priya+V&background=f59e0b&color=fff&size=120', bio: 'Clinicals and theory for MBBS finals.', category: 'medical' },
    { id: 33, name: 'Dr. Sameer Ahmed', role: 'Cardiology Fellow', dept: 'Cardiology', languages: ['English', 'Urdu'], rating: 4.9, img: 'https://ui-avatars.com/api/?name=Sameer+A&background=10b981&color=fff&size=120', bio: 'Specialist in internal medicine guidance.', category: 'medical' },
    { id: 34, name: 'Dr. Kavitha Mani', role: 'Radiology Expert', dept: 'Radiology', languages: ['English', 'Tamil'], rating: 4.8, img: 'https://ui-avatars.com/api/?name=Kavitha+M&background=6366f1&color=fff&size=120', bio: 'Diagnostic medicine mentorship.', category: 'medical' },

    // Entrance Exams
    { id: 8, name: 'Priya Sharma', role: 'NEET Biology Specialist', dept: 'NEET (Medical)', languages: ['English', 'Hindi'], rating: 4.8, img: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=ef4444&color=fff&size=120', bio: 'Score 360/360 in Biology strategy.', category: 'entrance' },
    { id: 9, name: 'Amit Verma', role: 'JEE Physics Guru', dept: 'JEE Mains', languages: ['English', 'Hindi', 'Punjabi'], rating: 5.0, img: 'https://ui-avatars.com/api/?name=Amit+Verma&background=f59e0b&color=fff&size=120', bio: 'Physics concepts to crack IIT-JEE.', category: 'entrance' },
    { id: 39, name: 'Sarah Jenkins', role: 'IELTS Band 9 Coach', dept: 'IELTS', languages: ['English'], rating: 5.0, img: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=10b981&color=fff&size=120', bio: 'Native English coaching for immigration.', category: 'entrance' },
    { id: 40, name: 'Eng. Rohan Mehra', role: 'Full Stack Mentor', dept: 'Full Stack Dev', languages: ['Hindi', 'English'], rating: 4.8, img: 'https://ui-avatars.com/api/?name=Rohan+Mehra&background=0ea5e9&color=fff&size=120', bio: 'Building modern apps with React and Node.', category: 'academic' },
    { id: 41, name: 'Dr. Alice Wong', role: 'Data Scientist', dept: 'Data Science', languages: ['English', 'Mandarin'], rating: 4.9, img: 'https://ui-avatars.com/api/?name=Alice+W&background=8b5cf6&color=fff&size=120', bio: 'Machine learning for big data analytics.', category: 'academic' },
    { id: 42, name: 'Vinesh Phogat', role: 'Sports & Physical Prep', dept: 'Police Constable', languages: ['Hindi', 'English'], rating: 5.0, img: 'https://ui-avatars.com/api/?name=Vinesh+P&background=ef4444&color=fff&size=120', bio: 'Physical standard and endurance training for defense.', category: 'gov_exams' },
    { id: 43, name: 'Dr. Mani Ratnam', role: 'Tamil Literature Mentor', dept: 'TRB Lecturer', languages: ['Tamil'], rating: 4.9, img: 'https://ui-avatars.com/api/?name=Mani+R&background=f59e0b&color=fff&size=120', bio: 'Expert in Tamil literature for TRB/TET exams.', category: 'gov_exams' },
    { id: 44, name: 'Prof. G. Reddy', role: 'GATE Electrical Expert', dept: 'GATE - EE', languages: ['English', 'Telugu'], rating: 4.8, img: 'https://ui-avatars.com/api/?name=G+Reddy&background=6366f1&color=fff&size=120', bio: 'Power systems and control engineering specialist.', category: 'entrance' },
    { id: 45, name: 'Dr. Manoj Kumar', role: 'Senior Dental Surgeon', dept: 'Dental (BDS/MDS)', languages: ['English', 'Hindi'], rating: 4.9, img: 'https://ui-avatars.com/api/?name=Manoj+Kumar&background=10b981&color=fff&size=120', bio: 'Expert in Maxillofacial surgery and MDS entrance coaching.', category: 'medical' },
    { id: 46, name: 'Dr. Shalini Sharma', role: 'Veterinary Surgeon', dept: 'Veterinary Science', languages: ['English', 'Hindi'], rating: 4.8, img: 'https://ui-avatars.com/api/?name=Shalini+Sharma&background=f59e0b&color=fff&size=120', bio: 'Specialist in livestock health and state vet exam prep.', category: 'medical' }
];

const MOCK_TESTS = [
    { id: 1, title: 'JEE Main Full Length Test 1', category: 'Entrance', duration: '3h', questions: 90, result: 85, date: '2026-03-10' },
    { id: 2, title: 'NEET Practice Mock 2026', category: 'Medical', duration: '3h 20m', questions: 200, result: 92, date: '2026-03-12' },
    { id: 3, title: 'SSC CGL Tier 1 Mock', category: 'Government', duration: '1h', questions: 100, result: 78, date: '2026-03-14' },
    { id: 4, title: 'UPSC General Studies I', category: 'Government', duration: '2h', questions: 100, result: null, date: 'Coming Soon' },
    { id: 5, title: 'Railway RRB ALP Stage 1', category: 'Government', duration: '1h', questions: 75, result: 88, date: '2026-03-15' },
    { id: 10, title: 'TNPSC Group 4 VAO Mock', category: 'Government', duration: '3h', questions: 200, result: null, date: 'Enroll Now' },
    { id: 14, title: 'Medical PG Orthopaedics Quiz', category: 'Medical', duration: '1h', questions: 50, result: 95, date: '2026-03-16' },
    { id: 15, title: 'Full Stack Exit Test', category: 'Academic', duration: '2h', questions: 20, result: null, date: 'Enroll' }
];

const PERFORMANCE_DATA = [
    { day: 'Mon', score: 65, studyHours: 4 },
    { day: 'Tue', score: 72, studyHours: 5 },
    { day: 'Wed', score: 68, studyHours: 6 },
    { day: 'Thu', score: 85, studyHours: 4 },
    { day: 'Fri', score: 90, studyHours: 7 },
    { day: 'Sat', score: 88, studyHours: 8 },
    { day: 'Sun', score: 92, studyHours: 5 }
];

const MentorshipHub = () => {
    const [activeCategory, setActiveCategory] = useState('academic');
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedLang, setSelectedLang] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Sync with query params
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const dept = params.get('dept');
        if (dept) setSelectedDept(dept);
        
        const cat = params.get('cat');
        if (cat) setActiveCategory(cat);
    }, []);

    const filteredMentors = MENTORS.filter(m => {
        const matchesCategory = m.category === activeCategory;
        const matchesDept = selectedDept === 'All' || m.dept === selectedDept;
        const matchesLang = selectedLang === 'All' || m.languages.includes(selectedLang);
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.role.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesDept && matchesLang && matchesSearch;
    });

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header Section */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <i className="fa-solid fa-users-viewfinder" style={{ color: '#6366f1' }}></i>
                        MENTORSHIP & MENTOR HUB
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Connect with global experts across 200+ academic, medical, and professional fields.</p>
                </div>
                <button 
                    onClick={() => setShowRegisterModal(true)}
                    style={{ padding: '15px 30px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    <i className="fa-solid fa-user-plus"></i>
                    Register as Mentor
                </button>
            </motion.div>

            {/* Categories Navigation */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => {
                            setActiveCategory(cat.id);
                            setSelectedDept('All');
                        }}
                        style={{ 
                            padding: '12px 24px', 
                            borderRadius: '16px', 
                            border: 'none', 
                            background: activeCategory === cat.id ? '#6366f1' : 'white',
                            color: activeCategory === cat.id ? 'white' : '#64748b',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: activeCategory === cat.id ? '0 10px 20px rgba(99,102,241,0.2)' : 'none',
                            transition: '0.3s'
                        }}
                    >
                        <i className={`fa-solid ${cat.icon}`}></i>
                        {cat.label}
                    </button>
                ))}
            </div>

            {activeCategory !== 'resources' && activeCategory !== 'reports' && (
                <>
                    {/* Filters Bar */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', marginBottom: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', fontSize: '0.9rem', color: '#0f172a' }}>Search Mentor</label>
                            <div style={{ position: 'relative' }}>
                                <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '15px', top: '15px', color: '#94a3b8' }}></i>
                                <input 
                                    type="text" 
                                    placeholder="Name or expertise..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ width: '100%', padding: '12px 15px 12px 45px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', fontSize: '0.9rem', color: '#0f172a' }}>Department / Sub-Category</label>
                            <select 
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600 }}
                            >
                                {DEPARTMENTS[activeCategory]?.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', fontSize: '0.9rem', color: '#0f172a' }}>Language</label>
                            <select 
                                value={selectedLang}
                                onChange={(e) => setSelectedLang(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600 }}
                            >
                                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Mentors Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {filteredMentors.length > 0 ? filteredMentors.map((mentor) => (
                            <motion.div 
                                key={mentor.id}
                                whileHover={{ y: -10 }}
                                style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
                            >
                                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <img src={mentor.img} alt={mentor.name} style={{ width: '80px', height: '80px', borderRadius: '20px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>{mentor.name}</h3>
                                        <p style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.9rem', margin: '2px 0 5px' }}>{mentor.role}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 800 }}>
                                            <i className="fa-solid fa-star"></i> {mentor.rating}
                                        </div>
                                    </div>
                                    <span style={{ background: '#f8fafc', padding: '5px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, alignSelf: 'start', color: '#94a3b8' }}>{mentor.dept}</span>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', minHeight: '60px' }}>{mentor.bio}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                                    {mentor.languages.map(l => (
                                        <span key={l} style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px' }}>{l}</span>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => setSelectedMentor(mentor)}
                                    style={{ width: '100%', padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', transition: '0.3s' }}
                                >
                                    Book Session
                                </button>
                            </motion.div>
                        )) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                <i className="fa-solid fa-users-slash" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                                <h3>No mentors found matching your criteria.</h3>
                            </div>
                        )}
                    </div>
                </>
            )}

            {activeCategory === 'reports' && (
                /* Performance & Reports Section */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ gridColumn: '1 / -1', background: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '5px' }}>Weekly Study Analytics</h2>
                                <p style={{ color: '#64748b' }}>A daily report of your performance and hours spent.</p>
                            </div>
                            <div style={{ background: '#f1f5f9', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, color: '#6366f1' }}>
                                Next Mock: Mar 22nd
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', height: '250px', padding: '0 1rem' }}>
                            {PERFORMANCE_DATA.map((d, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>{d.score}%</div>
                                    <motion.div 
                                        initial={{ height: 0 }} 
                                        animate={{ height: `${d.score}%` }} 
                                        style={{ width: '100%', maxWidth: '40px', background: 'linear-gradient(to top, #6366f1, #8b5cf6)', borderRadius: '10px 10px 4px 4px', boxShadow: '0 5px 15px rgba(99,102,241,0.2)' }} 
                                    />
                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{d.day}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div style={{ background: '#0f172a', color: 'white', padding: '2.5rem', borderRadius: '30px', boxShadow: '0 20px 40px rgba(15,23,42,0.1)' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>Daily Highlights</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ borderLeft: '4px solid #10b981', paddingLeft: '1.5rem' }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>09:00 AM</p>
                                <h4 style={{ margin: '5px 0' }}>UPSC GS Paper Mock Finished</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#10b981' }}>Score: 82% (Excellent)</p>
                            </div>
                            <div style={{ borderLeft: '4px solid #f59e0b', paddingLeft: '1.5rem' }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>02:30 PM</p>
                                <h4 style={{ margin: '5px 0' }}>Railway RRB Aptitude Study</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#f59e0b' }}>3 Hours Session Completed</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>Study Analysis Report</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['Logical Reasoning (Railway)', 'Physics Numericals (JEE)', 'Medical Ethics (MBBS)'].map(area => (
                                <div key={area} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 20px', borderRadius: '15px' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{area}</span>
                                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', color: '#94a3b8' }}></i>
                                </div>
                            ))}
                        </div>
                        <button style={{ width: '100%', marginTop: '2rem', padding: '15px', background: '#f1f5f9', border: 'none', borderRadius: '15px', fontWeight: 800, color: '#6366f1', cursor: 'pointer' }}>Generate Full Analysis PDF</button>
                    </div>
                </div>
            )}

            {activeCategory === 'resources' && (
                /* Mock Tests Section */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
                    {MOCK_TESTS.map(test => (
                        <motion.div 
                            key={test.id}
                            whileHover={{ scale: 1.02 }}
                            style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '2rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px' }}>
                                    <i className="fa-solid fa-file-invoice" style={{ color: '#6366f1' }}></i>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ background: '#e0e7ff', color: '#4338ca', fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', display: 'block', marginBottom: '5px' }}>{test.category}</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: test.result ? '#10b981' : '#94a3b8' }}>{test.result ? `Last Score: ${test.result}%` : test.date}</span>
                                </div>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1rem' }}>{test.title}</h3>
                            <div style={{ display: 'flex', gap: '20px', color: '#64748b', fontSize: '0.85rem', fontWeight: 700, marginBottom: '2rem' }}>
                                <span><i className="fa-regular fa-clock"></i> {test.duration}</span>
                                <span><i className="fa-solid fa-list-check"></i> {test.questions} Qs</span>
                            </div>
                            <button style={{ width: '100%', padding: '12px', background: test.result ? '#f8fafc' : '#6366f1', color: test.result ? '#0f172a' : 'white', border: test.result ? '1px solid #e2e8f0' : 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>
                                {test.result ? 'Retake Mock Test' : 'Start Mock Test'}
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Mentor Details Modal */}
            <AnimatePresence>
                {selectedMentor && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
                        onClick={() => setSelectedMentor(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            style={{ background: 'white', borderRadius: '32px', width: '100%', maxWidth: '600px', padding: '3rem', position: 'relative' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedMentor(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: '#f1f5f9', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <div style={{ textAlign: 'center' }}>
                                <img src={selectedMentor.img} alt={selectedMentor.name} style={{ width: '120px', height: '120px', borderRadius: '30px', marginBottom: '1.5rem', border: '5px solid #f8fafc' }} />
                                <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>{selectedMentor.name}</h1>
                                <p style={{ fontSize: '1.1rem', color: '#6366f1', fontWeight: 700, marginBottom: '2rem' }}>{selectedMentor.role} · {selectedMentor.dept}</p>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '20px', textAlign: 'center' }}>
                                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Session Mode</p>
                                        <h4 style={{ margin: '5px 0 0', fontWeight: 800 }}>Video Call</h4>
                                    </div>
                                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '20px', textAlign: 'center' }}>
                                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Price</p>
                                        <h4 style={{ margin: '5px 0 0', fontWeight: 800 }}>Free (Pro Member)</h4>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                                     <label style={{ display: 'block', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>Select Preferred Language</label>
                                     <div style={{ display: 'flex', gap: '10px' }}>
                                         {selectedMentor.languages.map(lang => (
                                             <button key={lang} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: '2px solid transparent', borderRadius: '12px', fontWeight: 700, color: '#475569' }}>
                                                 {lang}
                                             </button>
                                         ))}
                                     </div>
                                </div>

                                <button style={{ width: '100%', padding: '1.25rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(99,102,241,0.3)' }}>
                                    Confirm Booking
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Mentor Registration Modal */}
            <AnimatePresence>
                {showRegisterModal && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
                        onClick={() => setShowRegisterModal(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            style={{ background: 'white', borderRadius: '32px', width: '100%', maxWidth: '700px', pading: '3rem', position: 'relative', overflowY: 'auto', maxHeight: '90vh' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ padding: '3rem' }}>
                                <button onClick={() => setShowRegisterModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: '#f1f5f9', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                    <div style={{ width: '80px', height: '80px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>
                                        <i className="fa-solid fa-graduation-cap"></i>
                                    </div>
                                    <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Join as a Mentor</h1>
                                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Guide the next generation and share your expertise.</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>Full Name</label>
                                        <input type="text" placeholder="Dr./Prof. Name" style={{ width: '100%', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none', transition: '0.3s' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>Professional Role</label>
                                        <input type="text" placeholder="e.g. Senior Neurosurgeon" style={{ width: '100%', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none', transition: '0.3s' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>Department</label>
                                        <select style={{ width: '100%', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }}>
                                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>Years of Experience</label>
                                        <input type="number" placeholder="Years" style={{ width: '100%', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600 }} />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>LinkedIn / Portfolio Link</label>
                                    <input type="url" placeholder="https://linkedin.com/in/username" style={{ width: '100%', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600 }} />
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>Bio (Short introduction)</label>
                                    <textarea rows="3" placeholder="Explain how you can help students (e.g., crack NEET in Tamil, guide for UPSC, etc.)" style={{ width: '100%', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, resize: 'none' }}></textarea>
                                </div>

                                <button 
                                    onClick={() => {
                                        alert('Thank you for registering! Our verification team will review your application and documents within 48 hours.');
                                        setShowRegisterModal(false);
                                    }}
                                    style={{ width: '100%', padding: '1.25rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '18px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(16,185,129,0.3)', transition: '0.3s' }}
                                >
                                    Submit Application for Review
                                </button>
                                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>By submitting, you agree to our Mentor Guidelines and Verification Process.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MentorshipHub;
