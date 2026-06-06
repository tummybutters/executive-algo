import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { trackingCategories } from '../../data/home.js';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const SWIPE_THRESHOLD = 50;

export default function PeopleSection({ prefersReducedMotion }) {
  const count = trackingCategories.length;

  // index + direction (1 = forward/right, -1 = back/left) for slide transitions
  const [[index, direction], setIndex] = useState([0, 0]);
  const touchStartX = useRef(null);

  const paginate = useCallback(
    (dir) => {
      setIndex(([current]) => {
        const next = (current + dir + count) % count;
        return [next, dir];
      });
    },
    [count]
  );

  const goTo = useCallback(
    (target) => {
      setIndex(([current]) => [target, target > current ? 1 : -1]);
    },
    []
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        paginate(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        paginate(-1);
      }
    },
    [paginate]
  );

  const handleTouchStart = useCallback((event) => {
    touchStartX.current = event.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (event) => {
      if (touchStartX.current === null) return;
      const deltaX = event.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        paginate(deltaX < 0 ? 1 : -1);
      }
      touchStartX.current = null;
    },
    [paginate]
  );

  const category = trackingCategories[index];
  const offset = prefersReducedMotion ? 0 : 48;
  const duration = prefersReducedMotion ? 0.12 : 0.45;

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? offset : -offset }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -offset : offset })
  };

  return (
    <section className="people-section" id="people">
      <div className="container">
        <div className="section-header">
          <p className="section-kicker">Who We Track</p>
          <h2 className="section-title">The people who move markets</h2>
          <p className="section-subtitle">
            Founders, investors, and operators shaping AI, capital, and
            technology. We track their conviction every week and tell you what
            changed.
          </p>
        </div>

        <div
          className="people-carousel"
          role="group"
          aria-roledescription="carousel"
          aria-label="Categories of people we track"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className="people-carousel-arrow people-carousel-arrow--prev"
            aria-label="Previous category"
            onClick={() => paginate(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M15 4L7 12l8 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="people-carousel-stage">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.article
                key={category.title}
                className="people-panel"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration, ease: [0.22, 0.61, 0.36, 1] }}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}: ${category.title}`}
              >
                <div className="people-panel-figure">
                  <img
                    className="people-panel-portrait"
                    src={category.figurehead}
                    alt={`${category.title} figurehead`}
                    loading="lazy"
                    width="640"
                    height="800"
                  />
                </div>

                <div className="people-panel-body">
                  <div className="people-panel-head">
                    <span className="people-panel-numeral" aria-hidden="true">
                      {ROMAN[index] ?? index + 1}
                    </span>
                    <div className="people-panel-titles">
                      <h3 className="people-panel-title">{category.title}</h3>
                      <p className="people-panel-dek">{category.subtitle}</p>
                    </div>
                  </div>

                  <ul className="people-panel-roster">
                    {category.entries.map((entry) => (
                      <li className="people-panel-person" key={entry.name}>
                        <span className="people-panel-name">{entry.name}</span>
                        <span className="people-panel-role">{entry.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="people-carousel-arrow people-carousel-arrow--next"
            aria-label="Next category"
            onClick={() => paginate(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M9 4l8 8-8 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="people-carousel-footer">
          <div
            className="people-carousel-dots"
            role="tablist"
            aria-label="Select category"
          >
            {trackingCategories.map((cat, dotIndex) => (
              <button
                type="button"
                key={cat.title}
                className={
                  'people-carousel-dot' +
                  (dotIndex === index ? ' is-active' : '')
                }
                aria-label={cat.title}
                aria-selected={dotIndex === index}
                role="tab"
                onClick={() => goTo(dotIndex)}
              />
            ))}
          </div>
          <span className="people-carousel-counter" aria-hidden="true">
            {ROMAN[index] ?? index + 1} / {ROMAN[count - 1] ?? count}
          </span>
        </div>
      </div>
    </section>
  );
}
