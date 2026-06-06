import { motion } from 'motion/react';
import { trackingCategories } from '../../data/home.js';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export default function PeopleSection({ prefersReducedMotion }) {
  const containerVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.08 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
    show: { opacity: 1, y: 0 }
  };

  const totalPeople = trackingCategories.reduce(
    (sum, category) => sum + category.entries.length,
    0
  );

  return (
    <motion.section
      className="people-section"
      id="people"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={containerVariants}
    >
      <div className="container">
        <motion.div className="section-header" variants={itemVariants}>
          <p className="section-kicker">Who We Track</p>
          <h2 className="section-title">Dramatis Personae</h2>
          <p className="section-subtitle">
            Not everyone. The {totalPeople} people shaping capital, infrastructure,
            research, and the narrative itself. Hover any name to read the part they play.
          </p>
        </motion.div>

        <motion.div className="masthead" variants={containerVariants}>
          {trackingCategories.map((category, index) => (
            <motion.section
              className="masthead-act"
              key={category.title}
              variants={itemVariants}
            >
              <div className="masthead-act-head">
                <span className="masthead-numeral" aria-hidden="true">
                  {ROMAN[index] ?? index + 1}
                </span>
                <div className="masthead-act-titles">
                  <h3 className="masthead-act-title">{category.title}</h3>
                  <p className="masthead-act-dek">{category.subtitle}</p>
                </div>
              </div>
              <ul className="masthead-roster">
                {category.entries.map((entry) => (
                  <li className="masthead-person" key={entry.name}>
                    <span className="masthead-name">{entry.name}</span>
                    <span className="masthead-role">{entry.role}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}
        </motion.div>

        <motion.div className="people-note" variants={itemVariants}>
          Expanding weekly as new voices earn conviction.
        </motion.div>
      </div>
    </motion.section>
  );
}
