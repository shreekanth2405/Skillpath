import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from '../services/prism';
import 'prismjs/themes/prism-tomorrow.css';

const LabRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lab, setLab] = useState(null);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTask, setActiveTask] = useState(0);

    useEffect(() => {
        const fetchLab = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/labs/${id}`);
                const data = await res.json();
                if (data.success) {
                    setLab(data.data);
                    setCode(data.data.starterCode || '');
                } else {
                    alert("Lab not found");
                    navigate('/learning/labs');
                }
            } catch (err) {
                console.error("Failed to fetch lab", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLab();
    }, [id]);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/labs/${id}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    code,
                    status: 'Completed',
                    notes: 'Submitted via Lab Interface'
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(`CONGRATULATIONS! Lab Completed. You earned ${data.xpEarned} XP!`);
                navigate('/learning/labs');
            }
        } catch (err) {
            console.error("Submission failed", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
                <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '3rem', color: '#6366f1' }}></i>
            </div>
        );
    }

    return (
        <div style={{ height: 'calc(100vh - 70px)', display: 'grid', gridTemplateColumns: '400px 1fr', background: '#0f172a', color: 'white', overflow: 'hidden' }}>
            
            {/* LEFT PANEL: INSTRUCTIONS & TASKS */}
            <div style={{ borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#1e293b' }}>
                <div style={{ padding: '2rem' }}>
                    <div style={{ color: '#6366f1', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '10px' }}>
                        ROOM {lab.roomNumber} | {lab.domain.toUpperCase()}
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem' }}>{lab.title}</h2>
                    <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>{lab.description}</p>

                    <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #334155' }}>
                        <h4 style={{ color: '#10b981', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fa-solid fa-circle-info"></i> INSTRUCTIONS
                        </h4>
                        <div style={{ color: '#cbd5e1', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                            {lab.instructions}
                        </div>
                    </div>

                    <h4 style={{ color: '#cbd5e1', marginBottom: '1rem' }}>TASKS</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {(lab.tasks || []).map((task, i) => (
                            <div key={i} style={{ 
                                padding: '1rem', 
                                background: activeTask === i ? '#334155' : '#1e293b', 
                                border: `1px solid ${activeTask === i ? '#6366f1' : '#334155'}`,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px'
                            }}>
                                <div style={{ 
                                    width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #6366f1',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900
                                }}>
                                    {i + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{task.title}</div>
                                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{task.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 'auto', padding: '2rem', background: '#0f172a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ color: '#94a3b8', fontWeight: 700 }}>REWARD</span>
                        <span style={{ color: '#f59e0b', fontWeight: 900 }}>{lab.xpReward} XP</span>
                    </div>
                    <button 
                        onClick={handleSubmit} 
                        disabled={submitting}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '12px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            fontWeight: 900,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                        }}
                    >
                        {submitting ? <i className="fa-solid fa-spinner fa-spin"></i> : 'SUBMIT SOLUTION'}
                    </button>
                </div>
            </div>

            {/* RIGHT PANEL: EDITOR */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ background: '#0f172a', padding: '10px 20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ padding: '5px 15px', background: '#1e293b', borderRadius: '5px', fontSize: '0.8rem', color: '#94a3b8' }}>main.js</div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Autosave: Enabled</div>
                </div>
                
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', fontFamily: '"Fira Code", monospace' }}>
                    <Editor
                        value={code}
                        onValueChange={code => setCode(code)}
                        highlight={code => highlight(code, languages.js, 'javascript')}
                        padding={20}
                        style={{
                            fontFamily: '"Fira Code", monospace',
                            fontSize: 16,
                            minHeight: '100%',
                            background: '#0f172a'
                        }}
                    />
                </div>

                <div style={{ height: '30%', borderTop: '1px solid #1e293b', background: '#0f172a', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '10px 20px', background: '#1e293b', display: 'flex', gap: '20px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>TERMINAL</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8' }}>OUTPUT</div>
                    </div>
                    <div style={{ flex: 1, padding: '20px', color: '#64748b', fontSize: '0.9rem' }}>
                        $ npm start<br/>
                        <span style={{ color: '#10b981' }}>Successfully launched lab environment...</span><br/>
                        Waiting for code execution...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabRoom;
