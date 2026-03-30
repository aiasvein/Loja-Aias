import { useState } from 'react';
import LoginModal from './LoginModal';
import './Header.css';

function Header({ onLogoClick }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo" onClick={onLogoClick} style={{ cursor: 'pointer' }}>Vein Motion</div>
          <nav className="nav-links">
            <a href="#">Products</a>
            <a href="#">Creators</a>
            <button
              className="user-icon-btn"
              onClick={() => setShowLogin(true)}
              aria-label="Entrar na conta"
              id="user-login-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default Header;
