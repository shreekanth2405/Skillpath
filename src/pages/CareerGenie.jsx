import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { genAI } from '../services/gemini';

const CareerAkinator = ({ userXP, setUserXP, userLevel }) => {
    const [gameState, setGameState] = useState('lobby'); // lobby, game, result, loading
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [history, setHistory] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [isThinking, setIsThinking] = useState(false);
    const [qIndex, setQIndex] = useState(0);

    const startQuest = async () => {
        setGameState('loading');
        setHistory([]);
        setQIndex(1);
        await askAI();
    };

    const askAI = async (currentHistory = []) => {
        setIsThinking(true);
        setGameState('game');
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `You are the Career Akinator, a mystical AI expert who predicts user career paths across 20+ departments (CSE, IT, BioTech, Finance, Art, etc.).
            
            HISTORY SO FAR: ${JSON.stringify(currentHistory)}
            
            TASK:
            1. If you have enough info (usually 8-15 questions), start your response with "PREDICTION:". 
               Format: PREDICTION: { "career": "Title", "department": "Dept", "why": "Brief reason" }
            2. Otherwise, ask a smart "Yes/No/Unsure" style question to narrow down the path.
               Format: QUESTION: Your mystical question here.
            
            Stay in character as a magical genie.`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            if (text.includes("PREDICTION:")) {
                const jsonStr = text.split("PREDICTION:")[1].trim();
                try {
                    const data = JSON.parse(jsonStr);
                    setPrediction(data);
                    triggerReward();
                    setGameState('result');
                } catch {
                    setPrediction({ career: "Cloud Architect", department: "IT", why: "You have a natural affinity for scaling systems." });
                    triggerReward();
                    setGameState('result');
                }
            } else if (text.includes("QUESTION:")) {
                setCurrentQuestion(text.split("QUESTION:")[1].trim());
            } else {
                setCurrentQuestion("Do you enjoy working with complex mathematical logic?");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsThinking(false);
        }
    };

    const triggerReward = () => {
        if (setUserXP) {
            setUserXP(prev => prev + 500); // Reward 500 XP for completing a reading
        }
    };

    const handleAnswer = (ans) => {
        const newHistory = [...history, { q: currentQuestion, a: ans }];
        setHistory(newHistory);
        setQIndex(prev => prev + 1);
        askAI(newHistory);
    };

    const renderLobby = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 30 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="lobby-card glass-panel"
            style={{ textAlign: 'center', padding: '4rem', maxWidth: '800px', transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
            <motion.div animate={{ rotateY: 360, z: [0, 50, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="genie-orb" style={{ transformStyle: 'preserve-3d' }}>
                <i className="fa-solid fa-wand-sparkles" style={{ fontSize: '5rem', color: '#8b5cf6', filter: 'drop-shadow(0 0 20px #8b5cf6)' }}></i>
            </motion.div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', background: 'linear-gradient(45deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', transform: 'translateZ(30px)' }}>
                SKILL PATH AI CAREER GENIE
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.25rem', marginBottom: '3rem', lineHeight: '1.6', transform: 'translateZ(20px)' }}>
                I shall look into the digital threads of your destiny. 20 departments, 1000 paths—let the oracle reveal your true professional calling.
            </p>
            <motion.button
                whileHover={{ scale: 1.05, translateZ: 40, boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={startQuest}
                className="start-btn"
                style={{ transformStyle: 'preserve-3d' }}
            >
                BEGIN THE READING
            </motion.button>
        </motion.div>
    );

    const renderGame = () => (
        <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            className="game-card glass-panel"
            style={{ width: '100%', maxWidth: '800px', display: 'flex', gap: '2rem', padding: '2rem' }}
        >
            {/* Left Panel: Query & Actions */}
            <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '0px', left: '0px', fontSize: '0.9rem', color: '#8b5cf6', fontWeight: 900, letterSpacing: '2px' }}>
                    <i className="fa-solid fa-crystal-ball"></i> QUERY PHASE {qIndex}
                </div>

                <div style={{ textAlign: 'center', margin: '3rem 0', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AnimatePresence mode="wait">
                        {isThinking ? (
                            <motion.div
                                key="thinking"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                style={{ fontStyle: 'italic', fontSize: '1.5rem', color: '#94a3b8' }}
                            >
                                <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: '10px', color: '#8b5cf6' }}></i>
                                The spirits of industry are whispering...
                            </motion.div>
                        ) : (
                            <motion.h2
                                key="question"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{ fontSize: '1.8rem', lineHeight: '1.4', color: '#f8fafc', fontWeight: 800 }}
                            >
                                {currentQuestion}
                            </motion.h2>
                        )}
                    </AnimatePresence>
                </div>

                {!isThinking && (
                    <div className="answer-grid">
                        {['Yes', 'No', 'Maybe', 'Not Really'].map((ans) => (
                            <motion.button
                                key={ans}
                                whileHover={{ y: -5, background: 'rgba(59, 130, 246, 0.3)', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)', borderColor: '#3b82f6' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAnswer(ans)}
                                className="ans-btn"
                            >
                                {ans}
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Panel: History Log */}
            <div style={{ width: '300px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1.5rem', fontWeight: 900, letterSpacing: '1px' }}>
                    <i className="fa-solid fa-clock-rotate-left"></i> HISTORY SO FAR
                </h3>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '10px' }} className="scroll-panel">
                    {history.length === 0 && <div style={{ color: '#475569', fontStyle: 'italic', fontSize: '0.9rem' }}>The tapestry is blank. Answer to weave it.</div>}
                    {history.map((h, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '6px', lineHeight: 1.4 }}><b>Q{i + 1}:</b> {h.q}</div>
                            <div style={{ color: '#a78bfa', fontWeight: 900, fontSize: '0.9rem' }}>→ {h.a}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    const renderResult = () => (
        <div style={{ perspective: '1200px' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.5, rotateY: 90, rotateX: 30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                className="result-card glass-panel"
                style={{ textAlign: 'center', padding: '4rem', maxWidth: '700px', transformStyle: 'preserve-3d', boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 50px rgba(139, 92, 246, 0.2)' }}
            >
                <div style={{ transform: 'translateZ(60px)' }}>
                    <motion.div
                        animate={{ rotateY: 360, y: [-10, 10, -10] }}
                        transition={{ rotateY: { repeat: Infinity, duration: 6, ease: "linear" }, y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
                        style={{ fontSize: '5rem', marginBottom: '2rem', filter: 'drop-shadow(0 0 30px rgba(167, 139, 250, 0.8))' }}
                    >
                        🔮
                    </motion.div>
                </div>

                <div style={{ transform: 'translateZ(40px)' }}>
                    <h3 style={{ color: '#8b5cf6', letterSpacing: '4px', fontSize: '1rem', marginBottom: '1rem', textShadow: '0 0 10px rgba(139,92,246,0.5)' }}>DESTINY MANIFESTED</h3>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(90deg, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{prediction?.career}</h2>
                    <div style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '0.6rem 1.5rem', borderRadius: '100px', color: '#a78bfa', display: 'inline-block', marginBottom: '2rem', fontWeight: 800, fontSize: '1rem', boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' }}>
                        <i className="fa-solid fa-building" style={{ marginRight: '8px' }}></i> {prediction?.department} DEPARTMENT
                    </div>
                </div>

                <div style={{ transform: 'translateZ(20px)' }}>
                    <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '3rem', lineHeight: '1.8', fontStyle: 'italic', padding: '0 2rem' }}>
                        "{prediction?.why}"
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    style={{
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                        padding: '1rem 2rem',
                        borderRadius: '50px',
                        display: 'inline-block',
                        marginBottom: '2.5rem',
                        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.5)',
                        transform: 'translateZ(50px)'
                    }}
                >
                    <div style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fa-solid fa-arrow-up-right-dots"></i>
                        +500 XP AWARDED
                    </div>
                </motion.div>

                <br />
                <button className="start-btn" onClick={() => setGameState('lobby')} style={{ transform: 'translateZ(30px)' }}>
                    CONSULT THE ORACLE AGAIN
                </button>
            </motion.div>
        </div>
    );

    return (
        <div className="akinator-container">
            <style>{`
                .akinator-container {
                    min-height: calc(100vh - 150px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
                    position: relative;
                    overflow: hidden;
                    grid-column: 1 / -1;
                    border-radius: 40px;
                }
                .akinator-container::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
                    opacity: 0.2;
                }
                .start-btn {
                    padding: 1.25rem 3.5rem;
                    background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
                    border: none;
                    border-radius: 16px;
                    color: white;
                    font-weight: 900;
                    letter-spacing: 2px;
                    cursor: pointer;
                    box-shadow: 0 10px 40px rgba(139, 92, 246, 0.4);
                }
                .ans-btn {
                    padding: 1.5rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 16px;
                    color: #e2e8f0;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .answer-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.25rem;
                }
                .genie-orb {
                    width: 150px;
                    height: 150px;
                    background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 2rem;
                    animation: float 4s infinite ease-in-out;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .scroll-panel::-webkit-scrollbar { width: 6px; }
                .scroll-panel::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.5); border-radius: 10px; }
            `}</style>

            <AnimatePresence mode="wait">
                {gameState === 'lobby' && renderLobby()}
                {gameState === 'game' && renderGame()}
                {gameState === 'result' && renderResult()}
                {gameState === 'loading' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#8b5cf6', fontSize: '2rem' }}>
                        <i className="fa-solid fa-sync fa-spin"></i>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CareerAkinator;
