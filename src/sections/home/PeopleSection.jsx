import { motion } from 'motion/react';
import { trackingCategories } from '../../data/home.js';

export default function PeopleSection({ prefersReducedMotion }) {
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
      className="people-section"
      id="people"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
    >
      <div className="container">
        <motion.div className="section-header" variants={itemVariants}>
          <p className="section-kicker">Who We Track</p>
          <h2 className="section-title">A taxonomy of conviction.</h2>
          <p className="section-subtitle">
            Not everyone. The people shaping capital, infrastructure, research, and the narrative itself.
          </p>
        </motion.div>
        <motion.div className="tracking-grid" variants={containerVariants}>
          {trackingCategories.map((category) => (
            <motion.article className="tracking-card" key={category.title} variants={itemVariants}>
              <div className="tracking-header">
                <span className="tracking-title">{category.title}</span>
                <span className="tracking-subtitle">{category.subtitle}</span>
              </div>
              <ul className="tracking-list">
                {category.entries.map((entry) => (
                  <li key={entry.name}>
                    <span className="entry-name">{entry.name}</span>
                    <span className="entry-role">{entry.role}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
        <motion.div className="people-note" variants={itemVariants}>
          Expanding weekly as new voices earn conviction.
        </motion.div>
      </div>
    </motion.section>
  );
}
