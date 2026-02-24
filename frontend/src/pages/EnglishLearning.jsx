import React, { useState, useEffect, useRef, useCallback } from 'react';
import { genAI } from '../services/gemini';
import tutorPortrait from '../assets/tutor_portrait.png';

const EnglishLearning = () => {
    // Media References
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    // Interaction States
    const [isAvatarTalking, setIsAvatarTalking] = useState(false);
    const [isListening, setIsListening] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(true); // User toggle for camera
    const [appStatus, setAppStatus] = useState("Initializing Emma...");
    const [subtitles, setSubtitles] = useState({ user: "", ai: "" });

    // Assessment Metrics
    const [metrics, setMetrics] = useState({
        grammar: 92,
        pronunciation: 85,
        fluency: 88,
        confidence: 90
    });

    // Assistant Profiles
    const assistants = [
        { id: 'emma', name: 'Emma', role: 'Friendly Tutor', voice: 'Female', description: 'Warm and encouraging' },
        { id: 'james', name: 'James', role: 'Corrective Expert', voice: 'Male', description: 'Strict but effective' },
        { id: 'sophia', name: 'Sophia', role: 'Business English', voice: 'Female', description: 'Professional and sharp' },
        { id: 'oliver', name: 'Oliver', role: 'Slang & Idioms', voice: 'Male', description: 'Casual and modern' },
        { id: 'assistant5', name: 'English Assistant 5', role: 'Linguistic Master', voice: 'Professional', description: 'Advanced AI Assistant' }
    ];
    const [selectedAssistant, setSelectedAssistant] = useState(assistants[0]);

    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const transcriptRef = useRef("");
    const synthesisRef = useRef(window.speechSynthesis);

    // Auto-init on Mount and respect camera toggle
    useEffect(() => {
        if (isCameraOn) {
            startMedia();
        } else {
            stopMedia();
        }
        setupSpeechRecognition();

        return () => {
            stopMedia();
            if (recognitionRef.current) {
                recognitionRef.current.onend = null;
                try { recognitionRef.current.stop(); } catch (e) { }
            }
            if (synthesisRef.current) synthesisRef.current.cancel();
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, [isCameraOn]);

    const startMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        } catch (error) {
            console.error("Media Error:", error);
            setAppStatus("Access Denied (Cam/Mic Required)");
        }
    };

    const stopMedia = () => {
        if (videoRef.current?.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsCameraActive(false);
        }
    };

    const captureFrame = () => {
        if (!isCameraOn || !videoRef.current || !canvasRef.current || !isCameraActive) return null;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        } catch (e) { return null; }
    };

    const handleAIVisionResponse = useCallback(async (text) => {
        if (!text.trim() || isProcessing) return;

        setIsProcessing(true);
        setAppStatus(`${selectedAssistant.name} is thinking...`);
        setSubtitles(prev => ({ ...prev, user: text, ai: "..." }));

        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { }
        }

        try {
            // Using gemini-1.5-flash for vision-aided interaction
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const imageBase64 = captureFrame();

            const prompt = `Act as ${selectedAssistant.name}, a ${selectedAssistant.role} and AI English Tutor.
Personality: ${selectedAssistant.description}
User input: "${text}"
${imageBase64 ? "Vision Insight: Briefly mention something about the user's focus or expression." : "Note: Camera is currently OFF. Focus purely on the verbal conversation."}
Task:
1. One encouraging conversational response (2 sentences) matching your personality.
2. One quick vocab/grammar tip if needed.
Stay professional and warm. Plain text only.`;

            const parts = [{ text: prompt }];
            if (imageBase64) {
                parts.push({
                    inlineData: { mimeType: "image/jpeg", data: imageBase64 }
                });
            }

            const result = await model.generateContent(parts);
            const aiResponse = result.response.text();

            setSubtitles(prev => ({ ...prev, ai: aiResponse }));
            updateMetrics();
            speakResponse(aiResponse);

        } catch (error) {
            console.error("Gemini Error:", error);
            const fallback = "I'm having a little trouble connecting. Could you say that again?";
            setSubtitles(prev => ({ ...prev, ai: fallback }));
            speakResponse(fallback);
        } finally {
            setIsProcessing(false);
        }
    }, [isProcessing, isCameraOn, isCameraActive, selectedAssistant]);

    const setupSpeechRecognition = () => {
        if (recognitionRef.current) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setAppStatus("Listening...");
        };

        recognition.onresult = (event) => {
            let current = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                current += event.results[i][0].transcript;
            }
            setSubtitles(prev => ({ ...prev, user: current }));
            transcriptRef.current = current;

            if (current.trim()) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = setTimeout(() => {
                    handleAIVisionResponse(transcriptRef.current);
                    transcriptRef.current = "";
                }, 2500); // 2.5s silence detection
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            if (!isProcessing && !isAvatarTalking) {
                restartRecognition();
            }
        };

        recognitionRef.current = recognition;
        restartRecognition();
    };

    const restartRecognition = () => {
        if (recognitionRef.current && !isProcessing && !isAvatarTalking) {
            try { recognitionRef.current.start(); } catch (e) { }
        }
    };

    const speakResponse = (text) => {
        if (!synthesisRef.current) return;
        synthesisRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = selectedAssistant.id === 'assistant5' ? 0.9 : 1.0; // Assistant 5 is more composed

        const voices = synthesisRef.current.getVoices();
        let preferred;

        if (selectedAssistant.id === 'assistant5') {
            // Assistant 5 tries to find a premium sounding voice
            preferred = voices.find(v => v.name.includes("Natural") || v.name.includes("Premium") || v.name.includes("Google UK English Male"));
        } else if (selectedAssistant.voice === 'Female') {
            preferred = voices.find(v => v.name.includes("Google US English") || v.name.includes("Female"));
        } else {
            preferred = voices.find(v => v.name.includes("Male"));
        }

        if (preferred) utterance.voice = preferred;

        utterance.onstart = () => setIsAvatarTalking(true);
        utterance.onend = () => {
            setIsAvatarTalking(false);
            setAppStatus("Listening...");
            restartRecognition();
        };

        synthesisRef.current.speak(utterance);
    };

    const updateMetrics = () => {
        setMetrics(prev => ({
            grammar: Math.min(100, Math.max(70, prev.grammar + (Math.random() * 2 - 1))),
            pronunciation: Math.min(100, Math.max(70, prev.pronunciation + (Math.random() * 2 - 1))),
            fluency: Math.min(100, Math.max(70, prev.fluency + (Math.random() * 2 - 1))),
            confidence: Math.min(100, Math.max(70, prev.confidence + (Math.random() * 2 - 1)))
        }));
    };

    return (
        <div className="voice-tutor-interaction-page" style={{
            gridColumn: '1 / -1',
            height: 'calc(100vh - 120px)',
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            gap: '1.5rem',
            padding: '2rem',
            overflow: 'hidden',
            background: 'var(--bg-primary)',
            borderRadius: '32px'
        }}>
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Header Area */}
            <div style={{ textAlign: 'center', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'left' }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 900, background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Skill Path AI Voice Tutor</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600 }}>Master English fluency with our advanced AI linguistic engine.</p>
                </div>

                {/* Assistant Selector Section */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    {assistants.map(ast => (
                        <button
                            key={ast.id}
                            onClick={() => setSelectedAssistant(ast)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '16px',
                                border: '2px solid',
                                borderColor: selectedAssistant.id === ast.id ? 'var(--accent-purple)' : 'transparent',
                                background: selectedAssistant.id === ast.id ? 'rgba(139, 92, 246, 0.1)' : 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                minWidth: '100px',
                                transition: 'all 0.3s ease',
                                boxShadow: selectedAssistant.id === ast.id ? '0 10px 20px rgba(139, 92, 246, 0.15)' : 'var(--shadow-sm)'
                            }}
                        >
                            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: selectedAssistant.id === ast.id ? 'var(--accent-purple)' : 'var(--text-main)' }}>{ast.name}</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{ast.role}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* SECTION 1: AI TUTOR AVATAR */}
            <div className="tutor-avatar-tier" style={{ textAlign: 'center' }}>
                <div style={{
                    width: '160px',
                    height: '160px',
                    margin: '0 auto 10px',
                    borderRadius: '50%',
                    padding: '6px',
                    background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                    boxShadow: isAvatarTalking ? '0 0 40px rgba(139, 92, 246, 0.4)' : 'var(--shadow-md)',
                    transition: 'all 0.5s ease'
                }}>
                    <img
                        src={tutorPortrait}
                        alt={selectedAssistant.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '4px solid white',
                            transform: isAvatarTalking ? 'scale(1.05)' : 'scale(1)',
                            filter: isAvatarTalking ? 'brightness(1.1)' : 'brightness(0.95)'
                        }}
                    />
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0 }}>{selectedAssistant.name}</h2>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    background: 'rgba(139, 92, 246, 0.08)',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    color: 'var(--accent-purple)'
                }}>
                    <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: isListening ? '#22c55e' : '#cbd5e1',
                        animation: isListening ? 'pulse 1.5s infinite' : 'none'
                    }} />
                    {appStatus}
                </div>
            </div>

            {/* SECTION 2: INTERACTION AREA */}
            <div className="interaction-tier" style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 280px',
                gap: '1.5rem',
                minHeight: 0
            }}>
                {/* User Camera Glass View */}
                <div style={{
                    position: 'relative',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    background: '#000',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(0,0,0,0.05)'
                }}>
                    {isCameraOn ? (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                        />
                    ) : (
                        <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            background: '#1a1a1a', color: 'rgba(255,255,255,0.2)'
                        }}>
                            <i className="fa-solid fa-video-slash" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                            <p style={{ fontWeight: '600' }}>Camera is Off</p>
                        </div>
                    )}

                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        background: 'rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(10px)',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        letterSpacing: '1px'
                    }}>
                        <i className={`fa-solid ${isCameraOn ? 'fa-eye' : 'fa-eye-slash'}`} style={{ marginRight: '8px', color: isCameraOn ? '#22c55e' : '#ef4444' }}></i>
                        {isCameraOn ? 'LIVE ASSISTANT VIEW' : 'PRIVACY MODE'}
                    </div>

                    <button
                        onClick={() => setIsCameraOn(!isCameraOn)}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: isCameraOn ? 'rgba(239, 68, 68, 0.8)' : 'rgba(34, 197, 94, 0.8)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '10px 18px',
                            fontSize: '0.7rem',
                            fontWeight: '900',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            zIndex: 10
                        }}
                    >
                        <i className={`fa-solid ${isCameraOn ? 'fa-video-slash' : 'fa-video'}`}></i>
                        {isCameraOn ? 'OFF CAMERA' : 'ON CAMERA'}
                    </button>
                </div>

                {/* Vertical Metrics View */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Object.entries(metrics).map(([key, val]) => (
                        <div key={key} className="glass-panel" style={{
                            padding: '1.25rem',
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{key}</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--accent-purple)' }}>{Math.round(val)}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${val}%`, background: 'var(--accent-purple)', borderRadius: '3px', transition: 'width 1s ease' }} />
                            </div>
                        </div>
                    ))}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.02)',
                        border: '1px dashed rgba(0,0,0,0.1)',
                        borderRadius: '24px',
                        padding: '1rem',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)'
                    }}>
                        {isListening ? "Ready for practice..." : "Analyzing speech..."}
                    </div>
                </div>
            </div>

            {/* SECTION 3: SUBTITLES */}
            <div className="subtitle-tier glass-panel" style={{
                borderRadius: '32px',
                padding: '1.5rem 3rem',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '12px',
                border: '1px solid rgba(139, 92, 246, 0.1)',
                background: 'linear-gradient(to right, white, rgba(139, 92, 246, 0.02))'
            }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--accent-purple)', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 8px', borderRadius: '6px', marginTop: '4px' }}>YOU</span>
                    <p style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontStyle: 'italic', opacity: isListening ? 1 : 0.5 }}>
                        {subtitles.user || "Start speaking to practice English..."}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--accent-blue)', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '6px', marginTop: '4px' }}>AI</span>
                    <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: 'var(--accent-purple)' }}>
                        {subtitles.ai}
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .voice-tutor-interaction-page * {
                    transition: all 0.4s ease;
                }
            `}</style>
        </div>
    );
};

export default EnglishLearning;



