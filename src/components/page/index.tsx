import content from '../../content.json';
import CardList from '../card-list';
import Content from '../content';

function Page({ path }) {
  let data = content.pages[path];
  if (!data) {
    data = content.pages['*'];
  }

  // Set the page title based on `content.json` (with an asterisk representing the site title).
  document.title = data.title ? data.title.replace('*', content.title) : content.title;

  return (
    <article className='Page'>
      {data.content.map((key: string) => <Content key={key} path={key} />)}
      <CardList path={path}></CardList>
    </article>
  );
}

export default Page;
