import React from 'react';
import { X, FileText, Printer, Download } from 'lucide-react';
import { BusinessTwin, CrashScenario, SimulationResult } from '../types';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  twin: BusinessTwin;
  scenario: CrashScenario | null;
  simulation: SimulationResult;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  twin,
  scenario,
  simulation,
}) => {
  if (!isOpen) return null;

  const { diagnostic, recoveryPlan } = simulation;
  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Executive CrashTest Audit Report</h3>
              <p className="text-xs text-slate-400">Printable PDF-ready stress test summary.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print / Export PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Title Block */}
          <div className="text-center pb-5 border-b border-slate-800">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 font-semibold">
              AI Business CrashTest — Confidential Stress Analysis
            </p>
            <h1 className="text-2xl font-black text-white tracking-tight">{twin.name}</h1>
            <p className="text-slate-400 text-sm mt-1">{twin.industry} · {twin.description}</p>
            <p className="text-[11px] text-slate-500 mt-3">Report Generated: {now} · Powered by AI Business CrashTest Digital Twin Engine v1.0</p>
          </div>

          {/* Executive Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-rose-500/20 text-rose-400 text-[10px] flex items-center justify-center font-bold border border-rose-500/30">1</span>
              Executive Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Risk Grade', value: diagnostic.riskGrade, color: 'text-rose-400' },
                { label: 'Risk Score', value: `${diagnostic.overallRiskScore}/100`, color: 'text-amber-400' },
                { label: 'Status', value: diagnostic.isCrashed ? 'INSOLVENT' : 'SOLVENT', color: diagnostic.isCrashed ? 'text-red-400' : 'text-emerald-400' },
                { label: 'Cash Trough', value: `$${diagnostic.minimumCashBalance.toLocaleString()}`, color: diagnostic.minimumCashBalance < 0 ? 'text-red-400' : 'text-slate-200' },
              ].map((item) => (
                <div key={item.label} className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">{item.label}</p>
                  <p className={`text-base font-black font-mono ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stress Scenario */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-bold border border-amber-500/30">2</span>
              Stress Scenario Applied
            </h2>
            {scenario ? (
              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white">{scenario.title}</p>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${scenario.severity === 'catastrophic' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>{scenario.severity}</span>
                </div>
                <p className="text-xs text-slate-400">{scenario.narrativeContext}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {scenario.demandShockPercent !== 0 && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-400 border border-rose-500/20">Demand {scenario.demandShockPercent}%</span>}
                  {scenario.cogsInflationPercent !== 0 && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-500/20">COGS +{scenario.cogsInflationPercent}%</span>}
                  {scenario.cacInflationPercent !== 0 && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-purple-400 border border-purple-500/20">CAC +{scenario.cacInflationPercent}%</span>}
                  {scenario.churnSpikePercent !== 0 && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-400 border border-rose-500/20">Churn +{scenario.churnSpikePercent}%</span>}
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/60 rounded-xl p-4 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                ✅ No adverse shock applied — Baseline market conditions.
              </div>
            )}
          </div>

          {/* Root Cause Autopsy */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-indigo-500/20 text-indigo-400 text-[10px] flex items-center justify-center font-bold border border-indigo-500/30">3</span>
              Failure Root Cause Autopsy
            </h2>
            <div className="space-y-2">
              {diagnostic.rootCauseAnalysis.map((rc, idx) => (
                <div key={idx} className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-white">{rc.trigger}</p>
                    <p className="text-xs text-rose-400 font-mono mt-0.5">{rc.financialLeakage}</p>
                    <p className="text-xs text-slate-400 mt-1">{rc.detail}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                    rc.criticality === 'Fatal' ? 'bg-red-500/20 text-red-400' : rc.criticality === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>{rc.criticality}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Blueprint */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold border border-emerald-500/30">4</span>
              AI Recovery Playbook
            </h2>
            <div className="bg-emerald-950/20 rounded-xl p-4 border border-emerald-500/30 mb-3">
              <p className="text-xs font-bold text-emerald-400">{recoveryPlan.title}</p>
              <p className="text-xs text-slate-400 mt-1">{recoveryPlan.overview}</p>
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-slate-400">Runway restored: <strong className="text-emerald-400">{recoveryPlan.restoredRunwayMonths} months</strong></span>
                <span className="text-slate-400">Capital saved: <strong className="text-emerald-400">+${recoveryPlan.turnaroundCashDelta.toLocaleString()}</strong></span>
              </div>
            </div>
            <div className="space-y-2">
              {recoveryPlan.actions.map((act, idx) => (
                <div key={act.id} className="flex items-start gap-3 bg-slate-950/60 rounded-xl p-3 border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0 mt-0.5">{idx + 1}</span>
                  <div>
                    <p className="text-xs font-semibold text-white">{act.pillar} — {act.action}</p>
                    <p className="text-[11px] text-emerald-400 font-mono mt-0.5">{act.projectedCashImpact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-slate-800">
            <p className="text-[10px] text-slate-500">
              AI Business CrashTest · Digital Twin Stress Testing Platform · "Test Your Business Before You Invest." · {now}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
