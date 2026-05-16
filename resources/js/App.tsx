/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  MapPin, 
  Package, 
  Settings, 
  UserCog, 
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Moon,
  Sun,
  Languages,
  Cpu,
  Ticket,
  GitBranch,
  Palette,
  Server,
  CreditCard,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useTranslation } from './locales/LanguageContext';
import { TranslationKey } from './locales/translations';

// Components (We will create these)
import DashboardPage from './components/DashboardPage';
import CustomersPage from './components/CustomersPage';
import BillingPage from './components/BillingPage';
import MapLocatorPage from './components/MapLocatorPage';
import InventoryPage from './components/InventoryPage';
import StaffPage from './components/StaffPage';
import SettingsPage from './components/SettingsPage';
import NetworkingToolsPage from './components/NetworkingToolsPage';
import VoucherMakerPage from './components/VoucherMakerPage';
import WorkflowPage from './components/WorkflowPage';
import WhiteLabelPage from './components/WhiteLabelPage';
import MikroTikPage from './components/MikroTikPage';
import PaymentGatewayPage from './components/PaymentGatewayPage';
import LoginPage from './components/LoginPage';
import CursorText from './components/CursorText';
import POSPage from './components/POSPage';
import { useBranding } from './contexts/BrandingContext';

type Page = 'dashboard' | 'customers' | 'billing' | 'map' | 'inventory' | 'staff' | 'settings' | 'networking' | 'vouchers' | 'workflow' | 'whitelabel' | 'mikrotik' | 'payment' | 'pos';

