import './index.scss';
import content from '../../content.json';

function Footer() {
  const { start, owner } = content.copyright;
  const currentYear = (new Date()).getFullYear();
  return (
    <footer className='Footer'>
      <div className='Footer-copyright'>
        © {start}–{currentYear} <a href='/social'>{owner}</a>
      </div>
    </footer>
  );
}

export default Footer;
