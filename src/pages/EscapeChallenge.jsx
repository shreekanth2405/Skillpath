import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EscapeChallenge = ({ setActiveTab: setGlobalActiveTab }) => {
    const [unlockedLevel, setUnlockedLevel] = useState(1);
    const [activePuzzle, setActivePuzzle] = useState(null);
    const [isSolving, setIsSolving] = useState(false);
    const [puzzleSuccess, setPuzzleSuccess] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);

    const escapeLevels = [
        {
            level: 1,
            title: 'The Array Chamber',
            topic: 'Two Sum',
            difficulty: 'Easy',
            xp: 100,
            question: "Write a function that returns the sum of all numbers in an array.",
            initialCode: "function solve(arr) {\n    // your code\n}",
            image: "/array_puzzle_visual.png",
            hint: "Step 1: Iterate through the array. Step 2: Maintain a running total. Step 3: Return the final sum.",
            test: (code) => {
                try {
                    const fn = new Function('arr', `${code}; return solve(arr);`);
                    return fn([1, 2, 3]) === 6 && fn([10, -5, 2]) === 7;
                } catch { return false; }
            }
        },
        {
            level: 2,
            title: 'The Linked List Labyrinth',
            topic: 'String Reversal',
            difficulty: 'Easy',
            xp: 200,
            question: "Write a function that reverses a given string.",
            initialCode: "function solve(str) {\n    // your code\n}",
            image: "/string_reverse_visual.png",
            hint: "Step 1: Convert string to array. Step 2: Reverse the array. Step 3: Join it back into a string.",
            test: (code) => {
                try {
                    const fn = new Function('str', `${code}; return solve(str);`);
                    return fn("hello") === "olleh" && fn("world") === "dlrow";
                } catch { return false; }
            }
        },
        {
            level: 3,
            title: 'The Tree of Truth',
            topic: 'Even Filter',
            difficulty: 'Medium',
            xp: 300,
            question: "Write a function that filters an array and returns only even numbers.",
            initialCode: "function solve(arr) {\n    // your code\n}",
            image: "/even_filter_visual.png",
            hint: "Step 1: Use the filter() method. Step 2: Check if n % 2 equals 0. Step 3: Return the filtered array.",
            test: (code) => {
                try {
                    const fn = new Function('arr', `${code}; return solve(arr);`);
                    const res = fn([1, 2, 3, 4, 5, 6]);
                    return JSON.stringify(res) === JSON.stringify([2, 4, 6]);
                } catch { return false; }
            }
        },
        {
            level: 4,
            title: 'The Dynamic Dungeon',
            topic: 'Palindrome Check',
            difficulty: 'Medium',
            xp: 500,
            question: "Write a function that checks if a string is a palindrome.",
            initialCode: "function solve(str) {\n    // your code\n}",
            image: "/palindrome_visual.png",
            hint: "Step 1: Reverse the string. Step 2: Compare the original with reversed. Step 3: Return true if they match.",
            test: (code) => {
                try {
                    const fn = new Function('str', `${code}; return solve(str);`);
                    return fn("racecar") === true && fn("hello") === false;
                } catch { return false; }
            }
        },
        {
            level: 5,
            title: 'The Graph Gateway',
            topic: 'Factorial',
            difficulty: 'Master',
            xp: 1000,
            question: "Write a function that calculates the factorial of a number.",
            initialCode: "function solve(n) {\n    // your code\n}",
            image: "/factorial_visual.png",
            hint: "Step 1: Initialize result as 1. Step 2: Loop from 1 to n. Step 3: Multiply result by current number.",
            test: (code) => {
                try {
                    const fn = new Function('n', `${code}; return solve(n);`);
                    return fn(5) === 120 && fn(3) === 6;
                } catch { return false; }
            }
        },
    ];

    const [userCode, setUserCode] = useState('');
    const [error, setError] = useState(null);
    const [isFailing, setIsFailing] = useState(false);

    const speak = (msg) => {
        const utterance = new SpeechSynthesisUtterance(msg);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const handleSolvePuzzle = () => {
        setIsSolving(true);
        setError(null);
        setIsFailing(false);

        setTimeout(() => {
            const currentLevel = escapeLevels[activePuzzle - 1];
            const isCorrect = currentLevel.test(userCode);

            if (isCorrect) {
                setIsSolving(false);
                setPuzzleSuccess(true);
                speak("Logic verified. Correct. Level unlocked.");

                setTimeout(() => {
                    setPuzzleSuccess(false);
                    if (activePuzzle === 5) {
                        setShowCertificate(true);
                        setActivePuzzle(null);
                    } else {
                        setUnlockedLevel(prev => Math.max(prev, activePuzzle + 1));
                        setActivePuzzle(null);
                    }
                }, 3000);
            } else {
                setIsSolving(false);
                setIsFailing(true);
                speak("Logic detected error. Sequence failure. You are falling.");
                setError("Logic Signatures don't match. SYSTEM FAILURE.");

                setTimeout(() => {
                    setIsFailing(false);
                    setError("Logic Signatures don't match. Check your code and try again.");
                }, 4000);
            }
        }, 1500);
    };

    return (
        <div style={{ padding: '2rem', background: '#f8fafc', color: '#1e293b', fontFamily: "'Inter', sans-serif", position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflowY: 'auto', zIndex: 9999, boxSizing: 'border-box' }}>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2rem', position: 'relative', zIndex: 20 }}>
                <button onClick={() => setGlobalActiveTab('escapegameshub')} style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', padding: '0.8rem 1.2rem', borderRadius: '8px', cursor: 'pointer', color: '#64748b', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i> Menu
                </button>
                <div>
                    <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#ef4444', fontWeight: 900, lineHeight: 1 }}>
                        <i className="fa-solid fa-skull-crossbones"></i> Skill Path AI: The Coding Escape Room
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>Solve algorithmic chambers sequentially to unlock the grand certification.</p>
                </div>
            </div>

            <div style={{ perspective: '1200px', transformStyle: 'preserve-3d', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
                {/* Decorative Tech Frame Corners */}
                <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '40px', height: '40px', borderTop: '4px solid #3b82f6', borderLeft: '4px solid #3b82f6', zIndex: 30, borderRadius: '4px 0 0 0' }}></div>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '40px', height: '40px', borderTop: '4px solid #3b82f6', borderRight: '4px solid #3b82f6', zIndex: 30, borderRadius: '0 4px 0 0' }}></div>
                <div style={{ position: 'absolute', bottom: '-10px', left: '-10px', width: '40px', height: '40px', borderBottom: '4px solid #3b82f6', borderLeft: '4px solid #3b82f6', zIndex: 30, borderRadius: '0 0 0 4px' }}></div>
                <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '40px', height: '40px', borderBottom: '4px solid #3b82f6', borderRight: '4px solid #3b82f6', zIndex: 30, borderRadius: '0 0 4px 0' }}></div>

                <AnimatePresence mode="wait">
                    <motion.div key="escape" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }} style={{ background: '#ffffff', padding: '3.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', color: '#1e293b', position: 'relative', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        {/* Matrix/Hacker Background Effect (Light) */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03, backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }}></div>

                        {showCertificate ? (
                            <motion.div initial={{ opacity: 0, scale: 0.5, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 10 }} style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8fafc', borderRadius: '20px', border: '2px solid #f59e0b', position: 'relative', zIndex: 10 }}>
                                <i className="fa-solid fa-certificate" style={{ fontSize: '6rem', color: '#f59e0b', marginBottom: '1rem', textShadow: '0 0 20px rgba(245,158,11,0.2)' }}></i>
                                <h2 style={{ fontSize: '2.5rem', color: '#f59e0b', marginBottom: '1rem', fontWeight: 900 }}>Master of Algorithms</h2>
                                <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '2rem' }}>This certifies that you have successfully escaped all 5 coding chambers.</p>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>+2100 Total XP Awarded</div>
                                <button onClick={() => { setShowCertificate(false); setUnlockedLevel(1); }} style={{ marginTop: '3rem', background: 'transparent', border: '1px solid #e2e8f0', color: '#94a3b8', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Restart Challenge</button>
                            </motion.div>
                        ) : activePuzzle ? (
                            <motion.div initial={{ opacity: 0, y: 50, rotateX: 20 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ type: 'spring', damping: 15 }} style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '20px', border: '1px solid #3b82f6', position: 'relative', zIndex: 10, transformStyle: 'preserve-3d', perspective: '1000px', boxShadow: '0 0 30px rgba(59, 130, 246, 0.1)' }}>
                                {/* Inner Frame Accents */}
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '20px' }}></div>

                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 70 }}>
                                    <button onClick={() => setActivePuzzle(null)} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#ef4444', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-xmark"></i></button>
                                </div>


                                <AnimatePresence>
                                    {puzzleSuccess && (
                                        <motion.div initial={{ opacity: 0, scale: 0.8, rotateY: 90 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} exit={{ opacity: 0, scale: 1.5 }} transition={{ duration: 0.8, type: 'spring' }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(16, 185, 129, 0.95)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', borderRadius: '16px', transform: 'translateZ(100px)' }}>
                                            <motion.i initial={{ scale: 0, rotate: -180 }} animate={{ scale: [0, 1.2, 1], rotate: [0, 360] }} transition={{ duration: 1, delay: 0.2 }} className="fa-solid fa-unlock-keyhole" style={{ fontSize: '8rem', marginBottom: '2rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}></motion.i>
                                            <h2 style={{ fontSize: '3rem', fontWeight: 900, textShadow: '0 4px 10px rgba(0,0,0,0.3)', margin: '0 0 1rem 0' }}>SYSTEM OVERRIDE</h2>
                                            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Chamber {activePuzzle} Unlocked. Proceeding to next level...</motion.p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {isFailing && (
                                        <motion.div initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 2, filter: 'blur(20px)' }} transition={{ duration: 0.8 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(rgba(59, 130, 246, 0.8), rgba(2, 6, 23, 0.9))', zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', borderRadius: '16px', textAlign: 'center', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '50%', background: 'rgba(59, 130, 246, 0.5)', opacity: 0.3, filter: 'blur(30px)', animation: 'wave 2s infinite linear' }}></div>
                                            <i className="fa-solid fa-water" style={{ fontSize: '5rem', marginBottom: '1rem', color: '#60a5fa' }}></i>
                                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>SUBMERGING...</h2>
                                            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Algorithm Integrity Failed. Falling into the depths.</p>
                                            <style>{`@keyframes wave { 0% { transform: translateY(10px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(10px); } }`}</style>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                        <img src={escapeLevels[activePuzzle - 1].image} alt="Puzzle" style={{ width: '100%', display: 'block' }} />
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white', fontSize: '0.85rem' }}>
                                            <i className="fa-solid fa-cube"></i> Neural Puzzle Interface Enabled
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#3b82f6' }}><i className="fa-solid fa-terminal"></i> {escapeLevels[activePuzzle - 1].title}</h3>
                                        <p style={{ color: '#475569', fontSize: '1.1rem', marginBottom: '1rem' }}><strong>Topic:</strong> {escapeLevels[activePuzzle - 1].topic} | <strong>Difficulty:</strong> {escapeLevels[activePuzzle - 1].difficulty}</p>
                                        <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #3b82f6', color: '#1e293b', fontWeight: 500 }}>
                                            <i className="fa-solid fa-circle-question" style={{ marginRight: '8px', color: '#3b82f6' }}></i>
                                            {escapeLevels[activePuzzle - 1].question}
                                        </div>
                                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px dashed #cbd5e1', fontSize: '0.9rem' }}>
                                            <strong style={{ color: '#3b82f6' }}><i className="fa-solid fa-robot"></i> AI GUIDE:</strong><br />
                                            {escapeLevels[activePuzzle - 1].hint}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                                    <button onClick={() => speak(`Mission: ${escapeLevels[activePuzzle - 1].question}. Instructions are: ${escapeLevels[activePuzzle - 1].hint}`)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
                                        <i className="fa-solid fa-volume-high"></i> Read Instructions
                                    </button>
                                </div>

                                {/* Code Editor Mock with Scanline */}
                                <div style={{ position: 'relative', background: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '1.5rem' }}>
                                    <textarea
                                        value={userCode}
                                        onChange={(e) => setUserCode(e.target.value)}
                                        spellCheck="false"
                                        style={{ width: '100%', height: '150px', background: 'transparent', border: 'none', color: '#cbd5e1', fontFamily: 'monospace', fontSize: '1.1rem', outline: 'none', resize: 'none', padding: '10px' }}
                                    />
                                    {isSolving && <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', left: 0, right: 0, height: '4px', background: 'rgba(59, 130, 246, 0.8)', boxShadow: '0 0 15px rgba(59, 130, 246, 1)', zIndex: 10 }}></motion.div>}
                                </div>

                                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}><i className="fa-solid fa-triangle-exclamation"></i> {error}</div>}



                                <button onClick={handleSolvePuzzle} disabled={isSolving || puzzleSuccess} style={{ background: isSolving ? '#cbd5e1' : '#3b82f6', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 800, cursor: isSolving || puzzleSuccess ? 'default' : 'pointer', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: '0.3s', boxShadow: isSolving ? 'none' : '0 10px 20px rgba(59, 130, 246, 0.3)' }}>
                                    {isSolving ? <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing Logic Signatures...</> : puzzleSuccess ? <><i className="fa-solid fa-check"></i> Logic Verified</> : <><i className="fa-solid fa-play"></i> Execute Code & Escape</>}
                                </button>
                            </motion.div>
                        ) : (
                            <div style={{ position: 'relative', zIndex: 10 }}>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {escapeLevels.map((lvl) => {
                                        const isUnlocked = lvl.level <= unlockedLevel;
                                        const isPassed = lvl.level < unlockedLevel;
                                        return (
                                            <div key={lvl.level} style={{ position: 'relative' }}>
                                                {/* Connecting Line (except last item) */}
                                                {lvl.level < escapeLevels.length && (
                                                    <div style={{ position: 'absolute', top: '100%', left: '3.3rem', width: '2px', height: '1.5rem', background: isPassed ? '#10b981' : '#e2e8f0', zIndex: 1, boxShadow: isPassed ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none' }}></div>
                                                )}
                                                <motion.div whileHover={isUnlocked ? { scale: 1.02, x: 10 } : {}} onClick={() => {
                                                    if (isUnlocked && !isPassed) {
                                                        setActivePuzzle(lvl.level);
                                                        setUserCode(lvl.initialCode);
                                                        setError(null);
                                                    }
                                                }} style={{ position: 'relative', zIndex: 2, background: isPassed ? 'rgba(16, 185, 129, 0.05)' : isUnlocked ? 'rgba(59, 130, 246, 0.05)' : '#f1f5f9', border: `1px solid ${isPassed ? '#10b981' : isUnlocked ? '#3b82f6' : '#e2e8f0'}`, padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: isUnlocked && !isPassed ? 'pointer' : 'default', opacity: isUnlocked ? 1 : 0.6, transition: '0.3s' }}>

                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                        {/* Glowing Light Node */}
                                                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: isPassed ? '#10b981' : isUnlocked ? '#3b82f6' : '#ffffff', border: `2px solid ${isPassed ? '#10b981' : isUnlocked ? '#3b82f6' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: isUnlocked ? 'white' : '#94a3b8', boxShadow: isPassed ? '0 0 15px rgba(16, 185, 129, 0.2)' : isUnlocked ? '0 0 15px rgba(59, 130, 246, 0.2)' : 'none', transition: 'all 0.4s ease' }}>
                                                            <i className={`fa-solid ${isPassed ? 'fa-bolt' : isUnlocked ? 'fa-spinner fa-spin-pulse' : 'fa-power-off'}`}></i>
                                                        </div>
                                                        <div>
                                                            <div style={{ color: isPassed ? '#10b981' : isUnlocked ? '#3b82f6' : '#94a3b8', fontSize: '0.9rem', fontWeight: 800, marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                STEP {lvl.level}
                                                                {isPassed && <span style={{ background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>COMPLETE</span>}
                                                                {isUnlocked && !isPassed && <span style={{ background: '#3b82f6', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>ACTIVE</span>}
                                                            </div>
                                                            <h3 style={{ margin: 0, fontSize: '1.3rem', color: isUnlocked ? '#1e293b' : '#94a3b8' }}>{lvl.title}</h3>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ color: isPassed ? '#10b981' : isUnlocked ? '#3b82f6' : '#64748b', fontWeight: 800, fontSize: '1.2rem', marginBottom: '5px' }}>+{lvl.xp} XP</div>
                                                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{lvl.difficulty}</div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EscapeChallenge;
