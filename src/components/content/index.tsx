import { Children, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import './index.scss';
import config from '../../config.json';
import { startLoading, stopLoading } from '../../store/reducer';
import Floravision from '../floravision';
import Heading from '../heading';
import Hexagraph from '../hexagraph';
import Icon from '../icon';
import Image from '../image';
import NavWheel from '../nav-wheel';
import Outline from '../outline';
import Stroboscope from '../stroboscope';

const BASE_CLASS = 'Content';
const LOADING_CLASS = `${BASE_CLASS}--loading`;
const HEADING_CLASS = `${BASE_CLASS}-heading`;
const BLOCK_CLASS = `${BASE_CLASS}-block`;
const BLOCK_LEFT_CLASS = `${BLOCK_CLASS}--left`;
const BLOCK_RIGHT_CLASS = `${BLOCK_CLASS}--right`;
const BLOCK_CENTER_CLASS = `${BLOCK_CLASS}--center`;
const LIST_CLASS = `${BASE_CLASS}-list`;
const QUOTE_CLASS = `${BASE_CLASS}-quote`;
const LINK_CLASS = `${BASE_CLASS}-link`;
const LINK_EXTERNAL_CLASS = `${LINK_CLASS}--external`;
const IMAGE_CLASS = `${BASE_CLASS}-image`;
const IMAGE_LEFT_CLASS = `${IMAGE_CLASS}--left`;
const IMAGE_RIGHT_CLASS = `${IMAGE_CLASS}--right`;
const IMAGE_CENTER_CLASS = `${IMAGE_CLASS}--center`;
const IMAGE_NO_BORDER_CLASS = `${IMAGE_CLASS}--no-border`;
const IMAGE_NO_MAX_CLASS = `${IMAGE_CLASS}--no-max`;
const TABLE_CLASS = `${BASE_CLASS}-table`;

// Adds a given class to a supplied props object.
function addClassName(props: any, className: string) {
  props.className = props.className ? `${props.className} ${className}` : className;
}

// Determines whether a given node is a string starting with a given character.
function nodeStartsWith(node: any, prefix: string) {
  return typeof node === 'string' && node.startsWith(prefix);
}

// Customizes heading formatting in Markdown content.
function formatHeading({ node, children, ...props }) {
  const newProps = { ...props };
  delete newProps.level; // Remove this auto-generated nonstandard attribute.
  addClassName(newProps, HEADING_CLASS);

  // Demote headings one level to let Markdown files be more stand-alone.
  const level = parseInt(node.tagName[node.tagName.length - 1], 10) + 1;

  return <Heading level={level} {...newProps}>{children}</Heading>;
}

// Customizes paragraph and figure formatting in Markdown content.
function formatBlock({ node, children, ...props }) {
  let newChildren = Children.toArray(children);
  if (!newChildren.length) {
    return <></>;
  }

  // Make sure the first child isn't an embedded component.
  const firstChild = (typeof newChildren[0] === 'object') ? newChildren[0] as any : null;
  if (firstChild?.props?.node?.tagName === 'del') {
    return <>{newChildren}</>;
  }

  // Handle the special case of block quotes (which must start with a quotation mark).
  const newProps = { ...props };
  addClassName(newProps, BLOCK_CLASS);

  // Align blocks starting with a left brace or a caret.
  const leftAlign = nodeStartsWith(newChildren[0], '{');
  const rightAlign = nodeStartsWith(newChildren[0], '}');
  const centerAlign = !leftAlign && nodeStartsWith(newChildren[0], '^');
  if (leftAlign || rightAlign || centerAlign) {
    if (leftAlign) {
      addClassName(newProps, BLOCK_LEFT_CLASS);
    } else if (rightAlign) {
      addClassName(newProps, BLOCK_RIGHT_CLASS);
    } else {
      addClassName(newProps, BLOCK_CENTER_CLASS);
    }
    newChildren[0] = (newChildren[0] as string).slice(1);
  }

  // If an exclamation point starts the block, this should be a figure.
  if (nodeStartsWith(newChildren[0], '!')) {
    newChildren[0] = (newChildren[0] as string).slice(1);

    // Find the first plain text child and start the caption there.
    const captionStart = newChildren.findIndex((el) => (typeof el === 'string' && el.trim()));
    return (
      <figure {...newProps}>
        {newChildren.slice(0, captionStart)}
        <figcaption>{newChildren.slice(captionStart)}</figcaption>
      </figure>
    );
  }

  return <p {...newProps}>{newChildren}</p>;
}

// Customizes list formatting in Markdown content.
function formatList({ node, children, ...props }) {
  if (!children.length) {
    return <></>;
  }

  const newProps = { ...props };
  delete newProps.ordered; // Remove this auto-generated nonstandard attribute.
  addClassName(newProps, LIST_CLASS);

  // Use the same basic class for ordered lists.
  const { tagName } = node;
  if (tagName === 'ol') {
    return <ol {...newProps}>{children}</ol>;
  }

  return <ul {...newProps}>{children}</ul>;
}

// Customizes block quote formatting in Markdown content.
function formatQuote({ node, children, ...props }) {
  const newProps = { ...props };
  addClassName(newProps, QUOTE_CLASS);

  return <blockquote {...newProps}>{children}</blockquote>;
}

// Customizes link formatting in Markdown content.
// TODO: Make flexible link component that handles smooth scrolling, etc.
function formatLink({ node, children, ...props }) {
  const newChildren = Children.toArray(children);
  if (!newChildren.length) {
    return <></>;
  }

  const newProps = { ...props };
  addClassName(newProps, LINK_CLASS);

  if (nodeStartsWith(newChildren[0], '+')) {
    // Make links starting with "+" open in a new tab.
    newChildren[0] = (newChildren[0] as string).slice(1);
    newProps.target = '_blank';
    newProps.rel = 'noopener';
    addClassName(newProps, LINK_EXTERNAL_CLASS);
  } else if (newProps.href.startsWith('#') || newProps.href.startsWith('/')) {
    // Use a Link component for page-/site-internal links.
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
  if (newProps.alt.startsWith('{')) {
    addClassName(newProps, IMAGE_LEFT_CLASS);
    newProps.alt = newProps.alt.slice(1);
  } else if (newProps.alt.startsWith('}')) {
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

// Customizes table formatting in Markdown content.
function formatTable({ node, children, ...props }) {
  const newProps = { ...props };
  addClassName(newProps, TABLE_CLASS);

  return <table {...newProps}>{children}</table>;
}

// Uses special syntax to drop in a specified component.
function addComponent({ node, children }) {
  if (children.length === 1 && typeof children[0] === 'string') {
    const command = children[0].split(' ');
    if (!command.length || !command[0]) {
      return <></>;
    }

    if (command.length > 1 && command[0] === 'floravision') {
      return <Floravision animation={command[1]} />;
    }
    if (command.length > 1 && command[0] === 'hexagraph') {
      return <Hexagraph triggerText={command.slice(1).join(' ')} />;
    }
    if (command.length > 1 && command[0] === 'icon') {
      return <Icon name={command[1]} />;
    }
    if (command.length > 1 && command[0] === 'nav-wheel') {
      return <NavWheel path={command[1]} />;
    }
    if (command[0] === 'outline') {
      return <Outline mod={command[1]} />;
    }
    if (command.length > 1 && command[0] === 'stroboscope') {
      return <Stroboscope triggerText={command.slice(1).join(' ')} />;
    }
  }
  return <></>;
}

const mdConfig: any = {
  h1: formatHeading,
  h2: formatHeading,
  h3: formatHeading,
  h4: formatHeading,
  h5: formatHeading,
  p: formatBlock,
  ul: formatList,
  ol: formatList,
  blockquote: formatQuote,
  a: formatLink,
  img: formatImage,
  table: formatTable,
  del: addComponent,
};

function Content({ path }) {
  const [mdContent, setMdContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Load the specified Markdown file.
  useEffect(() => {
    console.log('START', startLoading());
    axios.get(`/content/${path}.md`)
      .then((response) => {
        setMdContent(response.data);
        setLoading(false);
        console.log('STOP', stopLoading());
      });
  }, [path]);

  const className = `${BASE_CLASS} ${loading ? LOADING_CLASS : ''}`;
  return (
    <section className={className}>
      {loading
        ? <>
          <Icon name='spinner' />
          <Icon name='spinner' />
          <Icon name='spinner' />
        </>
        : <ReactMarkdown
          children={mdContent} // Use the asynchronously loaded Markdown content.
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
  );
}

export default Content;
