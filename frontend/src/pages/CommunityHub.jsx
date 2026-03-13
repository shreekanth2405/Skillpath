import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-Components ---

const FollowButton = ({ status: initialStatus = 'Follow' }) => {
    const [status, setStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        if (status === 'Following' || status === 'Connected') return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            if (status === 'Follow') setStatus('Following');
            if (status === 'Connect') setStatus('Requested');
        }, 800);
    };

    const getBtnStyles = () => {
        switch (status) {
            case 'Following': return { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
            case 'Requested': return { background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' };
            case 'Connected': return { background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' };
            default: return { background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none' };
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            disabled={isLoading}
            style={{
                padding: '8px 16px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: '0.3s',
                ...getBtnStyles()
            }}
        >
            {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
                <>
                    <i className={`fa-solid ${status === 'Following' ? 'fa-check' : status === 'Requested' ? 'fa-clock' : status === 'Connected' ? 'fa-user-check' : 'fa-plus'}`}></i>
                    {status}
                </>
            )}
        </motion.button>
    );
};

const ProfileCard = ({ user }) => (
    <motion.div
        whileHover={{ y: -5 }}
        style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
        }}
    >
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <img src={user.avatar} alt={user.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #eff6ff' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '15px', height: '15px', background: '#10b981', borderRadius: '50%', border: '2px solid white' }}></div>
        </div>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800 }}>{user.name}</h4>
        <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{user.role}</p>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
            {user.skills.map(skill => (
                <span key={skill} style={{ padding: '4px 10px', background: '#eff6ff', color: '#3b82f6', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700 }}>{skill}</span>
            ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '12px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: '1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            <div>
                <b style={{ color: '#1e293b', display: 'block' }}>{user.connections}</b>
                Connections
            </div>
            <div>
                <b style={{ color: '#1e293b', display: 'block' }}>{user.experience}</b>
                Level
            </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <FollowButton status={user.isConnection ? 'Connected' : 'Connect'} />
            <button style={{ flex: 1, padding: '8px', borderRadius: '12px', background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>
                <i className="fa-regular fa-envelope"></i>
            </button>
        </div>
    </motion.div>
);

const PostCard = ({ post }) => {
    const [likes, setLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                border: '1px solid #f1f5f9',
                marginBottom: '1.5rem'
            }}
        >
            {/* Post Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <img src={post.userAvatar} alt={post.userName} style={{ width: '45px', height: '45px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{post.userName}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
                            <span>{post.timestamp}</span>
                            <span>•</span>
                            <span style={{ color: '#3b82f6', fontWeight: 700 }}>#{post.tag}</span>
                            {post.aiRecommended && (
                                <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '100px', fontWeight: 800, fontSize: '0.65rem' }}>
                                    <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: '4px' }}></i> AI Recommended
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><i className="fa-solid fa-ellipsis-vertical"></i></button>
            </div>

            {/* Post Content */}
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: '#1e293b' }}>{post.title}</h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>{post.content}</p>

            {/* Interactions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <button
                        onClick={() => { setIsLiked(!isLiked); setLikes(isLiked ? likes - 1 : likes + 1); }}
                        style={{ background: 'transparent', border: 'none', color: isLiked ? '#ef4444' : '#64748b', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i> {likes}
                    </button>
                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-regular fa-comment"></i> {post.comments}
                    </button>
                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-solid fa-share-nodes"></i> Share
                    </button>
                </div>
                <button style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                    <i className="fa-regular fa-bookmark"></i>
                </button>
            </div>

            {/* Comment Preview */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>S</div>
                <div style={{ flex: 1, position: 'relative' }}>
                    <input type="text" placeholder="Add a comment..." style={{ width: '100%', padding: '10px 15px', borderRadius: '12px', border: '1px solid #f1f5f9', background: '#f8fafc', fontSize: '0.9rem', outline: 'none' }} />
                    <i className="fa-regular fa-face-smile" style={{ position: 'absolute', right: '15px', top: '10px', color: '#94a3b8' }}></i>
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Page Component ---

const CommunityHub = () => {
    const [activeNav, setActiveNav] = useState('Home');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', tag: 'General' });

    const navItems = [
        { name: 'Home', icon: 'fa-house' },
        { name: 'Explore', icon: 'fa-compass' },
        { name: 'Q&A', icon: 'fa-circle-question' },
        { name: 'Trending', icon: 'fa-fire' },
        { name: 'Saved', icon: 'fa-bookmark' },
        { name: 'Profile', icon: 'fa-user' }
    ];

    const trendingTopics = [
        { tag: 'AI_Safety', posts: '1.2k', growth: '+15%' },
        { tag: 'NextJS_15', posts: '850', growth: '+22%' },
        { tag: 'RemoteWorkTips', posts: '2.1k', growth: '+5%' },
        { tag: 'SystemDesign', posts: '4k', growth: '+10%' }
    ];

    const suggestedUsers = [
        { name: 'Sarah Drasner', role: 'Staff Engineer', avatar: 'https://i.pravatar.cc/150?u=sarah', skills: ['Vue', 'Design Systems'], connections: 450, experience: 'Lvl 45', isConnection: false },
        { name: 'Dan Abramov', role: 'Senior Dev', avatar: 'https://i.pravatar.cc/150?u=dan', skills: ['React', 'Compiler'], connections: 890, experience: 'Lvl 99', isConnection: true }
    ];

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/community/posts`);
            const data = await res.json();
            if (data.success) {
                setPosts(data.data.map(p => ({
                    id: p.id,
                    userName: p.user.name,
                    userAvatar: `https://ui-avatars.com/api/?name=${p.user.name}&background=random`,
                    timestamp: new Date(p.createdAt).toLocaleDateString(),
                    tag: p.tag || 'General',
                    title: p.title,
                    content: p.content,
                    likes: p.likes,
                    comments: p._count.comments,
                    aiRecommended: p.likes > 10
                })));
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        try {
            const auth = JSON.parse(localStorage.getItem('auth'));
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/community/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                body: JSON.stringify(newPost)
            });
            const data = await res.json();
            if (data.success) {
                setShowCreateModal(false);
                setNewPost({ title: '', content: '', tag: 'General' });
                fetchPosts();
            }
        } catch (err) {
            console.error("Error creating post:", err);
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem', fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '260px 1fr 350px', gap: '2rem' }}>

                {/* 1. Left Sidebar */}
                <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
                    <div style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem', paddingLeft: '8px' }}>
                            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <i className="fa-solid fa-users"></i>
                            </div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: '#1e293b' }}>Hub</h2>
                        </div>

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {navItems.map(item => (
                                <motion.div
                                    key={item.name}
                                    whileHover={{ x: 5 }}
                                    onClick={() => setActiveNav(item.name)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                        fontSize: '0.95rem',
                                        color: activeNav === item.name ? '#3b82f6' : '#64748b',
                                        background: activeNav === item.name ? '#eff6ff' : 'transparent',
                                        transition: '0.3s'
                                    }}
                                >
                                    <i className={`fa-solid ${item.icon}`}></i>
                                    {item.name}
                                </motion.div>
                            ))}
                        </nav>

                        <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, margin: '0 0 10px 0' }}>PREMIUM HUB</p>
                            <h4 style={{ fontSize: '0.9rem', margin: '0 0 10px 0' }}>Join Career Pro</h4>
                            <button style={{ width: '100%', padding: '10px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}>Upgrade Now</button>
                        </div>
                    </div>
                </div>

                {/* 2. Center Feed */}
                <div style={{ paddingBottom: '5rem' }}>
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b' }}>Skill Path AI Community Feed</h1>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                                onClick={() => setShowCreateModal(true)}
                                className="hover-3d" 
                                style={{ padding: '10px 24px', borderRadius: '12px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 10px rgba(59,130,246,0.3)', transition: '0.3s' }}
                            >
                                <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> Create Post
                            </button>
                        </div>
                    </div>

                    {/* Join Communities */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="hover-3d glass-panel" style={{ background: '#5865F2', color: 'white', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 10px 15px -3px rgba(88,101,242,0.3)' }}>
                            <div style={{ fontSize: '2rem' }}><i className="fa-brands fa-discord"></i></div>
                            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Discord Hub</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Join our 10k+ active developers.</p>
                            <button style={{ marginTop: 'auto', background: 'white', color: '#5865F2', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>Join Server</button>
                        </div>
                        <div className="hover-3d glass-panel" style={{ background: '#0A66C2', color: 'white', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 10px 15px -3px rgba(10,102,194,0.3)' }}>
                            <div style={{ fontSize: '2rem' }}><i className="fa-brands fa-linkedin"></i></div>
                            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>LinkedIn Network</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Connect with alumni & recruiters.</p>
                            <button style={{ marginTop: 'auto', background: 'white', color: '#0A66C2', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>Follow Page</button>
                        </div>
                        <div className="hover-3d glass-panel" style={{ background: '#0088cc', color: 'white', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 10px 15px -3px rgba(0,136,204,0.3)' }}>
                            <div style={{ fontSize: '2rem' }}><i className="fa-brands fa-telegram"></i></div>
                            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Telegram Channel</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Get instant premium updates.</p>
                            <button style={{ marginTop: 'auto', background: 'white', color: '#0088cc', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>Coming Soon</button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '10px' }}>
                        {['All Posts', 'Discussions', 'Resources', 'Q&A', 'Jobs', 'Events'].map((filter, i) => (
                            <button key={i} style={{ padding: '8px 20px', borderRadius: '100px', background: i === 0 ? '#3b82f6' : 'white', color: i === 0 ? 'white' : '#64748b', border: '1px solid #f1f5f9', fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer' }}>{filter}</button>
                        ))}
                    </div>

                    {posts.map((post, i) => (
                        <PostCard key={i} post={post} />
                    ))}

                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.5rem', marginBottom: '10px' }}></i>
                        <p style={{ fontWeight: 700 }}>Loading more discussions...</p>
                    </div>
                </div>

                {/* 3. Right Panel */}
                <div style={{ position: 'sticky', top: '2rem', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Trending Topics */}
                    <div style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fa-solid fa-bolt" style={{ color: '#f59e0b' }}></i> Trending Topics
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {trendingTopics.map(topic => (
                                <motion.div whileHover={{ scale: 1.02 }} key={topic.tag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '12px', cursor: 'pointer' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>#{topic.tag}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{topic.posts} posts</div>
                                    </div>
                                    <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 800 }}>{topic.growth}</div>
                                </motion.div>
                            ))}
                        </div>
                        <button style={{ width: '100%', marginTop: '1.5rem', background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 800, fontSize: '0.85rem' }}>See All Trends</button>
                    </div>

                    {/* Suggested Connections */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fa-solid fa-users-rays" style={{ color: '#8b5cf6' }}></i> Suggested Experts
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {suggestedUsers.map((user, i) => (
                                <ProfileCard key={i} user={user} />
                            ))}
                        </div>
                    </div>

                </div>

            </div>
            {/* Create Post Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Create Community Post</h2>
                                <button onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <input 
                                    type="text" 
                                    placeholder="Catchy Title" 
                                    value={newPost.title}
                                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                                />
                                <select 
                                    value={newPost.tag}
                                    onChange={e => setNewPost({...newPost, tag: e.target.value})}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', background: 'white' }}
                                >
                                    <option>General</option>
                                    <option>CareerAdvice</option>
                                    <option>TechStack</option>
                                    <option>Q&A</option>
                                    <option>Showcase</option>
                                </select>
                                <textarea 
                                    placeholder="What's on your mind? Use #tags to categorize..." 
                                    rows={6}
                                    value={newPost.content}
                                    onChange={e => setNewPost({...newPost, content: e.target.value})}
                                    style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', resize: 'vertical' }}
                                />
                                <button 
                                    onClick={handleCreatePost}
                                    disabled={!newPost.title || !newPost.content}
                                    style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}
                                >
                                    Share with Community
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CommunityHub;
