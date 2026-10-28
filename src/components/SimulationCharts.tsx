import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  Legend 
} from 'recharts';
import { MonthlyDataPoint, SimulationResult } from '../types';
import { TrendingUp, DollarSign, Users, Layers } from 'lucide-react';

interface SimulationChartsProps {
  simulation: SimulationResult;
}

export const SimulationCharts: React.FC<SimulationChartsProps> = ({ simulation }) => {
  const [activeTab, setActiveTab] = useState<'cash' | 'pnl' | 'customers'>('cash');

  const { baselineTrajectory, stressedTrajectory, recoveredTrajectory } = simulation;

  // Merge trajectory points for comparative cash graph
  const mergedCashData = stressedTrajectory.map((pt, idx) => {
    const base = baselineTrajectory[idx];
    const rec = recoveredTrajectory ? recoveredTrajectory[idx] : null;

    return {
      month: pt.monthName,
      baselineCash: base ? base.cashBalance : 0,
      stressedCash: pt.cashBalance,
      recoveredCash: rec ? rec.cashBalance : undefined,
      isSolvent: pt.isSolvent,
      revenue: pt.revenue,
      cogs: pt.cogs,
      fixedCosts: pt.fixedCosts,
      marketingSpend: pt.marketingSpend,
      netIncome: pt.netIncome,
      customerCount: pt.customerCount,
      newCustomers: pt.newCustomers,
      churnedCustomers: pt.churnedCustomers,
    };
  });

  const formatCurrency = (val: number) => {
    if (Math.abs(val) >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>12-Month Financial Trajectory Engine</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulated comparative forward curves under stress testing and recovery.
          </p>
        </div>

        {/* Chart View Tabs */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('cash')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'cash'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-rose-400" />
            <span>Cash & Runway</span>
          </button>

          <button
            onClick={() => setActiveTab('pnl')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'pnl'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Revenue & Burn</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'customers'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Customer Cohorts</span>
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="h-80 w-full">
        {activeTab === 'cash' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mergedCashData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorStressed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={formatCurrency} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />

              {/* Zero Cash Insolvency Reference Line */}
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Insolvency Threshold ($0)', fill: '#ef4444', fontSize: 10, position: 'insideBottomRight' }} />

              <Area
                type="monotone"
                dataKey="baselineCash"
                name="Baseline Course (No Shock)"
                stroke="#38bdf8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBaseline)"
              />
              <Area
                type="monotone"
                dataKey="stressedCash"
                name="Crash Test Trajectory"
                stroke="#f43f5e"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorStressed)"
              />
              {recoveredTrajectory && (
                <Area
                  type="monotone"
                  dataKey="recoveredCash"
                  name="AI Recovered Trajectory"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  fillOpacity={1}
                  fill="url(#colorRecovered)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'pnl' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mergedCashData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={formatCurrency} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />

              <Bar dataKey="revenue" name="Gross Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cogs" name="Direct COGS" fill="#f59e0b" stackId="costs" />
              <Bar dataKey="fixedCosts" name="Fixed Overhead" fill="#ef4444" stackId="costs" />
              <Bar dataKey="marketingSpend" name="Marketing Spend" fill="#a855f7" stackId="costs" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'customers' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedCashData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />

              <Line
                type="monotone"
                dataKey="customerCount"
                name="Total Active Accounts"
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="newCustomers"
                name="New Acquisitions / Month"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="churnedCustomers"
                name="Churned Accounts / Month"
                stroke="#f43f5e"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Trajectory Insights Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
          <span>Red zone indicates insolvent cash balances (&lt; $0).</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          <span>Dashed green line demonstrates AI Countermeasure recovery curve.</span>
        </div>
      </div>
    </div>
  );
};
