
import React from 'react';

export default function BeginnerModule({ onComplete, isCompleted, isDarkMode }) {
    return (
        <div className="journey-module">
            <h3 className="module-title">📘 MODULE 1: INVESTING MADE SIMPLE</h3>
            <p className="module-subtitle">Everything You Need to Know Before You Invest</p>

            <div className="intro-section">
                <h4>👋 Welcome</h4>
                <p>
                    Before you invest even ₹1, it’s important to understand what investing really means.
                    This module will explain everything slowly, clearly, and with real-life examples.
                    <br /><br />
                    <strong>No technical words. No pressure. Just clarity.</strong>
                </p>
            </div>

            <h4 style={{ textAlign: 'center', margin: '2rem 0' }}>📺 Video Lesson 1: Stock Market Explained</h4>
            <div className="video-wrapper">
                <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/eNXZEcn-CEo"
                    title="Stock Market for Beginners"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>

            <hr className="divider" />

            <div className="text-content">
                <div className="section-block">
                    <h4 className="content-title">1️⃣ What is Investing?</h4>
                    <div style={{ padding: '20px', backgroundColor: isDarkMode ? '#2c2c2c' : '#f9f9f9', borderRadius: '8px', borderLeft: '4px solid #666' }}>
                        <h5>📌 Simple Explanation</h5>
                        <p>
                            Investing is the act of allocating your money to different assets (like stocks, bonds, or real estate) with the expectation that it will grow over time.
                            Think of it as planting a seed. If you keep the seed in your pocket (saving), it stays a seed. If you plant it and water it (investing), it can grow into a tree that provides fruits for years.
                        </p>
                    </div>
                </div>

                <div className="section-block">
                    <h4 className="content-title">2️⃣ Saving vs Investing vs Trading</h4>
                    <div className="grid-container">
                        <div className="term-item">
                            <h6>🏦 Saving</h6>
                            <ul>
                                <li><strong>Goal:</strong> Safety & Liquidity</li>
                                <li><strong>Risk:</strong> Very Low</li>
                                <li><strong>Returns:</strong> Low (3-6%)</li>
                                <li><strong>Good for:</strong> Emergencies</li>
                            </ul>
                        </div>
                        <div className="term-item">
                            <h6>📈 Investing</h6>
                            <ul>
                                <li><strong>Goal:</strong> Wealth Creation</li>
                                <li><strong>Risk:</strong> Moderate</li>
                                <li><strong>Returns:</strong> High (10-15%)</li>
                                <li><strong>Good for:</strong> Long-term goals</li>
                            </ul>
                        </div>
                        <div className="term-item">
                            <h6>⚡ Trading</h6>
                            <ul>
                                <li><strong>Goal:</strong> Quick Profits</li>
                                <li><strong>Risk:</strong> Very High</li>
                                <li><strong>Returns:</strong> Volatile</li>
                                <li><strong>Good for:</strong> Professionals</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="section-block">
                    <h4 className="content-title">3️⃣ What is a Stock?</h4>
                    <p>
                        A stock (or share) represents ownership in a company.
                    </p>
                    <ul style={{ lineHeight: '2' }}>
                        <li>When you buy a stock of Company X, you become a partial owner of Company X.</li>
                        <li>If the company makes a profit, the stock price usually goes up.</li>
                        <li>Some companies also share their profits directly with you in the form of <strong>Dividends</strong>.</li>
                    </ul>
                </div>

                <div className="section-block">
                    <h4 className="content-title">4️⃣ Why Do Stock Prices Go Up and Down?</h4>
                    <p>Prices change based on Supply and Demand.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                        <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                            <strong style={{ color: '#2ecc71' }}>Price Goes Up 📈</strong>
                            <p>When more people want to BUY the stock than sell it. Often happens when a company reports good profits or good news.</p>
                        </div>
                        <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                            <strong style={{ color: '#e74c3c' }}>Price Goes Down 📉</strong>
                            <p>When more people want to SELL the stock than buy it. Often happens during bad economic news or poor company performance.</p>
                        </div>
                    </div>
                </div>
            </div>

            {isCompleted ? (
                <div style={{ textAlign: 'center', marginTop: '40px', color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    ✅ You have completed the Beginner Module.
                </div>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button className="btn-primary" onClick={onComplete}>
                        ✅ Mark as Complete & Unlock Intermediate
                    </button>
                </div>
            )}
        </div>
    );
}
