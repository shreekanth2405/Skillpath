import React, { useState, useRef, useCallback, useEffect } from 'react';
import { genAI } from '../services/gemini';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';

// ─── CONSTANTS ────────────────────────────────────────────────────────
const TEMPLATES = {
    modern: { name: 'Modern Pro', accent: '#6366f1', desc: 'Clean, minimal, indigo accent' },
    executive: { name: 'Executive', accent: '#0f172a', desc: 'Bold, dark, classic layout' },
    creative: { name: 'Creative', accent: '#ec4899', desc: 'Vibrant, colorful sidebar' },
    minimal: { name: 'Minimal', accent: '#64748b', desc: 'Ultra-clean, ATS-optimized' },
};

const EMPTY_RESUME = {
    name: '', email: '', phone: '', linkedin: '', github: '', website: '',
    summary: '', domain: '', education: '', skills: '', projects: '',
    experience: '', certifications: '', careerGoal: '',
};

const SECTION_LABELS = {
    name: 'Full Name', email: 'Email', phone: 'Phone',
    linkedin: 'LinkedIn URL', github: 'GitHub / Portfolio', website: 'Personal Website',
    careerGoal: 'Target Job Role', domain: 'Domain / Field',
    education: 'Education', skills: 'Skills (comma-separated)',
    experience: 'Experience & Internships', projects: 'Projects',
    certifications: 'Certifications',
    summary: 'Professional Summary (auto-generated if blank)',
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────
const Resume = () => {
    const [activeTab, setActiveTab] = useState('builder');
    const [resumeData, setResumeData] = useState(EMPTY_RESUME);
    const [template, setTemplate] = useState('modern');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResume, setGeneratedResume] = useState(null);
    const [atsScore, setAtsScore] = useState(null);
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [atsResult, setAtsResult] = useState(null);
    const [isImproving, setIsImproving] = useState(null);
    const [sectionToggles, setSectionToggles] = useState({ summary: true, experience: true, projects: true, education: true, skills: true, certifications: true });
    const [autoSaved, setAutoSaved] = useState(false);
    const [versions, setVersions] = useState([]);
    const [showVersions, setShowVersions] = useState(false);
    const resumeRef = useRef(null);

    // ── AUTO-SAVE ──────────────────────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            if (resumeData.name) {
                localStorage.setItem('sp_resume_draft', JSON.stringify(resumeData));
                setAutoSaved(true);
                setTimeout(() => setAutoSaved(false), 2000);
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, [resumeData]);

    useEffect(() => {
        const saved = localStorage.getItem('sp_resume_draft');
        if (saved) { try { setResumeData(JSON.parse(saved)); } catch { /* noop */ } }
        const v = localStorage.getItem('sp_resume_versions');
        if (v) { try { setVersions(JSON.parse(v)); } catch { /* noop */ } }
    }, []);

    const saveVersion = () => {
        if (!generatedResume) return;
        const v = { id: Date.now(), timestamp: new Date().toLocaleString(), template, preview: generatedResume.name };
        const updated = [v, ...versions].slice(0, 5);
        setVersions(updated);
        localStorage.setItem('sp_resume_versions', JSON.stringify(updated));
    };

    // ── GENERATE RESUME ────────────────────────────────────────────
    const handleGenerateResume = async () => {
        if (!resumeData.name || !resumeData.careerGoal) return alert('Please fill in at least Name and Target Job Role.');
        setIsGenerating(true);
        setGeneratedResume(null);
        setAtsScore(null);
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = `Act as a professional ATS-optimized Resume Builder.
User Details:
${Object.entries(resumeData).map(([k, v]) => `${SECTION_LABELS[k] || k}: ${v || 'Not provided'}`).join('\n')}

Create a professional resume. Output ONLY valid JSON (no markdown) matching:
{
  "name": "...", "contact": { "email": "...", "phone": "...", "linkedin": "...", "github": "...", "website": "..." },
  "summary": "...", "education": [{"institution":"...","degree":"...","year":"...","gpa":"..."}],
  "experience": [{"role":"...","company":"...","duration":"...","location":"...","description":["bullet..."]}],
  "projects": [{"title":"...","description":"...","technologies":["..."],"link":"..."}],
  "skills": {"technical":["..."],"soft":["..."]},
  "certifications": ["..."],
  "atsScore": 85
}`;
            const result = await model.generateContent(prompt);
            let text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(text);
            setGeneratedResume(parsed);
            setAtsScore(parsed.atsScore || 78);
            saveVersion();
        } catch (e) {
            console.error(e);
            alert('AI generation failed. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    // ── AI IMPROVEMENT ─────────────────────────────────────────────
    const handleImprove = async (field) => {
        if (!generatedResume) return;
        setIsImproving(field);
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = field === 'summary'
                ? `Improve this professional summary to be more impactful, ATS-friendly, and concise for a ${resumeData.careerGoal} role. Return only the improved text, no labels:\n"${generatedResume.summary}"`
                : `Improve these bullet points to use strong action verbs and quantified achievements for a ${resumeData.careerGoal} role. Return only improved bullets separated by newlines:\n${generatedResume.experience?.map(e => e.description?.join('\n')).join('\n')}`;
            const result = await model.generateContent(prompt);
            const improved = result.response.text().trim();
            if (field === 'summary') setGeneratedResume(prev => ({ ...prev, summary: improved }));
        } catch (e) { console.error(e); } finally { setIsImproving(null); }
    };

    // ── PDF EXPORT ─────────────────────────────────────────────────
    const downloadPDF = () => {
        const input = resumeRef.current;
        html2canvas(input, { scale: 2, useCORS: true }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const w = pdf.internal.pageSize.getWidth();
            const h = (canvas.height * w) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, w, h);
            pdf.save(`${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`);
        });
    };

    // ── ATS ANALYZE ────────────────────────────────────────────────
    const handleAnalyzeATS = async () => {
        if (!resumeText || !jobDescription) return alert('Please provide both resume and job description.');
        setIsAnalyzing(true);
        setAtsResult(null);
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = `Act as an ATS analyzer. Compare this resume against this job description.
Resume: ${resumeText}
Job Description: ${jobDescription}
Output ONLY pure JSON (no markdown):
{ "score": 82, "missingKeywords": ["AWS", "Docker"], "matchedKeywords": ["React", "JavaScript"], "improvements": ["suggestion 1", "suggestion 2"], "verdict": "strong" }`;
            const result = await model.generateContent(prompt);
            let text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            setAtsResult(JSON.parse(text));
        } catch (e) { console.error(e); alert('Analysis failed. Try again.'); } finally { setIsAnalyzing(false); }
    };

    const accentColor = TEMPLATES[template]?.accent || '#6366f1';
    const inputStyle = { width: '100%', padding: '0.8rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', color: '#0f172a', background: '#f8fafc', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' };
    const taStyle = { ...inputStyle, minHeight: '80px', resize: 'vertical' };

    return (
        <div style={{ width: '100%', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif", color: '#0f172a' }}>

            {/* ── HEADER ──────────────────────────────── */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', padding: '3rem 3rem 2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div>
                            <span style={{ background: 'rgba(99,102,241,0.25)', color: '#a5b4fc', padding: '5px 14px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 800, display: 'inline-block', marginBottom: '1rem', border: '1px solid rgba(99,102,241,0.3)' }}>
                                🤖 AI-Powered · ATS-Optimized
                            </span>
                            <h1 style={{ color: 'white', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 900, margin: '0 0 0.5rem', lineHeight: 1.15 }}>Career Hub — Resume Builder</h1>
                            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.95rem' }}>Build AI-powered, ATS-optimized resumes with live preview and smart suggestions</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            {autoSaved && (
                                <span style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', padding: '6px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(16,185,129,0.2)' }}>
                                    <i className="fa-solid fa-floppy-disk" style={{ marginRight: '6px' }} /> Auto-saved
                                </span>
                            )}
                            <button onClick={() => setShowVersions(!showVersions)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '0.65rem 1.25rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="fa-solid fa-clock-rotate-left" /> History ({versions.length})
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── TAB NAV ─────────────────────────────── */}
            <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 3rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '0' }}>
                    {[['builder', 'fa-file-pen', 'Resume Builder'], ['preview', 'fa-eye', 'Live Preview'], ['analyzer', 'fa-chart-bar', 'ATS Analyzer']].map(([id, icon, label]) => (
                        <button key={id} onClick={() => setActiveTab(id)} style={{ padding: '1rem 1.5rem', border: 'none', borderBottom: `2.5px solid ${activeTab === id ? '#6366f1' : 'transparent'}`, background: 'transparent', color: activeTab === id ? '#6366f1' : '#64748b', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.2s' }}>
                            <i className={`fa-solid ${icon}`} />{label}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 3rem' }}>

                {/* VERSION HISTORY PANEL */}
                <AnimatePresence>
                    {showVersions && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
                            <div style={{ background: '#f1f5f9', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 800, color: '#374151', display: 'flex', alignItems: 'center', gap: '7px' }}><i className="fa-solid fa-clock-rotate-left" style={{ color: '#6366f1' }} /> Version History</h3>
                                {versions.length === 0 ? <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>No versions saved yet. Generate a resume to save a version.</p> : (
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        {versions.map(v => (
                                            <div key={v.id} style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <i className="fa-solid fa-file-lines" style={{ color: '#6366f1' }} />
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem' }}>{v.preview}</p>
                                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem' }}>{v.timestamp} · {v.template}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">

                    {/* ── BUILDER TAB ────────────────────── */}
                    {activeTab === 'builder' && (
                        <motion.div key="builder" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

                                {/* Form section */}
                                <div>
                                    {/* Contact Info */}
                                    <Section title="Personal Information" icon="fa-user" color="#6366f1">
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            {['name', 'careerGoal', 'email', 'phone', 'linkedin', 'github', 'website', 'domain'].map(field => (
                                                <div key={field} style={{ gridColumn: field === 'name' || field === 'careerGoal' ? 'auto' : 'auto' }}>
                                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 700, fontSize: '0.8rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{SECTION_LABELS[field]}</label>
                                                    <input style={inputStyle} value={resumeData[field]} onChange={e => setResumeData(p => ({ ...p, [field]: e.target.value }))} placeholder={`Enter ${SECTION_LABELS[field]?.toLowerCase()}`} onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                                                </div>
                                            ))}
                                        </div>
                                    </Section>

                                    {/* Education */}
                                    {sectionToggles.education && (
                                        <Section title="Education" icon="fa-graduation-cap" color="#10b981" toggleable onToggle={() => setSectionToggles(p => ({ ...p, education: false }))}>
                                            <textarea style={taStyle} value={resumeData.education} onChange={e => setResumeData(p => ({ ...p, education: e.target.value }))} placeholder="e.g. B.S. Computer Science, MIT, 2022 | GPA: 3.8" />
                                        </Section>
                                    )}

                                    {/* Skills */}
                                    {sectionToggles.skills && (
                                        <Section title="Technical Skills" icon="fa-code" color="#f59e0b" toggleable onToggle={() => setSectionToggles(p => ({ ...p, skills: false }))}>
                                            <textarea style={taStyle} value={resumeData.skills} onChange={e => setResumeData(p => ({ ...p, skills: e.target.value }))} placeholder="e.g. React, Node.js, Python, PostgreSQL, Docker, AWS, Git..." />
                                        </Section>
                                    )}

                                    {/* Experience */}
                                    {sectionToggles.experience && (
                                        <Section title="Work Experience" icon="fa-briefcase" color="#ec4899" toggleable onToggle={() => setSectionToggles(p => ({ ...p, experience: false }))}>
                                            <textarea style={{ ...taStyle, minHeight: '120px' }} value={resumeData.experience} onChange={e => setResumeData(p => ({ ...p, experience: e.target.value }))} placeholder="e.g. Software Engineer Intern at Google (June–Aug 2024) — Built real-time dashboard using React and GraphQL..." />
                                        </Section>
                                    )}

                                    {/* Projects */}
                                    {sectionToggles.projects && (
                                        <Section title="Projects" icon="fa-folder-open" color="#8b5cf6" toggleable onToggle={() => setSectionToggles(p => ({ ...p, projects: false }))}>
                                            <textarea style={{ ...taStyle, minHeight: '120px' }} value={resumeData.projects} onChange={e => setResumeData(p => ({ ...p, projects: e.target.value }))} placeholder="e.g. SkillPath AI — AI-powered career platform (React, Python, Gemini API). 500+ users..." />
                                        </Section>
                                    )}

                                    {/* Certifications */}
                                    {sectionToggles.certifications && (
                                        <Section title="Certifications" icon="fa-certificate" color="#06b6d4" toggleable onToggle={() => setSectionToggles(p => ({ ...p, certifications: false }))}>
                                            <input style={inputStyle} value={resumeData.certifications} onChange={e => setResumeData(p => ({ ...p, certifications: e.target.value }))} placeholder="AWS Cloud Practitioner, Google Analytics, Meta Frontend Developer..." />
                                        </Section>
                                    )}

                                    {!sectionToggles.experience || !sectionToggles.projects || !sectionToggles.certifications || !sectionToggles.education || !sectionToggles.skills ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                            {Object.entries(sectionToggles).filter(([, v]) => !v).map(([k]) => (
                                                <button key={k} onClick={() => setSectionToggles(p => ({ ...p, [k]: true }))} style={{ padding: '6px 14px', background: '#f1f5f9', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#64748b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <i className="fa-solid fa-plus" style={{ fontSize: '0.7rem' }} />Add {k.charAt(0).toUpperCase() + k.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}

                                    {/* Summary */}
                                    {sectionToggles.summary && (
                                        <Section title="Custom Summary (Optional)" icon="fa-align-left" color="#64748b">
                                            <textarea style={taStyle} value={resumeData.summary} onChange={e => setResumeData(p => ({ ...p, summary: e.target.value }))} placeholder="Leave blank to let AI craft a powerful summary for you..." />
                                        </Section>
                                    )}

                                    <button onClick={handleGenerateResume} disabled={isGenerating} style={{ width: '100%', padding: '1.1rem', background: isGenerating ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '1.05rem', cursor: isGenerating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: isGenerating ? 'none' : '0 8px 24px rgba(99,102,241,0.35)', transition: 'all 0.2s' }}>
                                        {isGenerating ? <><i className="fa-solid fa-spinner fa-spin" /> Generating ATS-Optimized Resume...</> : <><i className="fa-solid fa-wand-magic-sparkles" /> Generate AI Resume</>}
                                    </button>
                                </div>

                                {/* Right panel */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '80px' }}>
                                    {/* Template picker */}
                                    <div style={{ background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                                        <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className="fa-solid fa-palette" style={{ color: '#6366f1' }} /> Template
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {Object.entries(TEMPLATES).map(([id, t]) => (
                                                <button key={id} onClick={() => setTemplate(id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.75rem 1rem', borderRadius: '12px', border: `1.5px solid ${template === id ? t.accent : '#e2e8f0'}`, background: template === id ? `${t.accent}08` : 'transparent', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', textAlign: 'left' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: t.accent, flexShrink: 0 }} />
                                                    <div>
                                                        <p style={{ margin: 0, fontWeight: 800, fontSize: '0.85rem', color: template === id ? t.accent : '#0f172a' }}>{t.name}</p>
                                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{t.desc}</p>
                                                    </div>
                                                    {template === id && <i className="fa-solid fa-circle-check" style={{ marginLeft: 'auto', color: t.accent }} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ATS score */}
                                    {atsScore && (
                                        <div style={{ background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15,23,42,0.04)', textAlign: 'center' }}>
                                            <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>ATS Score</h3>
                                            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1rem' }}>
                                                <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                                                    <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                                    <circle cx="50" cy="50" r="42" fill="none" stroke={atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : '#ef4444'} strokeWidth="10" strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - atsScore / 100)}`} strokeLinecap="round" />
                                                </svg>
                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : '#ef4444' }}>{atsScore}%</span>
                                                </div>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : '#ef4444' }}>
                                                {atsScore >= 80 ? '✓ Strong ATS Match' : atsScore >= 60 ? '~ Good, can improve' : '⚠ Needs optimization'}
                                            </p>
                                        </div>
                                    )}

                                    {/* AI tools */}
                                    {generatedResume && (
                                        <div style={{ background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                                            <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '7px' }}>
                                                <i className="fa-solid fa-robot" style={{ color: '#6366f1' }} /> AI Tools
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {[['fa-pen-sparkles', 'Improve Summary', 'summary', '#6366f1'], ['fa-arrow-up-right-dots', 'Enhance Bullets', 'bullets', '#10b981'], ['fa-eye', 'Preview Resume', null, '#ec4899']].map(([icon, label, field, color]) => (
                                                    <button key={label} onClick={() => field ? handleImprove(field) : setActiveTab('preview')} disabled={isImproving === field} style={{ padding: '0.7rem 1rem', background: `${color}08`, border: `1px solid ${color}25`, borderRadius: '10px', color, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.2s' }}>
                                                        {isImproving === field ? <><i className="fa-solid fa-spinner fa-spin" /> Improving...</> : <><i className={`fa-solid ${icon}`} /> {label}</>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── PREVIEW TAB ────────────────────── */}
                    {activeTab === 'preview' && (
                        <motion.div key="preview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {!generatedResume ? (
                                <div style={{ textAlign: 'center', padding: '6rem', color: '#94a3b8' }}>
                                    <i className="fa-solid fa-file-dashed-line" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }} />
                                    <p style={{ fontWeight: 700, fontSize: '1rem' }}>No resume generated yet</p>
                                    <button onClick={() => setActiveTab('builder')} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Go to Builder</button>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1.25rem 1.5rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', background: `${accentColor}15`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor }}><i className="fa-solid fa-file-lines" /></div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem' }}>{generatedResume.name}</p>
                                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.78rem' }}>Template: {TEMPLATES[template]?.name} · {atsScore ? `ATS: ${atsScore}%` : ''}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button onClick={downloadPDF} style={{ padding: '0.7rem 1.25rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <i className="fa-solid fa-download" /> Download PDF
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ overflowX: 'auto', padding: '2rem', background: '#e2e8f0', borderRadius: '16px', display: 'flex', justifyContent: 'center' }}>
                                        <ResumePreview ref={resumeRef} data={generatedResume} template={template} accentColor={accentColor} toggles={sectionToggles} />
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}

                    {/* ── ATS ANALYZER TAB ───────────────── */}
                    {activeTab === 'analyzer' && (
                        <motion.div key="analyzer" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ maxWidth: '900px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.12)' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem', flexShrink: 0 }}><i className="fa-solid fa-robot" /></div>
                                    <div>
                                        <h2 style={{ margin: '0 0 3px', fontWeight: 900, fontSize: '1.2rem' }}>ATS Match Analyzer</h2>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Compare your resume against a job description to get an instant ATS compatibility score</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    {[['Your Resume', resumeText, setResumeText, 'Paste your complete resume text here...', '#6366f1'], ['Job Description', jobDescription, setJobDescription, 'Paste the target job description...', '#10b981']].map(([label, val, setter, ph, color]) => (
                                        <div key={label}>
                                            <label style={{ marginBottom: '8px', fontWeight: 800, fontSize: '0.85rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <i className="fa-solid fa-file-lines" style={{ color }} /> {label}
                                            </label>
                                            <textarea value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={{ ...taStyle, minHeight: '260px', borderColor: '#e2e8f0' }} onFocus={e => { e.target.style.borderColor = color; e.target.style.boxShadow = `0 0 0 3px ${color}15`; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                                        </div>
                                    ))}
                                </div>

                                <button onClick={handleAnalyzeATS} disabled={isAnalyzing} style={{ padding: '1rem 3rem', background: isAnalyzing ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '1rem', cursor: isAnalyzing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: isAnalyzing ? 'none' : '0 8px 24px rgba(99,102,241,0.3)' }}>
                                    {isAnalyzing ? <><i className="fa-solid fa-spinner fa-spin" /> Analyzing...</> : <><i className="fa-solid fa-magnifying-glass-chart" /> Analyze ATS Match</>}
                                </button>

                                <AnimatePresence>
                                    {atsResult && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem', background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
                                            <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', borderBottom: '1px solid #f1f5f9' }}>
                                                <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                                                    <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                                                        <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                                        <circle cx="50" cy="50" r="42" fill="none" stroke={atsResult.score >= 80 ? '#10b981' : atsResult.score >= 60 ? '#f59e0b' : '#ef4444'} strokeWidth="10" strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - atsResult.score / 100)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
                                                    </svg>
                                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                        <span style={{ fontSize: '1.6rem', fontWeight: 900, color: atsResult.score >= 80 ? '#10b981' : atsResult.score >= 60 ? '#f59e0b' : '#ef4444' }}>{atsResult.score}%</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 style={{ margin: '0 0 6px', fontWeight: 900 }}>ATS Match Score</h3>
                                                    <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6, fontSize: '0.9rem' }}>{atsResult.score >= 80 ? '🎉 Excellent match! High chance of passing ATS.' : atsResult.score >= 60 ? '✅ Good match. A few improvements can boost your score.' : '⚠️ Low match. Significant optimization needed.'}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderBottom: '1px solid #f1f5f9' }}>
                                                {[
                                                    { title: '✅ Matched Keywords', items: atsResult.matchedKeywords || [], color: '#10b981', bg: '#f0fdf4', border: '#dcfce7' },
                                                    { title: '❌ Missing Keywords', items: atsResult.missingKeywords || [], color: '#ef4444', bg: '#fef2f2', border: '#fee2e2' },
                                                ].map(({ title, items, color, bg, border }) => (
                                                    <div key={title} style={{ padding: '1.5rem', borderRight: '1px solid #f1f5f9' }}>
                                                        <h4 style={{ margin: '0 0 1rem', fontWeight: 800, fontSize: '0.875rem', color }}>{title}</h4>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                            {items.length > 0 ? items.map(kw => (
                                                                <span key={kw} style={{ background: bg, color, border: `1px solid ${border}`, padding: '3px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700 }}>{kw}</span>
                                                            )) : <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>None found</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ padding: '1.5rem' }}>
                                                <h4 style={{ margin: '0 0 1rem', fontWeight: 800, fontSize: '0.875rem', color: '#6366f1' }}>💡 AI Recommendations</h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    {(atsResult.improvements || []).map((imp, i) => (
                                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                                            <div style={{ width: '20px', height: '20px', background: '#6366f115', color: '#6366f1', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.7rem', fontWeight: 800 }}>{i + 1}</div>
                                                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: 1.5 }}>{imp}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

// ─── SECTION WRAPPER ─────────────────────────────────────────────────
const Section = ({ title, icon, color, children, toggleable, onToggle }) => (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '30px', height: '30px', background: `${color}15`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: '0.85rem' }}><i className={`fa-solid ${icon}`} /></div>
                {title}
            </h3>
            {toggleable && <button onClick={onToggle} style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>}
        </div>
        {children}
    </div>
);

// ─── RESUME PREVIEW ───────────────────────────────────────────────────
const ResumePreview = React.forwardRef(({ data, template, accentColor, toggles }, ref) => {
    const isCreative = template === 'creative';
    const s = {
        wrapper: { width: '210mm', minHeight: '297mm', background: 'white', fontFamily: template === 'executive' ? "'Times New Roman', serif" : "'Inter', sans-serif", color: '#0f172a', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', display: 'flex', flexDirection: isCreative ? 'row' : 'column' },
        sidebar: { width: '80mm', background: accentColor, color: 'white', padding: '2.5rem 1.5rem', flexShrink: 0 },
        main: { flex: 1, padding: '2.5rem' },
        header: { background: template === 'executive' ? '#0f172a' : accentColor, color: 'white', padding: '2.5rem', marginBottom: '0' },
        sectionTitle: { fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', color: accentColor, marginBottom: '0.75rem', paddingBottom: '4px', borderBottom: `2px solid ${accentColor}`, display: 'block' },
        sectionTitleDark: { fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem', display: 'block' },
    };

    const Header = () => (
        <div style={isCreative ? { padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.5rem' } : s.header}>
            <h1 style={{ margin: '0 0 4px', fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.5px', color: 'white' }}>{data.name}</h1>
            <p style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, opacity: 0.85, color: 'white' }}>{data.contact?.email?.split('@')[0] && data.contact.email}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.75rem', opacity: 0.8 }}>
                {data.contact?.phone && <span>📞 {data.contact.phone}</span>}
                {data.contact?.linkedin && <span>🔗 {data.contact.linkedin}</span>}
                {data.contact?.github && <span>💻 {data.contact.github}</span>}
                {data.contact?.website && <span>🌐 {data.contact.website}</span>}
            </div>
        </div>
    );

    const Body = () => (
        <div style={{ padding: isCreative ? '0' : '2rem', flex: 1 }}>
            {toggles?.summary && data.summary && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <span style={isCreative ? s.sectionTitleDark : s.sectionTitle}>Summary</span>
                    <p style={{ margin: 0, lineHeight: 1.7, fontSize: '0.85rem', color: isCreative ? 'rgba(255,255,255,0.9)' : '#374151' }}>{data.summary}</p>
                </div>
            )}
            {!isCreative && toggles?.skills && data.skills && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <span style={s.sectionTitle}>Technical Skills</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {[...(data.skills?.technical || []), ...(data.skills?.soft || [])].map((sk, i) => (
                            <span key={i} style={{ background: `${accentColor}12`, color: accentColor, padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, border: `1px solid ${accentColor}25` }}>{sk}</span>
                        ))}
                    </div>
                </div>
            )}
            {toggles?.experience && data.experience?.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <span style={isCreative ? s.sectionTitleDark : s.sectionTitle}>Experience</span>
                    {data.experience.map((ex, i) => (
                        <div key={i} style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                <strong style={{ fontSize: '0.9rem', color: isCreative ? 'white' : '#0f172a' }}>{ex.role}</strong>
                                <span style={{ fontSize: '0.78rem', color: isCreative ? 'rgba(255,255,255,0.7)' : '#94a3b8' }}>{ex.duration}</span>
                            </div>
                            <p style={{ margin: '0 0 5px', fontSize: '0.8rem', color: isCreative ? 'rgba(255,255,255,0.8)' : '#6366f1', fontWeight: 600 }}>{ex.company}</p>
                            <ul style={{ margin: 0, paddingLeft: '15px', fontSize: '0.78rem', lineHeight: 1.7, color: isCreative ? 'rgba(255,255,255,0.85)' : '#374151' }}>
                                {ex.description?.map((d, j) => <li key={j}>{d}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
            {toggles?.projects && data.projects?.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <span style={isCreative ? s.sectionTitleDark : s.sectionTitle}>Projects</span>
                    {data.projects.map((p, i) => (
                        <div key={i} style={{ marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                                <strong style={{ fontSize: '0.85rem', color: isCreative ? 'white' : '#0f172a' }}>{p.title}</strong>
                                <span style={{ fontSize: '0.72rem', color: isCreative ? 'rgba(255,255,255,0.6)' : '#94a3b8' }}>({p.technologies?.join(', ')})</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.6, color: isCreative ? 'rgba(255,255,255,0.85)' : '#374151' }}>{p.description}</p>
                        </div>
                    ))}
                </div>
            )}
            {toggles?.education && data.education?.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <span style={isCreative ? s.sectionTitleDark : s.sectionTitle}>Education</span>
                    {data.education.map((e, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <div>
                                <strong style={{ fontSize: '0.85rem', color: isCreative ? 'white' : '#0f172a' }}>{e.degree}</strong>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: isCreative ? 'rgba(255,255,255,0.7)' : '#64748b' }}>{e.institution}</p>
                            </div>
                            <span style={{ fontSize: '0.78rem', color: isCreative ? 'rgba(255,255,255,0.7)' : '#94a3b8' }}>{e.year}</span>
                        </div>
                    ))}
                </div>
            )}
            {toggles?.certifications && data.certifications?.length > 0 && (
                <div>
                    <span style={isCreative ? s.sectionTitleDark : s.sectionTitle}>Certifications</span>
                    <ul style={{ margin: 0, paddingLeft: '15px', fontSize: '0.78rem', lineHeight: 1.7, color: isCreative ? 'rgba(255,255,255,0.85)' : '#374151' }}>
                        {data.certifications.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );

    return (
        <div ref={ref} style={s.wrapper}>
            {isCreative ? (
                <>
                    <div style={s.sidebar}><Header /><Body /></div>
                    <div style={s.main}>
                        {toggles?.skills && data.skills && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <span style={s.sectionTitle}>Technical Skills</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {[...(data.skills?.technical || []), ...(data.skills?.soft || [])].map((sk, i) => (
                                        <span key={i} style={{ background: `${accentColor}12`, color: accentColor, padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, border: `1px solid ${accentColor}25` }}>{sk}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <><Header /><Body /></>
            )}
        </div>
    );
});

ResumePreview.displayName = 'ResumePreview';

export default Resume;
