import React, { useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import logoHutaHalasan from "../assets/logo_huta_halasan.jpg"; // taruh di src/assets

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        {/* Brand */}
        <div className="nav-brand">
          <img
            src={logoHutaHalasan}
            alt="Logo Huta Halasan"
            className="brand-logo"
          />
          <span className="brand-text">Bale Pasogit</span>
        </div>

        

        {/* Navbar links */}
        <nav className={`nav ${isOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/edu" className="nav-link" onClick={() => setIsOpen(false)}>
            Education
          </Link>
          <Link to="/knowledge" className="nav-link" onClick={() => setIsOpen(false)}>
            Knowledge
          </Link>
          <Link to="/news" className="nav-link" onClick={() => setIsOpen(false)}>
            News
          </Link>
        </nav>

        {/* Language selector */}
        <div className="language-selector">
          <select className="language-select">
            <option value="id">🇮🇩</option>
            <option value="en">🇺🇸</option>
            <option value="bt">bt</option>
          </select>
          <span className="language-text">English</span>
        </div>
        {/* Hamburger button (muncul di mobile) */}
        <button
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}

export default Header;
