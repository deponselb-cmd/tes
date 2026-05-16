import React, { useState, useEffect } from 'react';
import { Palette, Globe, Image as ImageIcon, CheckCircle2, Save, Loader2 } from 'lucide-react';
import { useBranding } from '../contexts/BrandingContext';

export default function WhiteLabelPage() {
  const { config: savedConfig, updateConfig, loading } = useBranding();
  const [localConfig, setLocalConfig] = useState(savedConfig);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setLocalConfig(savedConfig);
  }, [savedConfig]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig(localConfig);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-text uppercase tracking-tighter">White Label Branding</h2>
          <p className="text-[10px] text-brand-text-muted mt-1 font-black uppercase tracking-widest opacity-60">Customize the look and feel of your ISP platform</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:scale-[1.02] active:scale-95 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {showSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={18} />
          <span className="text-xs font-black uppercase tracking-widest">Settings saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 rounded-[2rem] shadow-sm space-y-6 border border-brand-border/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-primary/10 rounded-2xl">
              <Palette className="text-brand-primary" size={20} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight text-brand-text">Visual Identity</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-brand-text-muted tracking-widest ml-1 opacity-60">Company Name</label>
              <input 
                type="text" 
                value={localConfig.companyName}
                onChange={(e) => setLocalConfig({...localConfig, companyName: e.target.value})}
                className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl px-5 py-4 text-sm outline-none focus:border-brand-primary text-brand-text transition-all"
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-brand-text-muted tracking-widest ml-1 opacity-60">Primary Brand Color</label>
              <div className="flex gap-3">
                <input 
                  type="color" 
                  value={localConfig.primaryColor}
                  onChange={(e) => setLocalConfig({...localConfig, primaryColor: e.target.value})}
                  className="w-16 h-14 rounded-2xl border-4 border-brand-surface bg-brand-surface cursor-pointer shadow-lg"
                />
                <input 
                  type="text" 
                  value={localConfig.primaryColor}
                  onChange={(e) => setLocalConfig({...localConfig, primaryColor: e.target.value})}
                  className="flex-1 bg-brand-bg/50 border border-brand-border rounded-2xl px-5 py-4 text-sm font-mono outline-none focus:border-brand-primary text-brand-text transition-all"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2rem] shadow-sm space-y-6 border border-brand-border/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-primary/10 rounded-2xl">
              <Globe className="text-brand-primary" size={20} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight text-brand-text">Customer Portal</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-brand-text-muted tracking-widest ml-1 opacity-60">Domain Name</label>
              <input 
                type="text" 
                value={localConfig.portalDomain}
                onChange={(e) => setLocalConfig({...localConfig, portalDomain: e.target.value})}
                className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl px-5 py-4 text-sm outline-none focus:border-brand-primary transition-all text-brand-text"
                placeholder="e.g. portal.myisp.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-brand-text-muted tracking-widest ml-1 opacity-60">Portal Footer Text</label>
              <input 
                type="text" 
                value={localConfig.footerText}
                onChange={(e) => setLocalConfig({...localConfig, footerText: e.target.value})}
                className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl px-5 py-4 text-sm outline-none focus:border-brand-primary transition-all text-brand-text"
                placeholder="Copyright text"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-[2.5rem] shadow-sm border border-brand-border/30">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-brand-primary/10 rounded-2xl">
            <ImageIcon className="text-brand-primary" size={20} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-tight text-brand-text">Logo Assets</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group relative">
            <label className="text-[10px] uppercase font-black text-brand-text-muted tracking-widest ml-1 mb-2 block opacity-60">Dark Mode Logo</label>
            <div className="border-2 border-dashed border-brand-border rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all cursor-pointer group shadow-inner relative overflow-hidden">
              {localConfig.darkLogo ? (
                <img src={localConfig.darkLogo} alt="Dark Logo" className="max-h-16 object-contain" />
              ) : (
                <div className="w-16 h-16 bg-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform shadow-lg">
                  <ImageIcon size={32} />
                </div>
              )}
              <p className="text-[10px] font-black uppercase text-brand-text-muted tracking-widest opacity-60">Drag & Drop or Click</p>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <div className="group relative">
            <label className="text-[10px] uppercase font-black text-brand-text-muted tracking-widest ml-1 mb-2 block opacity-60">Light Mode Logo</label>
            <div className="border-2 border-dashed border-brand-border rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all cursor-pointer group shadow-inner relative overflow-hidden bg-white/50">
              {localConfig.lightLogo ? (
                <img src={localConfig.lightLogo} alt="Light Logo" className="max-h-16 object-contain" />
              ) : (
                <div className="w-16 h-16 bg-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform shadow-lg">
                  <ImageIcon size={32} />
                </div>
              )}
              <p className="text-[10px] font-black uppercase text-brand-text-muted tracking-widest opacity-60">Drag & Drop or Click</p>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Live Preview Section */}
      <div className="glass-card p-10 rounded-[3rem] border-2 border-brand-primary/20 bg-gradient-to-br from-brand-primary/5 to-transparent">
        <h3 className="text-sm font-black uppercase tracking-tight text-brand-text mb-8 flex items-center gap-2">
          <Globe size={18} className="text-brand-primary" />
          Live Identity Preview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none" style={{ color: localConfig.primaryColor }}>
              {localConfig.companyName}
            </h1>
            <p className="text-sm text-brand-text-muted leading-relaxed font-medium">
              This is how your brand will appear to your staff and customers. 
              The primary color <b>{localConfig.primaryColor}</b> will be applied to buttons, 
              links, and decorative elements across the entire platform.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-brand-primary/20" style={{ backgroundColor: localConfig.primaryColor }}>
                Action Button
              </button>
              <button className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-brand-surface border border-brand-border text-brand-text hover:bg-brand-border transition-colors">
                Secondary
              </button>
            </div>
          </div>
          
          <div className="aspect-video bg-brand-bg rounded-[2rem] border border-brand-border shadow-2xl relative overflow-hidden flex items-center justify-center p-8 group">
            <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: localConfig.primaryColor }} />
            <div className="text-center">
              <p className="text-[10px] font-black uppercase text-brand-text-muted tracking-widest mb-4 opacity-50">Portal Landing Page</p>
              <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">{localConfig.companyName}</h2>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{localConfig.footerText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

