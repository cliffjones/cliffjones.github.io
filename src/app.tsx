import { Route, Routes } from 'react-router-dom';

import './app.scss';
import Header from './components/header';
import Footer from './components/footer';
import Page from './components/page';
import ImageSearch from './components/image-search';

import artPath from './content/art.md';
import codingPath from './content/coding.md';
import languageStudyPath from './content/language-study.md';
import linguisticsPath from './content/linguistics.md';
import mirrormazeBlurbPath from './content/mirrormaze-blurb.md';
import missingPath from './content/missing.md';
import socialPath from './content/social.md';
import welcomePath from './content/welcome.md';
import writingPath from './content/writing.md';

const routes = {
  art: [artPath],
  coding: [codingPath],
  language: [languageStudyPath, linguisticsPath],
  social: [socialPath],
  writing: [writingPath],
};

function App() {
  return (
    <div className='App'>
      <Header />
      <main className='App-main'>
        <Routes>
          <Route index element={<Page paths={[welcomePath, mirrormazeBlurbPath]} />} />
          {Object.keys(routes).map((key) => (
            <Route
              key={key}
              path={`/${key}`}
              element={<Page paths={routes[key]} />}
            />
          ))}
          <Route path='/image-search' element={<ImageSearch />} />
          <Route path='*' element={<Page paths={[missingPath]} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
