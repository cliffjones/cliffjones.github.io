import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './index.scss';
import config from '../../config.json';

let searchTimer: ReturnType<typeof setTimeout>;

function ImageSearch() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);

  const onQueryChange: React.ChangeEventHandler = (event) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const target = event?.target as HTMLInputElement;
      if (target?.value) {
        setQuery(target.value.toLocaleLowerCase());
      }
    }, config.delays.debounceTyping);
  }

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const { searchApi, apiKey } = config.giphy;
    const apiUrl = `${searchApi}?api_key=${apiKey}&q=${query}`;
    axios.get(apiUrl).then((response) => setResults(response.data.data));
  }, [query]);

  return (
    <div className='ImageSearch'>
      <input className='ImageSearch-query' type='search' onChange={onQueryChange} />

      <section className='ImageSearch-results'>
        {results.map((result) => (
          <div key={result?.id} className='ImageSearch-card'>
            <img src={result?.images?.fixed_width?.url} alt={result?.title} />
          </div>
        ))}
      </section>
    </div>
  );
}

export default ImageSearch;
