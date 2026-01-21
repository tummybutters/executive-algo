'use client';

import { motion, MotionConfig, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import HeroCarousel, { heroPeople } from './components/HeroCarousel.jsx';
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

const filterStages = [
  { id: 'stage-1', title: '10,000+ hours', detail: 'Published weekly', width: 100 },
  { id: 'stage-2', title: '~50 hours', detail: 'Worth tracking', width: 68 },
  { id: 'stage-3', title: '5-10 insights', detail: 'That matter', width: 38 }
];

const processSteps = [
  {
    id: 'track',
    title: 'Track',
    body: 'We monitor 50+ influential voices across the podcasts that matter.'
  },
  {
    id: 'extract',
    title: 'Extract',
    body: 'Dense analysis, not summaries. The framework behind the soundbite. Why they changed their mind.'
  },
  {
    id: 'deliver',
    title: 'Deliver',
    body: "Twice weekly. Only when there's signal worth sending."
  }
];

const voiceList = [
  { name: 'Jensen Huang', topic: 'AI infrastructure & compute economics' },
  { name: 'Dario Amodei', topic: 'AI safety frameworks & capability timelines' },
  { name: 'Marc Andreessen', topic: 'Capital flows & technology adoption' },
  { name: 'Demis Hassabis', topic: 'Research directions & scientific breakthroughs' },
  { name: 'Brian Chesky', topic: 'Product thinking & company building' }
];

const insightCards = [
  {
    title: 'Why Huang Changed His Mind on Memory Bandwidth',
    source: 'Extracted from: Acquired Podcast, Jan 2025',
    readTime: 'Read time: 3 min'
  },
  {
    title: "Amodei's Shifting Timeline: What Changed",
    source: 'Extracted from: Dwarkesh Patel, Dec 2024',
    readTime: 'Read time: 4 min'
  }
];

const buildFilterParticles = (count = 18) =>
  Array.from({ length: count }, (_, index) => {
    const spread = (Math.sin(index * 1.4) + 1) / 2;
    const left = 8 + spread * 84;
    const size = 4 + (index % 3) * 2;
    const delay = (index % 6) * 0.35;
    const duration = 3.6 + (index % 5) * 0.25;
    return {
      id: `particle-${index}`,
      left,
      size,
      delay,
      duration
    };
  });

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
          <p>We live in an era where the Einsteins, Rockefellers, and Churchills of our time sit for two-hour podcasts, openly sharing their beliefs on technology, markets, and the future.</p>
          <p>We track what they believe—and where conviction is forming.</p>
        </motion.div>
      </div>
    </section>
  );
}

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

function GravityHeroSection({ prefersReducedMotion, heroContainer, heroItem, isSmallViewport }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });
  const mobileCarouselOrder = [
    'satya',
    'braddy',
    'michael_truell',
    'karp',
    'jensen',
    'mati_staniszewski',
    'brett_adcock'
  ];
  const carouselPeople = isSmallViewport
    ? mobileCarouselOrder
        .map((stem) => heroPeople.find((src) => src.endsWith(`/${stem}.png`)))
        .filter(Boolean)
    : undefined;

  return (
    <section className="hero" ref={sectionRef}>
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
          We track their convictions and distill them straight to your inbox.
        </motion.p>
        <motion.div variants={heroItem}>
          <NewsletterForm
            buttonLabel="Join The Index"
            footer="We respect your privacy. Unsubscribe at any time."
            source="hero"
          />
        </motion.div>
        <motion.div className="hero-stats-strip" variants={heroItem}>
          <span>&bull; Skimmable Read</span>
          <span>&bull; High Signal</span>
          <span>&bull; Twice a Week</span>
        </motion.div>
      </motion.div>

      <HeroCarousel
        scrollYProgress={scrollYProgress}
        prefersReducedMotion={prefersReducedMotion}
        people={carouselPeople}
      />
    </section>
  );
}

