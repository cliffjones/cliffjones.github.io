import { Routes, Route } from 'react-router-dom';

import './app.scss';
import content from './content.json';
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
      <h1 className='App-title'><a href='/'>{content.title}</a></h1>

      <main>
        <Routes>
          <Route index element={<Page paths={[welcomePath, mirrormazeBlurbPath]} />} />
          <Route path='/social' element={<Content path={socialPath} />} />
          <Route path='*' element={<Content path={missingPath} />} />
          <Route path='/image-search' element={<ImageSearch />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
