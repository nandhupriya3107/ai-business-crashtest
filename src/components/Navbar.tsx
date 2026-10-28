import React from 'react';
import { 
  Flame, 
  Sparkles, 
  FileText, 
  Dice5, 
  Bot, 
  GraduationCap, 
  Briefcase, 
  Crown,
  ChevronDown,
  Plus
} from 'lucide-react';
import { BusinessTwin, UserTier } from '../types';

interface NavbarProps {
  currentTwin: BusinessTwin;
  allTwins: BusinessTwin[];
  onSelectTwin: (twin: BusinessTwin) => void;
  onOpenCreateTwin: () => void;
  currentTier: UserTier;
  onSelectTier: (tier: UserTier) => void;
  onOpenMonteCarlo: () => void;
  onOpenReport: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTwin,
  allTwins,
  onSelectTwin,
  onOpenCreateTwin,
  currentTier,
  onSelectTier,
  onOpenMonteCarlo,
  onOpenReport,
  onToggleCopilot,
  isCopilotOpen
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 shadow-lg shadow-rose-500/20 text-white font-black text-xl">
              <Flame className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  AI Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">CrashTest</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Digital Twin v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Test Your Business Before You Invest.
              </p>
            </div>
          </div>

          {/* Mobile Copilot button */}
          <button 
            onClick={onToggleCopilot}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>AI Copilot</span>
          </button>
        </div>

        {/* Center: Digital Twin Selector */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-center">
          <div className="relative group">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
              Active Digital Twin
            </label>
            <div className="relative">
              <select
                value={currentTwin.id}
                onChange={(e) => {
                  const selected = allTwins.find(t => t.id === e.target.value);
                  if (selected) onSelectTwin(selected);
                }}
                className="appearance-none bg-slate-800/90 hover:bg-slate-800 text-slate-200 text-sm font-medium rounded-lg pl-3 pr-8 py-1.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer shadow-sm transition-colors"
              >
                {allTwins.map(twin => (
                  <option key={twin.id} value={twin.id}>
                    {twin.name} ({twin.industry})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={onOpenCreateTwin}
            title="Create Custom Business Twin"
            className="mt-4 flex items-center justify-center p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Right Tools & Tier Badge */}
        <div className="flex items-center gap-2.5 flex-wrap justify-end w-full md:w-auto">
          {/* Tier Switcher */}
          <div className="flex items-center p-0.5 bg-slate-800/80 rounded-lg border border-slate-700/80 text-xs">
            <button
              onClick={() => onSelectTier('student_incubator')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                currentTier === 'student_incubator'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Student & Incubator Tier: Free grant access for university cohorts"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Incubator</span>
            </button>
            <button
              onClick={() => onSelectTier('freemium')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                currentTier === 'freemium'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Founder Freemium: Standard twin simulations"
            >
              <Briefcase className="w-3.5 h-3.5 text-rose-400" />
              <span>Founder</span>
            </button>
            <button
              onClick={() => onSelectTier('pro_scale')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                currentTier === 'pro_scale'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Pro Scale: Unlimited Monte Carlo runs & executive audit reports"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Pro</span>
            </button>
          </div>

          {/* Monte Carlo Lab button */}
          <button
            onClick={onOpenMonteCarlo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium hover:border-slate-600 transition-colors shadow-sm"
          >
            <Dice5 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Monte Carlo Lab</span>
          </button>

          {/* Executive Audit Report button */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium hover:border-slate-600 transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Audit Report</span>
          </button>

          {/* AI Copilot Toggle */}
          <button
            onClick={onToggleCopilot}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isCopilotOpen 
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/25'
                : 'bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border-indigo-700/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Copilot</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
