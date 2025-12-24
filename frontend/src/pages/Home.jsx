import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('financial_user_id');
        if (userId) {
            axios.get(`/users/${userId}`)
                .then(res => setUser(res.data))
                .catch(err => console.error(err));
        }
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="home-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        {user ? `Welcome ${user.name.split(' ')[0]}` : 'Master Your Money'} <br />
                        <span>Build Your Future</span>
                    </h1>
                    <p className="hero-subtitle">
                        {user?.learningLevel
                            ? `You are on the ${user.learningLevel} path. Let's continue your journey.`
                            : "Demystifying stocks and mutual funds with education tailored to you. No heavy finance jargon, just clear paths to financial freedom."
                        }
                    </p>
                    <div className="hero-cta">
                        <Link to="/learn" className="btn btn-primary" style={{ marginRight: '1rem' }}>
                            {user ? 'Continue Learning' : 'Get Started'}
                        </Link>
                        <Link to="/tools" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
                            Explore Tools
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">How We Help You Grow</h2>
                <div className="features-grid">
                    <div className="card feature-card">
                        <div className="feature-icon">🎓</div>
                        <h3>Personalized Learning</h3>
                        <p>
                            {user?.learningLevel
                                ? `Curated content for ${user.learningLevel} investors like you.`
                                : "Content that adapts to your knowledge level. Start from basics or dive deep into advanced strategies."}
                        </p>
                        <Link to="/learn" style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>Go to Modules &rarr;</Link>
                    </div>
                    <div className="card feature-card">
                        <div className="feature-icon">🧮</div>
                        <h3>Smart Tools</h3>
                        <p>
                            Use our calculators to visualize the power of compounding and plan your financial goals efficiently.
                        </p>
                        <Link to="/tools" style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>Use Calculators &rarr;</Link>
                    </div>
                    <div className="card feature-card">
                        <div className="feature-icon">🛡️</div>
                        <h3>Risk Profile</h3>
                        <p>
                            {user?.learningLevel
                                ? `Your current profile: ${user.learningLevel}. You can retake the assessment anytime.`
                                : "Understand your risk tolerance before you invest."}
                        </p>
                        <Link to="/profile" style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>View Profile &rarr;</Link>
                    </div>
                    <div className="card feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3>Anti-Gravity Simulator</h3>
                        <p>
                            Practice trading with $100,000 in virtual credits. Experience zero-G market mechanics and test strategies in the void.
                        </p>
                        <Link to="/simulator" style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>Launch Sim &rarr;</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
