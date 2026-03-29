import './Header.css';

function Header({ onDashboardClick, onLogoClick }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={onLogoClick} style={{ cursor: 'pointer' }}>Vein Motion</div>
        <nav className="nav-links">
          <a href="#">Products</a>
          <a href="#">Creators</a>
          <button className="user-icon-btn" onClick={onDashboardClick} aria-label="Dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
