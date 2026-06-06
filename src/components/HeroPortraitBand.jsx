import { useEffect, useRef } from 'react';

const webp = (stem) => `/hero/people-optimized-webp/${stem}.webp`;

export const trackedPeople = [
  { stem: 'jensen', name: 'Jensen Huang', role: 'NVIDIA' },
  { stem: 'sammy', name: 'Sam Altman', role: 'OpenAI' },
  { stem: 'dario_amodei', name: 'Dario Amodei', role: 'Anthropic' },
  { stem: 'satya', name: 'Satya Nadella', role: 'Microsoft' },
  { stem: 'elon_musk', name: 'Elon Musk', role: 'Tesla / xAI' },
  { stem: 'demmy', name: 'Demis Hassabis', role: 'DeepMind' },
  { stem: 'karp', name: 'Alex Karp', role: 'Palantir' },
  { stem: 'marc_andreessen', name: 'Marc Andreessen', role: 'a16z' },
  { stem: 'peter_thiel', name: 'Peter Thiel', role: 'Founders Fund' },
  { stem: 'ilya_sutskever', name: 'Ilya Sutskever', role: 'SSI' },
  { stem: 'michael_truell', name: 'Michael Truell', role: 'Cursor' },
  { stem: 'palmer_luckey', name: 'Palmer Luckey', role: 'Anduril' },
  { stem: 'aravind_srinivas', name: 'Aravind Srinivas', role: 'Perplexity' },
  { stem: 'brett_adcock', name: 'Brett Adcock', role: 'Figure' },
  { stem: 'zuckerberg', name: 'Mark Zuckerberg', role: 'Meta' },
  { stem: 'jamie_dimon', name: 'Jamie Dimon', role: 'JPMorgan' },
  { stem: 'ray_dalio', name: 'Ray Dalio', role: 'Bridgewater' },
  { stem: 'reid_hoffman', name: 'Reid Hoffman', role: 'LinkedIn' },
  { stem: 'mati_staniszewski', name: 'Mati Staniszewski', role: 'ElevenLabs' },
  { stem: 'braddy', name: 'Brian Armstrong', role: 'Coinbase' },
  { stem: 'tim_ellis', name: 'Tim Ellis', role: 'Relativity' },
  { stem: 'brian', name: 'Brian Chesky', role: 'Airbnb' },
  { stem: 'chamath_palihapitiya', name: 'Chamath Palihapitiya', role: 'Social Capital' },
  { stem: 'bill', name: 'Bill Gates', role: 'Gates Foundation' }
];

function Tile({ person }) {
  return (
    <figure className="op-tile">
      <div className="op-tile-img">
        <img
          src={webp(person.stem)}
          alt={`${person.name}, ${person.role}, a leader tracked by The Conviction Index`}
          loading="lazy"
          decoding="async"
          draggable={false}
          width="720"
          height="540"
        />
      </div>
      <figcaption className="op-tile-cap">
        <span className="op-tile-name">{person.name}</span>
        <span className="op-tile-role">{person.role}</span>
      </figcaption>
    </figure>
  );
}

// Matches the prior CSS feel: full loop (one copy width) in ~80s.
const LOOP_DURATION_S = 80;
const DRAG_THRESHOLD = 4;

export default function HeroPortraitBand({ prefersReducedMotion }) {
  const loop = [...trackedPeople, ...trackedPeople];
  const bandRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const band = bandRef.current;
    const track = trackRef.current;
    if (!band || !track) return;

    let half = 0; // width of one copy of the people list
    let offset = 0; // current translateX magnitude (px)
    let autoSpeed = 0; // steady auto-scroll velocity (px/sec)
    let velocity = 0; // current velocity used during inertia (px/sec)
    let dragging = false;
    let startX = 0;
    let startOffset = 0;
    let lastX = 0;
    let lastT = 0;
    let activePointer = null;
    let rafId = 0;
    let prevFrameT = 0;

    const wrap = (value) => {
      if (half <= 0) return value;
      let v = value % half;
      if (v < 0) v += half;
      return v;
    };

    const measure = () => {
      half = track.scrollWidth / 2;
      autoSpeed = half > 0 ? half / LOOP_DURATION_S : 0;
      if (!dragging) velocity = autoSpeed;
      offset = wrap(offset);
    };

    measure();
    velocity = autoSpeed;

    const tick = (t) => {
      if (!prevFrameT) prevFrameT = t;
      const dt = Math.min((t - prevFrameT) / 1000, 0.05);
      prevFrameT = t;

      if (!dragging) {
        // Ease velocity back toward the steady auto-scroll speed (inertia decay).
        velocity += (autoSpeed - velocity) * (1 - Math.exp(-dt / 0.45));
        offset = wrap(offset + velocity * dt);
        track.style.transform = `translateX(${-offset}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    const onPointerDown = (e) => {
      if (e.button != null && e.button !== 0 && e.pointerType === 'mouse') return;
      dragging = true;
      activePointer = e.pointerId;
      startX = e.clientX;
      lastX = e.clientX;
      lastT = e.timeStamp;
      startOffset = offset;
      velocity = 0;
      band.classList.add('is-dragging');
      try {
        band.setPointerCapture(e.pointerId);
      } catch (_) {
        /* noop */
      }
    };

    const onPointerMove = (e) => {
      if (!dragging || e.pointerId !== activePointer) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > DRAG_THRESHOLD) e.preventDefault();
      offset = wrap(startOffset - dx);
      track.style.transform = `translateX(${-offset}px)`;

      const dt = (e.timeStamp - lastT) / 1000;
      if (dt > 0) {
        // Dragging right (positive dx) reduces offset, i.e. negative velocity.
        velocity = -(e.clientX - lastX) / dt;
      }
      lastX = e.clientX;
      lastT = e.timeStamp;
    };

    const endDrag = (e) => {
      if (!dragging || (e && e.pointerId !== activePointer)) return;
      dragging = false;
      activePointer = null;
      band.classList.remove('is-dragging');
      // Clamp the flick so a hard swipe still eases gracefully back to steady speed.
      const maxFlick = autoSpeed * 12 + 600;
      velocity = Math.max(-maxFlick, Math.min(maxFlick, velocity));
    };

    band.addEventListener('pointerdown', onPointerDown);
    band.addEventListener('pointermove', onPointerMove);
    band.addEventListener('pointerup', endDrag);
    band.addEventListener('pointercancel', endDrag);

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(measure);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener('resize', onResize);
      band.removeEventListener('pointerdown', onPointerDown);
      band.removeEventListener('pointermove', onPointerMove);
      band.removeEventListener('pointerup', endDrag);
      band.removeEventListener('pointercancel', endDrag);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      className={`op-band${prefersReducedMotion ? '' : ' is-draggable'}`}
      ref={bandRef}
      aria-hidden="true"
    >
      <div
        className={`op-track${prefersReducedMotion ? ' is-static' : ''}`}
        ref={trackRef}
      >
        {loop.map((person, index) => (
          <Tile key={`${person.stem}-${index}`} person={person} />
        ))}
      </div>
    </div>
  );
}
