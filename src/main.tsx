import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from './components/ui/toaster.tsx';
import DesignerContextProvider from './components/context/DesignerContext.tsx';
import { ThemeProvider } from './components/context/ThemeProvider.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DesignerContextProvider>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <App />
                <Toaster />
            </ThemeProvider>
        </DesignerContextProvider>
    </StrictMode>
);
