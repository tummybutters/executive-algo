'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';
import { clamp } from '../utils.js';

const featuredBottomOffsetPx = 28;

const featuredStyleBySrc = {
  '/hero/people/jensen.png': { heightMul: 1.22, scale: 1.06, shiftX: -10 },
  '/hero/people/satya.png': { heightMul: 1.24, scale: 1.06, shiftX: 10 },
  '/hero/people/sammy.png': { heightMul: 0.92, scale: 0.92, shiftX: 0 },
  '/hero/people/karp.png': { heightMul: 1.14, scale: 1.03, y: 25, shiftX: -10 },
  '/hero/people/bill.png': { heightMul: 1.22, scale: 1.08, shiftX: 12 },
  '/hero/people/braddy.png': { heightMul: 1.14, scale: 1.02, y: 140, shiftX: 0 }
};

const featuredExtraGapAfterBySrc = {
  '/hero/people/jensen.png': 140,
  '/hero/people/satya.png': 140
};

const heroPeople = [
  '/hero/people/jensen.png',
  '/hero/people/elon_musk.png',
  '/hero/people/dario_amodei.png',
  '/hero/people/ilya_sutskever.png',
  '/hero/people/marc_andreessen.png',
  '/hero/people/peter_thiel.png',
  '/hero/people/chamath_palihapitiya.png',
  '/hero/people/jamie_dimon.png',
  '/hero/people/ray_dalio.png',
  '/hero/people/reid_hoffman.png',
  '/hero/people/aravind_srinivas.png',
  '/hero/people/michael_truell.png',
  '/hero/people/mati_staniszewski.png',
  '/hero/people/bret_taylor.png',
  '/hero/people/palmer_luckey.png',
  '/hero/people/tim_ellis.png',
  '/hero/people/brett_adcock.png',
  '/hero/people/satya.png',
  '/hero/people/sammy.png',
  '/hero/people/zuckerberg.png',
  '/hero/people/karp.png',
  '/hero/people/bill.png',
  '/hero/people/braddy.png',
  '/hero/people/brian.png',
  '/hero/people/demmy.png'
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

export default function HeroCarousel() {
  const prefersReducedMotion = useReducedMotion();
  const sceneRef = useRef(null);
  const laneRef = useRef(null);
  const itemRefs = useRef([]);
  const imgRefs = useRef([]);

  const people = useMemo(() => {
    const sizePreset = { heightMin: 420, heightMax: 540 };
    return heroPeople.map((src, index) => {
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
  }, []);

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
      const laneRect = laneState.lane.getBoundingClientRect();
      const viewportW = laneRect.width;
      const buffer = Math.round(clamp(viewportW * 0.12, 180, 420));

      laneState.items.forEach((item) => {
        let x = (item.baseX ?? 0) + (item.shiftX ?? 0) + laneState.offset;

        while (x + item.width < -buffer) x += total;
        while (x > viewportW + buffer) x -= total;

        item.x = x;
        item.el.style.setProperty('--x', `${x}px`);
      });
    };

    const layoutLane = () => {
      const gap = Math.round(clamp(window.innerWidth * 0.02, 28, 60));
      laneState.gap = gap;

      const maxW = Math.round(clamp(window.innerWidth * 0.28, 260, 420));
      let x = Math.round(clamp(window.innerWidth * 0.03, 18, 44));

      laneState.items.forEach((item) => {
        if (maxW) item.el.style.maxWidth = `${maxW}px`;
        item.width = Math.ceil(item.el.getBoundingClientRect().width) || 280;
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

    let rafId = 0;
    let lastT = performance.now();
    const dragState = {
      dragging: false,
      pointerId: null,
      startX: 0,
      laneOffset: 0
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      if (!dragState.dragging) {
        const dir = laneState.direction === 'reverse' ? 1 : -1;
        const dx = dir * laneState.speed * dt;
        laneState.offset += dx;
        positionLane();
      }

      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!prefersReducedMotion) rafId = requestAnimationFrame(tick);
    };

    layoutAll().then(start);

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

    window.addEventListener('resize', onResize, { passive: true });
    scene.addEventListener('pointerdown', onPointerDown);
    scene.addEventListener('pointermove', onPointerMove);
    scene.addEventListener('pointerup', endDrag);
    scene.addEventListener('pointercancel', endDrag);

    return () => {
      window.removeEventListener('resize', onResize);
      scene.removeEventListener('pointerdown', onPointerDown);
      scene.removeEventListener('pointermove', onPointerMove);
      scene.removeEventListener('pointerup', endDrag);
      scene.removeEventListener('pointercancel', endDrag);
      if (rafId) cancelAnimationFrame(rafId);
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
            <div
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
            >
              <img
                src={person.src}
                alt=""
                loading="eager"
                decoding="async"
                draggable={false}
                ref={(el) => {
                  imgRefs.current[index] = el;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
