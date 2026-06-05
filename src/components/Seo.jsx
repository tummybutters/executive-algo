import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeo, SITE_NAME, OG_IMAGE_ALT } from '../seo.js';

// Keeps the document head in sync during client-side navigation. The first
// paint of every route is already correct because scripts/prerender.mjs bakes
// the same tags into the served HTML; this component handles SPA route changes.
function setMeta(selector, attr, value) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, key, name] = selector.match(/\[(.+?)="(.+?)"\]/) || [];
    if (key && name) el.setAttribute(key, name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setCanonical(href) {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setJsonLd(blocks) {
  if (typeof document === 'undefined') return;
  document.head
    .querySelectorAll('script[type="application/ld+json"][data-seo="route"]')
    .forEach((n) => n.remove());
  (blocks || []).forEach((block) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'route');
    script.textContent = JSON.stringify(block);
    document.head.appendChild(script);
  });
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeo(pathname);
    document.title = seo.title;
    setMeta('meta[name="description"]', 'content', seo.description);
    setCanonical(seo.canonical);

    setMeta('meta[property="og:title"]', 'content', seo.title);
    setMeta('meta[property="og:description"]', 'content', seo.description);
    setMeta('meta[property="og:url"]', 'content', seo.canonical);
    setMeta('meta[property="og:type"]', 'content', seo.ogType || 'website');
    setMeta('meta[property="og:image"]', 'content', seo.ogImage);
    setMeta('meta[property="og:image:alt"]', 'content', OG_IMAGE_ALT);
    setMeta('meta[property="og:site_name"]', 'content', SITE_NAME);

    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', seo.title);
    setMeta('meta[name="twitter:description"]', 'content', seo.description);
    setMeta('meta[name="twitter:image"]', 'content', seo.ogImage);

    setJsonLd(seo.jsonLd);
  }, [pathname]);

  return null;
}
