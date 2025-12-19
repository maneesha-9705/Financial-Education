import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Community.css';

const Community = () => {
    const [experiences, setExperiences] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const res = await axios.get('/community');
            setExperiences(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await axios.post('/community', {
                message: newMessage,
                role: 'Aspiring Investor'
            });
            setExperiences([res.data, ...experiences]);
            setNewMessage('');
            setShowForm(false);
            alert('Experience shared successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to post experience');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="community-page">
            <div className="community-header">
                <h1>Community Voices</h1>
                <p>Real stories from people on their journey to financial freedom.</p>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Share Your Story'}
                </button>
            </div>

            {showForm && (
                <div className="share-form-container">
                    <form onSubmit={handleSubmit} className="share-form">
                        <h3>Share Your Experience</h3>
                        <textarea
                            placeholder="How has learning about finance changed your life? Share a win or a lesson."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            required
                            maxLength={280}
                        />
                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Posting...' : 'Post Experience'}
                        </button>
                    </form>
                </div>
            )}

            {/* Conditional Marquee: Only scroll if we have enough content (> 3 items) */}
            {experiences.length > 3 ? (
                <div className="marquee-container">
                    <div className="marquee-content">
                        {/* Duplicate lists for infinite scroll effect */}
                        {[...experiences, ...experiences].map((exp, idx) => (
                            <div key={`${exp._id}-${idx}`} className="experience-card">
                                <div className="exp-avatar">{exp.name.charAt(0)}</div>
                                <div className="exp-content">
                                    <p className="exp-msg">"{exp.message}"</p>
                                    <span className="exp-author">- {exp.name}</span>
                                    <span className="exp-role">{exp.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="static-container">
                    {experiences.map((exp, idx) => (
                        <div key={`${exp._id}-${idx}`} className="experience-card">
                            <div className="exp-avatar">{exp.name.charAt(0)}</div>
                            <div className="exp-content">
                                <p className="exp-msg">"{exp.message}"</p>
                                <span className="exp-author">- {exp.name}</span>
                                <span className="exp-role">{exp.role}</span>
                            </div>
                        </div>
                    ))}
                    {experiences.length === 0 && !loading && (
                        <div className="no-experiences">Be the first to share your story!</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Community;
