import { 
  BusinessTwin, 
  CrashScenario, 
  DecisionLevers, 
  MonthlyDataPoint, 
  SimulationResult, 
  FailureDiagnostic, 
  RecoveryPlan, 
  RecoveryAction,
  MonteCarloSummary,
  MonteCarloIteration
} from '../types';
import { DEFAULT_LEVERS } from '../data/mockData';

export function runMonthlySimulation(
  twin: BusinessTwin,
  scenario: CrashScenario | null,
  levers: DecisionLevers,
  isRecoveryMode: boolean = false
): MonthlyDataPoint[] {
  const months = 12;
  const monthNames = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'];
  const trajectory: MonthlyDataPoint[] = [];

  let currentCustomers = twin.customerCount;
  let currentCash = twin.startingCash + (levers.creditLineBuffer || 0);

  // Accounts receivable pipeline for payment term simulation
  // pendingReceivables tracks uncollected revenue by due month
  const pendingInflows: number[] = new Array(months + 4).fill(0);

  // Initial backlog collection from before simulation start
  const initialMonthlyRev = twin.monthlyRevenue;
  pendingInflows[0] = initialMonthlyRev * 0.7;
  pendingInflows[1] = initialMonthlyRev * 0.3;

  for (let m = 0; m < months; m++) {
    // 1. Shocks & Lever modifiers
    const demandShock = scenario ? scenario.demandShockPercent / 100 : 0;
    const cogsInflation = scenario ? scenario.cogsInflationPercent / 100 : 0;
    const cacInflation = scenario ? scenario.cacInflationPercent / 100 : 0;
    const churnSpike = scenario ? scenario.churnSpikePercent / 100 : 0;
    const competitorDiscount = scenario ? scenario.competitorPricePressurePercent / 100 : 0;
    const paymentDelayDays = scenario ? scenario.paymentDelayDaysDelta : 0;
    const fixedCostSurge = scenario ? scenario.fixedCostSurgePercent / 100 : 0;

    // Decision levers
    const priceDelta = levers.priceDeltaPercent / 100;
    const marketingDelta = levers.marketingBudgetDeltaPercent / 100;
    const opexCut = levers.overheadCostCutPercent / 100; // negative or 0
    const headcountDelta = levers.headcountDeltaPercent / 100;
    const cogsEfficiency = levers.cogsEfficiencyPercent / 100;
    const termsTighteningDays = levers.paymentTermsTighteningDays || 0;

    // Effective unit economics
    // Price elasticity: roughly -0.8 elasticity
    const netPriceModifier = (1 + priceDelta) * (1 + competitorDiscount);
    const effectiveARPU = Math.max(1, twin.averageOrderValue * netPriceModifier);
    const elasticityPenalty = priceDelta > 0 ? (priceDelta * -0.7) : (priceDelta * -0.3);

    // Dynamic churn rate
    let effectiveChurn = Math.max(0.01, Math.min(0.60, twin.monthlyChurnRate + churnSpike));
    if (priceDelta > 0.2) effectiveChurn += (priceDelta * 0.08); // high price hike increases churn slightly
    if (isRecoveryMode) effectiveChurn = Math.max(0.02, effectiveChurn * 0.85); // retention boost

    // Dynamic CAC
    let effectiveCAC = Math.max(5, twin.cac * (1 + cacInflation));
    if (marketingDelta > 0.5) {
      // Ad saturation curve
      effectiveCAC *= (1 + (marketingDelta * 0.25));
    }

    // Dynamic Marketing Spend
    const effectiveMarketingSpend = Math.max(0, twin.monthlyMarketingBudget * (1 + marketingDelta));

    // New customer acquisition
    const paidNewCustomers = effectiveCAC > 0 ? (effectiveMarketingSpend / effectiveCAC) : 0;
    const organicGrowthModifier = Math.max(-0.8, (twin.organicGrowthRate + (demandShock * 0.5) + elasticityPenalty));
    const organicNewCustomers = Math.max(0, currentCustomers * Math.max(0, organicGrowthModifier));
    const totalNewCustomers = Math.round(paidNewCustomers + organicNewCustomers);

    // Churn customer calculation
    const churnedCustomers = Math.round(currentCustomers * effectiveChurn);
    
    // Ending customers for this month
    currentCustomers = Math.max(0, currentCustomers + totalNewCustomers - churnedCustomers);

    // Revenue
    const monthlyGrossRevenue = currentCustomers * effectiveARPU;

    // Direct COGS
    const effectiveCogsPercent = Math.max(0.05, Math.min(0.95, 
      (twin.cogsPercent / 100) * (1 + cogsInflation) * (1 + cogsEfficiency)
    ));
    const monthlyCogs = monthlyGrossRevenue * effectiveCogsPercent;
    const grossProfit = monthlyGrossRevenue - monthlyCogs;

    // Fixed Overhead
    const effectiveFixedCosts = Math.max(1000, 
      twin.fixedOverheadMonthly * (1 + fixedCostSurge) * (1 + opexCut) * (1 + (headcountDelta * 0.6))
    );

    const totalExpenses = monthlyCogs + effectiveFixedCosts + effectiveMarketingSpend;
    const netIncome = monthlyGrossRevenue - totalExpenses;

    // Working capital cash timing (Receivables lag)
    const effectivePaymentDays = Math.max(1, twin.paymentTermsDays + paymentDelayDays - termsTighteningDays);
    const immediateCollectedShare = Math.max(0.15, Math.min(0.95, 1 - (effectivePaymentDays / 60)));
    const deferredShare = 1 - immediateCollectedShare;

    // Current month cash collected from current sales
    const currentMonthCollected = monthlyGrossRevenue * immediateCollectedShare;
    // Remainder enters pipeline for next month(s)
    pendingInflows[m + 1] += (monthlyGrossRevenue * deferredShare * 0.75);
    pendingInflows[m + 2] += (monthlyGrossRevenue * deferredShare * 0.25);

    // Total cash in this month = collected immediately + past collections arriving now
    const totalCashInflow = currentMonthCollected + (pendingInflows[m] || 0);
    const totalCashOutflow = monthlyCogs + effectiveFixedCosts + effectiveMarketingSpend;
    const netCashFlow = totalCashInflow - totalCashOutflow;

    currentCash += netCashFlow;

    // Burn rate and runway
    const monthlyBurn = netCashFlow < 0 ? Math.abs(netCashFlow) : 0;
    const runwayMonths = monthlyBurn > 0 ? Math.max(0, currentCash / monthlyBurn) : (currentCash > 0 ? 99 : 0);
    const isSolvent = currentCash > 0;

    trajectory.push({
      month: m + 1,
      monthName: monthNames[m],
      revenue: Math.round(monthlyGrossRevenue),
      grossProfit: Math.round(grossProfit),
      cogs: Math.round(monthlyCogs),
      fixedCosts: Math.round(effectiveFixedCosts),
      marketingSpend: Math.round(effectiveMarketingSpend),
      totalExpenses: Math.round(totalExpenses),
      netIncome: Math.round(netIncome),
      cashBalance: Math.round(currentCash),
      customerCount: currentCustomers,
      newCustomers: totalNewCustomers,
      churnedCustomers: churnedCustomers,
      runwayMonths: Number(runwayMonths.toFixed(1)),
      isSolvent
    });
  }

  return trajectory;
}

