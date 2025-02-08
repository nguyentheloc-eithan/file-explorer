import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ConfigAppProvider } from './providers/AppConfig.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ConfigAppProvider>
      <App />
    </ConfigAppProvider>
  </BrowserRouter>
);
