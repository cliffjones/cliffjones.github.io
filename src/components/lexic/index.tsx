import React, { useCallback, useEffect, useState } from 'react';
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

  // Determine which voaculary lists to use.
  // TODO: Make this URL-dependent.
  useEffect(() => {
    setDictPaths([
      'basics-en',
      'basics-alo',
      'basics-yili',
      'basics-yomba',
      'basics-calda',
      'basics-gowee',
    ]);
  }, []);

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
    if (!query || !dictPaths.length) {
      setResults([]);
      return;
    }
    const isComplete = dictPaths.reduce((acc, dictPath) => acc && dicts[dictPath], true);
    if (!isComplete) {
      setResults([]);
      return;
    }

    const resultsFromDicts = dictPaths.map(dictPath => getResults(query, dicts[dictPath]));
    const newResults = union(...resultsFromDicts);
    if (newResults.length > MAX_RESULTS) {
      newResults.length = MAX_RESULTS;
    }
    setResults(newResults);
  }, [dictPaths, dicts, query]);

  // Whenever the query field is edited, wait for the typing to stop, then update.
  const onQueryChange: React.ChangeEventHandler = useCallback((event) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const target = event?.target as HTMLInputElement;
      if (target?.value != null) {
        setQuery(target.value.toLocaleLowerCase().trim().replace(/\s\s+/g, ' '));
      }
    }, config.delays.debounceTyping);
  }, []);

  // Convert the fetched results to JSX, skipping any incomplete items.
  const resultsEls = results.map((id: string) => {
    const isComplete = dictPaths.reduce((acc, dictPath) => acc && dicts[dictPath][id], true);
    if (!isComplete) {
      return <></>;
    }

    return <li key={id} className={`${BASE_CLASS}-item`}>
      <ol>
        {dictPaths.map(dictPath => {
          return <li key={`${id}_${dictPath}`} className={`${BASE_CLASS}-cell`}>
            {dicts[dictPath][id].forms.join(' / ')}
          </li>;
        })}
      </ol>
    </li>;
  });

  // Build the component.
  return <div className={BASE_CLASS}>
    <input className={`${BASE_CLASS}-query`} type='search' onChange={onQueryChange} />
    {resultsEls.length
      ? <ol className={`${BASE_CLASS}-results`}>{resultsEls}</ol>
      : <></>
    }
  </div>;
}

export default Lexic;
