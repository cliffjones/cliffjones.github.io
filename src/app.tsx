import { Routes, Route } from 'react-router-dom';

import './app.scss';
import Header from './components/header';
import Footer from './components/footer';
import Page from './components/page';
import Content from './components/content';
import ImageSearch from './components/image-search';
import welcomePath from './content/welcome.md';
import mirrormazeBlurbPath from './content/mirrormaze-blurb.md';
import socialPath from './content/social.md';
import missingPath from './content/missing.md';

function App() {
  return (
    <div className='App'>
      <Header />

      <main>
        <Routes>
          <Route index element={<Page paths={[welcomePath, mirrormazeBlurbPath]} />} />
          <Route path='/social' element={<Content path={socialPath} />} />
          <Route path='*' element={<Content path={missingPath} />} />
          <Route path='/image-search' element={<ImageSearch />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