export function generateFailureDiagnostic(
  twin: BusinessTwin,
  scenario: CrashScenario | null,
  baselineTrajectory: MonthlyDataPoint[],
  stressedTrajectory: MonthlyDataPoint[]
): FailureDiagnostic {
  let crashMonth: number | null = null;
  let minCash = twin.startingCash;
  let peakBurn = 0;

  for (let i = 0; i < stressedTrajectory.length; i++) {
    const pt = stressedTrajectory[i];
    if (pt.cashBalance < minCash) minCash = pt.cashBalance;
    const burn = pt.totalExpenses - pt.revenue;
    if (burn > peakBurn) peakBurn = burn;

    if (pt.cashBalance <= 0 && crashMonth === null) {
      crashMonth = pt.month;
    }
  }

  const isCrashed = crashMonth !== null || minCash <= 0;
  
  // Total capital destroyed = Baseline Month 12 Cash - Stressed Month 12 Cash
  const baselineEndCash = baselineTrajectory[baselineTrajectory.length - 1]?.cashBalance || 0;
  const stressedEndCash = stressedTrajectory[stressedTrajectory.length - 1]?.cashBalance || 0;
  const totalCapitalDestroyed = Math.max(0, baselineEndCash - stressedEndCash);

  // Compute Risk Score (0 - 100)
  let riskScore = 15; // baseline baseline friction
  if (!scenario) {
    riskScore = 10;
  } else {
    if (scenario.severity === 'catastrophic') riskScore += 45;
    else if (scenario.severity === 'high') riskScore += 30;
    else riskScore += 18;

    if (isCrashed) {
      if (crashMonth! <= 3) riskScore = Math.min(100, riskScore + 40);
      else if (crashMonth! <= 6) riskScore = Math.min(96, riskScore + 30);
      else riskScore = Math.min(88, riskScore + 20);
    } else {
      // Survived, but how tight was the cash buffer?
      if (minCash < twin.startingCash * 0.2) riskScore += 18;
      else if (minCash < twin.startingCash * 0.5) riskScore += 10;
    }
  }

  let riskGrade: FailureDiagnostic['riskGrade'] = 'B (Moderate)';
  if (riskScore >= 85) riskGrade = 'F (Fatal Crash)';
  else if (riskScore >= 70) riskGrade = 'D (Severe Danger)';
  else if (riskScore >= 45) riskGrade = 'C (Elevated)';
  else if (riskScore >= 25) riskGrade = 'B (Moderate)';
  else riskGrade = 'A (Minimal)';

  // Determine Primary Failure Mode
  let primaryFailureMode: FailureDiagnostic['primaryFailureMode'] = 'Solvent & Resilient';
  const rootCauseAnalysis: FailureDiagnostic['rootCauseAnalysis'] = [];

  if (isCrashed || riskScore >= 50) {
    const avgGrossMargin = stressedTrajectory.reduce((acc, p) => acc + (p.grossProfit / (p.revenue || 1)), 0) / stressedTrajectory.length;
    const finalCustomers = stressedTrajectory[stressedTrajectory.length - 1].customerCount;
    const customerLossRatio = (twin.customerCount - finalCustomers) / twin.customerCount;
    const paymentLagImpact = (scenario?.paymentDelayDaysDelta || 0);

    if (scenario?.id === 'scenario-cost-spike' || avgGrossMargin < 0.25) {
      primaryFailureMode = 'Margin Collapse (Negative Unit Economics)';
      rootCauseAnalysis.push({
        category: 'Unit Economics Failure',
        trigger: 'Surging Direct COGS & Vendor Costs',
        financialLeakage: `Gross margin degraded to ${(avgGrossMargin * 100).toFixed(1)}%`,
        criticality: 'Fatal',
        detail: 'Direct operational costs consumed almost all top-line revenue, leaving virtually zero gross contribution to service fixed payroll and overhead.'
      });
    } else if (scenario?.id === 'scenario-liquidity-trap' || paymentLagImpact >= 30) {
      primaryFailureMode = 'Cashflow & Working Capital Gap (Liquidity Trap)';
      rootCauseAnalysis.push({
        category: 'Working Capital Freeze',
        trigger: 'Receivables Delay (Net-60+ Days)',
        financialLeakage: `Trapped receivables caused a $${Math.abs(minCash).toLocaleString()} liquidity hole`,
        criticality: 'Fatal',
        detail: 'Paper profitability remained positive, but cash receipts trailed payroll and vendor commitments by more than 45 days, causing technical insolvency.'
      });
    } else if (scenario?.id === 'scenario-cac-death-spiral') {
      primaryFailureMode = 'Customer Acquisition Death Spiral (CAC > LTV)';
      rootCauseAnalysis.push({
        category: 'Marketing Efficiency Breakdown',
        trigger: 'Ad Channel CPM Inflation & Attribution Loss',
        financialLeakage: `Blended CAC rose by ${scenario.cacInflationPercent}%, destroying marketing ROI`,
        criticality: 'High',
        detail: 'Acquiring each customer now costs more than their expected 12-month gross margin contribution. Every additional marketing dollar accelerated cash depletion.'
      });
    } else if (customerLossRatio > 0.35 || (scenario?.churnSpikePercent || 0) > 5) {
      primaryFailureMode = 'Customer Churn Cascade (Net Depletion)';
      rootCauseAnalysis.push({
        category: 'Customer Base Evaporation',
        trigger: 'Competitive Churn & Unfavorable Defection',
        financialLeakage: `${Math.round(customerLossRatio * 100)}% shrinkage in active paying accounts`,
        criticality: 'Fatal',
        detail: 'Monthly account cancellations outpaced new sales pipeline conversion by 2.4x, triggering an irreversible contraction in monthly recurring revenue.'
      });
    } else {
      primaryFailureMode = 'Fixed Overhead Suffocation';
      rootCauseAnalysis.push({
        category: 'Structural Burn Inflexibility',
        trigger: 'Overhead Opex in Excess of Compressed Gross Profit',
        financialLeakage: `Monthly fixed burn of $${twin.fixedOverheadMonthly.toLocaleString()} outstripped contracted margins`,
        criticality: 'Fatal',
        detail: 'Fixed operating commitments (leases, baseline payroll) proved too rigid when macro demand contracted, resulting in continuous negative net cashflow.'
      });
    }

    // Additional secondary root causes
    if (stressedTrajectory[0].marketingSpend > 0 && (scenario?.cacInflationPercent || 0) > 20) {
      rootCauseAnalysis.push({
        category: 'Marketing Waste',
        trigger: 'Unadjusted Paid Ad Spend',
        financialLeakage: `Consuming $${stressedTrajectory[0].marketingSpend.toLocaleString()}/mo during elevated CAC`,
        criticality: 'Warning',
        detail: 'Failing to dynamically throttle paid ad channels when acquisition efficiency degraded.'
      });
    }

    if (twin.paymentTermsDays > 20) {
      rootCauseAnalysis.push({
        category: 'Credit Terms Vulnerability',
        trigger: 'Loose Receivables Governance',
        financialLeakage: `${twin.paymentTermsDays}-day standard payment terms allowed customer cash to sit outside bank accounts`,
        criticality: 'Warning',
        detail: 'Lack of upfront retainer billing or auto-pay enabled cash buffer to drain prematurely.'
      });
    }
  } else {
    rootCauseAnalysis.push({
      category: 'Capital Health',
      trigger: 'Healthy Liquidity Reserves',
      financialLeakage: 'Zero capital insolvency',
      criticality: 'Warning',
      detail: 'The business model absorbed the selected conditions without breaching minimum cash thresholds.'
    });
  }

  return {
    isCrashed,
    crashMonth,
    cashDepletionDate: crashMonth ? `Month ${crashMonth} of 12` : null,
    totalCapitalDestroyed: Math.round(totalCapitalDestroyed),
    minimumCashBalance: Math.round(minCash),
    peakBurnRate: Math.round(peakBurn),
    overallRiskScore: riskScore,
    riskGrade,
    primaryFailureMode,
    rootCauseAnalysis
  };
}

