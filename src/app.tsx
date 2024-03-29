import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import './app.scss';
import content from './content.json';
import Header from './components/header';
import Footer from './components/footer';
import Page from './components/page';
import Lexic from './components/lexic';
import Quotes from './components/quotes';
import Ticker from './components/ticker';
import ImageSearch from './components/image-search';

// Hook to call a given function when the browser location changes.
function useLocationChange(locationChangeHandler: Function) {
  const location = useLocation();
  useEffect(() => locationChangeHandler(location), [location, locationChangeHandler]);
}

// Smoothly scrolls to a given element if its ID is found in the DOM.
function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

function App() {
  useLocationChange((location: Location) => {
    const hash = location.hash.slice(1);
    if (hash) {
      // TODO: Wait for a global `loading` state to change instead of using this delay.
      setTimeout(() => scrollToId(hash), 200);
    }
  });

  return (
    <div className="App">
      <Header />
      <main className="App-main">
        <Routes>
          {Object.keys(content.pages).map((path) => (
            <Route key={path} path={`/${path}`} element={<Page path={path} />} />
          ))}
          <Route path="/lexic" element={<Lexic />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/ticker" element={<Ticker />} />
          <Route path="/image-search" element={<ImageSearch />} />

          {/* Redirect old paths. */}
          <Route path="/asl/writing" element={<Navigate to="/rasl" replace />} />
          <Route path="/dreampunk/anthology" element={<Navigate to="/mirrormaze" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
