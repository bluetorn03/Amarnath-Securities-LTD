import React, { useEffect, useRef } from 'react';

export const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Node representation of financial nodes & capital flows
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
      pulseOffset: number;
    }

    const nodeCount = Math.min(Math.floor(width / 22), 48);
    const nodes: Node[] = [];
    const colors = [
      'rgba(13, 148, 136, ', // Teal
      'rgba(20, 184, 166, ', // Bright Teal
      'rgba(197, 168, 128, ', // Gold
      'rgba(255, 255, 255, ', // White
    ];

    for (let i = 0; i < nodeCount; i++) {
      const color = colors[i % colors.length];
      const radius = Math.random() * 2 + 1.2;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius,
        baseRadius: radius,
        color,
        alpha: Math.random() * 0.5 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Capital vector flows (flowing directional beams)
    interface FlowVector {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      color: string;
    }

    const vectors: FlowVector[] = Array.from({ length: 12 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 80 + 40,
      speed: Math.random() * 0.7 + 0.3,
      angle: -Math.PI / 4 + (Math.random() - 0.5) * 0.3, // diagonal upward flow
      opacity: Math.random() * 0.25 + 0.1,
      color: Math.random() > 0.4 ? 'rgba(13, 148, 136,' : 'rgba(197, 168, 128,',
    }));

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Render subtle directional flow vectors
      vectors.forEach((v) => {
        if (!prefersReducedMotion) {
          v.x += Math.cos(v.angle) * v.speed;
          v.y += Math.sin(v.angle) * v.speed;

          if (v.x < -100) v.x = width + 50;
          if (v.x > width + 100) v.x = -50;
          if (v.y < -100) v.y = height + 50;
          if (v.y > height + 100) v.y = -50;
        }

        const gradient = ctx.createLinearGradient(
          v.x,
          v.y,
          v.x - Math.cos(v.angle) * v.length,
          v.y - Math.sin(v.angle) * v.length
        );
        gradient.addColorStop(0, `${v.color} ${v.opacity})`);
        gradient.addColorStop(1, `${v.color} 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(v.x, v.y);
        ctx.lineTo(
          v.x - Math.cos(v.angle) * v.length,
          v.y - Math.sin(v.angle) * v.length
        );
        ctx.stroke();
      });

      // Update and connect nodes
      const maxDistance = 135;

      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];

        if (!prefersReducedMotion) {
          nodeA.x += nodeA.vx;
          nodeA.y += nodeA.vy;

          if (nodeA.x < 0 || nodeA.x > width) nodeA.vx *= -1;
          if (nodeA.y < 0 || nodeA.y > height) nodeA.vy *= -1;
        }

        // Draw connections between close nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.18;
            ctx.strokeStyle = `rgba(20, 184, 166, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }

        // Pulse node
        const pulse = Math.sin(time * 2 + nodeA.pulseOffset) * 0.5 + 0.5;
        const currentRadius = nodeA.baseRadius + pulse * 0.8;
        const currentAlpha = nodeA.alpha * (0.8 + pulse * 0.4);

        ctx.fillStyle = `${nodeA.color}${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(nodeA.x, nodeA.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow halo for some nodes
        if (i % 4 === 0) {
          ctx.fillStyle = `${nodeA.color}${currentAlpha * 0.25})`;
          ctx.beginPath();
          ctx.arc(nodeA.x, nodeA.y, currentRadius * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-65"
      aria-hidden="true"
    />
  );
};
