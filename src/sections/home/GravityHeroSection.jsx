import { motion, useScroll } from 'motion/react';
import { useRef } from 'react';
import HeroCarousel, { heroPeople } from '../../components/HeroCarousel.jsx';
import NewsletterForm from '../../components/NewsletterForm.jsx';
import useMediaQuery from '../../hooks/useMediaQuery.js';
import { mobileCarouselOrder } from '../../data/home.js';

export default function GravityHeroSection({ prefersReducedMotion }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });
  const isSmallViewport = useMediaQuery('(max-width: 640px)');
  const carouselPeople = isSmallViewport
    ? mobileCarouselOrder
        .map((stem) => heroPeople.find((src) => src.endsWith(`/${stem}.png`)))
        .filter(Boolean)
    : undefined;

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
    <section className="hero" ref={sectionRef}>
      <motion.div className="hero-content" variants={heroContainer} initial="hidden" animate="show">
        <motion.h1 className="hero-title" variants={heroItem}>
          Valuable Insights Are the <span className="text-gradient">Easiest to Miss.</span>
        </motion.h1>
        <motion.p className="hero-subtitle" variants={heroItem}>
          The people building AI, deploying capital, and shaping markets now speak for hours on long-form podcasts. Far too much for anyone to follow.
          <br />
          <br />
          We track what they actually believe, and how their conviction shifts over time, distilled to your inbox twice a week.
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
          <span>&bull; High Conviction</span>
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