export function generateRecoveryPlan(
  twin: BusinessTwin,
  scenario: CrashScenario | null,
  diagnostic: FailureDiagnostic
): RecoveryPlan {
  const actions: RecoveryAction[] = [];
  let title = 'AI Tactical Turnaround Playbook';
  let overview = 'A balanced 3-phase stabilization plan to preserve cash, renegotiate unit margins, and restore positive cashflow runway.';

  const idealTuning: DecisionLevers = {
    priceDeltaPercent: 0,
    marketingBudgetDeltaPercent: 0,
    overheadCostCutPercent: 0,
    headcountDeltaPercent: 0,
    cogsEfficiencyPercent: 0,
    creditLineBuffer: 0,
    paymentTermsTighteningDays: 0,
  };

  if (diagnostic.primaryFailureMode.includes('Margin Collapse')) {
    title = 'Gross Margin Re-Anchoring & COGS Arbitrage';
    overview = 'Surging direct costs have turned sales unprofitable. We must immediately renegotiate upstream vendor tiers and re-anchor pricing with high-value tiered packaging.';
    
    actions.push({
      id: 'rec-1',
      pillar: 'Pricing & Unit Economics',
      action: 'Implement a +18% value-driven price revision on premium tiers and introduce an annual billing incentive.',
      projectedCashImpact: '+$14,200/mo gross profit recovery',
      implementationTime: '14 days',
      urgency: 'Immediate (Week 1)',
      suggestedTuning: { priceDeltaPercent: 18 }
    });
    idealTuning.priceDeltaPercent = 18;

    actions.push({
      id: 'rec-2',
      pillar: 'Cost Rationalization',
      action: 'Renegotiate cloud inference API rates, shift to reserved instances, and audit raw material suppliers for a 20% discount.',
      projectedCashImpact: '-$8,500/mo reduction in direct COGS',
      implementationTime: '30 days',
      urgency: 'Tactical (Month 1)',
      suggestedTuning: { cogsEfficiencyPercent: -20 }
    });
    idealTuning.cogsEfficiencyPercent = -20;

    actions.push({
      id: 'rec-3',
      pillar: 'Cost Rationalization',
      action: 'Prune underutilized SaaS tool subscriptions and freeze discretionary travel/entertainment expenses.',
      projectedCashImpact: '-$3,800/mo saved in fixed overhead',
      implementationTime: '7 days',
      urgency: 'Immediate (Week 1)',
      suggestedTuning: { overheadCostCutPercent: -15 }
    });
    idealTuning.overheadCostCutPercent = -15;

  } else if (diagnostic.primaryFailureMode.includes('Working Capital') || diagnostic.primaryFailureMode.includes('Liquidity Trap')) {
    title = 'Receivables Acceleration & Cashflow Bridge Protocol';
    overview = 'Your paper business is viable, but cash timing is fatal. We must aggressively compress payment terms, incentivize upfront payments, and secure a revolving credit buffer.';

    actions.push({
      id: 'rec-1',
      pillar: 'Working Capital Optimization',
      action: 'Convert enterprise accounts from Net-45/60 to Net-15 or mandate 2% 10-net-30 early settlement discounts.',
      projectedCashImpact: '+$38,000 cash acceleration within 30 days',
      implementationTime: '7 days',
      urgency: 'Immediate (Week 1)',
      suggestedTuning: { paymentTermsTighteningDays: 30 }
    });
    idealTuning.paymentTermsTighteningDays = 30;

    actions.push({
      id: 'rec-2',
      pillar: 'Working Capital Optimization',
      action: 'Activate an emergency $40,000 receivables credit facility or revenue-based financing line to bridge collection lags.',
      projectedCashImpact: '+$40,000 immediate liquidity injection',
      implementationTime: '10 days',
      urgency: 'Immediate (Week 1)',
      suggestedTuning: { creditLineBuffer: 40000 }
    });
    idealTuning.creditLineBuffer = 40000;

    actions.push({
      id: 'rec-3',
      pillar: 'Cost Rationalization',
      action: 'Request extended 60-day payment terms from primary enterprise software and cloud hosting vendors.',
      projectedCashImpact: 'Conserves $12,000 working capital buffer',
      implementationTime: '14 days',
      urgency: 'Tactical (Month 1)',
      suggestedTuning: { overheadCostCutPercent: -10 }
    });
    idealTuning.overheadCostCutPercent = -10;

  } else if (diagnostic.primaryFailureMode.includes('Customer Acquisition Death Spiral')) {
    title = 'Ad Channel Surgery & Organic Flywheel Re-Pivot';
    overview = 'Paid ad channels have turned into a cash incinerator. Cut inefficient ad spend immediately, double down on high-retention organic referrals, and adjust pricing.';

    actions.push({
      id: 'rec-1',
      pillar: 'Marketing Channel Pivot',
      action: 'Slash unprofitable paid ad channels by 50% and divert budget into viral customer referral incentives and content SEO.',
      projectedCashImpact: 'Halts $13,000/mo cash leak while preserving 70% of inbound quality',
      implementationTime: '48 hours',
      urgency: 'Immediate (Week 1)',
      suggestedTuning: { marketingBudgetDeltaPercent: -50 }
    });
    idealTuning.marketingBudgetDeltaPercent = -50;

    actions.push({
      id: 'rec-2',
      pillar: 'Pricing & Unit Economics',
      action: 'Introduce onboarding setup fees or multi-month commitments to offset upfront acquisition costs.',
      projectedCashImpact: '+$180 immediate cash collected per new customer',
      implementationTime: '14 days',
      urgency: 'Tactical (Month 1)',
      suggestedTuning: { priceDeltaPercent: 12 }
    });
    idealTuning.priceDeltaPercent = 12;

    actions.push({
      id: 'rec-3',
      pillar: 'Cost Rationalization',
      action: 'Restructure non-core marketing contractor fees to performance-contingent milestone compensation.',
      projectedCashImpact: '-$4,500/mo fixed burn reduction',
      implementationTime: '21 days',
      urgency: 'Tactical (Month 1)',
      suggestedTuning: { overheadCostCutPercent: -12 }
    });
    idealTuning.overheadCostCutPercent = -12;

  } else if (diagnostic.primaryFailureMode.includes('Customer Churn Cascade')) {
    title = 'Retention Firewall & Expansion Revenue Playbook';
    overview = 'Defections are eroding your base faster than new sales can replace them. Establish an executive customer success concierge, bundle annual contracts, and offer loyalty credits.';

    actions.push({
      id: 'rec-1',
      pillar: 'Pricing & Unit Economics',
      action: 'Offer a 20% discount locked into 12-month non-cancelable annual contracts to lock in high-risk cohort revenue.',
      projectedCashImpact: 'Reduces monthly churn by 45% and brings forward upfront cash',
      implementationTime: '10 days',
      urgency: 'Immediate (Week 1)',
      suggestedTuning: { priceDeltaPercent: -5 }
    });
    idealTuning.priceDeltaPercent = -5;

    actions.push({
      id: 'rec-2',
      pillar: 'Cost Rationalization',
      action: 'Reallocate 20% of low-performing outbound sales budget into dedicated technical customer success and product stability.',
      projectedCashImpact: 'Saves estimated $22,000 in churned MRR across 6 months',
      implementationTime: '14 days',
      urgency: 'Tactical (Month 1)',
      suggestedTuning: { overheadCostCutPercent: -10 }
    });
    idealTuning.overheadCostCutPercent = -10;

    actions.push({
      id: 'rec-3',
      pillar: 'Marketing Channel Pivot',
      action: 'Launch an automated customer referral flywheel with double-sided credits to replace lost accounts with high-trust referrals.',
      projectedCashImpact: '+$6,000/mo incremental organic ARR',
      implementationTime: '21 days',
      urgency: 'Tactical (Month 1)',
      suggestedTuning: { marketingBudgetDeltaPercent: -20 }
    });
    idealTuning.marketingBudgetDeltaPercent = -20;

  } else {
    // Fixed Overhead Suffocation / General Stress
    title = 'Lean Runway Defense & Core Profitability Reset';
    overview = 'Fixed commitments exceed current market revenue. Trim non-critical overhead, optimize marketing, and modestly raise prices to re-align break-even volume.';

    actions.push({
      id: 'rec-1',
      pillar: 'Cost Rationalization',
      action: 'Initiate a 22% overhead reduction across office leases, non-essential software seats, and external consulting retainers.',
      projectedCashImpact: '-$8,200/mo permanent fixed burn reduction',
      implementationTime: '14 days',
      urgency: 'Immediate (Week 1)',
      suggestedTuning: { overheadCostCutPercent: -22 }
    });
    idealTuning.overheadCostCutPercent = -22;

    actions.push({
      id: 'rec-2',
      pillar: 'Pricing & Unit Economics',
      action: 'Apply a calibrated +10% price increase with grandfathering for loyal long-term advocates.',
      projectedCashImpact: '+$7,800/mo incremental high-margin cash',
      implementationTime: '14 days',
      urgency: 'Tactical (Month 1)',
      suggestedTuning: { priceDeltaPercent: 10 }
    });
    idealTuning.priceDeltaPercent = 10;

    actions.push({
      id: 'rec-3',
      pillar: 'Working Capital Optimization',
      action: 'Shorten receivables collection terms from 30+ days down to 15 days with automated Stripe invoicing.',
      projectedCashImpact: '+$18,000 cash acceleration',
      implementationTime: '7 days',
      urgency: 'Immediate (Week 1)',
      suggestedTuning: { paymentTermsTighteningDays: 15 }
    });
    idealTuning.paymentTermsTighteningDays = 15;
  }

  // Calculate recovered trajectory with ideal tuning to measure restored runway and cash delta
  const recoveredTraj = runMonthlySimulation(twin, scenario, idealTuning, true);
  const stressedEnd = diagnostic.minimumCashBalance;
  const recoveredEnd = recoveredTraj[recoveredTraj.length - 1].cashBalance;
  const turnaroundCashDelta = Math.max(0, recoveredEnd - Math.max(0, stressedEnd));
  const restoredRunwayMonths = recoveredTraj[recoveredTraj.length - 1].runwayMonths;
  const solvencyRestored = recoveredTraj.every(p => p.isSolvent);

  return {
    title,
    overview,
    restoredRunwayMonths: Number(restoredRunwayMonths.toFixed(1)),
    turnaroundCashDelta: Math.round(turnaroundCashDelta),
    solvencyRestored,
    actions,
    idealDecisionTuning: idealTuning
  };
}

