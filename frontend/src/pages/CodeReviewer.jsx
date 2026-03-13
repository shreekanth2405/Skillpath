import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from '../services/prism';
import 'prismjs/themes/prism-tomorrow.css';
import { genAI } from '../services/gemini';

// ─── CODING PROBLEMS DATA ───────────────────────────────────────────
const FIXED_PROBLEMS = [
    {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        category: "Arrays",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
        constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
        examples: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }
        ],
        starterCode: {
            javascript: "function twoSum(nums, target) {\n  // Write your code here\n};",
            python: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass",
            java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};"
        },
        testCases: [
            { input: [[2, 7, 11, 15], 9], output: [0, 1] },
            { input: [[3, 2, 4], 6], output: [1, 2] },
            { input: [[3, 3], 6], output: [0, 1] }
        ]
    },
    {
        id: 2,
        title: "Reverse String",
        difficulty: "Easy",
        category: "Strings",
        description: "Write a function that reverses a string. The input string is given as an array of characters `s`.",
        constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ascii character."],
        examples: [
            { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }
        ],
        starterCode: {
            javascript: "function reverseString(s) {\n  // Write your code here\n};",
            python: "class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        pass"
        },
        testCases: [
            { input: [["h", "e", "l", "l", "o"]], output: ["o", "l", "l", "e", "h"] }
        ]
    },
    {
        id: 3,
        title: "Valid Parentheses",
        difficulty: "Easy",
        category: "Strings",
        description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
        examples: [
            { input: 's = "()"', output: "true" },
            { input: 's = "()[]{}"', output: "true" },
            { input: 's = "(]"', output: "false" }
        ],
        starterCode: {
            javascript: "function isValid(s) {\n  // Write your code here\n};"
        },
        testCases: [
            { input: ["()"], output: true },
            { input: ["()[]{}"], output: true },
            { input: ["(]"], output: false }
        ]
    },
    {
        id: 4,
        title: "Binary Search",
        difficulty: "Easy",
        category: "Searching",
        description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1.",
        constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All the integers in nums are unique.", "nums is sorted in ascending order."],
        starterCode: { javascript: "function search(nums, target) {\n  \n};" },
        testCases: [{ input: [[-1, 0, 3, 5, 9, 12], 9], output: 4 }]
    },
    {
        id: 5,
        title: "Climbing Stairs",
        difficulty: "Easy",
        category: "Dynamic Programming",
        description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        constraints: ["1 <= n <= 45"],
        starterCode: { javascript: "function climbStairs(n) {\n  \n};" },
        testCases: [{ input: [2], output: 2 }, { input: [3], output: 3 }]
    }
];

const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', prism: languages.js },
    { id: 'python', name: 'Python', prism: languages.python },
    { id: 'java', name: 'Java', prism: languages.java },
    { id: 'cpp', name: 'C++', prism: languages.cpp },
    { id: 'c', name: 'C', prism: languages.c },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────
