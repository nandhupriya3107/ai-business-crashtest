import React, { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { TwinOverviewCard } from './components/TwinOverviewCard';
import { CrashScenarioSelector } from './components/CrashScenarioSelector';
import { DecisionSandbox } from './components/DecisionSandbox';
import { SimulationCharts } from './components/SimulationCharts';
import { FailureAutopsy } from './components/FailureAutopsy';
import { RecoveryPlaybook } from './components/RecoveryPlaybook';
import { MonteCarloModal } from './components/MonteCarloModal';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { CreateTwinModal } from './components/CreateTwinModal';
import { AuditReportModal } from './components/AuditReportModal';
import { PRESET_TWINS, CRASH_SCENARIOS, DEFAULT_LEVERS } from './data/mockData';
import { runFullSimulation } from './engine/simulationEngine';
import { BusinessTwin, CrashScenario, DecisionLevers, UserTier } from './types';

function App() {
  const [twins, setTwins] = useState<BusinessTwin[]>(PRESET_TWINS);
  const [activeTwin, setActiveTwin] = useState<BusinessTwin>(PRESET_TWINS[0]);
  const [selectedScenario, setSelectedScenario] = useState<CrashScenario | null>(null);
  const [levers, setLevers] = useState<DecisionLevers>(DEFAULT_LEVERS);
  const [userTier, setUserTier] = useState<UserTier>('freemium');
  const [isPlanApplied, setIsPlanApplied] = useState(false);

  // Modal / Drawer states
  const [isMonteCarloOpen, setIsMonteCarloOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCreateTwinOpen, setIsCreateTwinOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Run simulation whenever twin, scenario, or levers change
  const simulation = runFullSimulation(activeTwin, selectedScenario, levers);

  const handleSelectTwin = useCallback((twin: BusinessTwin) => {
    setActiveTwin(twin);
    setSelectedScenario(null);
    setLevers(DEFAULT_LEVERS);
    setIsPlanApplied(false);
  }, []);

  const handleChangeLevers = useCallback((newLevers: DecisionLevers) => {
    setLevers(newLevers);
    setIsPlanApplied(false);
  }, []);

  const handleApplyRecoveryPlan = useCallback((planLevers: DecisionLevers) => {
    setLevers(planLevers);
    setIsPlanApplied(true);
  }, []);

  const handleApplyCopilotLevers = useCallback((partialLevers: Partial<DecisionLevers>) => {
    setLevers((prev) => ({ ...prev, ...partialLevers }));
    setIsPlanApplied(false);
  }, []);

  const handleResetLevers = useCallback(() => {
    setLevers(DEFAULT_LEVERS);
    setIsPlanApplied(false);
  }, []);

  const handleSaveNewTwin = useCallback((twin: BusinessTwin) => {
    setTwins((prev) => [...prev, twin]);
    setActiveTwin(twin);
    setSelectedScenario(null);
    setLevers(DEFAULT_LEVERS);
    setIsPlanApplied(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar
        currentTwin={activeTwin}
        allTwins={twins}
        onSelectTwin={handleSelectTwin}
        onOpenCreateTwin={() => setIsCreateTwinOpen(true)}
        currentTier={userTier}
        onSelectTier={setUserTier}
        onOpenMonteCarlo={() => setIsMonteCarloOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onToggleCopilot={() => setIsCopilotOpen((v) => !v)}
        isCopilotOpen={isCopilotOpen}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-5">
        {/* 1. Business Twin Overview */}
        <TwinOverviewCard
          twin={activeTwin}
          onEditTwin={() => setIsCreateTwinOpen(true)}
        />

        {/* 2. Crash Scenario Selector */}
        <CrashScenarioSelector
          scenarios={CRASH_SCENARIOS}
          selectedScenario={selectedScenario}
          onSelectScenario={setSelectedScenario}
        />

        {/* 3. Decision Sandbox */}
        <DecisionSandbox
          levers={levers}
          onChangeLevers={handleChangeLevers}
          onReset={handleResetLevers}
        />

        {/* 4. Simulation Charts */}
        <SimulationCharts simulation={simulation} />

        {/* 5. Failure Autopsy */}
        <FailureAutopsy diagnostic={simulation.diagnostic} />

        {/* 6. Recovery Playbook */}
        <RecoveryPlaybook
          recoveryPlan={simulation.recoveryPlan}
          onApplyPlan={handleApplyRecoveryPlan}
          isPlanApplied={isPlanApplied}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 px-8 text-center text-xs text-slate-500">
        AI Business CrashTest · Digital Twin Stress Testing Platform · "Test Your Business Before You Invest." ·{' '}
        <span className="text-slate-400 font-medium">Academic Prototype v1.0</span>
      </footer>

      {/* Modals & Drawers */}
      <MonteCarloModal
        isOpen={isMonteCarloOpen}
        onClose={() => setIsMonteCarloOpen(false)}
        twin={activeTwin}
        scenario={selectedScenario}
        levers={levers}
      />

      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        twin={activeTwin}
        scenario={selectedScenario}
        levers={levers}
        diagnostic={simulation.diagnostic}
        recoveryPlan={simulation.recoveryPlan}
        onApplyLevers={handleApplyCopilotLevers}
      />

      <CreateTwinModal
        isOpen={isCreateTwinOpen}
        onClose={() => setIsCreateTwinOpen(false)}
        onSave={handleSaveNewTwin}
      />

      <AuditReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        twin={activeTwin}
        scenario={selectedScenario}
        simulation={simulation}
      />
    </div>
  );
}

export default App;
