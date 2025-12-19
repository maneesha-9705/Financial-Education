import React, { useState } from 'react';

const RiskAssessment = () => {
    const [step, setStep] = useState(0);
    const [scores, setScores] = useState({});
    const [result, setResult] = useState(null);

    const questions = [
        {
            id: 1,
            text: "When you think about investing, what is your main priority?",
            options: [
                { label: "Keeping my money safe, even if returns are low.", points: 1 },
                { label: "A balance between safety and growth.", points: 2 },
                { label: "Maximizing potential returns, even if I lose some money.", points: 3 }
            ]
        },
        {
            id: 2,
            text: "How would you react if your portfolio dropped 20% in one month?",
            options: [
                { label: "I would sell everything immediately.", points: 1 },
                { label: "I would worry but keep holding.", points: 2 },
                { label: "I would see it as a buying opportunity.", points: 3 }
            ]
        },
        {
            id: 3,
            text: "How long do you plan to keep your money invested?",
            options: [
                { label: "Less than 3 years.", points: 1 },
                { label: "3 to 7 years.", points: 2 },
                { label: "More than 7 years.", points: 3 }
            ]
        },
        {
            id: 4,
            text: "Which scenario would you prefer?",
            options: [
                { label: "A guaranteed 5% return.", points: 1 },
                { label: "A 50/50 chance of 12% return or 2% return.", points: 2 },
                { label: "A 20% potential return with a risk of losing 10%.", points: 3 }
            ]
        },
        {
            id: 5,
            text: "How stable is your current income?",
            options: [
                { label: "Unpredictable / Freelance.", points: 1 },
                { label: "Moderately stable.", points: 2 },
                { label: "Very stable / secure.", points: 3 }
            ]
        }
    ];

    const handleOptionSelect = (points) => {
        const newScores = { ...scores, [step]: points };
        setScores(newScores);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            calculateResult(newScores);
        }
    };

    const calculateResult = (finalScores) => {
        const total = Object.values(finalScores).reduce((a, b) => a + b, 0);
        let profile = "";
        let description = "";

        if (total <= 7) {
            profile = "Conservative";
            description = "You prioritize safety over returns. You prefer stable investments like bonds, FDs, or high-yield savings. Sudden market drops make you uncomfortable.";
        } else if (total <= 11) {
            profile = "Moderate";
            description = "You want a balance. You're willing to accept some fluctuations for better growth but still want a safety net. A mix of index funds and bonds suits you.";
        } else {
            profile = "Aggressive";
            description = "You are a growth seeker. You understand that markets go up and down and are willing to ride out potential losses for maximizing long-term wealth. Stocks and high-growth funds are your playground.";
        }
        setResult({ profile, description, total });
    };

    const resetQuiz = () => {
        setStep(0);
        setScores({});
        setResult(null);
    };

    return (
        <div className="tool-content">
            <div className="tool-intro">
                <h2>Risk Tolerance Assessment</h2>
                <p>
                    Understanding your risk profile is the first step in building a portfolio that lets you sleep at night.
                    Take this short quiz to find out what kind of investor you are.
                </p>
            </div>

            <div className="assessment-container">
                {!result ? (
                    <div className="quiz-box">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>
                        </div>
                        <h3 className="question-number">Question {step + 1} of {questions.length}</h3>
                        <h4 className="quiz-question">{questions[step].text}</h4>

                        <div className="options-list">
                            {questions[step].options.map((opt, idx) => (
                                <button key={idx} className="quiz-option" onClick={() => handleOptionSelect(opt.points)}>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="result-box">
                        <div className="result-header">
                            <span className="result-label">Your Profile Is</span>
                            <h2 className={`profile-name ${result.profile.toLowerCase()}`}>{result.profile}</h2>
                        </div>
                        <p className="result-desc">{result.description}</p>

                        <div className="recommendation-box">
                            <h4>Recommended Learning Path</h4>
                            <p>Based on your <strong>{result.profile}</strong> profile, we suggest starting with our
                                {result.profile === 'Conservative' ? ' "Wealth Preservation & Bonds" ' :
                                    result.profile === 'Moderate' ? ' "Balanced Portfolio Construction" ' :
                                        ' "Growth Investing & Stock Markets" '}
                                modules.</p>
                        </div>

                        <button className="btn-reset" onClick={resetQuiz}>Retake Quiz</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiskAssessment;
