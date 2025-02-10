import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ToastContainer } from 'react-toastify';
import { ConfigAppProvider } from './providers/AppConfig.tsx';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <FluentProvider theme={webLightTheme}>
      <ConfigAppProvider>
        <App />
        <ToastContainer />
      </ConfigAppProvider>
    </FluentProvider>
  </BrowserRouter>
);
