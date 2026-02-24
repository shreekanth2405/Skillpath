import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Play, Volume2, VolumeX, MessageCircle, Settings, BarChart2, Shield, Sparkles, BookOpen, User, Trophy } from 'lucide-react';
import { genAI } from '../services/gemini';

// ─── EMILIA AVATAR COMPONENT ─────────────────────────────────────────
// A sophisticated SVG-based 3D-styled avatar with expressive animations
const EmiliaAvatar = ({ status }) => {
    // status: 'idle' | 'listening' | 'speaking' | 'off'
    const isTalking = status === 'speaking';
    const isListening = status === 'listening';

    return (
        <div style={{ position: 'relative', width: '320px', height: '320px', margin: '0 auto' }}>
            <motion.div
                animate={isTalking ? { y: [0, -5, 0] } : { y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: 'relative', width: '100%', height: '100%' }}
            >
                {/* Background Glow */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
                    filter: 'blur(20px)', zIndex: -1
                }} />

                {/* SVG Character */}
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Hair Back */}
                    <path d="M50 80C50 40 150 40 150 80V120H50V80Z" fill="#312e81" />

                    {/* Face */}
                    <path d="M60 80C60 55 140 55 140 80C140 115 130 145 100 145C70 145 60 115 60 80Z" fill="#ffe4e6" />

                    {/* Eyes */}
                    <g>
                        {/* L Eye */}
                        <motion.circle cx="85" cy="85" r="4" fill="#0f172a"
                            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.92, 0.94, 1] }}
                        />
                        {/* R Eye */}
                        <motion.circle cx="115" cy="85" r="4" fill="#0f172a"
                            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.92, 0.94, 1] }}
                        />
                    </g>

                    {/* Mouth */}
                    <motion.ellipse
                        cx="100" cy="115" rx="10"
                        animate={isTalking ? { ry: [2, 6, 2, 5, 2], opacity: 1 } : { ry: 2, opacity: 0.6 }}
                        transition={isTalking ? { duration: 0.3, repeat: Infinity } : {}}
                        fill="#be123c"
                    />

                    {/* Hair Front / Bangs */}
                    <path d="M60 75C60 50 140 50 140 75L140 90C120 85 80 85 60 90V75Z" fill="#4338ca" />

                    {/* Blushing */}
                    <circle cx="75" cy="100" r="5" fill="#fecdd3" opacity="0.4" />
                    <circle cx="125" cy="100" r="5" fill="#fecdd3" opacity="0.4" />

                    {/* Listening Indicators */}
                    {isListening && (
                        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <circle cx="20" cy="100" r="2" fill="#6366f1">
                                <animate attributeName="r" values="1;4;1" dur="1s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="180" cy="100" r="2" fill="#6366f1">
                                <animate attributeName="r" values="1;4;1" dur="1s" begin="0.5s" repeatCount="indefinite" />
                            </circle>
                        </motion.g>
                    )}
                </svg>

                {/* Status Halo */}
                <AnimatePresence>
                    {(isListening || isTalking) && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            style={{
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                border: `2px solid ${isTalking ? '#3b82f6' : '#10b981'}`,
                                borderRadius: '50%', filter: 'blur(8px)', opacity: 0.3
                            }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

// ─── WAVEFORM COMPONENT ──────────────────────────────────────────────
const Waveform = ({ active }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '40px' }}>
        {[...Array(20)].map((_, i) => (
            <motion.div
                key={i}
                animate={active ? { height: [5, Math.random() * 30 + 10, 5] } : { height: 5 }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                style={{ width: '4px', background: active ? 'linear-gradient(to top, #6366f1, #06b6d4)' : '#e2e8f0', borderRadius: '2px' }}
            />
        ))}
    </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────
const CommunicationAssistant = () => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [status, setStatus] = useState('off'); // 'idle' | 'listening' | 'speaking' | 'off'
    const [transcript, setTranscript] = useState([]);
    const [mode, setMode] = useState('Daily Conversation');
    const [difficulty, setDifficulty] = useState('Intermediate');
    const [speakingScore, setSpeakingScore] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [mistakes, setMistakes] = useState([]);
    const [showReport, setShowReport] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Refs for persistence
    const recognitionRef = useRef(null);
    const synthesisRef = useRef(window.speechSynthesis);

    // Assistant Profiles
    const assistants = [
        { id: 'emilia', name: 'Emilia', role: 'Daily Tutor', description: 'Friendly and supportive' },
        { id: 'assistant5', name: 'English Assistant 5', role: 'Linguistic Expert', description: 'Highly professional and advanced AI' },
        { id: 'atlas', name: 'Atlas', role: 'Critique Master', description: 'Direct and analytical' }
    ];
    const [selectedAssistant, setSelectedAssistant] = useState(assistants[0]);

    // AI Tutoring Logic
    const analyzeSpeech = async (userText) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setStatus('speaking');

        // Stop recognition while processing to avoid echoes/feedback loops
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { }
        }

        try {
            // Using direct Gemini call (frontend fallback logic)
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Act as ${selectedAssistant.name}, an elite AI English Tutor.
            Context: ${selectedAssistant.description}
            User Mode: ${mode}
            Difficulty: ${difficulty}
            User said: "${userText}"
            
            Instruction:
            1. Respond as ${selectedAssistant.name} (voice-optimized, 1-2 sentences).
            2. If there's a grammar error, fix it in parentheses at the end like "(Correction: ... because ...)".
            3. Ask a relevant follow-up.
            4. If the user suggests a topic, follow it.
            Keep the tone appropriate for your personality.`;

            const result = await model.generateContent(prompt);
            const aiResponse = result.response.text();

            // Extract correction
            if (aiResponse.includes('(Correction:')) {
                const corr = aiResponse.match(/\(Correction: (.*?)\)/);
                if (corr) setMistakes(prev => [...prev, corr[1]].slice(-5));
            }

            setTranscript(prev => [...prev, { speaker: 'AI', text: aiResponse, timestamp: new Date() }]);
            speak(aiResponse);

            // Score simulation
            setSpeakingScore(prev => Math.min(100, (prev === 0 ? 65 : prev) + (Math.random() * 5)));
        } catch (err) {
            console.error("Emilia AI Error Details:", err);
            const errorMsg = err.message || "Unknown error";
            setTranscript(prev => [...prev, { speaker: 'AI', text: `Sorry, I had a technical glitch (${errorMsg}). Let's try again.`, timestamp: new Date() }]);
            speak("Sorry, I had a technical glitch. Let's try again.");
            setStatus('idle');
        } finally {
            setIsProcessing(false);
        }
    };

    const speak = (text) => {
        if (!synthesisRef.current || isMuted) {
            setStatus('idle');
            return;
        }
        synthesisRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";

        // Assistant 5 Voice Selection
        const voices = synthesisRef.current.getVoices();
        let voice;
        if (selectedAssistant.id === 'assistant5') {
            voice = voices.find(v => v.name.includes("Natural") || v.name.includes("Premium") || v.name.includes("Male") && v.lang.includes("en-GB"));
            utterance.rate = 0.9;
        } else {
            voice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Female"));
            utterance.rate = 1.0;
        }

        if (voice) utterance.voice = voice;

        utterance.onstart = () => setStatus('speaking');
        utterance.onend = () => {
            setStatus('idle');
            // Restart recognition after speaking
            if (isSessionActive && recognitionRef.current) {
                try { recognitionRef.current.start(); } catch (e) { }
            }
        };
        synthesisRef.current.speak(utterance);
    };

    // Voice Interaction Lifecycle
    const setupRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setStatus('idle');

        recognition.onresult = (event) => {
            const result = event.results[event.results.length - 1];
            if (result.isFinal) {
                const text = result[0].transcript;
                setTranscript(prev => [...prev, { speaker: 'User', text, timestamp: new Date() }]);
                analyzeSpeech(text);
            } else {
                setStatus('listening');
            }
        };

        recognition.onend = () => {
            if (isSessionActive) recognition.start();
        };

        recognitionRef.current = recognition;
    };

    const startConversation = () => {
        setIsSessionActive(true);
        setTranscript([]);
        setSpeakingScore(0);
        setupRecognition();
        recognitionRef.current.start();

        const greeting = `Hi! I'm ${selectedAssistant.name}, your voice tutor. We're in ${mode} mode. I'm ready when you are!`;
        setTranscript([{ speaker: 'AI', text: greeting, timestamp: new Date() }]);
        speak(greeting);
    };

    const stopConversation = () => {
        setIsSessionActive(false);
        setStatus('off');
        recognitionRef.current?.stop();
        synthesisRef.current?.cancel();

        setReportData({
            score: Math.round(speakingScore),
            messages: transcript.length,
            mistakes: mistakes,
            recommendation: "Excellent progress! Next time, try to incorporate more complex transition words like 'subsequently' or 'notwithstanding' to boost your vocabulary richness."
        });
        setShowReport(true);
    };

    const modes = [
        { id: 'Daily Conversation', icon: <MessageCircle size={18} />, desc: 'Casual everyday talk' },
        { id: 'Interview Practice', icon: <User size={18} />, desc: 'Mock HR interviews' },
        { id: 'IELTS/Speaking', icon: <BookOpen size={18} />, desc: 'Exam preparation' },
        { id: 'Debate Mode', icon: <Sparkles size={18} />, desc: 'Critical thinking' }
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>

            <AnimatePresence>
                {showReport && reportData && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            style={{ background: 'white', borderRadius: '40px', padding: '3rem', maxWidth: '550px', width: '100%', textAlign: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}
                        >
                            <div style={{ width: '70px', height: '70px', background: '#f5f3ff', color: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Trophy size={36} /></motion.div>
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Session <span style={{ color: '#6366f1' }}>Summary</span></h2>
                            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>You've completed your practice with Emilia.</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '2rem 0' }}>
                                <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '24px' }}>
                                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#6366f1' }}>{reportData.score}</div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Fluency Score</div>
                                </div>
                                <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '24px' }}>
                                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981' }}>{reportData.messages}</div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Exchanges</div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
                                <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.75rem' }}>AI Feedback</h4>
                                <div style={{ background: '#eff6ff', padding: '1.25rem', borderRadius: '20px', border: '1px solid #dbeafe', color: '#1e40af', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                    {reportData.recommendation}
                                </div>
                            </div>

                            <button
                                onClick={() => setShowReport(false)}
                                style={{ width: '100%', padding: '1rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}
                            >
                                Continue Practicing
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '2rem' }}>

                {/* LEFT: EMILIA ARENA */}
                <div style={{ background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '600px', position: 'relative', overflow: 'hidden' }}>

                    {/* Header Controls */}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '4rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isSessionActive ? '#10b981' : '#cbd5e1' }} />
                                <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>{selectedAssistant.name} <span style={{ color: '#6366f1' }}>AI Voice Tutor</span></h1>
                            </div>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Engage in natural voice conversation to improve fluency.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {/* Assistant Selector */}
                            <div style={{ display: 'flex', background: '#f8fafc', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                {assistants.map(ast => (
                                    <button
                                        key={ast.id}
                                        onClick={() => setSelectedAssistant(ast)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: selectedAssistant.id === ast.id ? 'white' : 'transparent',
                                            color: selectedAssistant.id === ast.id ? '#6366f1' : '#64748b',
                                            fontWeight: 800,
                                            fontSize: '0.75rem',
                                            cursor: 'pointer',
                                            boxShadow: selectedAssistant.id === ast.id ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {ast.name.split(' ').pop()}
                                    </button>
                                ))}
                            </div>
                            <select
                                value={difficulty}
                                onChange={e => setDifficulty(e.target.value)}
                                style={{ padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, outline: 'none' }}
                            >
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                            <button onClick={() => setIsMuted(!isMuted)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {isMuted ? <VolumeX size={20} color="#ef4444" /> : <Volume2 size={20} color="#64748b" />}
                            </button>
                        </div>
                    </div>

                    {/* Avatar Display */}
                    <EmiliaAvatar status={isSessionActive ? status : 'off'} />

                    {/* Voice Feedback HUD */}
                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <Waveform active={status === 'listening' || status === 'speaking'} />
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: status === 'listening' ? '#10b981' : (status === 'speaking' ? '#3b82f6' : '#94a3b8'), textTransform: 'uppercase', letterSpacing: '2px' }}>
                            {status === 'listening' ? "Listening to you..." : (status === 'speaking' ? "Emilia is speaking..." : "Arena Idle")}
                        </div>
                    </div>

                    {/* Interaction Buttons */}
                    <div style={{ marginTop: 'auto', display: 'flex', gap: '1.5rem' }}>
                        {!isSessionActive ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startConversation}
                                style={{ padding: '1.2rem 3rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '20px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)', display: 'flex', alignItems: 'center', gap: '12px' }}
                            >
                                <Play size={20} fill="currentColor" /> Let's Practice
                            </motion.button>
                        ) : (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    style={{ width: '70px', height: '70px', borderRadius: '50%', background: status === 'listening' ? '#fde68a' : '#f8fafc', border: '2px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Mic size={28} color={status === 'listening' ? '#d97706' : '#64748b'} />
                                </motion.button>
                                <button
                                    onClick={stopConversation}
                                    style={{ padding: '1.2rem 2.5rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '20px', fontWeight: 800, cursor: 'pointer' }}
                                >
                                    Stop Session
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: INSIGHTS & TRANSCRIPT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Performance Stats */}
                    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Speaking Insights</h3>
                            <BarChart2 size={18} color="#94a3b8" />
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#6366f1' }}>{Math.round(speakingScore)}<span style={{ fontSize: '1rem', color: '#94a3b8' }}>/100</span></div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Current Fluency Level</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '16px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 800 }}>B2</div>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>CEFR RANK</div>
                            </div>
                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '16px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 800 }}>Good</div>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>CONFIDENCE</div>
                            </div>
                        </div>
                    </div>

                    {/* Live Transcript Overlay */}
                    <div style={{ flex: 1, background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', background: 'white', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Live Conversation Log</span>
                            <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>{transcript.length} Messages</span>
                        </div>
                        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <AnimatePresence initial={false}>
                                {transcript.length === 0 ? (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textAlign: 'center', fontSize: '0.9rem' }}>
                                        Start a session to see <br />voice-to-text transcript here.
                                    </div>
                                ) : transcript.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: msg.speaker === 'AI' ? 10 : -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        style={{
                                            maxWidth: '85%',
                                            alignSelf: msg.speaker === 'AI' ? 'flex-start' : 'flex-end',
                                            padding: '1rem', borderRadius: '16px',
                                            background: msg.speaker === 'AI' ? '#6366f110' : '#ffff',
                                            border: '1px solid',
                                            borderColor: msg.speaker === 'AI' ? '#6366f120' : '#e2e8f0'
                                        }}
                                    >
                                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: msg.speaker === 'AI' ? '#6366f1' : '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{msg.speaker}</div>
                                        <div style={{ fontSize: '0.9rem', lineHeight: 1.5, color: '#1e293b' }}>{msg.text}</div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mode Selector */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {modes.map(m => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                style={{
                                    padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0',
                                    background: mode === m.id ? 'white' : 'transparent',
                                    borderColor: mode === m.id ? '#6366f1' : '#e2e8f0',
                                    cursor: 'pointer', textAlign: 'left', transition: '0.2s',
                                    boxShadow: mode === m.id ? '0 4px 12px rgba(99,102,241,0.1)' : 'none'
                                }}
                            >
                                <div style={{ color: mode === m.id ? '#6366f1' : '#94a3b8', marginBottom: '8px' }}>{m.icon}</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: mode === m.id ? '#0f172a' : '#64748b' }}>{m.id}</div>
                            </button>
                        ))}
                    </div>

                </div>
            </div>

            {/* AI Coaching Tips Overlay */}
            <div style={{ marginTop: '3rem', background: 'linear-gradient(to right, #eff6ff, #f5f3ff)', padding: '2rem', borderRadius: '24px', border: '1px solid #dbeafe', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                    <Shield size={24} />
                </div>
                <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: 900 }}>Emilia's Tip for Today</h4>
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>Focus on your word stress. Native speakers emphasize functional words like 'important' or 'specifically' more than articles.</p>
                </div>
            </div>

        </div>
    );
};

export default CommunicationAssistant;
