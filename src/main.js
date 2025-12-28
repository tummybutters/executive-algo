document.addEventListener('DOMContentLoaded', () => {
  const scene = document.getElementById('parallax-scene');

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

    const people = [
      { src: '/hero/people/braddy.png' },
      { src: '/hero/people/bill.png' },
      { src: '/hero/people/brian.png' },
      { src: '/hero/people/sammy.png' },
      { src: '/hero/people/zuckerberg.png' },
      { src: '/hero/people/jensen.png' },
      { src: '/hero/people/satya.png' },
      { src: '/hero/people/karp.png' },
      { src: '/hero/people/demmy.png' }
    ];

    const rng = mulberry32(1337);

    const featured = [
      { src: '/hero/people/jensen.png' },
      { src: '/hero/people/satya.png' },
      { src: '/hero/people/sammy.png' },
      { src: '/hero/people/braddy.png' }
    ];

    const isFeatured = new Set(featured.map((p) => p.src));
    const secondary = people.filter((p) => !isFeatured.has(p.src));

    const ledgeBottom = '14%';
    const ledgeHeightPx = 56;

    const featuredStyleBySrc = {
      '/hero/people/jensen.png': { heightMul: 1.02, scale: 1.0 },
      '/hero/people/satya.png': { heightMul: 1.12, scale: 1.02 },
      '/hero/people/sammy.png': { heightMul: 1.06, scale: 1.0 },
      '/hero/people/braddy.png': { heightMul: 1.16, scale: 1.04, y: 140 }
    };

    const secondaryBaselineOffsetBySrc = {
      '/hero/people/bill.png': 18,
      '/hero/people/demmy.png': 18
    };

    const lanes = [
      {
        id: 'secondary',
        bottom: `calc(${ledgeBottom} + ${ledgeHeightPx}px)`,
        duration: 140,
        direction: 'normal',
        depth: 0.72,
        size: 'md',
        zIndex: 3,
        items: secondary
      },
      {
        id: 'featured',
        bottom: '-4%',
        duration: 115,
        direction: 'normal',
        depth: 0.55,
        size: 'lg',
        zIndex: 5,
        items: featured
      }
    ];

    const decodeImage = async (img) => {
      try {
        if (typeof img.decode === 'function') await img.decode();
      } catch {
        // ignore
      }
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
        const y =
          laneConfig.id === 'secondary'
            ? secondaryBaselineOffsetBySrc[person.src] ?? 0
            : laneConfig.id === 'featured'
              ? featuredStyle?.y ?? 0
              : 0;
        const rotate = 0;
        const scale =
          laneConfig.id === 'featured' && featuredStyle
            ? featuredStyle.scale
            : sizePreset.scaleMin + rng() * (sizePreset.scaleMax - sizePreset.scaleMin);
        const heightBase =
          laneConfig.id === 'featured'
            ? sizePreset.heightMax
            : sizePreset.heightMin + rng() * (sizePreset.heightMax - sizePreset.heightMin);
        const height =
          laneConfig.id === 'featured' && featuredStyle
            ? Math.round(heightBase * featuredStyle.heightMul)
            : Math.round(heightBase);

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

        return { el: wrapper, img, x: 0, width: 0, baseX: 0 };
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

    const ledge = document.createElement('div');
    ledge.className = 'hero-ledge';
    ledge.style.bottom = ledgeBottom;
    ledge.style.height = `${ledgeHeightPx}px`;
    scene.appendChild(ledge);

    const laneStates = lanes.map((laneConfig, laneIndex) =>
      createLane(laneConfig, laneIndex, laneConfig.items ?? [])
    );

    const positionLane = (laneState) => {
      const total = laneState.total || 1;
      const laneRect = laneState.lane.getBoundingClientRect();
      const viewportW = laneRect.width;
      const buffer = Math.round(clamp(viewportW * 0.12, 180, 420));

      laneState.items.forEach((item) => {
        let x = (item.baseX ?? 0) + laneState.offset;

        while (x + item.width < -buffer) x += total;
        while (x > viewportW + buffer) x -= total;

        item.x = x;
        item.el.style.setProperty('--x', `${x}px`);
      });
    };

    const layoutLane = (laneState) => {
      const isFeaturedLane = laneState.lane.dataset.lane === 'featured';
      const gap = isFeaturedLane
        ? Math.round(clamp(window.innerWidth * 0.06, 95, 130))
        : Math.round(clamp(window.innerWidth * 0.09, 105, 155));
      laneState.gap = gap;

      const slotW = isFeaturedLane ? Math.round(clamp(window.innerWidth * 0.34, 320, 480)) : null;
      let x = Math.round(clamp(window.innerWidth * 0.03, 18, 44));

      laneState.items.forEach((item) => {
        if (slotW) item.el.style.width = `${slotW}px`;
        item.width = (slotW ?? Math.ceil(item.el.getBoundingClientRect().width)) || 280;
        item.baseX = x;
        x += item.width + gap;
      });

      laneState.total = Math.max(1, x);
      laneState.offset = ((((laneState.offset ?? 0) % laneState.total) + laneState.total) % laneState.total);
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
