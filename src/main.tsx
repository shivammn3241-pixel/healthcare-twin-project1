import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { HealthTwinProvider } from './context/HealthTwinContext.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HealthTwinProvider>
      <App />
    </HealthTwinProvider>
  </React.StrictMode>,
);
