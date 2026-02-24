import React from 'react';
import ReactMarkdown from 'react-markdown';

const Chatbot = ({ chatLog, isTyping, inputText, setInputText, handleKeyPress, handleSend, chatBottomRef, knowledgeBaseRef, handleQuerySubmit }) => {

    const quickPredictions = [
        "Predict top web dev frameworks for 2026",
        "Forecast AI agent capabilities in the next 5 years",
        "What are the highest-paying tech skills projected for 2027?",
        "Predict the impact of quantum computing on cybersecurity"
    ];

    const handleQuickPrediction = (query) => {
        if (handleQuerySubmit) {
            handleQuerySubmit(`I want a real-time future prediction based on current market trends: ${query}`);
        }
    };
    return (
        <div className="widget glass-panel" style={{ gridColumn: '1 / -1', display: 'flex', minHeight: '600px', flexDirection: 'column' }}>
            <div className="widget-header">
                <h3 className="widget-title">
                    <i className="fa-solid fa-robot"></i> Skill Path AI Agentic LLM
                    <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '12px', marginLeft: '0.5rem' }}>Powered by Gemini</span>
                </h3>
                <span className="badge-tag">{knowledgeBaseRef.current ? "RAG Active" : "General Mode"}</span>
            </div>

            <div className="chat-box" style={{ flex: 1, paddingRight: '1rem' }}>
                {chatLog.map((msg, index) => (
                    msg.type === 'user' ? (
                        <div key={index} className="msg-row user-row" style={{ alignSelf: 'flex-end', animation: 'slideUp 0.3s ease' }}>
                            <div className="user-msg">
                                {msg.content}
                            </div>
                        </div>
                    ) : (
                        <div key={index} className="msg-row ai-row" style={{ alignSelf: 'flex-start', animation: 'slideUp 0.3s ease' }}>
                            <div className="ai-icon"><i className="fa-solid fa-brain"></i></div>
                            <div className="ai-bubble markdown-body" style={{ width: '100%' }}>
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    )
                ))}

                {isTyping && (
                    <div className="msg-row ai-row">
                        <div className="ai-icon"><i className="fa-solid fa-circle-notch fa-spin"></i></div>
                        <div className="ai-bubble" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                            Analyzing...
                        </div>
                    </div>
                )}

                <div ref={chatBottomRef} />
            </div>

            {/* Quick Predictions Actions */}
            {chatLog.length === 1 && (
                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-light)' }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}><i className="fa-solid fa-chart-line"></i> Real-Time Future Predictions</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {quickPredictions.map((pred, i) => (
                            <button
                                key={i}
                                onClick={() => handleQuickPrediction(pred)}
                                disabled={isTyping}
                                style={{
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid var(--accent-blue)',
                                    color: 'var(--accent-blue)',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    cursor: isTyping ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.2s',
                                    opacity: isTyping ? 0.6 : 1
                                }}
                            >
                                {pred}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="chat-input" style={{ paddingTop: '1rem' }}>
                <button className="chat-btn attach-btn" onClick={() => document.querySelector('input[type="file"]').click()}><i className="fa-solid fa-paperclip"></i></button>
                <input
                    type="text"
                    placeholder="Message your agentic mentor..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isTyping}
                />
                <button className="chat-btn send-btn" onClick={handleSend} disabled={isTyping}><i className="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
    );
};

export default Chatbot;
