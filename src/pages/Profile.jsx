import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

// API Base URL configured in main.jsx

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // We can reuse the same questions or a subset
    const questions = [
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

    const [tempAnswers, setTempAnswers] = useState({});

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = () => {
        const userId = localStorage.getItem('financial_user_id');
        if (userId) {
            axios.get(`/users/${userId}`)
                .then(res => {
                    setUser(res.data);
                    if (res.data.riskAnswers) {
                        setTempAnswers(res.data.riskAnswers);
                    }
                })
                .catch(err => console.error(err));
        }
    };

    const handleOptionChange = (qId, val) => {
        setTempAnswers(prev => ({ ...prev, [qId]: val }));
    };

    const handleSave = async () => {
        const score = Object.values(tempAnswers).reduce((a, b) => a + b, 0);
        let level = 'Beginner';
        if (score >= 5 && score <= 7) level = 'Intermediate';
        if (score >= 8) level = 'Advanced';

        try {
            await axios.patch(`/users/${user.id}`, {
                riskScore: score,
                learningLevel: level,
                riskAnswers: tempAnswers
            });
            setUser({ ...user, riskScore: score, learningLevel: level, riskAnswers: tempAnswers });
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    const handleLogout = () => {
        if (confirm("Are you sure you want to log out? This will clear your session.")) {
            localStorage.removeItem('financial_user_id');
            window.location.href = '/';
        }
    };

    if (!user) return <div className="loading">Loading Profile...</div>;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1 className="profile-title">My Profile</h1>
                <button className="btn btn-outline" style={{ borderColor: 'red', color: 'red' }} onClick={handleLogout}>Log Out</button>
            </div>

            <div className="profile-card">
                <div className="user-info">
                    <div className="info-row">
                        <span className="label">Name:</span>
                        <span className="value">{user.name}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Email:</span>
                        <span className="value">{user.email}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">PAN:</span>
                        <span className="value">{user.pan || 'Not provided'}</span>
                    </div>
                </div>
            </div>

            <div className="risk-section">
                <div className="section-header">
                    <h2>Risk Profile & Learning Path</h2>
                    {!isEditing && (
                        <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Retake Assessment</button>
                    )}
                </div>

                {!isEditing ? (
                    <div className="current-risk">
                        <div className="level-display">
                            <span className="level-badge large">{user.learningLevel}</span>
                            <p className="level-desc">
                                Based on your score ({user.riskScore}/9).
                                {user.learningLevel === 'Beginner' && " We recommend starting with the basics."}
                                {user.learningLevel === 'Intermediate' && " You are ready for some growth strategies."}
                                {user.learningLevel === 'Advanced' && " High risk, high reward strategies are unlocked."}
                            </p>
                        </div>
                        <Link to="/learn" className="btn btn-primary">Go to My Courses</Link>
                    </div>
                ) : (
                    <div className="edit-risk-form">
                        {questions.map((q) => (
                            <div key={q.id} className="question-block">
                                <p className="question-text">{q.text}</p>
                                <div className="options-group">
                                    {q.options.map((opt, idx) => (
                                        <label key={idx} className={`option-label ${tempAnswers[q.id] === opt.value ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name={`q-${q.id}`}
                                                value={opt.value}
                                                onChange={() => handleOptionChange(q.id, opt.value)}
                                                checked={tempAnswers[q.id] === opt.value}
                                            />
                                            <span>{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="form-actions">
                            <button className="btn btn-primary" onClick={handleSave}>Save & Update</button>
                            <button className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
