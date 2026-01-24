import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function SpotlightCard({ spotlight, prefersReducedMotion }) {
  return (
    <motion.article
      className="spotlight-card"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={prefersReducedMotion ? undefined : { y: -8 }}
    >
      <div className="spotlight-card-meta">
        <span className="spotlight-pill">{spotlight.category}</span>
        <span className="spotlight-date">{spotlight.date}</span>
      </div>
      <h3 className="spotlight-card-title">{spotlight.title}</h3>
      <p className="spotlight-card-summary">{spotlight.summary}</p>
      <div className="spotlight-card-footer">
        <span className="spotlight-read">{spotlight.readTime}</span>
        <Link className="spotlight-link" to={`/spotlight/${spotlight.slug}`}>
          Read spotlight
        </Link>
      </div>
    </motion.article>
  );
}
