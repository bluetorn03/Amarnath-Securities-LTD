import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  r: number;
  g: number;
  b: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

const ATTRACT_RADIUS   = 185;
const ATTRACT_STRENGTH = 0.045;
const DAMPING_ACTIVE   = 0.90;
const MAX_SPEED        = 3.0;
const RETURN_EASE      = 0.025;

const HeroParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const palette: Array<[number, number, number]> = [
      [10,  17,  40],
      [154, 123, 56],
      [13,  148, 136],
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width;
      canvas.height = rect.height;
    };

    const build = () => {
      particles = [];
      const count = Math.max(45, Math.floor((canvas.width * canvas.height) / 9000));
      for (let i = 0; i < count; i++) {
        const [r, g, b] = palette[Math.floor(Math.random() * palette.length)];
        const isHub = Math.random() < 0.12;
        const bVx = (Math.random() - 0.5) * 0.35;
        const bVy = (Math.random() - 0.5) * 0.35;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: bVx, vy: bVy,
          baseVx: bVx, baseVy: bVy,
          radius: isHub ? Math.random() * 2 + 2.5 : Math.random() * 1.4 + 0.8,
          r, g, b,
          opacity: isHub ? 0.55 : Math.random() * 0.35 + 0.15,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.008 + Math.random() * 0.012,
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999, active: false }; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my, active } = mouseRef.current;
      const len = particles.length;

      // 1. Particle connections
      const maxDist = 130;
      for (let i = 0; i < len; i++) {
        const a = particles[i];
        for (let j = i + 1; j < len; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
            const lr = Math.round((a.r + b.r) / 2);
            const lg = Math.round((a.g + b.g) / 2);
            const lb = Math.round((a.b + b.b) / 2);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lr},${lg},${lb},${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // 2. Cursor hub glow + gold connection lines
      if (active) {
        for (let i = 0; i < len; i++) {
          const p = particles[i];
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < ATTRACT_RADIUS) {
            const t = 1 - dist / ATTRACT_RADIUS;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(154,123,56,${t * 0.55})`;
            ctx.lineWidth = t * 1.4;
            ctx.moveTo(mx, my);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }

        const outerGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 55);
        outerGlow.addColorStop(0,   'rgba(154,123,56,0.22)');
        outerGlow.addColorStop(0.5, 'rgba(154,123,56,0.08)');
        outerGlow.addColorStop(1,   'rgba(154,123,56,0)');
        ctx.beginPath();
        ctx.arc(mx, my, 55, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();

        const coreGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 10);
        coreGlow.addColorStop(0,   'rgba(220,185,100,0.95)');
        coreGlow.addColorStop(0.4, 'rgba(154,123,56,0.70)');
        coreGlow.addColorStop(1,   'rgba(154,123,56,0)');
        ctx.beginPath();
        ctx.arc(mx, my, 10, 0, Math.PI * 2);
        ctx.fillStyle = coreGlow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220,185,100,1)';
        ctx.fill();
      }

      // 3. Particles -- spring physics + draw
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        if (active) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < ATTRACT_RADIUS && dist > 1) {
            const t = 1 - dist / ATTRACT_RADIUS;
            const force = t * t * ATTRACT_STRENGTH;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
          p.vx *= DAMPING_ACTIVE;
          p.vy *= DAMPING_ACTIVE;
        } else {
          p.vx += (p.baseVx - p.vx) * RETURN_EASE;
          p.vy += (p.baseVy - p.vy) * RETURN_EASE;
        }

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > MAX_SPEED) { p.vx = (p.vx / speed) * MAX_SPEED; p.vy = (p.vy / speed) * MAX_SPEED; }

        p.pulse += p.pulseSpeed;
        const pulseFactor = 1 + Math.sin(p.pulse) * 0.25;
        const rad   = p.radius * pulseFactor;
        const alpha = p.opacity * (0.85 + Math.sin(p.pulse) * 0.15);

        if (p.radius > 2) {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 3.5);
          grd.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${alpha * 0.3})`);
          grd.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20)                p.x = canvas.width  + 20;
        if (p.x > canvas.width  + 20) p.x = -20;
        if (p.y < -20)                p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    build();
    draw();

    const ro = new ResizeObserver(() => { resize(); build(); });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
    />
  );
};

export default HeroParticleNetwork;
