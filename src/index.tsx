import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Init from './init';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Init />
  </React.StrictMode>
);
