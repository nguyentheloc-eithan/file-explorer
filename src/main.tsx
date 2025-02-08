import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ToastContainer } from 'react-toastify';
import { ConfigAppProvider } from './providers/AppConfig.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ConfigAppProvider>
      <App />
      <ToastContainer />
    </ConfigAppProvider>
  </BrowserRouter>
);
