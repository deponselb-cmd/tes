import { 
  TrendingUp, 
  Users, 
  AlertCircle, 
  ShieldOff,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Database
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useState } from 'react';
import { useTranslation } from '../locales/LanguageContext';

const chartData = [
  { name: 'Jan', revenue: 4500, users: 400 },
  { name: 'Feb', revenue: 5200, users: 450 },
  { name: 'Mar', revenue: 4800, users: 430 },
  { name: 'Apr', revenue: 6100, users: 510 },
  { name: 'May', revenue: 5900, users: 480 },
  { name: 'Jun', revenue: 7200, users: 600 },
];

const StatCard = ({ label, value, icon: Icon, trend, color, t }: any) => {
  const colorMap: Record<string, string> = {
    indigo: 'brand-primary',
    cyan: 'cyan-400',
    amber: 'amber-500',
    emerald: 'emerald-500'
  };
  const activeColor = colorMap[color] || color;

  return (
    <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group border border-brand-border/10 shadow-sm transition-all hover:shadow-brand-primary/10">
      <div className={`absolute top-0 left-0 w-1 h-full bg-brand-primary opacity-30 group-hover:opacity-100 transition-opacity`} />
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-brand-text-muted font-black mb-1.5 leading-none">{label}</p>
          <h3 className="text-2xl font-black text-brand-text tracking-tighter transition-colors">{value}</h3>
        </div>
        <div className="p-2.5 rounded-xl bg-brand-surface border border-brand-border shadow-inner group-hover:scale-110 transition-transform">
          <Icon className="text-brand-primary" size={20} />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        {trend > 0 ? (
          <span className="text-[10px] flex items-center text-emerald-500 font-black uppercase tracking-tight">
            <ArrowUpRight size={12} strokeWidth={3} className="mr-0.5" /> {trend}%
          </span>
        ) : (
          <span className="text-[10px] flex items-center text-red-500 font-black uppercase tracking-tight">
            <ArrowDownRight size={12} strokeWidth={3} className="mr-0.5" /> {Math.abs(trend)}%
          </span>
        )}
        <span className="text-[10px] text-brand-text-muted font-black uppercase tracking-widest opacity-60 ml-1 leading-none">{t('vsLastMonth')}</span>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const [isSeeding, setIsSeeding] = useState(false);

  const seedData = async () => {
    setIsSeeding(true);
    try {
      const customersRef = collection(db, 'customers');
      const q = query(customersRef, limit(1));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        const dummyCustomers = [
          { name: 'Andi Pratama', email: 'andi@example.com', phone: '081234567890', address: 'Jl. Sudirman No. 12, Jakarta', plan: 'Fiber 50Mbps', pppoe: 'andi_fiber', status: 'active', invoiceAmount: 350000, invoiceStatus: 'paid', lat: -6.2088, lng: 106.8456 },
          { name: 'Siti Aminah', email: 'siti@example.com', phone: '081298765432', address: 'Jl. Merdeka No. 45, Bandung', plan: 'Fiber 100Mbps', pppoe: 'siti_ultra', status: 'active', invoiceAmount: 550000, invoiceStatus: 'paid', lat: -6.9175, lng: 107.6191 },
          { name: 'Budi Santoso', email: 'budi@example.com', phone: '081344556677', address: 'Jl. Diponegoro No. 8, Surabaya', plan: 'Fiber 30Mbps', pppoe: 'budi_home', status: 'isolated', invoiceAmount: 250000, invoiceStatus: 'overdue', lat: -7.2575, lng: 112.7521 },
          { name: 'Dewi Lestari', email: 'dewi@example.com', phone: '081566778899', address: 'Jl. Gajah Mada No. 22, Semarang', plan: 'Fiber 50Mbps', pppoe: 'dewi_f', status: 'active', invoiceAmount: 350000, invoiceStatus: 'pending', lat: -6.9667, lng: 110.4167 },
          { name: 'Eko Wahyudi', email: 'eko@example.com', phone: '081900112233', address: 'Jl. Pettarani No. 100, Makassar', plan: 'Fiber 20Mbps', pppoe: 'eko_w', status: 'active', invoiceAmount: 175000, invoiceStatus: 'paid', lat: -5.1476, lng: 119.4327 },
        ];

        for (const customer of dummyCustomers) {
          await addDoc(customersRef, customer);
        }

        const inventoryRef = collection(db, 'inventory');
        const dummyInventory = [
          { itemName: 'MikroTik RB4011', sku: 'NET-MK-4011', quantity: 12, unitPrice: 2850000 },
          { itemName: 'TP-Link Archer AX55', sku: 'WIFI-TP-AX55', quantity: 24, unitPrice: 1250000 },
          { itemName: 'Fiber Patch Cord 3m', sku: 'CABLE-FB-3M', quantity: 150, unitPrice: 25000 },
          { itemName: 'Ubiquiti LiteAP AC', sku: 'WIFI-UB-LAP', quantity: 4, unitPrice: 1850000 },
        ];

        for (const item of dummyInventory) {
          await addDoc(inventoryRef, item);
        }
        
        alert("Seed data successfully added!");
      } else {
        alert("Database already has data.");
      }
    } catch (error) {
      console.error("Error seeding data:", error);
      alert("Error seeding data. Check console.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-black text-brand-text uppercase tracking-tighter">{t('dashboard')}</h1>
        <button 
          onClick={seedData} 
          disabled={isSeeding}
          data-cursor-text="Populate Demo Data"
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl text-xs font-black uppercase tracking-wider hover:bg-brand-primary hover:text-white transition-all disabled:opacity-50 shadow-lg shadow-brand-primary/10 w-full sm:w-auto justify-center"
        >
          <Database size={14} />
          {isSeeding ? t('seeding') : t('seedData')}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('monthlyRevenue')} value="Rp 842.5M" icon={TrendingUp} trend={12.5} color="indigo" t={t} />
        <StatCard label={t('activeCustomers')} value="1,284" icon={Users} trend={8.2} color="cyan" t={t} />
        <StatCard label={t('pendingInvoices')} value="42" icon={AlertCircle} trend={-4.3} color="amber" t={t} />
        <StatCard label={t('uptimeStatus')} value="99.98%" icon={Activity} trend={0.01} color="emerald" t={t} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black uppercase text-brand-text flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-primary" />
              {t('revenuePerformance')}
            </h3>
            <select className="bg-brand-surface border border-brand-border text-[10px] rounded-lg px-2 py-1 outline-none text-brand-text font-bold cursor-pointer">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-brand-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="var(--color-brand-text-muted)" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-brand-text-muted)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-brand-surface)', borderColor: 'var(--color-brand-border)', borderRadius: '1rem', border: '1px solid var(--color-brand-border)', backdropFilter: 'blur(12px)', color: 'var(--color-brand-text)' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-brand-primary)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-black uppercase text-brand-text mb-6 flex items-center gap-2">
            <Activity size={16} className="text-brand-primary" />
            Network Distribution
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-widest text-brand-text-muted leading-none">
                <span className="">{t('activeNodes')}</span>
                <span className="text-emerald-500">98% (42/43)</span>
              </div>
              <div className="w-full bg-brand-border/10 h-1.5 rounded-full overflow-hidden shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-widest text-brand-text-muted leading-none">
                <span className="">{t('bandwidthUsage')}</span>
                <span className="text-brand-primary">7.2 Gbps / 10 Gbps</span>
              </div>
              <div className="w-full bg-brand-border/10 h-1.5 rounded-full overflow-hidden shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} className="h-full bg-brand-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-widest text-brand-text-muted leading-none">
                <span className="">{t('averageLatency')}</span>
                <span className="text-cyan-500">12ms</span>
              </div>
              <div className="w-full bg-brand-border/10 h-1.5 rounded-full overflow-hidden shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: '12%' }} className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-brand-border/50">
            <h4 className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-4 opacity-60 leading-none">{t('criticalAlerts')}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs bg-red-500/5 p-3.5 rounded-xl border border-red-500/10 group hover:border-red-500/50 transition-all cursor-pointer">
                <ShieldOff size={14} className="text-red-500" />
                <span className="text-brand-text font-black uppercase tracking-tight">Node-East-SBY unresponsive</span>
              </div>
              <div className="flex items-center gap-3 text-xs bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/10 group hover:border-amber-500/50 transition-all cursor-pointer">
                <AlertCircle size={14} className="text-amber-500" />
                <span className="text-brand-text font-black uppercase tracking-tight">Payment Gateway sync delay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
