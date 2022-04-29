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

// Adds a given class to a supplied props object.
function addClassName(props: any, className: string) {
  props.className = props.className ? `${props.className} ${className}` : className;
}

// Customizes heading formatting in Markdown content.
function formatHeading({ node, children, ...props }) {
  const newProps = { ...props };
  delete newProps.level; // Remove this auto-generated non-standard attribute.
  addClassName(newProps, 'Content-heading');

  // Demote headings one level to let Markdown files be more stand-alone.
  let level = parseInt(node.tagName[node.tagName.length - 1], 10);
  if (level === 1) {
    return <h2 {...newProps}>{children}</h2>;
  }
  if (level === 2) {
    return <h3 {...newProps}>{children}</h3>;
  }
  if (level === 3) {
    return <h4 {...newProps}>{children}</h4>;
  }
  if (level === 4) {
    return <h5 {...newProps}>{children}</h5>;
  }
  return <h6 {...newProps}>{children}</h6>;
}

// Customizes link formatting in Markdown content.
function formatLink({ node, children, ...props }) {
  const newChildren = Array.isArray(children) ? [...children] : [children];
  const newProps = { ...props };
  addClassName(newProps, 'Content-link');

  // Make links starting with "+" open in a new tab.
  console.log('newChildren', typeof newChildren, newChildren);
  if (typeof newChildren?.[0] === 'string' && newChildren[0].startsWith('+')) {
    newChildren[0] = newChildren[0].slice(1);
    newProps.target = '_blank';
    newProps.rel = 'noopener';
    addClassName(newProps, 'Content-link--external');
  }

  return <a {...newProps}>{newChildren}</a>;
}

// Customizes image formatting in Markdown content.
function formatImage({ node, ...props }) {
  const newProps = { ...props };
  addClassName(newProps, 'Content-image');

  // Add an alignment class based on special starting characters in the alt text.
  let alignment = '';
  if (newProps.alt.startsWith('<')) {
    alignment = 'left';
  } else if (newProps.alt.startsWith('>')) {
    alignment = 'right';
  } else if (newProps.alt.startsWith('^')) {
    alignment = 'center';
  }
  if (alignment) {
    addClassName(newProps, `Content-image--${alignment}`);
    newProps.alt = newProps.alt.slice(1);
  }

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

    // Assume images might be most of the screen width.
    newProps.sizes = '90vw';
  }

  return <img {...newProps} />;
}

const mdConfig: any = {
  h1: formatHeading,
  h2: formatHeading,
  h3: formatHeading,
  h4: formatHeading,
  h5: formatHeading,
  a: formatLink,
  img: formatImage,
};

let searchTimer: ReturnType<typeof setTimeout>;

// The base component for the site.
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

      <main>
        <div className='Content'>
          <section className='Content-section'>
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
          </section>
        </div>

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
