import { Link } from 'react-router-dom';

import './index.scss';

const BASE_CLASS = 'Card';

function Card({
  path,
  title = '',
  text = '',
  color = '',
}) {
  let className = BASE_CLASS;
  if (color) {
    className = `${className} ${BASE_CLASS}--${color}`;
  }
  return (
    <Link to={`/${path}`} className={className}>
      {title ? <div className={`${BASE_CLASS}-title`}>{title}</div> : ''}
      {text ? <div className={`${BASE_CLASS}-text`}>{text}</div> : ''}
    </Link>
  );
}

export default Card;
