import React, { useState } from 'react';
import './Tools.css';
import CompoundInterest from '../components/tools/CompoundInterest';
import BudgetPlanner from '../components/tools/BudgetPlanner';
import LoanPayoff from '../components/tools/LoanPayoff';
import RiskAssessment from '../components/tools/RiskAssessment';

const Tools = () => {
    const [activeTab, setActiveTab] = useState('compound');

    const renderTool = () => {
        switch (activeTab) {
            case 'compound': return <CompoundInterest />;
            case 'budget': return <BudgetPlanner />;
            case 'loan': return <LoanPayoff />;
            case 'risk': return <RiskAssessment />;
            default: return <CompoundInterest />;
        }
    };

    return (
        <div className="tools-page">
            <div className="tools-header-main">
                <h1 className="main-title">Financial Toolkit</h1>
                <p className="main-subtitle">Interactive tools to plan, calculate, and optimize your financial future.</p>
            </div>

            <div className="tools-layout">
                {/* Navigation Sidebar / Tabs */}
                <div className="tools-nav">
                    <button
                        className={`nav-item ${activeTab === 'compound' ? 'active' : ''}`}
                        onClick={() => setActiveTab('compound')}
                    >
                        <span className="icon">📈</span>
                        <div className="nav-text">
                            <span className="title">Compound Interest</span>
                            <span className="desc">Project your wealth growth</span>
                        </div>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'budget' ? 'active' : ''}`}
                        onClick={() => setActiveTab('budget')}
                    >
                        <span className="icon">⚖️</span>
                        <div className="nav-text">
                            <span className="title">Budget Planner</span>
                            <span className="desc">50/30/20 Rule</span>
                        </div>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'loan' ? 'active' : ''}`}
                        onClick={() => setActiveTab('loan')}
                    >
                        <span className="icon">💸</span>
                        <div className="nav-text">
                            <span className="title">Loan Payoff</span>
                            <span className="desc">Debt freedom calculator</span>
                        </div>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'risk' ? 'active' : ''}`}
                        onClick={() => setActiveTab('risk')}
                    >
                        <span className="icon">🧠</span>
                        <div className="nav-text">
                            <span className="title">Risk Assessment</span>
                            <span className="desc">Find your investor profile</span>
                        </div>
                    </button>
                </div>

                {/* Active Tool Display */}
                <div className="tool-display-area">
                    {renderTool()}
                </div>
            </div>
        </div>
    );
};

export default Tools;
