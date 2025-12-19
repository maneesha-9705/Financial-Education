import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LoanPayoff = () => {
    const [loanBalance, setLoanBalance] = useState(500000); // 5 Lakhs
    const [interestRate, setInterestRate] = useState(9.5);
    const [loanTerm, setLoanTerm] = useState(20); // Years
    const [extraPayment, setExtraPayment] = useState(2000); // Monthly

    const calculateAmortization = (principal, rate, years, extra = 0) => {
        const r = rate / 100 / 12;
        const n = years * 12;
        // Standard EMI Formula
        const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

        let balance = principal;
        let totalInterest = 0;
        let months = 0;

        while (balance > 0 && months < n * 2) { // Safety cap
            const interest = balance * r;
            let principalPaid = (emi + extra) - interest;

            if (balance < principalPaid) {
                // Last payment
                principalPaid = balance;
            }

            balance -= principalPaid;
            totalInterest += interest;
            months++;

            if (balance <= 0.1) break;
        }

        return { totalInterest, months, emi };
    };

    const normalPlan = useMemo(() => calculateAmortization(loanBalance, interestRate, loanTerm, 0), [loanBalance, interestRate, loanTerm]);
    const acceleratedPlan = useMemo(() => calculateAmortization(loanBalance, interestRate, loanTerm, extraPayment), [loanBalance, interestRate, loanTerm, extraPayment]);

    const savedInterest = normalPlan.totalInterest - acceleratedPlan.totalInterest;
    const timeSavedMonths = normalPlan.months - acceleratedPlan.months;
    const timeSavedYears = (timeSavedMonths / 12).toFixed(1);

    const chartData = [
        {
            name: 'Total Paid',
            Standard: Math.round(loanBalance + normalPlan.totalInterest),
            Accelerated: Math.round(loanBalance + acceleratedPlan.totalInterest),
        },
        {
            name: 'Interest Only',
            Standard: Math.round(normalPlan.totalInterest),
            Accelerated: Math.round(acceleratedPlan.totalInterest),
        }
    ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="tool-content">
            <div className="tool-intro">
                <h2>Loan Payoff Calculator</h2>
                <p>
                    Struggling with debt? See how adding just a little extra to your monthly EMI can slash years off your loan and save you lakhs in interest.
                </p>
            </div>

            <div className="calculator-grid">
                <div className="controls-section">
                    <div className="input-group">
                        <label>Current Loan Balance</label>
                        <div className="input-with-value">
                            <input
                                type="range"
                                min="100000"
                                max="10000000"
                                step="100000"
                                value={loanBalance}
                                onChange={(e) => setLoanBalance(Number(e.target.value))}
                                className="premium-range"
                            />
                            <span className="value-display">{formatCurrency(loanBalance)}</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Interest Rate (%)</label>
                        <div className="input-with-value">
                            <input
                                type="range"
                                min="5"
                                max="20"
                                step="0.1"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="premium-range"
                            />
                            <span className="value-display">{interestRate}%</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Loan Term (Years)</label>
                        <div className="input-with-value">
                            <input
                                type="range"
                                min="1"
                                max="30"
                                step="1"
                                value={loanTerm}
                                onChange={(e) => setLoanTerm(Number(e.target.value))}
                                className="premium-range"
                            />
                            <span className="value-display">{loanTerm} Yr</span>
                        </div>
                    </div>

                    <div className="input-group highlight-input">
                        <label>Extra Monthly Payment</label>
                        <div className="input-with-value">
                            <input
                                type="range"
                                min="0"
                                max="50000"
                                step="500"
                                value={extraPayment}
                                onChange={(e) => setExtraPayment(Number(e.target.value))}
                                className="premium-range"
                            />
                            <span className="value-display">{formatCurrency(extraPayment)}</span>
                        </div>
                        <p className="helper-text">Add this to your EMI to crush debt faster!</p>
                    </div>
                </div>

                <div className="results-section">
                    <div className="payoff-summary">
                        <div className="payoff-stat success-box">
                            <span>Total Interest Saved</span>
                            <h3>{formatCurrency(savedInterest)}</h3>
                        </div>
                        <div className="payoff-stat info-box">
                            <span>Time Saved</span>
                            <h3>{timeSavedYears} Years</h3>
                        </div>
                        <div className="payoff-stat">
                            <span>New Payoff Date</span>
                            <p>In {Math.floor(acceleratedPlan.months / 12)} Years {acceleratedPlan.months % 12} Months</p>
                        </div>
                    </div>

                    <div className="chart-container">
                        <h4>Standard vs. Accelerated</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="Standard" fill="#94a3b8" barSize={20} />
                                <Bar dataKey="Accelerated" fill="#10b981" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanPayoff;
