import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { InventoryItem } from '../types';
import { Package, Plus, Trash2, Edit2, Search, ShoppingCart, X, Save } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import POSPage from './POSPage';
import { useTranslation } from '../locales/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

export default function InventoryPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPOSMode, setIsPOSMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  const [formData, setFormData] = useState({
    itemName: '',
    sku: '',
    quantity: 0,
    unitPrice: 0,
    category: 'Hardware'
  });

  useEffect(() => {
    const q = query(collection(db, 'inventory'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredItems = items.filter(i => 
    i.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateDoc(doc(db, 'inventory', editingItem.id), {
          ...formData,
          stock: formData.quantity, // Sync if both fields used in types
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'inventory'), {
          ...formData,
          stock: formData.quantity, // Sync if both fields used in types
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      closeModal();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      await deleteDoc(doc(db, 'inventory', id));
    }
  };

  const openEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      sku: item.sku,
      quantity: item.quantity || item.stock || 0,
      unitPrice: item.unitPrice,
      category: item.category || 'Hardware'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ itemName: '', sku: '', quantity: 0, unitPrice: 0, category: 'Hardware' });
  };

  if (isPOSMode) {
    return <POSPage onBack={() => setIsPOSMode(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-text uppercase tracking-tighter">Inventory Control</h2>
          <p className="text-[10px] text-brand-text-muted mt-1 font-black uppercase tracking-widest opacity-60">Manage network gear and consumer hardware</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsPOSMode(true)}
            data-cursor-text="Launch Transaction Panel"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-surface border border-brand-border text-brand-text-muted px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-brand-primary active:scale-95 transition-all"
          >
            <ShoppingCart size={16} />
            POS Mode
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            data-cursor-text="Register New Product"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-primary hover:scale-[1.02] active:scale-95 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-primary/20"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
        <input 
          type="text" 
          placeholder="Search items by name or SKU..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-brand-surface border border-brand-border rounded-2xl pl-12 pr-4 py-4 text-sm text-brand-text outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all shadow-inner"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map(item => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={item.id} 
              className="glass-card p-6 rounded-[2rem] group border border-brand-border/10 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-brand-primary/10 rounded-2xl border border-brand-primary/10 shadow-inner group-hover:scale-110 transition-transform">
                  <Package className="text-brand-primary" size={24} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                  <button 
                    onClick={() => openEdit(item)}
                    className="p-2 bg-brand-surface hover:bg-brand-primary border border-brand-border rounded-xl text-brand-text hover:text-white transition-all shadow-sm"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id, item.itemName)}
                    className="p-2 bg-brand-surface hover:bg-red-500 border border-brand-border rounded-xl text-brand-text hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <h4 className="text-sm font-black text-brand-text uppercase tracking-tight mb-1 group-hover:text-brand-primary transition-colors">{item.itemName}</h4>
              <p className="text-[10px] text-brand-text-muted font-black tracking-widest mb-6 font-mono opacity-50">{item.sku}</p>
              
              <div className="flex justify-between items-end border-t border-brand-border/50 pt-5">
                <div>
                  <p className="text-[9px] uppercase text-brand-text-muted font-black tracking-widest mb-1 opacity-60">Status Stok</p>
                  <p className={cn(
                    "text-xl font-black tracking-tighter",
                    (item.quantity || item.stock || 0) <= 5 ? 'text-red-500' : 'text-emerald-500'
                  )}>
                    {item.quantity || item.stock || 0} <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Unit</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase text-brand-text-muted font-black tracking-widest mb-1 opacity-60">Unit Price</p>
                  <p className="text-sm font-black text-brand-primary">{formatCurrency(item.unitPrice)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && !loading && (
          <div className="col-span-full py-32 text-center glass-card border-2 border-dashed border-brand-border rounded-[3rem] mt-4">
            <div className="w-24 h-24 bg-brand-surface border border-brand-border rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner rotate-3">
              <Package className="text-brand-text-muted opacity-20" size={48} />
            </div>
            <p className="text-brand-text-muted text-sm font-black uppercase tracking-widest">Store Inventory Empty</p>
            <p className="text-brand-text-muted text-[10px] font-black uppercase tracking-widest mt-2 opacity-40">Add your first product to begin</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md glass-card rounded-[3rem] border border-brand-primary/20 overflow-hidden shadow-2xl">
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-brand-text">
                    {editingItem ? 'Edit Product' : 'New Product'}
                  </h3>
                  <button type="button" onClick={closeModal} className="p-3 bg-brand-surface border border-brand-border rounded-2xl text-brand-text-muted hover:text-red-500 transition-colors"><X size={20} /></button>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-brand-text-muted ml-1 tracking-widest">Nama Produk</label>
                    <input 
                      required
                      type="text" 
                      value={formData.itemName}
                      onChange={e => setFormData({...formData, itemName: e.target.value})}
                      className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl p-4 text-xs text-brand-text focus:border-brand-primary shadow-inner outline-none"
                      placeholder="e.g. WiFi Router AX3000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-brand-text-muted ml-1 tracking-widest">SKU / Serial Number</label>
                    <input 
                      required
                      type="text" 
                      value={formData.sku}
                      onChange={e => setFormData({...formData, sku: e.target.value})}
                      className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl p-4 text-xs font-mono text-brand-text focus:border-brand-primary shadow-inner outline-none"
                      placeholder="SN-XXXX-XXXX"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-brand-text-muted ml-1 tracking-widest">Stok Awal</label>
                      <input 
                        required
                        type="number" 
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                        className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl p-4 text-xs font-black text-brand-text focus:border-brand-primary shadow-inner outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-brand-text-muted ml-1 tracking-widest">Harga Satuan</label>
                      <input 
                        required
                        type="number" 
                        value={formData.unitPrice}
                        onChange={e => setFormData({...formData, unitPrice: parseInt(e.target.value)})}
                        className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl p-4 text-xs font-black text-brand-primary focus:border-brand-primary shadow-inner outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full py-5 bg-brand-primary text-white rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <Save size={18} />
                    {editingItem ? 'Save Changes' : 'Register Product'}
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

