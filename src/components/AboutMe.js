import React, { useState, useRef, useEffect } from "react";
import aboutPhoto from "../assets/profile1.png";
import Interactive3DScene from "./Interactive3DScene";
import Hero3DCanvas from "./Hero3DCanvas";
import "../styles/AboutMe.css";

// --- Throttle function (remains the same) ---
function throttle(func, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

// --- TiltEffect component (remains the same) ---
const TiltEffect = ({ children }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const throttledMouseMove = useRef(
    throttle((e) => {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const centerX = box.width / 2;
      const centerY = box.height / 2;
      const rotateX = (y - centerY) / 7;
      const rotateY = (centerX - x) / 7;
      setRotate({ x: rotateX, y: rotateY });
    }, 100) // Keep throttle delay reasonable
  ).current;

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className="tilt-container relative transition-[all_400ms_cubic-bezier(0.03,0.98,0.52,0.99)_0s] will-change-transform"
      onMouseMove={throttledMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
      }}
    >
      {/* Pulse effect for the diamond style */}
      <div className="pulse absolute -inset-2 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-75 blur-xl" />
      <div className="relative">{children}</div>
    </div>
  );
};

// --- AboutMe component (with scroll animation logic) ---
const AboutMe = ({ mainColor = "#7b61ff" }) => {
  const leftRef = useRef(null); // Ref for the left section
  const rightRef = useRef(null); // Ref for the right section

  useEffect(() => {
    const observerOptions = {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.1, // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const currentLeftRef = leftRef.current;
    const currentRightRef = rightRef.current;

    if (currentLeftRef) {
      observer.observe(currentLeftRef);
    }
    if (currentRightRef) {
      observer.observe(currentRightRef);
    }

    return () => {
      if (currentLeftRef) {
        observer.unobserve(currentLeftRef);
      }
      if (currentRightRef) {
        observer.unobserve(currentRightRef);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div className="about-me-container" id="about">
      {/* 3D WebGL Background switched from Hero Section */}
      <div className="about-3d-bg-container">
        <Hero3DCanvas mainColor={mainColor} />
      </div>

      {/* Left side: Text */}
      <div className="about-me-left animate-on-scroll" ref={leftRef}>
        <h2 className="iam-bharath">
          I'M <span className="neon-text">BHARATH</span>
        </h2>
        <h3 className="subheading">About Me</h3>
        <p>
          Hello! My name is <strong>Bharath Baskaran</strong>. I am a System Engineer at TCS and a passionate freelancer. 
          I engineer cutting-edge web applications, mobile platforms (Android & iOS using Flutter), 
          and AI-driven models with data analytics to build high-impact digital products.
        </p>

        {/* Key Stats Counter Grid */}
        <div className="about-stats-grid">
          <div className="stat-card">
            <h4 className="stat-number">16+</h4>
            <span className="stat-label">Projects Built</span>
          </div>
          <div className="stat-card">
            <h4 className="stat-number">4+</h4>
            <span className="stat-label">Tech Domains</span>
          </div>
          <div className="stat-card">
            <h4 className="stat-number">TCS</h4>
            <span className="stat-label">System Engineer</span>
          </div>
          <div className="stat-card">
            <h4 className="stat-number">100%</h4>
            <span className="stat-label">Dedication</span>
          </div>
        </div>

        {/* Tech Skill Chips */}
        <div className="about-tech-chips">
          {["Python", "React.js", "Flutter", "AI / ML", "PyTorch", "Data Science", "PostgreSQL", "Firebase"].map((chip, idx) => (
            <span key={idx} className="tech-chip">{chip}</span>
          ))}
        </div>

        <button
          className="contact-button glow-btn"
          style={{ backgroundColor: "var(--main-color)" }}
          onClick={() => {
            const targetSection = document.getElementById("contact");
            if (targetSection) {
              targetSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Contact Me
        </button>
      </div>

      {/* Right side: Photo with tilt effect + Interactive 3D Cyber Crystal */}
      <div className="about-me-right animate-on-scroll" ref={rightRef}>
        <div style={{ width: "100%", maxWidth: "340px", margin: "0 auto" }}>
          <TiltEffect>
            <img src={aboutPhoto} alt="Bharath" className="about-me-photo" />
          </TiltEffect>
          <div style={{ marginTop: "15px" }}>
            <Interactive3DScene mode="tech-crystal" mainColor={mainColor} height="140px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;