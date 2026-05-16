import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, Landmark, ShieldCheck, ExternalLink, Settings, Plus, Loader2, X, Save, Trash2 } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

interface Gateway {
  id?: string;
  name: string;
  status: 'Active' | 'Draft' | 'Disabled';
  methodCount?: number;
  uptime?: string;
  logo: string;
  apiKey?: string;
  merchantId?: string;
  callbackUrl?: string;
}

export default function PaymentGatewayPage() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState<Gateway | null>(null);
  const [formData, setFormData] = useState<Omit<Gateway, 'id'>>({
    name: '',
    status: 'Draft',
    logo: '',
    apiKey: '',
    merchantId: '',
    callbackUrl: ''
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'gateways'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Gateway[];
      setGateways(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGateway) {
        await updateDoc(doc(db, 'gateways', editingGateway.id!), { ...formData });
      } else {
        await addDoc(collection(db, 'gateways'), {
          ...formData,
          createdAt: serverTimestamp(),
          methodCount: 0,
          uptime: 'N/A'
        });
      }
      setIsModalOpen(false);
      setEditingGateway(null);
    } catch (err) {
      console.error("Gateway operation failed:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Remove this payment provider?')) {
      await deleteDoc(doc(db, 'gateways', id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-text uppercase tracking-tighter">Payment Systems</h2>
          <p className="text-[10px] text-brand-text-muted font-black uppercase tracking-widest opacity-60">Integrate and manage local payment providers</p>
        </div>
        <button 
          onClick={() => {
            setEditingGateway(null);
            setFormData({ name: '', status: 'Draft', logo: '', apiKey: '', merchantId: '', callbackUrl: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:scale-[1.02] active:scale-95 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus size={14} /> Add Provider
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-brand-primary" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gateways.map(g => (
            <div key={g.id} className="glass-card glass-card-hover p-6 rounded-2xl relative group shadow-sm border border-brand-border/10">
              <div className="flex justify-between items-start mb-8">
                <div className="h-8 grayscale group-hover:grayscale-0 transition-all">
                  {g.logo ? (
                    <img src={g.logo} alt={g.name} className="h-full object-contain" />
                  ) : (
                    <div className="h-full px-4 border border-brand-border rounded flex items-center bg-brand-surface">
                      <span className="text-[10px] font-black uppercase tracking-tight text-brand-text">{g.name}</span>
                    </div>
                  )}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm ${
                  g.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]' : 'bg-brand-surface text-brand-text-muted border-brand-border'
                }`}>
                  {g.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest leading-none">
                  <span className="text-brand-text-muted">Active Methods</span>
                  <span className="text-brand-text">{g.methodCount || 0} Channels</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest leading-none border-t border-brand-border/50 pt-3">
                  <span className="text-brand-text-muted">Service Uptime</span>
                  <span className="text-emerald-500 shadow-sm">{g.uptime || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-8 flex gap-2">
                <button 
                  onClick={() => {
                    setEditingGateway(g);
                    setFormData({ ...g });
                    setIsModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-primary/5 border border-brand-primary/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm active:scale-95"
                >
                  <Settings size={14} /> Configure
                </button>
                <button 
                  onClick={() => handleDelete(g.id!)}
                  className="p-2.5 bg-brand-surface border border-brand-border rounded-xl text-brand-text-muted hover:text-red-500 transition-all active:scale-95"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-brand-bg border border-brand-border rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8 relative">
                <h3 className="text-xl font-black text-brand-text uppercase tracking-tighter">
                  {editingGateway ? 'Configure Provider' : 'Add Provider'}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Provider Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-3 text-sm text-brand-text font-black uppercase tracking-tight"
                      placeholder="e.g. Midtrans"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as any})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl px-4 py-3 text-sm text-brand-text appearance-none"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Active">Active</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Logo URL (PNG/SVG)</label>
                  <input 
                    type="text" 
                    value={formData.logo}
                    onChange={e => setFormData({...formData, logo: e.target.value})}
                    className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-3 text-sm text-brand-text font-mono"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-brand-border">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">API Server Key</label>
                    <input 
                      type="password" 
                      value={formData.apiKey}
                      onChange={e => setFormData({...formData, apiKey: e.target.value})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-3 text-sm text-brand-text font-mono"
                      placeholder="Mid-server-..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted ml-1">Merchant ID</label>
                    <input 
                      type="text" 
                      value={formData.merchantId}
                      onChange={e => setFormData({...formData, merchantId: e.target.value})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl px-5 py-3 text-sm text-brand-text font-mono"
                      placeholder="G-..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-text-muted hover:bg-brand-surface transition-colors">Cancel</button>
                  <button className="flex-[2] bg-brand-primary text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2">
                    <Save size={16} /> Save Credentials
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="glass-card p-8 rounded-3xl shadow-sm border border-brand-border">
        {/* ... security content remains similar ... */}
        <h3 className="text-sm font-black uppercase tracking-tight text-brand-text mb-8 flex items-center gap-3">
          <ShieldCheck size={24} className="text-emerald-500" />
          Security Compliance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-14 h-14 bg-brand-surface border border-brand-border rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-brand-primary/50 transition-all shadow-inner">
              <CreditCard size={24} className="text-brand-primary" />
            </div>
            <p className="text-[10px] uppercase font-black text-brand-text-muted mb-1 tracking-widest">PCI-DSS</p>
            <p className="text-xs font-black text-brand-text uppercase tracking-tight">Level 1 Certified</p>
          </div>
          <div className="text-center group">
            <div className="w-14 h-14 bg-brand-surface border border-brand-border rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-brand-primary/50 transition-all shadow-inner">
              <Landmark size={24} className="text-brand-primary" />
            </div>
            <p className="text-[10px] uppercase font-black text-brand-text-muted mb-1 tracking-widest">BI Licensed</p>
            <p className="text-xs font-black text-brand-text uppercase tracking-tight">PJP Category 1</p>
          </div>
          <div className="text-center group">
            <div className="w-14 h-14 bg-brand-surface border border-brand-border rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-brand-primary/50 transition-all shadow-inner">
              <Wallet size={24} className="text-brand-primary" />
            </div>
            <p className="text-[10px] uppercase font-black text-brand-text-muted mb-1 tracking-widest">Encryption</p>
            <p className="text-xs font-black text-brand-text uppercase tracking-tight">AES-256 Bit GCM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
