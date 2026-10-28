import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RecoveryPlan, DecisionLevers } from '../types';

interface RecoveryPlaybookProps {
  recoveryPlan: RecoveryPlan;
  onApplyPlan: (levers: DecisionLevers) => void;
  isPlanApplied: boolean;
}

export const RecoveryPlaybook: React.FC<RecoveryPlaybookProps> = ({
  recoveryPlan,
  onApplyPlan,
  isPlanApplied,
}) => {
  const handleApply = () => {
    onApplyPlan(recoveryPlan.idealDecisionTuning);
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const getUrgencyBadge = (urgency: string) => {
    if (urgency.includes('Week 1')) {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
    if (urgency.includes('Month 1')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              AI-Driven Recovery Playbook
            </h3>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Countermeasure Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {recoveryPlan.overview}
          </p>
        </div>

        {/* Action Button: Apply Plan */}
        <button
          onClick={handleApply}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shrink-0 ${
            isPlanApplied
              ? 'bg-emerald-600 text-white border border-emerald-400 shadow-emerald-600/30 ring-2 ring-emerald-500/30'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-700/20 hover:shadow-emerald-600/30'
          }`}
        >
          {isPlanApplied ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Recovery Plan Active</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Apply AI Recovery Plan</span>
            </>
          )}
        </button>
      </div>

      {/* Turnaround Impact Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-medium text-slate-400">
              Restored Runway
            </span>
            <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              {recoveryPlan.restoredRunwayMonths} Months
            </p>
          </div>
          <Clock className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-medium text-slate-400">
              Capital Protected
            </span>
            <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              +${recoveryPlan.turnaroundCashDelta.toLocaleString()}
            </p>
          </div>
          <DollarSign className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-medium text-slate-400">
              Solvency Outlook
            </span>
            <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full Stability Achieved</span>
            </p>
          </div>
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Prioritized Steps */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
          Prioritized Action Steps & Countermeasures
        </h4>

        {recoveryPlan.actions.map((act, index) => (
          <div
            key={act.id}
            className="bg-slate-950/60 hover:bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-bold text-white tracking-tight">
                    {act.pillar}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getUrgencyBadge(act.urgency)}`}>
                    {act.urgency}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Lead time: {act.implementationTime}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {act.action}
                </p>
              </div>
            </div>

            <div className="md:text-right shrink-0">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Target Impact
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {act.projectedCashImpact}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
