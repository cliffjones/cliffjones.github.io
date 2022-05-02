import Content from '../content';

function Page({ paths }) {
  return (
    <div className='Page'>
      {paths.map((path: string) => <Content key={path} path={path} />)}
    </div>
  );
}

export default Page;
