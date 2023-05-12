import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import './index.scss';

const BASE_CLASS = 'Outline';

function Outline({ mod = '' }) {
  const [loading, setLoading] = useState<boolean>(true);

  // TODO: Rather than using a timeout to make sure the page is loaded, set a store flag.
  useEffect(() => {
    setTimeout(() => setLoading(false), 200);
  }, []);

  const listRef = useRef();

  let className = BASE_CLASS;
  if (mod) {
    className = `${className} ${BASE_CLASS}--${mod}`;
  }

  let headings = [];
  if (!loading && listRef.current) {
    // TODO: This should be able to work with H2s and optionally H4s as well.
    const listEl = listRef.current as Element;
    headings = Array.from(listEl.parentNode.querySelectorAll('h3'));
  }

  return (
    <ol className={className} ref={listRef}>
      {headings.map((node: any) => {
        let label = node.innerText.trim();
        if (label.endsWith('#')) {
          label = label.slice(0, -2);
        }
        return <li key={node.id}><Link to={`#${node.id}`}>{label}</Link></li>;
      })}
    </ol>
  );
}

export default Outline;
