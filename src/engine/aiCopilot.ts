import { BusinessTwin, CrashScenario, DecisionLevers, FailureDiagnostic, RecoveryPlan } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  badge?: string;
  suggestedAction?: {
    label: string;
    levers: Partial<DecisionLevers>;
  };
}

export function generateAICopilotResponse(
  userQuery: string,
  twin: BusinessTwin,
  scenario: CrashScenario | null,
  levers: DecisionLevers,
  diagnostic: FailureDiagnostic,
  recoveryPlan: RecoveryPlan
): ChatMessage {
  const q = userQuery.toLowerCase();
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Inquiries about doubling marketing / CAC
  if (q.includes('marketing') || q.includes('ad spend') || q.includes('ads') || q.includes('cac')) {
    const isCacHigh = (scenario?.cacInflationPercent || 0) > 25 || levers.marketingBudgetDeltaPercent > 50;
    return {
      id: `copilot-${Date.now()}`,
      sender: 'assistant',
      text: `### 🎯 Marketing & CAC Diagnostic for ${twin.name}

At present, your base Customer Acquisition Cost is **$${twin.cac}** on a monthly marketing budget of **$${twin.monthlyMarketingBudget.toLocaleString()}**.

${isCacHigh 
  ? `⚠️ **Warning:** You are currently in an ad-inflation or high-spend environment. Increasing ad spend here causes an *Ad Saturation Effect*—each additional customer will cost **30-60% more**, speeding up cash depletion without delivering profitable unit margins.` 
  : `💡 **Efficiency Analysis:** In normal market conditions, your blended LTV to CAC ratio is **${((twin.averageOrderValue * (1 - twin.cogsPercent / 100) / twin.monthlyChurnRate) / twin.cac).toFixed(1)}x**. While healthy (>3.0x is ideal), during adverse market shocks, top-of-funnel conversion drops.`
}

**Strategic Recommendation:**
1. Avoid brute-force ad scaling right now.
2. Shift 35% of paid ad budget to customer referral loops and product onboarding retargeting.
3. Test a targeted **10% price revision** with customer lock-in before increasing ad spend.`,
      timestamp: timeStr,
      badge: 'Marketing Intelligence',
      suggestedAction: {
        label: 'Apply Recommended Ad Spend (-25%)',
        levers: { marketingBudgetDeltaPercent: -25 }
      }
    };
  }

  // 2. Inquiries about pricing changes
  if (q.includes('pricing') || q.includes('price') || q.includes('discount') || q.includes('raise')) {
    return {
      id: `copilot-${Date.now()}`,
      sender: 'assistant',
      text: `### 🏷️ Pricing & Margin Sensitivity Analysis

Your current Average Order Value / ARPU is **$${twin.averageOrderValue}** with a direct COGS of **${twin.cogsPercent}%** ($${(twin.averageOrderValue * twin.cogsPercent / 100).toFixed(2)}/unit).

${scenario?.competitorPricePressurePercent 
  ? `⚔️ **Competitor Threat:** Competitors are applying **${Math.abs(scenario.competitorPricePressurePercent)}%** price pressure. **Never enter a race to the bottom!** Slashing prices destroys your gross contribution margin faster than you can gain volume.` 
  : `📈 **Price Elasticity:** For ${twin.industry}, customer price elasticity is estimated at **-0.75**. A **+15% price adjustment** typically causes only a ~5% churn uptick, resulting in a net **+$${Math.round(twin.monthlyRevenue * 0.11).toLocaleString()}/month** in pure gross profit!`
}

**Recommended Countermeasure:**
- Segment your offering into a *Base* tier and a *Pro / Concierge* tier.
- Offer existing customers a 12-month price-lock guarantee if they commit to an annual plan.`,
      timestamp: timeStr,
      badge: 'Pricing Strategy',
      suggestedAction: {
        label: 'Test +12% Price Increase',
        levers: { priceDeltaPercent: 12 }
      }
    };
  }

  // 3. Inquiries about cashflow, runway, or payment terms
  if (q.includes('cash') || q.includes('runway') || q.includes('receivable') || q.includes('bank') || q.includes('insolvent')) {
    return {
      id: `copilot-${Date.now()}`,
      sender: 'assistant',
      text: `### 💧 Liquidity & Cashflow Survival Analysis

- **Starting Bank Balance:** $${twin.startingCash.toLocaleString()}
- **Crash Test Insolvency Status:** ${diagnostic.isCrashed ? `🔴 Breaches zero at ${diagnostic.cashDepletionDate}` : `🟢 Resilient (Lowest cash: $${diagnostic.minimumCashBalance.toLocaleString()})`}
- **Current Payment Terms Lag:** ${twin.paymentTermsDays} days ${scenario?.paymentDelayDaysDelta ? `(+${scenario.paymentDelayDaysDelta} days shock delay)` : ''}

${diagnostic.isCrashed 
  ? `🚨 **Autopsy Finding:** Your business suffers from **${diagnostic.primaryFailureMode}**. Even with positive accounting profit, cash burn and deferred customer collections create a fatal liquidity gap.`
  : `🛡️ **Runway Status:** Your cash reserve provides adequate buffer, but watch for unexpected vendor hikes.`
}

**Immediate Actions:**
1. Tighten invoice terms to **Net-15** or offer a 2% early-pay rebate.
2. Establish a **$30,000 receivables credit line** buffer.
3. Pause all discretionary hiring until Month 6.`,
      timestamp: timeStr,
      badge: 'Cashflow Doctor',
      suggestedAction: {
        label: 'Tighten Invoicing & Add Buffer',
        levers: { paymentTermsTighteningDays: 20, creditLineBuffer: 25000 }
      }
    };
  }

  // 4. Inquiries about recovery plan or avoiding failure
  if (q.includes('recover') || q.includes('fix') || q.includes('plan') || q.includes('save') || q.includes('advice')) {
    return {
      id: `copilot-${Date.now()}`,
      sender: 'assistant',
      text: `### 🛡️ AI Turnaround Blueprint: ${recoveryPlan.title}

${recoveryPlan.overview}

**Key Levers in the AI Playbook:**
${recoveryPlan.actions.map((act, i) => `${i + 1}. **${act.pillar}:** ${act.action} *(Impact: ${act.projectedCashImpact})*`).join('\n')}

**Projected Recovery Impact:**
- **Runway Restored:** ${recoveryPlan.restoredRunwayMonths} months
- **Capital Rescued:** +$${recoveryPlan.turnaroundCashDelta.toLocaleString()}
- **Full Solvency Achieved:** ${recoveryPlan.solvencyRestored ? '✅ Yes, business reaches self-sustaining stability' : '⚠️ Partial recovery, external bridge required'}`,
      timestamp: timeStr,
      badge: 'Turnaround Copilot',
      suggestedAction: {
        label: 'Deploy Complete AI Recovery Plan',
        levers: recoveryPlan.idealDecisionTuning
      }
    };
  }

  // Default deep context response
  return {
    id: `copilot-${Date.now()}`,
    sender: 'assistant',
    text: `### 🤖 CrashTest Copilot Insights for ${twin.name}

I've analyzed your twin against **${scenario ? scenario.title : 'Baseline Market Operating Conditions'}**:

- **Current Failure Risk Score:** **${diagnostic.overallRiskScore}/100 (${diagnostic.riskGrade})**
- **Primary Identified Vulnerability:** **${diagnostic.primaryFailureMode}**
- **Estimated Capital at Risk:** **$${diagnostic.totalCapitalDestroyed.toLocaleString()}**

**What would you like to explore next?**
- *"How will a 15% price increase impact my customer churn?"*
- *"What is my exact break-even customer count?"*
- *"How can I eliminate our working capital liquidity trap?"*
- *"Simulate an aggressive 30% cost-cutting defense strategy."*`,
    timestamp: timeStr,
    badge: 'Digital Twin AI',
    suggestedAction: {
      label: 'Optimize Fixed Overhead (-15%)',
      levers: { overheadCostCutPercent: -15 }
    }
  };
}
