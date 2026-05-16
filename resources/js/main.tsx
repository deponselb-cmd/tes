import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './locales/LanguageContext';
import { BrandingProvider } from './contexts/BrandingContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrandingProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrandingProvider>
  </StrictMode>,
);
