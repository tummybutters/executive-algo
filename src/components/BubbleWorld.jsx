'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { mulberry32 } from '../utils.js';

export default function BubbleWorld() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const bubbleCanvas = canvasRef.current;
    const hostSection = sectionRef.current;
    if (!(bubbleCanvas instanceof HTMLCanvasElement) || !hostSection) return;

    const ctx = bubbleCanvas.getContext('2d');
    if (!ctx) return;

    const rng = mulberry32(909090);

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

      for (const b of bodies) {
        const drift = 0.12;
        b.vx += (rng() - 0.5) * drift * dt;
        b.vy += (rng() - 0.5) * drift * dt;
        b.vx *= 0.985;
        b.vy *= 0.985;

        b.x += b.vx;
        b.y += b.vy;

        if (b.x - b.r < pad) {
          b.x = pad + b.r;
          b.vx *= -0.7;
        }
        if (b.x + b.r > w - pad) {
          b.x = w - pad - b.r;
          b.vx *= -0.7;
        }
        if (b.y - b.r < pad) {
          b.y = pad + b.r;
          b.vy *= -0.7;
        }
        if (b.y + b.r > h - pad) {
          b.y = h - pad - b.r;
          b.vy *= -0.7;
        }
      }

      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.r + b.r + 8;
          if (dist > 0 && dist < minDist) {
            const push = (minDist - dist) * 0.008;
            const nx = dx / dist;
            const ny = dy / dist;
            a.vx -= nx * push;
            a.vy -= ny * push;
            b.vx += nx * push;
            b.vy += ny * push;
          }
        }
      }
    };

    const drawLinks = () => {
      if (!state.hoveredId) return;
      const target = byId.get(state.hoveredId);
      if (!target) return;
      const linked = links.get(state.hoveredId) || [];

      ctx.save();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = palette.line;
      ctx.shadowColor = palette.lineStrong;
      ctx.shadowBlur = 12;

      linked.forEach((id) => {
        const node = byId.get(id);
        if (!node) return;
        ctx.beginPath();
        ctx.moveTo(target.x, target.y);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
      });

      ctx.restore();
    };

    const drawNodes = () => {
      for (const b of bodies) {
        const isHovered = b.id === state.hoveredId;
        const glowAlpha = isHovered ? 0.22 : 0.12;

        ctx.beginPath();
        ctx.fillStyle = palette.fill;
        ctx.strokeStyle = palette.stroke;
        ctx.lineWidth = 1.2;
        ctx.shadowColor = palette.glow;
        ctx.shadowBlur = b.r * (isHovered ? 0.9 : 0.6);
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = `rgba(${b.tr}, ${b.tg}, ${b.tb}, ${glowAlpha})`;
        ctx.shadowColor = `rgba(${b.tr}, ${b.tg}, ${b.tb}, ${glowAlpha + 0.1})`;
        ctx.shadowBlur = b.r * 0.8;
        ctx.arc(b.x, b.y, b.r * 0.7, 0, Math.PI * 2);
        ctx.fill();

        if (b.label) {
          ctx.font = `${isHovered ? 14 : 12}px Outfit, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = isHovered ? palette.text : palette.textMuted;
          if (b.labelOnHover && !isHovered) continue;
          ctx.fillText(b.label, b.x, b.y);
        }
      }
    };

    const draw = (now) => {
      state.t = now * 0.001;
      ctx.clearRect(0, 0, state.w, state.h);
      drawLinks();
      drawNodes();
    };

    const tick = (now) => {
      step(1);
      state.hoveredId = findHover();
      draw(now);
      state.rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (state.rafId) return;
      if (prefersReducedMotion) {
        state.hoveredId = null;
        draw(performance.now());
        return;
      }
      state.rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (state.rafId) cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    };

    const onResize = () => {
      resize();
      draw(performance.now());
    };

    const onPointerMove = (event) => {
      const rect = bubbleCanvas.getBoundingClientRect();
      state.pointer.x = event.clientX - rect.left;
      state.pointer.y = event.clientY - rect.top;
      state.pointer.inside = true;
      if (prefersReducedMotion) {
        state.hoveredId = findHover();
        draw(performance.now());
      }
    };

    const onPointerLeave = () => {
      state.pointer.inside = false;
      state.hoveredId = null;
      if (prefersReducedMotion) draw(performance.now());
    };

    resize();
    draw(performance.now());

    window.addEventListener('resize', onResize, { passive: true });
    bubbleCanvas.addEventListener('pointermove', onPointerMove, { passive: true });
    bubbleCanvas.addEventListener('pointerleave', onPointerLeave, { passive: true });

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
          (entries) => {
            const visible = entries.some((e) => e.isIntersecting);
            if (visible) start();
            else stop();
          },
          { threshold: 0.08 }
        )
        : null;

    if (observer) observer.observe(hostSection);
    else start();

    return () => {
      window.removeEventListener('resize', onResize);
      bubbleCanvas.removeEventListener('pointermove', onPointerMove);
      bubbleCanvas.removeEventListener('pointerleave', onPointerLeave);
      if (observer) observer.disconnect();
      stop();
    };
  }, [prefersReducedMotion]);

  return (
    <motion.section
      className="bubble-world"
      id="bubble-world"
      ref={sectionRef}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <canvas className="bubble-world-canvas" ref={canvasRef} aria-hidden="true"></canvas>
      <motion.div
        className="bubble-world-caption"
        aria-hidden="true"
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="bubble-world-title">Ecosystem Field</div>
        <div className="bubble-world-subtitle">Hover to trace influence</div>
      </motion.div>
    </motion.section>
  );
}
