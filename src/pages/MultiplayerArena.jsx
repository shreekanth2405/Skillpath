import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MultiplayerArena = () => {
    const [status, setStatus] = useState('searching'); // searching, matched, in-game
    const [lobbyPlayers, setLobbyPlayers] = useState([
        { name: 'CyberKnight_99', level: 45, status: 'Ready', ping: '24ms', avatar: 'https://ui-avatars.com/api/?name=CK&background=3b82f6&color=fff' },
        { name: 'LogicWitch', level: 32, status: 'In Game', ping: '42ms', avatar: 'https://ui-avatars.com/api/?name=LW&background=8b5cf6&color=fff' },
        { name: 'BinaryGhost', level: 58, status: 'Searching...', ping: '12ms', avatar: 'https://ui-avatars.com/api/?name=BG&background=ef4444&color=fff' },
        { name: 'Vector_Pro', level: 12, status: 'Ready', ping: '35ms', avatar: 'https://ui-avatars.com/api/?name=VP&background=10b981&color=fff' }
    ]);

    const [chatMessages, setChatMessages] = useState([
        { user: 'CyberKnight_99', text: 'Anyone up for the AI Survival Climb?', time: '2m ago' },
        { user: 'LogicWitch', text: 'Just broke the record in Code Escape!', time: '1m ago' },
        { user: 'System', text: 'New Tournament starting in 5 minutes.', time: 'Just now' }
    ]);

    const [queuingTime, setQueuingTime] = useState(0);

    useEffect(() => {
        let interval;
        if (status === 'searching') {
            interval = setInterval(() => {
                setQueuingTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div style={{
            padding: '2rem',
            background: '#020617',
            color: 'white',
            minHeight: '100vh',
            fontFamily: "'Outfit', sans-serif",
            display: 'grid',
            gridTemplateColumns: '1fr 350px',
            gap: '2rem'
        }}>
            {/* MAIN MATCHMAKING AREA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5))', padding: '3rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
                >
                    <div style={{ position: 'absolute', top: -100, left: -100, width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(80px)' }}></div>

                    <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '2px' }}>
                        <i className="fa-solid fa-users-rays" style={{ color: '#3b82f6', marginRight: '15px' }}></i>
                        SKILL PATH AI ARENA
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '3rem' }}>Compete with logic-architects worldwide in real-time challenges.</p>

                    <AnimatePresence mode="wait">
                        {status === 'searching' && (
                            <motion.div
                                key="searching"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            >
                                <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '2rem' }}>
                                    {[1, 2, 3].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '2px solid #3b82f6', borderRadius: '50%' }}
                                        />
                                    ))}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '3rem', color: '#3b82f6' }}>
                                        <i className="fa-solid fa-satellite-dish fa-beat"></i>
                                    </div>
                                </div>
                                <h2 style={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: 800 }}>FINDING COMPETITORS...</h2>
                                <p style={{ fontSize: '2rem', fontWeight: 900, marginTop: '1rem' }}>{formatTime(queuingTime)}</p>
                                <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Estimated wait: 0:45</p>

                                <button
                                    onClick={() => setStatus('matched')}
                                    style={{ marginTop: '3rem', background: '#ef4444', border: 'none', color: 'white', padding: '15px 40px', borderRadius: '15px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)' }}
                                >
                                    CANCEL QUEUE
                                </button>
                            </motion.div>
                        )}

                        {status === 'matched' && (
                            <motion.div
                                key="matched"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                            >
                                <h2 style={{ color: '#10b981', fontSize: '2rem', marginBottom: '2rem' }}>MATCH FOUND!</h2>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4rem' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <img src="https://ui-avatars.com/api/?name=You&background=3b82f6&color=fff" style={{ width: '120px', borderRadius: '50%', border: '4px solid #3b82f6' }} alt="You" />
                                        <h3 style={{ marginTop: '1rem' }}>YOU</h3>
                                        <p style={{ color: '#60a5fa' }}>Lv. 12</p>
                                    </div>
                                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f59e0b' }}>VS</div>
                                    <div style={{ textAlign: 'center' }}>
                                        <motion.img
                                            initial={{ x: 50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            src="https://ui-avatars.com/api/?name=ShadowCode&background=ef4444&color=fff"
                                            style={{ width: '120px', borderRadius: '50%', border: '4px solid #ef4444' }}
                                            alt="Opponent"
                                        />
                                        <h3 style={{ marginTop: '1rem' }}>ShadowCode_X</h3>
                                        <p style={{ color: '#f87171' }}>Lv. 15</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => alert('Launching Multiplayer Match...')}
                                    style={{ marginTop: '3rem', background: '#10b981', border: 'none', color: 'white', padding: '18px 60px', borderRadius: '15px', fontWeight: 900, fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)' }}
                                >
                                    ACCEPT DUEL
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* GAME SELECTION GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { name: 'AI Survival Climb', players: 1420, icon: 'fa-mountain-sun', color: '#3b82f6' },
                        { name: 'Code Escape House', players: 850, icon: 'fa-house-lock', color: '#8b5cf6' },
                        { name: 'Logic Blitz', players: 2100, icon: 'fa-bolt', color: '#f59e0b' },
                        { name: 'Global Hackathon', players: 300, icon: 'fa-code-branch', color: '#10b981' }
                    ].map((game, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5, background: 'rgba(255,255,255,0.05)' }}
                            style={{ background: 'rgba(30, 41, 59, 0.3)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                        >
                            <i className={`fa-solid ${game.icon}`} style={{ fontSize: '2rem', color: game.color, marginBottom: '1rem' }}></i>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{game.name}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                                <span>{game.players} Active</span>
                                <span style={{ color: '#10b981' }}>● Online</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* SIDEBAR: COMMUNITY & CHAT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* LOBBY PLAYERS */}
                <div style={{ background: 'rgba(30, 41, 59, 0.3)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        LOBBY PLAYERS
                        <span style={{ color: '#3b82f6' }}>242</span>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {lobbyPlayers.map((player, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                                <img src={player.avatar} style={{ width: '40px', borderRadius: '50%' }} alt="Avatar" />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{player.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Level {player.level}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.65rem', color: player.status === 'Ready' ? '#10b981' : '#64748b' }}>{player.status}</div>
                                    <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{player.ping}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GLOBAL CHAT */}
                <div style={{ background: 'rgba(30, 41, 59, 0.3)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem' }}>GLOBAL RADAR</h3>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px' }}>
                        {chatMessages.map((msg, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: msg.user === 'System' ? '#f59e0b' : '#3b82f6' }}>{msg.user}</span>
                                    <span style={{ fontSize: '0.6rem', color: '#475569' }}>{msg.time}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '12px' }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '1.5rem', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid #1e293b', padding: '12px 15px', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '0.85rem' }}
                        />
                        <i className="fa-solid fa-paper-plane" style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#3b82f6', cursor: 'pointer' }}></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiplayerArena;
