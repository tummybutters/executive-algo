import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';

// Renders the full app for a given path to an HTML string at build time.
// Browser-only work in the components lives inside useEffect/event handlers,
// which renderToString does not run, so this is safe on the server.
export function render(path) {
  return renderToString(
    <StaticRouter location={path}>
      <App />
    </StaticRouter>
  );
}

export { prerenderPaths, getSeo } from './seo.js';
