import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.scss';
import App from './app';
import reportWebVitals from './report-web-vitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Report analytics. Learn more at `https://bit.ly/CRA-vitals`.
reportWebVitals(console.log);
