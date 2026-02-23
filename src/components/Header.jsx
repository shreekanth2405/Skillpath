import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ setActiveTab, isRecording, handleVoiceToggle, setIsAuthenticated }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    const profileMenuRef = useRef(null);
    const notificationsRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleGlobalFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.error(err));
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth');
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            background: 'white',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '2rem',
            position: 'relative',
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', minWidth: '300px' }}>
                <i className="fa-solid fa-search" style={{ color: '#94a3b8', marginRight: '10px' }}></i>
                <input type="text" placeholder="Search knowledge base, paths, or users..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#0f172a' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={toggleGlobalFullscreen}
                    title="Toggle Fullscreen"
                    style={{ background: isFullscreen ? 'rgba(59, 130, 246, 0.1)' : 'transparent', color: isFullscreen ? '#3b82f6' : '#64748b', border: 'none', width: '40px', height: '40px', borderRadius: '10px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                </button>

                {/* Notifications Dropdown */}
                <div style={{ position: 'relative' }} ref={notificationsRef}>
                    <button
                        onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                        title="Notifications"
                        style={{ background: showNotifications ? '#f1f5f9' : 'transparent', color: '#64748b', border: 'none', width: '40px', height: '40px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
                    >
                        <i className="fa-solid fa-bell"></i>
                        <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
                    </button>
                    {showNotifications && (
                        <div className="glass-panel slide-down" style={{ position: 'absolute', top: '50px', right: '-60px', width: '380px', background: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 1000, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.8rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem', fontWeight: 800 }}>Notifications</h4>
                                    <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>3 New</span>
                                </div>
                                <button style={{ border: 'none', background: 'transparent', color: '#3b82f6', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 700, transition: '0.2s', padding: '4px 8px', borderRadius: '6px' }} onMouseOver={e => e.target.style.background = '#eff6ff'} onMouseOut={e => e.target.style.background = 'transparent'}><i className="fa-solid fa-check-double" style={{ marginRight: '4px' }}></i> Mark all read</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                                {/* Category: Learning */}
                                <div className="hover-3d" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '12px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #3b82f6', cursor: 'pointer', transition: '0.2s' }}>
                                    <div style={{ width: '35px', height: '35px', borderRadius: '10px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}><i className="fa-solid fa-book-open-reader"></i></div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a', fontWeight: 800 }}>Learning Milestone</p>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Complete your React Masterclass to earn the Golden Badge.</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>2 hours ago</p>
                                    </div>
                                </div>

                                {/* Category: Community */}
                                <div className="hover-3d" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '12px', background: 'white', borderRadius: '12px', borderLeft: '4px solid #ec4899', cursor: 'pointer', transition: '0.2s' }}>
                                    <div style={{ width: '35px', height: '35px', borderRadius: '10px', background: '#fdf2f8', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}><i className="fa-solid fa-people-group"></i></div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a', fontWeight: 800 }}>Community Mention</p>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Alex River replied to your post in System Design.</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>5 hours ago</p>
                                    </div>
                                </div>

                                {/* Category: Books */}
                                <div className="hover-3d" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '12px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #10b981', cursor: 'pointer', transition: '0.2s' }}>
                                    <div style={{ width: '35px', height: '35px', borderRadius: '10px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}><i className="fa-solid fa-swatchbook"></i></div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a', fontWeight: 800 }}>Library Suggestion</p>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Based on your reading, we suggest "Clean Architecture".</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>1 day ago</p>
                                    </div>
                                </div>

                                {/* Category: Games */}
                                <div className="hover-3d" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '12px', background: 'white', borderRadius: '12px', borderLeft: '4px solid #f59e0b', cursor: 'pointer', transition: '0.2s' }}>
                                    <div style={{ width: '35px', height: '35px', borderRadius: '10px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}><i className="fa-solid fa-gamepad"></i></div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a', fontWeight: 800 }}>Game Challenge</p>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Your high score in Prompt Game was beaten by User45.</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>2 days ago</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '1rem', paddingTop: '0.8rem', textAlign: 'center' }}>
                                <button style={{ border: 'none', background: 'transparent', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 800, transition: '0.2s' }} onMouseOver={e => e.target.style.color = '#0f172a'} onMouseOut={e => e.target.style.color = '#64748b'}>View all notifications <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px', fontSize: '0.75rem' }}></i></button>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleVoiceToggle}
                    title="Voice Commands"
                    style={{ background: isRecording ? '#ef4444' : 'rgba(139, 92, 246, 0.1)', color: isRecording ? 'white' : '#8b5cf6', border: 'none', width: '40px', height: '40px', borderRadius: '10px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <i className={`fa-solid ${isRecording ? 'fa-stop fa-beat' : 'fa-microphone'}`}></i>
                </button>

                {/* Profile Dropdown */}
                <div style={{ position: 'relative' }} ref={profileMenuRef}>
                    <div
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '1rem', borderLeft: '1px solid #e2e8f0' }}
                        onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                    >
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Shreyas</span>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Pro Member</span>
                        </div>
                        <img src="https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff&rounded=true" alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
                    </div>

                    {showProfileMenu && (
                        <div className="glass-panel slide-down" style={{ position: 'absolute', top: '55px', right: '0', width: '220px', background: 'white', padding: '0.5rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                            <button className="dropdown-item" onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }} style={dropdownItemStyle}>
                                <i className="fa-regular fa-user" style={iconStyle}></i> View Profile
                            </button>
                            <button className="dropdown-item" onClick={() => setShowProfileMenu(false)} style={dropdownItemStyle}>
                                <i className="fa-solid fa-gear" style={iconStyle}></i> Settings
                            </button>
                            <button className="dropdown-item" onClick={() => setShowProfileMenu(false)} style={dropdownItemStyle}>
                                <i className="fa-regular fa-credit-card" style={iconStyle}></i> Subscription
                            </button>
                            <div style={{ height: '1px', background: '#e2e8f0', margin: '0.5rem 0' }}></div>
                            <button className="dropdown-item" onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#ef4444' }}>
                                <i className="fa-solid fa-arrow-right-from-bracket" style={{ ...iconStyle, color: '#ef4444' }}></i> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const dropdownItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#0f172a',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: '0.2s',
};

const iconStyle = {
    marginRight: '10px',
    color: '#64748b',
    width: '16px',
    textAlign: 'center'
};

export default Header;
