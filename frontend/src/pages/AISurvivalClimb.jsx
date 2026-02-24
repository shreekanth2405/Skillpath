import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AISurvivalClimb = ({ setActiveTab: setGlobalActiveTab }) => {
    // Game State
    const [currentStep, setCurrentStep] = useState(10); // Start at top (10)
    const [gameState, setGameState] = useState('climb'); // climb, waterfall, victory, game-over
    const [isFalling, setIsFalling] = useState(false);
    const [isSlipping, setIsSlipping] = useState(false);
    const [waterIntensity, setWaterIntensity] = useState(80); // 0 to 100
    const [xp, setXp] = useState(0);
    const [userResponse, setUserResponse] = useState('');
    const [message, setMessage] = useState("CYBER-GUIDE: Welcome to the 10-Sector Neural Ascent. Secure the logic nodes.");
    const [showInstructions, setShowInstructions] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [timer, setTimer] = useState(60);

    const speak = (msg) => {
        const utterance = new SpeechSynthesisUtterance(msg);
        utterance.rate = 1.1;
        utterance.pitch = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const tasks = [
        { id: 10, title: 'Neural Vision - Level 10', question: "Classify this image: A convolutional layer with 3x3 filters detecting vertical lines. Write the 2D array for a basic Sobel vertical edge detector.", correctAnswer: 'sobel', code: '[[-1,0,1],[-2,0,2],[-1,0,1]]', hint: "A Sobel filter for vertical edges has positive values on the right and negative on the left." },
        { id: 9, title: 'Cloud Logic - Level 9', question: "The server is overloaded. Implement a simple Round Robin balancing logic in pseudo-code for 3 servers.", correctAnswer: 'round robin', code: 'count % 3', hint: "Use the modulo operator to cycle through server indices." },
        { id: 8, title: 'Binary Guardian - Level 8', question: "Secure the gate! Implement a Recursive Function to find the Factorial of N to unlock this node.", correctAnswer: 'recursive', code: 'n * fact(n-1)', hint: "A recursive function calls itself with a smaller input until it reaches the base case." },
        { id: 7, title: 'Data Stream - Level 7', question: "Filter the noise. Write a Python snippet to extract all even numbers from a list 'L'.", correctAnswer: 'filter', code: '[x for x in L if x % 2 == 0]', hint: "Use list comprehension and the modulo operator." },
        { id: 6, title: 'API Sentinel - Level 6', question: "Auth Token found. Write a header JSON object for an 'Authorization' Bearer token.", correctAnswer: 'bearer', code: '{"Authorization": "Bearer ..."}', hint: "Format it as a standard JSON key-value pair." },
        { id: 5, title: 'Kernel Node - Level 5', question: "Operating System Breach! What is the command to view all running processes in a Linux terminal?", correctAnswer: 'ps', code: 'ps aux', hint: "Two characters: 'p' and 's'." },
        { id: 4, title: 'Quantum Vault - Level 4', question: "Entanglement detected. In Python, reverse a string 'S' using slicing logic.", correctAnswer: 'slicing', code: 'S[::-1]', hint: "Use the [start:stop:step] syntax with -1 as the step." },
        { id: 3, title: 'Graph Titan - Level 3', question: "Pathfinding required. Which algorithm finds the shortest path in a weighted graph without negative edges?", correctAnswer: 'dijkstra', code: 'dijkstra', hint: "Named after a famous Dutch computer scientist." },
        { id: 2, title: 'Assembly Gate - Level 2', question: "Low level access! What is the ASM mnemonic for 'Move' data from source to destination?", correctAnswer: 'mov', code: 'mov', hint: "Three letters, very common in x86/ARM." },
        { id: 1, title: 'Final Core - Level 1', question: "Final Boss. Define a simple class 'AI' with an empty constructor in JavaScript.", correctAnswer: 'class', code: 'class AI { constructor(){} }', hint: "Use the 'class' and 'constructor' keywords." }
    ];

    const currentTask = tasks.find(t => t.id === currentStep);

    useEffect(() => {
        let interval;
        if (!showInstructions && gameState === 'climb' && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0) {
            handleFailure();
        }
        return () => clearInterval(interval);
    }, [timer, showInstructions, gameState]);

    const handleSuccess = () => {
        setXp(prev => prev + 1500);
        setWaterIntensity(prev => Math.max(0, prev - 15));
        setTimer(60);
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            setMessage(`Node Secured! Descending to level ${currentStep - 1}.`);
            speak("Logic verified. Descending.");
        } else {
            setGameState('victory');
            speak("Summit Extract Complete. You have defied the mountain.");
        }
    };

    const handleFailure = () => {
        setIsFalling(true);
        speak("Structural failure! You are falling!");
        setTimeout(() => {
            setWaterIntensity(prev => Math.min(100, prev + 30));
            setGameState('waterfall');
        }, 2000);

        setTimeout(() => {
            setIsFalling(false);
            if (waterIntensity > 90) {
                setGameState('game-over');
                speak("Oxygen levels depleted. Neural link lost.");
            } else {
                setGameState('climb');
                setCurrentStep(10); // Reset to top or some checkpoint
                setMessage("CYBER-GUIDE: Respawning at Summit. Stabilize your core.");
            }
        }, 5000);
    };

    const checkAnswer = () => {
        const input = userResponse.toLowerCase();
        const isAnswerCorrect = input.includes(currentTask.correctAnswer.toLowerCase());
        const isCodeCorrect = input.includes(currentTask.code.toLowerCase()) || input.length > 20; // Relaxed for pseudo-code

        if (isAnswerCorrect && isCodeCorrect) {
            handleSuccess();
            setUserResponse('');
        } else if (isAnswerCorrect || isCodeCorrect) {
            setIsSlipping(true);
            setMessage("Losing grip! Refine your logic!");
            setTimeout(() => setIsSlipping(false), 1500);
        } else {
            handleFailure();
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#020617', color: 'white', overflow: 'hidden', fontFamily: "'Outfit', sans-serif" }}>
            {/* Header branding overlay */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 1000 }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 900, background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Skill Path AI Survival Climb</h1>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, margin: 0, letterSpacing: '1px' }}>CLIMB THE LOGIC SUMMIT</p>
            </div>

            {/* CINEMATIC 3D BACKGROUND SCENE */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', perspective: '1500px', transformStyle: 'preserve-3d' }}>

                {/* MOUNTAIN CONTAINER */}
                <motion.div
                    animate={{ rotateY: isFalling ? [0, 90, 180, 270, 360] : 0, scale: isFalling ? 0.8 : 1 }}
                    style={{ position: 'absolute', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: '3s' }}
                >
                    {/* The Mountain Mesh (Visual Representation) */}
                    <div style={{ position: 'absolute', left: '50%', top: '10%', transform: 'translateX(-50%) translateZ(-500px)', width: '600px', height: '1200px', background: 'linear-gradient(to bottom, #1e293b, #0f172a)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', opacity: 0.8, boxShadow: '0 0 100px rgba(59, 130, 246, 0.2)' }} />

                    {/* GLOWING STEP LEVELS */}
                    {[...Array(10)].map((_, i) => {
                        const level = 10 - i;
                        const isActive = currentStep === level;
                        return (
                            <motion.div
                                key={level}
                                animate={{
                                    opacity: currentStep < level ? 0.2 : 1,
                                    boxShadow: isActive ? '0 0 30px #3b82f6' : '0 0 10px rgba(59, 130, 246, 0.2)'
                                }}
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: `${20 + i * 8}%`,
                                    transform: `translateX(-50%) translateZ(${level * 50}px)`,
                                    width: `${200 + i * 40}px`,
                                    height: '20px',
                                    background: isActive ? '#3b82f6' : 'rgba(30, 41, 59, 0.8)',
                                    borderRadius: '50% / 100% 100% 0 0',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    zIndex: 10 - i
                                }}
                            >
                                <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', fontWeight: 900, color: isActive ? 'white' : 'rgba(255,255,255,0.3)' }}>
                                    SECTOR {level}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* WATERFALL VISUALIZATION */}
                <div style={{ position: 'absolute', right: 0, top: 0, width: '40%', height: '100%', overflow: 'hidden', borderLeft: '2px solid rgba(59, 130, 246, 0.2)', background: 'rgba(12, 45, 72, 0.1)' }}>
                    <motion.div
                        animate={{ y: [0, -100] }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', width: '100%', height: '200%', background: 'linear-gradient(to bottom, transparent, rgba(96, 165, 250, 0.2), rgba(30, 64, 175, 0.4), transparent)', filter: 'blur(20px)' }}
                    />
                    {/* Character in waterfall mode */}
                    <AnimatePresence>
                        {gameState === 'waterfall' && (
                            <motion.div
                                initial={{ y: -200, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 500, opacity: 0 }}
                                style={{ position: 'absolute', left: '50%', bottom: '20%', transform: 'translateX(-50%)' }}
                            >
                                <i className="fa-solid fa-person-falling-burst" style={{ fontSize: '6rem', color: '#60a5fa', filter: 'drop-shadow(0 0 20px #3b82f6)' }}></i>
                                <div style={{ textAlign: 'center', marginTop: '1rem', fontWeight: 900, textShadow: '0 0 10px black' }}>WATER FORCE {waterIntensity}%</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* THE CHARACTER (3D SPRITE) */}
                <motion.div
                    animate={gameState === 'climb' ? {
                        top: `${20 + (10 - currentStep) * 8}%`,
                        scale: isSlipping ? [1, 1.2, 1] : 1,
                        rotate: isSlipping ? [-5, 5, -5, 5, 0] : 0
                    } : { top: '80%', opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                    style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%) translateZ(600px)', zIndex: 100 }}
                >
                    <i className="fa-solid fa-person-ascending" style={{ fontSize: '4rem', color: '#f8fafc', filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.8))' }}></i>
                </motion.div>
            </div>

            {/* HOLOGRAPHIC HUD / INTERFACE */}
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', width: '450px', background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '32px', border: '2px solid rgba(59, 130, 246, 0.4)', padding: '2rem', zIndex: 1000, boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <span style={{ color: '#3b82f6', fontWeight: 800 }}>{currentTask.title}</span>
                            <span style={{ color: timer < 10 ? '#ef4444' : '#60a5fa' }}>{timer}s</span>
                        </div>
                        <h2 style={{ fontSize: '1.2rem', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>{currentTask.question}</h2>

                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', borderLeft: '4px solid #3b82f6', fontSize: '0.9rem', color: '#94a3b8' }}>
                            <i className="fa-solid fa-brain"></i> {currentTask.hint}
                        </div>

                        <textarea
                            value={userResponse}
                            onChange={(e) => setUserResponse(e.target.value)}
                            placeholder="Enter Code or Signature..."
                            style={{ width: '100%', height: '100px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#10b981', padding: '1rem', fontFamily: 'monospace', outline: 'none', resize: 'none', marginBottom: '1rem' }}
                        />

                        <button
                            onClick={checkAnswer}
                            style={{ width: '100%', padding: '1rem', background: '#3b82f6', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 900, cursor: 'pointer', transition: '0.3s' }}
                        >
                            SYNC NEURAL LINK
                        </button>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* TOP BAR STATS */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', right: '2rem', display: 'flex', justifyContent: 'space-between', zIndex: 1000 }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                        <span style={{ color: '#60a5fa', fontWeight: 800 }}>XP:</span> {xp.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '2px' }}>AI SURVIVAL CLIMB</div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setGlobalActiveTab('escapegameshub')} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>ABORT</button>
                </div>
            </div>

            {/* FULLSCREEN OVERLAYS */}
            <AnimatePresence>
                {showInstructions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2, 6, 23, 0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                    >
                        <div style={{ maxWidth: '600px' }}>
                            <i className="fa-solid fa-mountain-sun" style={{ fontSize: '5rem', color: '#3b82f6', marginBottom: '2rem' }}></i>
                            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>UNREAL ASCENT</h1>
                            <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '3rem' }}>Descend the mountain by solving logic signatures. One mistake triggers a structural collapse into the waterfall abyss.</p>
                            <button onClick={() => setShowInstructions(false)} style={{ background: '#3b82f6', color: 'white', padding: '1.5rem 4rem', borderRadius: '20px', border: 'none', fontWeight: 900, fontSize: '1.5rem', cursor: 'pointer' }}>START MISSION</button>
                        </div>
                    </motion.div>
                )}

                {gameState === 'victory' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg, #10b981, #064e3b)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                    >
                        <div>
                            <i className="fa-solid fa-trophy" style={{ fontSize: '8rem', color: 'white', marginBottom: '2rem' }}></i>
                            <h1 style={{ fontSize: '4rem', fontWeight: 900 }}>SUMMIT EXTRACTED</h1>
                            <p style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>You have secured all 10 Sectors. Logic Master Certification Unlocked.</p>
                            <button onClick={() => setGlobalActiveTab('escapegameshub')} style={{ background: 'white', color: '#10b981', padding: '1.5rem 4rem', borderRadius: '20px', border: 'none', fontWeight: 900, fontSize: '1.5rem', cursor: 'pointer' }}>EXIT ARENA</button>
                        </div>
                    </motion.div>
                )}

                {gameState === 'game-over' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(153, 27, 27, 0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                    >
                        <div>
                            <i className="fa-solid fa-skull-crossbones" style={{ fontSize: '8rem', color: 'white', marginBottom: '2rem' }}></i>
                            <h1 style={{ fontSize: '4rem', fontWeight: 900 }}>SYSTEM FAILURE</h1>
                            <p style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>Neural link severed at Sector {currentStep}.</p>
                            <button onClick={() => window.location.reload()} style={{ background: 'white', color: '#ef4444', padding: '1.5rem 4rem', borderRadius: '20px', border: 'none', fontWeight: 900, fontSize: '1.5rem', cursor: 'pointer' }}>RETRY ASCENT</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes water-rush {
                    0% { transform: translateY(-10px); }
                    100% { transform: translateY(10px); }
                }
            `}</style>
        </div>
    );
};

export default AISurvivalClimb;
