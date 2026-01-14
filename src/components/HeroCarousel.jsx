'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';
import { clamp } from '../utils.js';

const featuredBottomOffsetPx = 28;

const optimizedBase = '/hero/people-optimized';
const optimized = (name) => `${optimizedBase}/${name}.png`;

const featuredStyleBySrc = {
  [optimized('jensen')]: { heightMul: 1.22, scale: 1.06, shiftX: -10 },
  [optimized('satya')]: { heightMul: 1.24, scale: 1.06, shiftX: 10 },
  [optimized('sammy')]: { heightMul: 0.92, scale: 0.92, shiftX: 0 },
  [optimized('karp')]: { heightMul: 1.14, scale: 1.03, y: 25, shiftX: -10 },
  [optimized('bill')]: { heightMul: 1.22, scale: 1.08, shiftX: 12 },
  [optimized('braddy')]: { heightMul: 1.14, scale: 1.02, y: 140, shiftX: 0 }
};

const featuredExtraGapAfterBySrc = {
  [optimized('jensen')]: 140,
  [optimized('satya')]: 140
};

const personTitles = {
  [optimized('jensen')]: 'CEO of NVIDIA',
  [optimized('elon_musk')]: 'CEO of Tesla',
  [optimized('dario_amodei')]: 'CEO of Anthropic',
  [optimized('ilya_sutskever')]: 'Head AI Researcher',
  [optimized('marc_andreessen')]: 'Founder of a16z',
  [optimized('peter_thiel')]: 'Founder of Palantir',
  [optimized('chamath_palihapitiya')]: 'CEO of Social',
  [optimized('jamie_dimon')]: 'CEO of JPMorgan',
  [optimized('ray_dalio')]: 'Founder of Bridgewater',
  [optimized('reid_hoffman')]: 'Founder of LinkedIn',
  [optimized('aravind_srinivas')]: 'CEO of Perplexity',
  [optimized('michael_truell')]: 'Founder of Cursor',
  [optimized('mati_staniszewski')]: 'CEO of ElevenLabs',
  [optimized('palmer_luckey')]: 'Founder of Anduril',
  [optimized('tim_ellis')]: 'Founder of Relativity',
  [optimized('brett_adcock')]: 'CEO of Figure',
  [optimized('satya')]: 'CEO of Microsoft',
  [optimized('sammy')]: 'CEO of OpenAI',
  [optimized('zuckerberg')]: 'CEO of Meta',
  [optimized('karp')]: 'CEO of Palantir',
  [optimized('bill')]: 'Founder of Microsoft',
  [optimized('braddy')]: 'CEO of Coinbase',
  [optimized('brian')]: 'CEO of Airbnb',
  [optimized('demmy')]: 'Head AI Researcher'
};

export const heroPeople = [
  optimized('jensen'),
  optimized('elon_musk'),
  optimized('dario_amodei'),
  optimized('ilya_sutskever'),
  optimized('marc_andreessen'),
  optimized('peter_thiel'),
  optimized('chamath_palihapitiya'),
  optimized('jamie_dimon'),
  optimized('ray_dalio'),
  optimized('reid_hoffman'),
  optimized('aravind_srinivas'),
  optimized('michael_truell'),
  optimized('mati_staniszewski'),
  optimized('palmer_luckey'),
  optimized('tim_ellis'),
  optimized('brett_adcock'),
  optimized('satya'),
  optimized('sammy'),
  optimized('zuckerberg'),
  optimized('karp'),
  optimized('bill'),
  optimized('braddy'),
  optimized('brian'),
  optimized('demmy')
];

const hashToUnit = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
};

const lerp = (a, b, t) => a + (b - a) * t;

