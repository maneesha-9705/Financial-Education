import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const BudgetPlanner = () => {
    const [monthlyIncome, setMonthlyIncome] = useState(50000);

    const needs = monthlyIncome * 0.50;
    const wants = monthlyIncome * 0.30;
    const savings = monthlyIncome * 0.20;

    const data = [
        { name: 'Needs (50%)', value: needs, color: '#3b82f6' }, // Blue
        { name: 'Wants (30%)', value: wants, color: '#f59e0b' }, // Amber
        { name: 'Savings (20%)', value: savings, color: '#10b981' }, // Green
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
                <h2>Budget Planner (50/30/20 Rule)</h2>
                <p>
                    Simplify your budgeting with the classic 50/30/20 rule. Allocate your after-tax income into Needs, Wants, and Savings to maintain financial success.
                </p>
            </div>

            <div className="calculator-grid">
                <div className="controls-section">
                    <div className="input-group">
                        <label>Monthly After-Tax Income</label>
                        <div className="input-with-value">
                            <input
                                type="range"
                                min="10000"
                                max="500000"
                                step="1000"
                                value={monthlyIncome}
                                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                                className="premium-range"
                            />
                            <span className="value-display">{formatCurrency(monthlyIncome)}</span>
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex' }}>
                            <p className="helper-text">Enter your total take-home pay for the month.</p>
                        </div>
                    </div>

                    <div className="budget-breakdown">
                        <div className="budget-item" style={{ borderLeftColor: '#3b82f6' }}>
                            <h4>Needs (50%)</h4>
                            <p className="amount">{formatCurrency(needs)}</p>
                            <ul>
                                <li>Rent / Mortgage</li>
                                <li>Groceries & Utilities</li>
                                <li>Insurance & Transportation</li>
                            </ul>
                        </div>
                        <div className="budget-item" style={{ borderLeftColor: '#f59e0b' }}>
                            <h4>Wants (30%)</h4>
                            <p className="amount">{formatCurrency(wants)}</p>
                            <ul>
                                <li>Dining Out & Entertainment</li>
                                <li>Hobbies & Shopping</li>
                                <li>Streaming Services</li>
                            </ul>
                        </div>
                        <div className="budget-item" style={{ borderLeftColor: '#10b981' }}>
                            <h4>Savings (20%)</h4>
                            <p className="amount">{formatCurrency(savings)}</p>
                            <ul>
                                <li>Emergency Fund</li>
                                <li>Investments (SIPs)</li>
                                <li>Debt Repayment</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="results-section">
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend toggle={false} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="advice-card">
                        <h3>Quick Tip</h3>
                        <p>
                            If your "Needs" exceed 50%, try to reduce "Wants" first. Prioritize the "Savings" bucket to build your financial fortress!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetPlanner;
