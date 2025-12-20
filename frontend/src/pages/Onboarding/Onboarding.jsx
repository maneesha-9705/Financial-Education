import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import './ResultStyles.css';

// API Base URL configured in main.jsx
// const API_URL = 'http://localhost:5000/users';

export default function Onboarding({ onComplete }) {
    const [isLogin, setIsLogin] = useState(false); // Toggle between Login and Signup
    const [step, setStep] = useState(1); // 1: Auth, 2: Risk, 3: Result
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        pan: ''
    });

    const [riskAnswers, setRiskAnswers] = useState({});
    const [finalLevel, setFinalLevel] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const checkExistingSession = async () => {
            const userId = sessionStorage.getItem('financial_user_id');
            const token = sessionStorage.getItem('token');
            if (userId && token) {
                try {
                    const res = await axios.get(`/users/${userId}`);
                    const user = res.data;
                    if (!user.learningLevel) {
                        // User exists but didn't finish onboarding
                        setFormData(prev => ({ ...prev, ...user }));
                        setStep(2);
                    }
                } catch (err) {
                    console.error("Session check failed", err);
                    // Invalid token or user
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('financial_user_id');
                    }
                }
            }
        };
        checkExistingSession();
    }, []);

    // === Step 1: Authentication (Login or Signup) ===
    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // LOGIN LOGIC
                const res = await axios.post('/login', {
                    email: formData.email,
                    password: formData.password
                });

                const data = res.data;
                const token = data.token;
                const userId = data._id; // Backend uses _id

                sessionStorage.setItem('token', token);
                sessionStorage.setItem('financial_user_id', userId);

                // Check if risk profile is done
                if (data.learningLevel) {
                    window.location.href = '/';
                } else {
                    // Restore data and go to Risk Step
                    setFormData(prev => ({ ...prev, ...data }));
                    setStep(2);
                }

            } else {
                // SIGNUP LOGIC
                const newUser = {
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.mobile,
                    password: formData.password,
                    pan: formData.pan, // Optional
                };

                // Remove the initial register call if we are just going to login anyway? 
                // No, we must register first.
                await axios.post('/register', newUser);

                // Login immediately to get the token
                const loginRes = await axios.post('/login', {
                    email: formData.email,
                    password: formData.password
                });

                const data = loginRes.data;
                const token = data.token;
                const userId = data._id;

                sessionStorage.setItem('token', token);
                sessionStorage.setItem('financial_user_id', userId);

                setFormData(prev => ({ ...prev, ...data }));
                setStep(2); // Go to Risk Assessment
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || "Authentication failed. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    // === Step 2: Risk Assessment ===
    const riskQuestions = [
        {
            id: 'q1',
            text: "How would you describe your financial knowledge?",
            options: [
                { label: "Beginner - I'm just starting", value: 1 },
                { label: "Intermediate - I know the basics", value: 2 },
                { label: "Advanced - I understand markets", value: 3 }
            ]
        },
        {
            id: 'q2',
            text: "What is your primary investment goal?",
            options: [
                { label: "Safety - Preserve my capital", value: 1 },
                { label: "Growth - Moderate returns", value: 2 },
                { label: "Aggressive - Maximize returns", value: 3 }
            ]
        },
        {
            id: 'q3',
            text: "How do you react to market drops?",
            options: [
                { label: "Panic & Sell", value: 1 },
                { label: "Wait it out", value: 2 },
                { label: "Buy more", value: 3 }
            ]
        }
    ];

    const handleRiskOptionSelect = (qId, val) => {
        setRiskAnswers(prev => ({ ...prev, [qId]: val }));
    };

    const calculateRiskProfile = async () => {
        const score = Object.values(riskAnswers).reduce((a, b) => a + b, 0);
        let level = 'Beginner';
        if (score >= 5 && score <= 7) level = 'Intermediate';
        if (score >= 8) level = 'Advanced';

        setFinalLevel(level);

        setLoading(true);
        setError(''); // Clear previous errors

        try {
            const userId = sessionStorage.getItem('financial_user_id');
            if (!userId) {
                throw new Error("User ID not found. Please log in again.");
            }

            console.log("Submitting risk profile for user:", userId, { score, level });

            await axios.patch(`/users/${userId}`, {
                riskScore: score,
                learningLevel: level,
                riskAnswers
            });

            console.log("Risk profile updated successfully");
            setStep(3);
        } catch (error) {
            console.error("Error saving risk profile", error);
            setError(error.response?.data?.message || "Failed to save results. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // === Step 3: Completion ===
    const finishOnboarding = () => {
        // Hard redirect to ensure fresh state from DB
        window.location.href = '/';
    };

    return (
        <div className="onboarding-container">
            {/* Background is handled by CSS now (no orbs) */}

            <div className="onboarding-card">
                {step === 1 && (
                    <>
                        <h1 className="onboarding-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                        <p className="onboarding-subtitle">
                            {isLogin ? 'Enter your credentials to access your account' : 'Start your journey to financial freedom'}
                        </p>

                        {error && <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                        <form onSubmit={handleAuth}>
                            {!isLogin && (
                                <div className="input-group">
                                    <label className="input-label">Full Name</label>
                                    <input
                                        required
                                        className="custom-input"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    className="custom-input"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {!isLogin && (
                                <div className="input-group">
                                    <label className="input-label">Mobile Number (Optional)</label>
                                    <input
                                        className="custom-input"
                                        placeholder="+91 98765 43210"
                                        value={formData.mobile}
                                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="input-group">
                                <label className="input-label">Password</label>
                                <input
                                    required
                                    type="password"
                                    className="custom-input"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            {!isLogin && (
                                <div className="input-group">
                                    <label className="input-label">PAN Number (Optional)</label>
                                    <input
                                        className="custom-input"
                                        placeholder="ABCDE1234F"
                                        maxLength={10}
                                        value={formData.pan}
                                        onChange={e => setFormData({ ...formData, pan: e.target.value })}
                                    />
                                </div>
                            )}

                            <button type="submit" className="primary-button" disabled={loading}>
                                {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
                            </button>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                }}
                            >
                                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <div>
                        <div className="step-indicator">
                            <div className="step-dot active"></div>
                            <div className="step-dot"></div>
                        </div>

                        <h1 className="onboarding-title">Risk Profile</h1>
                        <p className="onboarding-subtitle">Help us tailor your learning path</p>

                        {error && <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                        <div style={{ marginBottom: '2rem' }}>
                            {riskQuestions.map((q, idx) => (
                                <div key={q.id} style={{ marginBottom: '1.5rem' }}>
                                    <p style={{ marginBottom: '0.8rem', fontWeight: 500, color: '#e2e8f0' }}>{idx + 1}. {q.text}</p>
                                    <div className="risk-options">
                                        {q.options.map(opt => (
                                            <div
                                                key={opt.value}
                                                className={`risk-option-card ${riskAnswers[q.id] === opt.value ? 'selected' : ''}`}
                                                onClick={() => handleRiskOptionSelect(q.id, opt.value)}
                                            >
                                                <div className="radio-circle">
                                                    <div className="radio-inner"></div>
                                                </div>
                                                <span style={{ color: '#f1f5f9' }}>{opt.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="primary-button"
                            onClick={calculateRiskProfile}
                            disabled={loading || Object.keys(riskAnswers).length < 3}
                            style={{ opacity: Object.keys(riskAnswers).length < 3 ? 0.5 : 1 }}
                        >
                            {loading ? 'Analyzing...' : 'See My Result'}
                        </button>
                    </div>
                )}

                {step === 3 && finalLevel && (
                    <div className="result-container">
                        <div className="result-icon-wrapper">
                            {finalLevel === 'Beginner' && <span className="result-icon">🌱</span>}
                            {finalLevel === 'Intermediate' && <span className="result-icon">⚖️</span>}
                            {finalLevel === 'Advanced' && <span className="result-icon">🚀</span>}
                        </div>

                        <h1 className="onboarding-title">Analysis Complete</h1>
                        <p className="onboarding-subtitle">Based on your answers, you are consistent with a:</p>

                        <div className={`level-badge ${finalLevel.toLowerCase()}`}>
                            {finalLevel} Investor
                        </div>

                        <div className="result-description-card">
                            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>What this means for you:</h3>
                            <p className="level-description">
                                {finalLevel === 'Beginner' && "You prefer safety and steady growth. We'll focus on low-risk assets like Blue-chip stocks and Index Funds while you build your foundation."}
                                {finalLevel === 'Intermediate' && "You understand the basics and are ready to diversify. We'll introduce a mix of Growth stocks and balanced Mutual Funds."}
                                {finalLevel === 'Advanced' && "You have a high risk tolerance. You'll get access to advanced tools for analyzing Small-cap stocks and aggressive market strategies."}
                            </p>
                        </div>

                        <button className="primary-button" onClick={finishOnboarding}>
                            Go to My Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