export function runFullSimulation(
  twin: BusinessTwin,
  scenario: CrashScenario | null,
  levers: DecisionLevers
): SimulationResult {
  const baselineTrajectory = runMonthlySimulation(twin, null, DEFAULT_LEVERS);
  const stressedTrajectory = runMonthlySimulation(twin, scenario, levers);
  const diagnostic = generateFailureDiagnostic(twin, scenario, baselineTrajectory, stressedTrajectory);
  const recoveryPlan = generateRecoveryPlan(twin, scenario, diagnostic);
  const recoveredTrajectory = runMonthlySimulation(twin, scenario, recoveryPlan.idealDecisionTuning, true);

  return {
    scenario,
    baselineTrajectory,
    stressedTrajectory,
    recoveredTrajectory,
    diagnostic,
    recoveryPlan
  };
}

// Monte Carlo Engine: 100 stochastic trials simulating realistic market fluctuations
export function runMonteCarloStressTest(
  twin: BusinessTwin,
  scenario: CrashScenario | null,
  levers: DecisionLevers,
  iterationsCount: number = 100
): MonteCarloSummary {
  const iterations: MonteCarloIteration[] = [];
  let bankruptcies = 0;
  const endCashList: number[] = [];

  for (let i = 0; i < iterationsCount; i++) {
    // Generate realistic Gaussian stochastic jitter (+/- 15% volatility)
    const demandJitter = (Math.random() - 0.5) * 0.20;
    const cogsJitter = (Math.random() - 0.5) * 0.15;
    const churnJitter = (Math.random() - 0.5) * 0.03;
    const cacJitter = (Math.random() - 0.5) * 0.25;

    // Temporary perturbed scenario
    const perturbedScenario: CrashScenario | null = scenario ? {
      ...scenario,
      demandShockPercent: scenario.demandShockPercent * (1 + demandJitter),
      cogsInflationPercent: scenario.cogsInflationPercent * (1 + cogsJitter),
      churnSpikePercent: Math.max(0, scenario.churnSpikePercent + (churnJitter * 100)),
      cacInflationPercent: scenario.cacInflationPercent * (1 + cacJitter),
    } : null;

    const traj = runMonthlySimulation(twin, perturbedScenario, levers);
    const endCash = traj[traj.length - 1].cashBalance;
    const crashed = traj.some(p => p.cashBalance <= 0);
    const crashMonth = crashed ? (traj.findIndex(p => p.cashBalance <= 0) + 1) : null;

    if (crashed) bankruptcies++;
    endCashList.push(endCash);

    iterations.push({
      runId: i + 1,
      endCash,
      crashed,
      crashMonth,
      trajectory: traj.map(p => p.cashBalance)
    });
  }

  endCashList.sort((a, b) => a - b);
  const medianEndCash = endCashList[Math.floor(endCashList.length / 2)];
  const worstCaseCash = endCashList[0];
  const bestCaseCash = endCashList[endCashList.length - 1];
  const var95Index = Math.max(0, Math.floor(endCashList.length * 0.05));
  const valueAtRisk95 = endCashList[var95Index];

  // Create distribution histogram bins
  const binCount = 5;
  const minVal = worstCaseCash;
  const maxVal = bestCaseCash;
  const step = Math.max(1, (maxVal - minVal) / binCount);

  const distributionBins: { range: string; count: number }[] = [];
  for (let b = 0; b < binCount; b++) {
    const binLow = minVal + (b * step);
    const binHigh = minVal + ((b + 1) * step);
    const count = endCashList.filter(v => v >= binLow && (b === binCount - 1 ? v <= binHigh : v < binHigh)).length;
    
    const fmt = (n: number) => n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${Math.round(n)}`;
    distributionBins.push({
      range: `${fmt(binLow)} to ${fmt(binHigh)}`,
      count
    });
  }

  return {
    totalRuns: iterationsCount,
    bankruptcyProbabilityPercent: Math.round((bankruptcies / iterationsCount) * 100),
    medianEndCash: Math.round(medianEndCash),
    worstCaseCash: Math.round(worstCaseCash),
    bestCaseCash: Math.round(bestCaseCash),
    valueAtRisk95: Math.round(valueAtRisk95),
    distributionBins
  };
}
