import React, { FocusEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';

import './index.scss';
import characterTypes from './character-types.json';

const BASE_CLASS = 'NavWheel';
const LINK_CLASS = 'Content-link';

// Updates the selected navigation option.
function setCurrent(event: React.MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) {
  const button = event.target as HTMLElement;
  const wheel = (button.parentNode as HTMLElement).parentNode as HTMLElement;
  wheel.setAttribute('data-selected', button.dataset.id);
}

function NavWheel({ path }) {
  let data: any[];
  if (path === 'character-types') {
    data = characterTypes;
  } else {
    return null;
  }

  const randomId = data[Math.floor(Math.random() * data.length)].id;
  return (
    <nav
      className={BASE_CLASS}
      data-selected={randomId}
    >
      <div className={`${BASE_CLASS}-circle`}>
        {data.map((item: any, index: number) => (
          <button
            type="button"
            className={`${BASE_CLASS}-circle-node`}
            data-id={item.id}
            title={item.name}
            key={`${item.id}-node`}
            onClick={setCurrent}
            onFocus={setCurrent}
            onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
              const link = document.querySelector(
                `.${BASE_CLASS}-option[data-id='${item.id}'] .${LINK_CLASS}`,
              ) as HTMLElement;
              if (!link) {
                return;
              }

              if (event.key === 'Tab') {
                const nodes = document.querySelectorAll(`.${BASE_CLASS}-circle-node`);
                const pastTheEnd = (index === data.length - 1 && !event.shiftKey);
                const beforeTheStart = (index === 0 && event.shiftKey);
                if (pastTheEnd || beforeTheStart) {
                  event.preventDefault();
                  const node = (pastTheEnd ? nodes[0] : nodes[nodes.length - 1]) as HTMLElement;
                  node.focus();
                }
              } else if (event.key === 'ArrowDown') {
                link.focus();
              } else if (event.key === 'Enter' || event.key=== ' ') {
                link.dispatchEvent(new MouseEvent('click'));
              }
            }}
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
            <Link to={`#${item.id}-section`} className={LINK_CLASS}>{item.name}</Link>
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
