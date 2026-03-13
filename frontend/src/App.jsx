import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { genAI, skillPathSystemInstruction } from './services/gemini';

// Components
import Header from './components/Header';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import HabitTracker from './pages/HabitTracker';
import EscapeChallenge from './pages/EscapeChallenge';
import CodeEscapeHouse from './pages/CodeEscapeHouse';
import EscapeGamesHub from './pages/EscapeGamesHub';
import AISurvivalClimb from './pages/AISurvivalClimb';
import SkillPaths from './pages/SkillPaths';
import Chatbot from './pages/Chatbot';
import TestSystem from './pages/TestSystem';
import Analytics from './pages/Analytics';

import Resume from './pages/Resume';
import EnglishLearning from './pages/EnglishLearning';
import CareerRoadmap from './pages/CareerRoadmap';
import JobTracker from './pages/JobTracker';
import CommunicationAssistant from './pages/CommunicationAssistant';
import CareerGenie from './pages/CareerGenie';
import CertificationHub from './pages/CertificationHub';
import ELearningSession from './pages/ELearningSession';
import MultiplayerArena from './pages/MultiplayerArena';

// NEW HUBS
import GamesHub from './pages/GamesHub';
import CommunicationHub from './pages/CommunicationHub';
import LearningHub from './pages/LearningHub';
import CareerHub from './pages/CareerHub';

import CodeReviewer from './pages/CodeReviewer';
import CommunityHub from './pages/CommunityHub';
import PracticalHub from './pages/PracticalHub';
import TrendingSection from './pages/TrendingSection';
import AiRecommendations from './pages/AiRecommendations';
import TrendingSkills from './pages/TrendingSkills';
import CareerAlerts from './pages/CareerAlerts';
import SalaryInsights from './pages/SalaryInsights';
import AiConfidenceScore from './pages/AiConfidenceScore';
import NotificationHub from './pages/NotificationHub';
import NotificationSettings from './pages/NotificationSettings';
import RiskStabilityIntelligence from './pages/RiskStabilityIntelligence';
import MarketVulnerability from './pages/MarketVulnerability';
import EventHub from './pages/EventHub';
import QuizGame from './pages/QuizGame';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import BookReader from './pages/BookReader';
import SolarSystem from './pages/SolarSystem';
import UrbanWarzone from './pages/UrbanWarzone';
// import Labs from './pages/Labs';
// import LabRoom from './pages/LabRoom';

