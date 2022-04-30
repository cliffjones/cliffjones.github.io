import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
// import remarkAttr from 'remark-attr';

import './index.scss';

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
  if (newProps.alt.startsWith('+')) {
    addClassName(newProps, `Content-image--no-max`);
    newProps.alt = newProps.alt.slice(1);
  }
  if (newProps.alt.startsWith('-')) {
    addClassName(newProps, `Content-image--no-border`);
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

function Content({ path }) {
  const [mdContent, setMdContent] = useState<string>('');

  useEffect(() => {
    axios.get(path)
      .then((response) => setMdContent(response.data));
  }, []);

  return (
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
  );
}

export default Content;
