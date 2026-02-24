import React, { useState } from 'react';
import tutorPortrait from '../assets/tutor_portrait.png';


const CareerRoadmap = ({ setActiveTab }) => {
    const [theme, setTheme] = useState('light');
    const [formData, setFormData] = useState({
        name: '',
        year: '',
        department: '',
        skillLevel: '',
        careerGoal: '',
        preferredDomain: ''
    });
    const [errors, setErrors] = useState({});

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.year) newErrors.year = 'Year is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.skillLevel) newErrors.skillLevel = 'Skill level is required';
        if (!formData.careerGoal) newErrors.careerGoal = 'Career goal is required';
        if (!formData.preferredDomain) newErrors.preferredDomain = 'Preferred domain is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGenerate = () => {
        if (validateForm()) {
            alert('Generating your custom 150-course roadmap...');
        }
    };

    const styles = {
        container: {
            fontFamily: "'Inter', 'Poppins', sans-serif",
            backgroundColor: theme === 'light' ? '#F8FAFC' : '#0F172A',
            color: theme === 'light' ? '#1E293B' : '#F1F5F9',
            minHeight: 'calc(100vh - 120px)',
            padding: '2rem',
            transition: 'all 0.3s ease',
            borderRadius: '24px',
            overflowY: 'auto',
            gridColumn: '1 / -1'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
        },
        toggleBtn: {
            background: theme === 'light' ? '#E2E8F0' : '#334155',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: theme === 'light' ? '#475569' : '#CBD5E1',
            fontWeight: '600',
            transition: 'all 0.2s ease'
        },
        card: {
            background: theme === 'light' ? '#FFFFFF' : '#1E293B',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: theme === 'light' ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : '0 20px 25px -5px rgba(0,0,0,0.3)',
            maxWidth: '900px',
            margin: '0 auto',
            border: theme === 'light' ? '1px solid #E2E8F0' : '1px solid #334155'
        },
        title: {
            fontSize: '2.25rem',
            fontWeight: '800',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        },
        label: {
            fontSize: '0.875rem',
            fontWeight: '600',
            color: theme === 'light' ? '#64748B' : '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        input: {
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: theme === 'light' ? `1px solid ${errors.name ? '#EF4444' : '#E2E8F0'}` : `1px solid ${errors.name ? '#EF4444' : '#334155'}`,
            backgroundColor: theme === 'light' ? '#FFFFFF' : '#0F172A',
            color: theme === 'light' ? '#1E293B' : '#F8FAFC',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s ease'
        },
        select: {
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: theme === 'light' ? '1px solid #E2E8F0' : '1px solid #334155',
            backgroundColor: theme === 'light' ? '#FFFFFF' : '#0F172A',
            color: theme === 'light' ? '#1E293B' : '#F8FAFC',
            fontSize: '1rem',
            outline: 'none',
            cursor: 'pointer'
        },
        btnPrimary: {
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontSize: '1.125rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            width: '100%',
            maxWidth: '400px',
            display: 'block',
            margin: '0 auto 1.5rem',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
        },
        btnSecondary: {
            background: 'transparent',
            color: theme === 'light' ? '#3B82F6' : '#60A5FA',
            border: `2px solid ${theme === 'light' ? '#3B82F6' : '#60A5FA'}`,
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            width: '100%',
            maxWidth: '300px',
            display: 'block',
            margin: '0 auto'
        },
        errorText: {
            color: '#EF4444',
            fontSize: '0.75rem',
            marginTop: '0.25rem'
        },
        additionalSection: {
            marginTop: '3.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            paddingTop: '2.5rem',
            borderTop: theme === 'light' ? '1px solid #F1F5F9' : '1px solid #334155'
        },
        infoCard: {
            textAlign: 'center',
            padding: '1.5rem',
            background: theme === 'light' ? '#F8FAFC' : '#0F172A',
            borderRadius: '12px',
            border: theme === 'light' ? '1px solid #E2E8F0' : '1px solid #334155'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div />
                <button style={styles.toggleBtn} onClick={toggleTheme}>
                    <i className={theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'}></i>
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
            </div>

            <div style={styles.card}>
                <h1 style={styles.title}>Skill Path AI Career Roadmap Generator</h1>

                <div style={styles.formGrid}>
                    {/* Name */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><i className="fa-solid fa-user"></i> Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g., John Doe"
                            style={{ ...styles.input, borderColor: errors.name ? '#EF4444' : styles.input.borderColor }}
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {errors.name && <span style={styles.errorText}>{errors.name}</span>}
                    </div>

                    {/* Year */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><i className="fa-solid fa-calendar"></i> Year</label>
                        <select
                            name="year"
                            style={{ ...styles.select, borderColor: errors.year ? '#EF4444' : styles.select.borderColor }}
                            value={formData.year}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="Final Year">Final Year</option>
                        </select>
                        {errors.year && <span style={styles.errorText}>{errors.year}</span>}
                    </div>

                    {/* Department */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><i className="fa-solid fa-building"></i> Department</label>
                        <select
                            name="department"
                            style={{ ...styles.select, borderColor: errors.department ? '#EF4444' : styles.select.borderColor }}
                            value={formData.department}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Department</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Civil">Civil</option>
                            <option value="AI & DS">AI & DS</option>
                            <option value="IT">IT</option>
                            <option value="Biomedical">Biomedical</option>
                        </select>
                        {errors.department && <span style={styles.errorText}>{errors.department}</span>}
                    </div>

                    {/* Skill Level */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><i className="fa-solid fa-gauge-high"></i> Skill Level</label>
                        <select
                            name="skillLevel"
                            style={{ ...styles.select, borderColor: errors.skillLevel ? '#EF4444' : styles.select.borderColor }}
                            value={formData.skillLevel}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Skill Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                        {errors.skillLevel && <span style={styles.errorText}>{errors.skillLevel}</span>}
                    </div>

                    {/* Career Goal */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><i className="fa-solid fa-bullseye"></i> Career Goal</label>
                        <select
                            name="careerGoal"
                            style={{ ...styles.select, borderColor: errors.careerGoal ? '#EF4444' : styles.select.borderColor }}
                            value={formData.careerGoal}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Career Goal</option>
                            <option value="Core">Core</option>
                            <option value="Higher Studies">Higher Studies</option>
                            <option value="Startup">Startup</option>
                            <option value="Placement">Placement</option>
                            <option value="Government Jobs">Government Jobs</option>
                        </select>
                        {errors.careerGoal && <span style={styles.errorText}>{errors.careerGoal}</span>}
                    </div>

                    {/* Preferred Domain */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><i className="fa-solid fa-rocket"></i> Preferred Domain</label>
                        <input
                            type="text"
                            name="preferredDomain"
                            placeholder="AI, Web, Data Science, etc."
                            style={{ ...styles.input, borderColor: errors.preferredDomain ? '#EF4444' : styles.input.borderColor }}
                            value={formData.preferredDomain}
                            onChange={handleInputChange}
                        />
                        {errors.preferredDomain && <span style={styles.errorText}>{errors.preferredDomain}</span>}
                    </div>
                </div>

                <div className="btn-container" style={{ textAlign: 'center' }}>
                    <button
                        style={styles.btnPrimary}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
                        }}
                        onClick={handleGenerate}
                    >
                        Generate 150-Course Roadmap
                    </button>

                    <button
                        style={styles.btnSecondary}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = theme === 'light' ? '#3B82F6' : '#60A5FA';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = theme === 'light' ? '#3B82F6' : '#60A5FA';
                        }}
                        onClick={() => setActiveTab('careergenie')}
                    >
                        Ask the Career Genie (Akinator)
                    </button>
                </div>

                {/* Additional Section */}
                <div style={styles.additionalSection}>
                    <div style={styles.infoCard}>
                        <i className="fa-solid fa-timeline" style={{ fontSize: '1.5rem', color: '#3B82F6', marginBottom: '0.75rem' }}></i>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Timeline</h3>
                        <p style={{ fontSize: '0.875rem', color: theme === 'light' ? '#64748B' : '#94A3B8' }}>4-Year Strategic Plan</p>
                    </div>
                    <div style={styles.infoCard}>
                        <i className="fa-solid fa-clock" style={{ fontSize: '1.5rem', color: '#8B5CF6', marginBottom: '0.75rem' }}></i>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Weekly Commitment</h3>
                        <p style={{ fontSize: '0.875rem', color: theme === 'light' ? '#64748B' : '#94A3B8' }}>10-15 Hours / Week</p>
                    </div>
                    <div style={styles.infoCard}>
                        <i className="fa-solid fa-laptop" style={{ fontSize: '1.5rem', color: '#10B981', marginBottom: '0.75rem' }}></i>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Learning Mode</h3>
                        <p style={{ fontSize: '0.875rem', color: theme === 'light' ? '#64748B' : '#94A3B8' }}>Self-paced / Guided</p>
                    </div>
                </div>

                {/* AI English Tutor Integration Section */}
                <div style={{
                    marginTop: '3rem',
                    padding: '2rem',
                    background: theme === 'light' ? 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)' : 'linear-gradient(135deg, #1E293B 0%, #2E1065 100%)',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem',
                    border: theme === 'light' ? '1px solid #DBEAFE' : '1px solid #4C1D95',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '4px solid white',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        flexShrink: 0
                    }}>
                        <img src={tutorPortrait} alt="Emma Tutor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: theme === 'light' ? '#1E3A8A' : '#E0E7FF' }}>
                            Boost Your Career with Communication
                        </h3>
                        <p style={{ fontSize: '0.95rem', color: theme === 'light' ? '#475569' : '#94A3B8', margin: 0, lineHeight: '1.6' }}>
                            Success isn't just about code. Practice interviews, refine your English, and gain confidence with your voice-enabled AI Tutor, **Emma**.
                            She's integrated into your roadmap to ensure you're job-ready.
                        </p>
                    </div>
                    <button
                        style={{
                            background: '#7C3AED',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={() => setActiveTab('englishlearning')}
                    >
                        <i className="fa-solid fa-microphone"></i> Launch Emma AI
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CareerRoadmap;
