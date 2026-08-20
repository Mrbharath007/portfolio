import React, { useState } from 'react';
import { FiDownload, FiCheck, FiLoader } from 'react-icons/fi';
import '../styles/DownloadCVBtn.css';

const resumeUrl =
  'https://firebasestorage.googleapis.com/v0/b/yuma-foods.firebasestorage.app/o/own%2FBharath_2799958.pdf?alt=media&token=8df8c98a-6d19-4674-854c-0f7c072efa91';

const DownloadCVBtn = ({ mainColor, className = '' }) => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'downloading' | 'completed'
  const [progress, setProgress] = useState(0);

  const handleDownload = (e) => {
    e.preventDefault();
    if (status !== 'idle') return;

    setStatus('downloading');
    setProgress(0);

    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds smooth fill animation

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(currentProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        setStatus('completed');

        // Trigger PDF file download/open in a new window
        const link = document.createElement('a');
        link.href = resumeUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.download = 'Bharath_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Reset state after 3 seconds
        setTimeout(() => {
          setStatus('idle');
          setProgress(0);
        }, 3000);
      }
    }, 30);
  };

  return (
    <button
      onClick={handleDownload}
      className={`download-cv-btn-animated ${status} ${className}`}
      style={{
        '--accent-color': mainColor || '#7b61ff',
      }}
      disabled={status !== 'idle'}
      aria-label="Download CV"
      type="button"
    >
      {/* Animated Background Progress Bar */}
      <div
        className="cv-btn-progress-fill"
        style={{ width: status === 'idle' ? '0%' : `${progress}%` }}
      />

      {/* Sparkle Confetti Particles on Completion */}
      {status === 'completed' && (
        <div className="sparkle-particles">
          <span className="p1" style={{ background: mainColor || '#7b61ff' }} />
          <span className="p2" style={{ background: mainColor || '#7b61ff' }} />
          <span className="p3" style={{ background: mainColor || '#7b61ff' }} />
          <span className="p4" style={{ background: mainColor || '#7b61ff' }} />
          <span className="p5" style={{ background: mainColor || '#7b61ff' }} />
          <span className="p6" style={{ background: mainColor || '#7b61ff' }} />
        </div>
      )}

      {/* Button Content */}
      <div className="cv-btn-content">
        {status === 'idle' && (
          <>
            <FiDownload className="cv-icon arrow-bounce" />
            <span className="cv-btn-text">Download CV</span>
          </>
        )}

        {status === 'downloading' && (
          <>
            <FiLoader className="cv-icon spinner" />
            <span className="cv-btn-text">Downloading {progress}%</span>
          </>
        )}

        {status === 'completed' && (
          <>
            <FiCheck className="cv-icon check-pop" />
            <span className="cv-btn-text">Downloaded!</span>
          </>
        )}
      </div>
    </button>
  );
};

export default DownloadCVBtn;
