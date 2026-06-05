// Centralized, per-route SEO metadata for The Conviction Index.
// Consumed both at build time (scripts/prerender.mjs injects these into the
// served HTML so crawlers see unique tags) and on the client (components/Seo.jsx
// keeps document head in sync during client-side navigation).

import { landingPages } from './data/landingPages.js';
import { problemPage, methodPage, momentPage, briefPage } from './data/pages.js';
import { spotlights } from './data/spotlights.js';

export const SITE_URL = 'https://theconvictionindex.com';
export const SITE_NAME = 'The Conviction Index';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/hero/conviction-hero.png`;
export const OG_IMAGE_ALT =
  'The Conviction Index, editorial portraits of the AI, tech, and finance leaders it tracks.';

const abs = (path) => `${SITE_URL}${path === '/' ? '/' : path.replace(/\/$/, '')}`;

// Base WebSite + Organization graph used on the home page.
const organizationLd = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/qortana-logo.png`,
  description:
    'The Conviction Index tracks how the convictions of top AI, tech, and finance leaders shift over time, mined from their long-form podcast appearances.',
  parentOrganization: { '@type': 'Organization', name: 'Qortana' }
};

const websiteLd = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: 'Conviction Index newsletter',
  url: `${SITE_URL}/`,
  inLanguage: 'en-US',
  description:
    'A twice-weekly editorial brief tracking what top AI, tech, and finance leaders actually believe, mined from their long-form podcast appearances.',
  publisher: { '@type': 'Organization', name: 'Qortana' }
};

// Build a WebPage JSON-LD node for content pages.
const webPageLd = (path, name, description) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name,
  description,
  url: abs(path),
  isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
  publisher: { '@type': 'Organization', name: 'Qortana' }
});

const faqLd = (faqs) =>
  faqs && faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer }
        }))
      }
    : null;

const stripTags = (s) => String(s || '').replace(/<[^>]*>/g, '');

// Core static routes with hand-tuned, search-intent-aware titles/descriptions.
const staticRoutes = {
  '/': {
    title: 'The Conviction Index | What AI, Tech, and Finance Leaders Actually Believe',
    description:
      'A twice-weekly newsletter tracking what top AI, tech, and finance leaders actually believe, mined from their long-form podcast appearances and distilled to your inbox.',
    heading: 'Valuable Insights Are the Easiest to Miss.',
    ogType: 'website',
    jsonLd: [
      { '@context': 'https://schema.org', '@graph': [organizationLd, websiteLd] }
    ]
  },
  '/problem': {
    title: 'The Feed Problem | Why Social Platforms Fail Knowledge Workers',
    description:
      'Why social feeds optimize for engagement, not insight, and how a chosen algorithm of long-form podcast intelligence keeps busy leaders genuinely informed.',
    heading: problemPage.title,
    ogType: 'article',
    jsonLd: [webPageLd('/problem', problemPage.title, 'Why social platforms fail knowledge workers.')]
  },
  '/method': {
    title: 'How We Filter | Podcast Intelligence Methodology for AI and Tech',
    description:
      'Our editorial method for turning hundreds of hours of long-form podcasts into high-conviction signal: how we separate predictive insight from merely interesting takes.',
    heading: methodPage.title,
    ogType: 'article',
    jsonLd: [webPageLd('/method', methodPage.title, 'Our methodology and editorial philosophy.')]
  },
  '/moment': {
    title: 'The Moment | Why Long-Form Podcasts Are the Best Signal on AI',
    description:
      'We are racing into a sci-fi reality. Why the builders and allocators shaping the future reveal their real convictions in long-form podcasts, not press releases.',
    heading: momentPage.title,
    ogType: 'article',
    jsonLd: [webPageLd('/moment', momentPage.title, 'Racing into a sci-fi reality.')]
  },
  '/brief': {
    title: 'What You Get | The Twice-Weekly Conviction Index Brief',
    description:
      'Inside the twice-weekly Conviction Index brief: conviction shifts from AI and tech leaders, a curated conversation queue, and a skimmable, high-signal read.',
    heading: briefPage.title,
    ogType: 'article',
    jsonLd: [webPageLd('/brief', briefPage.title, 'The product: editorial intelligence, distilled.')]
  },
  '/people': {
    title: 'Who We Track | AI, Tech, and Finance Leaders in the Conviction Index',
    description:
      'The AI lab founders, mega-cap CEOs, researchers, VCs, and finance leaders we track for conviction shifts, from Jensen Huang and Sam Altman to Marc Andreessen and Jamie Dimon.',
    heading: 'Who We Track',
    ogType: 'website',
    jsonLd: [webPageLd('/people', 'Who We Track', 'The people shaping capital, infrastructure, research, and the narrative.')]
  },
  '/spotlight': {
    title: 'Spotlight | Breakdowns of What Is Actually Moving in AI and Tech',
    description:
      'Short, opinionated spotlights on what is actually moving in AI and tech: product shifts, capital allocation, infrastructure, and the incentives behind the headlines.',
    heading: 'Breakdowns that map the industry.',
    ogType: 'website',
    jsonLd: [webPageLd('/spotlight', 'Spotlight', 'Breakdowns that map the industry.')]
  }
};

// Segment landing pages, derived from landingPages.js so copy stays in one place.
const segmentRoutes = Object.fromEntries(
  Object.entries(landingPages).map(([slug, data]) => {
    const path = `/${slug}`;
    const heading = stripTags(data.hero.title);
    return [
      path,
      {
        title: `${data.title} | The Conviction Index`,
        description: data.metaDescription,
        heading,
        ogType: 'website',
        jsonLd: [webPageLd(path, data.title, data.metaDescription), faqLd(data.faqs)].filter(Boolean)
      }
    ];
  })
);

// Spotlight detail pages, derived from spotlights.js.
const spotlightDetailRoutes = Object.fromEntries(
  spotlights.map((s) => {
    const path = `/spotlight/${s.slug}`;
    const title = `${s.title} | Conviction Index Spotlight`;
    return [
      path,
      {
        title,
        description: s.summary,
        heading: s.title,
        ogType: 'article',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: s.title,
            description: s.summary,
            articleSection: s.category,
            url: abs(path),
            publisher: {
              '@type': 'Organization',
              name: SITE_NAME,
              logo: { '@type': 'ImageObject', url: `${SITE_URL}/qortana-logo.png` }
            }
          }
        ]
      }
    ];
  })
);

export const seoByPath = {
  ...staticRoutes,
  ...segmentRoutes,
  ...spotlightDetailRoutes
};

const DEFAULT_SEO = staticRoutes['/'];

// Resolve SEO for a given pathname, with a sensible fallback for unknown paths.
export function getSeo(pathname) {
  const clean = pathname && pathname !== '/' ? pathname.replace(/\/$/, '') : '/';
  const base = seoByPath[clean] || DEFAULT_SEO;
  return {
    ...base,
    canonical: abs(clean),
    ogImage: base.ogImage || DEFAULT_OG_IMAGE
  };
}

// Every path that should be prerendered to static HTML at build time.
export const prerenderPaths = Object.keys(seoByPath);
