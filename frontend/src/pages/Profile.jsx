import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = ({ onLogout }) => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('personal'); // personal, risk, security
    const [loading, setLoading] = useState(true);

    // Personal Edit State
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [personalForm, setPersonalForm] = useState({
        name: '',
        mobile: ''
    });

    // Password Change State
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    // Risk Profile State
    const [isEditingRisk, setIsEditingRisk] = useState(false);
    const [tempAnswers, setTempAnswers] = useState({});

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

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const userId = sessionStorage.getItem('financial_user_id');
        if (!userId) return;

        try {
            const res = await axios.get(`/users/${userId}`);
            setUser(res.data);
            setPersonalForm({
                name: res.data.name || '',
                mobile: res.data.mobile || ''
            });
            if (res.data.riskAnswers) {
                setTempAnswers(res.data.riskAnswers);
            }
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch user", err);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (confirm("Are you sure you want to log out?")) {
            if (onLogout) onLogout();
            else {
                sessionStorage.removeItem('financial_user_id');
                sessionStorage.removeItem('token');
                window.location.href = '/';
            }
        }
    };

    // --- Personal Info Handlers ---
    const handlePersonalUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`/users/${user._id}`, {
                name: personalForm.name,
                mobile: personalForm.mobile
            });
            setUser(prev => ({ ...prev, name: personalForm.name, mobile: personalForm.mobile }));
            setIsEditingPersonal(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile.");
        }
    };

    // --- Security Handlers ---
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordMessage({ type: 'error', text: "New passwords do not match" });
            return;
        }

        try {
            // Note: In a real app, you'd verify currentPassword on backend before update.
            // Our simple backend just takes 'password' field to update it without checking old one strictly unless implemented.
            // Assuming the backend endpoint just updates if provided:
            await axios.patch(`/users/${user._id}`, {
                password: passwordForm.newPassword
            });
            setPasswordMessage({ type: 'success', text: "Password updated successfully!" });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error(error);
            setPasswordMessage({ type: 'error', text: "Failed to update password." });
        }
    };

    // --- Risk Profile Handlers ---
    const handleRiskOptionChange = (qId, val) => {
        setTempAnswers(prev => ({ ...prev, [qId]: val }));
    };

    const handleRiskUpdate = async () => {
        const score = Object.values(tempAnswers).reduce((a, b) => a + b, 0);
        let level = 'Beginner';
        if (score >= 5 && score <= 7) level = 'Intermediate';
        if (score >= 8) level = 'Advanced';

        try {
            await axios.patch(`/users/${user._id}`, {
                riskScore: score,
                learningLevel: level,
                riskAnswers: tempAnswers
            });
            setUser(prev => ({ ...prev, riskScore: score, learningLevel: level, riskAnswers: tempAnswers }));
            setIsEditingRisk(false);
            alert("Risk Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update risk profile.");
        }
    };

    if (loading) return <div className="loading-container">Loading Profile...</div>;
    if (!user) return <div className="error-container">User not found</div>;

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
    };

    return (
        <div className="profile-container">
            <div className="profile-sidebar">
                <div className="user-avatar-block">
                    <div className="avatar-circle">
                        {getInitials(user.name)}
                    </div>
                    <h3 className="user-name">{user.name}</h3>
                    <p className="user-email">{user.email}</p>
                    <div className={`user-badge-pill ${user.learningLevel.toLowerCase()}`}>
                        {user.learningLevel === 'Beginner' && '🌱 Novice Saver'}
                        {user.learningLevel === 'Intermediate' && '📈 Market Explorer'}
                        {user.learningLevel === 'Advanced' && '🚀 Wealth Master'}
                    </div>
                </div>

                <nav className="profile-nav">
                    <button
                        className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('personal')}
                    >
                        <span className="icon">👤</span> Personal Info
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'risk' ? 'active' : ''}`}
                        onClick={() => setActiveTab('risk')}
                    >
                        <span className="icon">📊</span> Risk Profile
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <span className="icon">🔒</span> Security
                    </button>
                    <button className="nav-item logout" onClick={handleLogout}>
                        <span className="icon">🚪</span> Log Out
                    </button>
                </nav>
            </div>

            <div className="profile-content">
                <h2 className="tab-title">
                    {activeTab === 'personal' && 'Personal Information'}
                    {activeTab === 'risk' && 'Risk Profile & Learning Path'}
                    {activeTab === 'security' && 'Security Settings'}
                </h2>

                {activeTab === 'personal' && (
                    <div className="tab-pane fade-in">
                        {!isEditingPersonal ? (
                            <div className="info-cards">
                                <div className="info-group">
                                    <label>Full Name</label>
                                    <p>{user.name}</p>
                                </div>
                                <div className="info-group">
                                    <label>Email Address</label>
                                    <p>{user.email} <span className="badge-verified">Verified</span></p>
                                </div>
                                <div className="info-group">
                                    <label>Mobile Number</label>
                                    <p>{user.mobile || 'Not set'}</p>
                                </div>
                                <div className="info-group">
                                    <label>PAN Number</label>
                                    <p>{user.pan || 'Not provided'}</p>
                                </div>
                                <button className="btn-primary edit-btn" onClick={() => setIsEditingPersonal(true)}>
                                    Edit Details
                                </button>
                            </div>
                        ) : (
                            <form className="edit-form" onSubmit={handlePersonalUpdate}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={personalForm.name}
                                        onChange={e => setPersonalForm({ ...personalForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number</label>
                                    <input
                                        type="text"
                                        value={personalForm.mobile}
                                        onChange={e => setPersonalForm({ ...personalForm, mobile: e.target.value })}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">Save Changes</button>
                                    <button type="button" className="btn-secondary" onClick={() => setIsEditingPersonal(false)}>Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {activeTab === 'risk' && (
                    <div className="tab-pane fade-in">
                        {!isEditingRisk ? (
                            <div className="risk-overview">
                                <div className={`risk-badge ${user.learningLevel.toLowerCase()}`}>
                                    {user.learningLevel} Investor
                                </div>
                                <p className="risk-description">
                                    Your specific risk profile score is <strong>{user.riskScore}/9</strong>.
                                    This indicates you are comfortable with {user.learningLevel === 'Advanced' ? 'high volatility' : user.learningLevel === 'Intermediate' ? 'moderate fluctuations' : 'minimal risk'}.
                                </p>

                                <div className="progress-bar-container">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${(user.riskScore / 9) * 100}%`,
                                                backgroundColor: user.learningLevel === 'Advanced' ? '#ef4444' : user.learningLevel === 'Intermediate' ? '#eab308' : '#22c55e'
                                            }}
                                        ></div>
                                    </div>
                                    <div className="progress-labels">
                                        <span>Conservative</span>
                                        <span>Balanced</span>
                                        <span>Aggressive</span>
                                    </div>
                                </div>

                                <button className="btn-outline" onClick={() => setIsEditingRisk(true)}>
                                    Retake Assessment
                                </button>
                            </div>
                        ) : (
                            <div className="risk-assessment-form">
                                {questions.map(q => (
                                    <div key={q.id} className="question-item">
                                        <p className="q-text">{q.text}</p>
                                        <div className="options-grid">
                                            {q.options.map(opt => (
                                                <label
                                                    key={opt.value}
                                                    className={`option-box ${tempAnswers[q.id] === opt.value ? 'selected' : ''}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={q.id}
                                                        value={opt.value}
                                                        checked={tempAnswers[q.id] === opt.value}
                                                        onChange={() => handleRiskOptionChange(q.id, opt.value)}
                                                    />
                                                    {opt.label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="form-actions">
                                    <button className="btn-primary" onClick={handleRiskUpdate}>Update Profile</button>
                                    <button className="btn-secondary" onClick={() => setIsEditingRisk(false)}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="tab-pane fade-in">
                        <form className="security-form" onSubmit={handlePasswordUpdate}>
                            <h3>Change Password</h3>
                            <div className="form-group">
                                <label>Current Password (for verification)</label>
                                <input
                                    type="password"
                                    disabled // In a real app, this would be validated
                                    placeholder="••••••••"
                                    value={passwordForm.currentPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                />
                                <small className="hint">Simple backend implementation does not verify old password yet.</small>
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.newPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.confirmPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                />
                            </div>
                            {passwordMessage.text && (
                                <div className={`message ${passwordMessage.type}`}>
                                    {passwordMessage.text}
                                </div>
                            )}
                            <button type="submit" className="btn-primary">Update Password</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
