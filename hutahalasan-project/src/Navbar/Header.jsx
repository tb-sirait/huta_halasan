import React from "react";
import "./header.css";

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
            <a href="#home" className="nav-link">
              Home
            </a>
            <a href="#education" className="nav-link">
              Education
            </a>
            <a href="#knowledge" className="nav-link">
              Knowledge
            </a>
            <a href="#news" className="nav-link">
              News
            </a>
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
