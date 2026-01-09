import { initNewsletterForms } from './newsletter.js';

document.addEventListener('DOMContentLoaded', () => {
  const scene = document.getElementById('parallax-scene');

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
    // Karpathy + Satya as centerpieces with Demis/Brian around them, then Jensen area, then Brad/Sam/Bill/Zuck
    const featured = [
      { src: '/hero/people/brian.png' },
      { src: '/hero/people/karp.png' },
      { src: '/hero/people/satya.png' },
      { src: '/hero/people/demmy.png' },
      { src: '/hero/people/jensen.png' },
      { src: '/hero/people/sammy.png' },
      { src: '/hero/people/braddy.png' },
      { src: '/hero/people/bill.png' },
      { src: '/hero/people/zuckerberg.png' },
      { src: '/hero/people/demis2.png' }
    ];

    const featuredBottomOffsetPx = 28; // tweak 0–50 to taste

    const featuredStyleBySrc = {
      // Centerpieces - Karpathy and Satya
      '/hero/people/karp.png': { heightMul: 1.26, scale: 1.08, y: 20, shiftX: 0 },
      '/hero/people/satya.png': { heightMul: 1.26, scale: 1.08, shiftX: 10 },
      // Jensen still prominent
      '/hero/people/jensen.png': { heightMul: 1.22, scale: 1.06, shiftX: -10 },
      // Demis and Brian - supporting around centerpieces
      '/hero/people/demmy.png': { heightMul: 1.0, scale: 0.95, shiftX: 0 },
      '/hero/people/brian.png': { heightMul: 1.0, scale: 0.95, shiftX: -50 },
      '/hero/people/demis2.png': { heightMul: 1.2, scale: 1.1, shiftX: 0 },
      // Sam slightly bigger
      '/hero/people/sammy.png': { heightMul: 1.05, scale: 1.0, shiftX: 0 },
      // Brad slightly smaller and moved down 30px to crop bottom
      '/hero/people/braddy.png': { heightMul: 1.42, scale: 1.26, y: 130, shiftX: 0 },
      '/hero/people/bill.png': { heightMul: 1.22, scale: 1.08, shiftX: 12 },
      // Zuck 15% bigger
      '/hero/people/zuckerberg.png': { heightMul: 1.15, scale: 1.15, shiftX: 0 }
    };

    // Create extra breathing room around centerpieces without loosening the whole carousel.
    const featuredExtraGapAfterBySrc = {
      '/hero/people/karp.png': 120,
      '/hero/people/satya.png': 120,
      '/hero/people/jensen.png': 100
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

  // Pill Nav Tab Switching
  const initPillNav = () => {
    const pillNav = document.querySelector('.pill-nav');
    if (!pillNav) return;

    const tabs = pillNav.querySelectorAll('.pill-tab');
    const panels = document.querySelectorAll('.tab-panel');

    const switchTab = (targetTab) => {
      // Update tabs
      tabs.forEach((tab) => {
        const isActive = tab === targetTab;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Update panels with smooth transition
      const targetPanelId = `panel-${targetTab.dataset.tab}`;
      panels.forEach((panel) => {
        const isActive = panel.id === targetPanelId;
        if (isActive) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    };

    // Click handler
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => switchTab(tab));
    });

    // Keyboard navigation
    pillNav.addEventListener('keydown', (e) => {
      const currentTab = document.activeElement;
      if (!currentTab.classList.contains('pill-tab')) return;

      const tabsArray = Array.from(tabs);
      const currentIndex = tabsArray.indexOf(currentTab);
      let nextIndex;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = (currentIndex + 1) % tabsArray.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = tabsArray.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      tabsArray[nextIndex].focus();
      switchTab(tabsArray[nextIndex]);
    });
  };

  initPillNav();

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
