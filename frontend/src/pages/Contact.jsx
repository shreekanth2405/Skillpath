import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: '#0f172a' }}>Contact Support</h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>Our AI and human team is ready to assist you. Reach out for technical support or enterprise inquiries.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <input type="text" placeholder="Your Name" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem' }} />
                    <input type="email" placeholder="Your Email" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem' }} />
                    <textarea placeholder="How can we help?" rows="5" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', resize: 'vertical' }}></textarea>
                    <button style={{ background: '#3b82f6', color: 'white', padding: '1rem', borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.target.style.background = '#2563eb'} onMouseOut={e => e.target.style.background = '#3b82f6'}>Submit Message</button>
                </div>
            </motion.div>
        </div>
    );
};

export default Contact;
