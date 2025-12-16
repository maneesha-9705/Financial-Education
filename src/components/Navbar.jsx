import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('financial_user_id');
    if (userId) {
      axios.get(`http://localhost:5000/users/${userId}`)
        .then(res => setUserName(res.data.name))
        .catch(err => console.error(err));
    }
  }, []);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          Fin<span>Edu</span>
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          </li>
          <li>
            <Link to="/learn" className={`nav-link ${isActive('/learn')}`}>Learn</Link>
          </li>
          <li>
            <Link to="/tools" className={`nav-link ${isActive('/tools')}`}>Tools</Link>
          </li>
          <li>
            <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>Profile</Link>
          </li>
        </ul>
        <div className="navbar-actions">
          {userName ? (
            <Link to="/profile" className="user-greeting" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>
              Hi, {userName.split(' ')[0]}
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
