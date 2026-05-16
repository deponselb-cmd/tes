import React, { useState, useEffect, useRef } from 'react';
import { Network, Server, HardDrive, RefreshCw, Zap, Cpu, Search, AlertTriangle, Terminal as TerminalIcon, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MikroTikPage() {
  const [activeTab, setActiveTab] = useState('interfaces');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['RouterOS v7.1.3 (stable)', 'Login: admin', 'Password: ', 'Connected to CCR1036-12G-4S', '']);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const [metrics, setMetrics] = useState({
    cpu: Math.floor(Math.random() * 20),
    throughput: (Math.random() * 5 + 5).toFixed(1)
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 25),
        throughput: (Math.random() * 5 + 5).toFixed(1)
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    
    setTerminalOutput(prev => [...prev, `[admin@CCR1036] > ${terminalInput}`]);
    
    // Simple command handling
    const cmd = terminalInput.toLowerCase().trim();
    setTimeout(() => {
      if (cmd === 'ping 8.8.8.8') {
        setTerminalOutput(prev => [...prev, '  SEQ  HOST                                     SIZE  TTL  TIME      STATUS', '    0  8.8.8.8                                    56   117  12ms     ', '    1  8.8.8.8                                    56   117  14ms     ']);
      } else if (cmd === 'interface print') {
        setTerminalOutput(prev => [...prev, 'Flags: D - dynamic, X - disabled, R - running, S - slave', ' #     NAME                                TYPE       ACTUAL-MTU L2MTU  MAX-L2MTU', ' 0  R  ether1                              ether            1500  1580       9114']);
      } else {
        setTerminalOutput(prev => [...prev, `unknown command: ${cmd}`]);
      }
      setTerminalInput('');
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center border border-brand-primary/20 shadow-inner">
            <Server className="text-brand-primary" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-brand-text tracking-tight">CCR1036-12G-4S</h2>
            <p className="text-[10px] text-brand-text-muted uppercase font-black tracking-widest">RouterOS v7.1.3 • Up 142 Days</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSync}
            className="flex items-center gap-2 bg-brand-surface border border-brand-border px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-brand-text-muted hover:text-brand-primary transition-all shadow-sm active:scale-95"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Fetch Metrics'}
          </button>
          <button 
            onClick={() => setIsTerminalOpen(true)}
            className="flex items-center gap-2 bg-[#1a1c24] hover:bg-[#252834] text-brand-primary border border-brand-primary/30 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-primary/10 active:scale-95"
          >
            <TerminalIcon size={14} /> Terminals
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'CPU Load', value: `${metrics.cpu}%`, icon: Cpu, color: 'brand-primary' },
          { label: 'Memory', value: '4.2GB / 16GB', icon: HardDrive, color: 'sky-500' },
          { label: 'Active PPPoE', value: '2,482', icon: Zap, color: 'amber-500' },
          { label: 'Throughput', value: `${metrics.throughput} Gbps`, icon: Network, color: 'emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-card glass-card-hover p-4 rounded-2xl shadow-sm border border-brand-border">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-1.5 bg-brand-primary/10 rounded-lg`}>
                <stat.icon size={14} className={`text-brand-primary`} />
              </div>
              <p className="text-[10px] font-black uppercase text-brand-text-muted tracking-widest font-mono">{stat.label}</p>
            </div>
            <p className="text-xl font-black text-brand-text uppercase tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden shadow-sm border border-brand-border">
        <div className="border-b border-brand-border flex bg-brand-surface/30 overflow-x-auto scrollbar-hide">
          {['interfaces', 'ppp-secrets', 'firewall', 'queues'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative shrink-0 ${
                activeTab === tab ? 'text-brand-primary' : 'text-brand-text-muted hover:text-brand-text'
              }`}
            >
              {tab.replace('-', ' ')}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-primary shadow-[0_-2px_8px_rgba(99,102,241,0.5)]" />}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[9px] uppercase tracking-widest text-brand-text-muted font-black border-b border-brand-border">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Throughput</th>
                  <th className="px-4 py-3 text-right">Packets/s</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="hover:bg-brand-primary/5 transition-colors group">
                    <td className="px-4 py-4 text-xs font-bold text-brand-text">sfp-sfpplus{i+1}</td>
                    <td className="px-4 py-4 text-[10px] text-brand-text-muted font-black uppercase tracking-widest">SFP Provider</td>
                    <td className="px-4 py-4 text-right text-xs font-mono font-black text-brand-primary">{(Math.random() * 200).toFixed(1)} Mbps</td>
                    <td className="px-4 py-4 text-right text-xs font-mono font-bold text-brand-text-muted">{(Math.random() * 50).toFixed(1)}k</td>
                    <td className="px-4 py-4 text-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isTerminalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTerminalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0d1117] border border-brand-border/50 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[500px]"
            >
              <div className="bg-[#161b22] px-6 py-3 flex items-center justify-between border-b border-brand-border/30">
                <div className="flex items-center gap-2">
                  <TerminalIcon size={14} className="text-brand-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">MikroTik RouterOS Console</span>
                </div>
                <button onClick={() => setIsTerminalOpen(false)} className="text-brand-text-muted hover:text-brand-text">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 p-6 font-mono text-xs text-brand-primary overflow-y-auto custom-scrollbar space-y-1">
                {terminalOutput.map((line, i) => (
                  <p key={i} className="leading-tight min-h-[1em]">{line}</p>
                ))}
                <div ref={terminalEndRef} />
              </div>

              <form onSubmit={handleCommand} className="p-4 bg-[#161b22] border-t border-brand-border/30 flex gap-4">
                <span className="text-emerald-500 font-mono text-xs shrink-0 self-center">[admin@CCR1036] &gt;</span>
                <input 
                  type="text" 
                  autoFocus
                  value={terminalInput}
                  onChange={e => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-brand-primary font-mono text-xs"
                />
                <button type="submit" className="text-brand-primary/50 hover:text-brand-primary transition-colors">
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
