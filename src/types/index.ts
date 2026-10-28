export type BusinessModelType = 'saas' | 'ecommerce' | 'agency' | 'brick_mortar' | 'marketplace';

export type UserTier = 'student_incubator' | 'freemium' | 'pro_scale';

export interface BusinessTwin {
  id: string;
  name: string;
  industry: string;
  description: string;
  modelType: BusinessModelType;
  currency: string;
  
  // Financial Foundations
  startingCash: number;            // Current cash balance in bank ($)
  monthlyRevenue: number;          // Current monthly gross revenue / MRR ($)
  customerCount: number;           // Active accounts / clients / customers
  averageOrderValue: number;       // ARPU or average order / retainership ($)
  cogsPercent: number;             // Direct variable cost % (hosting, raw materials, fulfillment)
  
  // Operational Burn & Growth
  fixedOverheadMonthly: number;    // Salaries, rent, software stack, utilities ($)
  monthlyMarketingBudget: number;  // Paid ad spend, agency retainers, sponsorships ($)
  cac: number;                     // Blended Customer Acquisition Cost ($)
  monthlyChurnRate: number;        // Customer loss % per month (e.g. 0.05 for 5%)
  organicGrowthRate: number;       // Natural referral / inbound customer growth %
  paymentTermsDays: number;        // Average days to receive payment (creates cash gap)
  
  // Notes / Strategy
  createdDate: string;
  incubatorCohort?: string;
}

export interface CrashScenario {
  id: string;
  title: string;
  category: 'Market Shock' | 'Cost Surge' | 'Competitive Threat' | 'Operational Crisis' | 'Black Swan';
  badge: string;
  description: string;
  iconName: string;
  severity: 'moderate' | 'high' | 'catastrophic';
  
  // Shock Parameters
  demandShockPercent: number;           // e.g. -35% (leads to drop in new customer acquisition)
  cogsInflationPercent: number;         // e.g. +45% (supply chain, server bill, supplier hike)
  cacInflationPercent: number;          // e.g. +80% (ad costs spike, channel breakdown)
  churnSpikePercent: number;            // e.g. +8% (competitor poaching, dissatisfaction)
  competitorPricePressurePercent: number; // e.g. -20% (forced discounts to preserve sales)
  paymentDelayDaysDelta: number;        // e.g. +30 days (slow-paying enterprise customers)
  fixedCostSurgePercent: number;        // e.g. +15% (emergency software, legal, inflation)
  
  narrativeContext: string;
  realWorldExample: string;
}

export interface DecisionLevers {
  priceDeltaPercent: number;             // -50% to +50%
  marketingBudgetDeltaPercent: number;   // -100% to +200%
  overheadCostCutPercent: number;        // 0% to -60% (emergency opex cuts)
  headcountDeltaPercent: number;         // -50% to +50%
  cogsEfficiencyPercent: number;         // -30% to +20% (supplier renegotiation)
  creditLineBuffer: number;              // Emergency credit/loan injection ($)
  paymentTermsTighteningDays: number;    // Accelerate receivables collection (days)
}

export interface MonthlyDataPoint {
  month: number;
  monthName: string;
  revenue: number;
  grossProfit: number;
  cogs: number;
  fixedCosts: number;
  marketingSpend: number;
  totalExpenses: number;
  netIncome: number;
  cashBalance: number;
  customerCount: number;
  newCustomers: number;
  churnedCustomers: number;
  runwayMonths: number;
  isSolvent: boolean;
}

export interface FailureDiagnostic {
  isCrashed: boolean;
  crashMonth: number | null;
  cashDepletionDate: string | null;
  totalCapitalDestroyed: number;
  minimumCashBalance: number;
  peakBurnRate: number;
  overallRiskScore: number; // 0 (Rock Solid) to 100 (Instant Death)
  riskGrade: 'A (Minimal)' | 'B (Moderate)' | 'C (Elevated)' | 'D (Severe Danger)' | 'F (Fatal Crash)';
  primaryFailureMode: 
    | 'Margin Collapse (Negative Unit Economics)'
    | 'Customer Churn Cascade (Net Depletion)'
    | 'Cashflow & Working Capital Gap (Liquidity Trap)'
    | 'Fixed Overhead Suffocation'
    | 'Customer Acquisition Death Spiral (CAC > LTV)'
    | 'Solvent & Resilient';
  
  rootCauseAnalysis: Array<{
    category: string;
    trigger: string;
    financialLeakage: string;
    criticality: 'Warning' | 'High' | 'Fatal';
    detail: string;
  }>;
}

export interface RecoveryAction {
  id: string;
  pillar: 'Pricing & Unit Economics' | 'Cost Rationalization' | 'Marketing Channel Pivot' | 'Working Capital Optimization';
  action: string;
  projectedCashImpact: string;
  implementationTime: string;
  urgency: 'Immediate (Week 1)' | 'Tactical (Month 1)' | 'Strategic (Month 3)';
  suggestedTuning: Partial<DecisionLevers>;
}

export interface RecoveryPlan {
  title: string;
  overview: string;
  restoredRunwayMonths: number;
  turnaroundCashDelta: number;
  solvencyRestored: boolean;
  actions: RecoveryAction[];
  idealDecisionTuning: DecisionLevers;
}

export interface SimulationResult {
  scenario: CrashScenario | null;
  baselineTrajectory: MonthlyDataPoint[];
  stressedTrajectory: MonthlyDataPoint[];
  recoveredTrajectory?: MonthlyDataPoint[];
  diagnostic: FailureDiagnostic;
  recoveryPlan: RecoveryPlan;
}

export interface MonteCarloIteration {
  runId: number;
  endCash: number;
  crashed: boolean;
  crashMonth: number | null;
  trajectory: number[];
}

export interface MonteCarloSummary {
  totalRuns: number;
  bankruptcyProbabilityPercent: number;
  medianEndCash: number;
  worstCaseCash: number;
  bestCaseCash: number;
  valueAtRisk95: number;
  distributionBins: { range: string; count: number }[];
}
