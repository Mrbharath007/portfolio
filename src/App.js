import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutMe from './components/AboutMe';
import AreaOfInterest from './components/AreaOfInterest';
import Skills from './components/Skills'; 
import Contact from './components/Contact';
import Project from './components/Projects';
import fluidCursor from './hooks/useFluidCursor'; 
import GameLoader from './components/GameLoader';

// Renamed: Your profile card section
import ProfileCardSection from './components/Card';

// Timeline component
import TimeLine from './components/TimeLine';

// Interactive Space-Themed Section Particle Divider
import ParticleDivider from './components/ParticleDivider';

// Global custom magnetic circular cursor
import MagneticCursor from './components/MagneticCursor';

// Global ambient 3D floating background
import Global3DBackground from './components/Global3DBackground';

// Space-Themed Footer
import Footer from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Store the color in App-level state so multiple components can share it
  const [mainColor, setMainColor] = useState('#7b61ff');

  // App-level scroll states
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timelineProgress, setTimelineProgress] = useState(0);

  // Initialize fluid effect once on mount
  useEffect(() => {
    fluidCursor();
  }, []);

  // Update the CSS variables for main color and spotlight glow whenever it changes
  useEffect(() => {
    document.documentElement.style.setProperty('--main-color', mainColor);
    document.documentElement.style.setProperty('--mainColor', mainColor);
    
    // Convert hex to rgb for rgba transparency support
    const hex = (mainColor || '#7b61ff').replace('#', '');
    let r = 123, g = 97, b = 255;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16) || 123;
      g = parseInt(hex[1] + hex[1], 16) || 97;
      b = parseInt(hex[2] + hex[2], 16) || 255;
    } else if (hex.length >= 6) {
      r = parseInt(hex.substring(0, 2), 16) || 123;
      g = parseInt(hex.substring(2, 4), 16) || 97;
      b = parseInt(hex.substring(4, 6), 16) || 255;
    }
    document.documentElement.style.setProperty('--spotlight-color', `rgba(${r}, ${g}, ${b}, 0.25)`);
  }, [mainColor]);

  // Centralized scroll listener for Header Active section, Scroll Progress, and Timeline line fill
  const activeSectionRef = useRef('home');
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    let animFrame;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const totalHeight = document.documentElement.scrollHeight - windowHeight;

      // 1. Overall Page Scroll Progress (throttled updates)
      const newProgress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
      if (Math.abs(newProgress - scrollProgressRef.current) > 0.2) {
        scrollProgressRef.current = newProgress;
        setScrollProgress(newProgress);
      }

      // 2. Header Active Section (only update state when changed)
      const sections = ['home', 'about', 'domains', 'skills', 'projects', 'timeline', 'contact'];
      
      let current = 'home';
      if (totalHeight > 0 && scrollY >= totalHeight - 100) {
        current = 'contact';
      } else {
        // Focal line below fixed header (100px from top)
        const scrollPosition = scrollY + 100;

        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              current = sectionId;
            }
          }
        }
      }

      if (current !== activeSectionRef.current) {
        activeSectionRef.current = current;
        setActiveSection(current);
      }

      // 3. Timeline Fill Progress
      const timelineContainer = document.querySelector('.timeline-container');
      if (timelineContainer) {
        const rect = timelineContainer.getBoundingClientRect();
        const containerTop = rect.top + scrollY;
        const containerHeight = timelineContainer.offsetHeight || rect.height;

        // Viewport trigger line (65% down from top of viewport)
        const triggerPoint = scrollY + windowHeight * 0.65;

        if (containerHeight > 0) {
          let calculated = ((triggerPoint - containerTop) / containerHeight) * 100;
          if (calculated < 0) calculated = 0;
          if (calculated > 100) calculated = 100;
          setTimelineProgress(calculated);
        }
      }
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Initial check on load
    handleScroll();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isLoading]);

  // IntersectionObserver effect for smooth content reveal animations
  useEffect(() => {
    if (isLoading) return;

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.05,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Target content containers (excluding top-level section roots to preserve fixed anchor positions)
    const targets = document.querySelectorAll(
      '.about-me-container, .area-of-interest, .skills-container, .project-page-container, .timeline-container, .contact-page'
    );

    targets.forEach((el) => {
      el.classList.add('scroll-reveal');
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [isLoading]);

  return (
    <div className="App">
      {/* Custom Magnetic Circular Cursor */}
      <MagneticCursor mainColor={mainColor} />

      {/* Global Non-Blocking 3D Space Galaxy Parallax Engine */}
      <Global3DBackground mainColor={mainColor} />

      {/* Gaming Style Preloader */}
      {isLoading && (
        <GameLoader
          mainColor={mainColor}
          onFinish={() => setIsLoading(false)}
        />
      )}

      {/* Fluid canvas behind everything, no pointer events */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1,
          pointerEvents: 'none', // so we can still click/hover underlying elements
        }}
      >
        <canvas
          id="fluid"
          style={{
            width: '100vw',
            height: '100vh',
          }}
        />
      </div>

      {/* Header */}
      <Header 
        mainColor={mainColor} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        scrollProgress={scrollProgress} 
      />

      {/* Hero */}
      <HeroSection mainColor={mainColor} setMainColor={setMainColor} />

      {/* Interactive Particle Divider: Hero -> About */}
      <ParticleDivider mainColor={mainColor} glyph="✦" label="EXPLORE ABOUT" />

      {/* About */}
      <AboutMe mainColor={mainColor} />

      {/* Interactive Particle Divider: About -> Interests */}
      <ParticleDivider mainColor={mainColor} glyph="◈" label="DOMAINS OF PASSION" />

      {/* Interests */}
      <AreaOfInterest mainColor={mainColor} />

      {/* Interactive Particle Divider: Interests -> Skills */}
      <ParticleDivider mainColor={mainColor} glyph="⬡" label="TECHNICAL ARSENAL" />

      {/* Skills */}
      <Skills mainColor={mainColor} />

      {/* Interactive Particle Divider: Skills -> Projects */}
      <ParticleDivider mainColor={mainColor} glyph="◆" label="FEATURED CREATIONS" />

      {/* Projects */}
      <Project mainColor={mainColor} />

      {/* Profile Card Section */}
      <ProfileCardSection />

      {/* Interactive Particle Divider: Profile/Card -> Timeline */}
      <ParticleDivider mainColor={mainColor} glyph="✧" label="CAREER TRAJECTORY" />

      {/* Timeline Section */}
      <TimeLine mainColor={mainColor} />

      {/* Interactive Particle Divider: Timeline -> Contact */}
      <ParticleDivider mainColor={mainColor} glyph="✵" label="INITIATE CONTACT" />

      {/* Contact */}
      <Contact mainColor={mainColor} />

      {/* Modern Space-Themed Footer */}
      <Footer mainColor={mainColor} />
    </div>
  );
}

export default App;
