import React from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Tag, 
  Megaphone, 
  Scissors, 
  Handshake, 
  Landmark, 
  CalendarClock 
} from 'lucide-react';
import { DecisionLevers } from '../types';
import { DEFAULT_LEVERS } from '../data/mockData';

interface DecisionSandboxProps {
  levers: DecisionLevers;
  onChangeLevers: (newLevers: DecisionLevers) => void;
  onReset: () => void;
}

export const DecisionSandbox: React.FC<DecisionSandboxProps> = ({
  levers,
  onChangeLevers,
  onReset,
}) => {
  const isModified = Object.keys(DEFAULT_LEVERS).some(
    (key) => levers[key as keyof DecisionLevers] !== DEFAULT_LEVERS[key as keyof DecisionLevers]
  );

  const updateLever = <K extends keyof DecisionLevers>(key: K, value: DecisionLevers[K]) => {
    onChangeLevers({
      ...levers,
      [key]: value,
    });
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              AI Business Sandbox & What-If Decision Lab
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test business decisions live. Adjust pricing, marketing spend, and cost levers to test their real financial impact.
          </p>
        </div>

        {isModified && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Levers</span>
          </button>
        )}
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Price Adjustment */}
        <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Tag className="w-3.5 h-3.5 text-rose-400" />
              <span>Pricing Strategy</span>
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              levers.priceDeltaPercent > 0 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : levers.priceDeltaPercent < 0 
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                  : 'bg-slate-800 text-slate-400'
            }`}>
              {levers.priceDeltaPercent > 0 ? `+${levers.priceDeltaPercent}%` : `${levers.priceDeltaPercent}%`}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            value={levers.priceDeltaPercent}
            onChange={(e) => updateLever('priceDeltaPercent', Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>-50% Discount</span>
            <span>Unchanged</span>
            <span>+50% Premium</span>
          </div>
        </div>

        {/* 2. Marketing Spend Adjustment */}
        <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Megaphone className="w-3.5 h-3.5 text-purple-400" />
              <span>Marketing Budget</span>
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              levers.marketingBudgetDeltaPercent > 0 
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                : levers.marketingBudgetDeltaPercent < 0 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                  : 'bg-slate-800 text-slate-400'
            }`}>
              {levers.marketingBudgetDeltaPercent > 0 ? `+${levers.marketingBudgetDeltaPercent}%` : `${levers.marketingBudgetDeltaPercent}%`}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="150"
            step="10"
            value={levers.marketingBudgetDeltaPercent}
            onChange={(e) => updateLever('marketingBudgetDeltaPercent', Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>-100% (Pause)</span>
            <span>Normal</span>
            <span>+150% Scale</span>
          </div>
        </div>

        {/* 3. Fixed Overhead Cuts */}
        <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Scissors className="w-3.5 h-3.5 text-amber-400" />
              <span>Overhead & Opex Reduction</span>
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              levers.overheadCostCutPercent < 0 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              {levers.overheadCostCutPercent}% cut
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="0"
            step="5"
            value={levers.overheadCostCutPercent}
            onChange={(e) => updateLever('overheadCostCutPercent', Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>-50% Austerity</span>
            <span>-25% Trimming</span>
            <span>0% Intact</span>
          </div>
        </div>

        {/* 4. COGS & Supplier Renegotiation */}
        <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Handshake className="w-3.5 h-3.5 text-cyan-400" />
              <span>Direct COGS Optimization</span>
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              levers.cogsEfficiencyPercent < 0 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : levers.cogsEfficiencyPercent > 0
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-slate-800 text-slate-400'
            }`}>
              {levers.cogsEfficiencyPercent > 0 ? `+${levers.cogsEfficiencyPercent}%` : `${levers.cogsEfficiencyPercent}%`}
            </span>
          </div>
          <input
            type="range"
            min="-30"
            max="20"
            step="5"
            value={levers.cogsEfficiencyPercent}
            onChange={(e) => updateLever('cogsEfficiencyPercent', Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>-30% Better Vendor Terms</span>
            <span>0%</span>
            <span>+20% Degraded</span>
          </div>
        </div>

        {/* 5. Payment Terms Acceleration */}
        <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <CalendarClock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tighten Receivables (Days)</span>
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              levers.paymentTermsTighteningDays > 0 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              Accelerate +{levers.paymentTermsTighteningDays}d
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="5"
            value={levers.paymentTermsTighteningDays}
            onChange={(e) => updateLever('paymentTermsTighteningDays', Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>0 Days</span>
            <span>+15d Invoicing</span>
            <span>+30d Upfront/Stripe</span>
          </div>
        </div>

        {/* 6. Emergency Credit Line / Grant Buffer */}
        <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Landmark className="w-3.5 h-3.5 text-blue-400" />
              <span>Emergency Bridge Capital</span>
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              levers.creditLineBuffer > 0 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              +${(levers.creditLineBuffer / 1000).toFixed(0)}k Buffer
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100000"
            step="10000"
            value={levers.creditLineBuffer}
            onChange={(e) => updateLever('creditLineBuffer', Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>$0</span>
            <span>$50,000 Bridge</span>
            <span>$100,000 Line</span>
          </div>
        </div>
      </div>
    </div>
  );
};
