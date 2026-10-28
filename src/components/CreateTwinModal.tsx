import React, { useState } from 'react';
import { X, Building2, Save } from 'lucide-react';
import { BusinessTwin, BusinessModelType } from '../types';

interface CreateTwinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (twin: BusinessTwin) => void;
}

export const CreateTwinModal: React.FC<CreateTwinModalProps> = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<Omit<BusinessTwin, 'id' | 'createdDate'>>({
    name: '',
    industry: '',
    description: '',
    modelType: 'saas',
    currency: '$',
    startingCash: 50000,
    monthlyRevenue: 20000,
    customerCount: 100,
    averageOrderValue: 200,
    cogsPercent: 25,
    fixedOverheadMonthly: 15000,
    monthlyMarketingBudget: 5000,
    cac: 200,
    monthlyChurnRate: 0.05,
    organicGrowthRate: 0.03,
    paymentTermsDays: 30,
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!form.name.trim()) return;
    const newTwin: BusinessTwin = {
      ...form,
      id: `twin-custom-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    onSave(newTwin);
    onClose();
  };

  const field = (
    label: string,
    key: keyof typeof form,
    type: string = 'text',
    step?: string
  ) => (
    <div>
      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</label>
      <input
        type={type}
        step={step}
        value={form[key] as string | number}
        onChange={(e) =>
          setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })
        }
        className="w-full bg-slate-950 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Custom Digital Twin</h3>
              <p className="text-xs text-slate-400">Configure your business model to simulate.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('Business Name', 'name')}
          {field('Industry / Vertical', 'industry')}

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full bg-slate-950 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Business Model Type</label>
            <select
              value={form.modelType}
              onChange={(e) => setForm({ ...form, modelType: e.target.value as BusinessModelType })}
              className="w-full bg-slate-950 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            >
              <option value="saas">SaaS / Subscription</option>
              <option value="ecommerce">E-Commerce / D2C</option>
              <option value="agency">Agency / Services</option>
              <option value="brick_mortar">Retail / Brick & Mortar</option>
              <option value="marketplace">Marketplace / Platform</option>
            </select>
          </div>

          {field('Starting Cash ($)', 'startingCash', 'number', '1000')}
          {field('Monthly Revenue / MRR ($)', 'monthlyRevenue', 'number', '500')}
          {field('Customer Count', 'customerCount', 'number', '1')}
          {field('Average Order Value / ARPU ($)', 'averageOrderValue', 'number', '1')}
          {field('COGS % of Revenue (e.g. 25 for 25%)', 'cogsPercent', 'number', '1')}
          {field('Fixed Overhead / Month ($)', 'fixedOverheadMonthly', 'number', '500')}
          {field('Monthly Marketing Budget ($)', 'monthlyMarketingBudget', 'number', '100')}
          {field('Customer Acquisition Cost – CAC ($)', 'cac', 'number', '1')}
          {field('Monthly Churn Rate (e.g. 0.05 for 5%)', 'monthlyChurnRate', 'number', '0.01')}
          {field('Organic Growth Rate (e.g. 0.03 for 3%)', 'organicGrowthRate', 'number', '0.01')}
          {field('Payment Terms (days)', 'paymentTermsDays', 'number', '1')}
          {field('Incubator / Cohort (optional)', 'incubatorCohort')}
        </div>

        <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Digital Twin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
