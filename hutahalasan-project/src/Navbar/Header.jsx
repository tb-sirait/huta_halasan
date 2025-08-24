import React from "react";
import "./header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <div className="header">
        <div className="container">
          <div className="nav-brand">
            <img src="/api/placeholder/40/40" alt="Logo" className="logo" />
            <span className="brand-text">Bale Pasogit</span>
          </div>
          <nav className="nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/edu" className="nav-link">
              Education
            </Link>
            <Link to="/knowledge" className="nav-link">
              Knowledge
            </Link>
            <Link to="/news" className="nav-link">
              News
            </Link>
          </nav>
          <div className="language-selector">
            <select className="language-select">
              <option value="id">🇮🇩</option>
              <option value="en">🇺🇸</option>
            </select>
            <span className="language-text">English</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
