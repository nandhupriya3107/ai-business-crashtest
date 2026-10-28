import React from 'react';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Wallet, 
  PieChart, 
  ShieldAlert, 
  Sliders, 
  Clock, 
  CheckCircle2,
  Scale
} from 'lucide-react';
import { BusinessTwin } from '../types';

interface TwinOverviewCardProps {
  twin: BusinessTwin;
  onEditTwin: () => void;
}

export const TwinOverviewCard: React.FC<TwinOverviewCardProps> = ({ twin, onEditTwin }) => {
  // Compute baseline LTV
  const grossProfitPerUnit = twin.averageOrderValue * (1 - twin.cogsPercent / 100);
  const estimatedLTV = twin.monthlyChurnRate > 0 
    ? Math.round(grossProfitPerUnit / twin.monthlyChurnRate) 
    : twin.averageOrderValue * 24;
  const ltvCacRatio = twin.cac > 0 ? (estimatedLTV / twin.cac).toFixed(1) : '∞';
  
  // Baseline Net Monthly Burn / Profit
  const monthlyCOGS = twin.monthlyRevenue * (twin.cogsPercent / 100);
  const totalMonthlyBurn = monthlyCOGS + twin.fixedOverheadMonthly + twin.monthlyMarketingBudget;
  const baselineNetCashflow = twin.monthlyRevenue - totalMonthlyBurn;
  const baselineRunway = baselineNetCashflow < 0 
    ? (twin.startingCash / Math.abs(baselineNetCashflow)).toFixed(1) 
    : 'Profitable';

  const modelLabels: Record<string, { label: string; color: string }> = {
    saas: { label: 'B2B SaaS / Subscription', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
    ecommerce: { label: 'D2C E-Commerce', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    agency: { label: 'Agency & Services', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    brick_mortar: { label: 'Retail / Physical Store', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
    marketplace: { label: 'Marketplace / Platform', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-80 h-36 bg-gradient-to-bl from-indigo-500/10 via-rose-500/5 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-rose-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white tracking-tight">{twin.name}</h2>
              <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${modelLabels[twin.modelType]?.color || 'bg-slate-800 text-slate-300'}`}>
                {modelLabels[twin.modelType]?.label || twin.modelType}
              </span>
              {twin.incubatorCohort && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  🌱 {twin.incubatorCohort}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl line-clamp-1">{twin.description}</p>
          </div>
        </div>

        <button
          onClick={onEditTwin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors shrink-0"
        >
          <Sliders className="w-3.5 h-3.5 text-rose-400" />
          <span>Edit Twin Parameters</span>
        </button>
      </div>

      {/* Financial Health Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-4">
        {/* Cash in Bank */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Bank Cash</span>
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-base font-bold text-white tracking-tight">
            ${twin.startingCash.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">
            Runway: <span className="font-semibold text-emerald-400">{baselineRunway} {baselineRunway !== 'Profitable' ? 'mos' : ''}</span>
          </span>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Monthly Rev (MRR)</span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-base font-bold text-white tracking-tight">
            ${twin.monthlyRevenue.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">
            ARPU: <span className="font-semibold text-slate-300">${twin.averageOrderValue}</span>
          </span>
        </div>

        {/* Fixed Overhead */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Fixed Overhead</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-base font-bold text-white tracking-tight">
            ${twin.fixedOverheadMonthly.toLocaleString()}<span className="text-xs text-slate-500 font-normal">/mo</span>
          </p>
          <span className="text-[10px] text-slate-400">
            Direct COGS: <span className="font-semibold text-slate-300">{twin.cogsPercent}%</span>
          </span>
        </div>

        {/* Marketing & CAC */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Marketing Budget</span>
            <PieChart className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-base font-bold text-white tracking-tight">
            ${twin.monthlyMarketingBudget.toLocaleString()}<span className="text-xs text-slate-500 font-normal">/mo</span>
          </p>
          <span className="text-[10px] text-slate-400">
            Blended CAC: <span className="font-semibold text-slate-300">${twin.cac}</span>
          </span>
        </div>

        {/* Customer Base & Churn */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Active Accounts</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-base font-bold text-white tracking-tight">
            {twin.customerCount.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">
            Churn: <span className="font-semibold text-rose-400">{(twin.monthlyChurnRate * 100).toFixed(1)}%/mo</span>
          </span>
        </div>

        {/* Unit Health: LTV:CAC & Payment Terms */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">LTV : CAC Ratio</span>
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-base font-bold text-white tracking-tight">
            {ltvCacRatio}x
          </p>
          <span className="text-[10px] text-slate-400">
            Terms: <span className="font-semibold text-slate-300">Net-{twin.paymentTermsDays}d</span>
          </span>
        </div>
      </div>
    </div>
  );
};
