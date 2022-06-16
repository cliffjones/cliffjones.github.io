import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
// import reportWebVitals from './report-web-vitals';

import './index.scss';
import App from './app';
import reducer from './store/reducer';

const store = configureStore({ reducer });

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

// Report analytics. Learn more at `https://bit.ly/CRA-vitals`.
// TODO: https://www.simoahava.com/analytics/track-core-web-vitals-in-ga4-with-google-tag-manager/
// reportWebVitals(console.log);
