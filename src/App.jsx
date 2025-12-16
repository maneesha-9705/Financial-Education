import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Tools from './pages/Tools';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding/Onboarding';
import './App.css';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      const userId = localStorage.getItem('financial_user_id');
      if (userId) {
        try {
          const response = await fetch(`http://localhost:5000/users/${userId}`);
          if (response.ok) {
            const user = await response.json();
            if (user.learningLevel) {
              setIsOnboarded(true);
            }
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
              <Route path="/profile" element={<Profile />} />
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
