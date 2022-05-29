import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './index.scss';

const BASE_CLASS = 'Outline';

function Outline({ mod = '' }) {
  const [loading, setLoading] = useState<boolean>(true);

  // TODO: Rather than using a timeout to make sure the page is loaded, set a store flag.
  useEffect(() => {
    setTimeout(() => setLoading(false), 200);
  }, []);

  let className = BASE_CLASS;
  if (mod) {
    className = `${className} ${BASE_CLASS}--${mod}`;
  }

  let headings = [];
  if (!loading) {
    // TODO: This should be able to work with H2s and optionally H4s as well.
    headings = Array.from(document.querySelectorAll('h3'));
  }
  if (!headings?.length) {
    return null;
  }

  return (
    <ol className={className}>
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
