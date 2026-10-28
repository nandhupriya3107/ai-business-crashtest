import React, { useState } from 'react';
import { X, Dice5, AlertTriangle, ShieldCheck, RefreshCw, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BusinessTwin, CrashScenario, DecisionLevers, MonteCarloSummary } from '../types';
import { runMonteCarloStressTest } from '../engine/simulationEngine';

interface MonteCarloModalProps {
  isOpen: boolean;
  onClose: () => void;
  twin: BusinessTwin;
  scenario: CrashScenario | null;
  levers: DecisionLevers;
}

export const MonteCarloModal: React.FC<MonteCarloModalProps> = ({
  isOpen,
  onClose,
  twin,
  scenario,
  levers,
}) => {
  const [iterations, setIterations] = useState<number>(100);
  const [summary, setSummary] = useState<MonteCarloSummary>(() =>
    runMonteCarloStressTest(twin, scenario, levers, 100)
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRerun = (count: number) => {
    setIsRunning(true);
    setIterations(count);
    setTimeout(() => {
      const res = runMonteCarloStressTest(twin, scenario, levers, count);
      setSummary(res);
      setIsRunning(false);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Dice5 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Monte Carlo Probabilistic Stress Engine
              </h3>
              <p className="text-xs text-slate-400">
                100 randomized stochastic economic shocks modeling volatility in demand, CAC, and supplier rates.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Insolvency Probability
              </span>
              <p className={`text-xl font-black font-mono ${
                summary.bankruptcyProbabilityPercent > 35 ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {summary.bankruptcyProbabilityPercent}%
              </p>
              <span className="text-[10px] text-slate-400">
                {summary.bankruptcyProbabilityPercent > 0 ? `${summary.bankruptcyProbabilityPercent} of ${iterations} runs died` : '0 bankruptcies'}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                95% Value at Risk (VaR)
              </span>
              <p className="text-xl font-black font-mono text-rose-400">
                ${summary.valueAtRisk95.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400">95th percentile worst cash</span>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Median Ending Cash
              </span>
              <p className="text-xl font-black font-mono text-cyan-400">
                ${summary.medianEndCash.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400">50th percentile outcome</span>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Best-Case Scenario
              </span>
              <p className="text-xl font-black font-mono text-emerald-400">
                ${summary.bestCaseCash.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400">Top 1% upside</span>
            </div>
          </div>

          {/* Histogram Chart */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>12-Month Ending Cash Probability Distribution</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                Sample: {summary.totalRuns} stochastic simulations
              </span>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.distributionBins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="range" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '0.5rem',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${val} runs (${((Number(val) / summary.totalRuns) * 100).toFixed(0)}%)`, 'Frequency']}
                  />
                  <Bar dataKey="count" name="Frequency" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rerun Controls */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Active Model: <strong className="text-slate-200">{twin.name}</strong> ({scenario ? scenario.title : 'Baseline'})
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRerun(100)}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                <span>Run 100 Trials</span>
              </button>

              <button
                onClick={() => handleRerun(250)}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors"
              >
                <Dice5 className="w-3.5 h-3.5" />
                <span>Run 250 Trials (Deep Stress)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
