import React, { useState, useRef } from 'react';
import { genAI } from '../services/gemini';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Resume = () => {
    // Builder State
    const [resumeData, setResumeData] = useState({
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        github: "",
        education: "",
        domain: "",
        skills: "",
        projects: "",
        experience: "",
        certifications: "",
        careerGoal: ""
    });
    const [template, setTemplate] = useState('modern');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResume, setGeneratedResume] = useState(null);
    const resumeRef = useRef(null);

    // ATS Analyzer State
    const [activeTab, setActiveTab] = useState('builder');
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [atsResult, setAtsResult] = useState(null);

    const handleGenerateResume = async () => {
        if (!resumeData.name || !resumeData.careerGoal) return alert("Please fill at least your Name and Career Goal to generate.");

        setIsGenerating(true);
        setGeneratedResume(null);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Act as a professional AI Resume Builder.

User Details:
Name: ${resumeData.name || 'Not provided'}
Email: ${resumeData.email || 'Not provided'}
Phone: ${resumeData.phone || 'Not provided'}
LinkedIn: ${resumeData.linkedin || 'Not provided'}
GitHub: ${resumeData.github || 'Not provided'}
Education: ${resumeData.education || 'Not provided'}
Domain: ${resumeData.domain || 'Not provided'}
Skills: ${resumeData.skills || 'Not provided'}
Projects: ${resumeData.projects || 'Not provided'}
Experience/Internships: ${resumeData.experience || 'Not provided'}
Certifications: ${resumeData.certifications || 'Not provided'}
Career Goal / Job Role: ${resumeData.careerGoal || 'Not provided'}

Your task:
Create a professional ATS-friendly resume based EXACTLY on these details. Focus heavily on formatting the information cleanly. Use action verbs and summarize logically.
Output ONLY valid JSON matching this exact structure (No markdown code blocks, just pure JSON):
{
  "name": "Full Name",
  "contact": { "email": "Email", "phone": "Phone", "linkedin": "LinkedIn URL", "github": "GitHub URL" },
  "summary": "Professional summary...",
  "education": [ { "institution": "...", "degree": "...", "year": "..." } ],
  "experience": [ { "role": "...", "company": "...", "duration": "...", "description": ["bullet 1", "bullet 2"] } ],
  "projects": [ { "title": "...", "description": "...", "technologies": ["tech 1"] } ],
  "skills": ["skill 1", "skill 2", "skill 3"],
  "certifications": ["cert 1", "cert 2"]
}`;

            const result = await model.generateContent(prompt);
            let text = result.response.text();
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonResult = JSON.parse(text);
            setGeneratedResume(jsonResult);
        } catch (error) {
            console.error("Failed to generate resume:", error);
            alert("Failed to connect to the AI Agent or invalid JSON generated. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadPDF = () => {
        const input = resumeRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`);
        });
    };

    const handleAnalyzeATS = async () => {
        if (!resumeText || !jobDescription) return alert("Please provide both your Resume and the Job Description.");

        setIsAnalyzing(true);
        setAtsResult(null);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Act as an expert ATS (Applicant Tracking System) Score Analyzer.
Analyze the following Resume against the given Job Description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide a pure JSON output (No markdown blocks) containing:
{
  "score": 85,
  "missingKeywords": ["AWS", "Docker", "Agile"],
  "improvements": ["Actionable advice 1", "Actionable advice 2"]
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

    // Styling for generated resume
    const modernStyle = {
        fontFamily: "'Inter', sans-serif",
        color: '#333',
        background: '#fff',
        padding: '40px',
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        boxSizing: 'border-box'
    };

    const classicStyle = {
        fontFamily: "'Merriweather', serif",
        color: '#000',
        background: '#fff',
        padding: '40px',
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        boxSizing: 'border-box'
    };

    return (
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header Content */}
            <div className="widget glass-panel" style={{ padding: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Skill Path AI Resume Hub</h1>
                <p style={{ color: 'var(--text-muted)' }}>Build ATS-perfect PDF resumes and analyze match scores directly against actual job descriptions.</p>
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
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}><i className="fa-solid fa-file-invoice"></i> Resume Generator</h3>
                            <span className="badge-tag" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)' }}><i className="fa-solid fa-wand-magic-sparkles"></i> ATS-Optimized</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Provide additional contact info for a complete PDF resume export.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Full Name *</label>
                                <input type="text" className="search-input" style={{ width: '100%' }} value={resumeData.name} onChange={e => setResumeData({ ...resumeData, name: e.target.value })} placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Target Career Goal *</label>
                                <input type="text" className="search-input" style={{ width: '100%', border: '1px solid var(--accent-purple)' }} value={resumeData.careerGoal} onChange={e => setResumeData({ ...resumeData, careerGoal: e.target.value })} placeholder="e.g. Frontend React Developer" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Email Addess</label>
                                <input type="email" className="search-input" style={{ width: '100%' }} value={resumeData.email} onChange={e => setResumeData({ ...resumeData, email: e.target.value })} placeholder="e.g. john@example.com" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Phone Number</label>
                                <input type="text" className="search-input" style={{ width: '100%' }} value={resumeData.phone} onChange={e => setResumeData({ ...resumeData, phone: e.target.value })} placeholder="e.g. +1 234 567 8900" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>LinkedIn Profile</label>
                                <input type="text" className="search-input" style={{ width: '100%' }} value={resumeData.linkedin} onChange={e => setResumeData({ ...resumeData, linkedin: e.target.value })} placeholder="e.g. linkedin.com/in/johndoe" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>GitHub / Portfolio</label>
                                <input type="text" className="search-input" style={{ width: '100%' }} value={resumeData.github} onChange={e => setResumeData({ ...resumeData, github: e.target.value })} placeholder="e.g. github.com/johndoe" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Domain / Field</label>
                                <input type="text" className="search-input" style={{ width: '100%' }} value={resumeData.domain} onChange={e => setResumeData({ ...resumeData, domain: e.target.value })} placeholder="e.g. Web Development" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Education</label>
                                <input type="text" className="search-input" style={{ width: '100%' }} value={resumeData.education} onChange={e => setResumeData({ ...resumeData, education: e.target.value })} placeholder="e.g. B.S. in Computer Science" />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Core Technical Skills (Comma Separated)</label>
                                <textarea className="search-input" style={{ width: '100%', minHeight: '60px', resize: 'vertical' }} value={resumeData.skills} onChange={e => setResumeData({ ...resumeData, skills: e.target.value })} placeholder="e.g. React, Node.js, SQL..." />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Projects (Brief Descriptions)</label>
                                <textarea className="search-input" style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} value={resumeData.projects} onChange={e => setResumeData({ ...resumeData, projects: e.target.value })} placeholder="e.g. Built an E-Commerce store integrating Stripe API..." />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Experience / Internships</label>
                                <textarea className="search-input" style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} value={resumeData.experience} onChange={e => setResumeData({ ...resumeData, experience: e.target.value })} placeholder="e.g. Summer Intern at TechCorp where I developed..." />
                            </div>
                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Certifications</label>
                                    <input type="text" className="search-input" style={{ width: '100%' }} value={resumeData.certifications} onChange={e => setResumeData({ ...resumeData, certifications: e.target.value })} placeholder="e.g. AWS Cloud Practitioner" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Select Template</label>
                                    <select className="search-input" style={{ padding: '0.6rem 1rem', width: '200px' }} value={template} onChange={(e) => setTemplate(e.target.value)}>
                                        <option value="modern">Modern (Sans-serif, Clean)</option>
                                        <option value="classic">Classic (Serif, Traditional)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button className="primary-btn pulse-glow" onClick={handleGenerateResume} disabled={isGenerating} style={{ background: 'var(--accent-purple)', padding: '1rem 3rem', fontSize: '1.1rem' }}>
                                {isGenerating ? <><i className="fa-solid fa-spinner fa-spin"></i> Compiling Resume via AI...</> : <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate AI Resume</>}
                            </button>
                        </div>

                        {generatedResume && (
                            <div style={{ marginTop: '3rem', animation: 'slideUp 0.5s ease', background: '#f9fafb', padding: '20px', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, color: '#1f2937' }}>Generated Preview</h3>
                                    <button className="primary-btn pulse-glow" onClick={downloadPDF} style={{ background: '#10b981', color: 'white', border: 'none' }}>
                                        <i className="fa-solid fa-download"></i> Download as PDF
                                    </button>
                                </div>

                                <div style={{ overflowX: 'auto', display: 'flex', justifyContent: 'center', padding: '20px', background: '#e5e7eb', borderRadius: '8px' }}>
                                    {/* A4 Container */}
                                    <div ref={resumeRef} style={template === 'modern' ? modernStyle : classicStyle}>
                                        {/* Header */}
                                        <div style={{ textAlign: template === 'classic' ? 'center' : 'left', borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>
                                            <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: '1px', color: template === 'modern' ? '#1e3a8a' : '#000' }}>{generatedResume.name}</h1>
                                            <div style={{ fontSize: '0.9rem', color: '#4b5563', display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: template === 'classic' ? 'center' : 'flex-start' }}>
                                                {generatedResume.contact?.email && <span>{generatedResume.contact.email}</span>}
                                                {generatedResume.contact?.phone && <span>{generatedResume.contact.phone}</span>}
                                                {generatedResume.contact?.linkedin && <span>{generatedResume.contact.linkedin}</span>}
                                                {generatedResume.contact?.github && <span>{generatedResume.contact.github}</span>}
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        {generatedResume.summary && (
                                            <div style={{ marginBottom: '20px' }}>
                                                <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: template === 'modern' ? '#1e3a8a' : '#000', textTransform: 'uppercase' }}>Professional Summary</h3>
                                                <p style={{ margin: 0, lineHeight: '1.6', fontSize: '0.95rem' }}>{generatedResume.summary}</p>
                                            </div>
                                        )}

                                        {/* Skills */}
                                        {(generatedResume.skills && generatedResume.skills.length > 0) && (
                                            <div style={{ marginBottom: '20px' }}>
                                                <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: template === 'modern' ? '#1e3a8a' : '#000', textTransform: 'uppercase' }}>Technical Skills</h3>
                                                <p style={{ margin: 0, lineHeight: '1.6', fontSize: '0.95rem' }}>{generatedResume.skills.join(', ')}</p>
                                            </div>
                                        )}

                                        {/* Experience */}
                                        {(generatedResume.experience && generatedResume.experience.length > 0) && (
                                            <div style={{ marginBottom: '20px' }}>
                                                <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: template === 'modern' ? '#1e3a8a' : '#000', textTransform: 'uppercase' }}>Experience</h3>
                                                {generatedResume.experience.map((exp, idx) => (
                                                    <div key={idx} style={{ marginBottom: '15px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                                            <span>{exp.role} | {exp.company}</span>
                                                            <span>{exp.duration}</span>
                                                        </div>
                                                        <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                                            {exp.description && exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Projects */}
                                        {(generatedResume.projects && generatedResume.projects.length > 0) && (
                                            <div style={{ marginBottom: '20px' }}>
                                                <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: template === 'modern' ? '#1e3a8a' : '#000', textTransform: 'uppercase' }}>Projects</h3>
                                                {generatedResume.projects.map((proj, idx) => (
                                                    <div key={idx} style={{ marginBottom: '15px' }}>
                                                        <div style={{ fontWeight: 'bold' }}>{proj.title} <span style={{ fontWeight: 'normal', fontStyle: 'italic', fontSize: '0.9rem' }}>({proj.technologies?.join(', ')})</span></div>
                                                        <p style={{ margin: '5px 0 0 0', fontSize: '0.95rem', lineHeight: '1.5' }}>{proj.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Education */}
                                        {(generatedResume.education && generatedResume.education.length > 0) && (
                                            <div style={{ marginBottom: '20px' }}>
                                                <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: template === 'modern' ? '#1e3a8a' : '#000', textTransform: 'uppercase' }}>Education</h3>
                                                {generatedResume.education.map((edu, idx) => (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                        <span style={{ fontWeight: 'bold' }}>{edu.degree}, {edu.institution}</span>
                                                        <span>{edu.year}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Certifications */}
                                        {(generatedResume.certifications && generatedResume.certifications.length > 0) && (
                                            <div style={{ marginBottom: '20px' }}>
                                                <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: template === 'modern' ? '#1e3a8a' : '#000', textTransform: 'uppercase' }}>Certifications</h3>
                                                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                                    {generatedResume.certifications.map((cert, idx) => <li key={idx}>{cert}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ATS Score Analyzer */}
                {activeTab === 'analyzer' && (
                    <div style={{ animation: 'slideUp 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}><i className="fa-solid fa-magnifying-glass-chart"></i> Engine Match Analyzer</h3>
                            <span className="badge-tag" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)' }}><i className="fa-solid fa-robot"></i> AI Powered</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Paste your resume and the target job description to get an instant AI evaluation of your ATS match score.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
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
        </div>
    );
};

export default Resume;

