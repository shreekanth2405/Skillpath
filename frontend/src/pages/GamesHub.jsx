import React from 'react';
import { motion } from 'framer-motion';

const GamesHub = ({ setActiveTab }) => {
    const games = [
        { id: 'quizgame', title: 'Knowledge Arena', desc: 'AI-powered competitive quiz hub with 5 levels.', icon: 'fa-brain-circuit', color: '#6366f1' },
        { id: 'escapechallenge', title: 'Escape Game', desc: 'Solve logic puzzles to escape rooms.', icon: 'fa-door-open', color: '#8b5cf6' },
        { id: 'aisurvivalclimb', title: 'AI Survival Climb', desc: 'Survive in an AI-generated coding challenge.', icon: 'fa-mountain-exclamation', color: '#ef4444' },
        { id: 'multiplayer', title: 'Clue Multiplayer Agenda', desc: 'Compete with others in real-time.', icon: 'fa-users-rays', color: '#10b981' },
        { id: 'urbanwarzone', title: 'Urban Warzone', desc: 'AAA Open-world 3D shooting environment (Phase 1).', icon: 'fa-person-rifle', color: '#6366f1' },
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>
                <i className="fa-solid fa-gamepad" style={{ color: '#8b5cf6', marginRight: '15px' }}></i>
                GAMES SUB-HUB
            </motion.h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {games.map(game => (
                    <motion.div key={game.id} whileHover={{ y: -5, scale: 1.02 }}
                        onClick={() => setActiveTab(game.id)}
                        style={{ cursor: 'pointer', background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: `${game.color}20`, color: game.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
                            <i className={`fa-solid ${game.icon}`}></i>
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>{game.title}</h3>
                        <p style={{ color: '#64748b', lineHeight: 1.6 }}>{game.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default GamesHub;
