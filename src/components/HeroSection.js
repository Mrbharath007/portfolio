import React, { useState, useCallback } from "react";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";
import { FiSettings } from "react-icons/fi";
import { FaWhatsapp, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import FloatingHeroShapes from "./FloatingHeroShapes";
import profileImage from "../assets/profile.png"; // Adjust path if needed
import "../styles/HeroSection.css";

const HeroSection = ({ mainColor = "#7b61ff", setMainColor }) => {

  const [showColorOptions, setShowColorOptions] = useState(false);

  // Toggles the color palette menu
  const handleGearClick = () => {
    setShowColorOptions((prev) => !prev);
  };

  // Updates the main color and sets the CSS variable
  function handleColorChange(color) {
    // 1) Update mainColor state & set --main-color
    setMainColor(color);
    document.documentElement.style.setProperty("--main-color", color);

    // 2) Convert hex color to r,g,b
    const { r, g, b } = hexToRGB(color);

    // 3) Create a lighter alpha version for spotlight (e.g. 0.2 alpha)
    const spotlightRGBA = `rgba(${r}, ${g}, ${b}, 0.2)`;

    // 4) Set a new CSS variable --spotlight-color
    document.documentElement.style.setProperty("--spotlight-color", spotlightRGBA);
  }

  // Helper to parse a hex color (#RRGGBB or #RGB) into {r, g, b}
  function hexToRGB(hex) {
    hex = hex.replace("#", "");
    let r, g, b;

    if (hex.length === 3) {
      // short form #RGB
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      // long form #RRGGBB
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
    return { r, g, b };
  }

  // Handle smooth scroll to the "about" section with header offset
  const handleGetStarted = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      const headerOffset = 70;
      const elementPosition = aboutSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  // Handle smooth scroll to the "projects" section with header offset
  const handleViewProjects = () => {
    const projectSection = document.getElementById("projects");
    if (projectSection) {
      const headerOffset = 70;
      const elementPosition = projectSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  // Particles init using tsparticles-slim for better performance
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Particles config (on the left dark side)
  const particlesOptions = {
    fullScreen: { enable: false },
    background: { color: "transparent" },
    particles: {
      number: {
        value: 90,
        density: { enable: true, value_area: 800 },
      },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      move: { enable: true, speed: 1.8 },
      color: { value: "#ffffff" },
      links: {
        enable: true,
        distance: 140,
        color: "#ffffff",
        opacity: 0.35,
        width: 1,
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { particles_nb: 4 },
      },
    },
  };

  return (
    <div className="hero-section" id="home">
      {/* Floating 3D Geometric Polyhedra Layer with Parallax Mouse-Follow */}
      <FloatingHeroShapes mainColor={mainColor} />

      {/* Triangles that straddle the boundary between black & white */}
      <div className="triangle-wrapper">
        {/* Background triangle (color changes via var(--main-color)) */}
        <div className="triangle-bg" />
        {/* Foreground triangle for the image */}
        <div className="triangle-fg">
          <img src={profileImage} alt="Profile" />
        </div>
      </div>

      {/* Left side: dark space background + interactive particles */}
      <div className="left-section">
        <Particles
          id="particles"
          init={particlesInit}
          options={particlesOptions}
          className="particles-container"
        />
      </div>

      {/* Right side: gear icon + color swatches + text content */}
      <div className="right-section">
        {/* Gear Icon */}
        <div className="settings-icon" onClick={handleGearClick}>
          <FiSettings />
        </div>

        {/* Color Palette (shown if gear clicked) */}
        {showColorOptions && (
          <div className="color-options animate-fade-in">
            <span className="theme-label">Accent Theme:</span>
            <div className="swatch-grid">
              {[
                { name: "Electric Purple", color: "#7b61ff" },
                { name: "Cyber Crimson", color: "#fc6d6d" },
                { name: "Neon Gold", color: "#fbc531" },
                { name: "Emerald Green", color: "#2ecc71" },
                { name: "Cyan Glow", color: "#00f2fe" },
                { name: "Synthwave Pink", color: "#ff2a85" },
              ].map((c) => (
                <div
                  key={c.color}
                  className={`color-swatch ${
                    mainColor.toLowerCase() === c.color.toLowerCase() ? "active-swatch" : ""
                  }`}
                  title={c.name}
                  style={{
                    backgroundColor: c.color,
                    outline: mainColor.toLowerCase() === c.color.toLowerCase() ? "2px solid #ffffff" : "none",
                    outlineOffset: "2px",
                    transform: mainColor.toLowerCase() === c.color.toLowerCase() ? "scale(1.18)" : "scale(1)",
                  }}
                  onClick={() => handleColorChange(c.color)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Floating tech badge chips */}
        <div className="hero-floating-badges">
          <span className="hero-badge badge-1">⚡ AI Specialist</span>
          <span className="hero-badge badge-2">📱 Flutter & iOS</span>
          <span className="hero-badge badge-3">📊 Data Analytics</span>
        </div>

        {/* Right-side animated text content */}
        <div className="right-content">
          <h2 className="iam-text">I&apos;M</h2>
          <div className="slider-text-container">
            <ul className="dynamic-text">
              <li>
                <span>Web Developer</span>
              </li>
              <li>
                <span>Flutter Developer</span>
              </li>
              <li>
                <span>An AI Engineer</span>
              </li>
              <li>
                <span>A Data Analyst</span>
              </li>
            </ul>
          </div>

          {/* TWO BUTTONS BELOW THE TEXT */}
          <div className="button-container">
            <button className="get-started-btn" onClick={handleGetStarted}>
              Get Started
            </button>
            <button className="portfolio-btn" onClick={handleViewProjects}>
              View Projects
            </button>
          </div>
        </div>

        {/* FOLLOW ME ON / SOCIAL ICONS at the bottom */}
        <div className="follow-me-container">
          <p className="follow-text">Follow me on :</p>
          <div className="social-icons">
            {/* WhatsApp */}
            <a
              href="https://wa.me/7904117676"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FaWhatsapp />
            </a>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/mr_bharath___07?igsh=M3ZlcHBqM2dmYnly"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FaInstagram />
            </a>
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/bharath-b-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FaLinkedinIn />
            </a>
            {/* GitHub */}
            <a
              href="https://github.com/Mrbharath007"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
