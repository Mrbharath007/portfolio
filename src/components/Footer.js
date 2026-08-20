import React from 'react';
import { FaGithub, FaLinkedinIn, FaInstagram, FaArrowUp, FaRocket } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import '../styles/Footer.css';

const Footer = ({ mainColor = "#7b61ff" }) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="space-footer" id="space-footer">
      {/* Ambient Top Nebula Horizon Line */}
      <div className="footer-nebula-line" />

      <div className="footer-inner-container">
        {/* Main Content Grid */}
        <div className="footer-top-grid">
          {/* Brand & Cosmic Bio */}
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <span className="footer-logo-glyph">✦</span>
              <span className="footer-logo-text">BHARATH BASKARAN</span>
            </div>
            <p className="footer-bio">
              AI Engineer & Full-Stack Developer navigating the frontiers of Intelligent Systems, 
              Deep Learning, and interactive web experiences.
            </p>
            <div className="footer-status-pill">
              <span className="status-orbit-dot" />
              <span className="status-text">Mission Status: Ready for new Horizons</span>
            </div>
          </div>

          {/* Quick Navigation Coordinates */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">
              <HiSparkles className="footer-title-icon" /> Navigation Coordinates
            </h4>
            <ul className="footer-nav-links">
              <li>
                <button type="button" onClick={() => scrollToSection('home')} className="footer-nav-btn">
                  Orbit / Home
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('about')} className="footer-nav-btn">
                  Mission Brief / About
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('skills')} className="footer-nav-btn">
                  Tech Arsenal / Skills
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('projects')} className="footer-nav-btn">
                  Creations / Projects
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('contact')} className="footer-nav-btn">
                  Transmission / Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Connect & Social Hub */}
          <div className="footer-social-col">
            <h4 className="footer-col-title">
              <span className="footer-title-symbol">⬡</span> Deep Space Signals
            </h4>
            <p className="footer-social-subtitle">
              Connect across the global network for collaborations and inquiries.
            </p>

            <div className="footer-social-cards">
              {/* GitHub */}
              <a
                href="https://github.com/Mrbharath007"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-card"
                aria-label="GitHub Profile"
                id="footer-github-link"
              >
                <div className="social-card-icon-wrap github">
                  <FaGithub />
                </div>
                <div className="social-card-info">
                  <span className="social-card-name">GitHub</span>
                  <span className="social-card-handle">@Mrbharath007</span>
                </div>
                <span className="social-card-arrow">↗</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/bharath-b-ai?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-card"
                aria-label="LinkedIn Profile"
                id="footer-linkedin-link"
              >
                <div className="social-card-icon-wrap linkedin">
                  <FaLinkedinIn />
                </div>
                <div className="social-card-info">
                  <span className="social-card-name">LinkedIn</span>
                  <span className="social-card-handle">bharath-b-ai</span>
                </div>
                <span className="social-card-arrow">↗</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/mr_bharath___07?igsh=M3ZlcHBqM2dmYnly"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-card"
                aria-label="Instagram Profile"
                id="footer-instagram-link"
              >
                <div className="social-card-icon-wrap instagram">
                  <FaInstagram />
                </div>
                <div className="social-card-info">
                  <span className="social-card-name">Instagram</span>
                  <span className="social-card-handle">@mr_bharath___07</span>
                </div>
                <span className="social-card-arrow">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Divider */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {currentYear} Bharath Baskaran. Built with React & Three.js in Deep Space.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="footer-warp-top-btn"
            title="Warp to Top"
            aria-label="Scroll back to top of the page"
            id="footer-back-to-top"
          >
            <FaRocket className="warp-icon" />
            <span>WARP TO TOP</span>
            <FaArrowUp className="warp-arrow" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
