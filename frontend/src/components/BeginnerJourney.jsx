import React, { useState, useEffect } from "react";

const taglines = [
    "Learn money before money controls you.",
    "Your journey to smart investing starts here.",
    "Build wealth with knowledge, not luck.",
    "Understand markets. Reduce fear.",
    "Investing made simple, safe, and smart."
];

export default function BeginnerJourney({ userLevel }) {
    const [started, setStarted] = useState(true);
    const [tagline, setTagline] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const random = taglines[Math.floor(Math.random() * taglines.length)];
        setTagline(random);

        // Sync with global dark mode
        const checkDarkMode = () => setIsDarkMode(document.body.classList.contains('dark-mode'));
        checkDarkMode(); // Initial check

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    const themeStyles = isDarkMode ? darkStyles : lightStyles;

    return (
        <div style={themeStyles.app}>


            {!started ? (
                <WelcomeScreen tagline={tagline} onStart={() => setStarted(true)} themeStyles={themeStyles} />
            ) : (
                <LearningDashboard userLevel={userLevel} themeStyles={themeStyles} isDarkMode={isDarkMode} />
            )}
        </div>
    );
}

/* ------------------ WELCOME SCREEN ------------------ */

function WelcomeScreen({ tagline, onStart, themeStyles }) {
    return (
        <div style={themeStyles.center}>
            <h1 style={themeStyles.mainHeading}>👋 Welcome to FinLearn</h1>
            <p style={themeStyles.tagline}>{tagline}</p>

            <button style={themeStyles.startBtn} onClick={onStart}>
                START LEARNING JOURNEY 🚀
            </button>
        </div>
    );
}

/* ------------------ DASHBOARD ------------------ */

function LearningDashboard({ userLevel, themeStyles, isDarkMode }) {
    // Determine initial state
    const isIntermediateUser = userLevel === 'Intermediate' || userLevel === 'Advanced';
    const [currentTab, setCurrentTab] = useState(isIntermediateUser ? 'Intermediate' : 'Beginner');
    const [beginnerCompleted, setBeginnerCompleted] = useState(isIntermediateUser); // Auto-complete for Intermediate users

    // Lock intermediate if user is beginner and hasn't completed module 1
    const isIntermediateLocked = !beginnerCompleted && !isIntermediateUser;

    const handleTabClick = (tab) => {
        if (tab === 'Intermediate' && isIntermediateLocked) {
            alert("🔒 Please complete the Beginner Module first!");
            return;
        }
        setCurrentTab(tab);
    };

    const handleCompleteBeginner = () => {
        setBeginnerCompleted(true);
        window.scrollTo(0, 0); // Scroll to top
        alert("🎉 Beginner Module Completed! Intermediate Module Unlocked.");
    };

    return (
        <div style={themeStyles.dashboardContainer}>
            <h2 style={themeStyles.heading}>Your Learning Dashboard</h2>

            <div style={themeStyles.tabContainer}>
                {!isIntermediateUser && (
                    <button
                        style={currentTab === 'Beginner' ? themeStyles.activeTab : themeStyles.tab}
                        onClick={() => handleTabClick('Beginner')}
                    >
                        🌱 Beginner Module
                    </button>
                )}
                <div style={{ position: 'relative' }}>
                    <button
                        style={currentTab === 'Intermediate' ? themeStyles.activeTab : themeStyles.tab}
                        onClick={() => handleTabClick('Intermediate')}
                    >
                        🚀 Intermediate Module
                        {isIntermediateLocked && <span style={{ marginLeft: '8px' }}>🔒</span>}
                    </button>
                </div>
            </div>

            {currentTab === 'Beginner' ? (
                <BeginnerModule
                    onComplete={handleCompleteBeginner}
                    isCompleted={beginnerCompleted}
                    themeStyles={themeStyles}
                    isDarkMode={isDarkMode}
                />
            ) : (
                <IntermediateModule themeStyles={themeStyles} />
            )}
        </div>
    );
}