function MainApp() {
  const navigate = useNavigate();
  const location = useLocation();

  // AUTH STATE
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });

  // Gamification Global State
  const [user, setUser] = useState(null);
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [userCoins, setUserCoins] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('auth', 'true');
    } else {
      localStorage.removeItem('auth');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [isAuthenticated]);

  // SYNC USER DATA FROM BACKEND
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (token && isAuthenticated) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (data.success) {
            const userData = data.data;
            setUser(userData);
            setUserXP(userData.xp || 0);
            setUserLevel(userData.level || 1);
            setUserCoins(userData.coins || 0);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (err) {
          console.error("Failed to fetch user profile", err);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  const activeTab = location.pathname.substring(1) || 'dashboard';

  const setActiveTab = (tabId) => {
    navigate(`/${tabId}`);
  };

  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // RAG Context Reference
  const knowledgeBaseRef = useRef("");
  const [isUploading, setIsUploading] = useState(false);

  const [chatLog, setChatLog] = useState([
    {
      type: 'ai',
      isDetailed: true,
      content: "Hello! I am your AI Career Master Mentor. I can guide you through 1000+ courses across 20 departments. Let's build your future!"
    }
  ]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      knowledgeBaseRef.current = event.target.result;
      setIsUploading(false);
      alert("Knowledge Base Updated! AI will now prioritize this context.");
    };
    reader.readAsText(file);
  };

  const handleVoiceToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const recognition = new SpeechRecognition();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMsg = { type: 'user', content: inputText };
    setChatLog(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: skillPathSystemInstruction
      });

      const context = knowledgeBaseRef.current ? `\n\nKNOWLEDGE BASE CONTEXT:\n${knowledgeBaseRef.current}` : "";
      const result = await model.generateContent(inputText + context);
      const response = await result.response;
      const text = response.text();

      setChatLog(prev => [...prev, { type: 'ai', content: text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setChatLog(prev => [...prev, { type: 'ai', content: "I've encountered a neural glitch. Please check your API key or connection." }]);
    } finally {
      setIsTyping(false);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleQuerySubmit = (query) => {
    setInputText(query);
    // Auto-trigger send if needed, but here we just fill it
  };


  const ProtectedLayout = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          setIsAuthenticated={setIsAuthenticated}
          userXP={userXP}
          userLevel={userLevel}
          userCoins={userCoins}
          isRecording={isRecording}
          handleVoiceToggle={handleVoiceToggle}
          isUploading={isUploading}
          handleFileUpload={handleFileUpload}
          knowledgeBaseRef={knowledgeBaseRef}
        />
        <main>{children}</main>
      </div>
    );
  };

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login setAuth={setIsAuthenticated} />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register setAuth={setIsAuthenticated} />} />

      {/* PROTECTED ROUTES */}
      <Route path="/dashboard" element={<ProtectedLayout><Dashboard setActiveTab={setActiveTab} userXP={userXP} userLevel={userLevel} userCoins={userCoins} user={user} /></ProtectedLayout>} />
      <Route path="/profile" element={<ProtectedLayout><Profile userXP={userXP} userLevel={userLevel} user={user} /></ProtectedLayout>} />
      <Route path="/habittracker" element={<ProtectedLayout><HabitTracker userXP={userXP} userLevel={userLevel} setActiveTab={setActiveTab} /></ProtectedLayout>} />

      {/* ---------- NEW HUBS ---------- */}
      <Route path="/games" element={<ProtectedLayout><GamesHub setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/communicationhub" element={<ProtectedLayout><CommunicationHub setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/learning" element={<ProtectedLayout><LearningHub setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/career" element={<ProtectedLayout><CareerHub setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/resources" element={<ProtectedLayout><Resources /></ProtectedLayout>} />
      <Route path="/book-reader" element={<ProtectedLayout><BookReader /></ProtectedLayout>} />
      <Route path="/contact" element={<ProtectedLayout><Contact /></ProtectedLayout>} />

      <Route path="/games/code-escape" element={<ProtectedLayout><CodeEscapeHouse setActiveTab={setActiveTab} userCoins={userCoins} setUserCoins={setUserCoins} /></ProtectedLayout>} />
      <Route path="/games/survival" element={<ProtectedLayout><AISurvivalClimb /></ProtectedLayout>} />
      <Route path="/games/quiz" element={<ProtectedLayout><QuizGame /></ProtectedLayout>} />
      <Route path="/games/solar" element={<ProtectedLayout><SolarSystem /></ProtectedLayout>} />
      <Route path="/games/urban" element={<ProtectedLayout><UrbanWarzone /></ProtectedLayout>} />

      <Route path="/learning/paths" element={<ProtectedLayout><SkillPaths /></ProtectedLayout>} />
      <Route path="/learning/chatbot" element={<ProtectedLayout><Chatbot
        chatLog={chatLog}
        isTyping={isTyping}
        inputText={inputText}
        setInputText={setInputText}
        handleKeyPress={handleKeyPress}
        handleSend={handleSend}
        chatBottomRef={chatBottomRef}
        knowledgeBaseRef={knowledgeBaseRef}
        handleQuerySubmit={handleQuerySubmit}
      /></ProtectedLayout>} />
      {/*
      <Route path="/learning/labs" element={<ProtectedLayout><Labs setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/labs/:id" element={<ProtectedLayout><LabRoom /></ProtectedLayout>} />
      */}
      <Route path="/learning/sessions" element={<ProtectedLayout><ELearningSession /></ProtectedLayout>} />
      <Route path="/learning/assessments" element={<ProtectedLayout><TestSystem /></ProtectedLayout>} />
      <Route path="/learning/reviews" element={<ProtectedLayout><CodeReviewer /></ProtectedLayout>} />

      <Route path="/career/roadmap" element={<ProtectedLayout><CareerRoadmap /></ProtectedLayout>} />
      <Route path="/career/jobs" element={<ProtectedLayout><JobTracker /></ProtectedLayout>} />
      <Route path="/career/resume" element={<ProtectedLayout><Resume /></ProtectedLayout>} />
      <Route path="/career/genie" element={<ProtectedLayout><CareerGenie /></ProtectedLayout>} />
      <Route path="/career/alerts" element={<ProtectedLayout><CareerAlerts /></ProtectedLayout>} />
      <Route path="/career/salary" element={<ProtectedLayout><SalaryInsights /></ProtectedLayout>} />

      <Route path="/communication/english" element={<ProtectedLayout><EnglishLearning /></ProtectedLayout>} />
      <Route path="/communication/assistant" element={<ProtectedLayout><CommunicationAssistant /></ProtectedLayout>} />
      <Route path="/comm-arena" element={<ProtectedLayout><MultiplayerArena /></ProtectedLayout>} />

      <Route path="/community" element={<ProtectedLayout><CommunityHub /></ProtectedLayout>} />
      <Route path="/trending" element={<ProtectedLayout><TrendingSection /></ProtectedLayout>} />
      <Route path="/trending-skills" element={<ProtectedLayout><TrendingSkills /></ProtectedLayout>} />
      <Route path="/notifications" element={<ProtectedLayout><NotificationHub /></ProtectedLayout>} />
      <Route path="/notifications/settings" element={<ProtectedLayout><NotificationSettings /></ProtectedLayout>} />
      <Route path="/analytics" element={<ProtectedLayout><Analytics /></ProtectedLayout>} />
      <Route path="/risk-stability" element={<ProtectedLayout><RiskStabilityIntelligence /></ProtectedLayout>} />
      <Route path="/market-vulnerability" element={<ProtectedLayout><MarketVulnerability /></ProtectedLayout>} />
      <Route path="/events" element={<ProtectedLayout><EventHub /></ProtectedLayout>} />
      <Route path="/ai-confidence" element={<ProtectedLayout><AiConfidenceScore /></ProtectedLayout>} />
      <Route path="/practical" element={<ProtectedLayout><PracticalHub /></ProtectedLayout>} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

export default App;
