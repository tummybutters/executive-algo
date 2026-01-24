import { motion } from 'motion/react';
import NewsletterForm from '../../components/NewsletterForm.jsx';

export default function LeisureSection({ prefersReducedMotion }) {
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
      className="leisure-section"
      id="join"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={containerVariants}
    >
      <div className="container leisure-grid">
        <motion.div className="leisure-copy" variants={itemVariants}>
          <p className="section-kicker">Leisure, Upgraded</p>
          <h2 className="section-title">Spend your time on conversations that pay you back.</h2>
          <p className="section-subtitle">
            When you want to go deep, you will already know which episodes are worth it. When you do not, the brief still
            keeps you ahead.
          </p>
          <div className="leisure-ritual">
            <div>
              <span className="ritual-title">Read the brief</span>
              <span className="ritual-detail">3 minutes to absorb the brief.</span>
            </div>
            <div>
              <span className="ritual-title">Pick an episode</span>
              <span className="ritual-detail">Only the conversations that earned it.</span>
            </div>
            <div>
              <span className="ritual-title">Let the rest go</span>
              <span className="ritual-detail">You're not missing anything. The right ideas already found you.</span>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="cta-panel"
          variants={itemVariants}
          whileHover={prefersReducedMotion ? undefined : { y: -8 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
        >
          <div className="cta-header">
            <span className="cta-kicker">Join the index</span>
            <h2>Make your input deliberate.</h2>
            <p>Twice-weekly, high-conviction briefs. No clutter.</p>
          </div>
          <NewsletterForm buttonLabel="Join Now" source="footer-cta" />
          <p className="cta-footnote">Free. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </motion.section>
  );
}
