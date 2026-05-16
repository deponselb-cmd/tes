import React, { useState } from 'react';
import { 
  Ticket, Printer, Download, Plus, Trash2, Code, Upload, FileJson, 
  Layers, Eye, CheckCircle2, XCircle, Clock, Grid, List as ListIcon 
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { useTranslation } from '../locales/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface Voucher {
  id: string; code: string; plan: string; validity: string; price: number; status: 'unused' | 'active' | 'expired';
}

const DEFAULT_TEMP = `<div style="border:1px dashed #6366f1;padding:10px;width:150px;font-family:sans-serif;border-radius:8px;background:white;color:#1e293b;text-align:center">
<div style="font-weight:800;font-size:10px;text-transform:uppercase;color:#6366f1">{{plan}}</div>
<div style="font-size:16px;font-weight:900;letter-spacing:1px;margin:5px 0">{{code}}</div>
<div style="font-size:9px;font-weight:700;color:#64748b;margin-bottom:5px">{{validity}}</div>
<div style="font-size:11px;font-weight:900;color:#fb7185">{{price}}</div></div>`;

export default function VoucherMakerPage() {
  const { t } = useTranslation();
  const [vouchers, setVouchers] = useState<Voucher[]>([
    { id: '1', code: 'WF-821', plan: '10 Mbps', validity: '24H', price: 5000, status: 'unused' },
    { id: '2', code: 'WF-712', plan: '20 Mbps', validity: '7D', price: 25000, status: 'active' },
  ]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showBatch, setShowBatch] = useState(false);
  const [showTemp, setShowTemp] = useState(false);
  const [temp, setTemp] = useState(DEFAULT_TEMP);
  const [printing, setPrinting] = useState(false);
  const [batch, setBatch] = useState({ amount: 10, plan: 'Speedy 10', validity: '24H', price: 5000, prefix: 'V-' });

  const genBatch = () => {
    const news = Array.from({ length: batch.amount }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      code: `${batch.prefix}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      plan: batch.plan, validity: batch.validity, price: batch.price, status: 'unused' as const
    }));
    setVouchers([...news, ...vouchers]);
    setShowBatch(false);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(vouchers)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'vouchers.json'; a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setVouchers([...JSON.parse(ev.target?.result as string), ...vouchers]); };
    reader.readAsText(file);
  };

  const renderVoucher = (v: Voucher) => {
    const html = temp.replace('{{plan}}', v.plan).replace('{{code}}', v.code).replace('{{validity}}', v.validity).replace('{{price}}', formatCurrency(v.price));
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  if (printing) return (
    <div className="p-4 bg-white min-h-screen text-black">
      <div className="flex justify-between mb-8 print:hidden">
        <h2 className="font-black uppercase">Print Preview</h2>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="bg-brand-primary text-white px-4 py-2 rounded-lg text-xs font-black uppercase">Print Now</button>
          <button onClick={() => setPrinting(false)} className="bg-slate-200 px-4 py-2 rounded-lg text-xs font-black uppercase">Back</button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">{vouchers.map(v => <div key={v.id} className="border p-1 bg-white">{renderVoucher(v)}</div>)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div><h2 className="text-2xl font-black text-brand-text uppercase italic tracking-tighter">Voucher System</h2><p className="text-[10px] font-black text-brand-text-muted opacity-60">Inspired by Mikhmon Control Panel</p></div>
        <div className="flex flex-wrap gap-2">
          <div className="flex p-1 bg-brand-surface border border-brand-border rounded-xl">
            <button onClick={() => setView('grid')} className={cn("p-2 rounded-lg", view === 'grid' ? "bg-brand-primary text-white" : "text-brand-text-muted")}><Grid size={16} /></button>
            <button onClick={() => setView('list')} className={cn("p-2 rounded-lg", view === 'list' ? "bg-brand-primary text-white" : "text-brand-text-muted")}><ListIcon size={16} /></button>
          </div>
          <button onClick={() => setShowTemp(true)} className="p-3 bg-brand-surface border border-brand-border text-brand-text-muted rounded-xl hover:text-brand-primary"><Code size={18} /></button>
          <label className="p-3 bg-brand-surface border border-brand-border text-brand-text-muted rounded-xl cursor-pointer"><Upload size={18} /><input type="file" className="hidden" onChange={importData} /></label>
          <button onClick={exportData} className="p-3 bg-brand-surface border border-brand-border text-brand-text-muted rounded-xl"><FileJson size={18} /></button>
          <button onClick={() => setPrinting(true)} className="p-3 bg-brand-surface border border-brand-border text-brand-text-muted rounded-xl"><Printer size={18} /></button>
          <button onClick={() => setShowBatch(true)} data-cursor-text="Create Mass Vouchers" className="px-6 py-3 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20"><Layers size={16} className="inline mr-2" /> {t('generateBatch')}</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Unused', v: vouchers.filter(x => x.status === 'unused').length, c: 'emerald' },
          { label: 'Active', v: vouchers.filter(x => x.status === 'active').length, c: 'brand-primary' },
          { label: 'Expired', v: vouchers.filter(x => x.status === 'expired').length, c: 'red' },
          { label: 'Total', v: vouchers.length, c: 'cyan' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 rounded-2xl border border-brand-border flex items-center gap-3">
            <div className={cn("w-1 h-8 rounded-full", s.c === 'brand-primary' ? 'bg-indigo-500' : `bg-${s.c}-500`)} />
            <div><p className="text-[9px] uppercase font-black text-brand-text-muted opacity-50">{s.label}</p><p className="text-xl font-black">{s.v}</p></div>
          </div>
        ))}
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vouchers.map(v => (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={v.id} className="glass-card p-5 rounded-3xl border border-brand-border/10 relative group">
              <button onClick={() => setVouchers(vouchers.filter(x => x.id !== v.id))} className="absolute top-2 right-2 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
              <div className="flex flex-col items-center py-4">
                <Ticket className="text-brand-primary mb-4" size={32} />
                <h3 className="text-2xl font-black tracking-tighter mb-1 uppercase">{v.code}</h3>
                <p className="text-[10px] font-black uppercase text-brand-text-muted">{v.plan} • {v.validity}</p>
                <div className="mt-4 px-4 py-1 bg-brand-primary/5 rounded-full border border-brand-primary/10 text-brand-primary font-black text-xs">{formatCurrency(v.price)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden border border-brand-border/10 overflow-x-auto">
          <table className="w-full text-left text-[10px] font-black uppercase tracking-widest">
            <thead><tr className="bg-brand-surface/50 text-brand-text-muted border-b border-brand-border"><th className="p-4">Code</th><th className="p-4">Plan</th><th className="p-4">Validity</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4"></th></tr></thead>
            <tbody>{vouchers.map(v => (
              <tr key={v.id} className="border-b border-brand-border/5 hover:bg-brand-surface/20">
                <td className="p-4"><div className="flex gap-2 items-center"><Ticket size={14} className="text-brand-primary" />{v.code}</div></td>
                <td className="p-4 text-brand-text-muted">{v.plan}</td><td className="p-4 text-brand-primary">{v.validity}</td><td className="p-4">{formatCurrency(v.price)}</td><td className="p-4"><span className={cn("px-2 py-0.5 rounded-full border", v.status === 'unused' ? "text-emerald-500 border-emerald-500/20" : "text-brand-primary border-brand-primary/20")}>{v.status}</span></td>
                <td className="p-4 text-right"><button onClick={() => setVouchers(vouchers.filter(x => x.id !== v.id))} className="text-red-500 p-2"><Trash2 size={14} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showBatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBatch(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div className="relative w-full max-w-lg glass-card p-8 rounded-[2.5rem] border border-brand-primary/20 shadow-2xl">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">Batch Generator</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" value={batch.amount} onChange={e => setBatch({...batch, amount: parseInt(e.target.value)})} className="w-full bg-brand-surface border border-brand-border rounded-2xl p-4 text-xs" placeholder="Amount" />
                  <input type="text" value={batch.prefix} onChange={e => setBatch({...batch, prefix: e.target.value})} className="w-full bg-brand-surface border border-brand-border rounded-2xl p-4 text-xs" placeholder="Prefix" />
                </div>
                <select value={batch.plan} onChange={e => setBatch({...batch, plan: e.target.value})} className="w-full bg-brand-surface border border-brand-border rounded-2xl p-4 text-xs appearance-none">
                  {['Speedy 10', 'Speedy 20', 'Ultimate'].map(x => <option key={x}>{x}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" value={batch.price} onChange={e => setBatch({...batch, price: parseInt(e.target.value)})} className="w-full bg-brand-surface border border-brand-border rounded-2xl p-4 text-xs" />
                  <input type="text" value={batch.validity} onChange={e => setBatch({...batch, validity: e.target.value})} className="w-full bg-brand-surface border border-brand-border rounded-2xl p-4 text-xs" />
                </div>
                <button onClick={genBatch} className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase text-xs shadow-xl">Generate Now</button>
              </div>
            </motion.div>
          </div>
        )}

        {showTemp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTemp(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div className="relative w-full max-w-4xl glass-card flex flex-col rounded-[2.5rem] overflow-hidden border border-brand-primary/20 h-[80vh]">
              <div className="p-8 border-b border-brand-border flex justify-between items-center">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Template Designer</h3>
                <button onClick={() => setTemp(DEFAULT_TEMP)} className="text-[10px] font-black uppercase text-brand-primary">Reset</button>
              </div>
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
                <textarea value={temp} onChange={e => setTemp(e.target.value)} className="p-6 font-mono text-xs bg-brand-bg/50 border-none outline-none resize-none" />
                <div className="p-8 bg-slate-100 flex flex-col items-center justify-center border-l">
                  <div className="bg-white p-10 shadow-2xl scale-125 mb-8">{vouchers[0] && renderVoucher(vouchers[0])}</div>
                  <div className="flex gap-2">{['{{plan}}', '{{code}}', '{{validity}}', '{{price}}'].map(v => <span key={v} className="px-2 py-1 bg-brand-primary/10 text-brand-primary font-mono text-[9px] rounded">{v}</span>)}</div>
                </div>
              </div>
              <div className="p-6 border-t border-brand-border"><button onClick={() => setShowTemp(false)} className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase text-xs">Save Template</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

