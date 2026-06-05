import { motion } from 'motion/react';
import { sciFiHighlights } from '../../data/home.js';

export default function MomentumSection({ prefersReducedMotion }) {
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
      className="momentum-section"
      id="momentum"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
    >
      <div className="container momentum-grid">
        <motion.div className="momentum-frame" variants={itemVariants}>
          <div className="momentum-image">
            <video
              className="momentum-video"
              src="/warp-drive.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
        </motion.div>
        <motion.div className="momentum-copy" variants={itemVariants}>
          <p className="section-kicker">The Moment</p>
          <h2 className="section-title">
            We are racing into a sci-fi <span className="strike-word">fiction</span>{' '}
            <span className="reality-word">reality</span>.
          </h2>
          <p className="section-subtitle">
            The best long-form conversations give you genuine insight into the shape of an uncertain future. What's actually
            shifting, and why it matters.
          </p>
          <p className="section-subtitle">
            We surface the episodes and ideas worth your attention, so you can understand the trajectory instead of just
            reacting to it.
          </p>
          <ul className="momentum-points">
            {sciFiHighlights.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.section>
  );
}
