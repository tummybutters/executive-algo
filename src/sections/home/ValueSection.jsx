import { motion } from 'motion/react';
import { valueCards } from '../../data/home.js';

export default function ValueSection({ prefersReducedMotion }) {
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
      className="value-section"
      id="what-you-get"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
    >
      <div className="container">
        <motion.div className="section-header" variants={itemVariants}>
          <p className="section-kicker">What You Get</p>
          <h2 className="section-title">A chosen algorithm for long-form intelligence.</h2>
          <p className="section-subtitle">
            We are not another feed. We are the filter you picked, a calm, editorial layer between you and the endless
            stream of podcasts.
          </p>
        </motion.div>
        <motion.div className="value-grid" variants={containerVariants}>
          {valueCards.map((card, index) => (
            <motion.div className="value-card" key={card.title} variants={itemVariants}>
              <span className="value-number">0{index + 1}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
