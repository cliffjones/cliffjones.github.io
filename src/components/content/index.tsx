import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import './index.scss';
import config from '../../config.json';

const BASE_CLASS = 'Content';

// Adds a given class to a supplied props object.
function addClassName(props: any, className: string) {
  props.className = props.className ? `${props.className} ${className}` : className;
}

// Customizes heading formatting in Markdown content.
function formatHeading({ node, children, ...props }) {
  const newProps = { ...props };
  delete newProps.level; // Remove this auto-generated non-standard attribute.
  addClassName(newProps, `${BASE_CLASS}-heading`);

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

// Customizes paragraph formatting in Markdown content.
function formatBlock({ node, children, ...props }) {
  const newChildren = Array.isArray(children) ? [...children] : [children];
  const newProps = { ...props };
  addClassName(newProps, `${BASE_CLASS}-block`);

  // Center blocks starting with a caret.
  if (typeof newChildren?.[0] === 'string' && newChildren[0].startsWith('^')) {
    newChildren[0] = newChildren[0].slice(1);
    addClassName(newProps, `${BASE_CLASS}-block--center`);
  }

  return <p {...newProps}>{newChildren}</p>;
}

// Customizes block quote formatting in Markdown content.
function formatQuote({ node, children, ...props }) {
  let newChildren = Array.isArray(children) ? [...children] : [children];
  const newProps = { ...props };
  addClassName(newProps, `${BASE_CLASS}-quote`);

  return <blockquote {...newProps}>{newChildren}</blockquote>;
}

// Customizes link formatting in Markdown content.
function formatLink({ node, children, ...props }) {
  const newChildren = Array.isArray(children) ? [...children] : [children];
  const newProps = { ...props };
  addClassName(newProps, `${BASE_CLASS}-link`);

  if (typeof newChildren?.[0] === 'string' && newChildren[0].startsWith('+')) {
    // Make links starting with "+" open in a new tab.
    newChildren[0] = newChildren[0].slice(1);
    newProps.target = '_blank';
    newProps.rel = 'noopener';
    addClassName(newProps, `${BASE_CLASS}-link--external`);
  } else if (newProps.href.startsWith('/')) {
    // Use a Link component for relative paths.
    const path = newProps.href;
    delete newProps.href;
    return <Link to={path} {...newProps}>{newChildren}</Link>;
  }

  return <a {...newProps}>{newChildren}</a>;
}

// Customizes image formatting in Markdown content.
function formatImage({ node, ...props }) {
  const newProps = { ...props };
  addClassName(newProps, `${BASE_CLASS}-image`);

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
    addClassName(newProps, `${BASE_CLASS}-image--${alignment}`);
    newProps.alt = newProps.alt.slice(1);
  }
  if (newProps.alt.startsWith('+')) {
    addClassName(newProps, `${BASE_CLASS}-image--no-max`);
    newProps.alt = newProps.alt.slice(1);
  }
  if (newProps.alt.startsWith('-')) {
    addClassName(newProps, `${BASE_CLASS}-image--no-border`);
    newProps.alt = newProps.alt.slice(1);
  }

  // Make the image progressive if an extensionless ID is specified.
  if (!newProps.src.includes('.')) {
    const { url, transform, widths } = config.imageKit;

    // Make a copy of the image's props to create a loader image.
    const loaderProps = { ...newProps };
    addClassName(loaderProps, `${BASE_CLASS}-image--loading`);
    loaderProps.src = `${url}${newProps.src}${transform}100`;

    // Start the full image off hidden, but swap them out when this one loads.
    addClassName(newProps, `${BASE_CLASS}-image--hidden`);
    newProps.src = `${url}${newProps.src}${transform}auto`;
    // newProps.loading = 'lazy';
    newProps.onLoad = (event: Event) => {
      const el: HTMLElement = event.target as HTMLElement;
      const loaderEl: HTMLElement = el.previousSibling as HTMLElement;
      if (loaderEl) {
        loaderEl.parentNode.removeChild(loaderEl);
      }
      el.classList.remove(`${BASE_CLASS}-image--hidden`);
    };

    // Compile a `srcset` value from the available variants.
    const variants = [];
    for (let i: number = 0; i < widths.length; i++) {
      variants.push(`${url}${props.src}${transform}${widths[i]} ${widths[i]}w`);
    }
    newProps.srcSet = variants.join(', ');

    // Return both the loader and the full hidden image.
    return (<>
      <img {...loaderProps} />
      <img {...newProps} />
    </>);
  }

  return <img {...newProps} />;
}

const mdConfig: any = {
  h1: formatHeading,
  h2: formatHeading,
  h3: formatHeading,
  h4: formatHeading,
  h5: formatHeading,
  p: formatBlock,
  blockquote: formatQuote,
  a: formatLink,
  img: formatImage,
};

function Content({ path }) {
  const [mdContent, setMdContent] = useState<string>('');

  useEffect(() => {
    axios.get(path).then((response) => setMdContent(response.data));
  }, []);

  return (
    <div className={BASE_CLASS}>
      <section className={`${BASE_CLASS}-section`}>
        <ReactMarkdown
          children={mdContent}
          components={mdConfig} // Customize how certain tags are handled.
          remarkPlugins={[
            remarkGfm, // Use GitHub-Flavored Markdown.
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
