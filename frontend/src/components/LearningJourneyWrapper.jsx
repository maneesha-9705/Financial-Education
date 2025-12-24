
import React, { useState, useEffect } from "react";
import './LearningJourney.css';

const taglines = [
    "Learn money before money controls you.",
    "Your journey to smart investing starts here.",
    "Build wealth with knowledge, not luck.",
    "Understand markets. Reduce fear.",
    "Investing made simple, safe, and smart."
];

export default function LearningJourneyWrapper({ children, title, dailyQuote }) {
    const [tagline, setTagline] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const random = taglines[Math.floor(Math.random() * taglines.length)];
        setTagline(random);

        const checkDarkMode = () => setIsDarkMode(document.body.classList.contains('dark-mode'));
        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    return (
        <div className={`journey-container ${isDarkMode ? 'dark' : 'light'}`}>
            <div className="journey-header">
                <h1 className="journey-title">{title || "Your Learning Journey"}</h1>
                <p className="journey-tagline">{tagline}</p>
            </div>

            {dailyQuote && (
                <div className="daily-quote-box">
                    "{dailyQuote.text}" — <span style={{ fontWeight: '600', color: '#0d9488' }}>{dailyQuote.author}</span>
                </div>
            )}

            {children}
        </div>
    );
}
