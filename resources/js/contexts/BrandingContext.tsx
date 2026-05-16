import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface BrandingConfig {
  companyName: string;
  primaryColor: string;
  portalDomain: string;
  footerText: string;
  darkLogo?: string;
  lightLogo?: string;
}

const DEFAULT_CONFIG: BrandingConfig = {
  companyName: 'Celebes Synergi',
  primaryColor: '#6366f1',
  portalDomain: 'portal.synergi.id',
  footerText: 'Powered by Celebes Synergi',
};

interface BrandingContextType {
  config: BrandingConfig;
  updateConfig: (newConfig: Partial<BrandingConfig>) => Promise<void>;
  loading: boolean;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<BrandingConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'whiteLabel'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig({ ...DEFAULT_CONFIG, ...docSnap.data() } as BrandingConfig);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error loading branding:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    // Apply primary color to CSS variables - Tailwind v4 uses --color-* for theme properties
    document.documentElement.style.setProperty('--color-brand-primary', config.primaryColor);
    
    // Update document title
    document.title = config.companyName;
  }, [config.primaryColor, config.companyName]);

  const updateConfig = async (newConfig: Partial<BrandingConfig>) => {
    try {
      await setDoc(doc(db, 'settings', 'whiteLabel'), {
        ...config,
        ...newConfig,
      });
    } catch (error) {
      console.error("Error updating branding:", error);
      throw error;
    }
  };

  return (
    <BrandingContext.Provider value={{ config, updateConfig, loading }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}
