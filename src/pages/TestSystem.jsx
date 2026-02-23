import React, { useState } from 'react';
import { genAI } from '../services/gemini';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

const TestSystem = () => {
    // Advanced Quiz State
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizScore, setQuizScore] = useState(null);

    // Advanced Coding Challenge State
    const [isCodingMode, setIsCodingMode] = useState(false);
    const [isGeneratingChallenge, setIsGeneratingChallenge] = useState(false);
    const [challengeData, setChallengeData] = useState(null);
    const [codeDraft, setCodeDraft] = useState('');
    const [isSubmittingCode, setIsSubmittingCode] = useState(false);
    const [codeFeedback, setCodeFeedback] = useState(null);

    const handleGenerateQuiz = async () => {
        setIsGeneratingQuiz(true);
        setQuizScore(null);
        setQuizAnswers({});
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Generate a 3-question Multiple Choice Quiz on a random advanced programming topic.
Return ONLY a valid JSON object, no markdown or backticks around it:
{
  "topic": "Quiz Topic",
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this is correct"
    }
  ]
}`;
            const result = await model.generateContent(prompt);
            let text = result.response.text();
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            setQuizData(JSON.parse(text));
        } catch (e) {
            console.error(e);
            alert("Failed to generate quiz from AI.");
        } finally {
            setIsGeneratingQuiz(false);
        }
    };

    const submitQuiz = () => {
        if (!quizData) return;
        let score = 0;
        quizData.questions.forEach(q => {
            if (quizAnswers[q.id] === q.correctIndex) score++;
        });
        setQuizScore(score);
    };

    const handleGenerateChallenge = async () => {
        setIsCodingMode(true);
        setIsGeneratingChallenge(true);
        setChallengeData(null);
        setCodeFeedback(null);
        setCodeDraft('');

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Generate a modern Javascript algorithmic coding challenge.
Return ONLY a valid JSON object, no markdown or backticks around it:
{
  "title": "Challenge Title",
  "difficulty": "Medium",
  "description": "Write a function that...",
  "starterCode": "function solve(arr) {\\n  // Your code here\\n}"
}`;
            const result = await model.generateContent(prompt);
            let text = result.response.text();
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(text);
            setChallengeData(parsed);
            setCodeDraft(parsed.starterCode || '');
        } catch (e) {
            console.error(e);
            alert("Failed to generate coding challenge.");
            setIsCodingMode(false);
        } finally {
            setIsGeneratingChallenge(false);
        }
    };

    const submitCodeChallenge = async () => {
        if (!codeDraft.trim()) return;
        setIsSubmittingCode(true);
        setCodeFeedback(null);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `You are an automated code evaluator. The user was given this JavaScript challenge:
"${challengeData.description}"

They submitted this code:
\`\`\`javascript
${codeDraft}
\`\`\`

Evaluate the code. Does it correctly solve the problem? Be relatively lenient on exact syntax if the logic is perfectly sound, but reject wildly incorrect logic.
Return ONLY a valid JSON object, no markdown or backticks:
{
  "passed": true/false,
  "feedback": "A very short, 1-2 sentence explanation of why it passed or failed."
}`;
            const result = await model.generateContent(prompt);
            let text = result.response.text();
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            setCodeFeedback(JSON.parse(text));
        } catch (e) {
            console.error(e);
            setCodeFeedback({ passed: false, feedback: "Error connecting to validation server." });
        } finally {
            setIsSubmittingCode(false);
        }
    };

    return (
        <div className="widget glass-panel" style={{ gridColumn: '1 / -1', minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: (quizData || isCodingMode) ? 'flex-start' : 'center', textAlign: (quizData || isCodingMode) ? 'left' : 'center' }}>
            {!quizData && !isGeneratingQuiz && !isCodingMode && !isGeneratingChallenge && (
                <>
                    <i className="fa-solid fa-vial" style={{ fontSize: '4rem', color: 'var(--accent-purple)', marginBottom: '1rem' }}></i>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Skill Path AI Adaptive Test System</h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '2rem' }}>Challenge yourself with dynamically generated MCQs and coding problems based on your recently learned skills.</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="primary-btn pulse-glow" onClick={handleGenerateQuiz}>Generate AI Quiz</button>
                        <button className="primary-btn" onClick={handleGenerateChallenge} style={{ background: 'white', color: 'var(--accent-blue)', border: '1px solid var(--border-light)' }}><i className="fa-solid fa-code"></i> Launch Coding Challenge</button>
                    </div>
                </>
            )}

            {isGeneratingQuiz && (
                <div style={{ textAlign: 'center' }}>
                    <i className="fa-solid fa-brain fa-bounce" style={{ fontSize: '3rem', color: 'var(--accent-purple)', marginBottom: '1rem' }}></i>
                    <h3>Synthesizing Quiz using Agentic Context...</h3>
                </div>
            )}

            {isGeneratingChallenge && (
                <div style={{ textAlign: 'center' }}>
                    <i className="fa-solid fa-laptop-code fa-fade" style={{ fontSize: '3rem', color: 'var(--accent-blue)', marginBottom: '1rem' }}></i>
                    <h3>Preparing Coding Environment & Problem...</h3>
                </div>
            )}

            {quizData && (
                <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-purple)' }}><i className="fa-solid fa-bolt"></i> {quizData.topic}</h2>
                        {quizScore !== null && <span className="badge-tag" style={{ fontSize: '1.1rem' }}>Score: {quizScore} / {quizData.questions.length}</span>}
                    </div>

                    {quizData.questions.map((q, idx) => (
                        <div key={q.id} style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{idx + 1}. {q.question}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {q.options.map((opt, optIdx) => {
                                    const isSelected = quizAnswers[q.id] === optIdx;
                                    const isCorrect = optIdx === q.correctIndex;
                                    const showResult = quizScore !== null;

                                    let bg = 'white';
                                    if (showResult && isCorrect) bg = 'rgba(16, 185, 129, 0.1)';
                                    else if (showResult && isSelected && !isCorrect) bg = 'rgba(239, 68, 68, 0.1)';
                                    else if (isSelected) bg = 'rgba(139, 92, 246, 0.1)';

                                    return (
                                        <button
                                            key={optIdx}
                                            disabled={showResult}
                                            onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                                            style={{
                                                padding: '1rem',
                                                textAlign: 'left',
                                                background: bg,
                                                border: `1px solid ${isSelected || (showResult && isCorrect) ? (isCorrect ? 'var(--accent-green)' : 'var(--accent-purple)') : 'var(--border-light)'}`,
                                                borderRadius: '8px',
                                                cursor: showResult ? 'default' : 'pointer',
                                                fontWeight: isSelected ? '600' : '400',
                                                transition: '0.2s'
                                            }}
                                        >
                                            {opt}
                                            {showResult && isCorrect && <i className="fa-solid fa-check" style={{ color: 'var(--accent-green)', float: 'right' }}></i>}
                                            {showResult && isSelected && !isCorrect && <i className="fa-solid fa-xmark" style={{ color: '#ef4444', float: 'right' }}></i>}
                                        </button>
                                    );
                                })}
                            </div>
                            {quizScore !== null && (
                                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', fontSize: '0.9rem' }}>
                                    <strong>Explanation:</strong> {q.explanation}
                                </div>
                            )}
                        </div>
                    ))}

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        {quizScore === null ? (
                            <button className="primary-btn" onClick={submitQuiz} disabled={Object.keys(quizAnswers).length !== quizData.questions.length}>
                                Submit Final Answers
                            </button>
                        ) : (
                            <button className="primary-btn" onClick={() => setQuizData(null)}>
                                <i className="fa-solid fa-rotate-right"></i> Take Another AI Quiz
                            </button>
                        )}
                    </div>
                </div>
            )}

            {isCodingMode && challengeData && (
                <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', height: '100%', minHeight: '600px' }}>
                    <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.4rem' }}>{challengeData.title}</h2>
                            <span className="badge-tag" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)' }}>{challengeData.difficulty}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>{challengeData.description}</p>

                        {codeFeedback && (
                            <div style={{ padding: '1.5rem', borderRadius: '8px', background: codeFeedback.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderLeft: `4px solid ${codeFeedback.passed ? 'var(--accent-green)' : '#ef4444'}`, marginTop: 'auto' }}>
                                <h4 style={{ color: codeFeedback.passed ? 'var(--accent-green)' : '#ef4444', marginBottom: '0.5rem' }}>
                                    {codeFeedback.passed ? <><i className="fa-solid fa-check-circle"></i> Tests Passed!</> : <><i className="fa-solid fa-triangle-exclamation"></i> Tests Failed</>}
                                </h4>
                                <p style={{ fontSize: '0.9rem' }}>{codeFeedback.feedback}</p>
                                {codeFeedback.passed && (
                                    <button className="primary-btn" style={{ marginTop: '1rem', width: '100%' }} onClick={() => { setIsCodingMode(false); setChallengeData(null); setCodeFeedback(null); }}>
                                        Return to Hub
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1, background: '#1e1e1e', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ background: '#252526', padding: '0.5rem 1rem', color: '#ccc', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fa-brands fa-js" style={{ color: '#f7df1e' }}></i> index.js</span>
                                <button style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }} onClick={() => setCodeDraft(challengeData.starterCode)}><i className="fa-solid fa-rotate-right"></i> Reset</button>
                            </div>
                            <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
                                <Editor
                                    value={codeDraft}
                                    onValueChange={setCodeDraft}
                                    highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
                                    padding={10}
                                    style={{
                                        fontFamily: '"Fira Code", "Consolas", monospace',
                                        fontSize: 14,
                                        color: '#d4d4d4',
                                        minHeight: '100%'
                                    }}
                                    textareaClassName="focus:outline-none"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '1rem' }}>
                            <button className="primary-btn" style={{ background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-light)' }} onClick={() => setIsCodingMode(false)}>Exit</button>
                            <button className="primary-btn pulse-glow" onClick={submitCodeChallenge} disabled={isSubmittingCode || (codeFeedback && codeFeedback.passed)}>
                                {isSubmittingCode ? <><i className="fa-solid fa-spinner fa-spin"></i> Running Tests...</> : <><i className="fa-solid fa-play"></i> Run Code</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestSystem;
