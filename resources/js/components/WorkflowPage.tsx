import React, { useState } from 'react';
import { GitBranch, Play, Settings2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function WorkflowPage() {
  const [workflows] = useState([
    { id: '1', name: 'Auto-Isolate Non-Payment', trigger: 'Invoice Overdue 3 Days', actions: 2, status: 'Active' },
    { id: '2', name: 'Welcome Email for New Customers', trigger: 'PPPoE Creation', actions: 1, status: 'Active' },
    { id: '3', name: 'Low Bandwidth Optimization', trigger: 'Usage > 90%', actions: 3, status: 'Paused' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-text">Automation Workflows</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:scale-[1.02] active:scale-95 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-primary/20">
          <GitBranch size={14} /> Design Workflow
        </button>
      </div>

      <div className="space-y-4">
        {workflows.map(wf => (
          <div key={wf.id} className="glass-card glass-card-hover p-6 rounded-2xl flex items-center justify-between group shadow-sm border border-brand-border/10 hover:border-brand-primary/30">
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 shadow-inner transition-all group-hover:scale-110 ${
                wf.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-brand-surface border-brand-border/40 text-brand-text-muted'
              }`}>
                <Play size={20} fill={wf.status === 'Active' ? 'currentColor' : 'none'} className={wf.status === 'Active' ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]' : ''} />
              </div>
              <div>
                <h4 className="font-black italic uppercase tracking-tighter text-brand-text mb-1 group-hover:text-brand-primary transition-colors">{wf.name}</h4>
                <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-widest text-brand-text-muted">
                  <span className="flex items-center gap-1.5"><Clock size={10} className="text-brand-primary" /> Trigger: {wf.trigger}</span>
                  <span className="flex items-center gap-1.5"><GitBranch size={10} className="text-brand-primary" /> {wf.actions} Actions</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm ${
                wf.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]' : 'bg-brand-surface text-brand-text-muted border-brand-border'
              }`}>
                {wf.status}
              </span>
              <button className="p-2 hover:bg-brand-surface border border-transparent hover:border-brand-border rounded-xl text-brand-text-muted hover:text-brand-primary transition-all">
                <Settings2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl border-dashed">
        <h4 className="text-sm font-black uppercase tracking-tight text-brand-primary mb-2 flex items-center gap-2">
          <AlertCircle size={16} /> Workflow Logic
        </h4>
        <p className="text-xs text-brand-text-muted leading-relaxed font-bold">
          Automate repetitive tasks like billing reminders, network isolation, or customer onboarding. 
          Use <span className="text-brand-primary">conditional branching</span> to create complex logic based on real-time network and payment data.
        </p>
      </div>
    </div>
  );
}
