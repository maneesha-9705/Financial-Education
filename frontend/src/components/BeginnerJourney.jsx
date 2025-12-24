
import React, { useState, useEffect } from "react";
import axios from 'axios';
import LearningJourneyWrapper from './LearningJourneyWrapper';
import BeginnerModule from './BeginnerModule';
import { IntermediateModuleContent } from './IntermediateModule';

export default function BeginnerJourney({ userLevel, dailyQuote }) {
    const [currentTab, setCurrentTab] = useState('Beginner');
    const [beginnerCompleted, setBeginnerCompleted] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => setIsDarkMode(document.body.classList.contains('dark-mode'));
        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const handleCompleteBeginner = async () => {
        setBeginnerCompleted(true);
        window.scrollTo(0, 0);

        // Update Backend
        try {
            const userId = sessionStorage.getItem('financial_user_id');
            if (userId) {
                await axios.patch(`/users/${userId}`, {
                    learningLevel: 'Intermediate'
                });
                alert("🎉 Beginner Module Completed! You are now an Intermediate Investor.");
            }
        } catch (error) {
            console.error("Failed to update learning level:", error);
            alert("🎉 Beginner Module Completed! (Error syncing to profile)");
        }
    };

    const handleTabClick = (tab) => {
        if (tab === 'Intermediate' && !beginnerCompleted) {
            alert("🔒 Please complete the Beginner Module first!");
            return;
        }
        setCurrentTab(tab);
    };

    return (
        <LearningJourneyWrapper title="Beginner Journey" dailyQuote={dailyQuote}>
            <div className="tab-container">
                <button
                    className={`journey-tab ${currentTab === 'Beginner' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Beginner')}
                >
                    🌱 Beginner Module
                </button>
                <button
                    className={`journey-tab ${currentTab === 'Intermediate' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Intermediate')}
                >
                    🚀 Intermediate Module {!beginnerCompleted && '🔒'}
                </button>
            </div>

            {currentTab === 'Beginner' ? (
                <BeginnerModule
                    onComplete={handleCompleteBeginner}
                    isCompleted={beginnerCompleted}
                    isDarkMode={isDarkMode}
                />
            ) : (
                <IntermediateModuleContent />
            )}
        </LearningJourneyWrapper>
    );
}
