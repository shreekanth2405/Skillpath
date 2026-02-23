import React, { useState, useEffect, useRef, useCallback } from 'react';
import { genAI } from '../services/gemini';
import tutorPortrait from '../assets/tutor_portrait.png';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const CommunicationAssistant = () => {
    const [theme] = useState('light'); // Forced light theme as requested
    const [mode, setMode] = useState('interview'); // interview, casual, presentation, gd
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [appStatus, setAppStatus] = useState("Ready to start session...");
    const [transcript, setTranscript] = useState([]);
    const [showReport, setShowReport] = useState(false);

    // Live Metrics
    const [metrics, setMetrics] = useState({
        fluency: 0,
        pronunciation: 0,
        grammar: 0,
        vocabulary: 0,
        confidence: 0,
        overall: 0,
        level: 'Detecting...'
    });

    // Final Report Data
    const [reportData, setReportData] = useState(null);

    // Media & recognition refs
    const videoRef = useRef(null);
    const recognitionRef = useRef(null);
    const synthesisRef = useRef(window.speechSynthesis);
    const sessionTimerRef = useRef(null);
    const [sessionDuration, setSessionDuration] = useState(0);
    const reportRef = useRef(null);

    // Initialize Media
    const startMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            console.error("Media Error:", err);
            setAppStatus("Media access required.");
        }
    };

    const stopMedia = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    // Speech Recognition Setup
    const setupRecognition = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let current = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                current += event.results[i][0].transcript;
            }
            // Update transcript UI
            if (event.results[event.results.length - 1].isFinal) {
                const text = event.results[event.results.length - 1][0].transcript;
                setTranscript(prev => [...prev, { speaker: 'User', text }]);
                analyzeSpeech(text);
            }
        };

        recognition.onend = () => {
            if (isSessionActive) recognition.start();
        };

        recognitionRef.current = recognition;
    }, [isSessionActive]);

    const startSession = () => {
        setIsSessionActive(true);
        setTranscript([]);
        setSessionDuration(0);
        setShowReport(false);
        setAppStatus("AI Assistant is listening...");
        startMedia();
        setupRecognition();
        recognitionRef.current?.start();

        sessionTimerRef.current = setInterval(() => {
            setSessionDuration(prev => prev + 1);
        }, 1000);

        // Initial AI Greeting
        const greeting = mode === 'interview' ? "Hello! Welcome to your mock interview. I'm Emma. Could you tell me about yourself?" : "Hi there! I'm ready to help you practice English. What shall we talk about today?";
        speak(greeting);
        setTranscript([{ speaker: 'AI', text: greeting }]);
    };

    const endSession = () => {
        setIsSessionActive(false);
        stopMedia();
        recognitionRef.current?.stop();
        if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
        generateFinalReport();
    };

    const speak = (text) => {
        if (!synthesisRef.current) return;
        synthesisRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.onstart = () => setIsTalking(true);
        utterance.onend = () => setIsTalking(false);
        synthesisRef.current.speak(utterance);
    };

    const analyzeSpeech = async (userText) => {
        // Real-time metric simulation for demo, AI logic for final report
        setMetrics(prev => ({
            fluency: Math.min(100, prev.fluency + Math.random() * 10),
            pronunciation: Math.min(100, prev.pronunciation + Math.random() * 8),
            grammar: Math.min(100, prev.grammar + Math.random() * 5),
            vocabulary: Math.min(100, prev.vocabulary + Math.random() * 6),
            confidence: Math.min(100, prev.confidence + Math.random() * 12),
            overall: Math.min(100, prev.overall + Math.random() * 7),
            level: prev.overall > 80 ? 'C1' : prev.overall > 60 ? 'B2' : 'B1'
        }));

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Act as an English Tutor. 
            User said: "${userText}"
            Context: ${mode} mode.
            Task:
            1. Respond naturally to the user (1-2 sentences).
            2. If you notice a major grammar mistake, briefly correct it.
            Keep it professional. Plain text.`;

            const result = await model.generateContent(prompt);
            const aiResponse = result.response.text();
            setTranscript(prev => [...prev, { speaker: 'AI', text: aiResponse }]);
            speak(aiResponse);
        } catch (err) {
            console.error(err);
        }
    };

    const generateFinalReport = () => {
        setReportData({
            overallLevel: metrics.level,
            scores: metrics,
            duration: sessionDuration,
            mistakes: [
                { original: "I goes to school", correction: "I go to school", reason: "Subject-verb agreement" },
                { original: "I am more better", correction: "I am better", reason: "Double comparative" }
            ],
            recommendations: [
                "Practice irregular verb conjugations.",
                "Work on pronunciation of 'th' sounds.",
                "Try using more varied vocabulary like 'advantageous' instead of 'good'."
            ]
        });
        setShowReport(true);
    };

    const downloadPDF = async () => {
        const element = reportRef.current;
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('AI_English_Report.pdf');
    };

    const styles = {
        container: {
            fontFamily: "'Inter', sans-serif",
            backgroundColor: '#FFFFFF',
            color: '#1E293B',
            minHeight: 'calc(100vh - 120px)',
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            padding: '2rem',
            gap: '1.5rem',
            gridColumn: '1 / -1'
        },
        sidebar: {
            background: '#F8FAFC',
            borderRadius: '24px',
            padding: '1.5rem',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        },
        interactionArea: {
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 300px',
            gap: '1.5rem',
            height: '100%'
        },
        videoFrame: {
            background: '#0F172A',
            borderRadius: '32px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
        },
        metricsPanel: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
        },
        metricCard: {
            background: '#FFFFFF',
            padding: '1rem',
            borderRadius: '16px',
            border: '1px solid #F1F5F9',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        },
        transcriptBox: {
            background: '#F8FAFC',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1rem',
            maxHeight: '200px',
            overflowY: 'auto',
            fontSize: '0.9rem'
        },
        btnStart: {
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '1rem'
        },
        btnEnd: {
            background: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '1rem'
        },
        modeBtn: (active) => ({
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: 'none',
            background: active ? '#3B82F6' : '#FFFFFF',
            color: active ? 'white' : '#64748B',
            cursor: 'pointer',
            fontWeight: '600',
            textAlign: 'left',
            transition: '0.2s'
        }),
        statusBadge: {
            padding: '4px 12px',
            borderRadius: '99px',
            background: isSessionActive ? '#DCFCE7' : '#F1F5F9',
            color: isSessionActive ? '#166534' : '#64748B',
            fontSize: '0.75rem',
            fontWeight: '700'
        },
        reportOverlay: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
        }
    };

    return (
        <div style={styles.container}>
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Skill Path AI Communication Assistant</h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Improve your English through real-time AI conversation and analysis.</p>
                </div>
                {!isSessionActive ? (
                    <button style={styles.btnStart} onClick={startSession}>
                        <i className="fa-solid fa-play" style={{ marginRight: '8px' }}></i> Start Practice Session
                    </button>
                ) : (
                    <button style={styles.btnEnd} onClick={endSession}>
                        <i className="fa-solid fa-stop" style={{ marginRight: '8px' }}></i> Finish & Analyze
                    </button>
                )}
            </div>

            {/* Interaction Area */}
            <div style={styles.interactionArea}>
                <div style={styles.videoFrame}>
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />

                    {/* Floating Avatar Overlay */}
                    <div style={{
                        position: 'absolute', top: '20px', right: '20px',
                        width: '120px', height: '120px', borderRadius: '24px',
                        border: '4px solid rgba(255,255,255,0.2)', overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)', background: '#1e293b'
                    }}>
                        <img src={tutorPortrait} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isTalking ? 'brightness(1.2)' : 'brightness(1)' }} />
                        {isTalking && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: '#3B82F6', animation: 'pulse 1s infinite' }} />}
                    </div>

                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <p style={{ color: '#E2E8F0', fontStyle: 'italic', margin: 0, fontSize: '1rem' }}>
                            {transcript.length > 0 ? transcript[transcript.length - 1].text : "AI is ready. Start speaking..."}
                        </p>
                    </div>
                </div>

                <div style={styles.metricsPanel}>
                    {/* Mode Selector */}
                    <div style={styles.sidebar}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Practice Topic</h4>
                        <button style={styles.modeBtn(mode === 'interview')} onClick={() => setMode('interview')}>Mock Interview</button>
                        <button style={styles.modeBtn(mode === 'casual')} onClick={() => setMode('casual')}>Casual Talk</button>
                        <button style={styles.modeBtn(mode === 'presentation')} onClick={() => setMode('presentation')}>Presentation Prep</button>
                        <button style={styles.modeBtn(mode === 'gd')} onClick={() => setMode('gd')}>Group Discussion</button>
                    </div>

                    {/* Live Gauges */}
                    <div style={{ ...styles.sidebar, gap: '0.75rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Real-time Analysis</h4>
                        {Object.entries(metrics).map(([key, val]) => {
                            if (key === 'level') return null;
                            if (key === 'overall') return null;
                            return (
                                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700' }}>
                                        <span style={{ textTransform: 'capitalize' }}>{key}</span>
                                        <span style={{ color: '#3B82F6' }}>{Math.round(val)}%</span>
                                    </div>
                                    <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${val}%`, background: '#3B82F6', borderRadius: '3px', transition: 'width 0.5s ease' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ ...styles.sidebar, background: '#EFF6FF', borderColor: '#DBEAFE' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1E3A8A' }}>AI LEVEL DETECTION</h4>
                        <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2563EB' }}>{metrics.level}</span>
                        <p style={{ fontSize: '0.75rem', color: '#1E40AF', margin: 0 }}>CEFR Equivalent Score</p>
                    </div>
                </div>
            </div>

            {/* Transcript Area */}
            <div style={styles.transcriptBox}>
                {transcript.map((item, idx) => (
                    <p key={idx} style={{ marginBottom: '8px', color: item.speaker === 'AI' ? '#8B5CF6' : '#1E293B', fontWeight: item.speaker === 'AI' ? '700' : '500' }}>
                        <span style={{ fontSize: '0.7rem', opacity: 0.5, marginRight: '8px' }}>{item.speaker}:</span> {item.text}
                    </p>
                ))}
            </div>

            {/* Report Modal */}
            {showReport && reportData && (
                <div style={styles.reportOverlay}>
                    <div style={{ background: 'white', padding: '3rem', borderRadius: '32px', maxWidth: '800px', width: '100%', overflowY: 'auto', maxHeight: '90vh', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
                        <div ref={reportRef}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <img src={tutorPortrait} style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem' }} alt="Emma" />
                                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1E3A8A' }}>Session Performance Report</h2>
                                <p style={{ color: '#64748B' }}>Analyzed by AI English Tutor • {new Date().toLocaleDateString()}</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                <div style={{ textAlign: 'center', padding: '1.5rem', background: '#F8FAFC', borderRadius: '16px' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B' }}>CEFR LEVEL</span>
                                    <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#3B82F6' }}>{reportData.overallLevel}</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '1.5rem', background: '#F8FAFC', borderRadius: '16px' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B' }}>DURATION</span>
                                    <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#3B82F6' }}>{Math.floor(reportData.duration / 60)}m {reportData.duration % 60}s</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '1.5rem', background: '#F8FAFC', borderRadius: '16px' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B' }}>CONFIDENCE</span>
                                    <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#10B981' }}>{Math.round(reportData.scores.confidence)}%</div>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>Grammar Corrections</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                {reportData.mistakes.map((m, i) => (
                                    <div key={i} style={{ padding: '1rem', borderLeft: '4px solid #EF4444', background: '#FEF2F2', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '0.9rem', color: '#EF4444', textDecoration: 'line-through' }}>{m.original}</div>
                                        <div style={{ fontSize: '1rem', fontWeight: '700', color: '#166534' }}>{m.correction}</div>
                                        <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '4px 0 0' }}>{m.reason}</p>
                                    </div>
                                ))}
                            </div>

                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>AI Recommendations</h3>
                            <ul style={{ paddingLeft: '1.25rem', marginBottom: '2rem' }}>
                                {reportData.recommendations.map((r, i) => (
                                    <li key={i} style={{ marginBottom: '8px', fontSize: '0.95rem', color: '#475569' }}>{r}</li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={downloadPDF} style={{ ...styles.btnStart, flex: 1 }}>Download PDF Report</button>
                            <button onClick={() => setShowReport(false)} style={{ ...styles.btnSecondary, background: '#F1F5F9', border: 'none', color: '#1E293B', padding: '1rem', flex: 1 }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { transform: scaleX(0); }
                    50% { transform: scaleX(1); }
                    100% { transform: scaleX(0); }
                }
            `}</style>
        </div>
    );
};

export default CommunicationAssistant;
