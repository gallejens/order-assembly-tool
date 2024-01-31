import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

import '@mantine/core/styles.css';
import './styles/main.scss';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
