import React from 'react';
import { 
  Skull, 
  ShieldCheck, 
  AlertOctagon, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle, 
  Activity, 
  Info,
  Calendar,
  Flame
} from 'lucide-react';
import { FailureDiagnostic } from '../types';

interface FailureAutopsyProps {
  diagnostic: FailureDiagnostic;
}

export const FailureAutopsy: React.FC<FailureAutopsyProps> = ({ diagnostic }) => {
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-500 stroke-red-500';
    if (score >= 60) return 'text-rose-400 stroke-rose-400';
    if (score >= 40) return 'text-amber-400 stroke-amber-400';
    return 'text-emerald-400 stroke-emerald-400';
  };

  const getRiskGradeBadge = (grade: FailureDiagnostic['riskGrade']) => {
    if (grade.startsWith('F')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (grade.startsWith('D')) return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    if (grade.startsWith('C')) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (grade.startsWith('B')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden">
      {/* Background crash glow */}
      {diagnostic.isCrashed && (
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Top Banner: Crash Status */}
      <div className={`p-4 rounded-xl border mb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
        diagnostic.isCrashed
          ? 'bg-gradient-to-r from-red-950/80 via-slate-900 to-rose-950/60 border-red-500/50 shadow-lg shadow-red-950/50'
          : 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-emerald-500/40'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-xl border flex items-center justify-center shrink-0 ${
            diagnostic.isCrashed 
              ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
          }`}>
            {diagnostic.isCrashed ? <Skull className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-base font-extrabold tracking-tight ${
                diagnostic.isCrashed ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {diagnostic.isCrashed ? 'CRASH TEST FAILURE: INSOLVENCY DETECTED' : 'CRASH TEST SURVIVED: BUSINESS SOLVENT'}
              </h3>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getRiskGradeBadge(diagnostic.riskGrade)}`}>
                Grade {diagnostic.riskGrade}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {diagnostic.isCrashed
                ? `Bank cash depleted at ${diagnostic.cashDepletionDate}. Model collapsed under the selected stress conditions.`
                : `Business cash reserve absorbs shock throughout all 12 simulated months.`}
            </p>
          </div>
        </div>

        {/* Primary Failure Mode Tag */}
        <div className="flex flex-col md:items-end">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Primary Vulnerability
          </span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border mt-1 ${
            diagnostic.isCrashed 
              ? 'bg-red-500/10 text-red-300 border-red-500/30' 
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}>
            {diagnostic.primaryFailureMode}
          </span>
        </div>
      </div>

      {/* Metrics Row: Risk Score + Financial Quantifications */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {/* Risk Score Meter */}
        <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 flex items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={getRiskColor(diagnostic.overallRiskScore)}
                strokeDasharray={`${diagnostic.overallRiskScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-white font-mono">
              {diagnostic.overallRiskScore}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-medium text-slate-400 block uppercase tracking-wider">
              Crash Risk
            </span>
            <span className="text-sm font-bold text-white font-mono">
              {diagnostic.overallRiskScore} <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
            </span>
          </div>
        </div>

        {/* Capital Destroyed */}
        <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-medium">Capital Destroyed</span>
            <Flame className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="text-sm font-bold text-rose-400 font-mono">
            -${diagnostic.totalCapitalDestroyed.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">vs baseline projection</span>
        </div>

        {/* Lowest Cash Point */}
        <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-medium">Cash Trough</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className={`text-sm font-bold font-mono ${
            diagnostic.minimumCashBalance < 0 ? 'text-red-400' : 'text-slate-200'
          }`}>
            ${diagnostic.minimumCashBalance.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Lowest point in 12 mos</span>
        </div>

        {/* Peak Monthly Burn */}
        <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-medium">Peak Monthly Burn</span>
            <Activity className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-sm font-bold text-purple-400 font-mono">
            ${diagnostic.peakBurnRate.toLocaleString()}<span className="text-xs text-slate-500 font-normal">/mo</span>
          </p>
          <span className="text-[10px] text-slate-400">Maximum cash outflow rate</span>
        </div>
      </div>

      {/* Root-Cause Failure Attribution Cards ("The Autopsy") */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Failure Autopsy: Root Cause Breakdown
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {diagnostic.rootCauseAnalysis.map((rc, idx) => (
            <div 
              key={idx}
              className={`rounded-xl p-3.5 border transition-all ${
                rc.criticality === 'Fatal'
                  ? 'bg-red-950/20 border-red-500/30'
                  : rc.criticality === 'High'
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-slate-950/40 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-white tracking-tight">
                  {rc.trigger}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  rc.criticality === 'Fatal' 
                    ? 'bg-red-500/20 text-red-400' 
                    : rc.criticality === 'High'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {rc.criticality}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-rose-300 mb-1.5">
                <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                <span>{rc.financialLeakage}</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {rc.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