/* ------------------ BEGINNER MODULE ------------------ */
function BeginnerModule({ onComplete, isCompleted, themeStyles, isDarkMode }) {
    return (
        <div style={themeStyles.module}>
            <h3 style={themeStyles.moduleTitle}>📘 MODULE 1: INVESTING MADE SIMPLE</h3>
            <p style={themeStyles.subTitle}>Everything You Need to Know Before You Invest</p>

            <div style={themeStyles.introSection}>
                <h4>👋 Welcome</h4>
                <p>
                    Before you invest even ₹1, it’s important to understand what investing really means.
                    This module will explain everything slowly, clearly, and with real-life examples.
                    <br /><br />
                    <strong>No technical words. No pressure. Just clarity.</strong>
                </p>
            </div>

            <h4 style={themeStyles.sectionTitle}>📺 Video Lesson 1: Stock Market Explained</h4>
            <div style={themeStyles.videoContainer}>
                <div style={themeStyles.videoWrapper}>
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/eNXZEcn-CEo"
                        title="Stock Market for Beginners"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={themeStyles.iframe}
                    ></iframe>
                </div>
            </div>

            <hr style={themeStyles.divider} />

            <div style={themeStyles.textContent}>

                <div style={themeStyles.sectionBlock}>
                    <h4 style={themeStyles.contentTitle}>1️⃣ What is Investing?</h4>
                    <div style={{ padding: '20px', backgroundColor: isDarkMode ? '#2c2c2c' : '#f9f9f9', borderRadius: '8px', borderLeft: '4px solid #666' }}>
                        <h5>📌 Simple Explanation</h5>
                        <p>
                            Investing is the act of allocating your money to different assets (like stocks, bonds, or real estate) with the expectation that it will grow over time.
                            Think of it as planting a seed. If you keep the seed in your pocket (saving), it stays a seed. If you plant it and water it (investing), it can grow into a tree that provides fruits for years.
                        </p>
                    </div>
                </div>

                <div style={themeStyles.sectionBlock}>
                    <h4 style={themeStyles.contentTitle}>2️⃣ Saving vs Investing vs Trading</h4>
                    <div style={themeStyles.gridContainer}>
                        <div style={themeStyles.termItem}>
                            <h6>🏦 Saving</h6>
                            <ul>
                                <li><strong>Goal:</strong> Safety & Liquidity</li>
                                <li><strong>Risk:</strong> Very Low</li>
                                <li><strong>Returns:</strong> Low (3-6%)</li>
                                <li><strong>Good for:</strong> Emergencies</li>
                            </ul>
                        </div>
                        <div style={themeStyles.termItem}>
                            <h6>📈 Investing</h6>
                            <ul>
                                <li><strong>Goal:</strong> Wealth Creation</li>
                                <li><strong>Risk:</strong> Moderate</li>
                                <li><strong>Returns:</strong> High (10-15%)</li>
                                <li><strong>Good for:</strong> Long-term goals</li>
                            </ul>
                        </div>
                        <div style={themeStyles.termItem}>
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

                <div style={themeStyles.sectionBlock}>
                    <h4 style={themeStyles.contentTitle}>3️⃣ What is a Stock?</h4>
                    <p>
                        A stock (or share) represents ownership in a company.
                    </p>
                    <ul style={{ lineHeight: '2' }}>
                        <li>When you buy a stock of Company X, you become a partial owner of Company X.</li>
                        <li>If the company makes a profit, the stock price usually goes up.</li>
                        <li>Some companies also share their profits directly with you in the form of <strong>Dividends</strong>.</li>
                    </ul>
                </div>

                <div style={themeStyles.sectionBlock}>
                    <h4 style={themeStyles.contentTitle}>4️⃣ Why Do Stock Prices Go Up and Down?</h4>
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

                <div style={themeStyles.sectionBlock}>
                    <h4 style={themeStyles.contentTitle}>... (Continue Reading)</h4>
                    <p>Make sure to read through all sections on NIFTY, SENSEX, and Diversification.</p>
                </div>

            </div>

            <div style={themeStyles.quizSection}>
                <h4>⭐ Final Message for Users</h4>
                <p>“Don’t rush to invest. Grow your understanding first.”</p>
            </div>

            <div style={themeStyles.completionBanner}>
                🎉 Module Complete! You now understand what investing really is.
            </div>

            {!isCompleted && (
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button style={themeStyles.button} onClick={onComplete}>
                        ✅ Mark as Complete & Unlock Intermediate
                    </button>
                </div>
            )}

            {isCompleted && (
                <div style={{ textAlign: 'center', marginTop: '20px', color: '#2ecc71', fontWeight: 'bold' }}>
                    ✅ You have completed this module.
                </div>
            )}
        </div>
    );
}

