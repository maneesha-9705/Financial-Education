import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Learn.css';
import BeginnerJourney from '../components/BeginnerJourney';

const Learn = () => {
    const [activeTab, setActiveTab] = useState('modules');
    const [userLevel, setUserLevel] = useState(null);
    const [loading, setLoading] = useState(true);

    const [quote, setQuote] = useState(null);

    const quotes = [
        { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
        { text: "The stock market is designed to transfer money from the Active to the Patient.", author: "Warren Buffett" },
        { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
        { text: "Compound interest is the eighth wonder of the world.", author: "Albert Einstein" },
        { text: "Financial freedom is available to those who learn about it and work for it.", author: "Robert Kiyosaki" }
    ];

    useEffect(() => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);

        const userId = sessionStorage.getItem('financial_user_id');
        if (userId) {
            axios.get(`/users/${userId}`)
                .then(res => {
                    setUserLevel(res.data.learningLevel || 'Beginner');
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    // Content Definitions
    const content = {
        Beginner: [
            {
                title: "Budgeting 101",
                tag: "Foundation",
                desc: "Learn how to track expenses and save your first $1000.",
                keyPoint: "The 50/30/20 rule is a great starting point for budgeting.",
                type: "modules"
            },
            {
                title: "What is the Stock Market?",
                tag: "Basics",
                desc: "Understanding shares, exchanges, and why companies go public.",
                keyPoint: "Buying a share means owning a small piece of a company.",
                type: "modules"
            },
            {
                title: "Power of Compounding",
                tag: "Wealth",
                desc: "Why starting early is the biggest advantage you have.",
                keyPoint: "Compound interest is interest on interest.",
                type: "modules"
            }
        ],
        Intermediate: [
            {
                title: "Mutual Funds vs ETFs",
                tag: "Strategy",
                desc: "Which vehicle is right for your goals? Costs and liquidity compared.",
                keyPoint: "ETFs trade like stocks, while Mutual Funds price once a day.",
                type: "modules"
            },
            {
                title: "Asset Allocation",
                tag: "Portfolio",
                desc: "Structuring your portfolio to balance risk and reward.",
                keyPoint: "Don't put all your eggs in one basket.",
                type: "modules"
            },
            {
                title: "Fundamental Analysis",
                tag: "Valuation",
                desc: "Reading balance sheets and P/E ratios.",
                keyPoint: "Price is what you pay. Value is what you get.",
                type: "modules"
            }
        ],
        Advanced: [
            {
                title: "Options & Futures",
                tag: "Derivatives",
                desc: "Hedging your portfolio or leveraging for higher returns.",
                keyPoint: "Derivatives are high-risk instruments based on underlying assets.",
                type: "modules"
            },
            {
                title: "Tax Loss Harvesting",
                tag: "Optimization",
                desc: "Reducing your tax liability by selling losing positions.",
                keyPoint: "Use losses to offset gains and reduce your tax bill.",
                type: "modules"
            },
            {
                title: "Technical Analysis",
                tag: "Trading",
                desc: "Using charts and patterns to predict future price movements.",
                keyPoint: "History often repeats itself in market movements.",
                type: "modules"
            }
        ]
    };

    const currentContent = userLevel ? (content[userLevel] || content['Beginner']) : [];

    if (loading) return <div className="loading-state">Loading your curriculum...</div>;

    if (!userLevel) {
        return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Please log in to see your learning path.</h2>
        </div>;
    }

    if (userLevel === 'Beginner' || userLevel === 'Intermediate') {
        return <BeginnerJourney userLevel={userLevel} dailyQuote={quote} />;
    }

    return (
        <div className="learn-page">
            <div className="learn-header">
                <div className="level-badge-small">{userLevel} Level</div>
                <h1 className="learn-title">Your Learning Path</h1>
                <p className="learn-subtitle">
                    {userLevel === 'Beginner' && "Master the basics to build a secure future."}
                    {userLevel === 'Intermediate' && "Expand your horizons with smarter investment strategies."}
                    {userLevel === 'Advanced' && "Advanced strategies for the experienced investor."}
                </p>
                {quote && (
                    <div className="daily-quote">
                        <p>"{quote.text}" — <span style={{ color: 'var(--color-secondary)' }}>{quote.author}</span></p>
                    </div>
                )}
            </div>

            <div className="learn-tabs">
                <button
                    className={`tab-btn ${activeTab === 'modules' ? 'active' : ''}`}
                    onClick={() => setActiveTab('modules')}
                >
                    Modules
                </button>
                <button
                    className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
                    onClick={() => setActiveTab('resources')}
                >
                    Resources
                </button>
            </div>

            <div className="content-container">
                {activeTab === 'modules' && (
                    <div className="content-grid">
                        {currentContent.map((item, index) => (
                            <div key={index} className="card article-card recommended">
                                <div className="article-header">
                                    <span className="article-tag">{item.tag}</span>
                                </div>
                                <h2 className="article-title">{item.title}</h2>
                                <div className="article-body">
                                    <p>{item.desc}</p>
                                    <div className="key-takeaways">
                                        <h4>💡 Key Takeaway</h4>
                                        <p>{item.keyPoint}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'resources' && (
                    <div className="resources-section">
                        <div className="card">
                            <h3>Essential Reading</h3>
                            <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                                <li style={{ marginBottom: '0.5rem' }}>The Psychology of Money</li>
                                <li style={{ marginBottom: '0.5rem' }}>Rich Dad Poor Dad</li>
                                {userLevel === 'Advanced' && <li style={{ marginBottom: '0.5rem' }}>The Intelligent Investor</li>}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Learn;
