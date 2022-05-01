import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// import reportWebVitals from './report-web-vitals';

import './index.scss';
import App from './app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Report analytics. Learn more at `https://bit.ly/CRA-vitals`.
// TODO: https://www.simoahava.com/analytics/track-core-web-vitals-in-ga4-with-google-tag-manager/
// reportWebVitals(console.log);