/* ------------------ INTERMEDIATE MODULE ------------------ */
function IntermediateModule({ themeStyles }) {
    return (
        <div style={themeStyles.module}>
            <h3 style={themeStyles.moduleTitle}>📘 MODULE 2: INTERMEDIATE INVESTING</h3>
            <p style={themeStyles.subTitle}>Making Smarter Investment Decisions</p>

            <div style={themeStyles.introSection}>
                <h4>👋 Welcome to the Intermediate Level</h4>
                <p>
                    You now understand what investing is. This module helps you choose better investments, handle market ups & downs, and build a simple portfolio.
                    <br /><br />
                    <strong>This is where confidence turns into clarity.</strong>
                </p>
            </div>

            <hr style={themeStyles.divider} />

            <div style={themeStyles.textContent}>
                {/* Section 1 */}
                <div style={themeStyles.sectionBlock}>
                    <h4 style={themeStyles.contentTitle}>1️⃣ How to Choose a Good Company</h4>
                    <div style={themeStyles.cardHighlight}>
                        <h5>📌 Simple Explanation</h5>
                        <ul style={{ paddingLeft: '20px' }}>
                            <li>Makes money consistently</li>
                            <li>Has a strong business model</li>
                            <li>Is trusted by customers</li>
                            <li>Has a clear future</li>
                        </ul>
                        <p style={{ marginTop: '10px' }}><em>You are not buying a price — you are buying a business.</em></p>
                    </div>

                    <div style={themeStyles.cardNormal}>
                        <h5>🏢 Real-Life Thinking</h5>
                        <p>Before investing, ask: <br /><strong>“Would I feel comfortable owning this business for 10 years?”</strong><br />If the answer is yes, it’s worth studying further.</p>
                    </div>

                    <h5>🔍 What to Check (Beginner-Friendly)</h5>
                    <div style={themeStyles.gridContainer}>
                        <div style={themeStyles.termItem}>
                            <h6>1. Business Understanding</h6>
                            <p>What does the company sell? Is it easy to understand? <br /><em>Example: Mobile data is easier to understand than complex chemicals.</em></p>
                        </div>
                        <div style={themeStyles.termItem}>
                            <h6>2. Profits</h6>
                            <p>Is the company making profit year after year? <br /><em>Example: A profitable shop is safer than one running in loss.</em></p>
                        </div>
                        <div style={themeStyles.termItem}>
                            <h6>3. Debt</h6>
                            <p>Does the company have manageable debt? <br /><em>Example: Less loan stress = peaceful life.</em></p>
                        </div>
                        <div style={themeStyles.termItem}>
                            <h6>4. Brand Trust</h6>
                            <p>Do people know and use this company? <br /><em>Example: TCS, HDFC, ITC are trusted brands.</em></p>
                        </div>
                    </div>
                </div>

                {/* Section 2 */}
                <div style={themeStyles.sectionBlock}>
                    <h4 style={themeStyles.contentTitle}>2️⃣ Mutual Funds Explained (Very Simple)</h4>
                    <div style={themeStyles.cardHighlight}>
                        <h5>📌 What is a Mutual Fund?</h5>
                        <p>A mutual fund is a basket of many stocks managed by a professional. Instead of choosing stocks yourself, an expert does it for you.</p>
                    </div>

                    <div style={themeStyles.cardNormal}>
                        <h5>🍱 Tiffin Box Example</h5>
                        <p>Instead of cooking many dishes yourself, you order a tiffin. Expert cooks prepare balanced food. That’s how mutual funds work.</p>
                    </div>

                    <h5>📊 Types of Mutual Funds (Simple View)</h5>
                    <div style={themeStyles.gridContainer}>
                        <div style={themeStyles.termItem}>
                            <h6>Equity Mutual Funds</h6>
                            <ul>
                                <li>Invest mostly in stocks</li>
                                <li>Higher growth potential</li>
                                <li>Best for long-term goals</li>
                            </ul>
                        </div>
                        <div style={themeStyles.termItem}>
                            <h6>Debt Mutual Funds</h6>
                            <ul>
                                <li>Invest in bonds</li>
                                <li>Lower risk</li>
                                <li>Lower returns</li>
                            </ul>
                        </div>
                        <div style={themeStyles.termItem}>
                            <h6>Hybrid Mutual Funds</h6>
                            <ul>
                                <li>Mix of equity and debt</li>
                                <li>Balanced risk</li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                        <strong>👶 Who Should Choose Mutual Funds?</strong> Beginners, People with limited time, and those who prefer less stress.
                    </div>
                </div>

                {/* Section 3 */}
                <div style={themeStyles.sectionBlock}>
                    <h4 style={themeStyles.contentTitle}>3️⃣ Market Crashes & How to React</h4>
                    <div style={themeStyles.cardHighlight}>
                        <h5>📌 What is a Market Crash?</h5>
                        <p>A market crash is when stock prices fall sharply due to economic problems, global events, or fear. <strong>Crashes are normal, not permanent.</strong></p>
                    </div>

                    <div style={themeStyles.cardNormal}>
                        <h5>📉 Real-Life Example</h5>
                        <p>During exams, a bad test doesn’t mean your entire career is over. Similarly, a market fall doesn’t mean investing has failed.</p>
                    </div>

                    <div style={themeStyles.gridContainer}>
                        <div style={{ ...themeStyles.termItem, borderLeft: '5px solid #ef5350' }}>
                            <h6>❌ Common Wrong Reactions</h6>
                            <ul>
                                <li>Panic selling</li>
                                <li>Stopping investments completely</li>
                                <li>Believing “market is finished”</li>
                            </ul>
                        </div>
                        <div style={{ ...themeStyles.termItem, borderLeft: '5px solid #66bb6a' }}>
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
                <div style={themeStyles.sectionBlock}>
                    <h4 style={themeStyles.contentTitle}>4️⃣ Building a Simple Portfolio</h4>
                    <p>A portfolio is all your investments together. Good portfolios are Balanced, Diversified, and Goal-oriented.</p>

                    <div style={themeStyles.cardGreen}>
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
                <div style={themeStyles.sectionBlock}>
                    <h4 style={themeStyles.contentTitle}>5️⃣ Risk Profiling (Know Yourself)</h4>
                    <p>Not everyone can handle market ups & downs.</p>
                    <div style={themeStyles.gridContainer}>
                        <div style={themeStyles.termItem}>
                            <h6>Conservative</h6>
                            <p>Prefers safety</p>
                        </div>
                        <div style={themeStyles.termItem}>
                            <h6>Balanced</h6>
                            <p>Mix of growth and safety</p>
                        </div>
                        <div style={themeStyles.termItem}>
                            <h6>Aggressive</h6>
                            <p>Comfortable with volatility</p>
                        </div>
                    </div>
                    <p style={{ marginTop: '15px' }}>🧠 <strong>Example:</strong> If market falls 20% and you lose sleep → you need lower risk.</p>
                </div>

                {/* Section 6 & 7 */}
                <div style={themeStyles.sectionBlock}>
                    <h4 style={themeStyles.contentTitle}>6️⃣ How Often Should You Track?</h4>
                    <div style={themeStyles.cardNormal}>
                        <ul>
                            <li>Don’t check daily</li>
                            <li>Review quarterly or half-yearly</li>
                        </ul>
                        <p>📱 <strong>Real-Life Example:</strong> Checking stock prices daily is like checking your weight every hour — unnecessary stress.</p>
                    </div>
                </div>

                <div style={themeStyles.sectionBlock}>
                    <h4 style={themeStyles.contentTitle}>7️⃣ Common Intermediate Mistakes</h4>
                    <div style={themeStyles.gridContainer}>
                        <div style={{ ...themeStyles.termItem, borderLeft: '5px solid #ef5350' }}>
                            <h6>❌ Mistakes</h6>
                            <ul>
                                <li>Over-diversification</li>
                                <li>Chasing high returns</li>
                                <li>Ignoring asset allocation</li>
                                <li>Changing strategy frequently</li>
                            </ul>
                        </div>
                        <div style={{ ...themeStyles.termItem, borderLeft: '5px solid #66bb6a' }}>
                            <h6>✅ Better Approach</h6>
                            <ul>
                                <li>Keep it simple</li>
                                <li>Stick to plan</li>
                                <li>Learn continuously</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

            <div style={themeStyles.quizSection}>
                <h4>🎉 Module Complete!</h4>
                <p>You now know how to choose good companies, how mutual funds work, how to handle market crashes, and how to build a basic portfolio.</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '15px' }}>“Smart investing is not about being perfect — it’s about being prepared.”</p>
            </div>
        </div>
    );
}

