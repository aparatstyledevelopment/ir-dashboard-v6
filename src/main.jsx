import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/globals.css';

try {
  const saved = localStorage.getItem('cb-size');
  if (saved) document.body.classList.add(saved);
  const charts = localStorage.getItem('cb-charts');
  if (charts === 'pastel') document.body.classList.add('cb-charts-pastel');
} catch {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
