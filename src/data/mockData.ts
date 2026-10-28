import { BusinessTwin, CrashScenario, DecisionLevers } from '../types';

export const DEFAULT_LEVERS: DecisionLevers = {
  priceDeltaPercent: 0,
  marketingBudgetDeltaPercent: 0,
  overheadCostCutPercent: 0,
  headcountDeltaPercent: 0,
  cogsEfficiencyPercent: 0,
  creditLineBuffer: 0,
  paymentTermsTighteningDays: 0,
};

export const PRESET_TWINS: BusinessTwin[] = [
  {
    id: 'twin-saas-1',
    name: 'PulseFlow AI Analytics',
    industry: 'B2B SaaS / AI Software',
    description: 'B2B subscription platform analyzing customer telemetry for mid-market SaaS companies.',
    modelType: 'saas',
    currency: '$',
    startingCash: 180000,
    monthlyRevenue: 48000,
    customerCount: 240,
    averageOrderValue: 200,
    cogsPercent: 18, // Cloud compute, LLM API tokens, hosting
    fixedOverheadMonthly: 36000, // Engineering & support salaries, tooling, office
    monthlyMarketingBudget: 12000, // LinkedIn ads, content marketing, outbound SDR
    cac: 350,
    monthlyChurnRate: 0.045, // 4.5% monthly churn
    organicGrowthRate: 0.03, // 3% referral growth
    paymentTermsDays: 14,
    createdDate: '2026-09-15',
    incubatorCohort: 'Techstars Winter 2026',
  },
  {
    id: 'twin-ecom-2',
    name: 'Vanguard Activewear',
    industry: 'D2C E-Commerce & Retail',
    description: 'Direct-to-consumer sustainable athletic apparel brand selling via Shopify and TikTok Shop.',
    modelType: 'ecommerce',
    currency: '$',
    startingCash: 95000,
    monthlyRevenue: 85000,
    customerCount: 1250,
    averageOrderValue: 68,
    cogsPercent: 46, // Garment manufacturing, warehousing, freight
    fixedOverheadMonthly: 24000, // Warehouse lease, core team, logistics ops
    monthlyMarketingBudget: 26000, // Meta / TikTok ads, influencer gifting
    cac: 28,
    monthlyChurnRate: 0.25, // One-off repeat cycle (25% decay in cohort)
    organicGrowthRate: 0.06,
    paymentTermsDays: 5,
    createdDate: '2026-10-01',
    incubatorCohort: 'Shopify Founders Lab',
  },
  {
    id: 'twin-agency-3',
    name: 'Hyperion Digital Growth',
    industry: 'Agency & Professional Services',
    description: 'Specialized performance marketing and retention engineering agency with retainer clients.',
    modelType: 'agency',
    currency: '$',
    startingCash: 75000,
    monthlyRevenue: 62000,
    customerCount: 14,
    averageOrderValue: 4428,
    cogsPercent: 32, // Senior contractor freelancers, design tooling
    fixedOverheadMonthly: 34000, // Core payroll, legal, insurance, sales
    monthlyMarketingBudget: 4000, // Inbound webinars, case studies, sales reps
    cac: 1200,
    monthlyChurnRate: 0.07, // 7% client churn
    organicGrowthRate: 0.04,
    paymentTermsDays: 45, // Heavy Net-45 enterprise billing delay!
    createdDate: '2026-08-20',
  },
  {
    id: 'twin-student-4',
    name: 'StudyBuddy AI (Student Incubator)',
    industry: 'EdTech / Student Startup',
    description: 'University-incubated peer-tutoring and exam prep assistant targeting college students.',
    modelType: 'saas',
    currency: '$',
    startingCash: 28000, // Seed competition prize
    monthlyRevenue: 9200,
    customerCount: 460,
    averageOrderValue: 20,
    cogsPercent: 22, // OpenAI API tokens & Supabase backend
    fixedOverheadMonthly: 6800, // Student founder stipends, domain, server
    monthlyMarketingBudget: 2500, // Campus ambassadors, flyer promos, reels
    cac: 14,
    monthlyChurnRate: 0.08, // 8% seasonal churn
    organicGrowthRate: 0.08, // Strong viral campus loop
    paymentTermsDays: 2,
    createdDate: '2026-10-10',
    incubatorCohort: 'University Entrepreneurship Hub 2026',
  },
  {
    id: 'twin-retail-5',
    name: 'Craft & Bean Roasters',
    industry: 'Food & Beverage / Brick & Mortar',
    description: 'Specialty coffee roastery with 2 storefront locations and wholesale beans to local cafes.',
    modelType: 'brick_mortar',
    currency: '$',
    startingCash: 45000,
    monthlyRevenue: 52000,
    customerCount: 3200,
    averageOrderValue: 16.25,
    cogsPercent: 38, // Green coffee beans, dairy, packaging, cups
    fixedOverheadMonthly: 26000, // Commercial lease, barista staff, utilities
    monthlyMarketingBudget: 3500, // Local geo ads, loyalty app perks
    cac: 6.5,
    monthlyChurnRate: 0.12,
    organicGrowthRate: 0.10,
    paymentTermsDays: 7,
    createdDate: '2026-07-12',
  }
];

