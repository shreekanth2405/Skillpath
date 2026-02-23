import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { genAI, skillPathSystemInstruction } from './services/gemini';

// Components
import Sidebar from './components/Sidebar';
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
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import BookReader from './pages/BookReader';

function MainApp() {
  const navigate = useNavigate();
  const location = useLocation();

  // AUTH STATE
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('auth', 'true');
    }
  }, [isAuthenticated]);

  const activeTab = location.pathname.substring(1) || 'dashboard';

  const setActiveTab = (tabId) => {
    navigate(`/${tabId}`);
  };

  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Gamification Global State
  const [userXP, setUserXP] = useState(2450);
  const [userLevel, setUserLevel] = useState(3);
  const [userCoins, setUserCoins] = useState(1500);

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

  // Persistent Google Generative AI Session Chat reference
  const chatInstance = useRef(null);

  useEffect(() => {
    // Initialize the Gemini Chat Session
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: skillPathSystemInstruction,
    });
    chatInstance.current = model.startChat({
      history: [],
    });
  }, []);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setInputText("Hey Skill Path AI, what are React Hooks?");
        setTimeout(() => {
          setIsRecording(false);
          setInputText("");
          handleQuerySubmit("Hey Skill Path AI, what are React Hooks?");
        }, 1000);
      }, 1500);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      knowledgeBaseRef.current = evt.target.result;
      setChatLog(prev => [...prev, {
        type: 'ai',
        content: `**Knowledge Base Loaded!** I have ingested \`${file.name}\`. It is now active in my RAG context context. You can now prompt me questions about it.`
      }]);
      setIsUploading(false);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  const handleSend = () => {
    if (!inputText.trim()) return;
    handleQuerySubmit(inputText);
    setInputText('');
  };

  const handleQuerySubmit = async (queryText) => {
    const userMsg = { type: 'user', content: queryText };
    setChatLog(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Auto-navigate to chatbot if querying from another page
    if (activeTab !== 'chatbot') {
      setActiveTab('chatbot');
    }

    try {
      let prompt = queryText;
      if (knowledgeBaseRef.current) {
        prompt = `[SYSTEM NOTE: The user has provided an explicit Knowledge Base. Use this knowledge to answer the question if applicable:\n\nKNOWLEDGE BASE CONTEXT:\n${knowledgeBaseRef.current}\n\n]\n\nUser Question:\n${queryText}`;
      }

      const result = await chatInstance.current.sendMessage(prompt);
      const text = result.response.text();

      setChatLog(prev => [...prev, { type: 'ai', content: text }]);
    } catch (e) {
      console.error(e);
      setChatLog(prev => [...prev, { type: 'ai', content: "⚠️ **Connection Error:** I encountered an error connecting to the Gemini LLM API." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
  };

  // Protected Layout Wrapper for Sidebar/Header
  const ProtectedLayout = ({ children }) => (
    <ProtectedRoute>
      <div className="app-container">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isUploading={isUploading}
          handleFileUpload={handleFileUpload}
          knowledgeBaseRef={knowledgeBaseRef}
          userXP={userXP}
          userLevel={userLevel}
          userCoins={userCoins}
        />
        <main className="main-content">
          <Header
            setActiveTab={setActiveTab}
            isRecording={isRecording}
            handleVoiceToggle={handleVoiceToggle}
            setIsAuthenticated={setIsAuthenticated}
          />
          <div className="full-page-content" style={{ animation: "fadeIn 0.3s ease-in" }}>
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login setAuth={setIsAuthenticated} />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register setAuth={setIsAuthenticated} />} />

      {/* PROTECTED ROUTES */}
      <Route path="/dashboard" element={<ProtectedLayout><Dashboard setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/profile" element={<ProtectedLayout><Profile userXP={userXP} userLevel={userLevel} /></ProtectedLayout>} />
      <Route path="/habittracker" element={<ProtectedLayout><HabitTracker userXP={userXP} userLevel={userLevel} setActiveTab={setActiveTab} /></ProtectedLayout>} />

      {/* ---------- NEW HUBS ---------- */}
      <Route path="/games" element={<ProtectedLayout><GamesHub setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/communicationhub" element={<ProtectedLayout><CommunicationHub setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/learning" element={<ProtectedLayout><LearningHub setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/career" element={<ProtectedLayout><CareerHub setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/resources" element={<ProtectedLayout><Resources /></ProtectedLayout>} />
      <Route path="/book-reader" element={<ProtectedLayout><BookReader /></ProtectedLayout>} />
      <Route path="/contact" element={<ProtectedLayout><Contact /></ProtectedLayout>} />

      {/* GAMES MODULE SUBPAGES */}
      <Route path="/escapegameshub" element={<ProtectedLayout><EscapeGamesHub setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/escapechallenge" element={<ProtectedLayout><EscapeChallenge setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/codeescapehouse" element={<ProtectedLayout><CodeEscapeHouse setActiveTab={setActiveTab} userCoins={userCoins} setUserCoins={setUserCoins} /></ProtectedLayout>} />
      <Route path="/aisurvivalclimb" element={<ProtectedLayout><AISurvivalClimb setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/multiplayer" element={<ProtectedLayout><MultiplayerArena /></ProtectedLayout>} />

      {/* SKILL PATHS MODULE */}
      <Route path="/skillpaths" element={<ProtectedLayout><SkillPaths setActiveTab={setActiveTab} /></ProtectedLayout>} />

      {/* LEARNING MODULE SUBPAGES */}
      <Route path="/codereviewer" element={<ProtectedLayout><CodeReviewer /></ProtectedLayout>} />
      <Route path="/certificationhub" element={<ProtectedLayout><CertificationHub /></ProtectedLayout>} />
      <Route path="/elearning" element={<ProtectedLayout><ELearningSession /></ProtectedLayout>} />

      {/* COMMUNICATION MODULE SUBPAGES */}
      <Route path="/englishlearning" element={<ProtectedLayout><EnglishLearning /></ProtectedLayout>} />
      <Route path="/communication" element={<ProtectedLayout><CommunicationAssistant /></ProtectedLayout>} />

      {/* CAREER MODULE SUBPAGES */}
      <Route path="/resume" element={<ProtectedLayout><Resume /></ProtectedLayout>} />
      <Route path="/careerroadmap" element={<ProtectedLayout><CareerRoadmap setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/jobtracker" element={<ProtectedLayout><JobTracker setActiveTab={setActiveTab} /></ProtectedLayout>} />
      <Route path="/careergenie" element={<ProtectedLayout><CareerGenie userXP={userXP} setUserXP={setUserXP} userLevel={userLevel} /></ProtectedLayout>} />

      {/* OTHER FEATURES */}
      <Route path="/communityhub" element={<ProtectedLayout><CommunityHub /></ProtectedLayout>} />
      <Route path="/trending" element={<ProtectedLayout><TrendingSection /></ProtectedLayout>} />
      <Route path="/airecommendations" element={<ProtectedLayout><AiRecommendations /></ProtectedLayout>} />
      <Route path="/trendingskills" element={<ProtectedLayout><TrendingSkills /></ProtectedLayout>} />
      <Route path="/careeralerts" element={<ProtectedLayout><CareerAlerts /></ProtectedLayout>} />
      <Route path="/salaryinsights" element={<ProtectedLayout><SalaryInsights /></ProtectedLayout>} />
      <Route path="/aiconfidence" element={<ProtectedLayout><AiConfidenceScore /></ProtectedLayout>} />
      <Route path="/notificationhub" element={<ProtectedLayout><NotificationHub /></ProtectedLayout>} />
      <Route path="/notificationsettings" element={<ProtectedLayout><NotificationSettings /></ProtectedLayout>} />
      <Route path="/riskstability" element={<ProtectedLayout><RiskStabilityIntelligence /></ProtectedLayout>} />
      <Route path="/marketvulnerability" element={<ProtectedLayout><MarketVulnerability /></ProtectedLayout>} />
      <Route path="/eventhub" element={<ProtectedLayout><EventHub /></ProtectedLayout>} />
      <Route path="/analytics" element={<ProtectedLayout><Analytics userXP={userXP} userLevel={userLevel} /></ProtectedLayout>} />
      <Route path="/testsystem" element={<ProtectedLayout><TestSystem /></ProtectedLayout>} />

      <Route path="/chatbot" element={
        <ProtectedLayout>
          <Chatbot
            chatLog={chatLog}
            isTyping={isTyping}
            inputText={inputText}
            setInputText={setInputText}
            handleKeyPress={handleKeyPress}
            handleSend={handleSend}
            chatBottomRef={chatBottomRef}
            knowledgeBaseRef={knowledgeBaseRef}
            handleQuerySubmit={handleQuerySubmit}
          />
        </ProtectedLayout>
      } />

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
