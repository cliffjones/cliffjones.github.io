import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './app.scss';
import content from './content.json';
import config from './config.json';
import Page from './components/page';
import Content from './components/content';
import welcomePath from './content/welcome.md';
import mirrormazeBlurbPath from './content/mirrormaze-blurb.md';
import socialPath from './content/social.md';
import missingPath from './content/missing.md';

let searchTimer: ReturnType<typeof setTimeout>;

// The base component for the site.
function App() {
  const [searchText, setSearchText] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);

  const onSearchChange: React.ChangeEventHandler = (event) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const target = event?.target as HTMLInputElement;
      if (target?.value) {
        setSearchText(target.value.toLocaleLowerCase());
      }
    }, config.typingDebounceDelay);
  }

  useEffect(() => {
    if (!searchText.trim()) {
      return;
    }

    const { searchApi, apiKey } = config;
    const apiUrl = `${searchApi}?api_key=${apiKey}&q=${searchText}`;
    axios.get(apiUrl)
      .then((response) => {
        return setResults(response.data.data);
      });
  }, [searchText]);

  return (
    <div className='App'>
      <h1 className='App-title'><a href='/'>{content.title}</a></h1>

      <main>
        <BrowserRouter>
          <Routes>
            <Route index element={<Page paths={[welcomePath, mirrormazeBlurbPath]} />} />
            <Route path='social' element={<Content path={socialPath} />} />
            <Route path='*' element={<Content path={missingPath} />} />
          </Routes>
        </BrowserRouter>

        {/* <input type='search' onChange={onSearchChange} /> */}

        <section className='App-results'>
          {results.map((result) => (
            <div key={result?.id} className='App-card'>
              <img src={result?.images?.fixed_width?.url} alt={result?.title} />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
