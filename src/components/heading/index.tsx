import React, { MouseEvent } from 'react';

import './index.scss';

const BASE_CLASS = 'Heading';
const ANCHOR_CLASS = `${BASE_CLASS}-anchor`;

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: number,
}

// Extracts all the text content of a given node, like `innerText`.
function getNodeText(node) {
  if (['string', 'number'].includes(typeof node)) {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(getNodeText).join(' ');
  }
  if (node && typeof node === 'object') {
    return getNodeText(node.props.children);
  }
  return '';
}

// Converts a given string into an alphanumeric kebab-case ID.
function textToId(text: string) {
  return text
    .toLocaleLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .trim()
    .replace(/ +/g, '-');
}

// Smoothly scrolls to a given element if its ID is found in the DOM.
function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Replaces the default behavior or page-internal links.
function anchorClick(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  const anchor = event.target as HTMLAnchorElement;
  window.history.pushState({}, '', anchor.href);
  scrollToId(anchor.hash.slice(1));
}

function Heading({ level = 1, children, ...props }: HeadingProps) {
  const newProps = { ...props };
  newProps.className = `${newProps.className} ${BASE_CLASS}`;

  const HeadingWithLevel = ({ ...passedProps }: React.HTMLAttributes<HTMLHeadingElement>) => {
    // Don't try to create heading tags at arbitrary levels.
    if (level < 1 || level > 6) {
      return <div {...passedProps}>{children}</div>;
    }

    if (level === 2 || level === 3) {
      const newPassedProps = { ...passedProps };
      const anchorId = newPassedProps.id || `${textToId(getNodeText(children))}-section`;
      newPassedProps.id = anchorId;

      return React.createElement(
        `h${level}`,
        newPassedProps,
        children,
        <>
          &nbsp;
          <a href={`#${anchorId}`} className={ANCHOR_CLASS} onClick={anchorClick}>#</a>
        </>,
      );
    }

    return React.createElement(`h${level}`, passedProps, children);
  };

  return <HeadingWithLevel {...newProps}>{children}</HeadingWithLevel>;
}

export default Heading;
