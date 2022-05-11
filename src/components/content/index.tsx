import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import './index.scss';
import config from '../../config.json';
import Icon from '../icon';
import Image from '../image';

const BASE_CLASS = 'Content';
const LOADING_CLASS = `${BASE_CLASS}--loading`;
const SECTION_CLASS = `${BASE_CLASS}-section`;
const HEADING_CLASS = `${BASE_CLASS}-heading`;
const BLOCK_CLASS = `${BASE_CLASS}-block`;
const BLOCK_CENTER_CLASS = `${BLOCK_CLASS}--center`;
const QUOTE_CLASS = `${BASE_CLASS}-quote`;
const LINK_CLASS = `${BASE_CLASS}-link`;
const LINK_EXTERNAL_CLASS = `${LINK_CLASS}--external`;
const IMAGE_CLASS = `${BASE_CLASS}-image`;
const IMAGE_LEFT_CLASS = `${IMAGE_CLASS}--left`;
const IMAGE_RIGHT_CLASS = `${IMAGE_CLASS}--right`;
const IMAGE_CENTER_CLASS = `${IMAGE_CLASS}--center`;
const IMAGE_NO_BORDER_CLASS = `${IMAGE_CLASS}--no-border`;
const IMAGE_NO_MAX_CLASS = `${IMAGE_CLASS}--no-max`;

// Adds a given class to a supplied props object.
function addClassName(props: any, className: string) {
  props.className = props.className ? `${props.className} ${className}` : className;
}

// Customizes heading formatting in Markdown content.
function formatHeading({ node, children, ...props }) {
  const newProps = { ...props };
  delete newProps.level; // Remove this auto-generated non-standard attribute.
  addClassName(newProps, HEADING_CLASS);

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
  addClassName(newProps, BLOCK_CLASS);

  // Center blocks starting with a caret.
  if (typeof newChildren?.[0] === 'string' && newChildren[0].startsWith('^')) {
    newChildren[0] = newChildren[0].slice(1);
    addClassName(newProps, BLOCK_CENTER_CLASS);
  }

  return <p {...newProps}>{newChildren}</p>;
}

// Customizes block quote formatting in Markdown content.
function formatQuote({ node, children, ...props }) {
  let newChildren = Array.isArray(children) ? [...children] : [children];
  const newProps = { ...props };
  addClassName(newProps, QUOTE_CLASS);

  return <blockquote {...newProps}>{newChildren}</blockquote>;
}

// Customizes link formatting in Markdown content.
function formatLink({ node, children, ...props }) {
  const newChildren = Array.isArray(children) ? [...children] : [children];
  const newProps = { ...props };
  addClassName(newProps, LINK_CLASS);

  if (typeof newChildren?.[0] === 'string' && newChildren[0].startsWith('+')) {
    // Make links starting with "+" open in a new tab.
    newChildren[0] = newChildren[0].slice(1);
    newProps.target = '_blank';
    newProps.rel = 'noopener';
    addClassName(newProps, LINK_EXTERNAL_CLASS);
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
  addClassName(newProps, IMAGE_CLASS);

  // Add an alignment class based on special starting characters in the alt text.
  if (newProps.alt.startsWith('<')) {
    addClassName(newProps, IMAGE_LEFT_CLASS);
    newProps.alt = newProps.alt.slice(1);
  } else if (newProps.alt.startsWith('>')) {
    addClassName(newProps, IMAGE_RIGHT_CLASS);
    newProps.alt = newProps.alt.slice(1);
  } else if (newProps.alt.startsWith('^')) {
    addClassName(newProps, IMAGE_CENTER_CLASS);
    newProps.alt = newProps.alt.slice(1);
  }
  if (newProps.alt.startsWith('-')) {
    addClassName(newProps, IMAGE_NO_BORDER_CLASS);
    newProps.alt = newProps.alt.slice(1);
  }
  if (newProps.alt.startsWith('+')) {
    addClassName(newProps, IMAGE_NO_MAX_CLASS);
    newProps.alt = newProps.alt.slice(1);
  }

  // Make the image progressive if an extensionless ID is specified.
  if (!newProps.src.includes('.')) {
    const { url, transform } = config.imageKit;
    newProps.loader = `${url}${newProps.src}${transform}100`;
    newProps.src = `${url}${newProps.src}${transform}auto`;
  }

  return <Image {...newProps} />;
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get(path).then((response) => {
      setMdContent(response.data);
      setLoading(false);
    });
  }, []);

  const className = `${BASE_CLASS} ${loading ? LOADING_CLASS : ''}`;
  return (
    <div className={className}>
      <section className={SECTION_CLASS}>
        {loading
          ? <>
            <Icon name='spinner' />
            <Icon name='spinner' />
            <Icon name='spinner' />
          </>
          : <ReactMarkdown
            children={mdContent}
            components={mdConfig} // Customize how certain tags are handled.
            remarkPlugins={[
              remarkGfm, // Use GitHub-Flavored Markdown.
            ]}
            rehypePlugins={[
              rehypeRaw, // Enable embedded HTML.
            ]}
          />
        }
      </section>
    </div>
  );
}

export default Content;
