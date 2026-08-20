import React, { useState, useEffect } from 'react';
import { FaGamepad, FaServer, FaShieldAlt, FaRocket, FaBolt } from 'react-icons/fa';
import '../styles/GameLoader.css';

const loadingStages = [
  { pct: 0, text: 'INITIALIZING CORE ENGINE...' },
  { pct: 20, text: 'LOADING GRAPHICS & FLUID SHADERS...' },
  { pct: 45, text: 'CONNECTING TO CLOUD NODES (AWS / GCP / AZURE)...' },
  { pct: 70, text: 'SYNCHRONIZING PORTFOLIO ASSETS...' },
  { pct: 90, text: 'FINALIZING HUD INTERFACE...' },
  { pct: 100, text: 'SYSTEM READY. WELCOME PLAYER 1' },
];

const GameLoader = ({ mainColor = '#7b61ff', onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING CORE ENGINE...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Accelerate loading progress smoothly
      const increment = Math.floor(Math.random() * 6) + 3;
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      // Update loading status text based on percentage
      const stage = [...loadingStages].reverse().find((s) => currentProgress >= s.pct);
      if (stage) {
        setStatusText(stage.text);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        // Wait briefly at 100% then trigger exit transition
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 800); // match CSS transition duration
        }, 600);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div
      className={`game-loader-overlay ${isFadingOut ? 'fade-out' : ''}`}
      style={{ '--glow-color': mainColor }}
    >
      {/* Background Cyberpunk Grid & Light Effects */}
      <div className="game-loader-bg-grid" />
      <div className="game-loader-scanline" />
      <div className="game-loader-glow-orb" />

      {/* Cyberpunk HUD Frame */}
      <div className="game-hud-frame">
        {/* HUD Top Bar Info */}
        <div className="hud-header">
          <div className="hud-badge">
            <FaGamepad className="hud-icon pulse" />
            <span>PORTFOLIO OS // V3.0</span>
          </div>
          <div className="hud-stats">
            <span><FaServer /> SYS: ONLINE</span>
            <span><FaShieldAlt /> SECURE</span>
            <span><FaBolt /> 60 FPS</span>
          </div>
        </div>

        {/* HUD Center Graphic */}
        <div className="hud-center">
          <div className="hud-reactor-ring">
            <div className="reactor-core">
              <FaRocket className="reactor-icon" />
            </div>
          </div>
          <div className="hud-title-wrap">
            <h2 className="hud-title">BHARATH portfolio</h2>
            <div className="hud-subtitle">// INITIALIZING ENVIRONMENT</div>
          </div>
        </div>

        {/* HUD Progress Counter & Bar */}
        <div className="hud-progress-section">
          <div className="hud-progress-header">
            <span className="hud-status-text">{statusText}</span>
            <span className="hud-percentage">{progress}%</span>
          </div>

          <div className="hud-progress-track">
            <div
              className="hud-progress-bar"
              style={{ width: `${progress}%` }}
            >
              <div className="hud-progress-head-glow" />
            </div>
            {/* Grid markings on progress bar */}
            <div className="hud-progress-ticks">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`tick ${progress > (i + 1) * 5 ? 'active' : ''}`} />
              ))}
            </div>
          </div>
        </div>

        {/* HUD Footer status */}
        <div className="hud-footer">
          <div className="hud-corner top-left" />
          <div className="hud-corner top-right" />
          <div className="hud-corner bottom-left" />
          <div className="hud-corner bottom-right" />
          <span className="hud-footer-text">LOADING PORTFOLIO EXPERIENCES</span>
        </div>
      </div>
    </div>
  );
};

export default GameLoader;
