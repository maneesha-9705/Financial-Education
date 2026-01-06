import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './StockSimulator.css';

/**
 * ANTI-GRAVITY SIMULATOR v6.0 (BRIEF EDITION)
 * Streamlined for high-density trading and clarity.
 */

const INITIAL_BALANCE = 100000;
const STOCKS = [
    { symbol: 'APPL', name: 'Aero-Propulsion', price: 175.50, volatility: 0.003 },
    { symbol: 'OXYG', name: 'Pure Oxygen', price: 42.15, volatility: 0.005 },
    { symbol: 'DEEP', name: 'Deep Space Mining', price: 890.00, volatility: 0.012 },
    { symbol: 'STLR', name: 'Stellar Comms', price: 12.80, volatility: 0.006 },
    { symbol: 'GENX', name: 'Gen-X Propulsion', price: 310.20, volatility: 0.015 },
    { symbol: 'NEON', name: 'Neon Energy Grid', price: 85.30, volatility: 0.008 },
];

const StockSimulator = () => {
    const [balance, setBalance] = useState(INITIAL_BALANCE);
    const [holdings, setHoldings] = useState({});
    const [market, setMarket] = useState(STOCKS.map(s => ({ ...s, currentPrice: s.price, history: Array(15).fill(s.price).map((v, i) => ({ i, v })), change: 0 })));
    const [chat, setChat] = useState([{ id: 1, role: 'AI', text: "Simulator Briefing: $100k loaded. Deploy capital when ready." }]);
    const [input, setInput] = useState("");
    const [condition, setCondition] = useState('ORBIT');
    const scrollRef = useRef(null);

    const [portfolioHistory, setPortfolioHistory] = useState([{ i: 0, v: INITIAL_BALANCE }]);

    // Market Engine
    useEffect(() => {
        const timer = setInterval(() => {
            setMarket(curr => curr.map(s => {
                const mult = condition === 'BLACK_HOLE' ? 3.5 : 1;
                const bias = condition === 'BLACK_HOLE' ? -0.01 : 0;
                const change = (Math.random() - 0.5 + bias) * s.currentPrice * s.volatility * mult;
                const nextPrice = Math.max(0.1, s.currentPrice + change);
                const nextHist = [...s.history.slice(1), { i: Date.now(), v: nextPrice }];
                return { ...s, currentPrice: nextPrice, history: nextHist, change: ((nextPrice - s.price) / s.price) * 100 };
            }));
        }, 1500);
        return () => clearInterval(timer);
    }, [condition]);

    const valuation = market.reduce((acc, s) => acc + (holdings[s.symbol] || 0) * s.currentPrice, 0);
    const netWorth = balance + valuation;

    useEffect(() => {
        const t = setInterval(() => {
            setPortfolioHistory(prev => [...prev.slice(-14), { i: Date.now(), v: netWorth }]);
        }, 3000);
        return () => clearInterval(t);
    }, [netWorth]);

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat]);

    const trade = (s, type) => {
        if (type === 'BUY' && balance >= s.currentPrice) {
            setBalance(b => b - s.currentPrice);
            setHoldings(h => ({ ...h, [s.symbol]: (h[s.symbol] || 0) + 1 }));
        } else if (type === 'SELL' && holdings[s.symbol] > 0) {
            setBalance(b => b + s.currentPrice);
            setHoldings(h => ({ ...h, [s.symbol]: h[s.symbol] - 1 }));
        }
    };

    return (
        <div className="simulator-body">
            <div className="simulator-container">
                {/* BRIEF HEADER */}
                <div className="sim-header-brief">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 900, textTransform: 'uppercase', color: 'var(--sim-cyan)' }}>Zero-G</span>
                        <div className="stat-group">
                            <div className="stat-item">
                                <span className="stat-label">Altitude</span>
                                <span className="stat-value" style={{ color: netWorth >= INITIAL_BALANCE ? '#fff' : 'var(--sim-rose)' }}>${netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Credits</span>
                                <span className="stat-value" style={{ color: 'var(--sim-cyan)' }}>${balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setCondition('ORBIT')} className={`btn-sm ${condition === 'ORBIT' ? 'btn-cyan' : 'btn-outline'}`}>Orbit</button>
                        <button onClick={() => setCondition('BLACK_HOLE')} className={`btn-sm ${condition === 'BLACK_HOLE' ? 'btn-outline' : 'btn-outline'}`} style={{ color: condition === 'BLACK_HOLE' ? 'var(--sim-rose)' : '#fff' }}>Black Hole</button>
                    </div>
                </div>

                <div className="sim-content">
                    <div className="main-view scrollbar-hide">
                        {/* PERFORMANCE BRIEF */}
                        <div style={{ height: '220px', background: 'var(--sim-glass)', borderRadius: '20px', padding: '1rem', border: '1px solid var(--sim-border)' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={portfolioHistory}>
                                    <Area type="monotone" dataKey="v" stroke="var(--sim-cyan)" fill="rgba(34, 211, 238, 0.1)" strokeWidth={2} isAnimationActive={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* ASSET GRID BRIEF */}
                        <div className="asset-grid-brief">
                            {market.map(s => (
                                <div key={s.symbol} className="asset-card-brief">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 900 }}>{s.symbol}</div>
                                            <div style={{ fontSize: '18px', fontWeight: 900 }}>${s.currentPrice.toFixed(2)}</div>
                                        </div>
                                        <div style={{ color: s.change >= 0 ? 'var(--sim-emerald)' : 'var(--sim-rose)', fontSize: '10px', fontWeight: 900 }}>
                                            {s.change >= 0 ? '+' : ''}{s.change.toFixed(1)}%
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <button onClick={() => trade(s, 'BUY')} className="btn-sm btn-thrust">Buy</button>
                                        <button onClick={() => trade(s, 'SELL')} className="btn-sm btn-drift">Sell</button>
                                    </div>
                                    {holdings[s.symbol] > 0 && <div style={{ fontSize: '9px', textAlign: 'center', marginTop: '8px', color: 'var(--sim-cyan)' }}>{holdings[s.symbol]} HELD</div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SIDEBAR BRIEF */}
                    <div className="ai-module-brief">
                        <div className="ai-messages-brief scrollbar-hide">
                            {chat.map(m => <div key={m.id} className={`bubble ${m.role.toLowerCase()}`}>{m.text}</div>)}
                            <div ref={scrollRef} />
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); if (!input.trim()) return; setChat([...chat, { id: Date.now(), role: 'User', text: input }]); setInput(""); }} style={{ padding: '0.75rem', borderTop: '1px solid var(--sim-border)' }}>
                            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Signal..." style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--sim-border)', color: '#fff', padding: '0.6rem', borderRadius: '10px', outline: 'none', fontSize: '12px' }} />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockSimulator;
