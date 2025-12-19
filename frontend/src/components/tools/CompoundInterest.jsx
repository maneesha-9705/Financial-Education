import React, { useState, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const CompoundInterest = () => {
    const [initialInvestment, setInitialInvestment] = useState(10000);
    const [monthlyContribution, setMonthlyContribution] = useState(5000);
    const [returnRate, setReturnRate] = useState(12);
    const [years, setYears] = useState(10);

    const data = useMemo(() => {
        const chartData = [];
        let currentBalance = initialInvestment;
        let totalInvested = initialInvestment;

        for (let year = 0; year <= years; year++) {
            chartData.push({
                year: year,
                invested: Math.round(totalInvested),
                balance: Math.round(currentBalance),
            });

            // Calculate for next year
            if (year < years) {
                for (let m = 0; m < 12; m++) {
                    currentBalance += monthlyContribution;
                    currentBalance *= (1 + returnRate / 100 / 12);
                    totalInvested += monthlyContribution;
                }
            }
        }
        return chartData;
    }, [initialInvestment, monthlyContribution, returnRate, years]);

    const finalAmount = data[data.length - 1].balance;
    const totalInvested = data[data.length - 1].invested;
    const interestEarned = finalAmount - totalInvested;

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
                <h2>Compound Interest Calculator</h2>
                <p>
                    Witness the magic of compounding. Even small, regular contributions can grow into significant wealth over time.
                    This tool projects your future wealth based on your starting amount, monthly savings, and expected yearly returns.
                </p>
            </div>

            <div className="calculator-grid">
                <div className="controls-section">
                    <div className="input-group">
                        <label>Starting Amount</label>
                        <div className="input-with-value">
                            <input
                                type="range"
                                min="0"
                                max="500000"
                                step="1000"
                                value={initialInvestment}
                                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                                className="premium-range"
                            />
                            <span className="value-display">{formatCurrency(initialInvestment)}</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Monthly Contribution</label>
                        <div className="input-with-value">
                            <input
                                type="range"
                                min="500"
                                max="100000"
                                step="500"
                                value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                className="premium-range"
                            />
                            <span className="value-display">{formatCurrency(monthlyContribution)}</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Expected Return Rate (p.a)</label>
                        <div className="input-with-value">
                            <input
                                type="range"
                                min="1"
                                max="30"
                                step="0.5"
                                value={returnRate}
                                onChange={(e) => setReturnRate(Number(e.target.value))}
                                className="premium-range"
                            />
                            <span className="value-display">{returnRate}%</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Time Period (Years)</label>
                        <div className="input-with-value">
                            <input
                                type="range"
                                min="1"
                                max="40"
                                step="1"
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                className="premium-range"
                            />
                            <span className="value-display">{years} Years</span>
                        </div>
                    </div>
                </div>

                <div className="results-section">
                    <div className="summary-cards">
                        <div className="card">
                            <span>Total Invested</span>
                            <h3>{formatCurrency(totalInvested)}</h3>
                        </div>
                        <div className="card highlight">
                            <span>Future Value</span>
                            <h3>{formatCurrency(finalAmount)}</h3>
                        </div>
                        <div className="card">
                            <span>Interest Earned</span>
                            <h3>{formatCurrency(interestEarned)}</h3>
                        </div>
                    </div>

                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" />
                                <YAxis tickFormatter={(val) => `₹${val / 1000}k`} />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Area type="monotone" dataKey="balance" stroke="#4f46e5" fillOpacity={1} fill="url(#colorBalance)" name="Total Value" />
                                <Area type="monotone" dataKey="invested" stroke="#94a3b8" fill="transparent" strokeDasharray="5 5" name="Invested Amount" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompoundInterest;