/* ------------------ STYLES ------------------ */

// Light Theme
const lightStyles = {
    app: {
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f8fafc", // Very light slate
        minHeight: "100vh",
        color: "#1e293b",
        transition: "all 0.3s ease",
        maxWidth: "1200px",
        margin: "0 auto",
        borderRadius: "12px"
    },
    themeToggleContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '10px'
    },
    themeButton: {
        background: 'none',
        border: '1px solid #cbd5e1',
        borderRadius: '20px',
        padding: '8px 16px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        color: '#475569'
    },
    center: { textAlign: "center", marginTop: "50px", paddingBottom: "50px" },
    mainHeading: { color: "#0f172a", fontSize: "2.5rem", marginBottom: "1rem" },
    tagline: { fontStyle: "italic", color: "#64748b", marginBottom: "30px", fontSize: "1.2rem" },
    startBtn: { padding: "15px 30px", fontSize: "16px", backgroundColor: "#0d9488", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", fontWeight: '600' },

    dashboardContainer: { padding: "10px" },
    heading: { color: "#0f172a", marginBottom: "20px", textAlign: "center", fontSize: "2rem", fontWeight: '700' },

    tabContainer: { display: "flex", justifyContent: "center", gap: "20px", marginBottom: "30px" },
    tab: { padding: "10px 24px", fontSize: "16px", backgroundColor: "transparent", color: "#64748b", border: "2px solid #e2e8f0", borderRadius: "30px", cursor: "pointer", fontWeight: "600", transition: 'all 0.2s' },
    activeTab: { padding: "10px 24px", fontSize: "16px", backgroundColor: "#0d9488", color: "#fff", border: "2px solid #0d9488", borderRadius: "30px", cursor: "pointer", boxShadow: "0 4px 10px rgba(13, 148, 136, 0.2)", fontWeight: "600" },

    module: { backgroundColor: "#fff", padding: "40px", borderRadius: "24px", marginTop: "10px", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" },
    moduleTitle: { fontSize: "2rem", color: "#0f172a", margin: "0 0 10px 0", textAlign: "center", fontWeight: "800" },
    subTitle: { textAlign: "center", color: "#64748b", fontSize: "1.1rem", marginBottom: "40px" },

    // Updated: No background color, just clean typography and left border
    introSection: { fontSize: "1.1rem", lineHeight: "1.8", color: "#334155", marginBottom: "40px", padding: "10px 20px", borderLeft: "4px solid #0d9488" },

    sectionTitle: { fontSize: "1.5rem", color: "#0f172a", marginTop: "50px", marginBottom: "25px", textAlign: "center", fontWeight: "700" },
    videoContainer: { display: "flex", justifyContent: "center", marginBottom: "40px", width: "100%" },
    videoWrapper: { width: "100%", maxWidth: "800px", aspectRatio: "16 / 9", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", backgroundColor: "#000" },
    iframe: { width: "100%", height: "100%" },

    textContent: { maxWidth: "850px", margin: "0 auto", lineHeight: "1.8", color: "#334155", fontSize: "1.1rem" },
    contentTitle: { fontSize: "1.5rem", marginBottom: "20px", color: "#0f172a", marginTop: "0", fontWeight: '700' },
    sectionBlock: { marginBottom: "50px" },

    // cards with NO background, just border highlights
    cardHighlight: { padding: "20px", borderLeft: "4px solid #f59e0b", marginBottom: "20px", color: "#334155" },
    cardGreen: { padding: "20px", borderLeft: "4px solid #10b981", marginBottom: "20px", color: "#334155" },
    cardNormal: { padding: "20px", borderLeft: "4px solid #94a3b8", marginBottom: "20px", color: "#334155" },

    gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px", marginTop: "25px" },
    // termItem needs to be visible. Light mode: white bg with shadow.
    termItem: { backgroundColor: "#fff", padding: "25px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", color: "#334155" },

    divider: { border: "0", height: "1px", backgroundColor: "#e2e8f0", margin: "60px 0" },

    // Quiz section can stay subtle or also remove bg
    quizSection: { textAlign: "center", marginTop: "60px", padding: "40px", border: "2px dashed #e2e8f0", borderRadius: "20px", color: "#334155" },
    completionBanner: { marginTop: "40px", padding: "20px", backgroundColor: "#10b981", color: "white", textAlign: "center", borderRadius: "12px", fontSize: "1.2rem", fontWeight: "bold", boxShadow: "0 10px 20px rgba(16, 185, 129, 0.2)" },

    button: { padding: "15px 30px", fontSize: "16px", backgroundColor: "#0d9488", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 4px 6px rgba(13, 148, 136, 0.2)", fontWeight: "600" },
    answerBox: { marginTop: "15px", padding: "15px", borderLeft: "4px solid #0d9488", display: "inline-block", color: "#334155", fontWeight: "600" }
};

// Dark Theme
const darkStyles = {
    ...lightStyles,
    app: { ...lightStyles.app, backgroundColor: "#0f172a", color: "#f8fafc" },
    themeButton: { ...lightStyles.themeButton, color: "#94a3b8", border: "1px solid #334155" },
    center: { ...lightStyles.center, color: "#f8fafc" },
    mainHeading: { ...lightStyles.mainHeading, color: "#f8fafc" },
    tagline: { ...lightStyles.tagline, color: "#94a3b8" },

    heading: { ...lightStyles.heading, color: "#f8fafc" },
    tab: { ...lightStyles.tab, color: "#94a3b8", border: "2px solid #334155" },

    module: { ...lightStyles.module, backgroundColor: "#1e293b", border: "1px solid #334155", boxShadow: "none" },
    moduleTitle: { ...lightStyles.moduleTitle, color: "#2dd4bf" }, // Teal-400
    subTitle: { ...lightStyles.subTitle, color: "#94a3b8" }, // Slate-400
    introSection: { ...lightStyles.introSection, color: "#e2e8f0", borderLeft: "4px solid #2dd4bf" },

    sectionTitle: { ...lightStyles.sectionTitle, color: "#60a5fa" }, // Blue-400
    textContent: { ...lightStyles.textContent, color: "#cbd5e1" }, // Slate-300
    contentTitle: { ...lightStyles.contentTitle, color: "#f8fafc" }, // Slate-50

    // Dark mode cards: Transparent bg, just border. Ensure text is light.
    cardHighlight: { ...lightStyles.cardHighlight, color: "#e2e8f0", borderLeft: "4px solid #fbbf24" }, // Amber-400 border
    cardGreen: { ...lightStyles.cardGreen, color: "#e2e8f0", borderLeft: "4px solid #34d399" }, // Emerald-400 border
    cardNormal: { ...lightStyles.cardNormal, color: "#e2e8f0", borderLeft: "4px solid #94a3b8" }, // Slate-400 border

    // Grid items need a dark background to pop against the main dark bg, or border.
    termItem: { ...lightStyles.termItem, backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0", boxShadow: "none" },

    divider: { ...lightStyles.divider, backgroundColor: "#334155" },
    quizSection: { ...lightStyles.quizSection, border: "2px dashed #334155", color: "#e2e8f0" },

    answerBox: { ...lightStyles.answerBox, color: "#e2e8f0", borderLeft: "4px solid #2dd4bf" }
};
