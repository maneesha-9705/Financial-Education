import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import './StockPortfolio.css';

// --- Dummy Data ---
const performanceData = [
  { month: 'Jan', value: 150000 },
  { month: 'Feb', value: 152000 },
  { month: 'Mar', value: 148000 },
  { month: 'Apr', value: 155000 },
  { month: 'May', value: 158000 },
  { month: 'Jun', value: 160000 },
  { month: 'Jul', value: 159000 },
  { month: 'Aug', value: 162000 },
  { month: 'Sep', value: 165000 },
  { month: 'Oct', value: 164000 },
  { month: 'Nov', value: 166000 },
  { month: 'Dec', value: 168750 },
];

const allocationData = [
  { name: 'Large Cap', value: 45, color: '#3b82f6' }, // Blue
  { name: 'Mid Cap', value: 30, color: '#8b5cf6' },   // Purple
  { name: 'Small Cap', value: 15, color: '#f59e0b' }, // Amber
  { name: 'Cash', value: 10, color: '#10b981' },      // Emerald
];

const holdingsData = [
  {
    id: 1,
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    price: 175.00,
    qty: 50,
    invested: 7250,
    pl: 1500,
    plPercent: 20.6,
  },
  {
    id: 2,
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    sector: 'Technology',
    price: 350.00,
    qty: 30,
    invested: 9000,
    pl: 1500,
    plPercent: 16.7,
  },
  {
    id: 3,
    ticker: 'AMZN',
    name: 'Amazon.com',
    sector: 'Consumer Cyclical',
    price: 145.00,
    qty: 40,
    invested: 5000,
    pl: 800,
    plPercent: 16.0,
  },
  {
    id: 4,
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Auto Manufacturers',
    price: 240.00,
    qty: 20,
    invested: 4000,
    pl: 800,
    plPercent: 20.0,
  },
];

const StockPortfolio = () => {
  const [timeRange, setTimeRange] = useState('1Y');

  return (
    <div className="portfolio-container">
      <div className="container">
        {/* Header */}
        <div className="portfolio-header">
          <div>
            <h1>Portfolio Dashboard</h1>
            <p>Welcome back. Here's how your investments are performing today.</p>
          </div>
          <div className="portfolio-actions">
            <button className="btn btn-outline">Export</button>
            <button className="btn btn-primary">+ Add Transaction</button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="label">Total Invested</div>
            <div className="value">$150,000</div>
          </div>
          <div className="summary-card">
            <div className="label">Current Value</div>
            <div className="value">$168,750</div>
          </div>
          <div className="summary-card">
            <div className="label">Total Profit/Loss</div>
            <div className="value positive">
              $18,750 <span className="sub-value">+$18.7k</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="label">Overall Return %</div>
            <div className="value positive">
              12.5% <span className="sub-value">+12.5%</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dashboard-grid">
          {/* Performance Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Portfolio Performance</h3>
              <div className="time-range-selector">
                <button className={timeRange === '1M' ? 'active' : ''} onClick={() => setTimeRange('1M')}>1M</button>
                <button className={timeRange === '3M' ? 'active' : ''} onClick={() => setTimeRange('3M')}>3M</button>
                <button className={timeRange === 'YTD' ? 'active' : ''} onClick={() => setTimeRange('YTD')}>YTD</button>
                <button className={timeRange === '1Y' ? 'active' : ''} onClick={() => setTimeRange('1Y')}>1Y</button>
              </div>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    domain={['dataMin - 5000', 'dataMax + 5000']}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    dot={false} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Asset Allocation</h3>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                     itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="holdings-section">
          <div className="holdings-header">
            <h3>Current Holdings</h3>
            <div className="search-bar">
              <input type="text" placeholder="Search stock..." />
            </div>
          </div>
          <div className="holdings-table-container">
            <table className="holdings-table">
              <thead>
                <tr>
                  <th>Stock Name</th>
                  <th>Sector</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Invested</th>
                  <th>P/L</th>
                  <th>Return</th>
                </tr>
              </thead>
              <tbody>
                {holdingsData.map((stock) => (
                  <tr key={stock.id}>
                    <td>
                      <div className="stock-info">
                        <div className="stock-logo">{stock.ticker[0]}</div>
                        <div>
                          <span className="stock-ticker">{stock.ticker}</span>
                          <span className="stock-name">{stock.name}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="sector-tag">{stock.sector}</span>
                    </td>
                    <td>${stock.price.toFixed(2)}</td>
                    <td>{stock.qty}</td>
                    <td>${stock.invested.toLocaleString()}</td>
                    <td className={stock.pl >= 0 ? 'positive' : 'negative'}>
                      {stock.pl >= 0 ? '+' : ''}${stock.pl.toLocaleString()}
                    </td>
                    <td className={stock.plPercent >= 0 ? 'positive' : 'negative'}>
                      {stock.plPercent >= 0 ? '+' : ''}{stock.plPercent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockPortfolio;
