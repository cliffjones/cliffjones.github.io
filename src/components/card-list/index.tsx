import './index.scss';
import content from '../../content.json';
import Card from '../card';

function CardList({ path }) {
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
          if (!title && !text) {
            return null;
          }

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
