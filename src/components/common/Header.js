import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
              <circle cx="12" cy="5" r="2"/>
              <path d="M12 7v4"/>
              <line x1="8" y1="21" x2="8" y2="17"/>
              <line x1="16" y1="21" x2="16" y2="17"/>
            </svg>
          </div>
          <span className="logo-text">RailwayPro</span>
        </Link>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-links">
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/book-ticket" onClick={() => setIsMenuOpen(false)}>Book Ticket</Link></li>
            {user && (
              <>
                <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                <li className="dropdown">
                  <span className="dropdown-trigger">Features</span>
                  <ul className="dropdown-menu">
                    <li><Link to="/voice-assistant" onClick={() => setIsMenuOpen(false)}>Voice Assistant</Link></li>
                    <li><Link to="/seat-finder" onClick={() => setIsMenuOpen(false)}>Seat Finder</Link></li>
                    <li><Link to="/cab-booking" onClick={() => setIsMenuOpen(false)}>Cab Booking</Link></li>
                    <li><Link to="/porter-service" onClick={() => setIsMenuOpen(false)}>Porter Service</Link></li>
                    <li><Link to="/food-ordering" onClick={() => setIsMenuOpen(false)}>Food Ordering</Link></li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="auth-section">
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="reward-points">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {user.rewardPoints}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;