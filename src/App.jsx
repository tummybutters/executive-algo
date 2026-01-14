'use client';

import { motion, MotionConfig, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import HeroCarousel from './components/HeroCarousel.jsx';
import NewsletterForm from './components/NewsletterForm.jsx';

const skeletonLines = [
  { width: 100 },
  { width: 100 },
  { width: 85 },
  { width: 70 },
  { width: 100 },
  { width: 80 },
  { width: 90 },
  { width: 60 }
];

function MemoSection({ prefersReducedMotion }) {
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
              <span className="memo-brand">Executive Insights</span>
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
          <p>We live in an era where the Einsteins, Rockefellers, and Churchills of our time sit for two-hour podcasts, openly sharing their thoughts on technology, humanity, and markets.</p>
          <p>We break them down in minutes—so you don't miss the ideas shaping the future.</p>
        </motion.div>
      </div>
    </section>
  );
}

function SkeletonLine({ width, index, scrollYProgress, prefersReducedMotion }) {
  const startOffset = 0.15 + index * 0.04;
  const endOffset = startOffset + 0.15;
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

export default function App() {
  const prefersReducedMotion = useReducedMotion();

  const revealVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    show: { opacity: 1, y: 0 }
  };

  const heroContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };

  const heroItem = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <MotionConfig transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>
      <motion.nav
        className="navbar"
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon"></div>
            <span>Executive Algorithm</span>
          </div>
          <div className="nav-links">
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Success Stories</a>
            <button className="nav-cta">Join Now</button>
          </div>
        </div>
      </motion.nav>

      <main>
        <section className="hero">
          <motion.div
            className="hero-content"
            variants={heroContainer}
            initial="hidden"
            animate="show"
          >
            <motion.h1 className="hero-title" variants={heroItem}>
              Valuable Insights Are the <span className="text-gradient">Easiest to Miss.</span>
            </motion.h1>
            <motion.p className="hero-subtitle" variants={heroItem}>
              The most important CEOs, researchers, and capital allocators share hours of insight now—too much for anyone to follow.
              <br />
              <br />
              We track, extract, and distill them straight to your inbox.
            </motion.p>
            <motion.div variants={heroItem}>
              <NewsletterForm
                buttonLabel="Join Algorithm"
                footer="We respect your privacy. Unsubscribe at any time."
                source="hero"
              />
            </motion.div>
            <motion.div className="hero-stats-strip" variants={heroItem}>
              <span>&bull; Skimmable Read</span>
              <span>&bull; Value Packed</span>
              <span>&bull; Twice a Week</span>
            </motion.div>
          </motion.div>

          <HeroCarousel />
        </section>

        <MemoSection prefersReducedMotion={prefersReducedMotion} />

        <motion.section
          className="signal-noise"
          id="how-it-works"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={revealVariants}
        >
          <div className="container">
            <h2 className="section-title">Who's Actually Worth Listening To?</h2>
            <div className="signal-chart-container">
              <div className="chart-label">Signal vs Noise in content</div>
              <div className="chart-wrapper">
                <div className="chart-bar noise-bar">
                  <motion.div
                    className="bar-fill"
                    initial={{ scaleX: prefersReducedMotion ? 1 : 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1.1, ease: [0.25, 0.8, 0.3, 1] }}
                    style={{ originX: 0 }}
                  ></motion.div>
                  <div className="bar-info">
                    <span className="label">Noise</span>
                    <span className="percentage">99.9%</span>
                    <span className="desc">Everything else that wastes your time</span>
                  </div>
                </div>
                <div className="chart-bar signal-bar">
                  <motion.div
                    className="bar-fill"
                    initial={{ scaleX: prefersReducedMotion ? 1 : 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.8, 0.3, 1], delay: 0.1 }}
                    style={{ originX: 0 }}
                  ></motion.div>
                  <div className="bar-info">
                    <span className="label">Signal</span>
                    <span className="percentage">0.1%</span>
                    <span className="desc">The valuable insights that actually matter</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="shaping-future"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={revealVariants}
        >
          <div className="container">
            <h2 className="section-title">The People Shaping the Future.</h2>
            <div className="grid-layout">
              <div className="text-block">
                <p>Whether it's the CEO redefining fast food or the head of the world's largest AI lab predicting the future of work, their assumptions and frameworks matter.</p>
                <p>They're successful, influential, and actively shaping the world—we make sure you never miss their most important insights.</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="final-cta"
          id="pricing"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={revealVariants}
        >
          <div className="container">
            <motion.div
              className="cta-card"
              whileHover={prefersReducedMotion ? undefined : { y: -8 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            >
              <h2>Join The Executive Algorithm</h2>
              <p>Never miss important insights from the world's most influential leaders and thinkers.</p>

              <NewsletterForm buttonLabel="Join Now" source="footer-cta" />
              <p className="social-proof">Join thousands of executives receiving valuable insights twice weekly.</p>

              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">100K+</span>
                  <span className="stat-label">Subscribers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">2x</span>
                  <span className="stat-label">Weekly Issues</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">5 min</span>
                  <span className="stat-label">Average Read</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 The Executive Algorithm. All rights reserved.</p>
        </div>
      </footer>
    </MotionConfig>
  );
}
