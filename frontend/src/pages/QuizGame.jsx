import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Play, Lock, Unlock, Key, Timer, Sparkles, ArrowLeft, Send, CheckCircle2, XCircle, Award, ChevronRight } from 'lucide-react';
import { genAI } from '../services/gemini';

const LEVELS = [
    { id: 1, title: "Knowledge Genesis", desc: "Basic knowledge across tech and logic.", difficulty: "Beginner", xp: 100, color: "#6366f1" },
    { id: 2, title: "Chrono Blitz", desc: "Speed matters. Faster answers, higher scores.", difficulty: "Easy", xp: 250, color: "#f59e0b" },
    { id: 3, title: "Labyrinth of Logic", desc: "Mixed trick questions and logic puzzles.", difficulty: "Medium", xp: 500, color: "#10b981" },
    { id: 4, title: "AI Nexus", desc: "Adaptive questions that learn from you.", difficulty: "Hard", xp: 1000, color: "#8b5cf6" },
    { id: 5, title: "Omega Arena", desc: "The Final Boss. Elite level challenges.", difficulty: "Insane", xp: 2500, color: "#ef4444" }
];

const QuizGame = ({ setActiveTab }) => {
    // --- Game States ---
    const [gameState, setGameState] = useState('lobby'); // lobby, level-select, playing, level-summary, multiplayer
    const [currentLevel, setCurrentLevel] = useState(null);
    const [unlockedLevels, setUnlockedLevels] = useState(() => {
        const saved = localStorage.getItem('quiz_unlocked_levels');
        return saved ? JSON.parse(saved) : [1];
    });
    const [questions, setQuestions] = useState([]);
    const [currIdx, setCurrIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [timer, setTimer] = useState(15);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'
    const [xpAwarded, setXpAwarded] = useState(0);
    const [showKeyUnlock, setShowKeyUnlock] = useState(false);

    const timerRef = useRef(null);

    // --- Persistence ---
    useEffect(() => {
        localStorage.setItem('quiz_unlocked_levels', JSON.stringify(unlockedLevels));
    }, [unlockedLevels]);

    // --- AI Question Generation ---
    const generateQuestions = async (level) => {
        setIsProcessing(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Generate 5 highly engaging multiple choice questions for Level ${level.id} of a trivia game called "Knowledge Arena".
            Level Title: ${level.title}
            Difficulty: ${level.difficulty}
            Topic Range: General Knowledge, Tech, Coding, and Logic.
            
            Return ONLY a JSON array:
            [
              {
                "question": "...",
                "options": ["...", "...", "...", "..."],
                "answer": 0,
                "explanation": "..."
              }
            ]`;

            const result = await model.generateContent(prompt);
            const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(text);
            setQuestions(data);
            setCurrIdx(0);
            setScore(0);
            setStreak(0);
            setGameState('playing');
            startTimer();
        } catch (err) {
            console.error("AI Generation Error:", err);
            // Fallback questions if AI fails
            setQuestions([
                { question: "Fallback: What is the capital of logic?", options: ["Prolog", "LISP", "Boolean", "Reasoning"], answer: 2, explanation: "Logic often revolves around Boolean algebra." },
                { question: "Fallback: Which AI model are you using?", options: ["GPT-4", "Claude", "Gemini", "Llama"], answer: 2, explanation: "You are currently interacting with the Gemini API." }
            ]);
            setGameState('playing');
            startTimer();
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Timer Logic ---
    const startTimer = () => {
        setTimer(15);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    handleAnswer(-1); // Time out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleAnswer = (index) => {
        if (selectedAnswer !== null) return;
        if (timerRef.current) clearInterval(timerRef.current);

        setSelectedAnswer(index);
        const correctIdx = questions[currIdx].answer;
        const isCorrect = index === correctIdx;

        if (isCorrect) {
            setFeedback('correct');
            const timeBonus = Math.floor(timer * 10);
            const levelBonus = currentLevel.id * 50;
            const newScore = 100 + timeBonus + levelBonus + (streak * 20);
            setScore(s => s + newScore);
            setStreak(st => st + 1);
        } else {
            setFeedback('wrong');
            setStreak(0);
        }

        setTimeout(() => {
            if (currIdx < questions.length - 1) {
                setCurrIdx(i => i + 1);
                setSelectedAnswer(null);
                setFeedback(null);
                startTimer();
            } else {
                finishLevel();
            }
        }, 2000);
    };

    const finishLevel = () => {
        const finalXp = Math.floor(score / 5);
        setXpAwarded(finalXp);

        // Unlock next level if criteria met (e.g., score > 300)
        if (score > 300 && !unlockedLevels.includes(currentLevel.id + 1) && currentLevel.id < 5) {
            setUnlockedLevels([...unlockedLevels, currentLevel.id + 1]);
            setShowKeyUnlock(true);
        }
        setGameState('level-summary');
    };

    const startMultiplayer = () => {
        setGameState('multiplayer');
        // Simulate multiplayer join
    };

    // --- UI Components ---

    const PageHeader = () => (
        <div style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
            <button onClick={() => gameState === 'lobby' ? setActiveTab('dashboard') : setGameState('lobby')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 600 }}>
                <ArrowLeft size={18} /> Exit Game
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b' }}>
                    <Award size={20} /> <span style={{ fontWeight: 800 }}>{streak} Streak</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1' }}>
                    <Users size={20} /> <span style={{ fontWeight: 800 }}>Rank #14</span>
                </div>
            </div>
        </div>
    );

    const Lobby = () => (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#0f172a' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                <div style={{ display: 'inline-block', padding: '0.8rem 1.5rem', background: '#e0e7ff', color: '#4338ca', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>
                    The Knowledge Arena
                </div>
                <h1 className="arena-text-shine" style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-2px' }}>
                    QUIZ GAME AI
                </h1>
                <p style={{ maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.2rem', color: '#64748b', lineHeight: 1.6 }}>
                    Join the ultimate competitive quiz arena. Dynamic questions, real-time AI logic, and progressive storyline challenges.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
                    <motion.button
                        whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)' }}
                        onClick={() => setGameState('level-select')}
                        className="game-card-glow"
                        style={{ padding: '2rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                    >
                        <div className="floating-icon" style={{ width: '60px', height: '60px', background: '#eff6ff', color: '#3b82f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Play size={28} fill="currentColor" />
                        </div>
                        <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>Solo Campaign</span>
                        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>5 Progressive Levels</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)' }}
                        onClick={startMultiplayer}
                        style={{ padding: '2rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                    >
                        <div style={{ width: '60px', height: '60px', background: '#f5f3ff', color: '#8b5cf6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={28} />
                        </div>
                        <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>Multiplayer Battle</span>
                        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Real-time Arena</span>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );

    const LevelSelect = () => (
        <div style={{ padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', textAlign: 'center' }}>Select Your <span style={{ color: '#6366f1' }}>Challenge</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {LEVELS.map((level, i) => {
                    const isUnlocked = unlockedLevels.includes(level.id);
                    return (
                        <motion.div
                            key={level.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={isUnlocked ? { x: 10 } : {}}
                            onClick={() => isUnlocked && !isProcessing && (setCurrentLevel(level), generateQuestions(level))}
                            style={{
                                padding: '2rem',
                                background: 'white',
                                borderRadius: '24px',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2rem',
                                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                opacity: isUnlocked ? 1 : 0.6,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div className="floating-icon" style={{ width: '80px', height: '80px', borderRadius: '20px', background: `${level.color}15`, color: level.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900 }}>
                                {isUnlocked ? level.id : <Lock size={28} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{level.title}</h3>
                                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', background: `${level.color}20`, color: level.color, fontWeight: 800 }}>{level.difficulty}</span>
                                </div>
                                <p style={{ color: '#64748b' }}>{level.desc}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Rewards</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f59e0b' }}>{level.xp} XP</div>
                            </div>
                            {!isUnlocked && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(2px)' }} />}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );

    const GamePlaying = () => {
        const q = questions[currIdx];
        if (!q) return null;

        return (
            <div style={{ padding: '3rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
                {/* Timer Bar */}
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', marginBottom: '3rem', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: `${(timer / 15) * 100}%` }}
                        transition={{ duration: 1, ease: "linear" }}
                        style={{ height: '100%', background: timer < 5 ? '#ef4444' : '#6366f1' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 700 }}>
                        <Timer size={18} /> {timer}s remaining
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                        Question {currIdx + 1}/{questions.length}
                    </div>
                </div>

                {/* Question Card */}
                <motion.div
                    key={currIdx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'white', padding: '3rem', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', marginBottom: '2rem', textAlign: 'center' }}
                >
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1.4, color: '#0f172a' }}>{q.question}</h2>
                </motion.div>

                {/* Options */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {q.options.map((opt, i) => {
                        let btnStyle = { background: 'white', border: '1px solid #e2e8f0', color: '#0f172a' };
                        if (selectedAnswer === i) {
                            btnStyle = feedback === 'correct' ?
                                { background: '#10b981', border: 'none', color: 'white' } :
                                { background: '#ef4444', border: 'none', color: 'white' };
                        } else if (selectedAnswer !== null && i === q.answer) {
                            btnStyle = { background: '#10b981', border: 'none', color: 'white' };
                        }

                        return (
                            <motion.button
                                key={i}
                                whileHover={selectedAnswer === null ? { y: -3, boxShadow: '0 8px 15px rgba(0,0,0,0.05)' } : {}}
                                whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                                onClick={() => handleAnswer(i)}
                                style={{ ...btnStyle, padding: '1.5rem', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 700, cursor: selectedAnswer === null ? 'pointer' : 'default', transition: 'all 0.2s ease', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}
                            >
                                <span style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                    {String.fromCharCode(65 + i)}
                                </span>
                                {opt}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Feedback Toast */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{ marginTop: '2.5rem', textAlign: 'center' }}
                        >
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '1rem 2rem', borderRadius: '16px', background: feedback === 'correct' ? '#d1fae5' : '#fee2e2', color: feedback === 'correct' ? '#065f46' : '#991b1b', fontWeight: 800 }}>
                                {feedback === 'correct' ? <CheckCircle2 /> : <XCircle />}
                                {feedback === 'correct' ? "Brilliant! Time Bonus Awarded." : "Not quite. The AI mentor suggest reading more logic."}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    const LevelSummary = () => (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="game-card-glow" style={{ background: 'white', padding: '4rem', borderRadius: '40px', border: '1px solid #e2e8f0', boxShadow: '0 30px 60px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem' }}>Challenge Complete</div>
                <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2.5rem' }}>{currentLevel.title}</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
                    <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '24px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Final Score</div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>{score}</div>
                    </div>
                    <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '24px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>XP Earned</div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10b981' }}>+{xpAwarded}</div>
                    </div>
                </div>

                <AnimatePresence>
                    {showKeyUnlock && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ marginBottom: '3rem' }}>
                            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)' }}>
                                    <Key size={36} />
                                </div>
                                <div style={{ fontWeight: 900, color: '#f59e0b' }}>NEW KEY EARNED!</div>
                                <div style={{ color: '#64748b' }}>Gates to Level {currentLevel.id + 1} are now open.</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setGameState('level-select')} style={{ flex: 1, padding: '1.2rem', background: '#f1f5f9', border: 'none', borderRadius: '16px', fontWeight: 800, color: '#475569', cursor: 'pointer' }}>
                        Levels Map
                    </button>
                    <button onClick={() => setGameState('lobby')} style={{ flex: 1, padding: '1.2rem', background: '#6366f1', border: 'none', borderRadius: '16px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}>
                        Play Again
                    </button>
                </div>
            </motion.div>
        </div>
    );

    const MultiplayerSim = () => (
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Arena Matchmaking</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%' }} />
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#64748b' }}>Waiting for opponents...</span>
            </div>
            <div style={{ maxWidth: '400px', margin: '0 auto', background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Active Room</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, background: '#f8fafc', padding: '1rem', borderRadius: '12px', letterSpacing: '4px', marginBottom: '2rem' }}>X K 9 4 P</div>
                <button onClick={() => setGameState('lobby')} style={{ width: '100%', padding: '1rem', background: '#ef444415', color: '#ef4444', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>Cancel Match</button>
            </div>
        </div>
    );

    const LoadingOverlay = () => (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '2rem' }}
            >
                <Sparkles size={32} />
            </motion.div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>AI is generating the Arena...</h3>
            <p style={{ color: '#64748b' }}>Curating dynamic questions based on your skill path.</p>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: "'Inter', sans-serif" }}>
            <PageHeader />

            <AnimatePresence mode="wait">
                {gameState === 'lobby' && <motion.div key="lobby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Lobby /></motion.div>}
                {gameState === 'level-select' && <motion.div key="levels" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LevelSelect /></motion.div>}
                {gameState === 'playing' && <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><GamePlaying /></motion.div>}
                {gameState === 'level-summary' && <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LevelSummary /></motion.div>}
                {gameState === 'multiplayer' && <motion.div key="multiplayer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><MultiplayerSim /></motion.div>}
            </AnimatePresence>

            {isProcessing && <LoadingOverlay />}

            {/* Background Decorations */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: -1 }}>
                <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
            </div>
        </div>
    );
};

export default QuizGame;
