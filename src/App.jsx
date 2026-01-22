'use client';

import { motion, MotionConfig, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
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

const valueCards = [
  {
    title: 'Twice-weekly signal brief',
    body: '5-10 insights distilled from hours of long-form conversations.'
  },
  {
    title: 'Conviction shifts',
    body: 'The exact moments a leader changes their stance - and why.'
  },
  {
    title: 'Conversation queue',
    body: 'The few episodes worth your full attention when you have time.'
  }
];

const algorithmPoints = [
  'We listen wide so you can listen deep.',
  'We filter for frameworks, not dopamine.',
  'You decide if an episode earns your time.'
];

const sciFiHighlights = [
  'We are accelerating toward a sci-fi future.',
  'The best conversations make it feel beautiful, not chaotic.',
  'This is how you stay curious without drowning in content.'
];

const trackingCategories = [
  {
    title: 'The Architects',
    subtitle: 'Mega-cap tech leaders',
    entries: [
      'Jensen Huang - CEO, NVIDIA',
      'Satya Nadella - CEO, Microsoft',
      'Sundar Pichai - CEO, Google/Alphabet',
      'Mark Zuckerberg - CEO, Meta',
      'Tim Cook - CEO, Apple',
      'Elon Musk - CEO, Tesla/xAI/SpaceX',
      'Andy Jassy - CEO, Amazon'
    ]
  },
  {
    title: 'The Frontier',
    subtitle: 'AI lab leaders & founders',
    entries: [
      'Sam Altman - CEO, OpenAI',
      'Dario Amodei - CEO, Anthropic',
      'Daniela Amodei - President, Anthropic',
      'Demis Hassabis - CEO, Google DeepMind',
      'Ilya Sutskever - CEO, Safe Superintelligence',
      'Mira Murati - Founder, Thinking Machines Lab',
      'Arthur Mensch - CEO, Mistral AI',
      'Liang Wenfeng - Founder, DeepSeek'
    ]
  },
  {
    title: 'The Theorists',
    subtitle: 'Researchers & technical architects',
    entries: [
      'Andrej Karpathy - Founder, Eureka Labs',
      'Noam Brown - Research Scientist, OpenAI',
      'Chris Olah - Co-founder, Anthropic',
      'Yann LeCun - Chief AI Scientist, Meta/NYU',
      'Shane Legg - Chief AGI Scientist, DeepMind',
      'John Jumper - VP Research, DeepMind',
      'Jan Leike - Co-founder, ex-OpenAI',
      'Amanda Askell - Researcher, Anthropic'
    ]
  },
  {
    title: 'The Allocators',
    subtitle: 'VCs & capital allocators',
    entries: [
      'Marc Andreessen - Co-founder, a16z',
      'Ben Horowitz - Co-founder, a16z',
      'Pat Grady - Co-steward, Sequoia',
      'Alfred Lin - Co-steward, Sequoia',
      'Roelof Botha - Partner Emeritus, Sequoia',
      'Brad Gerstner - Founder, Altimeter',
      'Vinod Khosla - Founder, Khosla Ventures',
      'Peter Thiel - Co-founder, Founders Fund',
      'Keith Rabois - GP, Founders Fund',
      'Chris Dixon - GP, a16z',
      'Nat Friedman - Investor',
      'Daniel Gross - Co-founder, Pioneer',
      'Elad Gil - Investor'
    ]
  },
  {
    title: 'The Insurgents',
    subtitle: 'Disruptive unicorns & neo-labs',
    entries: [
      'Michael Truell - Co-founder, Anysphere',
      'Anton Osika - Co-founder, Lovable',
      'Guillermo Rauch - CEO, Vercel',
      'Amjad Masad - CEO, Replit',
      'Eric Simons - CEO, StackBlitz',
      'Winston Weinberg - CEO, Harvey',
      'Arvind Jain - CEO, Glean'
    ]
  },
  {
    title: 'The Builders',
    subtitle: 'Defense & deep tech',
    entries: [
      'Palmer Luckey - Founder, Anduril',
      'Trae Stephens - Executive Chairman, Anduril',
      'Brian Schimpf - CEO, Anduril',
      'Alex Karp - CEO, Palantir',
      'Gwynne Shotwell - President & COO, SpaceX',
      'Brett Adcock - CEO, Figure AI',
      'Tim Ellis - CEO, Relativity Space'
    ]
  },
  {
    title: 'The Establishment',
    subtitle: 'Fortune 500 & finance',
    entries: [
      'Jamie Dimon - CEO, JPMorgan Chase',
      'Ray Dalio - Founder, Bridgewater',
      'Brian Armstrong - CEO, Coinbase',
      'Brian Chesky - CEO, Airbnb',
      'Reid Hoffman - Co-founder, LinkedIn',
      'Aravind Srinivas - CEO, Perplexity',
      'Mati Staniszewski - CEO, ElevenLabs'
    ]
  },
  {
    title: 'The Amplifiers',
    subtitle: 'Cultural & infrastructure shapers',
    entries: [
      'Lex Fridman - Host, Lex Fridman Podcast',
      'Dwarkesh Patel - Host, Dwarkesh Podcast',
      'Ben Gilbert & David Rosenthal - Hosts, Acquired',
      'Patrick OShaughnessy - Host, Invest Like the Best',
      'Tim Ferriss - Host, Tim Ferriss Show',
      'Erik Torenberg - Host, Turpentine',
      'Theo Von - Comedian/Host'
    ]
  }
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
          <p>We track what they believe - and where conviction is forming.</p>
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
          The most important CEOs, researchers, and capital allocators share hours of insight now - too much for anyone to follow.
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

function ValueSection({ prefersReducedMotion }) {
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
      viewport={{ once: true, amount: 0.35 }}
      variants={containerVariants}
    >
      <div className="container">
        <motion.div className="section-header" variants={itemVariants}>
          <p className="section-kicker">What You Get</p>
          <h2 className="section-title">A chosen algorithm for long-form intelligence.</h2>
          <p className="section-subtitle">
            We are not another feed. We are the filter you picked - a calm, high-signal layer between you and
            the endless stream of podcasts.
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

function SlopSection({ prefersReducedMotion }) {
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
      viewport={{ once: true, amount: 0.35 }}
      variants={containerVariants}
    >
      <div className="container slop-grid">
        <motion.div className="slop-copy" variants={itemVariants}>
          <p className="section-kicker">The Feed Problem</p>
          <h2 className="section-title">Platforms are built to feed you slop.</h2>
          <p className="section-subtitle">
            Algorithms optimize for engagement, not for the conversations that change how you think. The result
            is endless noise and a shrinking attention span.
          </p>
          <p className="section-subtitle">
            We offer the opposite: a chosen algorithm that protects your leisure time and upgrades the ideas you
            spend it on.
          </p>
        </motion.div>
        <motion.div className="slop-panel" variants={itemVariants}>
          <div className="slop-panel-header">
            <span>The Choice</span>
            <span>Signal &gt; Noise</span>
          </div>
          <div className="slop-contrast">
            <div className="slop-item slop-item-muted">
              <span className="slop-label">The Feed</span>
              <p>Endless clips, context-free takes, momentum you never asked for.</p>
            </div>
            <div className="slop-item slop-item-signal">
              <span className="slop-label">Your Algorithm</span>
              <p>Long-form, high-conviction ideas. Context preserved. Attention respected.</p>
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

function MomentumSection({ prefersReducedMotion }) {
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
      viewport={{ once: true, amount: 0.35 }}
      variants={containerVariants}
    >
      <div className="container momentum-grid">
        <motion.div className="momentum-frame" variants={itemVariants}>
          <div className="momentum-image">
            <img src="/warp-drive.jpg" alt="Accelerating toward a sci-fi future" loading="lazy" />
          </div>
        </motion.div>
        <motion.div className="momentum-copy" variants={itemVariants}>
          <p className="section-kicker">The Moment</p>
          <h2 className="section-title">We are racing into a sci-fi future.</h2>
          <p className="section-subtitle">
            The best long-form conversations make the acceleration feel fun, awe-struck, and beautiful - not
            overwhelming.
          </p>
          <p className="section-subtitle">
            We capture the episodes and insights that hold the real heart of this moment, so you can feel it
            fully without the noise.
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

function PeopleSection({ prefersReducedMotion }) {
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
      viewport={{ once: true, amount: 0.35 }}
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
                  <li key={entry}>{entry}</li>
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

function LeisureSection({ prefersReducedMotion }) {
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
            When you want to go deep, you will already know which episodes are worth it. When you do not, the
            brief still keeps you ahead.
          </p>
          <div className="leisure-ritual">
            <div>
              <span className="ritual-title">Read the brief</span>
              <span className="ritual-detail">3 minutes to absorb the signal.</span>
            </div>
            <div>
              <span className="ritual-title">Pick an episode</span>
              <span className="ritual-detail">Only the conversations that earned it.</span>
            </div>
            <div>
              <span className="ritual-title">Let the rest go</span>
              <span className="ritual-detail">No guilt, no algorithmic noise.</span>
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
            <p>Twice-weekly, high-conviction briefs. Zero noise.</p>
          </div>
          <NewsletterForm buttonLabel="Join Now" source="footer-cta" />
          <p className="cta-footnote">Free. Unsubscribe anytime.</p>
        </motion.div>
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
              <span className="logo-title">the conviction index</span>
              <span className="logo-byline">by qortana</span>
            </div>
          </div>
          <div className="nav-links">
            <a href="#what-you-get">What you get</a>
            <a href="#why">Why this exists</a>
            <a href="#people">People tracked</a>
            <a className="nav-cta" href="#join">Join Now</a>
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

        <ValueSection prefersReducedMotion={prefersReducedMotion} />
        <SlopSection prefersReducedMotion={prefersReducedMotion} />
        <MomentumSection prefersReducedMotion={prefersReducedMotion} />
        <PeopleSection prefersReducedMotion={prefersReducedMotion} />
        <LeisureSection prefersReducedMotion={prefersReducedMotion} />
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 the conviction index. All rights reserved.</p>
        </div>
      </footer>
    </MotionConfig>
  );
}
