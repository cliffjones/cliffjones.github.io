import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import './App.css';

import logo from './logo.svg';
import welcomePath from './welcome.md';

function App() {
  const [mdContent, setMdContent] = useState('');

  fetch(welcomePath)
    .then((response) => response.text())
    .then((content) => setMdContent(content));

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ReactMarkdown children={mdContent} remarkPlugins={[remarkGfm]} />
      </header>
    </div>
  );
}

export default App;
