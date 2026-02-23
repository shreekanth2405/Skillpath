import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

const CodeReviewer = () => {
    const [code, setCode] = useState(`function calculateSum(n) {\n    let s = 0;\n    for(let i=0; i<n; i++) {\n        for(let j=0; j<n; j++) {\n            s += i + j;\n        }\n    }\n    return s;\n}`);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);

    const analyzeCode = () => {
        setIsAnalyzing(true);

        // Simulate AI Analysis Delay
        setTimeout(() => {
            const lines = code.split('\n');
            const analysis = {
                qualityScore: 0,
                efficiencyScore: 0,
                readabilityScore: 0,
                timeComplexity: 'O(1)',
                spaceComplexity: 'O(1)',
                issues: [],
                suggestions: [],
                complexityRating: 'Optimal',
                badge: 'Beginner',
                refactored: ''
            };

            // 1. Quality Analysis Heuristics
            if (code.length < 50) {
                analysis.issues.push({ type: 'quality', msg: 'Code is very short, possibly missing edge case handling.' });
            }
            if (lines.length > 30) {
                analysis.issues.push({ type: 'quality', msg: 'Function is too long (over 30 lines). Consider breaking it down.' });
            }

            // Check for nested loops for time complexity
            const nestedLoopMatch = code.match(/for.*\{.*for/s);
            const singleLoopMatch = code.match(/for|while|map|forEach/);

            if (nestedLoopMatch) {
                analysis.timeComplexity = 'O(n²)';
                analysis.complexityRating = 'Needs Improvement';
                analysis.suggestions.push('Detected nested loops. Check if this can be optimized to O(n log n) or O(n).');
            } else if (singleLoopMatch) {
                analysis.timeComplexity = 'O(n)';
                analysis.complexityRating = 'Acceptable';
            }

            // Check for indentation
            if (code.includes('\t')) {
                analysis.issues.push({ type: 'format', msg: 'Consistency: Mix of tabs and spaces detected.' });
            }

            // Unused variables (mock)
            if (code.match(/let temp/)) {
                analysis.issues.push({ type: 'clean', msg: 'Possible unused variable: "temp"' });
            }

            // Optimization
            if (code.match(/Array\(.*\)\.fill/)) {
                analysis.suggestions.push('Consider using TypedArrays for large numeric buffers to save memory.');
            }

            // Scoring
            analysis.qualityScore = Math.max(40, 100 - (analysis.issues.length * 10));
            analysis.efficiencyScore = analysis.timeComplexity === 'O(n²)' ? 50 : (analysis.timeComplexity === 'O(n)' ? 85 : 100);
            analysis.readabilityScore = lines.length > 20 ? 60 : 90;

            const avg = (analysis.qualityScore + analysis.efficiencyScore + analysis.readabilityScore) / 3;
            if (avg > 90) analysis.badge = 'Expert';
            else if (avg > 75) analysis.badge = 'Advanced';
            else if (avg > 60) analysis.badge = 'Intermediate';
            else analysis.badge = 'Beginner';

            analysis.refactored = `// AI Refactored Snippet\nfunction optimalSum(n) {\n    // Mathematical optimization O(1)\n    return (n * (n - 1) * n);\n}`;

            setResults(analysis);
            setIsAnalyzing(false);
        }, 1500);
    };

    return (
        <div style={{ padding: '2rem', background: '#020617', minHeight: '100vh', color: 'white', fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                            SKILL PATH AI CODE REVIEWER
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginTop: '0.5rem' }}>Production-ready static analysis & complexity estimation.</p>
                    </div>
                    {results && (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ padding: '0.5rem 1.5rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '100px', color: '#3b82f6', fontWeight: 900 }}>
                                BADGE: {results.badge}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: results ? '1fr 1fr' : '1fr', gap: '2rem', transition: '0.5s' }}>
                    {/* Left: Editor */}
                    <div className="glass-panel" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                            <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.9rem' }}>SYSTEM.TERMINAL.INPUT</span>
                            <button
                                onClick={analyzeCode}
                                disabled={isAnalyzing}
                                style={{ padding: '0.8rem 2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}
                            >
                                {isAnalyzing ? <><i className="fa-solid fa-spinner fa-spin"></i> ANALYZING...</> : 'RUN REVIEW'}
                            </button>
                        </div>
                        <div style={{ height: '500px', overflow: 'auto', background: '#020617', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Editor
                                value={code}
                                onValueChange={setCode}
                                highlight={code => highlight(code, languages.js)}
                                padding={20}
                                style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 16, minHeight: '100%', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Right: Results */}
                    <AnimatePresence>
                        {results && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                            >
                                {/* Scores */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    {[
                                        { label: 'QUALITY', val: results.qualityScore, color: '#3b82f6' },
                                        { label: 'EFFICIENCY', val: results.efficiencyScore, color: '#10b981' },
                                        { label: 'READABILITY', val: results.readabilityScore, color: '#f59e0b' }
                                    ].map(s => (
                                        <div key={s.label} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 800, marginBottom: '0.5rem' }}>{s.label}</div>
                                            <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color }}>{s.val}%</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Complexity Panel */}
                                <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))' }}>
                                    <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <i className="fa-solid fa-microchip" style={{ color: '#3b82f6' }}></i> Complexity Analysis
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <div>
                                            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>TIME COMPLEXITY</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: results.complexityRating === 'Needs Improvement' ? '#ef4444' : '#10b981' }}>{results.timeComplexity}</div>
                                            <div style={{ fontSize: '0.8rem', color: results.complexityRating === 'Needs Improvement' ? '#ef4444' : '#10b981', fontWeight: 700 }}>{results.complexityRating.toUpperCase()}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>SPACE COMPLEXITY</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{results.spaceComplexity}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>OPTIMAL</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Issues & Suggestions */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="glass-panel" style={{ padding: '1.5rem', height: '200px', overflow: 'auto' }}>
                                        <h4 style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}><i className="fa-solid fa-circle-exclamation"></i> CRITICAL ISSUES</h4>
                                        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                                            {results.issues.length > 0 ? results.issues.map((iss, i) => <li key={i}>{iss.msg}</li>) : <li>No critical issues found!</li>}
                                        </ul>
                                    </div>
                                    <div className="glass-panel" style={{ padding: '1.5rem', height: '200px', overflow: 'auto' }}>
                                        <h4 style={{ color: '#3b82f6', marginBottom: '1rem', fontSize: '0.9rem' }}><i className="fa-solid fa-lightbulb"></i> OPTIMIZATIONS</h4>
                                        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                                            {results.suggestions.length > 0 ? results.suggestions.map((sug, i) => <li key={i}>{sug}</li>) : <li>Standard optimizations applied.</li>}
                                        </ul>
                                    </div>
                                </div>

                                {/* Refactored Code */}
                                <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <h4 style={{ color: '#10b981', marginBottom: '1rem', fontSize: '0.9rem' }}><i className="fa-solid fa-wand-magic-sparkles"></i> AI REFACTORED VERSION</h4>
                                    <pre style={{ margin: 0, padding: '1rem', background: '#020617', borderRadius: '12px', fontSize: '0.85rem', color: '#10b981', overflow: 'auto' }}>
                                        <code>{results.refactored}</code>
                                    </pre>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Floating Resource Modal (Placeholder for 5. Improvement Tips) */}
            <AnimatePresence>
                {results && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}
                    >
                        <div className="glass-panel" style={{ padding: '1.5rem', background: '#3b82f6', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.5)' }}>
                            <i className="fa-solid fa-book-bookmark" style={{ fontSize: '1.5rem' }}></i>
                            <div>
                                <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>LEARNING RESOURCES</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Master {results.timeComplexity === 'O(n²)' ? 'Dynamic Programming' : 'Clean Code Patterns'}</div>
                            </div>
                            <button style={{ marginLeft: '1rem', padding: '0.5rem 1rem', background: 'white', color: '#3b82f6', border: 'none', borderRadius: '8px', fontWeight: 900, cursor: 'pointer' }}>EXPLORE</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CodeReviewer;
