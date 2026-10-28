import React from 'react';
import { 
  TrendingDown, 
  Swords, 
  Zap, 
  Target, 
  ClockAlert, 
  Flame, 
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import { CrashScenario } from '../types';

interface CrashScenarioSelectorProps {
  scenarios: CrashScenario[];
  selectedScenario: CrashScenario | null;
  onSelectScenario: (scenario: CrashScenario | null) => void;
}

export const CrashScenarioSelector: React.FC<CrashScenarioSelectorProps> = ({
  scenarios,
  selectedScenario,
  onSelectScenario,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'TrendingDown': return <TrendingDown className="w-4 h-4 text-rose-400" />;
      case 'Swords': return <Swords className="w-4 h-4 text-purple-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Target': return <Target className="w-4 h-4 text-rose-400" />;
      case 'ClockAlert': return <ClockAlert className="w-4 h-4 text-cyan-400" />;
      case 'Flame': return <Flame className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
  };

  const getSeverityBadge = (sev: CrashScenario['severity']) => {
    switch (sev) {
      case 'catastrophic':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">Catastrophic</span>;
      case 'high':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">High Severity</span>;
      default:
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">Moderate</span>;
    }
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Adverse Shock Injector
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a real-world market stress test to crash-test the business model against.
          </p>
        </div>

        {/* Baseline / Neutral Mode Toggle */}
        <button
          onClick={() => onSelectScenario(null)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            selectedScenario === null
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Normal Baseline (No Shock)</span>
        </button>
      </div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {scenarios.map((sc) => {
          const isSelected = selectedScenario?.id === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => onSelectScenario(sc)}
              className={`group cursor-pointer rounded-xl p-4 border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-rose-950/40 to-slate-900 border-rose-500/60 ring-2 ring-rose-500/30 shadow-lg shadow-rose-950/50'
                  : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80">
                      {getIcon(sc.iconName)}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {sc.badge}
                    </span>
                  </div>
                  {getSeverityBadge(sc.severity)}
                </div>

                <h4 className={`text-sm font-bold tracking-tight mb-1 transition-colors ${
                  isSelected ? 'text-rose-300' : 'text-slate-200 group-hover:text-white'
                }`}>
                  {sc.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
                  {sc.description}
                </p>
              </div>

              {/* Stress Metrics Badges */}
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {sc.demandShockPercent !== 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-rose-400 border border-rose-500/20">
                      Demand {sc.demandShockPercent}%
                    </span>
                  )}
                  {sc.cogsInflationPercent !== 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-500/20">
                      COGS +{sc.cogsInflationPercent}%
                    </span>
                  )}
                  {sc.cacInflationPercent !== 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-purple-400 border border-purple-500/20">
                      CAC +{sc.cacInflationPercent}%
                    </span>
                  )}
                  {sc.churnSpikePercent !== 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-rose-400 border border-rose-500/20">
                      Churn +{sc.churnSpikePercent}%
                    </span>
                  )}
                  {sc.paymentDelayDaysDelta !== 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-cyan-500/20">
                      Receivables +{sc.paymentDelayDaysDelta}d
                    </span>
                  )}
                </div>

                {isSelected && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-start gap-1.5 text-[10px] text-slate-400">
                    <Info className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">Case Study:</strong> {sc.realWorldExample}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
