import { motion, useReducedMotion } from 'motion/react';
import SpotlightCard from '../components/SpotlightCard.jsx';
import { spotlights, spotlightCategories } from '../data/spotlights.js';

export default function Spotlight() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="spotlight-page">
      <section className="spotlight-hero">
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
            Breakdowns that map the industry.
          </motion.h1>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Short, opinionated spotlights on what is actually moving: product shifts, capital allocation,
            and the incentives behind the headlines.
          </motion.p>
        </div>
      </section>

      <section className="spotlight-filter-bar">
        <div className="container">
          <div className="spotlight-filters">
            <button className="spotlight-filter is-active" type="button">
              All
            </button>
            {spotlightCategories.map((category) => (
              <button className="spotlight-filter" type="button" key={category}>
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="spotlight-list">
        <div className="container">
          <div className="spotlight-grid">
            {spotlights.map((spotlight) => (
              <SpotlightCard
                key={spotlight.slug}
                spotlight={spotlight}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