export const CRASH_SCENARIOS: CrashScenario[] = [
  {
    id: 'scenario-demand-shock',
    title: 'The Great Demand Contraction',
    category: 'Market Shock',
    badge: 'Macro Recession',
    description: 'Enterprise spending freezes and discretionary consumer sentiment collapses across your market segment.',
    iconName: 'TrendingDown',
    severity: 'high',
    demandShockPercent: -42,
    cogsInflationPercent: 0,
    cacInflationPercent: 35,
    churnSpikePercent: 6,
    competitorPricePressurePercent: 0,
    paymentDelayDaysDelta: 15,
    fixedCostSurgePercent: 0,
    narrativeContext: 'Customer budgets freeze across the industry. Acquisition rates tumble while existing buyers review invoices and cut "nice-to-have" subscriptions.',
    realWorldExample: 'Q1 2023 tech spending pullback, where B2B SaaS deal cycles doubled and enterprise sales pipelines shrank 40% overnight.'
  },
  {
    id: 'scenario-competitor-price-war',
    title: 'Venture-Funded Competitor Price War',
    category: 'Competitive Threat',
    badge: 'Price War',
    description: 'A heavily funded rival enters your vertical offering predatory 40% discounts and poaching tier-1 customers.',
    iconName: 'Swords',
    severity: 'catastrophic',
    demandShockPercent: -20,
    cogsInflationPercent: 5,
    cacInflationPercent: 90,
    churnSpikePercent: 9.5,
    competitorPricePressurePercent: -28,
    paymentDelayDaysDelta: 0,
    fixedCostSurgePercent: 10,
    narrativeContext: 'Your sales team starts losing 3 out of 5 deals on price alone. You face a brutal dilemma: slash prices and destroy gross margins, or hold pricing and bleed market share.',
    realWorldExample: 'Uber vs Lyft price battles of 2016-2018, or cloud hosting price drops forcing margin compression on managed providers.'
  },
  {
    id: 'scenario-cost-spike',
    title: 'The 45% Supply & API Cost Surge',
    category: 'Cost Surge',
    badge: 'Margin Collapse',
    description: 'Upstream vendor rates, cloud compute inference tokens, or raw materials experience an unexpected price hike.',
    iconName: 'Zap',
    severity: 'high',
    demandShockPercent: 0,
    cogsInflationPercent: 50,
    cacInflationPercent: 15,
    churnSpikePercent: 0,
    competitorPricePressurePercent: 0,
    paymentDelayDaysDelta: 0,
    fixedCostSurgePercent: 20,
    narrativeContext: 'Direct unit margins evaporate. Every sale now generates only a fraction of the gross profit needed to cover overheads, silently turning a profitable machine into a cash bonfire.',
    realWorldExample: '2022 freight and chip shortages, or unexpected AI model API pricing hikes shifting per-query unit economics into the red.'
  },
  {
    id: 'scenario-cac-death-spiral',
    title: 'Paid Channel Burnout & CAC Spike',
    category: 'Operational Crisis',
    badge: 'Marketing Breakdown',
    description: 'Ad algorithms shift, CPMs double, and your primary customer acquisition channel loses tracking fidelity.',
    iconName: 'Target',
    severity: 'high',
    demandShockPercent: -15,
    cogsInflationPercent: 0,
    cacInflationPercent: 130, // CAC more than doubles
    churnSpikePercent: 2,
    competitorPricePressurePercent: 0,
    paymentDelayDaysDelta: 0,
    fixedCostSurgePercent: 5,
    narrativeContext: 'Customer Acquisition Cost rockets from sustainable levels to $800+, vastly exceeding the 12-month Customer Lifetime Value (LTV). Continuing to spend marketing money burns cash faster than it earns.',
    realWorldExample: 'Apple iOS 14.5 App Tracking Transparency (ATT) update, which wiped out 40-70% of D2C e-commerce ad attribution and spiked customer acquisition costs overnight.'
  },
  {
    id: 'scenario-liquidity-trap',
    title: 'The Net-90 Liquidity Trap',
    category: 'Black Swan',
    badge: 'Cashflow Gap',
    description: 'Clients and B2B partners unilaterally extend payment terms to 75-90 days while your payroll and suppliers demand instant settlement.',
    iconName: 'ClockAlert',
    severity: 'catastrophic',
    demandShockPercent: -5,
    cogsInflationPercent: 10,
    cacInflationPercent: 10,
    churnSpikePercent: 3,
    competitorPricePressurePercent: 0,
    paymentDelayDaysDelta: 50, // Receivables delayed by 50 additional days!
    fixedCostSurgePercent: 0,
    narrativeContext: 'The accounting books show you made a profit on paper, but your bank account is empty. Payroll is due next Friday, but customer invoices won’t arrive for two more months.',
    realWorldExample: 'Classic fast-growing consulting agency or wholesale supplier insolvency: growing 50% year-over-year while dying of working capital dehydration.'
  },
  {
    id: 'scenario-stagflation-hell',
    title: 'The Stagflation Nightmare',
    category: 'Market Shock',
    badge: 'Triple Shock',
    description: 'A worst-case macro convergence: customer demand contracts by 30% while suppliers and landlords increase rates by 35%.',
    iconName: 'Flame',
    severity: 'catastrophic',
    demandShockPercent: -35,
    cogsInflationPercent: 40,
    cacInflationPercent: 65,
    churnSpikePercent: 8,
    competitorPricePressurePercent: -15,
    paymentDelayDaysDelta: 25,
    fixedCostSurgePercent: 25,
    narrativeContext: 'The lethal combination of top-line revenue erosion and bottom-line cost inflation. The break-even customer volume doubles precisely when customer acquisition is hardest.',
    realWorldExample: 'Post-pandemic retail stagflation: foot traffic down 25%, wages up 20%, utilities up 40%.'
  }
];
