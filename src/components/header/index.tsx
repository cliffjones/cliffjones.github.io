import { NavLink } from 'react-router-dom';

import './index.scss';
import content from '../../content.json';
import Icon from '../icon';

function Header() {
  const { title } = content;

  return (
    <header className='Header'>
      <h1 className='Header-title'>
        <NavLink to='/'>{title}</NavLink>
      </h1>

      <nav className='Header-icons'>
        <Icon
          name='keyboard'
          hint='Coding'
          action='/coding'
          color='blue'
        />
        <Icon
          name='note'
          hint='Writing'
          action='/writing'
          color='brown'
        />
        <Icon
          name='speech'
          hint='Language'
          action='/language'
          color='green'
        />
        <Icon
          name='eye'
          hint='Art'
          action='/art'
          color='purple'
        />
        <Icon
          name='lightbulb'
          hint='Ideas'
          action='/ideas'
          color='red'
        />
      </nav>
    </header>
  );
}

export default Header;
