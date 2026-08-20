import React, { useEffect, useRef, useState } from "react";
import "../styles/ParticleDivider.css";

const ParticleDivider = ({
  mainColor = "#7b61ff",
  height = 90,
  particleCount = 55,
  glyph = "✦",
  label = "",
  variant = "constellation",
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false, radius: 100 });
  const [isHovered, setIsHovered] = useState(false);
  const colorUpdaterRef = useRef(mainColor);

  useEffect(() => {
    colorUpdaterRef.current = mainColor;
  }, [mainColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = container.clientWidth);
    let heightPx = (canvas.height = height);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setupCanvasSize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      heightPx = height;
      canvas.width = width * dpr;
      canvas.height = heightPx * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${heightPx}px`;
      ctx.scale(dpr, dpr);
    };

    setupCanvasSize();

    const resizeObserver = new ResizeObserver(() => {
      setupCanvasSize();
      initParticles();
    });
    resizeObserver.observe(container);

    // Helpers to convert hex to RGB
    const hexToRgb = (hex) => {
      const cleanHex = (hex || "#7b61ff").replace("#", "");
      if (cleanHex.length === 3) {
        return {
          r: parseInt(cleanHex[0] + cleanHex[0], 16) || 123,
          g: parseInt(cleanHex[1] + cleanHex[1], 16) || 97,
          b: parseInt(cleanHex[2] + cleanHex[2], 16) || 255,
        };
      }
      return {
        r: parseInt(cleanHex.substring(0, 2), 16) || 123,
        g: parseInt(cleanHex.substring(2, 4), 16) || 97,
        b: parseInt(cleanHex.substring(4, 6), 16) || 255,
      };
    };

    // Particle structure
    let particles = [];
    const count = Math.min(particleCount, Math.floor(width / 18) + 20);

    const initParticles = () => {
      particles = [];
      const actualCount = Math.min(particleCount, Math.floor(width / 18) + 20);
      for (let i = 0; i < actualCount; i++) {
        const x = Math.random() * width;
        // Concentrate particles closer to the vertical center line
        const spread = (Math.random() - 0.5) * (heightPx * 0.75);
        const originY = heightPx / 2 + spread;
        particles.push({
          x,
          y: originY,
          originX: x,
          originY,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 0.8,
          alpha: Math.random() * 0.6 + 0.3,
          baseAlpha: Math.random() * 0.5 + 0.3,
          frequency: Math.random() * 0.02 + 0.01,
          amplitude: Math.random() * 8 + 4,
          phase: Math.random() * Math.PI * 2,
          isHeroStar: Math.random() > 0.85,
          colorType: Math.random() > 0.4 ? "accent" : Math.random() > 0.5 ? "cyan" : "white",
        });
      }
    };

    initParticles();

    // Shockwave pulses triggered on click
    let shockwaves = [];

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseEnter = () => {
      mouseRef.current.active = true;
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      setIsHovered(false);
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 5,
        maxRadius: 160,
        alpha: 1,
        speed: 4,
      });

      // Give nearby particles an energetic impulse
      particles.forEach((p) => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (1 - dist / 120) * 8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("click", handleClick);

    let time = 0;

    // Render loop
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, heightPx);

      const rgb = hexToRgb(colorUpdaterRef.current);
      const mouse = mouseRef.current;

      // 1. Draw glowing central cosmic stream horizon line
      const centerY = heightPx / 2;
      const grad = ctx.createLinearGradient(0, centerY, width, centerY);
      grad.addColorStop(0, "rgba(255, 255, 255, 0)");
      grad.addColorStop(0.2, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
      grad.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isHovered ? 0.6 : 0.35})`);
      grad.addColorStop(0.8, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Subtle ambient core glow blur
      const ambientGlow = ctx.createRadialGradient(
        width / 2,
        centerY,
        0,
        width / 2,
        centerY,
        width * 0.45
      );
      ambientGlow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isHovered ? 0.18 : 0.08})`);
      ambientGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, width, heightPx);

      // 2. Process Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += sw.speed;
        sw.alpha *= 0.94;

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${sw.alpha * 0.8})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (sw.alpha < 0.02 || sw.radius > sw.maxRadius) {
          shockwaves.splice(i, 1);
        }
      }

      // 3. Update & Draw Particles
      const maxConnectDist = 65;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cosmic wave drift
        p.x += p.vx;
        const waveOffset = Math.sin(time + p.phase) * p.amplitude;
        p.y = p.originY + waveOffset + p.vy;

        // Damping velocities back to normal
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Wrap around horizontally
        if (p.x < 0) {
          p.x = width;
          p.originX = width;
        } else if (p.x > width) {
          p.x = 0;
          p.originX = 0;
        }

        // Keep inside vertical boundary smoothly
        if (p.originY < 10) p.originY = 10;
        if (p.originY > heightPx - 10) p.originY = heightPx - 10;

        // Mouse Gravitational Deflection / Magnetic Repulsion
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 3.5;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
            p.alpha = Math.min(1, p.baseAlpha + 0.4);
          } else {
            p.alpha = p.baseAlpha;
          }
        } else {
          p.alpha = p.baseAlpha;
        }

        // Draw connections between nearby particles (Constellation grid)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < maxConnectDist) {
            const linkAlpha = (1 - cdist / maxConnectDist) * 0.35 * Math.min(p.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${linkAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw individual particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.colorType === "accent") {
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.alpha})`;
        } else if (p.colorType === "cyan") {
          ctx.fillStyle = `rgba(100, 220, 255, ${p.alpha * 0.9})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        }
        ctx.fill();

        // Extra twinkle aura for hero stars
        if (p.isHeroStar) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.alpha * 0.25})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("click", handleClick);
    };
  }, [height, particleCount]);

  return (
    <div
      ref={containerRef}
      className={`particle-divider-container ${variant} ${isHovered ? "hovered" : ""}`}
      style={{ height: `${height}px` }}
    >
      <canvas ref={canvasRef} className="particle-divider-canvas" />

      {/* Central Interactive Cosmic Glyph Badge */}
      <div className="divider-center-badge">
        <div className="divider-glyph-orbit">
          <div className="divider-orbit-ring" />
          <span className="divider-glyph-symbol">{glyph}</span>
        </div>
        {label && <span className="divider-label">{label}</span>}
      </div>
    </div>
  );
};

export default ParticleDivider;
