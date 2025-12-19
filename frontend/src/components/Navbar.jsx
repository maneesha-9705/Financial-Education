import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('financial_user_id');
    if (userId) {
      axios.get(`/users/${userId}`)
        .then(res => setUserName(res.data.name))
        .catch(err => console.error(err));
    }
  }, []);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span style={{ paddingLeft: '15px' }}>Clari-Fi</span>
          <i style={{ paddingLeft: '5px' }}><b>C</b>larity <b>B</b>efore <b>C</b>apital</i>
        </Link>

        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </div>

        <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/learn" className={`nav-link ${isActive('/learn')}`} onClick={() => setIsMenuOpen(false)}>Learn</Link>
          </li>
          <li>
            <Link to="/tools" className={`nav-link ${isActive('/tools')}`} onClick={() => setIsMenuOpen(false)}>Tools</Link>
          </li>
          <li>
            <Link to="/community" className={`nav-link ${isActive('/community')}`} onClick={() => setIsMenuOpen(false)}>Community</Link>
          </li>
          <li>
            <Link to="/profile" className={`nav-link ${isActive('/profile')}`} onClick={() => setIsMenuOpen(false)}>Profile</Link>
          </li>
        </ul>
        <div className="navbar-actions">
          <button
            onClick={() => document.body.classList.toggle('dark-mode')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', marginRight: '1rem' }}
            title="Toggle Theme"
          >
            🌓
          </button>
          {userName ? (
            <Link to="/profile" className="profile-icon" title={userName}>
              {userName.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link to="/profile" className="btn btn-primary">Get Started</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
