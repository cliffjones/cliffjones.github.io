import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
// import remarkAttr from 'remark-attr';

import './index.scss';
import config from '../../config.json';

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

  // Make the image progressive if a simple file name is specified.
  if (!newProps.src.includes('/')) {
    const { url, transform, widths } = config.imageKit;
    newProps.src = `${url}${newProps.src}`;

    // Compile a `srcset` value from the available variants.
    const variants = [];
    for (let i: number = 0; i < widths.length; i++) {
      variants.push(`${newProps.src}${transform}${widths[i]} ${widths[i]}w`);
    }
    newProps.srcSet = variants.join(', ');
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
