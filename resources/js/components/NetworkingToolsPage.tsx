import React, { useState, useEffect } from 'react';
import { Terminal, Activity, Zap, Cpu, Search, AlertCircle, RefreshCw, BarChart3, Wifi, Globe, Shield, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MOCK_BANDWIDTH_DATA = Array.from({ length: 20 }).map((_, i) => ({
  time: i,
  down: Math.random() * 80 + 20,
  up: Math.random() * 20 + 5
}));

export default function NetworkingToolsPage() {
  const [activeTool, setActiveTool] = useState('ping');
  const [target, setTarget] = useState('8.8.8.8');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [bandwidthData, setBandwidthData] = useState(MOCK_BANDWIDTH_DATA);

  useEffect(() => {
    if (activeTool === 'bandwidth') {
      const interval = setInterval(() => {
        setBandwidthData(prev => [
          ...prev.slice(1),
          { time: prev[prev.length - 1].time + 1, down: Math.random() * 80 + 20, up: Math.random() * 20 + 5 }
        ]);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTool]);

  const runTool = () => {
    setIsRunning(true);
    setOutput([`Starting ${activeTool.toUpperCase()} to ${target}...`]);
    
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (activeTool === 'ping') {
        setOutput(prev => [...prev, `64 bytes from ${target}: icmp_seq=${count} ttl=117 time=${(Math.random() * 30 + 10).toFixed(2)}ms`]);
      } else if (activeTool === 'traceroute') {
        setOutput(prev => [...prev, `${count}  10.${Math.floor(Math.random()*255)}.0.1  ${(Math.random()*5).toFixed(3)} ms  ${(Math.random()*5).toFixed(3)} ms`]);
      } else if (activeTool === 'dns-lookup') {
        setOutput(prev => [...prev, `; <<>> DiG 9.10.6 <<>> ${target}`, `;; ANSWER SECTION:`, `${target}.   3600    IN  A   ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.1.1`]);
        count = 10; // finish early
      }
      
      if (count >= 5) {
        clearInterval(interval);
        setIsRunning(false);
        setOutput(prev => [...prev, `--- ${target} ${activeTool.toUpperCase()} statistics ---`, `Packets: Sent = 5, Received = 5, Lost = 0 (0% loss)`]);
      }
    }, 600);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <ToolButton id="ping" icon={Activity} label="Ping Test" active={activeTool} onClick={setActiveTool} />
          <ToolButton id="traceroute" icon={Zap} label="Trace Route" active={activeTool} onClick={setActiveTool} />
          <ToolButton id="dns-lookup" icon={Globe} label="DNS Lookup" active={activeTool} onClick={setActiveTool} />
          <ToolButton id="bandwidth" icon={BarChart3} label="Bandwidth" active={activeTool} onClick={setActiveTool} />
          <ToolButton id="port-scan" icon={Shield} label="Port Scanner" active={activeTool} onClick={setActiveTool} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-8 rounded-[2rem] shadow-sm border border-brand-border/30 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-4 items-end mb-8">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black uppercase text-brand-text-muted tracking-widest ml-1 opacity-60">Target Address</label>
                <div className="relative">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary" size={18} />
                  <input 
                    type="text" 
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="8.8.8.8"
                    className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl pl-12 pr-4 py-4 text-sm text-brand-text outline-none focus:border-brand-primary font-mono transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={runTool}
                disabled={isRunning}
                className="bg-brand-primary hover:scale-[1.02] active:scale-95 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-xl shadow-brand-primary/20 flex items-center gap-2 h-[52px]"
              >
                {isRunning ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                Execute {activeTool}
              </button>
            </div>

            {activeTool === 'bandwidth' ? (
              <div className="h-64 w-full bg-black/20 rounded-[2rem] p-4 border border-brand-border/10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bandwidthData}>
                    <defs>
                      <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                    <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px', fontFamily: 'monospace' }} />
                    <Area type="monotone" dataKey="down" stroke="#6366f1" fillOpacity={1} fill="url(#colorDown)" strokeWidth={3} />
                    <Area type="monotone" dataKey="up" stroke="#10b981" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-[#0d1117] rounded-[2rem] p-8 font-mono text-[11px] text-brand-primary h-80 overflow-y-auto border border-brand-border/20 shadow-2xl custom-scrollbar relative">
                <div className="absolute top-4 right-4 text-[9px] opacity-30 font-black uppercase tracking-tighter">Terminal Output</div>
                {output.length === 0 ? (
                  <div className="opacity-30 italic flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-brand-primary animate-pulse" />
                    Waiting for input...
                  </div>
                ) : output.map((line, i) => (
                  <p key={i} className="mb-1.5 leading-relaxed tracking-tight group">
                    <span className="text-emerald-500/50 mr-2">➜</span>
                    {line}
                  </p>
                ))}
                {isRunning && <div className="mt-2 text-emerald-500 animate-pulse font-black uppercase tracking-tighter">[Running...]</div>}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard icon={Activity} label="Packet Stability" value="99.9%" color="emerald-500" />
            <StatCard icon={Zap} label="Average Latency" value="18.5ms" color="brand-primary" />
            <StatCard icon={Wifi} label="Network Capacity" value="10 Gbps" color="cyan-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolButton({ id, icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full text-left px-6 py-4 rounded-2xl border transition-all flex items-center gap-4 group active:scale-[0.98] ${
        active === id 
        ? 'bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20' 
        : 'bg-brand-surface border-brand-border text-brand-text-muted hover:border-brand-primary/50'
      }`}
    >
      <div className={`p-2 rounded-xl transition-colors ${active === id ? 'bg-white/20' : 'bg-brand-bg group-hover:bg-brand-primary/10 group-hover:text-brand-primary'}`}>
        <Icon size={18} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="glass-card p-6 rounded-[2rem] border border-brand-border/30 hover:border-brand-primary/30 transition-all group">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 bg-brand-bg rounded-xl group-hover:bg-brand-primary/10 transition-all`}>
          <Icon size={16} className={`text-${color}`} />
        </div>
        <p className="text-[9px] font-black uppercase text-brand-text-muted tracking-widest opacity-60">{label}</p>
      </div>
      <p className="text-2xl font-black text-brand-text tracking-tighter uppercase">{value}</p>
    </div>
  );
}