export default function HeroCarousel({ people: peopleOverride }) {
  const prefersReducedMotion = useReducedMotion();
  const sceneRef = useRef(null);
  const laneRef = useRef(null);
  const itemRefs = useRef([]);
  const imgRefs = useRef([]);

  const sourceList = useMemo(
    () => (peopleOverride && peopleOverride.length > 0 ? peopleOverride : heroPeople),
    [peopleOverride]
  );

  const people = useMemo(() => {
    const sizePreset = { heightMin: 420, heightMax: 540 };
    return sourceList.map((src, index) => {
      const featuredStyle = featuredStyleBySrc[src];
      const unit = hashToUnit(src);
      const defaultY = Math.round(lerp(-12, 22, unit));
      const defaultScale = Number(lerp(0.84, 1.12, unit).toFixed(3));
      const defaultHeightMul = Number(lerp(0.9, 1.2, unit).toFixed(3));
      const defaultShiftX = Math.round(lerp(-60, 20, unit));
      const y = featuredStyle?.y ?? defaultY;
      const scale = featuredStyle?.scale ?? defaultScale;
      const height = Math.round(sizePreset.heightMax * (featuredStyle?.heightMul ?? defaultHeightMul));

      return {
        id: `${src}-${index}`,
        src,
        y,
        scale,
        height,
        shiftX: featuredStyle?.shiftX ?? defaultShiftX
      };
    });
  }, [sourceList]);

  useEffect(() => {
    const scene = sceneRef.current;
    const lane = laneRef.current;
    if (!scene || !lane) return;

    const track = lane.querySelector('.hero-carousel-track');
    if (!track) return;

    const decodeImage = async (img) => {
      try {
        if (img && typeof img.decode === 'function') await img.decode();
      } catch {
        // ignore
      }
    };

    const laneState = {
      lane,
      track,
      duration: 115,
      direction: 'normal',
      gap: 180,
      items: [],
      offset: 0,
      total: 1,
      speed: 0
    };

    const layoutCacheKey = () => {
      if (typeof window === 'undefined') return null;
      const bucket = Math.round(window.innerWidth / 120) * 120;
      return `hero-carousel-widths-v1-${bucket}`;
    };

    const readLayoutCache = () => {
      const key = layoutCacheKey();
      if (!key || typeof window === 'undefined') return null;
      try {
        const raw = window.sessionStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    };

    const writeLayoutCache = (widths) => {
      const key = layoutCacheKey();
      if (!key || typeof window === 'undefined') return;
      try {
        window.sessionStorage.setItem(key, JSON.stringify({ widths }));
      } catch {
        // ignore
      }
    };

    laneState.items = people
      .map((person, index) => {
        const el = itemRefs.current[index];
        const img = imgRefs.current[index];
        if (!el || !img) return null;
        return {
          ...person,
          el,
          img,
          x: 0,
          width: 0,
          baseX: 0
        };
      })
      .filter(Boolean);

    const positionLane = () => {
      const total = laneState.total || 1;
      const viewportW = laneState.viewportW ?? laneState.lane.getBoundingClientRect().width;
      const buffer = laneState.buffer ?? Math.round(clamp(viewportW * 0.12, 180, 420));

      laneState.items.forEach((item) => {
        let x = (item.baseX ?? 0) + (item.shiftX ?? 0) + laneState.offset;

        while (x + item.width < -buffer) x += total;
        while (x > viewportW + buffer) x -= total;

        item.x = x;
        item.el.style.setProperty('--x', `${x}px`);
      });
    };

    const layoutLane = () => {
      const laneRect = laneState.lane.getBoundingClientRect();
      const viewportW = laneRect.width;
      laneState.viewportW = viewportW;
      laneState.buffer = Math.round(clamp(viewportW * 0.12, 180, 420));

      const gap = Math.round(clamp(window.innerWidth * 0.02, 28, 60));
      laneState.gap = gap;

      const maxW = Math.round(clamp(window.innerWidth * 0.28, 260, 420));
      let x = Math.round(clamp(window.innerWidth * 0.03, 18, 44));

      const widthsForCache = {};

      laneState.items.forEach((item) => {
        if (maxW) item.el.style.maxWidth = `${maxW}px`;
        item.width = Math.ceil(item.el.getBoundingClientRect().width) || 280;
        item.baseX = x;
        const extraGap = featuredExtraGapAfterBySrc[item.src] ?? 0;
        x += item.width + gap + extraGap;
        widthsForCache[item.src] = item.width;
      });

      laneState.total = Math.max(1, x);
      laneState.offset = ((((laneState.offset ?? 0) % laneState.total) + laneState.total) % laneState.total);
      laneState.speed = laneState.total / laneState.duration;
      positionLane();
      writeLayoutCache(widthsForCache);
    };

    const applyCachedLayout = () => {
      const cache = readLayoutCache();
      const cachedWidths = cache?.widths ?? {};
      if (!laneState.items.length) return;

      const laneRect = laneState.lane.getBoundingClientRect();
      const viewportW = laneRect.width;
      laneState.viewportW = viewportW;
      laneState.buffer = Math.round(clamp(viewportW * 0.12, 180, 420));

      const gap = Math.round(clamp(window.innerWidth * 0.02, 28, 60));
      laneState.gap = gap;
      const maxW = Math.round(clamp(window.innerWidth * 0.28, 260, 420));
      let x = Math.round(clamp(window.innerWidth * 0.03, 18, 44));

      laneState.items.forEach((item) => {
        if (maxW) item.el.style.maxWidth = `${maxW}px`;
        const cachedWidth = cachedWidths[item.src];
        const fallbackWidth = Math.round((item.height ?? 420) * 0.68);
        const width = Math.min(maxW ?? fallbackWidth, cachedWidth ?? fallbackWidth);
        item.width = width;
        item.baseX = x;
        const extraGap = featuredExtraGapAfterBySrc[item.src] ?? 0;
        x += item.width + gap + extraGap;
      });

      laneState.total = Math.max(1, x);
      laneState.offset = ((((laneState.offset ?? 0) % laneState.total) + laneState.total) % laneState.total);
      laneState.speed = laneState.total / laneState.duration;
      positionLane();
    };

    const layoutAll = async () => {
      await Promise.all(laneState.items.map((item) => decodeImage(item.img)));
      await new Promise((resolve) => requestAnimationFrame(resolve));
      layoutLane();
    };

    const lowPower =
      typeof navigator !== 'undefined' &&
      ((navigator.deviceMemory && navigator.deviceMemory <= 4) ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4));

    let rafId = 0;
    let lastT = performance.now();
    let lastFrame = 0;
    let isReady = false;
    let inView = true;
    const frameInterval = lowPower ? 1000 / 30 : 0;
    const dragState = {
      dragging: false,
      pointerId: null,
      startX: 0,
      laneOffset: 0
    };

    const tick = (now) => {
      if (frameInterval && now - lastFrame < frameInterval) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      lastFrame = now;

      if (!dragState.dragging) {
        const dir = laneState.direction === 'reverse' ? 1 : -1;
        const dx = dir * laneState.speed * dt;
        laneState.offset += dx;
        positionLane();
      }

      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (prefersReducedMotion || rafId || !isReady || !inView) return;
      lastT = performance.now();
      lastFrame = 0;
      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!rafId) return;
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const scheduleStart = () => {
      const schedule = window.requestIdleCallback
        ? (cb) => window.requestIdleCallback(cb, { timeout: 800 })
        : (cb) => window.setTimeout(cb, 120);
      schedule(() => {
        layoutAll().then(() => {
          isReady = true;
          start();
        });
      });
    };

    applyCachedLayout();
    track.classList.add('is-ready');
    scheduleStart();

    const onResize = () => {
      layoutLane();
    };

    const onPointerDown = (event) => {
      if (prefersReducedMotion) return;
      if (event.button !== 0 && event.pointerType !== 'touch') return;
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest('.hero-carousel-lane')) return;

      dragState.dragging = true;
      dragState.pointerId = event.pointerId;
      dragState.startX = event.clientX;
      dragState.laneOffset = laneState.offset;
      scene.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event) => {
      if (!dragState.dragging) return;
      if (dragState.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - dragState.startX;
      laneState.offset = dragState.laneOffset + deltaX;
      positionLane();
    };

    const endDrag = (event) => {
      if (!dragState.dragging) return;
      if (dragState.pointerId !== event.pointerId) return;
      dragState.dragging = false;
      dragState.pointerId = null;
      lastT = performance.now();
      try {
        scene.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
          (entries) => {
            const visible = entries.some((entry) => entry.isIntersecting);
            inView = visible;
            if (visible) start();
            else stop();
          },
          { threshold: 0.15 }
        )
        : null;

    if (observer) observer.observe(scene);

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    scene.addEventListener('pointerdown', onPointerDown);
    scene.addEventListener('pointermove', onPointerMove);
    scene.addEventListener('pointerup', endDrag);
    scene.addEventListener('pointercancel', endDrag);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      scene.removeEventListener('pointerdown', onPointerDown);
      scene.removeEventListener('pointermove', onPointerMove);
      scene.removeEventListener('pointerup', endDrag);
      scene.removeEventListener('pointercancel', endDrag);
      if (observer) observer.disconnect();
      stop();
    };
  }, [people, prefersReducedMotion]);

  return (
    <motion.div
      className="parallax-container"
      ref={sceneRef}
      aria-hidden="true"
      initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.35 }}
    >
      <div
        className="hero-carousel-lane"
        ref={laneRef}
        data-lane="featured"
        style={{ bottom: `-${featuredBottomOffsetPx}px`, zIndex: 5 }}
      >
        <div className="hero-carousel-track">
          {people.map((person, index) => (
            <motion.div
              className="hero-person"
              key={person.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              style={{
                '--x': '0px',
                '--y': `${person.y}px`,
                '--r': '0deg',
                '--s': person.scale,
                '--h': `${person.height}px`
              }}
              whileHover="hover"
              initial="rest"
            >
              <img
                src={person.src}
                alt=""
                loading="eager"
                decoding="async"
                fetchPriority={index < 4 ? 'high' : 'low'}
                draggable={false}
                ref={(el) => {
                  imgRefs.current[index] = el;
                }}
              />
              <motion.div
                className="person-tooltip"
                variants={{
                  rest: { opacity: 0, y: 10, scale: 0.9 },
                  hover: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {personTitles[person.src] || ''}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
