import React from "react";
import { FaChevronDown } from "react-icons/fa";
import "../styles/ParallaxScrollNavigator.css";

const sectionsList = [
  { id: "home", label: "Home", nextId: "about", nextLabel: "About Me" },
  { id: "about", label: "About", nextId: "domains", nextLabel: "Area of Interest" },
  { id: "domains", label: "Domains", nextId: "skills", nextLabel: "Skills" },
  { id: "skills", label: "Skills", nextId: "projects", nextLabel: "Projects" },
  { id: "projects", label: "Projects", nextId: "timeline", nextLabel: "Timeline" },
  { id: "timeline", label: "Timeline", nextId: "contact", nextLabel: "Contact" },
  { id: "contact", label: "Contact", nextId: "home", nextLabel: "Back to Top" },
];

/**
 * ParallaxScrollNavigator: Interactive parallax scroll widget providing
 * animated "Scroll to Next Page" prompts and smooth section glide transitions.
 */
const ParallaxScrollNavigator = ({ activeSection = "home", mainColor = "#7b61ff" }) => {
  const currentSectionMeta =
    sectionsList.find((s) => s.id === activeSection) || sectionsList[0];

  const scrollToNextSection = () => {
    const nextId = currentSectionMeta.nextId;
    if (nextId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const targetEl = document.getElementById(nextId);
    if (targetEl) {
      const headerOffset = 70;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const scrollToSection = (id) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Floating Bottom Scroll Prompt */}
      <div
        className="parallax-scroll-indicator"
        onClick={scrollToNextSection}
        title={`Scroll down to ${currentSectionMeta.nextLabel}`}
        style={{
          borderColor: "rgba(255, 255, 255, 0.15)",
        }}
      >
        <div className="scroll-indicator-text">
          <span>Explore Next:</span>
          <span className="scroll-indicator-target">{currentSectionMeta.nextLabel}</span>
          <FaChevronDown className="scroll-arrow-down" />
        </div>
      </div>

      {/* Side Parallax Dot Navigator */}
      <div className="parallax-side-dock">
        {sectionsList.map((sec) => (
          <div
            key={sec.id}
            className={`dock-item ${activeSection === sec.id ? "active" : ""}`}
            onClick={() => scrollToSection(sec.id)}
          >
            <div className="dock-dot" />
            <span className="dock-tooltip">{sec.label}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default ParallaxScrollNavigator;
