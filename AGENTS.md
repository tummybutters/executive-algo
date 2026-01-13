# Executive Algorithm — Agent Notes

## Project overview
- Vite + React single-page app with Motion animations.
- Express `server.js` serves the Vite dev middleware in dev and static `dist/` in prod.
- `/api/subscribe` proxies Buttondown signup requests (requires env var).

## Key commands
- `npm run dev` → starts `server.js` (Express + Vite middleware) on port 3000.
- `npm run dev:vite` → Vite dev server only (no `/api/subscribe` proxy).
- `npm run build` → Vite production build to `dist/`.
- `npm run start` → production server (`server.js`) for `dist/`.

## Environment
- `BUTTONDOWN_API_KEY` required for `/api/subscribe` to work in `server.js`.

## Structure
- `src/main.jsx` → React entry.
- `src/App.jsx` → page layout + Motion-driven section reveals.
- `src/components/HeroCarousel.jsx` → hero lane logic + performance optimizations.
- `src/components/NewsletterForm.jsx` → form state + API calls.
- `src/style.css` → global styles.

## Media assets
- Optimized hero faces live in `public/hero/people-optimized/` and are used in the carousel.
- Originals are in `public/hero/people/` (keep as backup unless requested to remove).

## Performance notes
- Hero carousel starts after idle time, pauses off-screen, and uses cached layout widths.
- `content-visibility` is enabled for below-the-fold sections.

## Vercel build note
- `index.html` must reference `/src/main.jsx` (not `/src/main.js`).
