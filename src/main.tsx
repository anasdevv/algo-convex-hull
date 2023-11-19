import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '../index.css';
import { ActiveStateProvider } from './Context.ts/ActiveContex.tsx';
import { DrawingProvider } from './Context.ts/DrawingContext.tsx';
import { LoadingProvider } from './Context.ts/LoadingContext.tsx';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ActiveStateProvider>
      <DrawingProvider>
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </DrawingProvider>
    </ActiveStateProvider>
  </React.StrictMode>
);
