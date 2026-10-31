import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-mark">🎬</div>
          <div className="logo-text">
            <span>Book</span>fix
          </div>
        </Link>

        <div className="navbar-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Movies
          </Link>
          <Link
            to="/cinemas"
            className={`nav-link ${location.pathname === '/cinemas' ? 'active' : ''}`}
          >
            Cinemas
          </Link>
          <Link
            to="/events"
            className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}
          >
            Events
          </Link>
        </div>
      </div>
    </nav>
  );
}
