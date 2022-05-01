import Content from '../content';

function Page({ paths }) {
  return (<>
    {paths.map((path: string) => <Content key={path} path={path} />)}
  </>);
}

export default Page;
