// Static prerender step. Runs after `vite build` (client) and `vite build --ssr`.
// For every known route it renders the React tree to HTML, injects unique SEO
// head tags, and writes dist/<route>/index.html so crawlers and link unfurlers
// receive fully-rendered, per-page HTML instead of an empty SPA shell.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = join(root, 'dist');
const ssrEntry = pathToFileURL(join(root, '.ssr-dist', 'entry-server.js')).href;

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const ldScript = (block) =>
  `<script type="application/ld+json" data-seo="route">${JSON.stringify(block)
    .replace(/</g, '\\u003c')}</script>`;

function buildHead(seo) {
  const m = [];
  m.push(`<title>${escapeHtml(seo.title)}</title>`);
  m.push(`<meta name="description" content="${escapeHtml(seo.description)}" />`);
  m.push(`<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`);
  m.push(`<meta property="og:type" content="${escapeHtml(seo.ogType || 'website')}" />`);
  m.push(`<meta property="og:site_name" content="The Conviction Index" />`);
  m.push(`<meta property="og:title" content="${escapeHtml(seo.title)}" />`);
  m.push(`<meta property="og:description" content="${escapeHtml(seo.description)}" />`);
  m.push(`<meta property="og:url" content="${escapeHtml(seo.canonical)}" />`);
  m.push(`<meta property="og:image" content="${escapeHtml(seo.ogImage)}" />`);
  m.push(`<meta property="og:image:alt" content="The Conviction Index, editorial portraits of the AI, tech, and finance leaders it tracks." />`);
  m.push(`<meta property="og:locale" content="en_US" />`);
  m.push(`<meta name="twitter:card" content="summary_large_image" />`);
  m.push(`<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`);
  m.push(`<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`);
  m.push(`<meta name="twitter:image" content="${escapeHtml(seo.ogImage)}" />`);
  m.push(`<meta name="twitter:image:alt" content="The Conviction Index, editorial portraits of the leaders it tracks." />`);
  for (const block of seo.jsonLd || []) m.push(ldScript(block));
  return m.join('\n    ');
}

function outFileForPath(p) {
  if (p === '/') return join(distDir, 'index.html');
  return join(distDir, p.replace(/^\//, ''), 'index.html');
}

async function main() {
  const { render, prerenderPaths, getSeo } = await import(ssrEntry);
  const template = await readFile(join(distDir, 'index.html'), 'utf-8');

  if (!template.includes('<!--seo-->') || !template.includes('<!--/seo-->')) {
    throw new Error('index.html is missing the <!--seo--> markers; cannot inject per-route head tags.');
  }
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('index.html is missing <div id="root"></div>; cannot inject prerendered markup.');
  }

  let count = 0;
  for (const path of prerenderPaths) {
    const seo = getSeo(path);
    const appHtml = render(path);
    const head = buildHead(seo);

    const html = template
      .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, `<!--seo-->\n    ${head}\n    <!--/seo-->`)
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

    const outFile = outFileForPath(path);
    await mkdir(dirname(outFile), { recursive: true });
    await writeFile(outFile, html, 'utf-8');
    count += 1;
    console.log(`  prerendered ${path} -> ${outFile.replace(distDir + '/', 'dist/')}`);
  }

  console.log(`\n✓ Prerendered ${count} routes to static HTML.`);

  await writeSitemap(prerenderPaths);
}

// Keep sitemap.xml in lockstep with the routes we actually prerender.
async function writeSitemap(paths) {
  const SITE = 'https://theconvictionindex.com';
  const priorityFor = (p) => {
    if (p === '/') return '1.0';
    if (p === '/brief' || p === '/spotlight') return '0.8';
    if (p === '/problem' || p === '/method' || p === '/people') return '0.7';
    return '0.6';
  };
  const changefreqFor = (p) =>
    p === '/' || p === '/brief' || p === '/spotlight' ? 'weekly' : 'monthly';

  const urls = paths
    .map((p) => {
      const loc = p === '/' ? `${SITE}/` : `${SITE}${p}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreqFor(p)}</changefreq>\n    <priority>${priorityFor(p)}</priority>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(join(distDir, 'sitemap.xml'), xml, 'utf-8');
  console.log(`✓ Wrote sitemap.xml with ${paths.length} URLs.`);
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
