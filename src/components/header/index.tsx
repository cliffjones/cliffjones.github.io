import './index.scss';
import content from '../../content.json';

function Header() {
  return (
    <header className='Header'>
      <h1 className='Header-title'><a href='/'>{content.title}</a></h1>
    </header>
  );
}

export default Header;
