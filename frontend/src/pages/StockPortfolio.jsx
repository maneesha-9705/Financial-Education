import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import './StockPortfolio.css';

/**
 * ANTI-GRAVITY PORTFOLIO (MISSION CONTROL) v5.5
 * Restored detailed views while maintaining responsiveness.
 */

// --- Assets & Mock Data ---
const ALLOCATION_DATA = [
  { name: 'Core Propulsion', value: 45, color: '#22d3ee' }, // Cyan
  { name: 'Nebula Mining', value: 30, color: '#8b5cf6' },   // Purple
  { name: 'Stellar Comms', value: 15, color: '#f43f5e' },   // Rose
  { name: 'Drift (Cash)', value: 10, color: '#10b981' },    // Emerald
];

const PERFORMANCE_HISTORY = Array.from({ length: 12 }, (_, i) => ({
  month: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i],
  value: 8000 + Math.random() * 4000
}));

const HOLDINGS = [
  { ticker: 'APPL', name: 'Aero-Propulsion', qty: 12, avgPrice: 155.20, currentPrice: 175.50, status: 'STABLE' },
  { ticker: 'DEEP', name: 'Deep Space', qty: 5, avgPrice: 820.00, currentPrice: 890.00, status: 'ASCENDING' },
  { ticker: 'OXYG', name: 'Pure Oxygen', qty: 45, avgPrice: 45.10, currentPrice: 42.15, status: 'DRIFTING' },
  { ticker: 'STLR', name: 'Stellar Comms', qty: 120, avgPrice: 10.50, currentPrice: 12.80, status: 'ASCENDING' },
];

const StockPortfolio = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const totalInvested = HOLDINGS.reduce((acc, h) => acc + (h.qty * h.avgPrice), 0);
  const currentValue = HOLDINGS.reduce((acc, h) => acc + (h.qty * h.currentPrice), 0);
  const totalPL = currentValue - totalInvested;
  const plPercent = (totalPL / totalInvested) * 100;

  return (
    <div className="mission-control-body">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="mc-container">

        {/* HEADER */}
        <header className="mc-header">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mc-title-group"
          >
            <div className="mc-label">Command Center</div>
            <h1 className="text-white">
              Mission Control
              <span className="version-pill">v5.5</span>
            </h1>
          </motion.div>
          <div className="header-actions">
            <button className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.1)' }}>Export Log</button>
            <button className="btn btn-primary" style={{ background: '#22d3ee', color: '#000' }}>New Deployment</button>
          </div>
        </header>

        {/* TOP STATS */}
        <div className="mc-stats-grid">
          {[
            { label: 'Total Invested', val: `$${totalInvested.toLocaleString()}`, sub: 'Principal', color: '#fff' },
            { label: 'Current Altitude', val: `$${currentValue.toLocaleString()}`, sub: 'Net Worth', color: '#22d3ee' },
            { label: 'Yield Delta', val: `+$${totalPL.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, sub: `${plPercent.toFixed(1)}%`, color: '#10b981' },
            { label: 'Fleet Status', val: 'OPTIMAL', sub: 'All systems green', color: '#8b5cf6' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="mc-stat-card"
            >
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value" style={{ color: stat.color }}>{stat.val}</div>
              <div className="stat-sub">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* MAIN DASHBOARD GRID */}
        <div className="mc-visuals">

          {/* PERFORMANCE CHART */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mc-chart-box"
          >
            <div className="chart-header-row">
              <h3 className="mc-label" style={{ marginBottom: 0 }}>Yield Trajectory</h3>
              <div className="time-filters">
                {['1W', '1M', '1Y', 'ALL'].map(t => (
                  <button key={t} className={`filter-btn ${t === '1Y' ? 'active' : ''}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="chart-container-inner">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_HISTORY}>
                  <defs>
                    <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050510', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                    itemStyle={{ color: '#22d3ee', fontWeight: '900', fontSize: '12px' }}
                  />
                  <XAxis dataKey="month" hide />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#22d3ee"
                    strokeWidth={4}
                    fill="url(#yieldGrad)"
                    dot={{ fill: '#22d3ee', r: 4 }}
                    activeDot={{ r: 8, fill: '#fff' }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* ASSET ALLOCATION */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mc-dist-box"
          >
            <h3 className="mc-label" style={{ marginBottom: '2rem', textAlign: 'center' }}>Fuel Allocation</h3>
            <div className="pie-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ALLOCATION_DATA}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {ALLOCATION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050510', border: 'none', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="allocation-legend">
              {ALLOCATION_DATA.map((item, i) => (
                <div key={i} className="legend-item">
                  <div className="legend-dot" style={{ backgroundColor: item.color }}></div>
                  <span className="legend-text">{item.name}</span>
                  <span className="legend-val">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* HOLDINGS LOG */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mc-manifest"
        >
          <div className="manifest-header">
            <h3 className="mc-label" style={{ marginBottom: 0 }}>Deployment Manifest</h3>
            <div className="manifest-badge">
              {HOLDINGS.length} ACTIVE OPERATIONS
            </div>
          </div>

          <div className="mc-table-wrapper">
            <table className="mc-table">
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Status</th>
                  <th>Quantity</th>
                  <th>Entry Price</th>
                  <th>Current LVL</th>
                  <th style={{ textAlign: 'right' }}>Total Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {HOLDINGS.map((h, i) => {
                  const gain = (h.currentPrice - h.avgPrice) * h.qty;
                  const isPositive = gain >= 0;
                  return (
                    <tr key={i} className="group">
                      <td>
                        <div className="asset-identity">
                          <div className="asset-avatar">
                            {h.ticker[0]}
                          </div>
                          <div>
                            <div className="asset-ticker">{h.ticker}</div>
                            <div className="asset-name">{h.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${h.status.toLowerCase()}`}>
                          {h.status}
                        </span>
                      </td>
                      <td className="font-mono text-slate-400">{h.qty}</td>
                      <td className="font-mono text-slate-400">${h.avgPrice.toFixed(2)}</td>
                      <td className="font-mono text-white font-bold">${h.currentPrice.toFixed(2)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className={`yield-val ${isPositive ? 'positive' : 'negative'}`}>
                          {isPositive ? '+' : ''}${gain.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="yield-percent">
                          {((h.currentPrice / h.avgPrice - 1) * 100).toFixed(1)}%
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default StockPortfolio;
