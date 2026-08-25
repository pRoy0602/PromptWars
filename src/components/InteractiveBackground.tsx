import React, { useEffect, useRef } from 'react';
import { useApp, PlanetTheme } from '../context/AppContext';
import { soundFX } from '../utils/soundFx';

interface InteractiveBackgroundProps {
  className?: string;
}

interface Star {
  x: number;
  y: number;
  z: number; // 0.1 (far) to 1.0 (close)
  size: number;
  color: string;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  color: string;
}

interface CloudPuff {
  offsetX: number;
  offsetY: number;
  radius: number;
  opacity: number;
}

interface ProceduralCloud {
  x: number;
  y: number;
  baseY: number;
  width: number;
  height: number;
  speed: number;
  layer: number; // 1 = distant cirrus, 2 = mid cumulus, 3 = foreground
  puffs: CloudPuff[];
  scrollFactor: number;
}

interface SunParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  baseAlpha: number;
  pulsePhase: number;
}

export const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({
  className = '',
}) => {
  const { themeMode, activePlanetTheme } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Theme refs for RAF access without rebuilding loop
  const planetThemeRef = useRef<PlanetTheme>('emerald');
  useEffect(() => {
    planetThemeRef.current = activePlanetTheme;
  }, [activePlanetTheme]);

  const themeModeRef = useRef<'dark' | 'light'>(themeMode);
  useEffect(() => {
    themeModeRef.current = themeMode;
  }, [themeMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    // ==========================================
    // 1. NIGHT STATE: STARS & PLANET
    // ==========================================
    const starCount = Math.min(220, Math.floor((width * height) / 7000));
    const starColors = [
      '255, 255, 255',
      '224, 242, 254',
      '186, 230, 253',
      '167, 243, 208',
      '243, 232, 255',
      '254, 243, 199',
    ];

    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      const z = Math.random() * 0.85 + 0.15;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        size: z > 0.7 ? Math.random() * 1.5 + 1.2 : Math.random() * 0.9 + 0.6,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        baseAlpha: Math.random() * 0.5 + 0.5,
        twinkleSpeed: 0.015 + Math.random() * 0.03,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    let shootingStar: ShootingStar | null = null;
    let nextShootingStarTime = Date.now() + 2500;

    // ==========================================
    // 2. DAY STATE: PROCEDURAL CLOUDS & SUN PARTICLES
    // ==========================================
    const generateCloudPuffs = (width: number, height: number, layer: number): CloudPuff[] => {
      const puffs: CloudPuff[] = [];
      const numPuffs = layer === 1 ? 5 : layer === 2 ? 8 : 10;
      const baseRadius = (height * 0.45) * (layer === 1 ? 0.8 : layer === 2 ? 1.0 : 1.2);

      // Central body puffs
      for (let i = 0; i < numPuffs; i++) {
        const t = i / (numPuffs - 1);
        const offsetX = (t - 0.5) * (width * 0.75);
        const offsetY = Math.sin(t * Math.PI) * (-height * 0.22) + (Math.random() * 8 - 4);
        const radius = baseRadius * (0.65 + Math.sin(t * Math.PI) * 0.55) * (0.85 + Math.random() * 0.3);
        const opacity = layer === 1 ? 0.35 : layer === 2 ? 0.75 : 0.6;
        puffs.push({ offsetX, offsetY, radius, opacity });
      }

      // Supplementary highlight puff on top
      puffs.push({
        offsetX: -width * 0.1,
        offsetY: -height * 0.3,
        radius: baseRadius * 0.75,
        opacity: layer === 1 ? 0.25 : 0.85,
      });

      return puffs;
    };

    const clouds: ProceduralCloud[] = [];
    const cloudCount = Math.min(10, Math.max(5, Math.floor(width / 220)));

    for (let i = 0; i < cloudCount; i++) {
      const layer = i % 3 + 1; // 1, 2, or 3
      const cWidth = (layer === 1 ? 260 : layer === 2 ? 340 : 420) + Math.random() * 120;
      const cHeight = cWidth * (layer === 1 ? 0.28 : layer === 2 ? 0.36 : 0.42);
      const baseY = Math.random() * (height * 0.7) + (height * 0.05);

      clouds.push({
        x: Math.random() * (width + cWidth * 2) - cWidth,
        y: baseY,
        baseY,
        width: cWidth,
        height: cHeight,
        speed: layer === 1 ? 0.18 + Math.random() * 0.1 : layer === 2 ? 0.32 + Math.random() * 0.15 : 0.48 + Math.random() * 0.2,
        layer,
        puffs: generateCloudPuffs(cWidth, cHeight, layer),
        scrollFactor: layer === 1 ? 0.08 : layer === 2 ? 0.18 : 0.3,
      });
    }

    // Sunlight particles / golden air dust
    const sunParticles: SunParticle[] = [];
    for (let i = 0; i < 40; i++) {
      sunParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1.2,
        speedX: Math.random() * 0.4 + 0.1,
        speedY: -(Math.random() * 0.3 + 0.1),
        alpha: Math.random() * 0.6 + 0.2,
        baseAlpha: Math.random() * 0.5 + 0.3,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // ==========================================
    // 3. SMOOTH THEME TRANSITION & SCROLL ENGINE
    // ==========================================
    // 0.0 = Pure Night, 1.0 = Pure Day
    let currentThemeProgress = themeModeRef.current === 'light' ? 1.0 : 0.0;
    let targetThemeProgress = themeModeRef.current === 'light' ? 1.0 : 0.0;

    // Solar flare burst animation during transition
    let flareRadius = 0;
    let flareAlpha = 0;
    let lastThemeMode = themeModeRef.current;

    let currentScrollY = window.scrollY || 0;
    let targetScrollY = window.scrollY || 0;
    let scrollVelocity = 0;
    let lastScrollY = currentScrollY;

    const onScroll = () => {
      targetScrollY = window.scrollY || 0;
    };

    const onResize = () => {
      resizeCanvas();
      for (let i = 0; i < stars.length; i++) {
        if (stars[i].x > width) stars[i].x = Math.random() * width;
        if (stars[i].y > height) stars[i].y = Math.random() * height;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // Planet & Sun angles
    let planetRotation = 0;
    let moonOrbitAngle = 0;
    let sunRayAngle = 0;
    let lastHudUpdate = 0;

    const render = (time: number) => {
      // Sync theme mode change
      const targetMode = themeModeRef.current;
      targetThemeProgress = targetMode === 'light' ? 1.0 : 0.0;

      // Trigger solar flare sweep when transitioning
      if (lastThemeMode !== targetMode) {
        lastThemeMode = targetMode;
        flareRadius = 10;
        flareAlpha = 1.0;
      }

      // Smooth theme interpolation (1.2s smooth easing)
      currentThemeProgress += (targetThemeProgress - currentThemeProgress) * 0.055;
      const themeP = currentThemeProgress; // 0 (night) to 1 (day)

      // Animate solar flare sweep
      if (flareAlpha > 0.01) {
        flareRadius += width * 0.035;
        flareAlpha *= 0.94;
      } else {
        flareAlpha = 0;
      }

      // Butter-smooth scroll lerp
      const scrollDiff = targetScrollY - currentScrollY;
      currentScrollY += scrollDiff * 0.085;
      scrollVelocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollProgress = Math.min(1, Math.max(0, currentScrollY / docHeight));
      const topOffsetRatio = Math.min(1, currentScrollY / Math.max(1, window.innerHeight * 1.5));

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // =================================================================
      // 1. DYNAMIC SKY GRADIENT BLEND (NIGHT -> DAYLIGHT ATMOSPHERE)
      // =================================================================
      if (themeP > 0.001) {
        // Daytime / Sunrise Sky Gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        // Sun elevation affects sky tint
        const sunWarmth = Math.sin(themeP * Math.PI * 0.5);

        // Zenith deep cerulean to Horizon golden dawn
        skyGrad.addColorStop(0, `rgba(14, 116, 144, ${themeP * 0.95})`); // Cyan-sky zenith
        skyGrad.addColorStop(0.35, `rgba(56, 189, 248, ${themeP * 0.9})`); // Bright blue daylight
        skyGrad.addColorStop(0.7, `rgba(186, 230, 253, ${themeP * 0.85})`); // Horizon soft cyan
        skyGrad.addColorStop(1.0, `rgba(254, 243, 199, ${themeP * 0.95})`); // Warm golden sunlit horizon

        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Ambient Sun Scatter Radial Dome
        const sunScatX = width * 0.8;
        const sunScatY = height * 0.22 - currentScrollY * 0.12;
        const sunScatGrad = ctx.createRadialGradient(
          sunScatX,
          sunScatY,
          10,
          sunScatX,
          sunScatY,
          Math.max(width, height) * 0.9
        );
        sunScatGrad.addColorStop(0, `rgba(254, 240, 138, ${0.45 * themeP})`);
        sunScatGrad.addColorStop(0.3, `rgba(251, 191, 36, ${0.2 * themeP})`);
        sunScatGrad.addColorStop(0.7, `rgba(125, 211, 252, ${0.1 * themeP})`);
        sunScatGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = sunScatGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // =================================================================
      // 2. NIGHT COSMOS (STARS, METEORS & PLANET)
      // =================================================================
      const nightAlpha = 1.0 - themeP;
      if (nightAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = nightAlpha;

        // Draw Deep Space Stars
        const stretch = Math.min(22, Math.abs(scrollVelocity) * 0.95);
        const isStreaking = stretch > 1.8;
        const streakDir = scrollVelocity >= 0 ? -1 : 1;

        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];
          const parallaxY = (star.y - currentScrollY * star.z * 0.5) % height;
          const finalY = parallaxY < 0 ? parallaxY + height : parallaxY;

          star.twinklePhase += star.twinkleSpeed;
          const twinkle = star.baseAlpha * (0.65 + 0.35 * Math.sin(star.twinklePhase));

          if (isStreaking) {
            const tailY = finalY + streakDir * stretch * star.z * 1.5;
            ctx.strokeStyle = `rgba(${star.color}, ${twinkle * 0.9})`;
            ctx.lineWidth = star.size * (1 + star.z * 0.5);
            ctx.beginPath();
            ctx.moveTo(star.x, finalY);
            ctx.lineTo(star.x, tailY);
            ctx.stroke();
          } else {
            ctx.fillStyle = `rgba(${star.color}, ${twinkle})`;
            ctx.beginPath();
            ctx.arc(star.x, finalY, star.size, 0, Math.PI * 2);
            ctx.fill();

            if (star.z > 0.8) {
              ctx.fillStyle = `rgba(${star.color}, ${twinkle * 0.18})`;
              ctx.beginPath();
              ctx.arc(star.x, finalY, star.size * 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Shooting Star
        const now = Date.now();
        if (!shootingStar && now > nextShootingStarTime) {
          shootingStar = {
            x: Math.random() * width * 0.85 + width * 0.05,
            y: Math.random() * height * 0.4,
            length: Math.random() * 90 + 70,
            speed: Math.random() * 7 + 14,
            angle: 0.75 + (Math.random() * 0.2 - 0.1),
            alpha: 1.0,
            color: planetThemeRef.current === 'emerald' ? '110, 231, 183' : planetThemeRef.current === 'cyan' ? '103, 232, 249' : planetThemeRef.current === 'violet' ? '216, 180, 254' : '252, 211, 77',
          };
          nextShootingStarTime = now + 3500 + Math.random() * 4000;
        }

        if (shootingStar) {
          const s = shootingStar;
          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          s.alpha -= 0.022;

          if (s.alpha > 0) {
            const tailX = s.x - Math.cos(s.angle) * s.length;
            const tailY = s.y - Math.sin(s.angle) * s.length;

            const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
            grad.addColorStop(0.3, `rgba(${s.color}, ${s.alpha * 0.8})`);
            grad.addColorStop(1, `rgba(${s.color}, 0)`);

            ctx.save();
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else {
            shootingStar = null;
          }
        }

        // Celestial Planet with Zoom-Out Scroll Parallax
        planetRotation += 0.003;
        moonOrbitAngle += 0.008;

        const baseRadius = width < 640 ? 110 : width < 1024 ? 150 : 190;
        const zoomScale = Math.max(0.24, 1.08 - topOffsetRatio * 0.82);
        const planetRadius = baseRadius * zoomScale;

        const startX = width < 768 ? width * 0.75 : width * 0.78;
        const endX = width * 0.88;
        const planetX = startX + (endX - startX) * topOffsetRatio;

        const startY = height * 0.28;
        const endY = height * 0.12 - currentScrollY * 0.15;
        const planetY = Math.max(-planetRadius * 0.4, startY + (endY - startY) * topOffsetRatio);

        const curTheme = planetThemeRef.current;
        let primaryGlow = 'rgba(16, 185, 129, ';
        let secondaryGlow = 'rgba(6, 182, 212, ';
        let ringColor = 'rgba(52, 211, 153, ';
        let planetBodyGrad1 = '#064e3b';
        let planetBodyGrad2 = '#022c22';
        let planetBodyGrad3 = '#011510';

        if (curTheme === 'cyan') {
          primaryGlow = 'rgba(6, 182, 212, ';
          secondaryGlow = 'rgba(59, 130, 246, ';
          ringColor = 'rgba(103, 232, 249, ';
          planetBodyGrad1 = '#0e7490';
          planetBodyGrad2 = '#164e63';
          planetBodyGrad3 = '#082f49';
        } else if (curTheme === 'violet') {
          primaryGlow = 'rgba(168, 85, 247, ';
          secondaryGlow = 'rgba(236, 72, 153, ';
          ringColor = 'rgba(192, 132, 252, ';
          planetBodyGrad1 = '#6b21a8';
          planetBodyGrad2 = '#3b0764';
          planetBodyGrad3 = '#18022e';
        } else if (curTheme === 'amber') {
          primaryGlow = 'rgba(245, 158, 11, ';
          secondaryGlow = 'rgba(239, 68, 68, ';
          ringColor = 'rgba(251, 191, 36, ';
          planetBodyGrad1 = '#9a3412';
          planetBodyGrad2 = '#7c2d12';
          planetBodyGrad3 = '#451a03';
        }

        // Planet Nebula
        const nebulaRadius = planetRadius * 3.8;
        const nebulaGrad = ctx.createRadialGradient(
          planetX,
          planetY,
          planetRadius * 0.4,
          planetX,
          planetY,
          nebulaRadius
        );
        nebulaGrad.addColorStop(0, `${primaryGlow}${0.24 * zoomScale})`);
        nebulaGrad.addColorStop(0.4, `${secondaryGlow}${0.12 * zoomScale})`);
        nebulaGrad.addColorStop(0.8, 'rgba(15, 23, 42, 0.05)');
        nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = nebulaGrad;
        ctx.beginPath();
        ctx.arc(planetX, planetY, nebulaRadius, 0, Math.PI * 2);
        ctx.fill();

        // Planet Back Ring Arc
        const ringRadiusX = planetRadius * 2.2;
        const ringRadiusY = planetRadius * 0.55;
        const ringTilt = -0.38;

        ctx.save();
        ctx.translate(planetX, planetY);
        ctx.rotate(ringTilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, ringRadiusX, ringRadiusY, 0, Math.PI, Math.PI * 2);
        ctx.strokeStyle = `${ringColor}${0.35 * zoomScale})`;
        ctx.lineWidth = Math.max(1.5, 4.5 * zoomScale);
        ctx.stroke();
        ctx.restore();

        // Planet Body
        ctx.save();
        ctx.beginPath();
        ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
        ctx.clip();

        ctx.fillStyle = '#000000';
        ctx.fillRect(planetX - planetRadius, planetY - planetRadius, planetRadius * 2, planetRadius * 2);

        const lightOffsetX = planetX - planetRadius * 0.38;
        const lightOffsetY = planetY - planetRadius * 0.38;

        const bodyGrad = ctx.createRadialGradient(
          lightOffsetX,
          lightOffsetY,
          planetRadius * 0.1,
          planetX,
          planetY,
          planetRadius * 1.15
        );
        bodyGrad.addColorStop(0, '#ffffff');
        bodyGrad.addColorStop(0.18, planetBodyGrad1);
        bodyGrad.addColorStop(0.55, planetBodyGrad2);
        bodyGrad.addColorStop(0.85, planetBodyGrad3);
        bodyGrad.addColorStop(1, '#000000');

        ctx.fillStyle = bodyGrad;
        ctx.fillRect(planetX - planetRadius, planetY - planetRadius, planetRadius * 2, planetRadius * 2);

        // Planet Swirls
        ctx.save();
        ctx.rotate(0.18);
        for (let b = -3; b <= 3; b++) {
          const bandY = planetY + (b * planetRadius * 0.28) + Math.sin(planetRotation + b) * (planetRadius * 0.05);
          const bandHeight = planetRadius * (0.12 + Math.abs(b) * 0.02);
          const bandAlpha = Math.max(0, 0.22 - Math.abs(b) * 0.04) * zoomScale;

          const bandGrad = ctx.createLinearGradient(
            planetX - planetRadius,
            bandY,
            planetX + planetRadius,
            bandY + bandHeight
          );
          bandGrad.addColorStop(0, `${primaryGlow}0)`);
          bandGrad.addColorStop(0.3, `${primaryGlow}${bandAlpha})`);
          bandGrad.addColorStop(0.7, `${secondaryGlow}${bandAlpha * 0.8})`);
          bandGrad.addColorStop(1, `${primaryGlow}0)`);

          ctx.fillStyle = bandGrad;
          ctx.fillRect(planetX - planetRadius, bandY - bandHeight / 2, planetRadius * 2, bandHeight);
        }
        ctx.restore();

        // Planet Shadow Terminator
        const shadowGrad = ctx.createRadialGradient(
          planetX + planetRadius * 0.45,
          planetY + planetRadius * 0.45,
          planetRadius * 0.2,
          planetX + planetRadius * 0.1,
          planetY + planetRadius * 0.1,
          planetRadius * 1.1
        );
        shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
        shadowGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0.7)');
        shadowGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.1)');
        shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = shadowGrad;
        ctx.fillRect(planetX - planetRadius, planetY - planetRadius, planetRadius * 2, planetRadius * 2);
        ctx.restore();

        // Planet Front Ring Arc
        ctx.save();
        ctx.translate(planetX, planetY);
        ctx.rotate(ringTilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, ringRadiusX, ringRadiusY, 0, 0, Math.PI);
        ctx.strokeStyle = `${ringColor}${0.75 * zoomScale})`;
        ctx.lineWidth = Math.max(1.5, 4.5 * zoomScale);
        ctx.stroke();
        ctx.restore();

        // Mini Moon
        const moonOrbitRadiusX = planetRadius * 2.8;
        const moonOrbitRadiusY = planetRadius * 0.9;
        const moonAngle = moonOrbitAngle;
        const moonX = planetX + Math.cos(moonAngle) * moonOrbitRadiusX;
        const moonY = planetY + Math.sin(moonAngle) * moonOrbitRadiusY;
        const isMoonInFront = Math.sin(moonAngle) > 0;
        const moonRadius = Math.max(2, 6.5 * zoomScale * (isMoonInFront ? 1.15 : 0.85));

        const moonGrad = ctx.createRadialGradient(
          moonX - moonRadius * 0.3,
          moonY - moonRadius * 0.3,
          moonRadius * 0.1,
          moonX,
          moonY,
          moonRadius
        );
        moonGrad.addColorStop(0, '#ffffff');
        moonGrad.addColorStop(0.5, '#94a3b8');
        moonGrad.addColorStop(1, '#0f172a');

        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // =================================================================
      // 3. DAYTIME SUN & ILLUMINATION ENGINE (SUN RISES & LIGHTS CANVAS)
      // =================================================================
      if (themeP > 0.01) {
        ctx.save();
        ctx.globalAlpha = themeP;

        // Sun position (rises from lower horizon into high sky during transition)
        const targetSunX = width < 768 ? width * 0.78 : width * 0.82;
        const targetSunY = height * 0.2 - currentScrollY * 0.14;
        // Sun rises smoothly with transition
        const riseOffset = (1.0 - themeP) * (height * 0.6);
        const sunX = targetSunX;
        const sunY = Math.max(height * 0.08, targetSunY + riseOffset);
        const sunRadius = width < 640 ? 46 : 64;

        sunRayAngle += 0.0018;

        // A. Multi-layered Radiant Solar Corona & Glow
        // Outer ambient solar halo
        const outerCorona = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.6, sunX, sunY, sunRadius * 4.8);
        outerCorona.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
        outerCorona.addColorStop(0.35, 'rgba(251, 191, 36, 0.22)');
        outerCorona.addColorStop(0.7, 'rgba(245, 158, 11, 0.08)');
        outerCorona.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = outerCorona;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius * 4.8, 0, Math.PI * 2);
        ctx.fill();

        // Inner glowing corona
        const innerCorona = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.2, sunX, sunY, sunRadius * 1.8);
        innerCorona.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        innerCorona.addColorStop(0.4, 'rgba(254, 240, 138, 0.75)');
        innerCorona.addColorStop(0.8, 'rgba(251, 191, 36, 0.4)');
        innerCorona.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.fillStyle = innerCorona;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // B. Rotating Sun Rays / Golden Light Beams
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(sunRayAngle);

        const numRays = 14;
        for (let r = 0; r < numRays; r++) {
          const angle = (r * Math.PI * 2) / numRays;
          const rayLength = sunRadius * (2.8 + Math.sin(time * 0.002 + r) * 0.45);
          const rayWidth = sunRadius * 0.35;

          const rayGrad = ctx.createLinearGradient(0, 0, Math.cos(angle) * rayLength, Math.sin(angle) * rayLength);
          rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
          rayGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.25)');
          rayGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');

          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(
            Math.cos(angle - 0.08) * rayLength,
            Math.sin(angle - 0.08) * rayLength
          );
          ctx.lineTo(
            Math.cos(angle + 0.08) * rayLength,
            Math.sin(angle + 0.08) * rayLength
          );
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // C. Blazing White-Gold Solar Disc
        const sunDisc = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
        sunDisc.addColorStop(0, '#ffffff');
        sunDisc.addColorStop(0.65, '#fef08a');
        sunDisc.addColorStop(0.9, '#fde047');
        sunDisc.addColorStop(1, '#f59e0b');

        ctx.fillStyle = sunDisc;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fill();

        // D. Lens Flare Shimmer along Axis
        const flareVectorX = width * 0.45 - sunX;
        const flareVectorY = height * 0.55 - sunY;

        const flarePoints = [
          { dist: 0.35, r: 16, color: 'rgba(254, 240, 138, 0.25)' },
          { dist: 0.65, r: 28, color: 'rgba(56, 189, 248, 0.2)' },
          { dist: 0.95, r: 44, color: 'rgba(251, 191, 36, 0.15)' },
        ];

        flarePoints.forEach((fp) => {
          const fx = sunX + flareVectorX * fp.dist;
          const fy = sunY + flareVectorY * fp.dist;
          ctx.fillStyle = fp.color;
          ctx.beginPath();
          ctx.arc(fx, fy, fp.r, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      }

      // =================================================================
      // 4. DAYTIME VOLUMETRIC CLOUDS (PARALLAX & WIND PHYSICS)
      // =================================================================
      if (themeP > 0.01) {
        ctx.save();
        ctx.globalAlpha = themeP;

        // Render clouds by layer (1: Distant wispy, 2: Mid cumulus, 3: Foreground)
        clouds.forEach((cloud) => {
          // Wind drift
          cloud.x += cloud.speed;
          if (cloud.x > width + cloud.width) {
            cloud.x = -cloud.width;
            cloud.y = Math.random() * (height * 0.65) + height * 0.05;
          }

          // Parallax offset with scroll
          const cloudY = cloud.y - currentScrollY * cloud.scrollFactor;

          // Draw procedural cloud puffs
          ctx.save();
          ctx.translate(cloud.x, cloudY);

          // A. Soft bottom shadow for cumulus volume
          if (cloud.layer >= 2) {
            cloud.puffs.forEach((puff) => {
              const shadowGrad = ctx.createRadialGradient(
                puff.offsetX,
                puff.offsetY + puff.radius * 0.25,
                puff.radius * 0.3,
                puff.offsetX,
                puff.offsetY + puff.radius * 0.25,
                puff.radius * 1.05
              );
              shadowGrad.addColorStop(0, 'rgba(203, 213, 225, 0.45)');
              shadowGrad.addColorStop(0.65, 'rgba(226, 232, 240, 0.25)');
              shadowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

              ctx.fillStyle = shadowGrad;
              ctx.beginPath();
              ctx.arc(puff.offsetX, puff.offsetY + puff.radius * 0.25, puff.radius * 1.05, 0, Math.PI * 2);
              ctx.fill();
            });
          }

          // B. Fluffy White Sunlit Body
          cloud.puffs.forEach((puff) => {
            const bodyGrad = ctx.createRadialGradient(
              puff.offsetX - puff.radius * 0.25,
              puff.offsetY - puff.radius * 0.3,
              puff.radius * 0.15,
              puff.offsetX,
              puff.offsetY,
              puff.radius
            );
            bodyGrad.addColorStop(0, '#ffffff');
            bodyGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
            bodyGrad.addColorStop(0.85, 'rgba(241, 245, 249, 0.85)');
            bodyGrad.addColorStop(1, 'rgba(226, 232, 240, 0.3)');

            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            ctx.arc(puff.offsetX, puff.offsetY, puff.radius, 0, Math.PI * 2);
            ctx.fill();
          });

          // C. Top sunlit specular rim highlight
          cloud.puffs.forEach((puff) => {
            const rimGrad = ctx.createRadialGradient(
              puff.offsetX - puff.radius * 0.2,
              puff.offsetY - puff.radius * 0.35,
              0,
              puff.offsetX - puff.radius * 0.2,
              puff.offsetY - puff.radius * 0.35,
              puff.radius * 0.65
            );
            rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = rimGrad;
            ctx.beginPath();
            ctx.arc(puff.offsetX - puff.radius * 0.2, puff.offsetY - puff.radius * 0.35, puff.radius * 0.65, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.restore();
        });

        // Sunshine dust particles fluttering in campus breeze
        sunParticles.forEach((sp) => {
          sp.x += sp.speedX;
          sp.y += sp.speedY;
          sp.pulsePhase += 0.03;

          if (sp.x > width) sp.x = 0;
          if (sp.y < 0) sp.y = height;

          const pAlpha = sp.baseAlpha * (0.6 + 0.4 * Math.sin(sp.pulsePhase));

          ctx.fillStyle = `rgba(254, 240, 138, ${pAlpha})`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      }

      // =================================================================
      // 5. SUNRISE / SUNSET EXPANDING SOLAR FLARE SWEEP WAVE
      // =================================================================
      if (flareAlpha > 0.01) {
        const originX = width * 0.8;
        const originY = height * 0.25;

        const waveGrad = ctx.createRadialGradient(
          originX,
          originY,
          Math.max(0, flareRadius - 90),
          originX,
          originY,
          flareRadius
        );
        waveGrad.addColorStop(0, 'rgba(254, 240, 138, 0)');
        waveGrad.addColorStop(0.5, `rgba(251, 191, 36, ${flareAlpha * 0.45})`);
        waveGrad.addColorStop(0.8, `rgba(255, 255, 255, ${flareAlpha * 0.75})`);
        waveGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

        ctx.fillStyle = waveGrad;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${
        themeMode === 'light' ? 'bg-sky-100' : 'bg-black'
      } ${className}`}
      aria-hidden="true"
      style={{
        backgroundColor: themeMode === 'light' ? '#f0f9ff' : '#000000',
        transition: 'background-color 0.8s ease',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      {/* High-Performance Canvas for dynamic stars, planet, sun & clouds */}
      <canvas ref={canvasRef} className="w-full h-full block relative z-10" />
    </div>
  );
};
