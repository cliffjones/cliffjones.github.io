import './index.scss';
import content from '../../content.json';
import Icon from '../icon';

function Header() {
  return (
    <header className='Header'>
      <h1 className='Header-title'><a href='/'>{content.title}</a></h1>

      <div className='Header-icons'>
        <Icon
          name='keyboard'
          hint='Coding'
          action='https://cliffjonesjr.com/coding'
          color='blue'
        />
        <Icon
          name='note'
          hint='Writing'
          action='https://cliffjonesjr.com/writing'
          color='brown'
        />
        <Icon
          name='speech'
          hint='Language'
          action='https://cliffjonesjr.com/language'
          color='green'
        />
        <Icon
          name='eye'
          hint='Art'
          action='https://cliffjonesjr.com/art'
          color='purple'
        />
      </div>
    </header>
  );
}

export default Header;
