import { motion, useReducedMotion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { getSpotlightBySlug } from '../data/spotlights.js';

export default function SpotlightDetail() {
  const { slug } = useParams();
  const prefersReducedMotion = useReducedMotion();
  const spotlight = getSpotlightBySlug(slug);

  if (!spotlight) {
    return (
      <main className="spotlight-page">
        <section className="spotlight-hero">
          <div className="container">
            <p className="section-kicker">Spotlight</p>
            <h1 className="section-title">This spotlight does not exist yet.</h1>
            <p className="section-subtitle">
              The industry keeps moving. We will add this one soon.
            </p>
            <Link className="spotlight-back" to="/spotlight">
              Back to Spotlight
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="spotlight-page">
      <section className="spotlight-detail">
        <div className="container">
          <motion.p
            className="section-kicker"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Spotlight
          </motion.p>
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          >
            {spotlight.title}
          </motion.h1>
          <motion.div
            className="spotlight-detail-meta"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="spotlight-pill">{spotlight.category}</span>
            <span className="spotlight-date">{spotlight.date}</span>
            <span className="spotlight-read">{spotlight.readTime}</span>
          </motion.div>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {spotlight.summary}
          </motion.p>

          <div className="spotlight-placeholder">
            <p>
              Full breakdown coming soon. This page is wired so we can drop in real content as spotlights
              are published.
            </p>
          </div>

          <Link className="spotlight-back" to="/spotlight">
            Back to Spotlight
          </Link>
        </div>
      </section>
    </main>
  );
}
