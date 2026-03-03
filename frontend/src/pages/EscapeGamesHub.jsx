import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EscapeGamesHub = ({ setActiveTab }) => {
    return (
        <div style={{ padding: '2rem', background: '#f8fafc', color: '#1e293b', fontFamily: "'Inter', sans-serif", position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflowY: 'auto', zIndex: 9999, boxSizing: 'border-box' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', color: '#0f172a', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <i className="fa-solid fa-gamepad"></i> SKILL PATH AI ESCAPE GAMES HUB
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '3rem', textAlign: 'center', maxWidth: '600px' }}>
                Select your immersive coding challenge experience. Test your logic, debug under pressure, and secure the access keys.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2.5rem', maxWidth: '1100px', width: '100%' }}>

                {/* Game 1: Code Escape House */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key="escape"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(177, 79, 255, 0.4)' }}
                        onClick={() => setActiveTab('codeescapehouse')}
                        style={{ background: '#ffffff', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', color: '#1e293b', position: 'relative', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer' }}
                    >
                        <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '12rem', opacity: 0.05, color: '#b14fff' }}>
                            <i className="fa-solid fa-house-lock"></i>
                        </div>
                        <i className="fa-solid fa-house-lock" style={{ fontSize: '4rem', color: '#b14fff', marginBottom: '1.5rem' }}></i>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 1rem 0' }}>Code Escape House</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>Navigate a 30-room labyrinth. Solve intricate logic puzzles, follow the guidance of your AI Mentor, and secure all access nodes.</p>
                        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '10px' }}>
                            <span style={{ background: 'rgba(177, 79, 255, 0.2)', color: '#e879f9', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}><i className="fa-solid fa-layer-group"></i> 30 Sector Tour</span>
                            <span style={{ background: 'rgba(177, 79, 255, 0.2)', color: '#e879f9', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}><i className="fa-solid fa-robot"></i> AI Mentor Active</span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Game 2: Algorithm Escape Challenge */}
                <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}
                    onClick={() => setActiveTab('escapechallenge')}
                    style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', padding: '3rem', cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', color: '#1e293b' }}
                >
                    <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '12rem', opacity: 0.05, color: '#10b981' }}>
                        <i className="fa-solid fa-terminal"></i>
                    </div>
                    <i className="fa-solid fa-terminal" style={{ fontSize: '4rem', color: '#10b981', marginBottom: '1.5rem' }}></i>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 1rem 0' }}>The Algorithm Gauntlet</h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>A highly immersive, fast-paced 5-chamber algorithmic gauntlet. Write code, trigger cyber-overrides, and earn your Master Certification.</p>
                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '10px' }}>
                        <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}><i className="fa-solid fa-skull"></i> 5 Boss Chambers</span>
                        <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}><i className="fa-solid fa-cube"></i> 3D Cinematic UX</span>
                    </div>
                </motion.div>

                {/* Game 3: AI Survival Climb */}
                <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}
                    onClick={() => setActiveTab('aisurvivalclimb')}
                    style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', padding: '3rem', cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', color: '#1e293b' }}
                >
                    <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '12rem', opacity: 0.05, color: '#3b82f6' }}>
                        <i className="fa-solid fa-mountain"></i>
                    </div>
                    <i className="fa-solid fa-mountain-sun" style={{ fontSize: '4rem', color: '#3b82f6', marginBottom: '1.5rem' }}></i>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 1rem 0' }}>AI Survival Climb</h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>Cinematic 3D survival challenge. Climb the logic mountain and survive the waterfall by decoding reality.</p>
                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '10px' }}>
                        <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}><i className="fa-solid fa-water"></i> Falls Survival</span>
                        <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}><i className="fa-solid fa-person-rays"></i> Unreal 5 UX</span>
                    </div>
                </motion.div>

                {/* Game 4: Multiplayer Arena */}
                <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)' }}
                    onClick={() => setActiveTab('multiplayer')}
                    style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', padding: '3rem', cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', color: '#1e293b' }}
                >
                    <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '12rem', opacity: 0.05, color: '#f59e0b' }}>
                        <i className="fa-solid fa-users-rays"></i>
                    </div>
                    <i className="fa-solid fa-users-rays" style={{ fontSize: '4rem', color: '#f59e0b', marginBottom: '1.5rem' }}></i>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 1rem 0' }}>Multiplayer Arena</h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>Face off against global developers. Join a lobby, find a match, and prove your algorithmic superiority.</p>
                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '10px' }}>
                        <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}><i className="fa-solid fa-satellite-dish"></i> Live Matching</span>
                        <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}><i className="fa-solid fa-ranking-star"></i> Global Rank</span>
                    </div>
                </motion.div>

                {/* Game 5: Urban Warzone */}
                <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)' }}
                    onClick={() => setActiveTab('urbanwarzone')}
                    style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', padding: '3rem', cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', color: '#1e293b' }}
                >
                    <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '12rem', opacity: 0.05, color: '#ef4444' }}>
                        <i className="fa-solid fa-city"></i>
                    </div>
                    <i className="fa-solid fa-fire" style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '1.5rem' }}></i>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 1rem 0' }}>Urban Warzone</h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>Deploy cyber-defenses and hack your way through the Neon City grid. Strategic logic battles in a hostile 3D environment.</p>
                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '10px' }}>
                        <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}><i className="fa-solid fa-shield-halved"></i> Cyber Defense</span>
                        <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}><i className="fa-solid fa-city"></i> Neon Grid</span>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default EscapeGamesHub;
