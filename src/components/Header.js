import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import logo from '../assets/name_logo.png';
import DownloadCVBtn from './DownloadCVBtn';
import { FaTimes, FaGithub, FaLinkedinIn, FaInstagram, FaCompass } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const Header = ({
  mainColor = '#7b61ff',
  activeSection: propActiveSection,
  setActiveSection: propSetActiveSection,
  scrollProgress: propScrollProgress,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localActiveSection, setLocalActiveSection] = useState('home');
  const [localScrollProgress, setLocalScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const activeSection = propActiveSection !== undefined ? propActiveSection : localActiveSection;
  const setActiveSection = propSetActiveSection || setLocalActiveSection;
  const scrollProgress = propScrollProgress !== undefined ? propScrollProgress : localScrollProgress;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile off-canvas menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSidebarClick = (e) => {
    e.stopPropagation();
  };

  const handleNavLinkClick = (e, targetId) => {
    e.preventDefault();
    setActiveSection(targetId);
    const section = document.getElementById(targetId);
    if (section) {
      if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const headerOffset = 70;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', id: 'home', code: '01' },
    { label: 'About', id: 'about', code: '02' },
    { label: 'Domains', id: 'domains', code: '03' },
    { label: 'Skills', id: 'skills', code: '04' },
    { label: 'Projects', id: 'projects', code: '05' },
    { label: 'Timeline', id: 'timeline', code: '06' },
    { label: 'Contact', id: 'contact', code: '07' },
  ];

  return (
    <>
      {/* Top Cosmic Ion Laser Scroll Beam */}
      <div
        className="cosmic-scroll-track"
        style={{ '--mainColor': mainColor }}
      >
        <div
          className="cosmic-scroll-beam"
          style={{
            width: `${scrollProgress}%`,
            backgroundColor: mainColor,
          }}
        >
          <div className="cosmic-beam-spark" />
        </div>
      </div>

      <header
        className={`header space-hud-header ${scrolled ? 'scrolled' : ''}`}
        style={{ '--mainColor': mainColor }}
      >
        {/* LOGO & COSMIC TELEMETRY BADGE */}
        <div className="logo-hud-group">
          <a
            href="#home"
            onClick={(e) => handleNavLinkClick(e, 'home')}
            className="logo-anchor"
            aria-label="Navigate to Home"
          >
            <div className="logo-halo-ring" />
            <img src={logo} alt="Bharath Logo" className="logo space-logo" />
          </a>

          <div className="cosmic-status-indicator" title="Cosmic Orbit Active">
            <span className="pulsing-cosmic-dot" />
            <span className="cosmic-status-text">ORBIT ACTIVE</span>
          </div>
        </div>

        {/* DESKTOP SPACE NAVIGATION HUD */}
        <nav className="desktop-nav space-nav-capsule" aria-label="Main Navigation">
          <ul className="nav-links space-nav-list">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id} className="nav-item-wrap">
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNavLinkClick(e, item.id)}
                    className={`nav-link space-nav-link ${isActive ? 'active-nav-link' : ''}`}
                  >
                    <span className="space-nav-code">{item.code}</span>
                    <span className="space-nav-label">{item.label}</span>
                    {isActive && <span className="active-starlight-pill" />}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* DESKTOP ACTION: Download CV Button */}
        <div className="desktop-cv-btn space-action-wrap">
          <DownloadCVBtn mainColor={mainColor} />
        </div>

        {/* MOBILE HAMBURGER TOGGLE */}
        <button
          type="button"
          className="hamburger-container space-hamburger-trigger"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-offcanvas-menu"
        >
          <div className={`hamburger ${isMenuOpen ? 'is-active' : ''}`} id="hamburger-6">
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </button>
      </header>

      {/* MOBILE OFF-CANVAS COMMAND OVERLAY & DRAWER */}
      <div 
        id="mobile-offcanvas-menu"
        className={`sidebar-overlay space-sidebar-backdrop ${isMenuOpen ? 'drawer-visible' : 'drawer-hidden'}`} 
        onClick={handleCloseMenu}
        aria-hidden={!isMenuOpen}
      >
        <aside 
          className="sidebar space-command-drawer" 
          onClick={handleSidebarClick}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Drawer Top Header & Close Button */}
          <div className="sidebar-cosmic-header">
            <div className="sidebar-brand-badge">
              <div className="pulsing-cosmic-dot" />
              <div className="sidebar-header-titles">
                <span className="sidebar-title">STARSHIP NAVIGATION</span>
                <span className="sidebar-subtitle">Deep Space Coordinates</span>
              </div>
            </div>

            <button
              type="button"
              className="drawer-close-btn"
              onClick={handleCloseMenu}
              aria-label="Close navigation drawer"
            >
              <FaTimes className="drawer-close-icon" />
            </button>
          </div>

          {/* Navigation Links with Staggered Visual Flow */}
          <nav className="space-mobile-nav-container">
            <ul className="nav-links sidebar-links space-mobile-nav-list">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.id;
                return (
                  <li 
                    key={item.id} 
                    className="mobile-nav-item"
                    style={{ animationDelay: `${0.05 + index * 0.04}s` }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleNavLinkClick(e, item.id)}
                      className={`space-mobile-link ${isActive ? 'active-nav-link' : ''}`}
                    >
                      <div className="mobile-link-left">
                        <span className="space-mobile-code">{item.code} //</span>
                        <span className="space-mobile-label">{item.label}</span>
                      </div>
                      {isActive ? (
                        <span className="active-glow-pip" />
                      ) : (
                        <span className="mobile-link-chevron">›</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Action Section: CV Download & Social Quick Links */}
          <div className="drawer-bottom-zone">
            <div className="drawer-cv-wrap">
              <DownloadCVBtn mainColor={mainColor} />
            </div>

            <div className="drawer-social-row">
              <a
                href="https://github.com/Mrbharath007"
                target="_blank"
                rel="noopener noreferrer"
                className="drawer-social-icon"
                aria-label="GitHub Profile"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/bharath-b-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="drawer-social-icon"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.instagram.com/mr_bharath___07"
                target="_blank"
                rel="noopener noreferrer"
                className="drawer-social-icon"
                aria-label="Instagram Profile"
              >
                <FaInstagram />
              </a>
            </div>

            <div className="drawer-status-footer">
              <HiSparkles className="drawer-spark-icon" />
              <span>Bharath Baskaran • AI Portfolio</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Header;
