import './index.scss';
import content from '../../content.json';
import Card from '../card';

function CardList({ path }) {
  // Skip card list generation if the page has no entry in `nav`.
  const nav = content.nav?.[path] || [];
  if (!nav.length) {
    return;
  }

  const { cards } = content;

  return (
    <nav className='CardList'>
      <ul>
        {nav.map((key: string) => {
          const card = cards?.[key];
          if (!card) {
            return null;
          }

          const {
            title = '',
            text = '',
            color = '',
          } = card;
          return (
            <li key={key}>
              <Card path={key} title={title} text={text} color={color} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default CardList;
