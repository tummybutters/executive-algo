import { motion } from 'motion/react';
import { algorithmPoints } from '../../data/home.js';

export default function SlopSection({ prefersReducedMotion }) {
  const containerVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.section
      className="slop-section"
      id="why"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
    >
      <div className="container slop-grid">
        <motion.div className="slop-copy" variants={itemVariants}>
          <p className="section-kicker">The Feed Problem</p>
          <h2 className="section-title">Social platforms are built to feed you slop.</h2>
          <p className="section-subtitle">
            Algorithms optimize for engagement, not for the conversations that change how you think. The result is endless
            churn and a shrinking attention span.
          </p>
          <p className="section-subtitle">
            We offer the opposite: a chosen algorithm that protects your leisure time and upgrades the ideas you spend it on.
          </p>
        </motion.div>
        <motion.div className="slop-panel" variants={itemVariants}>
          <div className="slop-panel-header">
            <span>The Choice</span>
            <span>Context &gt; Clips</span>
          </div>
          <div className="slop-contrast">
            <div className="slop-item slop-item-muted">
              <span className="slop-label">The Feed</span>
              <p>Clips with no context. Takes designed to make you react. The feeling of knowing less the more you scroll.</p>
            </div>
            <div className="slop-item slop-item-highlight">
              <span className="slop-label">Your Algorithm</span>
              <p>Full conviction. Full context. The conversations that actually change how you think.</p>
            </div>
          </div>
          <ul className="slop-steps">
            {algorithmPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.section>
  );
}
