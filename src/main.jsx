import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './style.css';

const root = document.getElementById('root');

if (root) {
  const tree = (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // The build prerenders every route to static HTML, so on the first load we
  // hydrate that markup. If the root is empty (dev server, or a fallback), mount
  // a fresh client tree instead.
  if (root.childNodes.length > 0) {
    hydrateRoot(root, tree);
  } else {
    createRoot(root).render(tree);
  }
}