const CodeReviewer = () => {
    const [view, setView] = useState('list'); // 'list' | 'editor'
    const [activeProblem, setActiveProblem] = useState(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [results, setResults] = useState(null); // { status, passed, total, testResults, aiReview }
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeEditorTab, setActiveEditorTab] = useState('description'); // 'description' | 'discussion' | 'submissions'
    const [history, setHistory] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [xp, setXp] = useState(parseInt(localStorage.getItem('code_xp') || '0'));
    const [streak, setStreak] = useState(parseInt(localStorage.getItem('code_streak') || '0'));
    const [solvedCount, setSolvedCount] = useState(JSON.parse(localStorage.getItem('solved_problems') || '[]').length);

    // Stats persisting
    useEffect(() => {
        localStorage.setItem('code_xp', xp.toString());
        localStorage.setItem('code_streak', streak.toString());
    }, [xp, streak]);

    const selectProblem = (p) => {
        setActiveProblem(p);
        setCode(p.starterCode[language] || p.starterCode['javascript'] || '');
        setView('editor');
        setResults(null);
    };

    const handleRun = () => {
        setIsProcessing(true);
        // Simulate frontend check
        setTimeout(() => {
            const isSuccess = Math.random() > 0.3; // Simulated logic check
            setResults({
                status: isSuccess ? 'Accepted' : 'Wrong Answer',
                passed: isSuccess ? activeProblem.testCases.length : 0,
                total: activeProblem.testCases.length,
                time: (Math.random() * 100 + 20).toFixed(0) + 'ms',
                memory: (Math.random() * 10 + 30).toFixed(1) + 'MB',
                testResults: activeProblem.testCases.map((tc, idx) => ({
                    id: idx + 1,
                    status: isSuccess ? 'Passed' : (idx === 0 ? 'Failed' : 'Passed'),
                    input: JSON.stringify(tc.input),
                    expected: JSON.stringify(tc.output),
                    actual: isSuccess ? JSON.stringify(tc.output) : 'null'
                }))
            });
            setIsProcessing(false);
        }, 1000);
    };

    const handleReviewAI = async () => {
        if (!code) return;
        setIsProcessing(true);
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = `Act as an expert Senior Software Engineer at a top tech company. 
Review the following code for the problem "${activeProblem.title}".
Problem description: ${activeProblem.description}
Code Language: ${language}
User Code:
${code}

Provide a detailed review in valid JSON format only.
{
  "score": 85,
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "feedback": "...",
  "readability": "Excellent/Good/Poor",
  "improvements": ["step 1", "step 2"],
  "optimizedSolution": "..."
}`;
            const result = await model.generateContent(prompt);
            const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            const review = JSON.parse(text);
            setResults(prev => ({ ...prev, aiReview: review }));
            if (review.score > 80) {
                setXp(p => p + (activeProblem.difficulty === 'Hard' ? 100 : activeProblem.difficulty === 'Medium' ? 50 : 25));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const generateAIProblem = async () => {
        setIsProcessing(true);
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = `Generate a new competitive programming problem like LeetCode. 
Output ONLY valid JSON:
{
  "title": "...",
  "difficulty": "Medium",
  "category": "Graphs",
  "description": "...",
  "constraints": ["..."],
  "examples": [{"input": "...", "output": "...", "explanation": "..."}],
  "starterCode": {"javascript": "...", "python": "..."},
  "testCases": [{"input": "...", "output": "..."}]
}`;
            const result = await model.generateContent(prompt);
            const raw = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            const newP = JSON.parse(raw);
            newP.id = Date.now();
            selectProblem(newP);
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    // ─── RENDER LIST ──────────────────────────────────────────────────
    const ProblemList = () => (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Problem Bank</h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Master algorithms and data structures with AI-powered feedback.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={generateAIProblem}
                        style={{ padding: '0.8rem 1.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                    >
                        <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#6366f1' }} /> Create Custom Problem
                    </button>
                    <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.75rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#6366f1' }}>{xp}</div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>XP Points</div>
                        </div>
                        <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f59e0b' }}>{streak}</div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Streak</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 800 }}>STATUS</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 800 }}>TITLE</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 800 }}>DIFFCULTY</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 800 }}>CATEGORY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {FIXED_PROBLEMS.map(p => (
                            <tr
                                key={p.id}
                                onClick={() => selectProblem(p)}
                                style={{ cursor: 'pointer', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <i className="fa-regular fa-circle" style={{ color: '#cbd5e1' }} />
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: '#0f172a' }}>{p.id}. {p.title}</td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        background: p.difficulty === 'Easy' ? '#f0fdf4' : (p.difficulty === 'Medium' ? '#fffbeb' : '#fef2f2'),
                                        color: p.difficulty === 'Easy' ? '#10b981' : (p.difficulty === 'Medium' ? '#f59e0b' : '#ef4444')
                                    }}>
                                        {p.difficulty}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>{p.category}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // ─── RENDER EDITOR ────────────────────────────────────────────────
    const EditorView = () => (
        <div style={{ height: 'calc(100vh - 64px)', display: 'grid', gridTemplateColumns: '1.2fr 1fr', background: darkMode ? '#0f172a' : '#f8fafc' }}>

            {/* LEFT: Editor Area */}
            <div style={{ display: 'flex', flexDirection: 'column', borderRight: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`, background: darkMode ? '#020617' : 'white' }}>
                <div style={{ padding: '0.75rem 1.5rem', borderBottom: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, background: darkMode ? '#0f172a' : 'white', color: darkMode ? 'white' : '#0f172a', fontWeight: 700, fontSize: '0.85rem', outline: 'none' }}
                        >
                            {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            style={{ width: '36px', height: '36px', borderRadius: '8px', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, background: 'transparent', color: darkMode ? '#fde68a' : '#64748b', cursor: 'pointer' }}
                        >
                            <i className={`fa-solid fa-${darkMode ? 'sun' : 'moon'}`} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={handleRun}
                            disabled={isProcessing}
                            style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: 800, cursor: 'pointer' }}
                        >
                            Run
                        </button>
                        <button
                            onClick={handleRun}
                            disabled={isProcessing}
                            style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: 800, cursor: 'pointer' }}
                        >
                            Submit
                        </button>
                    </div>
                </div>

                <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
                    <div style={{ background: darkMode ? '#020617' : '#fafafa', borderRadius: '12px', minHeight: '100%', border: `1px solid ${darkMode ? '#1e293b' : '#f1f5f9'}` }}>
                        <Editor
                            value={code}
                            onValueChange={setCode}
                            highlight={code => highlight(code, LANGUAGES.find(l => l.id === language).prism)}
                            padding={20}
                            style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, outline: 'none', minHeight: '400px' }}
                        />
                    </div>
                </div>

                {/* Console / Test Results */}
                {results && (
                    <div style={{ height: '240px', borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, background: darkMode ? '#0f172a' : 'white', padding: '1.25rem', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: 900,
                                    color: results.status === 'Accepted' ? '#10b981' : '#ef4444'
                                }}>
                                    {results.status}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                                    {results.time} | {results.memory}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {results.testResults.map(tr => (
                                <div key={tr.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '10px', background: tr.status === 'Passed' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${tr.status === 'Passed' ? '#dcfce7' : '#fee2e2'}` }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: tr.status === 'Passed' ? '#10b981' : '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                                        <i className={`fa-solid fa-${tr.status === 'Passed' ? 'check' : 'xmark'}`} />
                                    </div>
                                    <div style={{ flex: 1, fontSize: '0.8rem' }}>
                                        <span style={{ fontWeight: 800, marginRight: '1rem' }}>Case {tr.id}:</span>
                                        <code style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px' }}>Input: {tr.input}</code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT: Problem Details Area */}
            <div style={{ display: 'flex', flexDirection: 'column', background: 'white' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
                    {['description', 'discussion', 'submissions'].map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveEditorTab(t)}
                            style={{ flex: 1, padding: '1rem', border: 'none', background: 'transparent', borderBottom: `2.5px solid ${activeEditorTab === t ? '#6366f1' : 'transparent'}`, color: activeEditorTab === t ? '#0f172a' : '#94a3b8', fontWeight: 800, textTransform: 'capitalize', cursor: 'pointer' }}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
                    {activeEditorTab === 'description' && (
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>{activeProblem.id}. {activeProblem.title}</h1>
                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, background: '#f0fdf4', color: '#10b981' }}>{activeProblem.difficulty}</span>
                                <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}><i className="fa-solid fa-tag" style={{ marginRight: '5px' }} />{activeProblem.category}</span>
                            </div>

                            <div style={{ fontSize: '1rem', lineHeight: 1.7, color: '#374151', marginBottom: '2rem' }} dangerouslySetInnerHTML={{ __html: activeProblem.description.replace(/`(.*?)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-family:monospace">$1</code>') }} />

                            <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '1rem' }}>Examples</h3>
                            {activeProblem.examples.map((ex, i) => (
                                <div key={i} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}><strong>Input:</strong> <code>{ex.input}</code></p>
                                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}><strong>Output:</strong> <code>{ex.output}</code></p>
                                    {ex.explanation && <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}><strong>Explanation:</strong> {ex.explanation}</p>}
                                </div>
                            ))}

                            <h3 style={{ fontSize: '1rem', fontWeight: 900, marginTop: '2rem', marginBottom: '1rem' }}>Constraints</h3>
                            <ul style={{ paddingLeft: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                                {activeProblem.constraints.map((c, i) => <li key={i} style={{ marginBottom: '0.5rem' }}><code>{c}</code></li>)}
                            </ul>

                            {/* AI REVIEW SECTION */}
                            <div style={{ marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fa-solid fa-robot" style={{ color: '#6366f1' }} /> AI Code Mentor
                                    </h3>
                                    <button
                                        onClick={handleReviewAI}
                                        disabled={isProcessing}
                                        style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        {isProcessing ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-magnifying-glass-chart" />}
                                        Ask AI to Review
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {results?.aiReview && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                                            <div style={{ padding: '1.5rem', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#6366f1' }}>{results.aiReview.score}<span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>/100</span></div>
                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>TIME</div>
                                                        <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>{results.aiReview.timeComplexity}</div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>SPACE</div>
                                                        <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>{results.aiReview.spaceComplexity}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ padding: '1.5rem' }}>
                                                <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>{results.aiReview.feedback}</p>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                    <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '12px' }}>
                                                        <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: '#10b981', textTransform: 'uppercase' }}>Improvements</h4>
                                                        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.82rem', color: '#166534' }}>
                                                            {results.aiReview.improvements.map((im, i) => <li key={i}>{im}</li>)}
                                                        </ul>
                                                    </div>
                                                    <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '12px' }}>
                                                        <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: '#3b82f6', textTransform: 'uppercase' }}>Structure</h4>
                                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e40af' }}>Readability: {results.aiReview.readability}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer info */}
                <div style={{ padding: '1rem 2rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={() => setView('list')} style={{ border: 'none', background: 'transparent', color: '#6366f1', fontWeight: 800, cursor: 'pointer' }}>
                        <i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }} /> Return to Question List
                    </button>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Auto-saving local draft...</div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ width: '100%', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            {view === 'list' ? <ProblemList /> : <EditorView />}
        </div>
    );
};

export default CodeReviewer;
