
import React from 'react';
import LearningJourneyWrapper from './LearningJourneyWrapper';

export function IntermediateModuleContent() {
    return (
        <div className="journey-module">
            <h3 className="module-title">📘 MODULE 2: INTERMEDIATE INVESTING</h3>
            <p className="module-subtitle">Making Smarter Investment Decisions</p>

            <div className="intro-section">
                <h4>👋 Welcome to the Intermediate Level</h4>
                <p>
                    You now understand what investing is. This module helps you choose better investments, handle market ups & downs, and build a simple portfolio.
                    <br /><br />
                    <strong>This is where confidence turns into clarity.</strong>
                </p>
            </div>

            <hr className="divider" />

            <div className="text-content">
                {/* Section 1 */}
                <div className="section-block">
                    <h4 className="content-title">1️⃣ How to Choose a Good Company</h4>
                    <div className="card-highlight">
                        <h5>📌 Simple Explanation</h5>
                        <ul style={{ paddingLeft: '20px' }}>
                            <li>Makes money consistently</li>
                            <li>Has a strong business model</li>
                            <li>Is trusted by customers</li>
                            <li>Has a clear future</li>
                        </ul>
                        <p style={{ marginTop: '10px' }}><em>You are not buying a price — you are buying a business.</em></p>
                    </div>

                    <div className="card-normal">
                        <h5>🏢 Real-Life Thinking</h5>
                        <p>Before investing, ask: <br /><strong>“Would I feel comfortable owning this business for 10 years?”</strong><br />If the answer is yes, it’s worth studying further.</p>
                    </div>

                    <h5>🔍 What to Check (Beginner-Friendly)</h5>
                    <div className="grid-container">
                        <div className="term-item">
                            <h6>1. Business Understanding</h6>
                            <p>What does the company sell? Is it easy to understand? <br /><em>Example: Mobile data is easier to understand than complex chemicals.</em></p>
                        </div>
                        <div className="term-item">
                            <h6>2. Profits</h6>
                            <p>Is the company making profit year after year? <br /><em>Example: A profitable shop is safer than one running in loss.</em></p>
                        </div>
                        <div className="term-item">
                            <h6>3. Debt</h6>
                            <p>Does the company have manageable debt? <br /><em>Example: Less loan stress = peaceful life.</em></p>
                        </div>
                        <div className="term-item">
                            <h6>4. Brand Trust</h6>
                            <p>Do people know and use this company? <br /><em>Example: TCS, HDFC, ITC are trusted brands.</em></p>
                        </div>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="section-block">
                    <h4 className="content-title">2️⃣ Mutual Funds Explained (Very Simple)</h4>
                    <div className="card-highlight">
                        <h5>📌 What is a Mutual Fund?</h5>
                        <p>A mutual fund is a basket of many stocks managed by a professional. Instead of choosing stocks yourself, an expert does it for you.</p>
                    </div>

                    <div className="card-normal">
                        <h5>🍱 Tiffin Box Example</h5>
                        <p>Instead of cooking many dishes yourself, you order a tiffin. Expert cooks prepare balanced food. That’s how mutual funds work.</p>
                    </div>

                    <h5>📊 Types of Mutual Funds (Simple View)</h5>
                    <div className="grid-container">
                        <div className="term-item">
                            <h6>Equity Mutual Funds</h6>
                            <ul>
                                <li>Invest mostly in stocks</li>
                                <li>Higher growth potential</li>
                                <li>Best for long-term goals</li>
                            </ul>
                        </div>
                        <div className="term-item">
                            <h6>Debt Mutual Funds</h6>
                            <ul>
                                <li>Invest in bonds</li>
                                <li>Lower risk</li>
                                <li>Lower returns</li>
                            </ul>
                        </div>
                        <div className="term-item">
                            <h6>Hybrid Mutual Funds</h6>
                            <ul>
                                <li>Mix of equity and debt</li>
                                <li>Balanced risk</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="section-block">
                    <h4 className="content-title">3️⃣ Market Crashes & How to React</h4>
                    <div className="card-highlight">
                        <h5>📌 What is a Market Crash?</h5>
                        <p>A market crash is when stock prices fall sharply due to economic problems, global events, or fear. <strong>Crashes are normal, not permanent.</strong></p>
                    </div>

                    <div className="card-normal">
                        <h5>📉 Real-Life Example</h5>
                        <p>During exams, a bad test doesn’t mean your entire career is over. Similarly, a market fall doesn’t mean investing has failed.</p>
                    </div>

                    <div className="grid-container">
                        <div className="term-item" style={{ borderLeft: '5px solid #ef5350' }}>
                            <h6>❌ Common Wrong Reactions</h6>
                            <ul>
                                <li>Panic selling</li>
                                <li>Stopping investments completely</li>
                                <li>Believing “market is finished”</li>
                            </ul>
                        </div>
                        <div className="term-item" style={{ borderLeft: '5px solid #66bb6a' }}>
                            <h6>✅ Smart Reactions</h6>
                            <ul>
                                <li>Stay calm</li>
                                <li>Continue learning</li>
                                <li>Review fundamentals</li>
                                <li>Invest gradually if possible</li>
                            </ul>
                        </div>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>Markets reward patience, not panic.</p>
                </div>

                {/* Section 4 */}
                <div className="section-block">
                    <h4 className="content-title">4️⃣ Building a Simple Portfolio</h4>
                    <p>A portfolio is all your investments together. Good portfolios are Balanced, Diversified, and Goal-oriented.</p>

                    <div className="card-green">
                        <h5>🧩 Simple Beginner Portfolio Example</h5>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            <li style={{ padding: '8px', borderBottom: '1px solid #c8e6c9', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Equity Mutual Funds</span> <strong>50%</strong>
                            </li>
                            <li style={{ padding: '8px', borderBottom: '1px solid #c8e6c9', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Large-cap Stocks</span> <strong>30%</strong>
                            </li>
                            <li style={{ padding: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Debt / Fixed income</span> <strong>20%</strong>
                            </li>
                        </ul>
                        <p style={{ marginTop: '10px', fontSize: '0.9rem' }}><em>This reduces risk and stress.</em></p>
                    </div>
                </div>

                {/* Section 5 */}
                <div className="section-block">
                    <h4 className="content-title">5️⃣ Risk Profiling (Know Yourself)</h4>
                    <p>Not everyone can handle market ups & downs.</p>
                    <div className="grid-container">
                        <div className="term-item">
                            <h6> Conservative</h6>
                            <p>Prefers safety</p>
                        </div>
                        <div className="term-item">
                            <h6> Balanced</h6>
                            <p>Mix of growth and safety</p>
                        </div>
                        <div className="term-item">
                            <h6> Aggressive</h6>
                            <p>Comfortable with volatility</p>
                        </div>
                    </div>
                    <p style={{ marginTop: '15px' }}>🧠 <strong>Example:</strong> If market falls 20% and you lose sleep → you need lower risk.</p>
                </div>

                <div className="section-block">
                    <h4 className="content-title">6️⃣ How Often Should You Track?</h4>
                    <div className="card-normal">
                        <ul>
                            <li>Don’t check daily</li>
                            <li>Review quarterly or half-yearly</li>
                        </ul>
                        <p>📱 <strong>Real-Life Example:</strong> Checking stock prices daily is like checking your weight every hour — unnecessary stress.</p>
                    </div>
                </div>
            </div>

            <div className="completion-banner">
                🎉 Module Complete! You now understand more about the markets.
            </div>
        </div>
    );
}

export default function IntermediateModule({ dailyQuote }) {
    return (
        <LearningJourneyWrapper title="Intermediate Learning" dailyQuote={dailyQuote}>
            <IntermediateModuleContent />
        </LearningJourneyWrapper>
    );
}
