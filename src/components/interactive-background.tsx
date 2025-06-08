'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface Sphere {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  randomForceTimer: number;
  randomForceX: number;
  randomForceY: number;
  color: string; // "r,g,b"
}

const sphereColorPalette = [
  '0,100,244', // 0064F4 - Blue
  '167,201,87', // A7C957 - Green
  '239,83,72', // EF5348 - Red
  '244,162,97', // F4A261 - Sandy Brown/Orange
  '42,157,143', // 2A9D8F - Persian Green/Teal
  '231,111,81', // E76F51 - Burnt Sienna/Coral
  '255,202,58', // FFCA3A - Maize Crayola/Yellow
  '138,201,38', // 8AC926 - Lime Green
  '106,76,147', // 6A4C93 - Royal Purple
  '25,130,196', // 1982C4 - Blue Crayola
];

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const spheresRef = useRef<Sphere[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme(); // Use resolvedTheme

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;
      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initSpheres = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sphereCount = Math.min(2, Math.floor((vw * vh) / 50000));
      spheresRef.current = [];

      const diag = Math.sqrt(vw * vw + vh * vh);
      const minRadius = diag * 0.22;
      const maxRadius = diag * 0.25;

      for (let i = 0; i < sphereCount; i++) {
        const radius = Math.random() * (maxRadius - minRadius) + minRadius;
        const corner = i % 2;
        let x = 0,
          y = 0;
        switch (corner) {
          case 0:
            x = vw;
            y = 0;
            break; // top-right
          case 1:
            x = 0;
            y = vh;
            break; // bottom-left
        }

        // Assign a random color from the predefined palette
        const sphereColor =
          sphereColorPalette[
            Math.floor(Math.random() * sphereColorPalette.length)
          ];

        spheresRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius,
          opacity: Math.random() * 0.95 + 0.9,
          randomForceTimer: Math.random() * 300 + 120,
          randomForceX: 0,
          randomForceY: 0,
          color: sphereColor,
        });
      }
    };

    const updateMousePosition = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      ctx.clearRect(0, 0, vw, vh);

      const extW = vw * 1.5,
        extH = vh * 1.5;
      const offX = (extW - vw) / 2,
        offY = (extH - vh) / 2;
      const left = -offX,
        right = vw + offX;
      const top = -offY,
        bottom = vh + offY;

      spheresRef.current.forEach((sphere, idx) => {
        // Random movement at will
        sphere.randomForceTimer--;
        if (sphere.randomForceTimer <= 0) {
          const randomAngle = Math.random() * Math.PI * 2;
          const randomStrength = Math.random() * 0.3 + 0.1;
          sphere.randomForceX = Math.cos(randomAngle) * randomStrength;
          sphere.randomForceY = Math.sin(randomAngle) * randomStrength;

          // Reset timer with random interval
          sphere.randomForceTimer = Math.random() * 400 + 200;
        }

        // Apply random forces with gradual decay
        sphere.vx += sphere.randomForceX * 0.02;
        sphere.vy += sphere.randomForceY * 0.02;
        sphere.randomForceX *= 0.98;
        sphere.randomForceY *= 0.98;

        // Mouse repulsion physics
        const dx = sphere.x - mouseRef.current.x;
        const dy = sphere.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repelDistance = 250 + sphere.radius;

        if (distance < repelDistance) {
          const force = (repelDistance - distance) / repelDistance;
          const angle = Math.atan2(dy, dx);
          sphere.vx += Math.cos(angle) * force * 0.1;
          sphere.vy += Math.sin(angle) * force * 0.1;
        }

        // Sphere-to-sphere repulsion physics
        spheresRef.current.forEach((otherSphere, otherIndex) => {
          if (idx === otherIndex) return;

          const sphereDx = sphere.x - otherSphere.x;
          const sphereDy = sphere.y - otherSphere.y;
          const sphereDistance = Math.sqrt(
            sphereDx * sphereDx + sphereDy * sphereDy
          );
          // Minimum distance to trigger repulsion
          const minDistance = sphere.radius + otherSphere.radius + 250;

          if (sphereDistance < minDistance && sphereDistance > 0) {
            const force = (minDistance - sphereDistance) / minDistance;
            const angle = Math.atan2(sphereDy, sphereDx);
            const repelForce = force * 0.05;

            sphere.vx += Math.cos(angle) * repelForce;
            sphere.vy += Math.sin(angle) * repelForce;
          }
        });

        sphere.vx *= 0.995;
        sphere.vy *= 0.995;
        sphere.x += sphere.vx;
        sphere.y += sphere.vy;

        // bounce in CSS px boundary
        if (
          sphere.x <= left + sphere.radius ||
          sphere.x >= right - sphere.radius
        ) {
          sphere.vx *= -0.8;
          sphere.x = Math.max(
            left + sphere.radius,
            Math.min(right - sphere.radius, sphere.x)
          );
        }
        if (
          sphere.y <= top + sphere.radius ||
          sphere.y >= bottom - sphere.radius
        ) {
          sphere.vy *= -0.8;
          sphere.y = Math.max(
            top + sphere.radius,
            Math.min(bottom - sphere.radius, sphere.y)
          );
        }

        if (
          sphere.x + sphere.radius > 0 &&
          sphere.x - sphere.radius < vw &&
          sphere.y + sphere.radius > 0 &&
          sphere.y - sphere.radius < vh
        ) {
          // Draw solid circle
          ctx.fillStyle = `rgba(${sphere.color},${sphere.opacity})`;
          ctx.beginPath();
          ctx.arc(sphere.x, sphere.y, sphere.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      // clamp existing sphere radii to new viewport size
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const diag = Math.sqrt(vw * vw + vh * vh);
      const minR = diag * 0.22;
      const maxR = diag * 0.25;
      spheresRef.current.forEach(s => {
        s.radius = Math.max(minR, Math.min(maxR, s.radius));
      });
    };

    resizeCanvas();
    initSpheres();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [mounted, resolvedTheme]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Interactive background spheres - drawn on canvas, visually at the bottom of this stack */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Glass overlay - blurs the canvas and base page background */}
      <div className="glass absolute inset-0" />

      {/* Theme-specific noise texture overlay - on top of the glass */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(/images/${resolvedTheme === 'dark' ? 'noise-dark' : 'noise-light'}.svg)`,
          backgroundSize: '1000px 1000px',
          backgroundRepeat: 'repeat',
          opacity: 0.5,
        }}
      />
    </div>
  );
}
