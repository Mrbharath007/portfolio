import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import "../styles/TargetCursor.css";

const TargetCursor = ({
  targetSelector = ".cursor-target, .skill-card, .project-card, .timeline-card, .btn, a, button",
  spinDuration = 2.5,
  hideDefaultCursor = false,
  hoverDuration = 0.2,
  parallaxStrength = 0.05,
}) => {
  const cursorRef = useRef(null);
  const cornersRef = useRef(null);
  const spinTl = useRef(null);
  const dotRef = useRef(null);

  const constants = useMemo(
    () => ({
      borderWidth: 2.5,
      cornerSize: 12,
      padding: 4,
    }),
    []
  );

  const moveCursor = useCallback((x, y) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.08,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  useEffect(() => {
    // Only enable on desktop / mouse devices
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    if (isTouch) return;

    if (!cursorRef.current) return;
    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll(".target-cursor-corner");

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = "none";
    }

    let activeTarget = null;
    let currentTargetMove = null;
    let currentLeaveHandler = null;
    let resumeTimeout = null;

    const cleanupTarget = (target) => {
      if (currentTargetMove) target.removeEventListener("mousemove", currentTargetMove);
      if (currentLeaveHandler) target.removeEventListener("mouseleave", currentLeaveHandler);
      currentTargetMove = null;
      currentLeaveHandler = null;
    };

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      opacity: 0,
    });

    const createSpinTimeline = () => {
      if (spinTl.current) spinTl.current.kill();
      spinTl.current = gsap.timeline({ repeat: -1 })
        .to(cursor, { rotation: "+=360", duration: spinDuration, ease: "none" });
    };
    createSpinTimeline();

    let hasMoved = false;
    const moveHandler = (e) => {
      if (!hasMoved) {
        hasMoved = true;
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
      }
      moveCursor(e.clientX, e.clientY);
    };
    window.addEventListener("mousemove", moveHandler, { passive: true });

    const mouseDownHandler = () => {
      if (dotRef.current) gsap.to(dotRef.current, { scale: 0.6, duration: 0.15 });
      if (cursorRef.current) gsap.to(cursorRef.current, { scale: 0.9, duration: 0.15 });
    };
    const mouseUpHandler = () => {
      if (dotRef.current) gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
      if (cursorRef.current) gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };
    window.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);

    const enterHandler = (e) => {
      const target = e.target.closest(targetSelector);
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;

      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) { clearTimeout(resumeTimeout); resumeTimeout = null; }

      activeTarget = target;
      gsap.killTweensOf(cursorRef.current, "rotation");
      spinTl.current?.pause();
      gsap.to(cursorRef.current, { rotation: 0, duration: 0.15, ease: "power2.out" });

      const updateCorners = (mouseX, mouseY) => {
        if (!activeTarget || !cursorRef.current || !cornersRef.current) return;
        const rect = target.getBoundingClientRect();
        const cursorRect = cursorRef.current.getBoundingClientRect();
        const cursorCenterX = cursorRect.left + cursorRect.width / 2;
        const cursorCenterY = cursorRect.top + cursorRect.height / 2;

        const [tlc, trc, brc, blc] = Array.from(cornersRef.current);
        const { cornerSize, padding } = constants;

        let tlOffset = { x: rect.left - cursorCenterX - padding, y: rect.top - cursorCenterY - padding };
        let trOffset = { x: rect.right - cursorCenterX + padding - cornerSize, y: rect.top - cursorCenterY - padding };
        let brOffset = { x: rect.right - cursorCenterX + padding - cornerSize, y: rect.bottom - cursorCenterY + padding - cornerSize };
        let blOffset = { x: rect.left - cursorCenterX - padding, y: rect.bottom - cursorCenterY + padding - cornerSize };

        if (mouseX !== undefined && mouseY !== undefined) {
          const targetCenterX = rect.left + rect.width / 2;
          const targetCenterY = rect.top + rect.height / 2;
          const mouseOffsetX = (mouseX - targetCenterX) * parallaxStrength;
          const mouseOffsetY = (mouseY - targetCenterY) * parallaxStrength;
          [tlOffset, trOffset, brOffset, blOffset].forEach((off) => {
            off.x += mouseOffsetX;
            off.y += mouseOffsetY;
          });
        }

        const offsets = [tlOffset, trOffset, brOffset, blOffset];
        [tlc, trc, brc, blc].forEach((corner, i) => {
          if (corner) {
            gsap.to(corner, {
              x: offsets[i].x,
              y: offsets[i].y,
              duration: hoverDuration,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });
      };

      updateCorners();

      const targetMove = (ev) => updateCorners(ev.clientX, ev.clientY);
      const leaveHandler = () => {
        activeTarget = null;
        if (!cornersRef.current) return;
        const corners = Array.from(cornersRef.current);
        gsap.killTweensOf(corners);
        const { cornerSize } = constants;
        const positions = [
          { x: -cornerSize * 1.3, y: -cornerSize * 1.3 },
          { x: cornerSize * 0.3, y: -cornerSize * 1.3 },
          { x: cornerSize * 0.3, y: cornerSize * 0.3 },
          { x: -cornerSize * 1.3, y: cornerSize * 0.3 },
        ];
        corners.forEach((c, idx) => {
          gsap.to(c, {
            x: positions[idx].x,
            y: positions[idx].y,
            duration: 0.25,
            ease: "power3.out",
            overwrite: "auto",
          });
        });

        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current) {
            createSpinTimeline();
          }
        }, 50);
        cleanupTarget(target);
      };

      currentTargetMove = targetMove;
      currentLeaveHandler = leaveHandler;
      target.addEventListener("mousemove", targetMove);
      target.addEventListener("mouseleave", leaveHandler);
    };

    const mouseLeaveWindow = () => gsap.to(cursor, { opacity: 0, duration: 0.2 });
    const mouseEnterWindow = () => {
      if (hasMoved) gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mouseover", enterHandler, { passive: true });
    document.addEventListener("mouseleave", mouseLeaveWindow);
    document.addEventListener("mouseenter", mouseEnterWindow);

    return () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseover", enterHandler);
      window.removeEventListener("mousedown", mouseDownHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("mouseleave", mouseLeaveWindow);
      document.removeEventListener("mouseenter", mouseEnterWindow);
      document.body.style.cursor = originalCursor;
      if (spinTl.current) spinTl.current.kill();
      if (activeTarget) cleanupTarget(activeTarget);
    };
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, hoverDuration, parallaxStrength]);

  return (
    <div ref={cursorRef} className="target-cursor-wrapper" aria-hidden="true">
      <div ref={dotRef} className="target-cursor-dot" />
      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
};

export default TargetCursor;
