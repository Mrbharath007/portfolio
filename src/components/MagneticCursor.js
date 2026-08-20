import React, { useEffect, useRef, useState } from "react";
import "../styles/MagneticCursor.css";

/**
 * MagneticCursor: Custom circular cursor with fluid spring physics,
 * magnetic attraction pull towards buttons/links/cards, and expansion
 * on interactive elements and 3D scenes.
 */
const MagneticCursor = ({ mainColor = "#7b61ff" }) => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const [isHovering, setIsHovering] = useState(false);
  const [is3DHover, setIs3DHover] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch / mobile devices
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    if (isTouch) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let targetMagneticX = null;
    let targetMagneticY = null;

    let rafId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Instant inner dot placement
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof HTMLElement)) return;

      // Check for 3D canvases
      const is3D = target.closest(".interactive-3d-scene, .hero-3d-canvas-container, .floating-hero-shapes-canvas, canvas");
      if (is3D) {
        setIs3DHover(true);
        setIsHovering(false);
        targetMagneticX = null;
        targetMagneticY = null;
        return;
      } else {
        setIs3DHover(false);
      }

      // Check for interactive elements
      const interactiveEl = target.closest(
        "a, button, input, textarea, select, .btn, .social-link, .skill-card, .project-card, .timeline-card, .carousel-container, .settings-icon, .color-swatch, .download-cv-btn, .tab-btn, .category-chip, .contact-detail, .glow-box"
      );

      if (interactiveEl) {
        setIsHovering(true);
        const rect = interactiveEl.getBoundingClientRect();
        // Calculate element center for magnetic attraction pull
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // If the element is reasonably sized (< 300px), apply magnetic pull
        if (rect.width < 320 && rect.height < 320) {
          const distX = mouseX - centerX;
          const distY = mouseY - centerY;
          // Apply magnetic offset (elastic dampening)
          targetMagneticX = centerX + distX * 0.35;
          targetMagneticY = centerY + distY * 0.35;
        } else {
          targetMagneticX = null;
          targetMagneticY = null;
        }
      } else {
        setIsHovering(false);
        targetMagneticX = null;
        targetMagneticY = null;
      }
    };

    const handleMouseLeaveWindow = () => setIsVisible(false);
    const handleMouseEnterWindow = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);

    // Spring loop for smooth trailing ring
    const renderLoop = () => {
      rafId = requestAnimationFrame(renderLoop);

      const targetX = targetMagneticX !== null ? targetMagneticX : mouseX;
      const targetY = targetMagneticY !== null ? targetMagneticY : mouseY;

      // Lerp interpolation (0.15 for snappy response)
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
    };
  }, [isVisible]);

  return (
    <div
      className="magnetic-cursor-container"
      style={{ opacity: isVisible ? 1 : 0 }}
      aria-hidden="true"
    >
      {/* Inner Pinpoint Dot */}
      <div
        ref={dotRef}
        className={`magnetic-cursor-dot ${isHovering ? "is-hovering" : ""} ${
          is3DHover ? "is-3d-hover" : ""
        } ${isClicking ? "is-clicking" : ""}`}
        style={{
          boxShadow: `0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px ${mainColor}`,
        }}
      />

      {/* Outer Magnetic Expanding Ring */}
      <div
        ref={ringRef}
        className={`magnetic-cursor-ring ${isHovering ? "is-hovering" : ""} ${
          is3DHover ? "is-3d-hover" : ""
        } ${isClicking ? "is-clicking" : ""}`}
        style={{
          borderColor: isHovering ? mainColor : undefined,
          boxShadow: isHovering
            ? `0 0 25px ${mainColor}, inset 0 0 15px rgba(0, 242, 254, 0.3)`
            : undefined,
        }}
      />
    </div>
  );
};

export default MagneticCursor;
