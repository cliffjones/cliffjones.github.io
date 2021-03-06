import { NavLink } from 'react-router-dom';

import './index.scss';
import content from '../../content.json';
import Icon from '../icon';

function Footer() {
  const { start, owner } = content.copyright;
  const currentYear = (new Date()).getFullYear();

  return (
    <footer className='Footer'>
      <div className='Footer-icons'>
        <Icon
          name='facebook'
          hint='Facebook'
          action='http://www.facebook.com/mrcliffjonesjr'
        />
        <Icon
          name='twitter'
          hint='Twitter'
          action='http://twitter.com/cliffjonesjr'
        />
        <Icon
          name='instagram'
          hint='Instagram'
          action='http://instagram.com/cliffjonesjr'
        />
        <Icon
          name='amazon'
          hint='Amazon'
          action='https://www.amazon.com/Cliff-Jones-Jr./e/B08LF1PBFY'
        />
        <Icon
          name='wattpad'
          hint='Wattpad'
          action='http://www.wattpad.com/user/CliffJonesJr'
        />
        <Icon
          name='goodreads'
          hint='Goodreads'
          action='https://www.goodreads.com/cliffjones'
        />
      </div>

      <div className='Footer-copyright'>
        © {start}–{currentYear} <NavLink to='/'>{owner}</NavLink>
      </div>
    </footer>
  );
}

export default Footer;
