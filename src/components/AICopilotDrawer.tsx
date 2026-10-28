import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ArrowRight, 
  Check, 
  MessageSquare,
  Flame,
  HelpCircle
} from 'lucide-react';
import { BusinessTwin, CrashScenario, DecisionLevers, FailureDiagnostic, RecoveryPlan } from '../types';
import { ChatMessage, generateAICopilotResponse } from '../engine/aiCopilot';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  twin: BusinessTwin;
  scenario: CrashScenario | null;
  levers: DecisionLevers;
  diagnostic: FailureDiagnostic;
  recoveryPlan: RecoveryPlan;
  onApplyLevers: (levers: Partial<DecisionLevers>) => void;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  twin,
  scenario,
  levers,
  diagnostic,
  recoveryPlan,
  onApplyLevers,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `### 🤖 Welcome to CrashTest Copilot!
I am your AI business stress-testing advisor. I have analyzed **${twin.name}** against **${scenario ? scenario.title : 'Baseline Market Conditions'}**.

- **Current Failure Risk Score:** **${diagnostic.overallRiskScore}/100 (${diagnostic.riskGrade})**
- **Vulnerability Status:** ${diagnostic.isCrashed ? `🔴 Insolvent in Month ${diagnostic.crashMonth}` : '🟢 Solvent cash reserves'}
- **Identified Failure Mode:** ${diagnostic.primaryFailureMode}

Ask me anything about your unit economics, risk exposure, pricing elasticity, or recovery strategies below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: 'Crash Intelligence'
    }
  ]);

  const [input, setInput] = useState('');
  const [appliedActionId, setAppliedActionId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput('');

    // Generate AI response
    setTimeout(() => {
      const aiReply = generateAICopilotResponse(text, twin, scenario, levers, diagnostic, recoveryPlan);
      setMessages([...newMessages, aiReply]);
    }, 200);
  };

  const handleApplyAction = (actionId: string, suggestedLevers: Partial<DecisionLevers>) => {
    onApplyLevers(suggestedLevers);
    setAppliedActionId(actionId);
    setTimeout(() => setAppliedActionId(null), 2500);
  };

  const promptPills = [
    "Why does cash collapse?",
    "Simulate +15% price increase",
    "How to solve receivables cash gap?",
    "Should I double marketing budget?",
    "What is my break-even customer count?"
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slideLeft">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30">
            <Bot className="w-5 h-5" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>CrashTest AI Copilot</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Live
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Stress-Testing Advisor & Recovery Generator
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-rose-600 text-white rounded-br-xs'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-xs shadow-md'
              }`}
            >
              {msg.badge && (
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-400 mb-1.5 tracking-wider">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>{msg.badge}</span>
                </div>
              )}

              {/* Render simple markdown lines */}
              <div className="space-y-1.5 whitespace-pre-line">
                {msg.text.split('\n').map((line, i) => {
                  if (line.startsWith('### ')) {
                    return <h4 key={i} className="text-sm font-bold text-white mt-1 mb-1">{line.replace('### ', '')}</h4>;
                  }
                  if (line.startsWith('- ')) {
                    return <p key={i} className="pl-2 border-l border-indigo-500/50 text-slate-300">{line.replace('- ', '• ')}</p>;
                  }
                  return <p key={i}>{line}</p>;
                })}
              </div>

              {/* Suggested One-Click Action button */}
              {msg.suggestedAction && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <button
                    onClick={() => handleApplyAction(msg.id, msg.suggestedAction!.levers)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-[11px] font-semibold transition-all w-full justify-center"
                  >
                    {appliedActionId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Action Lever Applied!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{msg.suggestedAction.label}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <span className="text-[10px] text-slate-500 mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/60 overflow-x-auto whitespace-nowrap flex gap-1.5">
        {promptPills.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask Copilot about ${twin.name}...`}
            className="flex-1 bg-slate-950 text-slate-200 placeholder-slate-500 text-xs rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
