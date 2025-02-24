// import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App.tsx';
// import './index.css';
// import { ToastContainer } from 'react-toastify';
// import { ConfigAppProvider } from './providers/AppConfig.tsx';
// import { FluentProvider, webLightTheme } from '@fluentui/react-components';
// import { PartitionsProvider } from './providers/PartitionsContext.tsx';
// createRoot(document.getElementById('root')!).render(
//   <BrowserRouter>
//     <FluentProvider theme={webLightTheme}>
//       <ConfigAppProvider>
//         <PartitionsProvider>
//           <ToastContainer />
//           <App />
//         </PartitionsProvider>
//       </ConfigAppProvider>
//     </FluentProvider>
//   </BrowserRouter>
// );
// main.tsx
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ToastContainer } from 'react-toastify';
import { ConfigAppProvider } from './providers/AppConfig.tsx';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { PartitionsProvider } from './providers/PartitionsContext.tsx';

createRoot(document.getElementById('root')!).render(
  <ConfigAppProvider>
    <FluentProvider theme={webLightTheme}>
      <PartitionsProvider>
        <HashRouter>
          <App />
          <ToastContainer />
        </HashRouter>
      </PartitionsProvider>
    </FluentProvider>
  </ConfigAppProvider>
);
