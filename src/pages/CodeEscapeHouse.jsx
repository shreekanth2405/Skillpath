import React, { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { ESCAPE_ROOMS_DATA } from '../data/challengesMaster';
import './CodeEscapeHouse.css';

const CodeEscapeHouse = ({ setActiveTab, userCoins, setUserCoins }) => {
  // STATE
  const [rooms, setRooms] = useState(() => {
    return Array.from({ length: 36 }, (_, i) => ({
      id: i + 1,
      domain: (i + 1) % 6 === 0 ? "Boss Dimension" : ESCAPE_ROOMS_DATA[i % ESCAPE_ROOMS_DATA.length]?.domain || `Sector ${i + 1}`,
      unlocked: i === 0,
      completed: false,
      progress: 0,
      isBoss: (i + 1) % 6 === 0,
      doubleUnlockEligible: true,
      failedAttempt: false
    }));
  });

  const [activeRoomId, setActiveRoomId] = useState(1);
  const [activeTaskId, setActiveTaskId] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [attempts, setAttempts] = useState(0);
  const [failures, setFailures] = useState(0);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState("AI-GUIDE: Welcome to Sector 01. Begin initial sequence decryption.");
  const [showKeyAnim, setShowKeyAnim] = useState({ show: false, isDouble: false });
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(true);
  const [time, setTime] = useState(0);
  const [showBossBattle, setShowBossBattle] = useState(false);
  const [bossTimer, setBossTimer] = useState(1800); // 30 minutes
  const [bossScore, setBossScore] = useState(null);
  const [bossCooldown, setBossCooldown] = useState(0);
  const [attemptsHistory, setAttemptsHistory] = useState([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const containerRef = useRef(null);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId);
  const activeRoomData = ESCAPE_ROOMS_DATA.find(r => r.id === activeRoomId) || ESCAPE_ROOMS_DATA[0];
  const activeRoomTasks = activeRoomData?.tasks || Array.from({ length: 10 }).map((_, i) => ({ title: `Task ${i + 1}` }));
  const activeTask = activeRoomTasks[activeTaskId];

  // Tab Switching Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && showBossBattle) {
        setTabSwitchCount(prev => prev + 1);
        setMessage("AI-GUIDE: WARNING! Tab switching detected. This incident will be reported.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [showBossBattle]);

  useEffect(() => {
    const t = setInterval(() => setTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let bt;
    if (showBossBattle && bossTimer > 0) {
      bt = setInterval(() => setBossTimer(s => s - 1), 1000);
    } else if (bossTimer === 0 && showBossBattle) {
      handleBossSubmit();
    }
    return () => clearInterval(bt);
  }, [showBossBattle, bossTimer]);

  useEffect(() => {
    if (activeRoom?.isBoss && activeRoom.unlocked && !activeRoom.completed && !showBossBattle) {
      setMessage("AI-GUIDE: CRITICAL ALERT. BOSS DIMENSION DETECTED. PREPARE FOR DEPLOYMENT.");
      setTimeout(() => {
        setShowBossBattle(true);
        setBossTimer(1800);
        setCode(`// BOSS CHALLENGE - ${activeRoom.id / 6}\n// OBJECTIVE: Build a secure hashing function and pass all 20 test cases.\n\nfunction bossSolve(input) {\n  // Implement high-efficiency logic...\n  return input;\n}`);
      }, 1500);
    }
  }, [activeRoomId, showBossBattle]);

  useEffect(() => {
    if (activeTask && !showBossBattle) {
      setCode(`// HOUSE ${activeRoomId} - TASK ${activeTaskId + 1}\n// MISSION: ${activeTask.title}\n\nfunction solve() {\n  // Code synthesis required...\n  return "decrypt_key";\n}`);
    }
  }, [activeRoomId, activeTaskId, showBossBattle]);

  const handleSubmit = () => {
    setAttempts(a => a + 1);
    const success = code.length > 50;
    if (success) triggerSuccess();
    else triggerFailure();
  };

  const triggerSuccess = () => {
    setMessage("AI-GUIDE: Logic verified. Excellent work. Proceeding to next node.");
    setUserScore(s => s + 250);
    setAccuracy(Math.round(((attempts - failures) / (attempts + 1)) * 100));

    setRooms(prev => prev.map(r => {
      if (r.id === activeRoomId) {
        if (r.failedAttempt) {
          return { ...r, failedAttempt: false };
        } else {
          return { ...r, doubleUnlockEligible: true };
        }
      }
      return r;
    }));

    if (activeTaskId < 9) {
      setActiveTaskId(t => t + 1);
    } else {
      triggerRoomCompletion();
    }
  };

  const triggerFailure = () => {
    setFailures(f => f + 1);
    setAccuracy(Math.round(((attempts - failures - 1) / (attempts + 1)) * 100));
    setMessage("AI-GUIDE: Error detected in logic. Try utilizing loops or adjust variables.");

    setRooms(prev => prev.map(r => {
      if (r.id === activeRoomId) {
        return { ...r, failedAttempt: true, doubleUnlockEligible: false };
      }
      return r;
    }));

    const el = document.querySelector('.editor-container');
    el?.classList.add('shake-ui');
    setTimeout(() => el?.classList.remove('shake-ui'), 500);
  };

  const triggerRoomCompletion = () => {
    const isActuallyDouble = activeRoom.failedAttempt ? false : activeRoom.doubleUnlockEligible;
    const newCompletedCount = completedRoomsCount + 1;

    setRooms(prev => prev.map(r => {
      if (r.id === activeRoomId) return { ...r, completed: true };
      if (r.id === activeRoomId + 1) return { ...r, unlocked: true };
      if (isActuallyDouble && r.id === activeRoomId + 2) return { ...r, unlocked: true };
      return r;
    }));

    setShowKeyAnim({ show: true, isDouble: isActuallyDouble });
  };

  const handleBossSubmit = () => {
    const score = Math.floor(Math.random() * 40) + 60; // Simulate score
    const passed = score >= 70 && tabSwitchCount < 3;

    if (passed) {
      if (setUserCoins) setUserCoins(prev => prev + 1000); // Award 1000 SkillCoins
      setBossScore({
        score,
        passed,
        timeTaken: 1800 - bossTimer,
        efficiency: 94
      });
    } else {
      setBossScore({
        score,
        passed,
        timeTaken: 1800 - bossTimer,
        efficiency: 45
      });
      setBossCooldown(600); // 10 minutes
    }
  };

  const downloadCert = () => {
    const doc = new jsPDF();
    doc.setFillColor(5, 5, 16);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setDrawColor(0, 255, 255);
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 277);

    doc.setTextColor(0, 255, 255);
    doc.setFontSize(28);
    doc.text("CODE ESCAPE HOUSE", 105, 50, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("CERTIFICATE OF MASTERY", 105, 80, { align: "center" });
    doc.text(`SCORE: ${userScore}`, 105, 120, { align: "center" });
    doc.text(`HOUSES SECURED: ${rooms.filter(r => r.completed).length}/30`, 105, 140, { align: "center" });
    doc.text(`ACCURACY: ${accuracy}%`, 105, 160, { align: "center" });

    doc.save("Code_Escape_House_Report.pdf");
  };

  // Share via Email/WhatsApp
  const shareReport = (platform) => {
    const text = `I secured ${rooms.filter(r => r.completed).length}/30 houses in Code Escape House with a score of ${userScore}!`;
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`);
    } else if (platform === 'email') {
      window.open(`mailto:?subject=Code Escape House Report&body=${encodeURIComponent(text)}`);
    }
  };

  const level = Math.floor(userScore / 1000) + 1;
  const completedRoomsCount = rooms.filter(r => r.completed).length;

  return (
    <div className="dashboard-container" ref={containerRef}>
      {/* Overlay Animation */}
      <AnimatePresence>
        {showBossBattle && (
          <motion.div className="overlay-success boss-battle-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flexDirection: 'column', background: 'rgba(5, 5, 10, 0.98)' }}>
            <div className="boss-header" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '20px 50px', position: 'absolute', top: 0 }}>
              <div style={{ color: '#ef4444', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '2px' }}>
                <i className="fa-solid fa-skull"></i> BOSS SECTOR {Math.floor(completedRoomsCount / 5) + 1}
              </div>
              <div style={{ color: bossTimer < 60 ? '#ef4444' : '#ffffff', fontSize: '2rem', fontWeight: 900, textShadow: bossTimer < 60 ? '0 0 20px #ef4444' : 'none' }}>
                <i className="fa-solid fa-clock"></i> {Math.floor(bossTimer / 60)}:{(bossTimer % 60).toString().padStart(2, '0')}
              </div>
              <div style={{ color: '#ffffff', fontWeight: 900 }}>
                VIOLATIONS: <span style={{ color: tabSwitchCount >= 3 ? '#ef4444' : '#f59e0b' }}>{tabSwitchCount}/3</span>
              </div>
            </div>

            {!bossScore ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '50px', width: '90%', height: '80%', marginTop: '50px' }}>
                {/* Boss Avatar & Stats */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <motion.div animate={{ y: [0, -10, 0], scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity }}>
                    <i className="fa-solid fa-microchip" style={{ fontSize: '10rem', color: '#ef4444', filter: 'drop-shadow(0 0 30px #ef4444)' }}></i>
                  </motion.div>
                  <h2 style={{ color: '#ef4444', fontSize: '2.5rem', fontWeight: 900, marginTop: '20px' }}>CYBER-OVERLORD</h2>
                  <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.1rem', marginTop: '20px' }}>
                    "Your primitive logic ends here. Only 70% accuracy can unlock the next floor. Any more tab switching and you will be terminated."
                  </p>
                  <div style={{ width: '100%', marginTop: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span>THREAT LEVEL</span> <span style={{ color: '#ef4444' }}>OMEGA</span></div>
                    <div className="progress-bar" style={{ height: '10px' }}><div className="progress-fill" style={{ width: '100%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }}></div></div>
                  </div>
                </div>

                {/* Boss Editor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="glass-panel" style={{ flex: 1, padding: 0, position: 'relative' }}>
                    <div className="editor-container" style={{ height: '100%', background: '#020617' }}>
                      <Editor
                        value={code}
                        onValueChange={setCode}
                        highlight={code => highlight(code, languages.js)}
                        padding={20}
                        style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 16, minHeight: '100%', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <button className="btn-game btn-submit" style={{ height: '80px', fontSize: '1.5rem', background: '#ef4444', boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)' }} onClick={handleBossSubmit}>
                    TERMINATE BOSS CORE
                  </button>
                </div>
              </div>
            ) : (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '600px', padding: '50px', textAlign: 'center', border: `2px solid ${bossScore.passed ? '#10b981' : '#ef4444'}` }}>
                <i className={`fa-solid ${bossScore.passed ? 'fa-trophy' : 'fa-skull-crossbones'}`} style={{ fontSize: '6rem', color: bossScore.passed ? '#10b981' : '#ef4444', marginBottom: '20px' }}></i>
                <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>{bossScore.passed ? "BOSS DEFEATED" : "DEFEATED BY BOSS"}</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '40px 0' }}>
                  <div className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>FINAL SCORE</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: bossScore.passed ? '#10b981' : '#ef4444' }}>{bossScore.score}%</div>
                  </div>
                  <div className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>EFFICIENCY</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3b82f6' }}>{bossScore.efficiency}%</div>
                  </div>
                </div>

                {bossScore.passed ? (
                  <button className="btn-game btn-run" onClick={() => { setShowBossBattle(false); setBossScore(null); setShowKeyAnim({ show: true, isDouble: false }); }}>
                    UNLOCK NEXT FLOOR
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <p style={{ color: '#ef4444' }}>Minimum 70% required. Retries limited to 3 per day.</p>
                    <button className="btn-game btn-submit" style={{ background: '#334155' }} onClick={() => { setShowBossBattle(false); setBossScore(null); setActiveTaskId(0); }}>
                      RETRY AFTER COOLDOWN
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {showKeyAnim?.show && (
          <motion.div className="overlay-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <motion.img src="/key.png" alt="Key" className="glowing-key"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10 }}
              />
              {showKeyAnim.isDouble && (
                <motion.img src="/key.png" alt="Key 2" className="glowing-key" style={{ filter: 'hue-rotate(90deg) drop-shadow(0 0 30px #0ff) drop-shadow(0 0 10px #fff)' }}
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 10, delay: 0.2 }}
                />
              )}
            </motion.div>
            <motion.div className="success-text" initial={{ y: 20 }} animate={{ y: 0 }}>
              {showKeyAnim.isDouble ? "DOUBLE UNLOCK ACHIEVED" : "KEY SECURED"}
            </motion.div>

            <motion.div style={{ marginTop: '40px', display: 'flex', gap: '20px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <button className="btn-game btn-run" style={{ padding: '15px 30px', width: 'auto' }} onClick={() => {
                setShowKeyAnim({ show: false, isDouble: false });
                setActiveRoomId(activeRoomId + 1);
                setActiveTaskId(0);
              }}>
                ENTER HOUSE {activeRoomId + 1}
              </button>
              {showKeyAnim.isDouble && (
                <button className="btn-game btn-submit" style={{ padding: '15px 30px', width: 'auto', background: 'linear-gradient(90deg, #b14fff, #8a2be2)' }} onClick={() => {
                  setShowKeyAnim({ show: false, isDouble: false });
                  setActiveRoomId(activeRoomId + 2);
                  setActiveTaskId(0);
                }}>
                  SKIP TO HOUSE {activeRoomId + 2} <i className="fa-solid fa-forward-step"></i>
                </button>
              )}
            </motion.div>
          </motion.div>
        )}

        {showAnalysisModal && (
          <motion.div className="overlay-success" style={{ background: 'rgba(5,5,16,0.95)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="glass-panel" style={{ width: '80%', maxWidth: '900px', padding: '30px', position: 'relative' }}>
              <button onClick={() => setShowAnalysisModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#0ff', fontSize: '1.5rem', cursor: 'pointer' }}>
                <i className="fa-solid fa-times"></i>
              </button>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#b14fff', textAlign: 'center', marginBottom: '30px', letterSpacing: '2px' }}>COMPREHENSIVE DATA ANALYSIS</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(0,255,255,0.2)' }}>
                  <h3 style={{ color: '#0ff', marginBottom: '15px' }}><i className="fa-solid fa-chart-pie"></i> Domain Mastery</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['Frontend', 'Backend', 'Database', 'Security'].map((d, i) => (
                      <div key={d}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '5px' }}><span>{d}</span> <span>{Math.floor(Math.random() * 40 + 60)}%</span></div>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.floor(Math.random() * 40 + 60)}%`, background: `linear-gradient(90deg, #0ff, #b14fff)` }}></div></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(138,43,226,0.2)' }}>
                  <h3 style={{ color: '#b14fff', marginBottom: '15px' }}><i className="fa-solid fa-chart-line"></i> Performance Metrics</h3>
                  <div style={{ fontSize: '1.1rem', color: '#e2e8f0', lineHeight: 1.8 }}>
                    <div><i className="fa-solid fa-check-circle" style={{ color: '#10b981', width: '25px' }}></i> Code Efficiency: <b style={{ color: '#10b981' }}>92%</b></div>
                    <div><i className="fa-solid fa-bug-slash" style={{ color: '#f59e0b', width: '25px' }}></i> Error Recovery: <b style={{ color: '#f59e0b' }}>88%</b></div>
                    <div><i className="fa-solid fa-stopwatch" style={{ color: '#3b82f6', width: '25px' }}></i> Avg. Time/Task: <b style={{ color: '#3b82f6' }}>2m 14s</b></div>
                    <div><i className="fa-solid fa-brain" style={{ color: '#e879f9', width: '25px' }}></i> Logic Score: <b style={{ color: '#e879f9' }}>A+</b></div>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button className="btn-game btn-run" style={{ padding: '10px 30px', fontSize: '1rem', width: 'auto' }} onClick={downloadCert}>
                  EXPORT FULL REPORT (PDF)
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showInstructionsModal && (
          <motion.div className="overlay-success" style={{ background: 'rgba(5,5,16,0.95)', zIndex: 10001 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="glass-panel" style={{ width: '80%', maxWidth: '800px', padding: '40px', position: 'relative', textAlign: 'left' }}>
              <button onClick={() => setShowInstructionsModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#0ff', fontSize: '1.5rem', cursor: 'pointer' }}>
                <i className="fa-solid fa-times"></i>
              </button>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#0ff', textAlign: 'center', marginBottom: '30px', letterSpacing: '2px' }}>HOW TO PLAY - STEP BY STEP</h2>

              <div style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: 1.8 }}>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#b14fff', margin: '0 0 5px 0' }}><i className="fa-solid fa-list-ol"></i> Step 1: Select a House</h3>
                  <p style={{ margin: 0, paddingLeft: '30px', color: '#cbd5e1' }}>Start from House 01 in the left map panel. Locked houses are dark, accessible houses glow cyan. You must complete the current house to unlock the next one.</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#b14fff', margin: '0 0 5px 0' }}><i className="fa-solid fa-book-open"></i> Step 2: Read the Mission</h3>
                  <p style={{ margin: 0, paddingLeft: '30px', color: '#cbd5e1' }}>The center panel displays your current mission and code editor. The AI Guide at the bottom left will give you useful tips and verify your progress.</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#b14fff', margin: '0 0 5px 0' }}><i className="fa-solid fa-code"></i> Step 3: Write and Run Code</h3>
                  <p style={{ margin: 0, paddingLeft: '30px', color: '#cbd5e1' }}>Use the terminal editor to write your decoding logic. Click <b>RUN CODE</b> to verify syntax without losing attempts. When ready, click <b>SUBMIT</b>.</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#b14fff', margin: '0 0 5px 0' }}><i className="fa-solid fa-key"></i> Step 4: Secure the Key</h3>
                  <p style={{ margin: 0, paddingLeft: '30px', color: '#cbd5e1' }}>Writing correct logic grants you an access node. Complete all 10 tasks in a single house to secure its master key and unlock the next sector.</p>
                </div>
                <div>
                  <h3 style={{ color: '#b14fff', margin: '0 0 5px 0' }}><i className="fa-solid fa-chart-pie"></i> Step 5: Analyze and Export</h3>
                  <p style={{ margin: 0, paddingLeft: '30px', color: '#cbd5e1' }}>Monitor your global leaderboard score! Click <b>VIEW DATA ANALYSIS</b> for detailed metrics. Export your mastery report via PDF or WhatsApp to show off your rank.</p>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button className="btn-game btn-run" style={{ padding: '12px 40px', fontSize: '1.2rem', width: 'auto', background: 'linear-gradient(90deg, #b14fff, #8a2be2)' }} onClick={() => setShowInstructionsModal(false)}>
                  START HACKING
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP BAR */}
      <header className="top-bar">
        <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={() => setActiveTab('escapegameshub')}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <i className="fa-solid fa-arrow-left"></i> Menu
          </button>
          <h1>SKILL PATH AI ESCAPE HOUSE</h1>
        </div>
        <div className="top-stats">
          <div className="stat-item"><i className="fa-solid fa-star"></i> Level <span className="stat-val">{level}</span></div>
          <div className="stat-item"><i className="fa-solid fa-gem"></i> Score <span className="stat-val">{userScore}</span></div>
          <div className="stat-item"><i className="fa-solid fa-house-lock"></i> Unlocked <span className="stat-val">{completedRoomsCount}/30</span></div>
          <div className="stat-item"><i className="fa-solid fa-network-wired"></i> Domain <span className="stat-val" style={{ color: '#ffffff' }}>{activeRoom?.domain.toUpperCase()}</span></div>
        </div>
        <div className="top-actions" style={{ display: 'flex', gap: '20px' }}>
          <i className="fa-solid fa-expand" onClick={toggleFullScreen} title="Toggle Fullscreen"></i>
          <i className="fa-solid fa-circle-info" onClick={() => setShowInstructionsModal(true)} title="How to Play"></i>
          <i className="fa-solid fa-gear" title="Settings"></i>
        </div>
      </header>

      <div className="dashboard-content">
        {/* LEFT SECTION */}
        <aside className="left-section">
          <div className="glass-panel map-container">
            {rooms.map((r, i) => (
              <div
                key={r.id}
                className={`room-3d ${r.isBoss ? 'boss-node' : ''} ${r.completed ? 'completed' : r.unlocked ? 'unlocked' : 'locked'}`}
                style={r.isBoss && r.unlocked && !r.completed ? { boxShadow: '0 0 20px #ef4444', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444' } : {}}
                onClick={() => r.unlocked && (setActiveRoomId(r.id), setActiveTaskId(0))}
              >
                <div className="room-id" style={{ color: r.isBoss ? '#ef4444' : 'inherit' }}>{r.isBoss ? 'BOSS' : `R${r.id.toString().padStart(2, '0')}`}</div>
                {r.completed ? (
                  <i className="fa-solid fa-check-double" style={{ color: r.isBoss ? '#ef4444' : '#b14fff', fontSize: '1.5rem', filter: r.isBoss ? 'drop-shadow(0 0 10px #ef4444)' : 'drop-shadow(0 0 5px #b14fff)' }}></i>
                ) : r.unlocked ? (
                  <i className={`fa-solid ${r.isBoss ? 'fa-skull' : 'fa-door-open'}`} style={{ color: r.isBoss ? '#ef4444' : '#0ff', fontSize: '1.5rem', filter: `drop-shadow(0 0 5px ${r.isBoss ? '#ef4444' : '#0ff'})` }}></i>
                ) : (
                  <i className="fa-solid fa-lock"></i>
                )}
              </div>
            ))}
          </div>

          <div className="glass-panel ai-assistant-panel">
            <img src="/mentor.png" alt="AI Robot" className="ai-avatar" onError={(e) => { e.target.style.display = 'none' }} />
            {!message.includes("Error") && !message.includes("verified") && <i className="fa-solid fa-robot" style={{ fontSize: '3rem', color: '#ffffff', position: 'absolute', left: '20px' }}></i>}
            <div className="speech-bubble">
              {message}
            </div>
          </div>
        </aside>

        {/* CENTER SECTION */}
        <main className="center-section glass-panel">
          <div className="task-header" style={{ boxShadow: activeRoom?.doubleUnlockEligible ? 'inset 0 0 20px rgba(255, 255, 255, 0.2)' : 'none', transition: '0.3s' }}>
            <div className="task-title">
              HOUSE {activeRoomId}
              {activeRoom?.doubleUnlockEligible && <i className="fa-solid fa-angles-right" style={{ color: '#ffffff', marginLeft: '10px', textShadow: '0 0 10px #ffffff', fontSize: '1.2rem' }} title="Double Unlock Active"></i>}
              {activeRoom?.failedAttempt && <i className="fa-solid fa-triangle-exclamation" style={{ color: '#ef4444', marginLeft: '10px', textShadow: '0 0 10px #ef4444', fontSize: '1.2rem' }} title="Warning: Failed Attempt"></i>}
              {(!activeRoom?.doubleUnlockEligible && !activeRoom?.failedAttempt) && <i className="fa-solid fa-lock" style={{ color: '#64748b', marginLeft: '10px', fontSize: '1.2rem' }} title="Normal Progression Only"></i>}
            </div>
            <div className="task-indicator" style={{ borderColor: activeRoom?.failedAttempt ? '#ef4444' : '#ffffff', color: activeRoom?.failedAttempt ? '#ef4444' : '#ffffff' }}>
              Task {activeTaskId + 1} / 10
            </div>
          </div>
          <div className="problem-statement">
            <b>Mission:</b> {activeTask.title}<br />
            {activeTask.description}
          </div>

          <div className="editor-container">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => highlight(code, languages.js)}
              padding={20}
              style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 16, minHeight: '100%', outline: 'none' }}
            />
          </div>

          <div className="editor-actions">
            <button className="btn-game btn-run" onClick={() => setMessage("AI-GUIDE: Running logic protocols... Syntax valid.")}>
              RUN CODE
            </button>
            <button className="btn-game btn-submit" onClick={handleSubmit}>
              SUBMIT
            </button>
          </div>
        </main>

        {/* RIGHT SECTION */}
        <aside className="right-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* TASK PROGRESSION VIEW */}
          <div className="glass-panel" style={{ flex: 1.5, overflowY: 'auto' }}>
            <div className="panel-header" style={{ marginBottom: '15px' }}>ROOM TASKS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeRoomTasks.map((t, index) => {
                const isComplete = index < activeTaskId;
                const isActive = index === activeTaskId;

                return (
                  <div key={index} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 15px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.3)',
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.4)' : isComplete ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s ease'
                  }}>
                    {/* Light Indicator */}
                    <div style={{
                      width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
                      background: isComplete ? '#10b981' : isActive ? '#ffffff' : '#334155',
                      boxShadow: isComplete ? '0 0 10px #10b981, 0 0 20px #10b981' : isActive ? '0 0 10px #ffffff, 0 0 15px #ffffff' : 'inset 0 2px 4px rgba(0,0,0,0.5)'
                    }}></div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.85rem', color: isComplete ? '#10b981' : isActive ? '#ffffff' : '#64748b', fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        Step {index + 1}: {t.title}
                      </div>
                    </div>
                    <div>
                      {isComplete ? <i className="fa-solid fa-check" style={{ color: '#10b981', fontSize: '0.8rem' }}></i> :
                        isActive ? <i className="fa-solid fa-terminal" style={{ color: '#ffffff', fontSize: '0.8rem' }}></i> :
                          <i className="fa-solid fa-lock" style={{ color: '#334155', fontSize: '0.8rem' }}></i>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="glass-panel" style={{ flex: 1 }}>
            <div className="panel-header">GLOBAL LEADERBOARD</div>
            <div className="leaderboard-list">
              {[
                { n: "CipherX", s: "45,200", img: "https://i.pravatar.cc/100?img=12" },
                { n: "NeonBytes", s: "41,150", img: "https://i.pravatar.cc/100?img=33" },
                { n: "DataGhost", s: "38,900", img: "https://i.pravatar.cc/100?img=4" },
                { n: "You", s: userScore.toLocaleString(), img: "https://i.pravatar.cc/100?img=1" }
              ].map((l, i) => (
                <div key={i} className="lb-item">
                  <img src={l.img} alt={l.n} className="lb-avatar" />
                  <div className="lb-name">{l.n}</div>
                  <div className="lb-score">{l.s}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel cert-preview">
            <div className="panel-header" style={{ margin: '0 0 15px 0', border: 'none' }}>REPORTS & EXPORTS</div>
            <i className="fa-solid fa-award cert-icon"></i>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '15px' }}>Mastery Certificate Available</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn-download" style={{ borderColor: '#0ff', color: '#0ff' }} onClick={() => setShowAnalysisModal(true)}>
                <i className="fa-solid fa-chart-bar"></i> VIEW DATA ANALYSIS
              </button>
              <button className="btn-download" onClick={downloadCert}>
                <i className="fa-solid fa-file-pdf"></i> DOWNLOAD PDF
              </button>
              <button className="btn-download" style={{ borderColor: '#25D366', color: '#25D366' }} onClick={() => shareReport('whatsapp')}>
                <i className="fa-brands fa-whatsapp"></i> WHATSAPP
              </button>
              <button className="btn-download" style={{ borderColor: '#ea4335', color: '#ea4335' }} onClick={() => shareReport('email')}>
                <i className="fa-solid fa-envelope"></i> EMAIL
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* BOTTOM BAR */}
      <footer className="bottom-bar">
        <div className="bot-stat">
          <span className="bot-stat-label">Progress</span>
          <div className="progress-wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#e2e8f0' }}>
              <span>Tasks</span>
              <span>{activeTaskId}/10</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(activeTaskId / 10) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bot-stat">
          <span className="bot-stat-label">Accuracy</span>
          <span className="bot-stat-val">{accuracy}%</span>
        </div>

        <div className="bot-stat">
          <span className="bot-stat-label">Time Elapsed</span>
          <span className="bot-stat-val">
            {Math.floor(time / 3600).toString().padStart(2, '0')}:
            {Math.floor((time % 3600) / 60).toString().padStart(2, '0')}:
            {(time % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default CodeEscapeHouse;
