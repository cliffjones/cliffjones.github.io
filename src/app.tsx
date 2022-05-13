import { Route, Routes } from 'react-router-dom';

import './app.scss';
import content from './content.json';
import Header from './components/header';
import Footer from './components/footer';
import Page from './components/page';
import ImageSearch from './components/image-search';

function App() {
  const { pages } = content;

  return (
    <div className='App'>
      <Header />
      <main className='App-main'>
        <Routes>
          <Route index element={<Page paths={['welcome', 'mirrormaze-blurb']} />} />
          {Object.keys(pages).map((key) => (
            <Route key={key} path={`/${key}`} element={<Page paths={pages[key]} />} />
          ))}
          <Route path='/image-search' element={<ImageSearch />} />
          <Route path='*' element={<Page paths={['missing']} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
