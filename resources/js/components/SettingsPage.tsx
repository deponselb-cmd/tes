import React, { useState } from 'react';
import { Sliders, Bell, Globe, Lock, Cpu, Database, Save, CheckCircle2, History, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General Service');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const sections = [
    { title: 'General Service', icon: Globe, desc: 'Name, domain, support email' },
    { title: 'Cloud Infrastructure', icon: Cpu, desc: 'API keys, Server region, Scaling' },
    { title: 'Data & Backup', icon: Database, desc: 'Export datasets, Auto-backup frequency' },
    { title: 'Notifications', icon: Bell, desc: 'WhatsApp bot, Email triggers, SMS gateway' },
    { title: 'Security', icon: Lock, desc: 'Two-factor auth, Session timeout, IP Whitelist' },
    { title: 'Custom Flows', icon: Sliders, desc: 'Onboarding steps, Prorate logic' },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-brand-text uppercase tracking-tighter">System Settings</h2>
          <p className="text-[10px] text-brand-text-muted font-black uppercase tracking-widest opacity-60">Global configuration and platform behavior</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand-primary text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
        >
          {isSaving ? <Save className="animate-spin" size={14} /> : <Save size={14} />}
          {isSaving ? 'Applying...' : 'Save Settings'}
        </button>
      </div>

      <AnimatePresence>
        {showSaved && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl flex items-center gap-3"
          >
            <CheckCircle2 size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Configuration updated successfully</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          {sections.map((s, i) => (
            <button 
              key={i} 
              onClick={() => setActiveTab(s.title)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                activeTab === s.title 
                ? 'bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/20' 
                : 'bg-brand-surface border-brand-border text-brand-text-muted hover:border-brand-primary/30'
              }`}
            >
              <s.icon size={18} className={activeTab === s.title ? 'text-white' : 'text-brand-primary'} />
              <div className="min-w-0">
                <h4 className="text-[10px] font-black uppercase tracking-tight truncate">{s.title}</h4>
              </div>
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border border-brand-border/30">
            <h3 className="text-sm font-black uppercase tracking-tighter text-brand-text mb-8">{activeTab} Configuration</h3>
            
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1 opacity-60">Setting Parameter #{i}</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl px-6 py-4 text-sm text-brand-text outline-none focus:border-brand-primary transition-all pr-12"
                      placeholder="Enter value..."
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border border-brand-border/30 bg-[#0d1117] relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-text flex items-center gap-2">
                <History size={14} className="text-brand-primary" />
                Audit Logs
              </h3>
              <span className="text-[9px] font-mono text-emerald-500/50">Real-time Stream</span>
            </div>
            
            <div className="space-y-3 font-mono text-[10px] h-48 overflow-y-auto custom-scrollbar opacity-70">
              {[
                { time: '02:14:12', msg: 'System config updated by Admin', level: 'info' },
                { time: '02:12:05', msg: 'Backup completed successfully (42MB)', level: 'success' },
                { time: '02:08:55', msg: 'Failed login attempt from 192.168.1.45', level: 'warn' },
                { time: '01:55:22', msg: 'Core service reboot initiated', level: 'info' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 group">
                  <span className="text-brand-text-muted shrink-0">{log.time}</span>
                  <span className={log.level === 'warn' ? 'text-amber-500' : log.level === 'success' ? 'text-emerald-500' : 'text-brand-primary'}>
                    [{log.level.toUpperCase()}]
                  </span>
                  <span className="text-brand-text truncate">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-[3rem] border border-brand-border/30 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-brand-primary opacity-20" />
        <h3 className="text-xs font-black uppercase tracking-widest text-brand-text-muted mb-8 text-center opacity-70">System Health Monitor</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'API Latency', value: '42ms', color: 'emerald-500' },
            { label: 'DB Connections', value: '12 Active', color: 'brand-primary' },
            { label: 'Gateway Sync', value: 'Synced', color: 'cyan-500' },
            { label: 'Core Version', value: 'v2.4.1', color: 'brand-text-muted' },
          ].map((stat, i) => (
            <div key={i} className="text-center relative group">
              {i < 3 && <div className="hidden md:block absolute top-1/2 right-0 w-px h-8 bg-brand-border/50 -translate-y-1/2" />}
              <p className="text-[9px] text-brand-text-muted font-black uppercase mb-2 tracking-widest leading-none group-hover:text-brand-primary transition-colors">{stat.label}</p>
              <p className={`text-sm font-black text-brand-text uppercase tracking-tighter truncate transition-all group-hover:scale-110`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
