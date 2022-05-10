import { Route, Routes } from 'react-router-dom';

import './app.scss';
import Header from './components/header';
import Footer from './components/footer';
import Page from './components/page';
import ImageSearch from './components/image-search';

import artPath from './content/art.md';
import codingPath from './content/coding.md';
import languagePath from './content/language.md';
import mirrormazeBlurbPath from './content/mirrormaze-blurb.md';
import missingPath from './content/missing.md';
import socialPath from './content/social.md';
import welcomePath from './content/welcome.md';
import writingPath from './content/writing.md';

function App() {
  return (
    <div className='App'>
      <Header />
      <main>
        <Routes>
          <Route index element={<Page paths={[welcomePath, mirrormazeBlurbPath]} />} />
          <Route path='/art' element={<Page paths={[artPath]} />} />
          <Route path='/coding' element={<Page paths={[codingPath]} />} />
          <Route path='/language' element={<Page paths={[languagePath]} />} />
          <Route path='/social' element={<Page paths={[socialPath]} />} />
          <Route path='/writing' element={<Page paths={[writingPath]} />} />
          <Route path='*' element={<Page paths={[missingPath]} />} />
          <Route path='/image-search' element={<ImageSearch />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
