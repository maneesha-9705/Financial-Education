import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './Tools.css';

const Tools = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [returnRate, setReturnRate] = useState(12);
    const [years, setYears] = useState(10);

    const results = useMemo(() => {
        const months = years * 12;
        const ratePerMonth = returnRate / 12 / 100;

        // SIP Formula: P * ({[1 + i]^n - 1} / i) * (1 + i)
        const totalValue =
            monthlyInvestment *
            ((Math.pow(1 + ratePerMonth, months) - 1) / ratePerMonth) *
            (1 + ratePerMonth);

        const totalInvested = monthlyInvestment * months;
        const estReturns = totalValue - totalInvested;

        return {
            totalInvested: Math.round(totalInvested),
            estReturns: Math.round(estReturns),
            totalValue: Math.round(totalValue)
        };
    }, [monthlyInvestment, returnRate, years]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    const data = [
        { name: 'Invested Amount', value: results.totalInvested },
        { name: 'Est. Returns', value: results.estReturns },
    ];

    const COLORS = ['#94a3b8', '#4f46e5']; // Slate-400 for invested, Indigo-600 for returns (Growth)

    return (
        <div className="tools-page">
            <div className="tools-header">
                <h1 className="tools-title">Wealth Calculator</h1>
                <p className="tools-subtitle">See your money grow with our advanced SIP projection tool.</p>
            </div>

            <div className="calculator-container">
                {/* Controls Section */}
                <div className="controls-panel">
                    <div className="input-group">
                        <div className="input-row">
                            <label>Monthly Investment</label>
                            <span className="input-value">{formatCurrency(monthlyInvestment)}</span>
                        </div>
                        <input
                            type="range"
                            min="500"
                            max="100000"
                            step="500"
                            value={monthlyInvestment}
                            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                            className="premium-range"
                        />
                    </div>

                    <div className="input-group">
                        <div className="input-row">
                            <label>Expected Return Rate (p.a)</label>
                            <span className="input-value">{returnRate}%</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="0.5"
                            value={returnRate}
                            onChange={(e) => setReturnRate(Number(e.target.value))}
                            className="premium-range"
                        />
                    </div>

                    <div className="input-group">
                        <div className="input-row">
                            <label>Time Period</label>
                            <span className="input-value">{years} Years</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="40"
                            step="1"
                            value={years}
                            onChange={(e) => setYears(Number(e.target.value))}
                            className="premium-range"
                        />
                    </div>
                </div>

                {/* Visualization Section */}
                <div className="visualization-panel">
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="result-summary">
                        <div className="summary-item">
                            <span>Total Invested</span>
                            <h3>{formatCurrency(results.totalInvested)}</h3>
                        </div>
                        <div className="summary-item highlight">
                            <span>Estimated Returns</span>
                            <h3>{formatCurrency(results.estReturns)}</h3>
                        </div>
                        <div className="summary-total">
                            <span>Total Value</span>
                            <h2>{formatCurrency(results.totalValue)}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tools;
