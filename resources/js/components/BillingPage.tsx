import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Customer } from '../types';
import { 
  Receipt, 
  DollarSign, 
  Clock, 
  FileText,
  Download,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useTranslation } from '../locales/LanguageContext';

export default function BillingPage() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'customers'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
      setCustomers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const totalRevenue = customers.filter(c => c.invoiceStatus === 'paid').reduce((acc, c) => acc + c.invoiceAmount, 0);
  const pendingRevenue = customers.filter(c => c.invoiceStatus === 'pending').reduce((acc, c) => acc + c.invoiceAmount, 0);
  const overdueRevenue = customers.filter(c => c.invoiceStatus === 'overdue').reduce((acc, c) => acc + c.invoiceAmount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
              <DollarSign className="text-brand-primary" size={20} />
            </div>
            <p className="text-[10px] font-black uppercase text-brand-text-muted tracking-wider transition-colors">{t('totalRevenue')}</p>
          </div>
          <h3 className="text-2xl font-black text-brand-text transition-colors">{formatCurrency(totalRevenue)}</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <Clock className="text-amber-500" size={20} />
            </div>
            <p className="text-[10px] font-black uppercase text-brand-text-muted tracking-wider transition-colors">{t('pendingCollected')}</p>
          </div>
          <h3 className="text-2xl font-black text-brand-text transition-colors">{formatCurrency(pendingRevenue)}</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
              <AlertTriangle className="text-red-500" size={20} />
            </div>
            <p className="text-[10px] font-black uppercase text-brand-text-muted tracking-wider transition-colors">{t('overdueRisk')}</p>
          </div>
          <h3 className="text-2xl font-black text-brand-text transition-colors">{formatCurrency(overdueRevenue)}</h3>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-brand-border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-brand-surface/30">
          <h3 className="text-sm font-black uppercase tracking-tight text-brand-text flex items-center gap-2">
            <FileText size={18} className="text-brand-primary" />
            {t('recentInvoices')}
          </h3>
          <button className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:text-brand-primary/80 flex items-center gap-2 transition-all w-full sm:w-auto justify-center">
            <Download size={14} />
            Export Monthly Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-surface text-[10px] uppercase tracking-wider text-brand-text-muted font-bold border-b border-brand-border">
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4 h-16 bg-brand-surface/20" />
                  </tr>
                ))
              ) : (
                customers.map((c, i) => (
                  <tr key={c.id} className="hover:bg-brand-primary/5 transition-colors group">
                    <td className="px-6 py-4 text-xs font-mono text-brand-text-muted">INV-2024-{(1000 + i).toString()}</td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-brand-text tracking-tight">{c.name}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-brand-text">
                      {formatCurrency(c.invoiceAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border transition-colors shadow-sm ${
                        c.invoiceStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]' :
                        c.invoiceStatus === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                      }`}>
                        {c.invoiceStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-brand-text-muted font-bold">
                      {new Date(Date.now() + (i * 86400000)).toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-1 px-4 bg-brand-surface border border-brand-border hover:bg-brand-primary hover:text-white hover:border-brand-primary rounded-lg text-[10px] font-black uppercase tracking-widest text-brand-text-muted transition-all shadow-sm">
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
