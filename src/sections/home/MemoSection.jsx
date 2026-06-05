import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { skeletonLines } from '../../data/home.js';

function SkeletonLine({ width, index, scrollYProgress, prefersReducedMotion }) {
  const startOffset = 0.12 + index * 0.03;
  const endOffset = startOffset + 0.12;
  const fillProgress = useTransform(scrollYProgress, [startOffset, endOffset], [0, 100]);

  return (
    <div className="skeleton-line-container" style={{ width: `${width}%` }}>
      <div className="skeleton-line-bg" />
      <motion.div
        className="skeleton-line-fill"
        style={{
          width: prefersReducedMotion ? '100%' : useTransform(fillProgress, (v) => `${v}%`)
        }}
      />
    </div>
  );
}

export default function MemoSection({ prefersReducedMotion }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const glowOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.7], [0, 0.8, 0]);
  const glowScale = useTransform(scrollYProgress, [0.1, 0.5], [0.8, 1.2]);

  return (
    <section className="newsletter-highlight" ref={sectionRef}>
      <div className="container">
        <motion.h2
          className="section-title memo-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Hold up... Another Newsletter?
        </motion.h2>

        <div className="memo-wrapper">
          <motion.div
            className="memo-glow"
            style={{
              opacity: prefersReducedMotion ? 0.5 : glowOpacity,
              scale: prefersReducedMotion ? 1 : glowScale
            }}
          />
          <motion.div
            className="memo-paper memo-paper-large"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="memo-header">
              <div className="memo-accent" />
              <span className="memo-brand">The Conviction Index</span>
              <span className="memo-date">February 28, 2025</span>
            </div>
            <div className="memo-content">
              {skeletonLines.map((line, index) => (
                <SkeletonLine
                  key={index}
                  width={line.width}
                  index={index}
                  scrollYProgress={scrollYProgress}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="highlight-content highlight-content-centered"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <p>
            We live in an era where the Einsteins, Rockefellers, and Churchills of our time sit for two-hour podcasts, openly
            sharing their beliefs on technology, markets, and the future.
          </p>
          <p>Most people will never hear it. You're not most people.</p>
          <p>We track what they believe, and where conviction is forming.</p>
        </motion.div>
      </div>
    </section>
  );
}
