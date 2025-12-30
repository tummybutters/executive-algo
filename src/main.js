import { initNewsletterForms } from './newsletter.js';

document.addEventListener('DOMContentLoaded', () => {
  const scene = document.getElementById('parallax-scene');
  const bubbleCanvas = document.getElementById('bubble-canvas');

  // Initialize newsletter forms (uses server proxy at /api/subscribe)
  initNewsletterForms();

  const mulberry32 = (seed) => {
    let t = seed;
    return () => {
      t += 0x6D2B79F5;
      let x = Math.imul(t ^ (t >>> 15), 1 | t);
      x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const initHeroCarousel = () => {
    if (!scene) return;
    scene.replaceChildren();
    scene.setAttribute('aria-hidden', 'true');
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const rng = mulberry32(1337);

    // Single featured (bottom) row: include everyone.
    // Order matters for the collage "story" as it loops.
    // Make Satya + Jensen spaced apart as centerpieces, with smaller faces between/around them.
    const featured = [
      { src: '/hero/people/jensen.png' },
      { src: '/hero/people/demmy.png' },
      { src: '/hero/people/brian.png' },
      { src: '/hero/people/karp.png' },
      { src: '/hero/people/satya.png' },
      { src: '/hero/people/sammy.png' },
      { src: '/hero/people/braddy.png' },
      { src: '/hero/people/bill.png' },
      { src: '/hero/people/zuckerberg.png' }
    ];

    const featuredBottomOffsetPx = 28; // tweak 0–50 to taste

    const featuredStyleBySrc = {
      // Centerpieces
      '/hero/people/jensen.png': { heightMul: 1.22, scale: 1.06, shiftX: -10 },
      '/hero/people/satya.png': { heightMul: 1.24, scale: 1.06, shiftX: 10 },
      // Smaller supporting faces
      '/hero/people/sammy.png': { heightMul: 0.92, scale: 0.92, shiftX: 0 },
      // Lower Karp slightly to crop the bottom edge visually.
      '/hero/people/karp.png': { heightMul: 1.14, scale: 1.03, y: 25, shiftX: -10 },
      '/hero/people/bill.png': { heightMul: 1.22, scale: 1.08, shiftX: 12 },
      // Keep Braddy's bottom artifacts out of view.
      '/hero/people/braddy.png': { heightMul: 1.14, scale: 1.02, y: 140, shiftX: 0 }
    };

    // Create extra breathing room around centerpieces without loosening the whole carousel.
    const featuredExtraGapAfterBySrc = {
      '/hero/people/jensen.png': 140,
      '/hero/people/satya.png': 140
    };

    const hashToUnit = (str) => {
      let h = 2166136261;
      for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return (h >>> 0) / 4294967296;
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const lanes = [
      {
        id: 'featured',
        bottom: `-${featuredBottomOffsetPx}px`,
        duration: 115,
        direction: 'normal',
        depth: 0.55,
        size: 'lg',
        zIndex: 5,
        items: featured
      }
    ];

    const waitForImage = (img) =>
      new Promise((resolve) => {
        if (img.complete && img.naturalWidth > 0) {
          resolve();
          return;
        }
        const done = () => resolve();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });

    const decodeImage = async (img) => {
      if (img.complete && img.naturalWidth > 0) return;
      try {
        if (typeof img.decode === 'function') {
          await img.decode();
          return;
        }
      } catch {
        // ignore and fall back to load events
      }
      await waitForImage(img);
    };

    const normalizeOffset = (laneState) => {
      const total = laneState.total;
      if (!Number.isFinite(total) || total <= 0) return;
      laneState.offset = ((laneState.offset % total) + total) % total;
    };

    const createLane = (laneConfig, laneIndex, laneItems) => {
      const lane = document.createElement('div');
      lane.className = 'hero-carousel-lane';
      lane.dataset.lane = laneConfig.id ?? `${laneIndex}`;
      lane.style.bottom = laneConfig.bottom;
      lane.style.setProperty('--depth', laneConfig.depth.toFixed(2));
      lane.style.zIndex = `${laneConfig.zIndex ?? 2 + laneIndex}`;

      const track = document.createElement('div');
      track.className = 'hero-carousel-track';

      const heightFactor = laneConfig.id === 'secondary' ? 0.6 : 1;
      const sizePreset =
        laneConfig.size === 'lg'
          ? { heightMin: 420 * heightFactor, heightMax: 540 * heightFactor, scaleMin: 0.98, scaleMax: 1.12 }
          : laneConfig.size === 'md'
            ? { heightMin: 340 * heightFactor, heightMax: 460 * heightFactor, scaleMin: 0.92, scaleMax: 1.06 }
            : { heightMin: 280 * heightFactor, heightMax: 380 * heightFactor, scaleMin: 0.86, scaleMax: 0.98 };

      const itemStates = laneItems.map((person) => {
        const featuredStyle = featuredStyleBySrc[person.src];
        const unit = hashToUnit(person.src);
        const defaultY = Math.round(lerp(-12, 22, unit));
        const defaultScale = Number(lerp(0.84, 1.12, unit).toFixed(3));
        const defaultHeightMul = Number(lerp(0.9, 1.2, unit).toFixed(3));
        const defaultShiftX = Math.round(lerp(-60, 20, unit));

        const y = featuredStyle?.y ?? defaultY;
        const rotate = 0;
        const scale =
          laneConfig.id === 'featured' && featuredStyle
            ? featuredStyle.scale
            : defaultScale;
        const heightBase =
          laneConfig.id === 'featured'
            ? sizePreset.heightMax
            : sizePreset.heightMin + rng() * (sizePreset.heightMax - sizePreset.heightMin);
        const height =
          laneConfig.id === 'featured' && featuredStyle
            ? Math.round(heightBase * featuredStyle.heightMul)
            : Math.round(heightBase * defaultHeightMul);

        const wrapper = document.createElement('div');
        wrapper.className = 'hero-person';
        wrapper.style.setProperty('--y', `${y}px`);
        wrapper.style.setProperty('--r', `${rotate.toFixed(2)}deg`);
        wrapper.style.setProperty('--s', scale.toFixed(3));
        wrapper.style.setProperty('--h', `${height}px`);
        wrapper.style.zIndex = `${Math.round(scale * 1000)}`;

        const img = document.createElement('img');
        img.src = person.src;
        img.alt = '';
        img.loading = 'eager';
        img.decoding = 'async';
        img.draggable = false;

        wrapper.appendChild(img);
        track.appendChild(wrapper);

        return {
          src: person.src,
          el: wrapper,
          img,
          x: 0,
          width: 0,
          baseX: 0,
          shiftX: featuredStyle?.shiftX ?? defaultShiftX
        };
      });

      lane.appendChild(track);
      scene.appendChild(lane);

      return {
        lane,
        track,
        depth: laneConfig.depth,
        duration: laneConfig.duration,
        direction: laneConfig.direction,
        gap: 180,
        items: itemStates,
        running: true,
        offset: 0,
        total: 1,
        speed: 0
      };
    };

    const laneStates = lanes.map((laneConfig, laneIndex) =>
      createLane(laneConfig, laneIndex, laneConfig.items ?? [])
    );

    const positionLane = (laneState) => {
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

    const layoutLane = (laneState) => {
      const isFeaturedLane = laneState.lane.dataset.lane === 'featured';
      const gap = isFeaturedLane
        ? Math.round(clamp(window.innerWidth * 0.02, 28, 60))
        : Math.round(clamp(window.innerWidth * 0.09, 105, 155));
      laneState.gap = gap;

      const maxW = isFeaturedLane ? Math.round(clamp(window.innerWidth * 0.28, 260, 420)) : null;
      let x = Math.round(clamp(window.innerWidth * 0.03, 18, 44));

      laneState.items.forEach((item) => {
        if (maxW) item.el.style.maxWidth = `${maxW}px`;
        item.width = Math.ceil(item.el.getBoundingClientRect().width) || 280;
        item.baseX = x;
        const extraGap = featuredExtraGapAfterBySrc[item.src] ?? 0;
        x += item.width + gap + extraGap;
      });

      laneState.total = Math.max(1, x);
      normalizeOffset(laneState);
      laneState.speed = laneState.total / laneState.duration;
      positionLane(laneState);
    };

    const layoutAll = async () => {
      await Promise.all(
        laneStates.flatMap((laneState) => laneState.items.map((item) => decodeImage(item.img)))
      );
      await new Promise((resolve) => requestAnimationFrame(resolve));
      laneStates.forEach(layoutLane);
    };

    let rafId = 0;
    let lastT = performance.now();
    const dragState = {
      dragging: false,
      pointerId: null,
      startX: 0,
      laneOffsets: null
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      if (!dragState.dragging) {
        laneStates.forEach((laneState) => {
          const dir = laneState.direction === 'reverse' ? 1 : -1;
          const dx = dir * laneState.speed * dt;

          laneState.offset += dx;
          normalizeOffset(laneState);
          positionLane(laneState);
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    layoutAll().then(() => {
      if (!prefersReducedMotion) rafId = requestAnimationFrame(tick);
    });

    window.addEventListener(
      'resize',
      () => {
        laneStates.forEach(layoutLane);
      },
      { passive: true }
    );

    const onPointerDown = (event) => {
      if (prefersReducedMotion) return;
      if (event.button !== 0 && event.pointerType !== 'touch') return;
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest('.hero-carousel-lane')) return;

      dragState.dragging = true;
      dragState.pointerId = event.pointerId;
      dragState.startX = event.clientX;
      dragState.laneOffsets = laneStates.map((laneState) => laneState.offset);
      scene.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event) => {
      if (!dragState.dragging) return;
      if (dragState.pointerId !== event.pointerId) return;
      if (!dragState.laneOffsets) return;

      const deltaX = event.clientX - dragState.startX;
      laneStates.forEach((laneState, laneIndex) => {
        const startOffset = dragState.laneOffsets?.[laneIndex];
        if (typeof startOffset !== 'number') return;
        laneState.offset = startOffset + deltaX;
        normalizeOffset(laneState);
        positionLane(laneState);
      });
    };

    const endDrag = (event) => {
      if (!dragState.dragging) return;
      if (dragState.pointerId !== event.pointerId) return;
      dragState.dragging = false;
      dragState.pointerId = null;
      dragState.laneOffsets = null;
      lastT = performance.now();
      try {
        scene.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    };

    scene.addEventListener('pointerdown', onPointerDown);
    scene.addEventListener('pointermove', onPointerMove);
    scene.addEventListener('pointerup', endDrag);
    scene.addEventListener('pointercancel', endDrag);
  };

  initHeroCarousel();

  const initBubbleWorld = () => {
    if (!(bubbleCanvas instanceof HTMLCanvasElement)) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = bubbleCanvas.getContext('2d');
    if (!ctx) return;

    const rng = mulberry32(909090);
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    const palette = {
      glow: 'rgba(110, 190, 255, 0.18)',
      stroke: 'rgba(255,255,255,0.14)',
      fill: 'rgba(255,255,255,0.03)',
      fillStrong: 'rgba(255,255,255,0.06)',
      text: 'rgba(255,255,255,0.78)',
      textMuted: 'rgba(255,255,255,0.55)',
      line: 'rgba(160, 200, 255, 0.32)',
      lineStrong: 'rgba(200, 230, 255, 0.55)'
    };

    const nodes = [
      { id: 'OpenAI', label: 'OpenAI', kind: 'lab', size: 'lg' },
      { id: 'DeepMind', label: 'DeepMind', kind: 'lab', size: 'lg' },
      { id: 'Anthropic', label: 'Anthropic', kind: 'lab', size: 'md' },
      { id: 'NVIDIA', label: 'NVIDIA', kind: 'platform', size: 'lg' },
      { id: 'Microsoft', label: 'Microsoft', kind: 'platform', size: 'md' },
      { id: 'Google', label: 'Google', kind: 'platform', size: 'md' },
      { id: 'Meta', label: 'Meta', kind: 'platform', size: 'md' },
      { id: 'Amazon', label: 'Amazon', kind: 'platform', size: 'sm' },
      { id: 'Apple', label: 'Apple', kind: 'platform', size: 'sm' },
      { id: 'Anduril', label: 'Anduril', kind: 'defense', size: 'md' },
      { id: 'Neuralink', label: 'Neuralink', kind: 'frontier', size: 'sm' },
      { id: 'CRISPR', label: 'CRISPR', kind: 'frontier', size: 'sm' },
      { id: 'Longevity', label: 'Longevity', kind: 'frontier', size: 'sm' },
      { id: 'Robotics', label: 'Robotics', kind: 'frontier', size: 'sm' },
      { id: 'Sequoia', label: 'Sequoia', kind: 'capital', size: 'md' },
      { id: 'a16z', label: 'a16z', kind: 'capital', size: 'md' },
      { id: 'Benchmark', label: 'Benchmark', kind: 'capital', size: 'sm' },
      { id: 'Norges', label: 'Norges', kind: 'capital', size: 'sm' },
      { id: 'Demis', label: 'Demis', kind: 'person', size: 'sm' },
      { id: 'Noam Brown', label: 'Noam Brown', kind: 'person', size: 'sm' },
      { id: 'Sam Altman', label: 'Sam Altman', kind: 'person', size: 'sm' },
      { id: 'Dario Amodei', label: 'Dario Amodei', kind: 'person', size: 'sm' },
      { id: 'Jensen Huang', label: 'Jensen', kind: 'person', size: 'sm' },
      { id: 'Satya Nadella', label: 'Satya', kind: 'person', size: 'sm' },
      { id: 'Sundar Pichai', label: 'Sundar', kind: 'person', size: 'sm' },
      { id: 'Mark Zuckerberg', label: 'Zuck', kind: 'person', size: 'sm' },
      { id: 'Palmer Luckey', label: 'Palmer', kind: 'person', size: 'sm' },
      { id: 'Cursor', label: 'Cursor', kind: 'builder', size: 'sm' },
      { id: 'ElevenLabs', label: 'ElevenLabs', kind: 'builder', size: 'sm' },
      { id: 'Scale AI', label: 'Scale', kind: 'builder', size: 'sm' },
      { id: 'Databricks', label: 'Databricks', kind: 'builder', size: 'sm' },
      { id: 'Regulation', label: 'Regulation', kind: 'institution', size: 'sm' },
      { id: 'Labor', label: 'Labor', kind: 'institution', size: 'sm' },
      { id: 'Government', label: 'Government', kind: 'institution', size: 'sm' }
    ];

    // Add filler unlabeled bubbles to keep density up without annotating everything.
    const fillerCount = 18;
    for (let i = 0; i < fillerCount; i++) {
      nodes.push({ id: `f-${i}`, label: '', kind: 'filler', size: rng() < 0.18 ? 'md' : 'sm' });
    }

    const links = new Map([
      ['OpenAI', ['Noam Brown', 'Sam Altman', 'Microsoft', 'NVIDIA', 'Sequoia', 'a16z']],
      ['DeepMind', ['Demis', 'Google', 'NVIDIA', 'CRISPR', 'Robotics']],
      ['Anthropic', ['Dario Amodei', 'Amazon', 'Google', 'a16z']],
      ['NVIDIA', ['Jensen Huang', 'OpenAI', 'DeepMind', 'Microsoft', 'Amazon']],
      ['Microsoft', ['Satya Nadella', 'OpenAI', 'NVIDIA']],
      ['Google', ['Sundar Pichai', 'DeepMind']],
      ['Meta', ['Mark Zuckerberg', 'Scale AI', 'Databricks']],
      ['Anduril', ['Palmer Luckey', 'Sequoia', 'Government']],
      ['Sequoia', ['OpenAI', 'Anduril', 'Cursor']],
      ['a16z', ['OpenAI', 'Anthropic', 'ElevenLabs']]
    ]);

    const byId = new Map();

    const sizeToRadius = (size) => {
      if (size === 'lg') return 66 + rng() * 10;
      if (size === 'md') return 38 + rng() * 8;
      return 18 + rng() * 7;
    };

    const kindTint = (kind) => {
      if (kind === 'capital') return [110, 160, 255];
      if (kind === 'platform') return [140, 200, 255];
      if (kind === 'lab') return [120, 210, 255];
      if (kind === 'builder') return [170, 230, 255];
      if (kind === 'defense') return [120, 170, 230];
      if (kind === 'institution') return [120, 120, 140];
      if (kind === 'person') return [210, 235, 255];
      return [160, 190, 220];
    };

    const state = {
      w: 0,
      h: 0,
      dpr: 1,
      rafId: 0,
      t: 0,
      hoveredId: null,
      pointer: { x: 0, y: 0, inside: false }
    };

    const bodies = nodes.map((n) => {
      const r = sizeToRadius(n.size);
      const [tr, tg, tb] = kindTint(n.kind);
      const body = {
        ...n,
        x: 0,
        y: 0,
        vx: (rng() - 0.5) * 0.5,
        vy: (rng() - 0.5) * 0.5,
        r,
        tr,
        tg,
        tb,
        labelOnHover: n.label && n.label.length > 0 && n.id[0] !== 'f'
      };
      byId.set(n.id, body);
      return body;
    });

    const resize = () => {
      const rect = bubbleCanvas.getBoundingClientRect();
      state.dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
      state.w = Math.max(1, Math.floor(rect.width));
      state.h = Math.max(1, Math.floor(rect.height));

      bubbleCanvas.width = Math.floor(state.w * state.dpr);
      bubbleCanvas.height = Math.floor(state.h * state.dpr);
      bubbleCanvas.style.width = `${state.w}px`;
      bubbleCanvas.style.height = `${state.h}px`;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

      // Initial scatter with mild left->right gradient.
      bodies.forEach((b, i) => {
        if (b.x !== 0 || b.y !== 0) return;
        const col = (i / Math.max(1, bodies.length - 1)) * 0.7 + 0.15;
        b.x = col * state.w + (rng() - 0.5) * state.w * 0.18;
        b.y = (0.5 + (rng() - 0.5) * 0.7) * state.h;
      });
    };

    const findHover = () => {
      if (!state.pointer.inside) return null;
      const px = state.pointer.x;
      const py = state.pointer.y;
      let best = null;
      let bestD = Infinity;
      for (const b of bodies) {
        const dx = px - b.x;
        const dy = py - b.y;
        const d = Math.hypot(dx, dy);
        if (d <= b.r && d < bestD) {
          best = b.id;
          bestD = d;
        }
      }
      return best;
    };

    const step = (dt) => {
      const { w, h } = state;
      const pad = 18;

      // Gentle drift + bounds.
      for (const b of bodies) {
        const drift = 0.12;
        b.vx += (rng() - 0.5) * drift * dt;
        b.vy += (rng() - 0.5) * drift * dt;
        b.vx *= 0.985;
        b.vy *= 0.985;

        b.x += b.vx * 60 * dt;
        b.y += b.vy * 60 * dt;

        if (b.x < pad + b.r) (b.x = pad + b.r), (b.vx *= -0.6);
        if (b.x > w - pad - b.r) (b.x = w - pad - b.r), (b.vx *= -0.6);
        if (b.y < pad + b.r) (b.y = pad + b.r), (b.vy *= -0.6);
        if (b.y > h - pad - b.r) (b.y = h - pad - b.r), (b.vy *= -0.6);
      }

      // Soft collisions (repel).
      const repel = 0.55;
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.max(0.001, Math.hypot(dx, dy));
          const minDist = a.r + b.r + 10;
          if (dist >= minDist) continue;
          const overlap = minDist - dist;
          const nx = dx / dist;
          const ny = dy / dist;
          const push = overlap * repel * 0.03;
          a.vx -= nx * push;
          a.vy -= ny * push;
          b.vx += nx * push;
          b.vy += ny * push;
        }
      }

      const hovered = findHover();
      state.hoveredId = hovered;
    };

    const drawBubble = (b, isHovered, emphasis) => {
      const { x, y, r, tr, tg, tb } = b;
      const glowR = r * (isHovered ? 1.85 : 1.55);

      const grad = ctx.createRadialGradient(x - r * 0.25, y - r * 0.3, r * 0.25, x, y, glowR);
      grad.addColorStop(0, `rgba(${tr}, ${tg}, ${tb}, ${0.14 + 0.06 * emphasis})`);
      grad.addColorStop(0.45, `rgba(${tr}, ${tg}, ${tb}, ${0.06 + 0.04 * emphasis})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, glowR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isHovered ? palette.fillStrong : palette.fill;
      ctx.strokeStyle = isHovered ? 'rgba(255,255,255,0.22)' : palette.stroke;
      ctx.lineWidth = isHovered ? 1.5 : 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Specular highlight.
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,255,255,${isHovered ? 0.18 : 0.12})`;
      ctx.lineWidth = 1;
      ctx.arc(x - r * 0.16, y - r * 0.18, r * 0.78, -1.15, -0.35);
      ctx.stroke();
    };

    const drawLabel = (text, x, y, alpha, sizePx) => {
      if (!text) return;
      ctx.font = `600 ${sizePx}px Outfit, system-ui, -apple-system, Segoe UI, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillText(text, x, y);
    };

    const draw = (now) => {
      state.t = now;
      ctx.clearRect(0, 0, state.w, state.h);

      // Subtle vignette.
      const vignette = ctx.createRadialGradient(state.w * 0.5, state.h * 0.55, Math.min(state.w, state.h) * 0.2, state.w * 0.5, state.h * 0.55, Math.max(state.w, state.h) * 0.7);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.78)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, state.w, state.h);

      const hoveredId = state.hoveredId;
      const hovered = hoveredId ? byId.get(hoveredId) : null;
      const related = hovered ? (links.get(hovered.id) ?? []) : [];
      const relatedBodies = related.map((id) => byId.get(id)).filter(Boolean);

      // Relationship lines.
      if (hovered) {
        for (const other of relatedBodies) {
          ctx.strokeStyle = other.kind === 'capital' ? palette.lineStrong : palette.line;
          ctx.lineWidth = other.kind === 'capital' ? 1.6 : 1.1;
          ctx.beginPath();
          ctx.moveTo(hovered.x, hovered.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }

      // Bubbles (draw non-hover first).
      for (const b of bodies) {
        const isHovered = hovered && b.id === hovered.id;
        const isRelated = hovered && related.includes(b.id);
        const emphasis = isHovered ? 1.0 : isRelated ? 0.85 : 0.35;
        drawBubble(b, isHovered, emphasis);
      }

      // Hover labels (only on hover / related).
      if (hovered) {
        drawLabel(hovered.label || hovered.id, hovered.x, hovered.y, 0.92, Math.round(clamp(hovered.r * 0.22, 12, 16)));
        for (const other of relatedBodies) {
          if (!other.labelOnHover) continue;
          drawLabel(other.label || other.id, other.x, other.y, 0.78, 12);
        }

        // Satellite bubble orbiting around hovered.
        const orbitR = hovered.r + clamp(26 + hovered.r * 0.18, 26, 44);
        const theta = now * 0.0012;
        const sx = hovered.x + Math.cos(theta) * orbitR;
        const sy = hovered.y + Math.sin(theta) * orbitR;
        const satText = related.length ? related[Math.floor((now / 1400) % related.length)] : hovered.id;
        const satR = clamp(hovered.r * 0.32, 14, 22);

        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(hovered.x, hovered.y, orbitR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        drawBubble({ ...hovered, x: sx, y: sy, r: satR, tr: 210, tg: 240, tb: 255 }, true, 1.0);
        drawLabel(satText, sx, sy, 0.85, 11);
      }

      // Caption hint (cursor).
      bubbleCanvas.style.cursor = hovered ? 'pointer' : 'default';
    };

    const tick = (now) => {
      const dt = 1 / 60;
      if (!prefersReducedMotion) step(dt);
      draw(now);
      state.rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (state.rafId) return;
      state.rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!state.rafId) return;
      cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    };

    const onResize = () => {
      resize();
    };

    const toLocal = (event) => {
      const rect = bubbleCanvas.getBoundingClientRect();
      return {
        x: clamp(event.clientX - rect.left, 0, rect.width),
        y: clamp(event.clientY - rect.top, 0, rect.height)
      };
    };

    const onPointerMove = (event) => {
      const p = toLocal(event);
      state.pointer.x = p.x;
      state.pointer.y = p.y;
      state.pointer.inside = true;
    };

    const onPointerLeave = () => {
      state.pointer.inside = false;
      state.hoveredId = null;
    };

    resize();
    draw(performance.now());

    window.addEventListener('resize', onResize, { passive: true });
    bubbleCanvas.addEventListener('pointermove', onPointerMove, { passive: true });
    bubbleCanvas.addEventListener('pointerleave', onPointerLeave, { passive: true });

    const hostSection = bubbleCanvas.closest('section');
    const observer =
      hostSection && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
          (entries) => {
            const visible = entries.some((e) => e.isIntersecting);
            if (visible) start();
            else stop();
          },
          { threshold: 0.08 }
        )
        : null;

    if (observer && hostSection) observer.observe(hostSection);
    else start();

    return () => {
      window.removeEventListener('resize', onResize);
      bubbleCanvas.removeEventListener('pointermove', onPointerMove);
      bubbleCanvas.removeEventListener('pointerleave', onPointerLeave);
      if (observer && hostSection) observer.unobserve(hostSection);
      stop();
    };
  };

  initBubbleWorld();

  // Reveal animations for scroll
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });
});
