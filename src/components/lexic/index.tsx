import React, { useEffect, useState } from 'react';
import axios from 'axios';
import compact from 'lodash/compact';
import union from 'lodash/union';

import './index.scss';
import config from '../../config.json';

const BASE_CLASS = 'Lexic';
const MAX_RESULTS = 100;

let searchTimer: ReturnType<typeof setTimeout>;

function getResults(query: string, dict: any) {
  const results: any[][] = [];
  Object.keys(dict).forEach((id: string) => {
    const haystack = dict[id].forms.join('  ');
    if (haystack.includes(query)) {
      if (!results[haystack.length]) {
        results[haystack.length] = [];
      }
      results[haystack.length].push(id);
    }
  });
  return compact([].concat.apply([], results));
}

function Lexic() {
  const [dictPaths, setDictPaths] = useState<string[]>([]);
  const [dicts, setDicts] = useState<any>({});
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);

  // TODO: Make this URL-dependent.
  useEffect(() => {
    setDictPaths(['basics-en', 'basics-alo']);
  }, []);

  const onQueryChange: React.ChangeEventHandler = (event) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const target = event?.target as HTMLInputElement;
      if (target?.value != null) {
        setQuery(target.value.toLocaleLowerCase().trim().replace(/\s\s+/g, ' '));
      }
    }, config.delays.debounceTyping);
  }

  // Load the specified vocabulary lists.
  useEffect(() => {
    if (dictPaths.length < 2) {
      return;
    }

    dictPaths.forEach(dictPath => {
      if (!dicts[dictPath]) {
        axios.get(`/lexic/${dictPath}.json`)
          .then((response) => {
            const newDicts = {...dicts};
            newDicts[dictPath] = response.data;
            setDicts(newDicts);
          });
      }
    });
  }, [dictPaths, dicts]);

  useEffect(() => {
    if (!query || dictPaths.length < 2 || !dicts[dictPaths[0]] || !dicts[dictPaths[1]]) {
      setResults([]);
      return;
    }

    const newResults = union(
      getResults(query, dicts[dictPaths[0]]),
      getResults(query, dicts[dictPaths[1]]),
    );
    if (newResults.length > MAX_RESULTS) {
      newResults.length = MAX_RESULTS;
    }
    setResults(newResults);
  }, [dictPaths, dicts, query]);

  // Convert the fetched results to JSX, skipping any items without both sides.
  const resultsEls = results.map((id: string) => dicts[dictPaths[0]][id] && dicts[dictPaths[1]][id]
    ? <li key={id} className={`${BASE_CLASS}-item`}>
      <span className={`${BASE_CLASS}-cell`}>{dicts[dictPaths[0]][id].forms.join(' / ')}</span>
      <span className={`${BASE_CLASS}-cell`}>{dicts[dictPaths[1]][id].forms.join(' / ')}</span>
    </li>
    : <></>
  );

  return <div className={BASE_CLASS}>
    <input className={`${BASE_CLASS}-query`} type='search' onChange={onQueryChange} />
    {resultsEls.length
      ? <ol className={`${BASE_CLASS}-results`}>{resultsEls}</ol>
      : <></>
    }
  </div>;
}

export default Lexic;
