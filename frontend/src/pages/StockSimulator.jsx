import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// --- Mock Data Generators ---
const generateSparklineData = (startPrice) => {
    let price = startPrice;
    return Array.from({ length: 20 }, (_, i) => {
        const change = (Math.random() - 0.5) * (startPrice * 0.02);
        price += change;
        return { i, value: price };
    });
};

const INITIAL_STOCKS = [
    { id: 1, symbol: 'GRAV', name: 'Anti-Gravity Corp', price: 150.25, trend: generateSparklineData(150.25) },
    { id: 2, symbol: 'FUTR', name: 'Future Tech', price: 2450.00, trend: generateSparklineData(2450.00) },
    { id: 3, symbol: 'ORBT', name: 'Orbital Logistics', price: 89.50, trend: generateSparklineData(89.50) },
    { id: 4, symbol: 'NEON', name: 'Neon Energy', price: 12.40, trend: generateSparklineData(12.40) },
    { id: 5, symbol: 'LUNA', name: 'Lunar Mining', price: 450.75, trend: generateSparklineData(450.75) },
];

const StockSimulator = () => {
    // --- State ---
    const [portfolioValue, setPortfolioValue] = useState(10000);
    const [cash, setCash] = useState(10000);
    const [holdings, setHoldings] = useState({});
    const [altitude, setAltitude] = useState(1000);
    const [stocks, setStocks] = useState(INITIAL_STOCKS);
    const [portfolioHistory, setPortfolioHistory] = useState([{ time: 'Start', value: 10000 }]);
    const [transactions, setTransactions] = useState([]);
    const [marketCondition, setMarketCondition] = useState('NORMAL'); // NORMAL, BLACK_HOLE, SUPERNOVA

    // Chat State
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'AI', text: 'Anti-Gravity Systems Online. Zero-G Trading initialized. Ready to Thrust.' }
    ]);
    const [userMessage, setUserMessage] = useState('');
    const chatEndRef = useRef(null);

    // --- Effects ---

    // Scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Live Market Simulation & Scenarios
    useEffect(() => {
        const interval = setInterval(() => {
            setStocks(currentStocks =>
                currentStocks.map(stock => {
                    let volatility = 0.005; // Normal low volatility
                    let bias = 0; // Directional bias

                    if (marketCondition === 'BLACK_HOLE') {
                        volatility = 0.05; // High volatility
                        bias = -0.03; // Strong downward pull
                    } else if (marketCondition === 'SUPERNOVA') {
                        volatility = 0.04;
                        bias = 0.03; // Strong upward push
                    }

                    const rawChange = (Math.random() - 0.5) * 2 * volatility;
                    const changePercent = rawChange + bias;

                    const newPrice = Math.max(0.01, stock.price * (1 + changePercent));

                    // Update sparkline
                    const newTrend = [...stock.trend.slice(1), { i: Date.now(), value: newPrice }];

                    return { ...stock, price: newPrice, trend: newTrend, changePercent: changePercent * 100 };
                })
            );
        }, 2000);

        return () => clearInterval(interval);
    }, [marketCondition]);

    // Update Portfolio Value & History
    useEffect(() => {
        const stocksValue = stocks.reduce((acc, stock) => {
            return acc + (stock.price * (holdings[stock.symbol] || 0));
        }, 0);
        const totalValue = cash + stocksValue;

        setPortfolioValue(totalValue);
        setAltitude(totalValue / 10);

        setPortfolioHistory(prev => {
            const newHistory = [...prev, { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), value: totalValue }];
            if (newHistory.length > 30) newHistory.shift();
            return newHistory;
        });

    }, [stocks, cash, holdings]);

    // --- Handlers ---
    const activateScenario = (scenario) => {
        setMarketCondition(scenario);
        if (scenario === 'BLACK_HOLE') {
            addChatMessage("WARNING: GRAVITY WELL DETECTED. Market entering Black Hole phase. Extreme volatility expected.");
        } else if (scenario === 'SUPERNOVA') {
            addChatMessage("ALERT: SUPERNOVA DETECTED. Expansion phase imminent. Prepare for rapid ascent.");
        } else {
            addChatMessage("Stabilizing orbit. Market returning to normal parameters.");
        }
    };

    const handleTrade = (stock, type) => {
        const qty = 1;
        if (marketCondition === 'BLACK_HOLE' && type === 'buy') {
            // Occasionally warn user about catching falling knives
            if (Math.random() > 0.7) addChatMessage(`Risk Alert: Buying ${stock.symbol} during a collapse event is highly speculative.`);
        }

        if (type === 'buy') {
            if (cash >= stock.price) {
                setCash(prev => prev - stock.price);
                setHoldings(prev => ({ ...prev, [stock.symbol]: (prev[stock.symbol] || 0) + qty }));
                addTransaction(stock.symbol, 'THRUST', stock.price, qty);
                addChatMessage(`Thrust initialized. Acquired ${stock.symbol} @ $${stock.price.toFixed(2)}.`);
            } else {
                addChatMessage(`Insufficient propulsion (funds) to acquire ${stock.symbol}.`);
            }
        } else {
            if (holdings[stock.symbol] > 0) {
                setCash(prev => prev + stock.price);
                setHoldings(prev => ({ ...prev, [stock.symbol]: prev[stock.symbol] - qty }));
                addTransaction(stock.symbol, 'DRIFT', stock.price, qty);
                addChatMessage(`Drift complete. Ejected ${stock.symbol} @ $${stock.price.toFixed(2)}.`);
            } else {
                addChatMessage(`Cargo bay empty. No ${stock.symbol} found to eject.`);
            }
        }
    };

    const addTransaction = (symbol, type, price, qty) => {
        setTransactions(prev => [{
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            symbol, type, price, qty
        }, ...prev]);
    };

    const addChatMessage = (text) => {
        setChatMessages(prev => [...prev, { id: Date.now(), sender: 'AI', text }]);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!userMessage.trim()) return;
        setChatMessages(prev => [...prev, { id: Date.now(), sender: 'User', text: userMessage }]);

        setTimeout(() => {
            const input = userMessage.toLowerCase();
            let resp = "Orbit stable.";
            if (input.includes('thrust') || input.includes('buy')) {
                resp = "Thrust vectors calculated. FUTR is showing potential for high-altitude gains.";
            } else if (input.includes('drift') || input.includes('sell')) {
                resp = "Drifting might save fuel if volatility increases.";
            } else if (input.includes('crash')) {
                resp = "Black Hole probability is non-zero. Keep your shields (stop-losses) up.";
            }
            addChatMessage(resp);
        }, 600);

        setUserMessage('');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden relative selection:bg-cyan-500/30">
            {/* Dynamic Background */}
            <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-colors duration-1000 ${marketCondition === 'BLACK_HOLE' ? 'bg-red-950/20' : 'bg-transparent'}`}>
                {/* Floating Orbs */}
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-cyan-900/20 rounded-full blur-[120px] animate-pulse" />

                {/* Stars/Dust */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
            </div>

            <div className="relative z-10 flex h-screen p-4 gap-4 max-w-[1920px] mx-auto">

                {/* LEFT COLUMN: Dashboard */}
                <div className="flex-[3] flex flex-col gap-4 min-w-0">

                    {/* Header + Scenarios */}
                    <header className="grid grid-cols-12 gap-4 h-32">
                        {/* Title Card */}
                        <div className="col-span-3 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 flex flex-col justify-center relative overflow-hidden group">
                            <h1 className="text-2xl font-black italic bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                ZERO-G
                            </h1>
                            <p className="text-slate-500 text-[10px] tracking-[0.3em] font-medium mt-1 uppercase">Sim V1.0</p>
                        </div>

                        {/* Scenario Controls (Gamification) */}
                        <div className="col-span-5 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 p-2 flex items-center justify-around gap-2">
                            <button
                                onClick={() => activateScenario('NORMAL')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all border ${marketCondition === 'NORMAL' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-slate-700 text-slate-500 hover:border-slate-500'}`}
                            >
                                ORBIT
                            </button>
                            <button
                                onClick={() => activateScenario('SUPERNOVA')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all border ${marketCondition === 'SUPERNOVA' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-slate-700 text-slate-500 hover:border-slate-500'}`}
                            >
                                SUPERNOVA
                            </button>
                            <button
                                onClick={() => activateScenario('BLACK_HOLE')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all border ${marketCondition === 'BLACK_HOLE' ? 'bg-rose-600/20 border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'border-slate-700 text-slate-500 hover:border-slate-500'}`}
                            >
                                BLACK HOLE
                            </button>
                        </div>

                        {/* Altitude */}
                        <div className="col-span-4 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex items-center justify-between px-6">
                            <div className="flex flex-col z-10 w-full text-right">
                                <span className="text-slate-400 text-[10px] uppercase tracking-wider">Alt. (Net Worth)</span>
                                <span className={`text-3xl font-black tracking-tight ${marketCondition === 'BLACK_HOLE' ? 'text-rose-500 animate-pulse' : 'text-cyan-400'}`}>
                                    ${portfolioValue.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </header>

                    {/* Main Chart */}
                    <div className="flex-1 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 p-4 overflow-hidden flex flex-col min-h-[200px]">
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={portfolioHistory}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={marketCondition === 'BLACK_HOLE' ? '#f43f5e' : '#22d3ee'} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={marketCondition === 'BLACK_HOLE' ? '#f43f5e' : '#22d3ee'} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#cbd5e1' }}
                                        formatter={(value) => [`$${value.toFixed(2)}`, 'Altitude']}
                                        labelStyle={{ display: 'none' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke={marketCondition === 'BLACK_HOLE' ? '#f43f5e' : '#22d3ee'}
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Stock Cards (Floating Bubbles) */}
                    <div className="h-72 grid grid-cols-5 gap-4 overflow-y-auto pr-2">
                        {stocks.map((stock, i) => (
                            <motion.div
                                key={stock.id}
                                className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-4 flex flex-col justify-between hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all group relative"
                                animate={{
                                    y: [0, -8, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.5
                                }}
                            >
                                {/* Change Indicator */}
                                <div className={`absolute top-3 right-3 text-[10px] font-bold ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {stock.changePercent > 0 ? '+' : ''}{stock.changePercent?.toFixed(1)}%
                                </div>

                                <div className="z-10">
                                    <div className="font-black text-xl italic text-slate-200 tracking-tighter">{stock.symbol}</div>
                                    <div className="text-[10px] text-slate-500">{stock.name}</div>
                                </div>

                                {/* Mini Graph */}
                                <div className="h-10 w-full my-2 opacity-60">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={stock.trend}>
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke={stock.changePercent >= 0 ? '#34d399' : '#fb7185'}
                                                strokeWidth={2}
                                                dot={false}
                                                isAnimationActive={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="space-y-2 z-10">
                                    <div className="text-lg font-mono font-bold text-slate-100">$ {stock.price.toFixed(0)}</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleTrade(stock, 'buy')}
                                            className="relative overflow-hidden group/btn bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg py-2 text-[10px] font-bold tracking-wider transition-all"
                                        >
                                            <span className="relative z-10">THRUST</span>
                                            <div className="absolute inset-0 bg-emerald-500/20 blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                        </button>
                                        <button
                                            onClick={() => handleTrade(stock, 'sell')}
                                            className="relative overflow-hidden group/btn bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/50 text-rose-400 rounded-lg py-2 text-[10px] font-bold tracking-wider transition-all"
                                        >
                                            <span className="relative z-10">DRIFT</span>
                                            <div className="absolute inset-0 bg-rose-500/20 blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                        </button>
                                    </div>
                                    {holdings[stock.symbol] > 0 && (
                                        <div className="text-[9px] text-cyan-400 text-center font-bold tracking-wider bg-cyan-900/30 py-1 rounded">
                                            PAYLOAD: {holdings[stock.symbol]}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>

                {/* RIGHT COLUMN: Sidebar (AI) */}
                <div className="flex-1 flex flex-col gap-4 min-w-[300px] max-w-[350px]">

                    {/* AI Chat Bubble */}
                    <div className="flex-1 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl relative">
                        <div className="absolute inset-0 border-2 border-slate-800/50 rounded-2xl pointer-events-none z-20"></div>

                        <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                                </span>
                                AI NAVIGATOR
                            </h2>
                            <span className="text-[10px] font-mono text-slate-500">v4.0.2</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
                            {chatMessages.map(msg => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.sender === 'AI' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed shadow-lg ${msg.sender === 'User'
                                            ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-br-none'
                                            : 'bg-slate-800/90 text-slate-300 border border-slate-700 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900">
                            <input
                                type="text"
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                placeholder="Request support..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-500/50 text-slate-200 transition-colors"
                            />
                        </form>
                    </div>

                    {/* Transaction Log (Flight Data) */}
                    <div className="h-48 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-4 flex flex-col">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            FLIGHT DATA
                        </h3>
                        <div className="flex-1 overflow-y-auto pr-1">
                            <table className="w-full text-[10px]">
                                <tbody className="divide-y divide-slate-800">
                                    {transactions.map(tx => (
                                        <tr key={tx.id} className="text-slate-400 hover:bg-slate-800/30 transition-colors">
                                            <td className="py-2 pl-2">{tx.time}</td>
                                            <td className={`py-2 font-bold ${tx.type === 'THRUST' ? 'text-emerald-500' : 'text-rose-500'}`}>{tx.type}</td>
                                            <td className="py-2 font-mono text-slate-200">{tx.symbol}</td>
                                            <td className="py-2 text-right pr-2">${tx.price.toFixed(0)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default StockSimulator;
