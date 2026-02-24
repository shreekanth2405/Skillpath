import React, { useState } from 'react';
import { genAI } from '../services/gemini';

const Profile = ({ userXP, userLevel }) => {
    const [profileData, setProfileData] = useState(() => {
        const saved = localStorage.getItem('userProfile');
        return saved ? JSON.parse(saved) : {
            photo: "https://ui-avatars.com/api/?name=User&background=8b5cf6&color=fff&rounded=true&size=120",
            name: "Shreyas",
            role: "Aspiring Senior Full-Stack Developer",
            bio: "Passionate about building scalable web applications and learning new AI technologies. Currently focusing on React and Node.js.",
            email: "shreyas@skillpath.ai",
            phone: "+1 (555) 123-4567",
            joinedDate: "October 12, 2023",
            subscription: "Pro Member"
        };
    });

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState(profileData);

    const handleSaveProfile = () => {
        setProfileData(editForm);
        localStorage.setItem('userProfile', JSON.stringify(editForm));
        setIsEditingProfile(false);
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            alert("Account deletion requested. Our support team will process it.");
        }
    };

    const [resumeData, setResumeData] = useState({
        name: "",
        education: "",
        domain: "",
        skills: "",
        projects: "",
        experience: "",
        certifications: "",
        careerGoal: ""
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResume, setGeneratedResume] = useState(null);

    // ATS Analyzer State
    const [activeTab, setActiveTab] = useState('builder'); // 'builder' or 'analyzer'
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [atsResult, setAtsResult] = useState(null);

    const handleGenerateResume = async () => {
        if (!resumeData.name || !resumeData.careerGoal) return alert("Please fill at least your Name and Career Goal to generate.");

        setIsGenerating(true);
        setGeneratedResume(null);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Act as a professional AI Resume Builder.

User Details:
Name: ${resumeData.name || 'Not provided'}
Education: ${resumeData.education || 'Not provided'}
Domain: ${resumeData.domain || 'Not provided'}
Skills: ${resumeData.skills || 'Not provided'}
Projects: ${resumeData.projects || 'Not provided'}
Experience/Internships: ${resumeData.experience || 'Not provided'}
Certifications: ${resumeData.certifications || 'Not provided'}
Career Goal / Job Role: ${resumeData.careerGoal || 'Not provided'}

Your task:
1. Create a professional ATS-friendly resume.
2. Use simple formatting (no markdown tables, no graphics).
3. Add domain-specific keywords.
4. Highlight skills and projects relevant to the job role.
5. Keep it concise (1 page for fresher).
6. Use professional summary.
7. Format sections strictly as:
   - Summary
   - Education
   - Skills
   - Projects
   - Experience
   - Certifications

Output ONLY the clean structured text format of the resume.`;

            const result = await model.generateContent(prompt);
            setGeneratedResume(result.response.text());
        } catch (error) {
            console.error("Failed to generate resume:", error);
            alert("Failed to connect to the AI Agent. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAnalyzeATS = async () => {
        if (!resumeText || !jobDescription) return alert("Please provide both your Resume and the Job Description.");

        setIsAnalyzing(true);
        setAtsResult(null);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Act as an expert ATS (Applicant Tracking System) Score Analyzer.

Analyze the following Resume against the given Job Description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide a JSON output containing:
1. "score": A percentage out of 100 representing the match.
2. "missingKeywords": An array of important keywords from the JD that are not in the resume.
3. "improvements": An array of actionable advice to improve the resume for this specific role.

Output ONLY valid JSON matching this format, with no markdown formatting:
{
  "score": 85,
  "missingKeywords": ["AWS", "Docker", "Agile"],
  "improvements": ["Add more quantifiable results in experience", "Include Docker in your skills section"]
}`;

            const result = await model.generateContent(prompt);
            let text = result.response.text();
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            setAtsResult(JSON.parse(text));
        } catch (error) {
            console.error("Failed to analyze ATS:", error);
            alert("Failed to connect to the AI Agent. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Edit Profile Modal */}
            {isEditingProfile && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="glass-panel slide-down" style={{ background: 'white', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>Edit Profile</h2>
                            <button onClick={() => setIsEditingProfile(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', color: '#64748b', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>Photo URL</label>
                                <input type="text" className="search-input" value={editForm.photo} onChange={e => setEditForm({ ...editForm, photo: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>Full Name</label>
                                    <input type="text" className="search-input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>Role</label>
                                    <input type="text" className="search-input" value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} style={{ width: '100%' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>Bio / Description</label>
                                <textarea className="search-input" rows="3" value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} style={{ width: '100%', resize: 'vertical' }}></textarea>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>Email</label>
                                    <input type="email" className="search-input" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} style={{ width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>Phone</label>
                                    <input type="text" className="search-input" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} style={{ width: '100%' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button className="primary-btn" onClick={handleSaveProfile} style={{ background: '#3b82f6', color: 'white', flex: 1, padding: '0.8rem' }}>Save Changes</button>
                                <button className="primary-btn" onClick={() => setIsEditingProfile(false)} style={{ background: '#f1f5f9', color: '#0f172a', flex: 1, padding: '0.8rem' }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Header Card */}
            <div className="widget glass-panel" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                <div style={{ height: '150px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', width: '100%' }}></div>
                <div style={{ padding: '0 2rem 2rem', position: 'relative', marginTop: '-60px', display: 'flex', gap: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <img src={profileData.photo} alt="User" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid white', boxShadow: 'var(--shadow-md)', backgroundColor: 'white', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: 5, right: 5, background: 'var(--accent-purple)', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid white', fontSize: '0.8rem' }}>{userLevel || 12}</div>
                    </div>
                    <div style={{ flex: 1, paddingBottom: '0.5rem', minWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h1 style={{ fontSize: '2.2rem', marginBottom: '0.2rem', color: '#0f172a' }}>{profileData.name} <span className="badge-tag" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontSize: '0.8rem', verticalAlign: 'middle', marginLeft: '10px' }}>{profileData.subscription}</span></h1>
                                <p style={{ color: '#64748b', fontSize: '1.0rem', marginBottom: '0.5rem', fontWeight: 600 }}><i className="fa-solid fa-briefcase" style={{ marginRight: '8px' }}></i> {profileData.role}</p>
                                <p style={{ color: '#475569', fontSize: '0.9rem', maxWidth: '600px', lineHeight: '1.4' }}>{profileData.bio}</p>
                            </div>
                            <button className="primary-btn hover-3d" onClick={() => { setEditForm(profileData); setIsEditingProfile(true); }} style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap' }}>
                                <i className="fa-solid fa-pen" style={{ marginRight: '8px' }}></i> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Level & XP Strip */}
                <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--accent-purple)' }}>Current Progress (Level {userLevel || 12})</span>
                            <span style={{ color: '#64748b' }}>{userXP?.toLocaleString() || '4,500'} / {((userLevel || 12) * 1500)?.toLocaleString() || '5,000'} XP</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${((userXP || 4500) / ((userLevel || 12) * 1500) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))' }}></div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '3rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '3rem' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.2rem', letterSpacing: '0.5px' }}>Joined</span>
                            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}><i className="fa-regular fa-calendar" style={{ marginRight: '6px', color: '#94a3b8' }}></i> {profileData.joinedDate}</span>
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.2rem', letterSpacing: '0.5px' }}>Contact</span>
                            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}><i className="fa-regular fa-envelope" style={{ marginRight: '6px', color: '#94a3b8' }}></i> {profileData.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resume Workspace Tabs */}
            <div className="widget glass-panel" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <button
                        className={`primary-btn ${activeTab === 'builder' ? 'pulse-glow' : ''}`}
                        style={{ background: activeTab === 'builder' ? 'var(--accent-purple)' : 'transparent', color: activeTab === 'builder' ? 'white' : 'var(--text-main)', border: activeTab === 'builder' ? 'none' : '1px solid var(--border-light)' }}
                        onClick={() => setActiveTab('builder')}
                    >
                        <i className="fa-solid fa-file-invoice"></i> AI Resume Builder
                    </button>
                    <button
                        className={`primary-btn ${activeTab === 'analyzer' ? 'pulse-glow' : ''}`}
                        style={{ background: activeTab === 'analyzer' ? 'var(--accent-blue)' : 'transparent', color: activeTab === 'analyzer' ? 'white' : 'var(--text-main)', border: activeTab === 'analyzer' ? 'none' : '1px solid var(--border-light)' }}
                        onClick={() => setActiveTab('analyzer')}
                    >
                        <i className="fa-solid fa-magnifying-glass-chart"></i> ATS Score Analyzer
                    </button>
                </div>

                {/* AI Resume Builder */}
                {activeTab === 'builder' && (
                    <div style={{ animation: 'slideUp 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}><i className="fa-solid fa-file-invoice"></i> AI Resume Builder</h3>
                            <span className="badge-tag" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)' }}><i className="fa-solid fa-wand-magic-sparkles"></i> ATS-Optimized</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Generate a professional, ATS-friendly single-page resume uniquely tailored to your career goal using our generative AI engine.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Full Name</label>
                                <input type="text" className="search-input" style={{ width: '100%' }} value={resumeData.name} onChange={e => setResumeData({ ...resumeData, name: e.target.value })} placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Target Career Goal / Job Role</label>
                                <input type="text" className="search-input" style={{ width: '100%', border: '1px solid var(--accent-purple)' }} value={resumeData.careerGoal} onChange={e => setResumeData({ ...resumeData, careerGoal: e.target.value })} placeholder="e.g. Frontend React Developer" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Domain / Field</label>
                                <input type="text" className="search-input" style={{ width: '100%' }} value={resumeData.domain} onChange={e => setResumeData({ ...resumeData, domain: e.target.value })} placeholder="e.g. Web Development" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Education</label>
                                <input type="text" className="search-input" style={{ width: '100%' }} value={resumeData.education} onChange={e => setResumeData({ ...resumeData, education: e.target.value })} placeholder="e.g. B.S. tightly Computer Science" />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Core Technical Skills (Comma Separated)</label>
                                <textarea className="search-input" style={{ width: '100%', minHeight: '60px', resize: 'vertical' }} value={resumeData.skills} onChange={e => setResumeData({ ...resumeData, skills: e.target.value })} placeholder="e.g. Top skills..." />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Projects (Brief Descriptions)</label>
                                <textarea className="search-input" style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} value={resumeData.projects} onChange={e => setResumeData({ ...resumeData, projects: e.target.value })} placeholder="e.g. Built an E-Commerce store..." />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Experience / Internships</label>
                                <textarea className="search-input" style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} value={resumeData.experience} onChange={e => setResumeData({ ...resumeData, experience: e.target.value })} placeholder="e.g. Summer Intern at TechCorp..." />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Certifications</label>
                                <input type="text" className="search-input" style={{ width: '100%' }} value={resumeData.certifications} onChange={e => setResumeData({ ...resumeData, certifications: e.target.value })} placeholder="e.g. AWS Cloud Practitioner" />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button className="primary-btn pulse-glow" onClick={handleGenerateResume} disabled={isGenerating} style={{ background: 'var(--accent-purple)', padding: '1rem 3rem', fontSize: '1.1rem' }}>
                                {isGenerating ? <><i className="fa-solid fa-spinner fa-spin"></i> Compiling Resume via AI...</> : <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate AI Resume</>}
                            </button>
                        </div>

                        {generatedResume && (
                            <div style={{ marginTop: '3rem', padding: '2rem', background: '#ffffff', color: '#111827', borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontFamily: 'Merriweather, serif', animation: 'slideUp 0.5s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb', fontFamily: 'Inter, sans-serif' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Generated ATS Output</span>
                                    <button className="primary-btn" onClick={() => navigator.clipboard.writeText(generatedResume)} style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '0.4rem 1rem', fontSize: '0.8rem' }}><i className="fa-regular fa-copy"></i> Copy Text</button>
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                    {generatedResume}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ATS Score Analyzer */}
                {activeTab === 'analyzer' && (
                    <div style={{ animation: 'slideUp 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}><i className="fa-solid fa-magnifying-glass-chart"></i> ATS Score Analyzer</h3>
                            <span className="badge-tag" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)' }}><i className="fa-solid fa-robot"></i> AI Powered</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Paste your resume and the target job description to get an instant AI evaluation of your ATS match score.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Your Resume (Paste text)</label>
                                <textarea className="search-input" style={{ width: '100%', minHeight: '300px', resize: 'vertical' }} value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your full resume here..." />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Target Job Description</label>
                                <textarea className="search-input" style={{ width: '100%', minHeight: '300px', resize: 'vertical' }} value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the job description here..." />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button className="primary-btn pulse-glow" onClick={handleAnalyzeATS} disabled={isAnalyzing} style={{ background: 'var(--accent-blue)', padding: '1rem 3rem', fontSize: '1.1rem' }}>
                                {isAnalyzing ? <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing Match...</> : <><i className="fa-solid fa-magnifying-glass"></i> Analyze ATS Score</>}
                            </button>
                        </div>

                        {atsResult && (
                            <div style={{ marginTop: '3rem', padding: '2rem', background: '#ffffff', color: '#111827', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', animation: 'slideUp 0.5s ease' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                                    <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', background: `conic-gradient(${atsResult.score >= 80 ? '#10b981' : atsResult.score >= 50 ? '#f59e0b' : '#ef4444'} ${atsResult.score}%, #e2e8f0 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 'bold', color: atsResult.score >= 80 ? '#10b981' : atsResult.score >= 50 ? '#f59e0b' : '#ef4444' }}>
                                            {atsResult.score}%
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem' }}>Match Score</h3>
                                        <p style={{ margin: 0, color: '#6b7280' }}>{atsResult.score >= 80 ? "Great match! You have a high chance of passing the ATS." : atsResult.score >= 60 ? "Moderate match. Consider adding missing keywords." : "Low match. Heavy optimizations recommended."}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                    <div>
                                        <h4 style={{ marginBottom: '1rem', color: '#ef4444' }}><i className="fa-solid fa-circle-exclamation"></i> Missing Keywords</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {atsResult.missingKeywords.length > 0 ? atsResult.missingKeywords.map((kw, i) => (
                                                <span key={i} className="badge-tag" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{kw}</span>
                                            )) : <span style={{ color: '#6b7280' }}>No critical missing keywords!</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}><i className="fa-solid fa-lightbulb"></i> AI Recommendations</h4>
                                        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#4b5563', lineHeight: '1.6' }}>
                                            {atsResult.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Gamification Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* Badges & Achievements */}
                <div className="widget glass-panel">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--accent-blue)' }}><i className="fa-solid fa-medal"></i> Achievements & Badges</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>

                        <div className="badge-card">
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #fcd34d, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)' }}>
                                <i className="fa-solid fa-fire"></i>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>7-Day Streak</span>
                        </div>

                        <div className="badge-card">
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #6ee7b7, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }}>
                                <i className="fa-solid fa-bug-slash"></i>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Bug Squasher</span>
                        </div>

                        <div className="badge-card">
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #93c5fd, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}>
                                <i className="fa-brands fa-react"></i>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>React Novice</span>
                        </div>

                        <div className="badge-card locked">
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #c4b5fd, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)' }}>
                                <i className="fa-solid fa-crown"></i>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Algorithm King</span>
                        </div>

                    </div>
                </div>

                {/* Learning Activity */}
                <div className="widget glass-panel">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--accent-purple)' }}><i className="fa-solid fa-chart-simple"></i> Weekly Activity</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                        <div style={{ width: '30px', height: '40%', background: 'var(--accent-purple)', borderRadius: '4px 4px 0 0', opacity: 0.6 }}></div>
                        <div style={{ width: '30px', height: '60%', background: 'var(--accent-purple)', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
                        <div style={{ width: '30px', height: '30%', background: 'var(--accent-purple)', borderRadius: '4px 4px 0 0', opacity: 0.5 }}></div>
                        <div style={{ width: '30px', height: '90%', background: 'var(--accent-purple)', borderRadius: '4px 4px 0 0' }}></div>
                        <div style={{ width: '30px', height: '50%', background: 'var(--accent-purple)', borderRadius: '4px 4px 0 0', opacity: 0.7 }}></div>
                        <div style={{ width: '30px', height: '80%', background: 'var(--accent-purple)', borderRadius: '4px 4px 0 0', opacity: 0.9 }}></div>
                        <div style={{ width: '30px', height: '100%', background: 'var(--accent-green)', borderRadius: '4px 4px 0 0', boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Today</span>
                    </div>
                </div>

            </div>

            {/* Advanced Profile Sections */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="widget glass-panel">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#0f172a' }}><i className="fa-solid fa-clock-rotate-left" style={{ color: '#3b82f6', marginRight: '8px' }}></i> Learning History</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.8rem' }}>
                            <span style={{ fontWeight: 600 }}>Advanced React Patterns</span>
                            <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 700 }}>Completed</span>
                        </li>
                        <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.8rem' }}>
                            <span style={{ fontWeight: 600 }}>System Design Basics</span>
                            <span style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: 700 }}>In Progress (60%)</span>
                        </li>
                    </ul>
                </div>

                <div className="widget glass-panel">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#0f172a' }}><i className="fa-solid fa-book-open" style={{ color: '#8b5cf6', marginRight: '8px' }}></i> Library Stats</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#3b82f6' }}>14</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Books Read</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>5</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Saved Books</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f59e0b' }}>32</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Bookmarks</div>
                        </div>
                    </div>
                </div>

                <div className="widget glass-panel">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#0f172a' }}><i className="fa-solid fa-users" style={{ color: '#ec4899', marginRight: '8px' }}></i> Community Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Posts Created</span>
                            <span style={{ background: '#3b82f6', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700 }}>8</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Upvotes Received</span>
                            <span style={{ background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700 }}>142</span>
                        </div>
                    </div>
                </div>

                <div className="widget glass-panel">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#0f172a' }}><i className="fa-solid fa-gamepad" style={{ color: '#0ea5e9', marginRight: '8px' }}></i> Application Games</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Code Break Level</span>
                            <span style={{ color: '#0ea5e9', fontWeight: 800 }}>Level 5</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Prompt Game Highscore</span>
                            <span style={{ color: '#f59e0b', fontWeight: 800 }}><i className="fa-solid fa-star"></i> 4,250</span>
                        </div>
                    </div>
                </div>

                <div className="widget glass-panel">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#0f172a' }}><i className="fa-solid fa-certificate" style={{ color: '#eab308', marginRight: '8px' }}></i> Certificates Earned</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ background: '#fef9c3', color: '#ca8a04', padding: '10px 15px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid #fde047' }}><i className="fa-solid fa-award"></i> AI Foundation</div>
                        <div style={{ background: '#eff6ff', color: '#2563eb', padding: '10px 15px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid #bfdbfe' }}><i className="fa-solid fa-award"></i> React Master</div>
                    </div>
                </div>

                <div className="widget glass-panel">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#0f172a' }}><i className="fa-solid fa-shield-halved" style={{ color: '#64748b', marginRight: '8px' }}></i> Privacy & Security</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                            Two-Factor Auth (2FA) <span style={{ color: '#ef4444' }}>Disabled</span>
                        </button>
                        <button style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                            Data Download Option <i className="fa-solid fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Account Settings */}
            <div className="widget glass-panel" style={{ marginTop: '0rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#ef4444', margin: 0 }}><i className="fa-solid fa-triangle-exclamation"></i> Danger Zone</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>Delete Account</h4>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Permanently remove your personal data, subscription, and progress from Skill Path AI. This action cannot be undone.</p>
                    </div>
                    <button className="primary-btn hover-3d" onClick={handleDeleteAccount} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.8rem 1.5rem', whiteSpace: 'nowrap' }}>
                        <i className="fa-solid fa-trash-can" style={{ marginRight: '8px' }}></i> Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