function FilterVisual({ prefersReducedMotion }) {
  const particles = useMemo(() => buildFilterParticles(18), []);

  return (
    <div className="filter-visual" aria-hidden="true">
      <div className="filter-particles">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="filter-particle"
            style={{ left: `${particle.left}%`, width: particle.size, height: particle.size }}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [-30, 240],
                    opacity: [0, 1, 0],
                    scale: [0.6, 1, 0.7]
                  }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: 'linear'
                  }
            }
          />
        ))}
      </div>
      <div className="filter-funnel">
        {filterStages.map((stage, index) => (
          <div className="filter-stage" key={stage.id}>
            <motion.div
              className="filter-stage-bar"
              initial={{ scaleX: prefersReducedMotion ? 1 : 0.2, opacity: prefersReducedMotion ? 1 : 0.4 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.8, delay: index * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ '--stage-width': `${stage.width}%`, originX: 0.5 }}
            />
            <div className="filter-stage-text">
              <span className="stage-title">{stage.title}</span>
              <span className="stage-detail">{stage.detail}</span>
            </div>
            {index < filterStages.length - 1 ? (
              <motion.div
                className="filter-arrow"
                initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -4 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
                animate={prefersReducedMotion ? undefined : { y: [0, 4, 0] }}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProblemSection({ prefersReducedMotion }) {
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
      className="access-paradox"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={containerVariants}
    >
      <div className="container access-paradox-grid">
        <motion.div className="access-paradox-copy" variants={itemVariants}>
          <p className="section-kicker">Who's Actually Worth Tracking?</p>
          <h2 className="section-title">Signal vs Noise</h2>
        </motion.div>
        <motion.div className="access-paradox-visual" variants={itemVariants}>
          <FilterVisual prefersReducedMotion={prefersReducedMotion} />
        </motion.div>
      </div>
    </motion.section>
  );
}

function ProcessSection({ prefersReducedMotion }) {
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
      className="process-section"
      id="how-it-works"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={containerVariants}
    >
      <div className="container">
        <motion.div className="section-header" variants={itemVariants}>
          <p className="section-kicker">How It Works</p>
          <h2 className="section-title">How We Extract Signal</h2>
        </motion.div>
        <motion.div className="process-grid" variants={containerVariants}>
          {processSteps.map((step) => (
            <motion.div
              className="process-card"
              key={step.id}
              variants={itemVariants}
              whileHover={prefersReducedMotion ? undefined : { y: -6 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            >
              <div className="process-icon" data-variant={step.id}>
                <span />
                <span />
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

function VoicesSection({ prefersReducedMotion }) {
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
      className="voices-track"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={containerVariants}
    >
      <div className="container">
        <motion.div className="section-header" variants={itemVariants}>
          <h2 className="section-title">The People Shaping the Future.</h2>
          <p className="section-subtitle">
            Whether it's the CEO redefining industry or the head of the world's largest AI lab predicting the future of work, their convictions and frameworks matter.
          </p>
          <p className="section-subtitle">
            They're successful, influential, and actively shaping the world—we track what they believe so you don't miss what's forming.
          </p>
        </motion.div>
        <motion.div className="voices-grid" variants={containerVariants}>
          {voiceList.map((voice) => (
            <motion.div className="voice-card" key={voice.name} variants={itemVariants}>
              <span className="voice-name">{voice.name}</span>
              <span className="voice-topic">{voice.topic}</span>
            </motion.div>
          ))}
          <motion.div className="voice-more" variants={itemVariants}>
            + 45 more across technology, markets, and research
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function RecentInsightsSection({ prefersReducedMotion }) {
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
      className="recent-insights"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={containerVariants}
    >
      <div className="container">
        <motion.div className="section-header" variants={itemVariants}>
          <p className="section-kicker">Recent Insights</p>
          <h2 className="section-title">Recent Insights</h2>
        </motion.div>
        <motion.div className="insights-grid" variants={containerVariants}>
          {insightCards.map((card) => (
            <motion.article className="insight-card" key={card.title} variants={itemVariants}>
              <h3>{card.title}</h3>
              <p className="insight-source">{card.source}</p>
              <span className="insight-meta">{card.readTime}</span>
            </motion.article>
          ))}
        </motion.div>
        <motion.a
          className="sample-link"
          href="#"
          variants={itemVariants}
          whileHover={prefersReducedMotion ? undefined : { x: 6 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          See sample issue -&gt;
        </motion.a>
      </div>
    </motion.section>
  );
}

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [isSmallViewport, setIsSmallViewport] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia('(max-width: 640px)');
    const update = () => setIsSmallViewport(media.matches);
    update();
    if (media.addEventListener) {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

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
            <img className="logo-icon" src="/qortana-logo.png" alt="The Conviction Index logo" />
            <div className="logo-text">
              <span className="logo-title">the conviction index .com</span>
              <span className="logo-byline">by qortana</span>
            </div>
          </div>
          <div className="nav-links">
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Success Stories</a>
            <button className="nav-cta">Join Now</button>
          </div>
        </div>
      </motion.nav>

      <main>
        <GravityHeroSection
          prefersReducedMotion={prefersReducedMotion}
          heroContainer={heroContainer}
          heroItem={heroItem}
          isSmallViewport={isSmallViewport}
        />

        <MemoSection prefersReducedMotion={prefersReducedMotion} />

        <ProblemSection prefersReducedMotion={prefersReducedMotion} />
        <ProcessSection prefersReducedMotion={prefersReducedMotion} />
        <VoicesSection prefersReducedMotion={prefersReducedMotion} />
        <RecentInsightsSection prefersReducedMotion={prefersReducedMotion} />

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
              <h2>Join The Conviction Index</h2>
              <p>Track the ideas shaping the future from the people building it.</p>

              <NewsletterForm buttonLabel="Join Now" source="footer-cta" />
              <p className="cta-footnote">Join thousands tracking high-conviction insights twice weekly.</p>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 the conviction index .com. All rights reserved.</p>
        </div>
      </footer>
    </MotionConfig>
  );
}
