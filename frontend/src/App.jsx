import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Tools from './pages/Tools';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Onboarding from './pages/Onboarding/Onboarding';
import StockPortfolio from './pages/StockPortfolio';
import StockSimulator from './pages/StockSimulator';
import PageLogger from './components/PageLogger';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      const userId = sessionStorage.getItem('financial_user_id');
      if (userId) {
        try {
          const response = await axios.get(`/users/${userId}`);
          // Axios throws on 4xx/5xx so if we are here, it's success (2xx)
          const user = response.data;
          if (user.learningLevel) {
            setIsOnboarded(true);
          }
        } catch (error) {
          console.error("Failed to verify user session", error);
        }
      }
      setIsChecking(false);
    };

    checkUserStatus();
  }, []);

  if (isChecking) return <div className="loading-screen">Loading...</div>;

  return (
    <Router>
      <PageLogger />
      <Chatbot isOnboarded={isOnboarded} />
      {!isOnboarded ? (
        <Onboarding onComplete={() => setIsOnboarded(true)} />
      ) : (
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/portfolio" element={<StockPortfolio />} />
              <Route path="/simulator" element={<StockSimulator />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<Profile onLogout={() => {
                sessionStorage.removeItem('financial_user_id');
                sessionStorage.removeItem('token');
                setIsOnboarded(false);
              }} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      )}
    </Router>
  );
}

export default App;
