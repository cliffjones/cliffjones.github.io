import { Link } from 'react-router-dom';

import './index.scss';
import characterTypes from './character-types.json';

const BASE_CLASS = 'NavWheel';

function setCurrent(event) {
  const button = event.target;
  const { id } = button.dataset;
  const wheel = button.parentNode.parentNode;
  wheel.setAttribute('data-selected', id);
}

function NavWheel({ path }) {
  let data: any[];
  if (path === 'character-types') {
    data = characterTypes;
  } else {
    return null;
  }

  const randomId = data[Math.floor(Math.random() * data.length) + 1].id;
  return (
    <nav
      className={BASE_CLASS}
      data-selected={randomId}
    >
      <div className={`${BASE_CLASS}-circle`}>
        {data.map((item: any) => (
          <button
            type="button"
            className={`${BASE_CLASS}-circle-node`}
            data-id={item.id}
            title={item.name}
            key={`${item.id}-node`}
            onClick={setCurrent}
            onFocus={setCurrent}
          >{item.symbol}</button>
        ))}
      </div>

      {data.map((item: any) => (
        <section
          className={`${BASE_CLASS}-option`}
          data-id={item.id}
          key={`${item.id}-option`}
        >
          <div className={`${BASE_CLASS}-option-heading`}>
            <Link to={`#${item.id}-section`} className='Content-link'>{item.name}</Link>
          </div>
          <ul className={`${BASE_CLASS}-option-list`}>
            {item.details.map((text: string, index: number) => (
              <li className={`${BASE_CLASS}-option-list-item`} key={index}>{text}</li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}

export default NavWheel;
