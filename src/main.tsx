import './instrumentation.ts'; // Inicializa o OpenTelemetry primeiro
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // Importa o seu conversor

// Diz ao React para renderizar o componente <App /> dentro da div com id "root"
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

console.log('[React] Renderização inicial executada!');