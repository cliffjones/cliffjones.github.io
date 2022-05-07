import { NavLink } from 'react-router-dom';

import './index.scss';
import content from '../../content.json';
import Icon from '../icon';

function Header() {
  return (
    <header className='Header'>
      <h1 className='Header-title'>
        <NavLink to='/'>{content.title}</NavLink>
      </h1>

      <nav className='Header-icons'>
        <Icon
          name='keyboard'
          hint='Coding'
          action='/coding'
          color='blue'
          nav={true}
        />
        <Icon
          name='note'
          hint='Writing'
          action='/writing'
          color='brown'
          nav={true}
        />
        <Icon
          name='speech'
          hint='Language'
          action='/language'
          color='green'
          nav={true}
        />
        <Icon
          name='eye'
          hint='Art'
          action='/art'
          color='purple'
          nav={true}
        />
      </nav>
    </header>
  );
}

export default Header;
