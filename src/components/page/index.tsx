import content from '../../content.json';
import CardList from '../card-list';
import Content from '../content';

function Page({ path }) {
  const data = content.pages?.[path];
  if (!data) {
    return null;
  }

  return (
    <article className='Page'>
      {data.content.map((key: string) => <Content key={key} path={key} />)}
      <CardList path={path}></CardList>
    </article>
  );
}

export default Page;
