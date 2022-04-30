import Content from '../content';

function Page({ paths }) {
  return (<>
    {paths.map((path: string) => <Content path={path} />)}
  </>);
}

export default Page;
