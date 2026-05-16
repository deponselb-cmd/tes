import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../locales/LanguageContext';
import { useState, FormEvent } from 'react';
import { useBranding } from '../contexts/BrandingContext';

export default function LoginPage() {
  const { t } = useTranslation();
  const { config: branding } = useBranding();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google login failed:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualAuth = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Manual auth failed:", error);
      let message = error.message;
      if (error.code === 'auth/email-already-in-use') message = t('invalidEmail');
      if (error.code === 'auth/weak-password') message = t('passwordTooShort');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-brand-bg text-brand-text overflow-hidden relative theme-midnight">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[160px] animate-pulse opacity-20"
          style={{ backgroundColor: branding.primaryColor }}
        />
        <div 
          className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[160px] animate-pulse delay-700 opacity-10" 
          style={{ backgroundColor: branding.primaryColor }}
        />
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-bg via-transparent to-brand-bg/50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] p-8 sm:p-12 glass-card rounded-[3rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.5)] z-10 border-white/5 relative group"
      >
        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col items-center text-center mb-10 relative">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-brand-surface rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/10 shadow-2xl shadow-brand-primary/20 backdrop-blur-3xl overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-transparent" />
            <ShieldCheck className="text-brand-primary relative z-10" size={48} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-black text-brand-text mb-3 tracking-tighter uppercase italic leading-none"
          >
            {branding.companyName}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-brand-text-muted text-[10px] font-black uppercase tracking-[0.3em] opacity-40 leading-none"
          >
            {t('loginSubtitle')}
          </motion.p>
        </div>

        <form onSubmit={handleManualAuth} className="space-y-4 mb-8 relative">
          <div className="space-y-3">
            <div className="group/input relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within/input:text-brand-primary transition-colors" size={20} />
              <input 
                type="email" 
                placeholder={t('email')}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-bg/50 border border-white/5 rounded-[1.5rem] pl-14 pr-6 py-5 text-sm font-bold text-brand-text outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-inner placeholder:text-brand-text-muted/50"
              />
            </div>
            <div className="group/input relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within/input:text-brand-primary transition-colors" size={20} />
              <input 
                type="password" 
                placeholder={t('password')}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-bg/50 border border-white/5 rounded-[1.5rem] pl-14 pr-6 py-5 text-sm font-bold text-brand-text outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-inner placeholder:text-brand-text-muted/50"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest text-center py-3 rounded-xl px-4"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary text-white font-black uppercase tracking-widest py-5 px-8 rounded-[1.5rem] transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] shadow-brand-primary/30 border border-white/10 hover:shadow-brand-primary/50 hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-4 group/btn"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <div className="flex items-center gap-3">
                <span>{isRegistering ? t('register') : t('login')}</span>
                <motion.div 
                  animate={{ x: [0, 4, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {isRegistering ? <ShieldCheck size={18} /> : <Lock size={18} />}
                </motion.div>
              </div>
            )}
          </button>
        </form>

        <div className="relative mb-8 flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-white/10" />
          <span className="text-[9px] uppercase font-black tracking-[0.2em] text-brand-text-muted/40 whitespace-nowrap">
            {isRegistering ? 'atau registrasi dengan' : 'atau masuk dengan'}
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-white/10 to-white/10" />
        </div>

        <div className="space-y-4 relative">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-white/5 text-brand-text font-black uppercase tracking-widest py-5 px-8 rounded-[1.5rem] transition-all border border-white/5 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] disabled:opacity-50 group/google"
          >
            <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center p-1 group-hover/google:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <span>Google Workspace</span>
          </button>
        </div>

        <div className="mt-10 text-center relative">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="group/link text-[10px] font-black uppercase tracking-widest text-brand-primary"
          >
            <span className="opacity-60">{isRegistering ? 'Sudah punya akun?' : 'Belum punya akun?'}</span>
            <span className="ml-2 group-hover/link:underline decoration-2 underline-offset-8 transition-all">
              {isRegistering ? 'Masuk Sekarang' : 'Daftar Sekarang'}
            </span>
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center relative">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-md">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
              <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-40" />
            </div>
            <div className="text-left">
              <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest leading-none mb-1">{t('infrastructureOnline')}</p>
              <p className="text-[7px] text-emerald-500/50 font-black uppercase tracking-widest leading-none">Cluster: Asia-East-1</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
