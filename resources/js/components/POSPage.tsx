import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { InventoryItem } from '../types';
import { 
  Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, 
  Banknote, Receipt, ArrowLeft, CheckCircle2, X 
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../locales/LanguageContext';

interface CartItem extends InventoryItem {
  cartQuantity: number;
}

export default function POSPage({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [cashReceived, setCashReceived] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'qr' | 'card'>('cash');
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, 'inventory'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem)));
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (item: InventoryItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, cartQuantity: i.cartQuantity + 1 } : i);
      }
      return [...prev, { ...item, cartQuantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.cartQuantity + delta);
        return { ...i, cartQuantity: newQty };
      }
      return i;
    }).filter(i => i.cartQuantity > 0));
  };

  const total = cart.reduce((sum, item) => sum + (item.unitPrice * item.cartQuantity), 0);
  const change = Math.max(0, parseFloat(cashReceived || '0') - total);

  const filteredItems = items.filter(i => 
    i.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProcessPayment = async () => {
    if (paymentMethod === 'cash' && parseFloat(cashReceived) < total) return;
    
    const saleId = `POS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const saleData = {
      saleId,
      items: cart.map(i => ({ itemId: i.id, name: i.itemName, qty: i.cartQuantity, price: i.unitPrice })),
      total,
      cashReceived: paymentMethod === 'cash' ? parseFloat(cashReceived) : total,
      change: paymentMethod === 'cash' ? change : 0,
      method: paymentMethod,
      timestamp: serverTimestamp(),
      time: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, 'sales'), saleData);
      setLastTransaction({ ...saleData, id: docRef.id });
      setIsCheckoutOpen(false);
      setIsSuccessOpen(true);
      setCart([]);
      setCashReceived('');
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-1 relative overflow-hidden">
      {/* Left: Product Selection */}
      <div className="flex-1 flex flex-col min-w-0 bg-brand-surface/30 rounded-[2.5rem] p-6 border border-brand-border/50">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-3 bg-brand-surface border border-brand-border rounded-2xl text-brand-text-muted hover:text-brand-primary transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl pl-12 pr-4 py-4 text-sm text-brand-text outline-none focus:border-brand-primary transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
            {filteredItems.map(item => (
              <button 
                key={item.id}
                onClick={() => addToCart(item)}
                className="glass-card p-4 rounded-3xl border border-brand-border/10 text-left group hover:border-brand-primary/30 transition-all active:scale-95 flex flex-col h-full bg-brand-surface/20"
              >
                <div className="aspect-square bg-brand-primary/5 rounded-2xl mb-4 flex items-center justify-center border border-brand-primary/5 group-hover:scale-105 transition-transform">
                  <CreditCard className="text-brand-primary opacity-40" size={32} />
                </div>
                <h4 className="text-xs font-black uppercase text-brand-text mb-1 line-clamp-1">{item.itemName}</h4>
                <p className="text-[9px] font-black uppercase text-brand-text-muted mb-4 opacity-50">{item.sku}</p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-xs font-black text-brand-primary">{formatCurrency(item.unitPrice)}</span>
                  <div className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <Plus size={14} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Cart Sidebar */}
      <div className="w-full lg:w-[400px] flex flex-col bg-brand-bg rounded-[2.5rem] border border-brand-border/50 shadow-2xl relative overflow-hidden">
        <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-surface/30">
          <h3 className="text-sm font-black uppercase italic tracking-tighter flex items-center gap-2">
            <ShoppingCart size={18} className="text-brand-primary" />
            Current Order
          </h3>
          <span className="bg-brand-primary text-white text-[10px] font-black px-2 py-1 rounded-full">{cart.length} ITEMS</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {cart.map(item => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.id} 
                className="flex items-center gap-4 bg-brand-surface/40 p-4 rounded-2xl border border-brand-border/50"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-black uppercase text-brand-text truncate">{item.itemName}</h4>
                  <p className="text-[10px] font-black text-brand-primary mt-1">{formatCurrency(item.unitPrice)}</p>
                </div>
                <div className="flex items-center gap-3 bg-brand-bg/50 p-1 rounded-xl border border-brand-border/50">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-brand-surface rounded-lg text-brand-text-muted transition-colors"><Minus size={14} /></button>
                  <span className="text-xs font-black w-6 text-center">{item.cartQuantity}</span>
                  <button onClick={() => addToCart(item)} className="p-1.5 hover:bg-brand-surface rounded-lg text-brand-primary transition-colors"><Plus size={14} /></button>
                </div>
                <button onClick={() => updateQuantity(item.id, -999)} className="p-2 text-red-500/50 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </motion.div>
            ))}
          </AnimatePresence>
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-30 text-brand-text-muted py-12">
              <ShoppingCart size={48} strokeWidth={1} />
              <p className="text-[10px] uppercase font-black tracking-widest mt-4">Order is empty</p>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-brand-border bg-brand-surface/30 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black uppercase text-brand-text-muted tracking-widest">
              <span>Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between text-lg font-black uppercase tracking-tighter text-brand-text pt-2 border-t border-brand-border/20">
              <span className="italic">Total</span>
              <span className="text-brand-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-brand-primary text-white font-black uppercase tracking-widest py-5 px-6 rounded-3xl transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            <Banknote size={20} />
            Place Order
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCheckoutOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md glass-card rounded-[3rem] border border-brand-primary/20 overflow-hidden shadow-2xl">
              <div className="p-8 space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-1">Checkout</h3>
                  <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest leading-none">Process payment for order</p>
                </div>

                <div className="bg-brand-surface/50 p-6 rounded-3xl border border-brand-border shadow-inner text-center">
                  <p className="text-[10px] font-black uppercase text-brand-text-muted mb-2 tracking-widest">Amount to Pay</p>
                  <p className="text-4xl font-black text-brand-primary tracking-tighter">{formatCurrency(total)}</p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'cash', icon: Banknote, label: 'Cash' },
                    { id: 'transfer', icon: Receipt, label: 'Bank' },
                    { id: 'qr', icon: CheckCircle2, label: 'QRIS' },
                    { id: 'card', icon: CreditCard, label: 'Card' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                        paymentMethod === m.id 
                          ? "bg-brand-primary border-brand-primary text-white shadow-lg" 
                          : "bg-brand-surface border-brand-border text-brand-text-muted hover:border-brand-primary/50"
                      )}
                    >
                      <m.icon size={18} />
                      <span className="text-[8px] font-black uppercase tracking-tighter">{m.label}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {paymentMethod === 'cash' ? (
                    <div>
                      <label className="text-[10px] font-black uppercase text-brand-text-muted ml-1 tracking-widest">Cash Received</label>
                      <div className="relative mt-2">
                        <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" size={20} />
                        <input 
                          type="number"
                          value={cashReceived}
                          onChange={(e) => setCashReceived(e.target.value)}
                          placeholder="Enter amount..."
                          className="w-full bg-brand-surface border-2 border-brand-border rounded-2xl pl-12 pr-4 py-5 text-xl font-black text-brand-text outline-none focus:border-brand-primary transition-all shadow-inner"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-brand-primary/5 rounded-3xl border border-brand-primary/10 text-center animate-in fade-in slide-in-from-bottom-2">
                      <p className="text-[10px] font-black uppercase text-brand-primary tracking-widest mb-2 italic">Waiting for {paymentMethod.toUpperCase()} Settlement</p>
                      <div className="w-12 h-12 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto opacity-40" />
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <div className="flex justify-between items-center p-5 bg-brand-primary/5 rounded-3xl border border-brand-primary/10">
                      <span className="text-xs font-black uppercase text-brand-text-muted tracking-widest">Change</span>
                      <span className="text-xl font-black text-brand-primary">{formatCurrency(change)}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setIsCheckoutOpen(false)} className="py-4 bg-brand-surface border border-brand-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-border transition-all">Cancel</button>
                  <button 
                    onClick={handleProcessPayment}
                    disabled={(paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < total))}
                    className="py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all font-mono"
                  >
                    Confirm {paymentMethod.toUpperCase()}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Success Modal */}
        {isSuccessOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className="relative w-full max-w-sm glass-card rounded-[3.5rem] p-10 border border-emerald-500/20 text-center shadow-2xl">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                <CheckCircle2 className="text-emerald-500" size={48} />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Order Confirmed</h3>
              <p className="text-xs text-brand-text-muted font-bold mb-8">Transaction has been recorded successfully.</p>
              
              <div className="bg-brand-surface/50 rounded-3xl p-6 border border-brand-border mb-8 text-left space-y-3 font-mono">
                <div className="flex justify-between items-center text-[10px] text-brand-text-muted">
                  <span>BILLING TOTAL</span>
                  <span className="text-brand-text font-black">{formatCurrency(lastTransaction?.total)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-brand-text-muted">
                  <span>CASH PAID</span>
                  <span className="text-brand-text font-black">{formatCurrency(lastTransaction?.cashReceived)}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-3 border-t border-brand-border text-emerald-500 font-black">
                  <span>CHANGE</span>
                  <span>{formatCurrency(lastTransaction?.change)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20"><Receipt size={18} /> Print Receipt</button>
                <button onClick={() => setIsSuccessOpen(false)} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-brand-text-muted hover:text-brand-text transition-colors">Close Window</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
