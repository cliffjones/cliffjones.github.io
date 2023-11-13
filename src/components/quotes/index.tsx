import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import './index.scss';
import config from '../../config.json';

const BASE_CLASS = 'Quotes';
const KEY_LENGTH = 100;
const MAX_RESULTS = 100;

let searchTimer: ReturnType<typeof setTimeout>;

function makeSimple(text: string) {
  return text.toLocaleLowerCase().replace(/[^a-z]+/g, ' ').trim();
}

function makeKey(text: string) {
  return makeSimple(text).replace(/\s+/g, '').slice(0, KEY_LENGTH);
}

function getResults(query: string, dict: any[]) {
  const simpleQuery = makeSimple(query);
  if (!simpleQuery) {
    return [];
  }

  const results: any[] = [];
  dict.forEach((item: any) => {
    const itemObject = typeof item === 'string' ? { text: item } : item;
    const haystackText = makeSimple(itemObject?.text ?? '');
    if (!haystackText) {
      return;
    }
    let haystackTags = makeSimple(itemObject?.tags ?? '');
    if (haystackTags) {
      haystackTags = `  ${haystackTags}  ${haystackTags}  ${haystackTags}`;
    }
    const haystack = `${haystackText}${haystackTags}`;
    const score = (haystack.match(new RegExp(query, 'g')) || []).length / haystack.length;
    if (score) {
      itemObject.score = score;
      results.push(itemObject);
    }
  });
  results.sort((a, b) => b.score - a.score);
  return results;
}

function Quotes() {
  const [dictPaths, setDictPaths] = useState<string[]>([]);
  const [dicts, setDicts] = useState<any>({});
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);

  // Determine which quote lists to use.
  // TODO: Make this URL-dependent.
  useEffect(() => {
    setDictPaths([
      'pkd',
    ]);
  }, []);

  // Load the specified quote lists.
  useEffect(() => {
    if (dictPaths.length < 1) {
      return;
    }

    dictPaths.forEach(dictPath => {
      if (!dicts[dictPath]) {
        axios.get(`/quotes/${dictPath}.json`)
          .then((response) => {
            const newDicts = { ...dicts };
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

    const dict = dictPaths.reduce((acc, dictPath) => [...acc, ...dicts[dictPath]], []);
    const newResults = getResults(query, dict);
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
  const resultsEls = results.map((item: any) => {
    return <li key={makeKey(item.text)} className={`${BASE_CLASS}-item`}>
      “{item.text}”
      {item.source ? <small>{` (${item.source})`}</small> : ''}
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

export default Quotes;
