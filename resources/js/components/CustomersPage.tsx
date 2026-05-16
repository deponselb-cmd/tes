import { useState, useEffect, FormEvent } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Customer, CustomerStatus } from '../types';
import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '../lib/utils';
import { useTranslation } from '../locales/LanguageContext';

export default function CustomersPage() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    plan: 'Basic 10 Mbps',
    status: 'active',
    address: '',
    invoiceStatus: 'pending'
  });

  useEffect(() => {
    const q = query(collection(db, 'customers'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
      setCustomers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData(customer);
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        phone: '',
        plan: 'Basic 10 Mbps',
        status: 'active',
        address: '',
        invoiceStatus: 'pending'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        invoiceAmount: formData.plan?.includes('50') ? 350000 : formData.plan?.includes('30') ? 250000 : 150000,
        pppoe: `pppoe-${formData.name?.toLowerCase().replace(/\s/g, '')}`
      };

      if (editingCustomer) {
        await updateDoc(doc(db, 'customers', editingCustomer.id), payload);
      } else {
        await addDoc(collection(db, 'customers'), {
          ...payload,
          id: `cust-${Date.now()}`
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      await deleteDoc(doc(db, 'customers', id));
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-text">{t('customerDirectory')}</h2>
          <p className="text-xs text-brand-text-muted mt-1">{t('manageBroadband')}</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-brand-primary hover:scale-[1.02] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-brand-primary/20 active:scale-95"
        >
          <UserPlus size={18} />
          {t('newCustomer')}
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" size={16} />
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-surface border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-text outline-none focus:border-brand-primary transition-colors shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 bg-brand-surface border border-brand-border px-4 py-2.5 rounded-xl text-xs font-semibold text-brand-text-muted hover:text-brand-primary transition-colors shadow-sm">
          <Filter size={16} />
          {t('advancedFilters')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
    <thead>
      <tr className="bg-brand-surface text-[10px] uppercase tracking-wider text-brand-text-muted font-bold border-b border-brand-border">
        <th className="px-6 py-4">{t('customerName')}</th>
        <th className="px-6 py-4 hidden md:table-cell">{t('subscriptionPlan')}</th>
        <th className="px-6 py-4 hidden sm:table-cell">{t('status')}</th>
        <th className="px-6 py-4 hidden lg:table-cell">{t('pppoeUser')}</th>
        <th className="px-6 py-4 text-right">{t('invoice')}</th>
        <th className="px-6 py-4 text-center">{t('actions')}</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-brand-border">
      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <tr key={i} className="animate-pulse">
            <td colSpan={6} className="px-6 py-4 h-16 bg-brand-surface/30" />
          </tr>
        ))
      ) : filteredCustomers.length === 0 ? (
        <tr>
          <td colSpan={6} className="px-6 py-12 text-center text-brand-text-muted text-sm italic">
            No customers found matching your criteria.
          </td>
        </tr>
      ) : (
        filteredCustomers.map((customer) => (
          <tr key={customer.id} className="hover:bg-brand-primary/5 transition-colors group border-brand-border">
            <td className="px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-brand-text transition-colors">{customer.name}</p>
                <p className="text-[10px] text-brand-text-muted mt-0.5">{customer.phone}</p>
              </div>
            </td>
            <td className="px-6 py-4 hidden md:table-cell">
              <span className="text-xs text-brand-text bg-brand-bg/50 border border-brand-border px-2 py-1 rounded-lg transition-colors">
                {customer.plan}
              </span>
            </td>
            <td className="px-6 py-4 hidden sm:table-cell">
              <span className={cn(
                 "text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors shadow-sm",
                 customer.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                 customer.status === 'isolated' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                 "bg-amber-500/10 text-amber-500 border-amber-500/20"
               )}>
                {customer.status.toUpperCase()}
              </span>
            </td>
            <td className="px-6 py-4 hidden lg:table-cell">
              <code className="text-xs text-brand-text-muted font-mono transition-colors">{customer.pppoe || 'N/A'}</code>
            </td>
            <td className="px-6 py-4 text-right">
              <p className="text-xs font-bold text-brand-text transition-colors">{formatCurrency(customer.invoiceAmount)}</p>
              <p className={cn(
                "text-[8px] uppercase tracking-tighter mt-0.5 font-black transition-colors",
                customer.invoiceStatus === 'paid' ? "text-emerald-500" :
                customer.invoiceStatus === 'overdue' ? "text-red-500" : "text-amber-500"
              )}>
                {customer.invoiceStatus}
              </p>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(customer)} className="p-1.5 hover:bg-brand-primary/10 rounded-lg text-brand-primary transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(customer.id!)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="bg-gray-50/50 dark:bg-gray-800/30 px-6 py-4 flex items-center justify-between border-t border-brand-border">
          <p className="text-[10px] text-gray-500 font-medium">Showing {filteredCustomers.length} results</p>
          <div className="flex gap-2">
            <button className="p-1.5 bg-brand-bg border border-brand-border rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-white disabled:opacity-50 transition-colors" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="p-1.5 bg-brand-bg border border-brand-border rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-brand-bg border border-brand-border rounded-2xl w-full max-w-lg overflow-hidden z-10 shadow-2xl"
            >
              <div className="p-6 border-b border-brand-border flex items-center justify-between">
                <h3 className="text-lg font-bold text-brand-text">{editingCustomer ? 'Edit Customer' : 'New Subscription'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-brand-text-muted hover:text-brand-text transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase text-brand-text-muted font-bold mb-1.5 block tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-primary text-brand-text"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-brand-text-muted font-bold mb-1.5 block tracking-widest">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-primary text-brand-text"
                      placeholder="+62 8xx..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-brand-text-muted font-bold mb-1.5 block tracking-widest">Subscription Plan</label>
                    <div className="relative">
                      <select 
                        value={formData.plan}
                        onChange={(e) => setFormData({...formData, plan: e.target.value})}
                        className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-primary text-brand-text appearance-none cursor-pointer"
                      >
                        <option>Basic 10 Mbps</option>
                        <option>Standard 30 Mbps</option>
                        <option>Premium 50 Mbps</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase text-brand-text-muted font-bold mb-1.5 block tracking-widest">Full Address</label>
                    <textarea 
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={3}
                      className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-primary text-brand-text resize-none"
                      placeholder="Enter installation address..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-brand-text-muted font-bold mb-1.5 block tracking-widest">Connection Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as CustomerStatus})}
                      className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-primary text-brand-text appearance-none cursor-pointer"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="isolated">Isolated</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-brand-text-muted font-bold mb-1.5 block tracking-widest">Billing Status</label>
                    <select 
                      value={formData.invoiceStatus}
                      onChange={(e) => setFormData({...formData, invoiceStatus: e.target.value as any})}
                      className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-primary text-brand-text appearance-none cursor-pointer"
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-brand-surface hover:bg-brand-border text-brand-text-muted rounded-xl text-sm font-bold transition-colors border border-brand-border"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 bg-brand-primary hover:scale-[1.02] active:scale-95 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-primary/20"
                  >
                    {editingCustomer ? 'Update Record' : 'Create Record'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper X Icon
const X = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
