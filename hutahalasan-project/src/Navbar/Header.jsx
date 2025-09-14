import React, { useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import logoHutaHalasan from "../assets/logo_huta_halasan.jpg";

function Header() {
  const [language, setLanguage] = useState("en");
  const [isOpen, setIsOpen] = useState(false);

  // Dictionary untuk teks
  const translations = {
    id: {
      home: "Beranda",
      education: "Edukasi",
      knowledge: "Pengetahuan",
      news: "Berita",
      langText: "Bahasa Indonesia",
    },
    en: {
      home: "Home",
      education: "Education",
      knowledge: "Knowledge",
      news: "News",
      langText: "English",
    },
    bt: {
      home: "Jabu",
      education: "Parsiajaran",
      knowledge: "Parbinotoan",
      news: "Barita",
      langText: "Batak",
    },
  };

  const t = translations[language]; // teks aktif

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
          <span className="brand-text">
            Parmalim Bale Pasogit <br /> Huta Halasan
          </span>
        </div>

        {/* Navbar links */}
        <nav className={`nav ${isOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
            {t.home}
          </Link>
          <Link to="/edu" className="nav-link" onClick={() => setIsOpen(false)}>
            {t.education}
          </Link>
          <Link
            to="/knowledge"
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            {t.knowledge}
          </Link>
          <Link
            to="/news"
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            {t.news}
          </Link>
        </nav>

        {/* Language selector */}
        <div className="language-selector">
          <select
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="id">🇮🇩</option>
            <option value="en">🇺🇸</option>
            <option value="bt">BT</option>
          </select>
          <span className="language-text">{t.langText}</span>
        </div>
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>
    </header>
  );
}

export default Header;
