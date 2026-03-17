import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, 
    Target, 
    TrendingUp, 
    Compass, 
    FileText, 
    MapPin, 
    Globe, 
    Zap, 
    GraduationCap, 
    Code, 
    Search,
    Filter,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Bell,
    Bookmark,
    Plus,
    BarChart3,
    PieChart as PieChartIcon,
    DollarSign,
    Award
} from 'lucide-react';
import { 
    ResponsiveContainer, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Cell,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from 'recharts';
import axios from 'axios';

const JobFitAnalyzer = ({ setActiveTab: appSetActiveTab }) => {
    const [activeSection, setActiveSection] = useState('matches'); // 'matches', 'gap', 'growth', 'tracking'
    const [loading, setLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [growthPrediction, setGrowthPrediction] = useState(null);
    const [filters, setFilters] = useState({
        type: 'All', // All, Full-time, Internship
        location: 'All', // Global, India, USA, etc.
        remote: false
    });

    const API_URL = `${import.meta.env.VITE_API_URL}/v1`;

    const axiosInstance = axios.create({
        baseURL: API_URL,
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // In a real app, we'd fetch actual user data and job matches
            // const userRes = await axiosInstance.get('/users/profile');
            // setUserProfile(userRes.data.data);

            const matchRes = await axiosInstance.get('/jobs/matches');
            setJobs(matchRes.data.data);

            const growthRes = await axiosInstance.get('/jobs/growth-prediction');
            setGrowthPrediction(growthRes.data.data);


            // Mock profile if not found
            setUserProfile({
                name: "Alex Johnson",
                role: "Full Stack Developer",
                skills: ["React", "Node.js", "Python", "PostgreSQL", "JavaScript"],
                location: "Bangalore, India",
                lastAnalysis: "2026-03-15",
                overallFit: 84
            });

        } catch (err) {
            console.error("Error fetching job fit data", err);
        } finally {
            setLoading(false);
        }
    };

    const runAIAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            await axiosInstance.post('/jobs/scan', { role: userProfile?.role || 'Software Engineer' });
            await fetchData();
        } catch (err) {
            console.error("Analysis failed", err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const radarData = [
        { subject: 'Frontend', A: 90, fullMark: 100 },
        { subject: 'Backend', A: 85, fullMark: 100 },
        { subject: 'Cloud', A: 65, fullMark: 100 },
        { subject: 'DevOps', A: 40, fullMark: 100 },
        { subject: 'Database', A: 80, fullMark: 100 },
        { subject: 'AI/ML', A: 50, fullMark: 100 },
    ];

    const gapData = [
        { name: 'Kubernetes', gap: 70, color: '#ef4444' },
        { name: 'Go-lang', gap: 50, color: '#f59e0b' },
        { name: 'AWS Lambda', gap: 30, color: '#3b82f6' },
        { name: 'System Design', gap: 20, color: '#10b981' },
    ];

    const filteredJobs = jobs.filter(j => {
        const typeMatch = filters.type === 'All' || (filters.type === 'Internship' && j.job.isInternship) || (filters.type === 'Full-time' && !j.job.isInternship);
        const remoteMatch = !filters.remote || j.job.location.some(l => l.toLowerCase().includes('remote'));
        const locationMatch = filters.location === 'All' || j.job.country === filters.location;
        return typeMatch && remoteMatch && locationMatch;
    });

    const styles = {
        container: {
            padding: '2rem',
            maxWidth: '1400px',
            margin: '0 auto',
            fontFamily: "'Inter', sans-serif",
            color: '#e2e8f0',
            background: '#0f172a',
            minHeight: '100vh',
            borderRadius: '24px',
            marginTop: '1rem',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        },
        sidebar: {
            width: '280px',
            borderRight: '1px solid rgba(255,255,255,0.1)',
            paddingRight: '2rem'
        },
        mainContent: {
            flex: 1,
            paddingLeft: '2rem'
        },
        navItem: (active) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            cursor: 'pointer',
            background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            color: active ? '#3b82f6' : '#94a3b8',
            fontWeight: active ? '700' : '500',
            transition: '0.3s',
            marginBottom: '8px',
            border: active ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent'
        }),
        card: {
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)'
        },
        scoreBadge: (score) => ({
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '0.8rem',
            fontWeight: '800',
            background: score > 85 ? 'rgba(16, 185, 129, 0.1)' : score > 70 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            color: score > 85 ? '#10b981' : score > 70 ? '#3b82f6' : '#f59e0b',
            border: `1px solid ${score > 85 ? 'rgba(16, 185, 129, 0.2)' : score > 70 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
        })
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: 'white' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Zap size={48} color="#3b82f6" fill="#3b82f6" />
                </motion.div>
                <h2 style={{ marginLeft: '20px', fontWeight: 800 }}>Initializing AI Engine...</h2>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {appSetActiveTab && (
                        <button 
                            onClick={() => appSetActiveTab('dashboard')}
                            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}
                        >
                            <Compass size={24} />
                        </button>
                    )}
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
                            Job Fit <span style={{ color: '#3b82f6' }}>Analyzer</span>
                        </h1>
                        <p style={{ color: '#94a3b8', marginTop: '4px' }}>AI-Powered career matching & growth engine for SkillPark AI</p>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>OVERALL JOB FIT</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#3b82f6' }}>{userProfile.overallFit}%</div>
                    </div>
                    <button 
                        onClick={runAIAnalysis}
                        disabled={isAnalyzing}
                        style={{ 
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
                            border: 'none', 
                            color: 'white', 
                            padding: '12px 24px', 
                            borderRadius: '14px', 
                            fontWeight: '800', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.4)'
                        }}
                    >
                        {isAnalyzing ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Zap size={20} /></motion.div> : <Zap size={20} />}
                        {isAnalyzing ? 'Analyzing...' : 'Scan For Better Fits'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex' }}>
                {/* Sidebar Navigation */}
                <div style={styles.sidebar}>
                    <div style={styles.navItem(activeSection === 'matches')} onClick={() => setActiveSection('matches')}>
                        <Target size={20} /> Smart Matches
                    </div>
                    <div style={styles.navItem(activeSection === 'gap')} onClick={() => setActiveSection('gap')}>
                        <BarChart3 size={20} /> Skill Gap Analysis
                    </div>
                    <div style={styles.navItem(activeSection === 'growth')} onClick={() => setActiveSection('growth')}>
                        <TrendingUp size={20} /> Growth Prediction
                    </div>
                    <div style={styles.navItem(activeSection === 'tracking')} onClick={() => setActiveSection('tracking')}>
                        <Bookmark size={20} /> Saved & Applied
                    </div>

                    <div style={{ marginTop: '3rem', ...styles.card, padding: '1.2rem' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#3b82f6' }}>FILTERS</h4>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>ROLE TYPE</label>
                            <select 
                                onChange={(e) => setFilters({...filters, type: e.target.value})}
                                style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '8px', marginTop: '5px' }}
                            >
                                <option>All</option>
                                <option>Full-time</option>
                                <option>Internship</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>LOCATION</label>
                            <select 
                                onChange={(e) => setFilters({...filters, location: e.target.value})}
                                style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '8px', marginTop: '5px' }}
                            >
                                <option>All</option>
                                <option>India</option>
                                <option>USA</option>
                                <option>UK</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input 
                                type="checkbox" 
                                id="remote" 
                                checked={filters.remote} 
                                onChange={(e) => setFilters({...filters, remote: e.target.checked})}
                            />
                            <label htmlFor="remote" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Remote Jobs Only</label>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Area */}
                <div style={styles.mainContent}>
                    <AnimatePresence mode="wait">
                        {activeSection === 'matches' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                                    {filteredJobs.length > 0 ? filteredJobs.map((item, idx) => (
                                        <motion.div 
                                            key={item.id} 
                                            whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.4)' }}
                                            style={{ ...styles.card, display: 'flex', flexDirection: 'column', cursor: 'default' }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <div style={styles.scoreBadge(item.relevanceScore)}>
                                                    {item.relevanceScore}% MATCH
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {item.job.isInternship && <span style={{ fontSize: '0.65rem', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '2px 8px', borderRadius: '4px', fontWeight: '800', border: '1px solid rgba(139, 92, 246, 0.2)' }}>INTERNSHIP</span>}
                                                    <span style={{ color: '#64748b' }}><Bookmark size={18} /></span>
                                                </div>
                                            </div>

                                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px 0' }}>{item.job.jobTitle}</h3>
                                            <p style={{ color: '#3b82f6', fontWeight: 700, margin: '0 0 12px 0' }}>{item.job.companyName}</p>
                                            
                                            <div style={{ display: 'flex', gap: '15px', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> {item.job.location.join(', ')}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><DollarSign size={14} /> {item.job.salaryEstimate || 'Competitive'}</div>
                                            </div>

                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '8px' }}>CORE REQUIREMENTS</div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                    {item.job.skillsRequired.slice(0, 5).map(skill => (
                                                        <span key={skill} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>{skill}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            {item.skillGap && item.skillGap.length > 0 && (
                                                <div style={{ marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <XCircle size={14} /> MISSING SKILLS
                                                    </div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                        {item.skillGap.map(skill => (
                                                            <span key={skill} style={{ fontSize: '0.65rem', color: '#ef4444', fontStyle: 'italic' }}>{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                                                <button 
                                                    onClick={() => window.open(item.job.sourceUrl, '_blank')}
                                                    style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontWeight: '700', cursor: 'pointer' }}
                                                >
                                                    View Details
                                                </button>
                                                <button 
                                                    style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                                >
                                                    Fast Apply <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem' }}>
                                            <Search size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                            <h3>No matches found in this category</h3>
                                            <p style={{ color: '#64748b' }}>Try adjusting your filters or run a new AI scan.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'gap' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div style={styles.card}>
                                    <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Award size={24} color="#3b82f6" /> Skill Proficiency Radar
                                    </h3>
                                    <div style={{ height: '350px', width: '100%' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                                <PolarGrid stroke="#475569" />
                                                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                                                <Radar
                                                    name="Current Proficiency"
                                                    dataKey="A"
                                                    stroke="#3b82f6"
                                                    fill="#3b82f6"
                                                    fillOpacity={0.5}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
                                        Based on your profile data and recent project history.
                                    </p>
                                </div>

                                <div style={styles.card}>
                                    <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <GraduationCap size={24} color="#ef4444" /> Top Skill Gaps & Resources
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <p>No significant gaps found. Well done!</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'growth' && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                <div style={{ ...styles.card, padding: '3rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)' }}>
                                    <div style={{ marginBottom: '2rem' }}>
                                        <TrendingUp size={64} color="#3b82f6" style={{ marginBottom: '1rem' }} />
                                        <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>AI Career Growth Prediction</h2>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
                                        <div style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                                            <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '10px' }}>PROBABLE ROLE (12 MO)</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{growthPrediction?.potentialRoles[0] || 'Senior Engineer'}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '5px' }}>+{growthPrediction?.estimatedSalaryGrowth || '40%'} Growth</div>
                                        </div>
                                        <div style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                            <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '10px' }}>MARKET DEMAND</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{growthPrediction?.marketTrend || 'Increasing'}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '5px' }}>Top Sector</div>
                                        </div>
                                        <div style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                            <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '10px' }}>CRITICAL SKILL</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>AWS & AI</div>
                                            <div style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '5px' }}>Priority learning</div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'left', lineHeight: 1.8, color: '#94a3b8' }}>
                                        <h4 style={{ color: 'white', marginBottom: '1rem' }}>AI ADVISOR SUMMARY</h4>
                                        <p>{growthPrediction?.recommendation || "Maintain your focus on core engineering and AI integration. Your profile shows strong potential for high-level architect roles."}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'tracking' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div style={styles.card}>
                                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Bookmark size={20} color="#f59e0b" /> Saved Opportunities</h3>
                                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Jobs you've bookmarked for later review.</p>
                                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {/* Minimalist row for tracking */}
                                            {[1, 2].map(i => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 700 }}>AI Solutions Architect</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>NVIDIA • 2 days ago</div>
                                                    </div>
                                                    <button style={{ color: '#3b82f6', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Apply Now</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={styles.card}>
                                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={20} color="#10b981" /> Application History</h3>
                                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Tracking your active process.</p>
                                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700 }}>Senior Backend Dev</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Stripe • Applied 1 week ago</div>
                                                </div>
                                                <span style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', height: 'fit-content', fontWeight: 800 }}>INTERVIEWING</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Smart Notifications Popup (Bottom Right) */}
            <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}>
                <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    style={{ background: '#3b82f6', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.5)' }}
                >
                    <Bell size={24} />
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '18px', height: '18px', background: '#ef4444', borderRadius: '50%', border: '3px solid #0f172a', fontSize: '0.6rem', fontWeight: 900, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>3</div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default JobFitAnalyzer;
