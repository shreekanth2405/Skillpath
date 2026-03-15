import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Resources = () => {
    const navigate = useNavigate();

    // --- State Management ---
    const [activeTab, setActiveTab] = useState('library'); // 'library' | 'career'
    
    // Support deep-linking to tabs
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab === 'career') setActiveTab('career');
        else if (tab === 'library') setActiveTab('library');
    }, [window.location.search]);

    const [level, setLevel] = useState(1); // 1: Category, 2: SubCategory, 3: Subject/Books
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [bookmarkedGames, setBookmarkedGames] = useState({});
    const [jobSearch, setJobSearch] = useState('');

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/bookmarks`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.data.success) {
                    const loadedBookmarks = {};
                    res.data.data.forEach(b => {
                        loadedBookmarks[b.title] = b.id;
                    });
                    setBookmarkedGames(loadedBookmarks);
                }
            } catch (err) {
                console.error("Failed to fetch bookmarks:", err);
            }
        };
        fetchBookmarks();
    }, []);

    // --- Data Structure ---
    const libraryData = [
                {
                    title: 'Computer & IT', icon: 'fa-microchip', color: '#3b82f6',
                    subs: [
                        { title: 'Software Engineering', subjects: [{ name: 'Architecture', books: ['Clean Code', 'The Pragmatic Programmer', 'Design Patterns'] }] },
                        { title: 'Data Structures', subjects: [{ name: 'Algorithms', books: ['CLRS Introduction to Algorithms', 'Grokking Algorithms'] }] },
                        { title: 'AI & Data Science', subjects: [{ name: 'Machine Learning', books: ['Deep Learning by Goodfellow', 'Hands-on ML with Scikit-Learn'] }] },
                        { title: 'Cloud & DevOps', subjects: [{ name: 'Infrastructure', books: ['Site Reliability Engineering', 'Terraform Up & Running'] }] },
                        { title: 'Cybersecurity', subjects: [{ name: 'Security', books: ['The Web Application Hacker’s Handbook', 'Metasploit: The Penetration Tester\'s Guide'] }] }
                    ]
                },
                {
                    title: 'Mechanical & Robotics', icon: 'fa-robot', color: '#64748b',
                    subs: [
                        { title: 'Mechanical core', subjects: [{ name: 'Thermodynamics', books: ['Engineering Thermodynamics by P.K. Nag', 'Heat & Mass Transfer'] }] },
                        { title: 'Robotics', subjects: [{ name: 'Automation', books: ['Introduction to Robotics by John Craig', 'Robotics: Modelling, Planning and Control'] }] },
                        { title: 'Mechatronics', subjects: [{ name: 'Systems', books: ['Mechatronics by W. Bolton', 'Introduction to Mechatronics and Measurement Systems'] }] },
                        { title: 'Production', subjects: [{ name: 'Manufacturing', books: ['Production Technology by R.K. Jain', 'Manufacturing Process by P.N. Rao'] }] },
                        { title: 'Automotive', subjects: [{ name: 'Vehicle Eng', books: ['Automotive Engineering Fundamentals', 'Internal Combustion Engines by Ganesan'] }] }
                    ]
                },
                {
                    title: 'Civil & Architectural', icon: 'fa-city', color: '#0ea5e9',
                    subs: [
                        { title: 'Civil Core', subjects: [{ name: 'Structures', books: ['Structural Analysis by Hibbeler', 'Mechanics of Solids'] }] },
                        { title: 'Architecture', subjects: [{ name: 'Design', books: ['The Architecture of Happiness', 'A Pattern Language'] }] },
                        { title: 'Geotechnical', subjects: [{ name: 'Soil Mechanics', books: ['Basic and Applied Soil Mechanics', 'Geotechnical Engineering by C. Venkatramaiah'] }] },
                        { title: 'Transportation', subjects: [{ name: 'Highways', books: ['Highway Engineering by Khanna & Justo', 'Traffic Engineering'] }] },
                        { title: 'Water Resources', subjects: [{ name: 'Hydrology', books: ['Engineering Hydrology by K. Subramanya', 'Irrigation Engineering'] }] }
                    ]
                },
                {
                    title: 'Electrical & ECE', icon: 'fa-bolt', color: '#eab308',
                    subs: [
                        { title: 'Electrical Core', subjects: [{ name: 'Power Systems', books: ['Electrical Technology by Theraja', 'Power System Engineering by Kothari'] }] },
                        { title: 'Electronics', subjects: [{ name: 'VLSI & Circuits', books: ['Digital Design by Morris Mano', 'Microelectronic Circuits by Sedra Smith'] }] },
                        { title: 'Telecom', subjects: [{ name: 'Communications', books: ['Communication Systems by Simon Haykin', 'Wireless Communications'] }] },
                        { title: 'Control Systems', subjects: [{ name: 'Automation', books: ['Control Systems Engineering by Norman Nise', 'Modern Control Engineering'] }] },
                        { title: 'Signals', subjects: [{ name: 'DSP', books: ['Digital Signal Processing by Proakis', 'Signals and Systems by Oppenheim'] }] }
                    ]
                },
                {
                    title: 'Aerospace & Defense', icon: 'fa-plane-departure', color: '#6366f1',
                    subs: [
                        { title: 'Aerospace Core', subjects: [{ name: 'Aeronautics', books: ['Introduction to Flight by John Anderson', 'Fundamentals of Aerodynamics'] }] },
                        { title: 'Propulsion', subjects: [{ name: 'Jet Engines', books: ['Elements of Propulsion', 'Gas Turbine Theory'] }] },
                        { title: 'Avionics', subjects: [{ name: 'Flight Tech', books: ['Avionics Systems', 'Digital Avionics Systems'] }] },
                        { title: 'Satellite Eng', subjects: [{ name: 'Spacecraft', books: ['Orbital Mechanics for Engineering Students', 'Space Mission Engineering'] }] },
                        { title: 'Renewable Energy', subjects: [{ name: 'Green Tech', books: ['Renewable Energy Engineering', 'Solar Engineering of Thermal Processes'] }] }
                    ]
                },
                {
                    title: 'Chemical & Materials', icon: 'fa-flask', color: '#10b981',
                    subs: [
                        { title: 'Chemical Core', subjects: [{ name: 'Process Eng', books: ['McCabe Smith Unit Operations', 'Chemical Reaction Engineering'] }] },
                        { title: 'Materials Science', subjects: [{ name: 'Crystallography', books: ['Callister’s Materials Science', 'Materials Science and Engineering'] }] },
                        { title: 'Petroleum', subjects: [{ name: 'Oil & Gas', books: ['Applied Petroleum Reservoir Engineering', 'Drilling Engineering'] }] },
                        { title: 'Metallurgy', subjects: [{ name: 'Metals', books: ['Physical Metallurgy Principles', 'Extraction of Nonferrous Metals'] }] },
                        { title: 'Nanotechnology', subjects: [{ name: 'Nano Eng', books: ['Introduction to Nanotechnology', 'Nanomaterials'] }] }
                    ]
                },
                {
                    title: 'Bio & Environmental', icon: 'fa-leaf', color: '#22c55e',
                    subs: [
                        { title: 'Biomedical', subjects: [{ name: 'Medical Devices', books: ['Biomedical Instrumentation', 'Principles of Anatomy and Physiology'] }] },
                        { title: 'Biotech Eng', subjects: [{ name: 'Gene Eng', books: ['Bioprocess Engineering Principles', 'Molecular Biotechnology'] }] },
                        { title: 'Environmental', subjects: [{ name: 'Sustainability', books: ['Environmental Engineering by Metcalf & Eddy', 'Waste Water Engineering'] }] },
                        { title: 'Agricultural', subjects: [{ name: 'Farm Tech', books: ['Elements of Agricultural Engineering', 'Principles of Farm Machinery'] }] },
                        { title: 'Marine Eng', subjects: [{ name: 'Ocean Systems', books: ['Introduction to Marine Engineering', 'Ship Knowledge'] }] }
                    ]
                },
                {
                    title: 'Specialized & Future', icon: 'fa-atom', color: '#f43f5e',
                    subs: [
                        { title: 'Nuclear Eng', subjects: [{ name: 'Radiation', books: ['Introduction to Nuclear Engineering', 'Nuclear Reactor Analysis'] }] },
                        { title: 'Textile Eng', subjects: [{ name: 'Fabrics', books: ['Textile Mathematics', 'Principles of Textile Testing'] }] },
                        { title: 'Mining Eng', subjects: [{ name: 'Extraction', books: ['Introductory Mining Engineering', 'Rock Mechanics'] }] },
                        { title: 'Systems Eng', subjects: [{ name: 'Optimization', books: ['Systems Engineering and Analysis', 'Operations Research'] }] },
                        { title: 'Industrial Eng', subjects: [{ name: 'Management', books: ['Industrial Engineering and Management by O.P. Khanna', 'Work Study'] }] }
                    ]
                },
                {
                    title: 'Exams & Competitive', icon: 'fa-graduation-cap', color: '#0ea5e9',
                    subs: [
                        { title: 'Engineering GATE', subjects: [{ name: 'CS & IT', books: ['GATE Computer Science by Arihant', 'GATE Engineering Mathematics'] }] },
                        { title: 'JEE & NEET', subjects: [{ name: 'Advanced Prep', books: ['Concepts of Physics by H.C. Verma', 'Organic Chemistry by Morrison Boyd', 'Biology NCERT'] }] },
                        { title: 'Civil Services', subjects: [{ name: 'UPSC', books: ['Indian Polity by M. Laxmikanth', 'History of Modern India'] }] }
                    ]
                },
                {
                    title: 'Commerce & Business', icon: 'fa-chart-pie', color: '#10b981',
                    subs: [
                        { title: 'Economics', subjects: [{ name: 'Global Finance', books: ['Principles of Economics by Mankiw', 'Wealth of Nations'] }] },
                        { title: 'Business', subjects: [{ name: 'Management', books: ['Marketing Management by Kotler', 'The Lean Startup'] }] }
                    ]
                },
                {
                    title: 'Medical & Clinial', icon: 'fa-staff-snake', color: '#f43f5e',
                    subs: [
                        { title: 'Core Medicine', subjects: [{ name: 'Anatomy', books: ['Gray’s Anatomy', 'Harrison\'s Internal Medicine'] }] },
                        { title: 'Pharmacology', subjects: [{ name: 'Drugs', books: ['Katzung Pharmacology', 'Goodman & Gilman'] }] }
                    ]
                },
                { 
                    title: 'Novels & Growth', icon: 'fa-book-open', color: '#ec4899', 
                    subs: [
                        { title: 'Classics', subjects: [{ name: 'Literature', books: ['1984 by George Orwell', 'The Great Gatsby'] }] },
                        { title: 'Self Growth', subjects: [{ name: 'Mindset', books: ['Atomic Habits', 'Thinking, Fast and Slow'] }] }
                    ] 
                }
            ];

    const jobPortals = [
        // Top Tiers
        { name: 'Naukri', icon: 'fa-solid fa-user-tie', color: '#4a90e2', url: 'https://www.naukri.com', category: 'Premium' },
        { name: 'LinkedIn', icon: 'fa-brands fa-linkedin', color: '#0077b5', url: 'https://www.linkedin.com/jobs', category: 'Premium' },
        { name: 'Indeed', icon: 'fa-solid fa-briefcase', color: '#2557a7', url: 'https://www.indeed.com', category: 'Premium' },
        { name: 'Glassdoor', icon: 'fa-solid fa-building', color: '#08a05c', url: 'https://www.glassdoor.com', category: 'Premium' },

        // Tech & Specialized
        { name: 'Hired', icon: 'fa-solid fa-code-merge', color: '#6366f1', url: 'https://hired.com', category: 'Tech' },
        { name: 'Wellfound (AngelList)', icon: 'fa-brands fa-angellist', color: '#ff4f4f', url: 'https://wellfound.com/jobs', category: 'Tech' },
        { name: 'Dice', icon: 'fa-solid fa-dice-d20', color: '#cc0000', url: 'https://www.dice.com', category: 'Tech' },
        { name: 'Stack Overflow', icon: 'fa-brands fa-stack-overflow', color: '#f48024', url: 'https://stackoverflow.com/jobs', category: 'Tech' },

        // Remote & Global
        { name: 'Remote.co', icon: 'fa-solid fa-globe', color: '#37a7e8', url: 'https://remote.co/remote-jobs', category: 'Remote' },
        { name: 'We Work Remotely', icon: 'fa-solid fa-laptop-house', color: '#eb4b23', url: 'https://weworkremotely.com', category: 'Remote' },
        { name: 'FlexJobs', icon: 'fa-solid fa-calendar-check', color: '#165c7d', url: 'https://www.flexjobs.com', category: 'Remote' },
        { name: 'Workana', icon: 'fa-solid fa-globe-americas', color: '#314555', url: 'https://www.workana.com', category: 'Remote' },

        // General Indian Portals
        { name: 'Apna', icon: 'fa-solid fa-mobile-screen-button', color: '#25D366', url: 'https://apna.co', category: 'General' },
        { name: 'Shine', icon: 'fa-solid fa-sun', color: '#fdd835', url: 'https://www.shine.com', category: 'General' },
        { name: 'Freshersworld', icon: 'fa-solid fa-user-graduate', color: '#ff7043', url: 'https://www.freshersworld.com', category: 'General' },
        { name: 'TimesJobs', icon: 'fa-solid fa-newspaper', color: '#1e88e5', url: 'https://www.timesjobs.com', category: 'General' },
        { name: 'Naukri Gulf', icon: 'fa-solid fa-plane-up', color: '#1565c0', url: 'https://www.naukrigulf.com', category: 'General' },
        { name: 'Youth4work', icon: 'fa-solid fa-users-viewfinder', color: '#00d084', url: 'https://www.youth4work.com', category: 'General' },
        { name: 'Jooble', icon: 'fa-solid fa-magnifying-glass-location', color: '#f9a825', url: 'https://jooble.org', category: 'General' }
    ];

    const trendingJobs = [
        { title: 'AI Developer', salary: '₹12L - ₹30L', tags: ['Python', 'LLM', 'PyTorch'] },
        { title: 'Full Stack Engineer', salary: '₹8L - ₹18L', tags: ['React', 'Node.js', 'PostgreSQL'] },
        { title: 'Data Scientist', salary: '₹10L - ₹25L', tags: ['Pandas', 'ML', 'SQL'] },
        { title: 'DevOps Architect', salary: '₹15L - ₹35L', tags: ['Docker', 'AWS', 'K8s'] }
    ];

    const pdfLinks = {
        // Computer Science & DSA
        'Introduction to Algorithms by Thomas H. Cormen (CLRS)': 'https://web.mit.edu/6.c67/www/Textbook/Introduction_to_Algorithms_3rd_Edition.pdf',
        'Grokking Algorithms by Aditya Bhargava': 'https://edu.anarcho-copy.org/Algorithm/grokking-algorithms-illustrated-guide-programmers-curious.pdf',
        'The Algorithm Design Manual by Steven Skiena': 'https://archive.org/download/the-algorithm-design-manual/TheAlgorithmDesignManual.pdf',
        'Cracking the Coding Interview by Gayle Laakmann McDowell': 'https://archive.org/download/cracking-the-coding-interview-6th-edition-gayle-laakmann-mcdowell/cracking-the-coding-interview-6th-edition-189-programming-questions-and-solutions.pdf',
        'Clean Code by Robert C. Martin': 'https://archive.org/download/CleanCode/Clean_Code.pdf',
        'The Pragmatic Programmer by Andrew Hunt': 'https://archive.org/download/the-pragmatic-programmer-20th-anniversity-edition-2nd-edition-by-andrew-hunt-dav/The%20Pragmatic%20Programmer%2020th%20Anniversity%20Edition%2C%202nd%20Edition%20%28by%20Andrew%20Hunt%2C%20David%20Thomas%29.pdf',
        'Eloquent JavaScript by Marijn Haverbeke': 'https://eloquentjavascript.net/Eloquent_JavaScript.pdf',
        'Thinking, Fast and Slow by Daniel Kahneman': 'https://archive.org/download/ThinkingFastAndSlow_201702/Thinking%2C%20Fast%20and%20Slow.pdf',
        'Atomic Habits by James Clear': 'https://jamesclear.com/wp-content/uploads/2018/10/Atomic-Habits-Summary.pdf',
        'Deep Work by Cal Newport': 'https://archive.org/download/deep-work-rules-for-focused-success-in-a-distracted-world-pdf-drive/Deep%20Work%20Rules%20for%20Focused%20Success%20in%20a%20Distracted%20World%20%28%20PDFDrive%20%29.pdf',
        'Site Reliability Engineering by Google': 'https://sre.google/static/pdf/sre-book-single-page.pdf',
        'Don’t Make Me Think by Steve Krug': 'https://archive.org/download/dont-make-me-think-revisited-a-common-sense-approach-to-web-usability/Don%27t%20Make%20Me%20Think%2C%20Revisited%20A%20Common%20Sense%20Approach%20to%20Web%20Usability.pdf',
        'The Design of Everyday Things by Don Norman': 'https://archive.org/download/the-design-of-everyday-things-revised-and-expanded-edition-by-don-norman/The%20Design%20of%20Everyday%20Things%2C%20Revised%20and%20Expanded%20Edition%20by%20Don%20Norman.pdf',
        'The Intelligent Investor by Benjamin Graham': 'https://archive.org/download/the-intelligent-investor-english-benjamin-graham/The%20Intelligent%20Investor%20%28English%2C%20Benjamin%20Graham%29.pdf',
        'Rich Dad Poor Dad by Robert Kiyosaki': 'https://archive.org/download/RichDadPoorDad_201607/Rich%20Dad%20Poor%20Dad.pdf',
        '1984 by George Orwell': 'https://archive.org/download/GeorgeOrwell1984_201804/George%20Orwell%20-%201984.pdf',
        'Zero to One by Peter Thiel': 'https://archive.org/download/ZeroToOneNotesOnStartupsOrHowToBuildTheFuture/Zero%20to%20One_%20Notes%20on%20Startups%2C%20or%20How%20to%20Build%20the%20Future.pdf',
        'Clean Architecture by Robert C. Martin': 'https://archive.org/download/CleanArchitectureARaftsmansGuideToSoftwareStructureAndDesign/Clean%20Architecture_%20A%20Craftsman%27s%20Guide%20to%20Software%20Structure%20and%20Design.pdf',
        'Beyond Good and Evil by Nietzsche': 'https://www.gutenberg.org/files/4363/4363-h/4363-h.htm',
        'The Republic by Plato': 'https://www.gutenberg.org/cache/epub/1497/pg1497-images.html',
        'Meditations by Marcus Aurelius': 'https://dev.gutenberg.org/cache/epub/264/pg264-images.html',
        'The Great Gatsby': 'https://www.gutenberg.org/cache/epub/64317/pg64317-images.html',
        'To Kill a Mockingbird': 'https://archive.org/download/ToKillAMockingbird_201904/To%20Kill%20a%20Mockingbird.pdf',
        'Dune by Frank Herbert': 'https://archive.org/download/dune-frank-herbert_202107/Dune%20-%20Frank%20Herbert.pdf',
        'The Hobbit': 'https://archive.org/download/the-hobbit-j.-r.-r.-tolkien/The%20Hobbit%20-%20J.R.R.%20Tolkien.pdf',
        'Man\'s Search for Meaning': 'https://archive.org/download/mans-search-for-meaning-viktor-e.-frankl/Man%27s%20Search%20For%20Meaning%20-%20Viktor%20E.%20Frankl.pdf',
        'The Power of Now': 'https://archive.org/download/the-power-of-now-eckhart-tolle_202102/The%20Power%20of%20Now%20-%20Eckhart%20Tolle.pdf',
        'Indian Polity by M. Laxmikanth': 'https://archive.org/download/indian-polity-6th-edition-by-m.-laxmikanth/Indian%20Polity%206th%20Edition%20by%20M.%20Laxmikanth.pdf',
        'Concepts of Physics by H.C. Verma': 'https://archive.org/download/conceptsofphysicsvol1h.c.verma_202003/Concepts%20of%20Physics%20Vol%201%20H.C.%20Verma.pdf',
        'Principles of Economics by N. Gregory Mankiw': 'https://archive.org/download/principles-of-economics-n.-gregory-mankiw-8th-edition/Principles%20of%20Economics%20N.%20Gregory%20Mankiw%208th%20Edition.pdf',
        'Molecular Biology of the Cell by Alberts': 'https://archive.org/download/MolecularBiologyOfTheCell6thEdition/Molecular%20Biology%20of%20the%20Cell%206th%20Edition.pdf',
        'Wealth of Nations by Adam Smith': 'https://www.gutenberg.org/files/3300/3300-h/3300-h.htm',
        'Principles by Ray Dalio': 'https://archive.org/download/principles-life-and-work/Principles%20-%20Life%20and%20Work.pdf',
        'Silent Spring by Rachel Carson': 'https://archive.org/download/SilentSpringByRachelCarson/Silent%20Spring%20by%20Rachel%20Carson.pdf',
        'Sapiens: A Brief History of Humankind': 'https://archive.org/download/2011YuvalNoahHarariSapiensABriefHistoryOfHumankind/2011%20Yuval%20Noah%20Harari%20-%20Sapiens%20A%20Brief%20History%20Of%20Humankind.pdf',
        'Contract Law by Pollock & Mulla': 'https://archive.org/download/pollockmullaonth00polluoft/pollockmullaonth00polluoft.pdf',
        'Engineering Mechanics by Meriam & Kraige': 'https://archive.org/download/engineering-mechanics-dynamics-by-j.-l.-meriam-l.-g.-kraige-6th-edition/Engineering%20Mechanics%20Dynamics%20By%20J.%20L.%20Meriam%2C%20L.%20G.%20Kraige%206th%20Edition.pdf',
        'Nicomachean Ethics by Aristotle': 'https://www.gutenberg.org/files/4300/4300-h/4300-h.htm',
        'Engineering Thermodynamics by P.K. Nag': 'https://archive.org/download/engineering-thermodynamics-p.-k.-nag/Engineering%20Thermodynamics%20-%20P.%20K.%20Nag.pdf',
        'Structural Analysis by Hibbeler': 'https://archive.org/download/structural-analysis-8th-edition-r.-c.-hibbeler/Structural%20Analysis%208th%20Edition%20R.%20C.%20Hibbeler.pdf',
        'Introduction to Robotics by John Craig': 'https://archive.org/download/introduction-to-robotics-mechanics-and-control-3rd-edition/Introduction%20to%20Robotics%20Mechanics%20and%20Control%203rd%20Edition.pdf',
        'Signals and Systems by Oppenheim': 'https://archive.org/download/AlanV.OppenheimAlanS.WillskyWithS.HamidSignalsAndSystemsPrenticeHall1996/Alan%20V.%20Oppenheim%2C%20Alan%20S.%20Willsky%20with%20S.%20Hamid%20-%20Signals%20and%20Systems-Prentice%20Hall%20%281996%29.pdf',
        'Industrial Engineering and Management by O.P. Khanna': 'https://archive.org/download/industrial-engineering-and-management-by-o.-p.-khanna/Industrial%20Engineering%20and%20Management%20by%20O.%20P.%20Khanna.pdf'
    };

    // --- Action Handlers ---
    const handleCategoryClick = (cat) => { setSelectedCategory(cat); setLevel(2); };
    const handleSubCategoryClick = (sub) => { setSelectedSubCategory(sub); setLevel(3); };
    const handleBack = () => {
        if (level === 2) { setSelectedCategory(null); setLevel(1); }
        else if (level === 3) { setSelectedSubCategory(null); setLevel(2); }
    };

    const toggleBookmark = async (e, book, categoryContext) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };
        try {
            if (bookmarkedGames[book]) {
                await axios.delete(`${import.meta.env.VITE_API_URL}/v1/bookmarks/${bookmarkedGames[book]}`, { headers });
                setBookmarkedGames(prev => { const n = { ...prev }; delete n[book]; return n; });
            } else {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/v1/bookmarks`, { title: book, category: categoryContext }, { headers });
                if (res.data.success) setBookmarkedGames(prev => ({ ...prev, [book]: res.data.data.id }));
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <button
                    onClick={() => setActiveTab('library')}
                    style={{
                        background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer',
                        color: activeTab === 'library' ? '#3b82f6' : '#94a3b8', transition: '0.3s',
                        borderBottom: activeTab === 'library' ? '3px solid #3b82f6' : '3px solid transparent',
                        paddingBottom: '1rem', marginBottom: '-1.1rem'
                    }}
                >
                    <i className="fa-solid fa-book-open" style={{ marginRight: '10px' }}></i>
                    Digital Library
                </button>
                <button
                    onClick={() => setActiveTab('career')}
                    style={{
                        background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer',
                        color: activeTab === 'career' ? '#3b82f6' : '#94a3b8', transition: '0.3s',
                        borderBottom: activeTab === 'career' ? '3px solid #3b82f6' : '3px solid transparent',
                        paddingBottom: '1rem', marginBottom: '-1.1rem'
                    }}
                >
                    <i className="fa-solid fa-briefcase" style={{ marginRight: '10px' }}></i>
                    Job & Career Hub
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'library' ? (
                    <motion.div key="library" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        {/* Header Area */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                            {level > 1 && (
                                <button onClick={handleBack} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                            )}
                            <div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>
                                    {level === 1 ? "Resources Library" : level === 2 ? selectedCategory.title : selectedSubCategory.title}
                                </h1>
                                <p style={{ margin: 0, color: '#64748b' }}>Discover academic books, research papers, and growth guides.</p>
                            </div>
                        </div>

                        {level === 1 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                {libraryData.map((cat, i) => (
                                    <motion.div key={i} whileHover={{ y: -5 }} onClick={() => handleCategoryClick(cat)}
                                        style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', cursor: 'pointer', boxShadow: '0 8px 30px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '1.5rem', transition: '0.3s' }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `${cat.color}15`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                            <i className={`fa-solid ${cat.icon}`}></i>
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>{cat.title}</h3>
                                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>{cat.subs.length} Domains</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {level === 2 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                                {selectedCategory.subs.map((sub, i) => (
                                    <motion.div key={i} whileHover={{ y: -5 }} onClick={() => handleSubCategoryClick(sub)}
                                        style={{ background: 'white', padding: '1.5rem 2rem', borderRadius: '20px', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{sub.title}</span>
                                        <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1' }}></i>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {level === 3 && (
                            <div>
                                {selectedSubCategory.subjects.map((subj, i) => (
                                    <div key={i} style={{ marginBottom: '3rem' }}>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '4px', height: '24px', background: '#3b82f6', borderRadius: '2px' }}></div>
                                            {subj.name}
                                        </h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
                                            {subj.books.map((book, j) => (
                                                <motion.div key={j} whileHover={{ y: -8 }} style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                                     <div style={{ height: '180px', background: 'linear-gradient(135deg, #1e293b, #334155)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center', position: 'relative' }}>
                                                         {pdfLinks[book] && (
                                                             <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#10b981', color: 'white', fontSize: '10px', fontWeight: 900, padding: '4px 8px', borderRadius: '4px', letterSpacing: '1px' }}>LIVE PDF</div>
                                                         )}
                                                         <i className="fa-solid fa-book-open" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '2.5rem', marginBottom: '1rem' }}></i>
                                                         <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{book}</span>
                                                     </div>
                                                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{book}</h4>
                                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                                         <button 
                                                             onClick={() => {
                                                                 const [title, author] = book.split(' by ');
                                                                 const encodedTitle = encodeURIComponent(title);
                                                                 const encodedAuthor = encodeURIComponent(author || 'Unknown');
                                                                 // Use real PDF if available, otherwise fallback to placeholder
                                                                 const pdfUrl = pdfLinks[book] || `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`; 
                                                                 navigate(`/book-reader?title=${encodedTitle}&author=${encodedAuthor}&url=${encodeURIComponent(pdfUrl)}`);
                                                             }} 
                                                             style={{ flex: 1, padding: '8px', background: '#e2e8f0', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                                                         >
                                                             Read
                                                         </button>
                                                        <a href={`https://archive.org/search.php?query=${encodeURIComponent(book)}+AND+mediatype:texts`} target="_blank" rel="noreferrer" style={{ flex: 1.5, textDecoration: 'none', textAlign: 'center', padding: '8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                                            <i className="fa-solid fa-download"></i> Archive
                                                        </a>
                                                        <button onClick={(e) => toggleBookmark(e, book, selectedSubCategory.title)} style={{ width: '40px', background: bookmarkedGames[book] ? '#3b82f6' : '#f8fafc', color: bookmarkedGames[book] ? 'white' : '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                                                            <i className={bookmarkedGames[book] ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="career" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        {/* Search Hero */}
                        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '4rem 2rem', borderRadius: '30px', textAlign: 'center', color: 'white', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
                            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>Find Your Dream Job</h1>
                            <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '2.5rem' }}>Search across LinkedIn, Naukri, and 10+ major portals using AI Prediction.</p>
                            
                            <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px', backdropFilter: 'blur(10px)' }}>
                                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '20px', color: '#64748b' }}></i>
                                    <input
                                        type="text"
                                        placeholder="Job title, keywords, or company..."
                                        value={jobSearch}
                                        onChange={(e) => setJobSearch(e.target.value)}
                                        style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', background: 'white', border: 'none', borderRadius: '14px', fontSize: '1.1rem', outline: 'none', color: '#0f172a' }}
                                    />
                                </div>
                                <button
                                    onClick={() => navigate(`/career/jobs?q=${encodeURIComponent(jobSearch)}`)}
                                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0 2.5rem', borderRadius: '14px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', transition: '0.3s' }}
                                >
                                    Predict Jobs
                                </button>
                            </div>
                        </div>

                        {/* Portal Integration Cards */}
                        <div style={{ marginBottom: '4rem' }}>
                            {['Premium', 'Tech', 'Remote', 'General'].map(cat => (
                                <div key={cat} style={{ marginBottom: '2.5rem' }}>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '3px', height: '20px', background: cat === 'Premium' ? '#3b82f6' : cat === 'Tech' ? '#10b981' : cat === 'Remote' ? '#ec4899' : '#f59e0b', borderRadius: '2px' }}></div>
                                        {cat} Portals
                                    </h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
                                        {jobPortals.filter(p => p.category === cat).map((portal) => (
                                            <motion.a
                                                key={portal.name}
                                                href={portal.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                whileHover={{ y: -5, background: '#f8fafc', borderColor: portal.color }}
                                                style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '18px', textAlign: 'center', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: '0.3s' }}
                                            >
                                                <div style={{ width: '45px', height: '45px', borderRadius: '10px', background: `${portal.color}15`, color: portal.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                                    <i className={portal.icon}></i>
                                                </div>
                                                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{portal.name}</span>
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trending Jobs & Market Analysis */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', color: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    Trending Roles
                                    <span style={{ fontSize: '0.9rem', color: '#3b82f6', cursor: 'pointer' }}>View All &rarr;</span>
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {trendingJobs.map((job, i) => (
                                        <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 5px 0' }}>{job.title}</h3>
                                                <p style={{ color: '#10b981', fontWeight: 700, margin: '0 0 10px 0' }}>{job.salary}</p>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    {job.tags.map(t => <span key={t} style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', color: '#64748b', fontWeight: 700 }}>{t}</span>)}
                                                </div>
                                            </div>
                                            <button onClick={() => navigate('/career/jobs')} style={{ background: '#f1f5f9', border: 'none', color: '#0f172a', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>Details</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '1.5rem' }}>AI Market Insights</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '5px' }}>Weekly Job Growth</p>
                                        <h4 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: '#3b82f6' }}>+24.5%</h4>
                                    </div>
                                    <div style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '5px' }}>Top Required Skill</p>
                                        <h4 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: '#10b981' }}>Large Language Models</h4>
                                    </div>
                                    <div style={{ marginTop: 'auto', textAlign: 'center', padding: '1rem', background: '#3b82f6', color: 'white', borderRadius: '16px', cursor: 'pointer' }} onClick={() => navigate('/career/resume')}>
                                        <h4 style={{ margin: 0 }}>Resume AI Audit</h4>
                                        <p style={{ fontSize: '0.75rem', margin: '5px 0 0 0' }}>Check your ATS Visibility</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                input::placeholder { color: #94a3b8; }
            `}</style>
        </div>
    );
};

export default Resources;
