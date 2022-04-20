import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import './App.scss';
import welcomePath from './welcome.md';

function App() {
  const [mdContent, setMdContent] = useState('');
  axios.get(welcomePath)
    .then((response) => setMdContent(response.data));

  return (
    <div className="App">
      <main className="App-content">
        <ReactMarkdown children={mdContent} remarkPlugins={[remarkGfm]} />
      </main>
    </div>
  );
}

export default App;
