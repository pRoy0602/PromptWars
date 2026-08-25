import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

interface TapSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: 'star' | 'diamond' | 'circle';
}

interface TapBurst {
  id: number;
  x: number;
  y: number;
  mode: 'dark' | 'light';
  age: number;
  maxAge: number;
  coreScale: number;
  ringRadius: number;
  ringAlpha: number;
  rotation: number;
  sparks: TapSpark[];
}

export const TapEffectOverlay: React.FC = () => {
  const { themeMode } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const burstsRef = useRef<TapBurst[]>([]);
  const themeModeRef = useRef<'dark' | 'light'>(themeMode);
  const isRunningRef = useRef<boolean>(false);
  const recentTapsRef = useRef<{ x: number; y: number; time: number }[]>([]);

  useEffect(() => {
    themeModeRef.current = themeMode;
  }, [themeMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ==========================================
    // STARSHINE & SUNBURST DRAWING UTILITIES
    // ==========================================
    const draw4PointStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      outerR: number,
      innerR: number,
      rot: number,
      color: string,
      alpha: number
    ) => {
      c.save();
      c.translate(cx, cy);
      c.rotate(rot);
      c.fillStyle = color;
      c.globalAlpha = Math.max(0, Math.min(1, alpha));
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        const outerAngle = (i * Math.PI) / 2;
        const innerAngle = outerAngle + Math.PI / 4;
        if (i === 0) {
          c.moveTo(Math.cos(outerAngle) * outerR, Math.sin(outerAngle) * outerR);
        } else {
          c.lineTo(Math.cos(outerAngle) * outerR, Math.sin(outerAngle) * outerR);
        }
        c.lineTo(Math.cos(innerAngle) * innerR, Math.sin(innerAngle) * innerR);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawDiamond = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      rot: number,
      color: string,
      alpha: number
    ) => {
      c.save();
      c.translate(cx, cy);
      c.rotate(rot);
      c.fillStyle = color;
      c.globalAlpha = Math.max(0, Math.min(1, alpha));
      c.beginPath();
      c.moveTo(0, -size);
      c.lineTo(size * 0.55, 0);
      c.lineTo(0, size);
      c.lineTo(-size * 0.55, 0);
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawSunbeamRay = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      angle: number,
      len: number,
      rayWidth: number,
      color: string,
      alpha: number
    ) => {
      c.save();
      c.translate(cx, cy);
      c.rotate(angle);
      c.fillStyle = color;
      c.globalAlpha = Math.max(0, Math.min(1, alpha));
      c.beginPath();
      c.moveTo(0, -rayWidth * 0.5);
      c.lineTo(len, 0);
      c.lineTo(0, rayWidth * 0.5);
      c.closePath();
      c.fill();
      c.restore();
    };

    // ==========================================
    // RENDER LOOP (Active strictly when bursts exist)
    // ==========================================
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const bursts = burstsRef.current;
      for (let bIdx = bursts.length - 1; bIdx >= 0; bIdx--) {
        const burst = bursts[bIdx];
        burst.age++;
        const progress = burst.age / burst.maxAge; // 0 to 1

        if (burst.mode === 'dark') {
          // ========================================
          // 🌌 DARK MODE: CELESTIAL STARSHINE AT TAP POINT
          // ========================================
          const coreAlpha = Math.max(0, 1 - progress * 1.35);
          burst.rotation += 0.045;
          burst.ringRadius += 3.0;
          burst.ringAlpha = Math.max(0, 0.75 * (1 - progress));

          // 1. Expanding Starlight Shockwave Aura Ring
          if (burst.ringAlpha > 0.01) {
            ctx.save();
            ctx.strokeStyle = `rgba(167, 243, 208, ${burst.ringAlpha * 0.7})`;
            ctx.lineWidth = Math.max(0.5, 2.2 * (1 - progress));
            ctx.beginPath();
            ctx.arc(burst.x, burst.y, burst.ringRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Inner cyan secondary resonance ring
            ctx.strokeStyle = `rgba(103, 232, 249, ${burst.ringAlpha * 0.45})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(burst.x, burst.y, burst.ringRadius * 0.6, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          // 2. Central Radiant Starlight Core at Point of Tap
          if (coreAlpha > 0.01) {
            const glowR = (18 + (1 - progress) * 22) * burst.coreScale;
            const starGlow = ctx.createRadialGradient(
              burst.x,
              burst.y,
              0,
              burst.x,
              burst.y,
              glowR
            );
            starGlow.addColorStop(0, `rgba(255, 255, 255, ${coreAlpha * 0.98})`);
            starGlow.addColorStop(0.25, `rgba(167, 243, 208, ${coreAlpha * 0.75})`);
            starGlow.addColorStop(0.6, `rgba(56, 189, 248, ${coreAlpha * 0.4})`);
            starGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');

            ctx.fillStyle = starGlow;
            ctx.beginPath();
            ctx.arc(burst.x, burst.y, glowR, 0, Math.PI * 2);
            ctx.fill();

            // 3. Primary 4-Point Star Flare (Twinkling directly at tap point)
            const starSize = Math.max(2, (28 - progress * 18) * burst.coreScale);
            draw4PointStar(
              ctx,
              burst.x,
              burst.y,
              starSize,
              starSize * 0.16,
              burst.rotation,
              '#ffffff',
              coreAlpha
            );

            // Secondary 8-point glint
            draw4PointStar(
              ctx,
              burst.x,
              burst.y,
              starSize * 0.6,
              starSize * 0.1,
              burst.rotation + Math.PI / 4,
              '#67e8f9',
              coreAlpha * 0.85
            );

            // Diamond Core Shimmer
            drawDiamond(
              ctx,
              burst.x,
              burst.y,
              starSize * 0.38,
              -burst.rotation * 1.5,
              '#a7f3d0',
              coreAlpha * 0.95
            );

            // Bright pinpoint flash epicenter
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = coreAlpha;
            ctx.beginPath();
            ctx.arc(burst.x, burst.y, Math.max(1.5, 3.5 * (1 - progress)), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // 4. Stardust Particles & Micro Star Sparkles bursting from tap
          for (let sIdx = burst.sparks.length - 1; sIdx >= 0; sIdx--) {
            const spark = burst.sparks[sIdx];
            spark.x += spark.vx;
            spark.y += spark.vy;
            spark.vx *= 0.93;
            spark.vy *= 0.93;
            spark.alpha -= spark.decay;
            spark.rotation += spark.rotationSpeed;

            if (spark.alpha <= 0.01) {
              burst.sparks.splice(sIdx, 1);
              continue;
            }

            if (spark.shape === 'star') {
              draw4PointStar(
                ctx,
                spark.x,
                spark.y,
                spark.size * 1.8,
                spark.size * 0.3,
                spark.rotation,
                spark.color,
                spark.alpha
              );
            } else if (spark.shape === 'diamond') {
              drawDiamond(
                ctx,
                spark.x,
                spark.y,
                spark.size * 1.5,
                spark.rotation,
                spark.color,
                spark.alpha
              );
            } else {
              // Glowing Celestial Orb Spark
              ctx.save();
              ctx.fillStyle = spark.color;
              ctx.globalAlpha = spark.alpha;
              ctx.beginPath();
              ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
              ctx.fill();

              // Micro halo
              ctx.fillStyle = spark.color;
              ctx.globalAlpha = spark.alpha * 0.3;
              ctx.beginPath();
              ctx.arc(spark.x, spark.y, spark.size * 2.2, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
        } else {
          // ========================================
          // ☀️ DAY MODE: SOLAR SUNBURST AT TAP POINT
          // ========================================
          const coreAlpha = Math.max(0, 1 - progress * 1.3);
          burst.rotation += 0.03;
          burst.ringRadius += 3.4;
          burst.ringAlpha = Math.max(0, 0.8 * (1 - progress));

          // 1. Expanding Warm Sunlit Ripple Ring
          if (burst.ringAlpha > 0.01) {
            ctx.save();
            ctx.strokeStyle = `rgba(251, 191, 36, ${burst.ringAlpha * 0.75})`;
            ctx.lineWidth = Math.max(0.5, 2.5 * (1 - progress));
            ctx.beginPath();
            ctx.arc(burst.x, burst.y, burst.ringRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Outer soft golden corona wave
            ctx.strokeStyle = `rgba(254, 240, 138, ${burst.ringAlpha * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(burst.x, burst.y, burst.ringRadius * 1.25, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          // 2. Central Blazing Solar Sunburst Glow at Point of Tap
          if (coreAlpha > 0.01) {
            const sunGlowR = (20 + (1 - progress) * 24) * burst.coreScale;
            const sunGlow = ctx.createRadialGradient(
              burst.x,
              burst.y,
              0,
              burst.x,
              burst.y,
              sunGlowR
            );
            sunGlow.addColorStop(0, `rgba(255, 255, 255, ${coreAlpha * 0.98})`);
            sunGlow.addColorStop(0.28, `rgba(254, 240, 138, ${coreAlpha * 0.85})`);
            sunGlow.addColorStop(0.65, `rgba(251, 191, 36, ${coreAlpha * 0.45})`);
            sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');

            ctx.fillStyle = sunGlow;
            ctx.beginPath();
            ctx.arc(burst.x, burst.y, sunGlowR, 0, Math.PI * 2);
            ctx.fill();

            // 3. Radiant 8-Spoke Solar Rays / Sunbeams Bursting from Epicenter
            const rayCount = 8;
            const rayLen = Math.max(4, (30 - progress * 20) * burst.coreScale);
            for (let r = 0; r < rayCount; r++) {
              const angle = burst.rotation + (r * Math.PI * 2) / rayCount;
              drawSunbeamRay(
                ctx,
                burst.x,
                burst.y,
                angle,
                rayLen,
                3.2 * (1 - progress),
                '#fde047',
                coreAlpha * 0.9
              );
            }

            // 4. Central Sun Disc
            const centerR = Math.max(2, (9 - progress * 6) * burst.coreScale);
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = coreAlpha;
            ctx.beginPath();
            ctx.arc(burst.x, burst.y, centerR, 0, Math.PI * 2);
            ctx.fill();

            // Diamond Sun Core Accent
            drawDiamond(
              ctx,
              burst.x,
              burst.y,
              centerR * 1.6,
              burst.rotation * 2,
              '#f59e0b',
              coreAlpha * 0.8
            );
            ctx.restore();
          }

          // 5. Golden Sun Dust & Solar Prisms Floating Upward
          for (let sIdx = burst.sparks.length - 1; sIdx >= 0; sIdx--) {
            const spark = burst.sparks[sIdx];
            spark.x += spark.vx;
            spark.y += spark.vy;
            spark.vx *= 0.93;
            spark.vy = spark.vy * 0.93 - 0.1; // gentle thermal lift
            spark.alpha -= spark.decay;
            spark.rotation += spark.rotationSpeed;

            if (spark.alpha <= 0.01) {
              burst.sparks.splice(sIdx, 1);
              continue;
            }

            if (spark.shape === 'diamond') {
              drawDiamond(
                ctx,
                spark.x,
                spark.y,
                spark.size * 1.5,
                spark.rotation,
                spark.color,
                spark.alpha
              );
            } else if (spark.shape === 'star') {
              draw4PointStar(
                ctx,
                spark.x,
                spark.y,
                spark.size * 1.6,
                spark.size * 0.35,
                spark.rotation,
                spark.color,
                spark.alpha
              );
            } else {
              // Golden Sun Mote Spark
              ctx.save();
              ctx.fillStyle = spark.color;
              ctx.globalAlpha = spark.alpha;
              ctx.beginPath();
              ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
              ctx.fill();

              // Warm halo
              ctx.fillStyle = spark.color;
              ctx.globalAlpha = spark.alpha * 0.3;
              ctx.beginPath();
              ctx.arc(spark.x, spark.y, spark.size * 2.2, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
        }

        // Clean up finished burst
        if (progress >= 1 && burst.sparks.length === 0) {
          bursts.splice(bIdx, 1);
        }
      }

      // Continue animation loop only if active bursts exist
      if (bursts.length > 0) {
        animId = requestAnimationFrame(render);
      } else {
        isRunningRef.current = false;
        ctx.clearRect(0, 0, width, height);
      }
    };

    const startAnimationIfNeeded = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        animId = requestAnimationFrame(render);
      }
    };

    // ==========================================
    // SPAWN BURST PRECISELY AT (x, y)
    // ==========================================
    const spawnTapAnimation = (canvasX: number, canvasY: number) => {
      const mode = themeModeRef.current;
      const sparks: TapSpark[] = [];
      const sparkCount = 14;

      if (mode === 'dark') {
        // Dark Mode: Celestial Cosmic Starlight Palette
        const darkColors = [
          '#ffffff',
          '#a7f3d0', // emerald-200
          '#34d399', // emerald-400
          '#67e8f9', // cyan-300
          '#38bdf8', // sky-400
          '#d8b4fe', // purple-300
          '#c084fc', // purple-400
          '#fef08a', // yellow-200
        ];

        for (let i = 0; i < sparkCount; i++) {
          const angle = (i * Math.PI * 2) / sparkCount + (Math.random() * 0.4 - 0.2);
          const speed = Math.random() * 4.2 + 2.0;
          const shapes: ('star' | 'diamond' | 'circle')[] = ['star', 'diamond', 'circle', 'circle'];
          const shape = shapes[Math.floor(Math.random() * shapes.length)];

          sparks.push({
            x: canvasX,
            y: canvasY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 2.8 + 1.2,
            alpha: Math.random() * 0.3 + 0.7,
            decay: Math.random() * 0.024 + 0.024,
            color: darkColors[Math.floor(Math.random() * darkColors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            shape,
          });
        }
      } else {
        // Day Mode: Solar Daylight Palette
        const dayColors = [
          '#ffffff',
          '#fef08a', // yellow-200
          '#fde047', // yellow-400
          '#f59e0b', // amber-500
          '#fb923c', // orange-400
          '#fdba74', // orange-300
          '#38bdf8', // sky-400 prism glint
          '#e0f2fe', // sky-100
        ];

        for (let i = 0; i < sparkCount; i++) {
          const angle = (i * Math.PI * 2) / sparkCount + (Math.random() * 0.5 - 0.25);
          const speed = Math.random() * 4.0 + 1.8;
          const shapes: ('star' | 'diamond' | 'circle')[] = ['diamond', 'star', 'circle', 'circle'];
          const shape = shapes[Math.floor(Math.random() * shapes.length)];

          sparks.push({
            x: canvasX,
            y: canvasY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 3.0 + 1.4,
            alpha: Math.random() * 0.3 + 0.7,
            decay: Math.random() * 0.022 + 0.022,
            color: dayColors[Math.floor(Math.random() * dayColors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.18,
            shape,
          });
        }
      }

      burstsRef.current.push({
        id: Date.now() + Math.random(),
        x: canvasX,
        y: canvasY,
        mode,
        age: 0,
        maxAge: 32,
        coreScale: 1.0,
        ringRadius: 3,
        ringAlpha: 0.85,
        rotation: Math.random() * Math.PI * 2,
        sparks,
      });

      // Keep max active bursts capped for continuous 60fps performance
      if (burstsRef.current.length > 14) {
        burstsRef.current.shift();
      }

      startAnimationIfNeeded();
    };

    // ==========================================
    // EXACT TAP COORDINATE RESOLVER
    // ==========================================
    const triggerAtClientPoint = (clientX: number, clientY: number) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const canvasX = clientX - rect.left;
      const canvasY = clientY - rect.top;

      // Debounce duplicate events triggered at exact same spot within 40ms
      const now = Date.now();
      const recent = recentTapsRef.current;
      for (let i = recent.length - 1; i >= 0; i--) {
        if (now - recent[i].time > 150) {
          recent.splice(i, 1);
        } else if (now - recent[i].time < 40 && Math.hypot(canvasX - recent[i].x, canvasY - recent[i].y) < 8) {
          return;
        }
      }
      recent.push({ x: canvasX, y: canvasY, time: now });

      spawnTapAnimation(canvasX, canvasY);
    };

    // Use Capture phase to ensure ANY click/touch on any button/modal/card triggers immediately
    const onPointerDown = (e: PointerEvent) => {
      if (e.button === 2) return; // ignore right-click
      triggerAtClientPoint(e.clientX, e.clientY);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        for (let i = 0; i < e.touches.length; i++) {
          const t = e.touches[i];
          triggerAtClientPoint(t.clientX, t.clientY);
        }
      }
    };

    window.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
    window.addEventListener('touchstart', onTouchStart, { capture: true, passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointerDown, { capture: true });
      window.removeEventListener('touchstart', onTouchStart, { capture: true });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    />
  );
};