export default function App() {
  const { config: branding } = useBranding();
  const { language, setLanguage, t } = useTranslation();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'midnight' | 'emerald' | 'rose' | 'nordic' | 'obsidian'>('midnight');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#030712]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const sidebarItems = [
    { id: 'dashboard', labelKey: 'dashboard' as TranslationKey, icon: LayoutDashboard },
    { id: 'pos', labelKey: 'pos' as any, icon: ShoppingCart },
    { id: 'customers', labelKey: 'customers' as TranslationKey, icon: Users },
    { id: 'billing', labelKey: 'billing' as TranslationKey, icon: Receipt },
    { id: 'map', labelKey: 'map' as TranslationKey, icon: MapPin },
    { id: 'inventory', labelKey: 'inventory' as TranslationKey, icon: Package },
    { id: 'networking', labelKey: 'networkingTools' as TranslationKey, icon: Cpu },
    { id: 'vouchers', labelKey: 'voucherMaker' as TranslationKey, icon: Ticket },
    { id: 'workflow', labelKey: 'workflow' as TranslationKey, icon: GitBranch },
    { id: 'whitelabel', labelKey: 'whiteLabel' as TranslationKey, icon: Palette },
    { id: 'mikrotik', labelKey: 'mikrotik' as TranslationKey, icon: Server },
    { id: 'payment', labelKey: 'paymentGateway' as TranslationKey, icon: CreditCard },
    { id: 'staff', labelKey: 'staff' as TranslationKey, icon: UserCog },
    { id: 'settings', labelKey: 'settings' as TranslationKey, icon: Settings },
  ];

  const themeConfig = {
    light: { icon: Sun, class: '', color: 'bg-white' },
    dark: { icon: Moon, class: 'dark', color: 'bg-indigo-600' },
    midnight: { icon: Moon, class: 'theme-midnight', color: 'bg-indigo-900' },
    emerald: { icon: Moon, class: 'theme-emerald', color: 'bg-emerald-600' },
    rose: { icon: Moon, class: 'theme-rose', color: 'bg-rose-600' },
    nordic: { icon: Sun, class: 'theme-nordic', color: 'bg-slate-400' },
    obsidian: { icon: Moon, class: 'theme-obsidian', color: 'bg-zinc-800' },
  };

  return (
    <div className={`h-screen w-screen flex overflow-hidden ${themeConfig[theme].class} bg-brand-bg text-brand-text transition-colors duration-500 relative`}>
      <CursorText />
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 1024 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 260 : (window.innerWidth < 1024 ? 0 : 80),
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={`fixed lg:relative shrink-0 border-r border-brand-border glass-card flex flex-col z-40 h-full overflow-hidden`}
      >
        <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-primary/5">
          {isSidebarOpen && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-black bg-gradient-to-r from-brand-primary to-brand-primary/60 bg-clip-text text-transparent tracking-tighter truncate max-w-[160px]"
            >
              {branding.companyName.toUpperCase()}
            </motion.h1>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors text-brand-primary">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
          {sidebarItems.map((item) => (
            <button 
              key={item.id}
              data-cursor-text={`Go to ${t(item.labelKey)}`}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                currentPage === item.id 
                ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/20 shadow-lg shadow-brand-primary/10' 
                : 'text-brand-text-muted hover:bg-brand-surface hover:text-brand-primary'
              }`}
              onClick={() => {
                setCurrentPage(item.id as Page);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
            >
              <item.icon size={18} className={currentPage === item.id ? 'text-brand-primary scale-110 transition-transform' : 'text-brand-text-muted group-hover:text-brand-primary transition-colors'} />
              {isSidebarOpen && <span>{t(item.labelKey)}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-border">
          <button 
            onClick={handleLogout}
            data-cursor-text="Bye Bye!"
            className="w-full flex items-center gap-3 px-3 py-2.5 text-brand-text-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl text-sm transition-all"
          >
            <LogOut size={18} />
            {isSidebarOpen && <span>{t('logout')}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-brand-border px-4 lg:px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-brand-bg/60">
          <div className="flex items-center gap-3 lg:gap-4 min-w-0">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-brand-surface rounded-xl text-brand-primary shrink-0 border border-brand-border shadow-sm">
              <Menu size={20} />
            </button>
            <h2 className="text-sm lg:text-lg font-black uppercase tracking-tight text-brand-text truncate">{t(currentPage as TranslationKey)}</h2>
            <div className="hidden sm:flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-500/20 whitespace-nowrap">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t('systemStable')}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-border bg-brand-surface shadow-inner">
              <Search size={16} className="text-brand-text-muted" />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                className="bg-transparent border-none text-xs focus:ring-0 w-32 lg:w-48 text-brand-text placeholder:text-brand-text-muted outline-none" 
              />
            </div>
            
            <button 
              onClick={toggleLanguage} 
              data-cursor-text={language === 'en' ? 'Switch to Indo' : 'Switch to English'}
              className="p-2 hover:bg-brand-surface rounded-xl flex items-center gap-2 text-[10px] font-black text-brand-primary border border-transparent hover:border-brand-border transition-all"
            >
              <Languages size={18} />
              <span className="uppercase hidden xs:inline">{language}</span>
            </button>

            <div className="hidden sm:flex items-center gap-1 p-1 bg-brand-border/30 rounded-xl overflow-x-auto max-w-[120px] lg:max-w-[200px] scrollbar-hide">
              {(['midnight', 'emerald', 'rose', 'nordic', 'obsidian', 'light'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    data-cursor-text={`Active ${t}`}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                    theme === t ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 ring-2 ring-brand-primary ring-offset-2 ring-offset-brand-bg' : 'hover:bg-brand-surface text-brand-text-muted'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full border border-black/10 dark:border-white/20 ${themeConfig[t].color}`} />
                </button>
              ))}
            </div>
            
            <button className="p-2 hover:bg-brand-surface rounded-xl relative text-brand-text-muted border border-transparent hover:border-brand-border transition-all">
              <Bell size={18} />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-brand-bg" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-brand-border">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-brand-text uppercase tracking-tighter">{user.email?.split('@')[0]}</p>
                <p className="text-[10px] text-brand-text-muted font-bold">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-xs font-black text-white uppercase shadow-lg shadow-brand-primary/30">
                {user.email?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-brand-bg/50 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="h-full"
            >
              {currentPage === 'dashboard' && <DashboardPage />}
              {currentPage === 'customers' && <CustomersPage />}
              {currentPage === 'billing' && <BillingPage />}
              {currentPage === 'map' && <MapLocatorPage />}
              {currentPage === 'inventory' && <InventoryPage />}
              {currentPage === 'networking' && <NetworkingToolsPage />}
              {currentPage === 'vouchers' && <VoucherMakerPage />}
              {currentPage === 'workflow' && <WorkflowPage />}
              {currentPage === 'whitelabel' && <WhiteLabelPage />}
              {currentPage === 'mikrotik' && <MikroTikPage />}
              {currentPage === 'payment' && <PaymentGatewayPage />}
              {currentPage === 'staff' && <StaffPage />}
              {currentPage === 'settings' && <SettingsPage />}
              {currentPage === 'pos' && <POSPage onBack={() => setCurrentPage('inventory')} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
