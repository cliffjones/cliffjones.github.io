import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
// import remarkAttr from 'remark-attr';

import './app.scss';
import content from './content.json';
import config from './config.json';
import welcomePath from './content/cliff-welcome.md';

// Add a given class to a supplied props object.
function addClassName(props: any, className: string) {
  props.className = props.className ? `${props.className} ${className}` : className;
}

const mdConfig: any = {
  // Demote headings one level to let Markdown files be more stand-alone.
  h1: 'h2',
  h2: 'h3',
  h3: 'h4',
  h4: 'h5',
  h5: 'h6',

  // Customize links.
  a: ({ node, children, ...props }) => {
    const newChildren = Array.isArray(children) ? [...children] : [children];
    const newProps = { ...props };
    addClassName(newProps, 'Content-link');

    // Make links starting with "+" open in a new tab.
    if (children[0]?.[0] === '+') {
      newChildren[0] = newChildren[0].substr(1);
      newProps.target = '_blank';
      newProps.rel = 'noopener';
      addClassName(newProps, 'Content-link--external');
    }

    return <a {...newProps}>{newChildren}</a>;
  },

  // Customize images.
  img: ({ node, ...props }) => {
    const newProps = { ...props };
    addClassName(newProps, 'Content-image');

    // Make images progressive when alternates are specified.
    if (newProps.src.includes('?')) {
      // Remove the alternate image specs from the `src` attribute.
      const srcChunks: string[] = newProps.src.split('?', 2);
      newProps.src = srcChunks[0];

      // Extract a base file name with no extension or size.
      let baseSrc: string = newProps.src;
      if (baseSrc.includes('.') || baseSrc.includes('_')) {
        baseSrc = baseSrc.split(/(_|\.)/, 2)[0];
      }

      // Compile a `srcset` value from the alternate images.
      const setChunks: string[] = srcChunks.pop().split(',');
      for (let i: number = 0; i < setChunks.length; i++) {
        const chunk: string = setChunks[i];
        const width: number = parseInt(chunk, 10);
        setChunks[i] = `${baseSrc}_${chunk} ${width}w`;
      }
      newProps.srcSet = setChunks.join();

      // Assume images might be around half the screen width.
      newProps.sizes = '50vw';
    }

    return <img {...newProps} />;
  },
};

let searchTimer: ReturnType<typeof setTimeout>;

function App() {
  const [mdContent, setMdContent] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    axios.get(welcomePath)
      .then((response) => setMdContent(response.data));
  }, []);

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
      <h1 className='App-title'>{content.title}</h1>

      <main className='Content'>
        <ReactMarkdown
          children={mdContent}
          components={mdConfig} // Customize how certain tags are handled.
          remarkPlugins={[
            remarkGfm, // Use GitHub-Flavored Markdown.
            // remarkAttr, // Add curly-brace syntax to allow attribute setting.
          ]}
          rehypePlugins={[
            rehypeRaw, // Enable embedded HTML.
          ]}
        />
      </main>

      <hr />

      <input
        type='search'
        onChange={onSearchChange}
      />

      <section className='App-results'>
        {results.map((result) => (
          <div key={result?.id} className='App-card'>
            <img src={result?.images?.fixed_width?.url} alt={result?.title} />
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
