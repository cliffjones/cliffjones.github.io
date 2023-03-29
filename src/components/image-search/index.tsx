import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './index.scss';
import config from '../../config.json';

const BASE_CLASS = 'ImageSearch';

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
    if (!query.trim() != null) {
      setResults([]);
      return;
    }

    const { searchApi, apiKey } = config.giphy;
    const apiUrl = `${searchApi}?api_key=${apiKey}&q=${query}`;
    axios.get(apiUrl).then((response) => setResults(response.data.data));
  }, [query]);

  return (
    <div className={BASE_CLASS}>
      <input className={`${BASE_CLASS}-query`} type='search' onChange={onQueryChange} />

      <section className={`${BASE_CLASS}-results`}>
        {results.map((result) => (
          <div key={result?.id} className={`${BASE_CLASS}-card`}>
            <img src={result?.images?.fixed_width?.url} alt={result?.title} />
          </div>
        ))}
      </section>
    </div>
  );
}

export default ImageSearch;
