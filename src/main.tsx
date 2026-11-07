import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* HashRouter = static-hosting friendly: every route works on GitHub Pages, including after refresh. */}
    <HashRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </HashRouter>
  </StrictMode>,
);
