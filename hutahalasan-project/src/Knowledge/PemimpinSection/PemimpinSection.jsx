// src/Knowledge/SectionPemimpin/SectionPemimpin.jsx
import React, { useState } from "react";
import "./pemimpinsection.css";
import dataPemimpin from "./dataPemimpin.json";

const { pemimpin_pusat: PEMIMPIN_PUSAT, ulu_punguan: ULU_PUNGUAN } = dataPemimpin;

// ── AVATAR PLACEHOLDER ─────────────────────────────────────────────────────────
const AvatarPlaceholder = ({ nama, size = 56 }) => {
  const initials = nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className="sp-avatar-placeholder"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials}
    </div>
  );
};

// ── MODAL ──────────────────────────────────────────────────────────────────────
const Modal = ({ item, onClose }) => {
  if (!item) return null;
  const isPusat = item.status === "Pemimpin Pusat";

  return (
    <div className="sp-modal-backdrop" onClick={onClose}>
      <div
        className="sp-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sp-modal-title"
      >
        <button className="sp-modal-close" onClick={onClose} aria-label="Tutup">
          ✕
        </button>

        <div className={`sp-modal-header ${isPusat ? "sp-modal-header--pusat" : "sp-modal-header--cabang"}`}>
          <div className="sp-modal-avatar-wrap">
            <AvatarPlaceholder nama={item.nama} size={80} />
          </div>
          <div className="sp-modal-header-info">
            <span className={`sp-modal-badge ${isPusat ? "sp-badge--pusat" : "sp-badge--cabang"}`}>
              {item.jabatan}
            </span>
            <h2 id="sp-modal-title" className="sp-modal-name">{item.nama}</h2>
            <p className="sp-modal-asal">📍 {item.asal_punguan}</p>
          </div>
        </div>

        <div className="sp-modal-body">
          <div className="sp-modal-info-row">
            <div className="sp-modal-info-item">
              <span className="sp-modal-info-label">ID</span>
              <span className="sp-modal-info-value sp-id-badge">{item.id}</span>
            </div>
            <div className="sp-modal-info-item">
              <span className="sp-modal-info-label">Status</span>
              <span className="sp-modal-info-value">{item.status}</span>
            </div>
          </div>

          <div className="sp-modal-info-item" style={{ marginTop: 14 }}>
            <span className="sp-modal-info-label">Punguan yang Dipimpin</span>
            <span className="sp-modal-info-value">{item.punguan_dipimpin}</span>
          </div>

          <div className="sp-modal-divider" />

          <p className="sp-modal-desc">{item.deskripsi}</p>
        </div>
      </div>
    </div>
  );
};

// ── KARTU PEMIMPIN ─────────────────────────────────────────────────────────────
const KartuPemimpin = ({ item, onClick, isPusat }) => (
  <div
    className={`sp-card ${isPusat ? "sp-card--pusat" : "sp-card--cabang"}`}
    onClick={() => onClick(item)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onClick(item)}
    aria-label={`Lihat profil ${item.nama}`}
  >
    <div className="sp-card-avatar">
      <AvatarPlaceholder nama={item.nama} size={52} />
    </div>
    <div className="sp-card-body">
      <span className={`sp-card-badge ${isPusat ? "sp-badge--pusat" : "sp-badge--cabang"}`}>
        {item.jabatan}
      </span>
      <h4 className="sp-card-name">{item.nama}</h4>
      <p className="sp-card-asal">📍 {item.asal_punguan}</p>
      <p className="sp-card-punguan">🏛 {item.punguan_dipimpin}</p>
    </div>
    <div className="sp-card-cta">Lihat Profil →</div>
  </div>
);

// ── SECTION UTAMA ──────────────────────────────────────────────────────────────
const SectionPemimpin = () => {
  const [expandPusat, setExpandPusat] = useState(true);
  const [expandCabang, setExpandCabang] = useState(true);
  const [expandRoot, setExpandRoot] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCardClick = (item) => setSelectedItem(item);
  const handleModalClose = () => setSelectedItem(null);

  return (
    <section className="sp-root">
      {/* ── Header Section utama ── */}
      <div
        className="sp-root-header"
        onClick={() => setExpandRoot((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setExpandRoot((v) => !v)}
        aria-expanded={expandRoot}
      >
        <div className="sp-root-header-left">
          <span className="sp-root-icon">👑</span>
          <div>
            <h2 className="sp-root-title">Daftar Pemimpin</h2>
            <p className="sp-root-subtitle">
              Raja Punguan &amp; Ulu Punguan Cabang
            </p>
          </div>
        </div>
        <span className={`sp-chevron ${expandRoot ? "sp-chevron--open" : ""}`}>
          ▼
        </span>
      </div>

      {/* ── Konten ── */}
      <div className={`sp-root-body ${expandRoot ? "sp-root-body--open" : ""}`}>
        {/* ── Sub-section: Pemimpin Pusat ── */}
        <div className="sp-subsection">
          <div
            className="sp-subsection-header sp-subsection-header--pusat"
            onClick={() => setExpandPusat((v) => !v)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setExpandPusat((v) => !v)}
            aria-expanded={expandPusat}
          >
            <div className="sp-subsection-header-left">
              <span className="sp-subsection-icon">🏛</span>
              <div>
                <h3 className="sp-subsection-title">Raja Punguan (Pemimpin Pusat)</h3>
                <span className="sp-subsection-count">
                  {PEMIMPIN_PUSAT.length} pemimpin
                </span>
              </div>
            </div>
            <span className={`sp-chevron ${expandPusat ? "sp-chevron--open" : ""}`}>
              ▼
            </span>
          </div>

          <div className={`sp-subsection-body ${expandPusat ? "sp-subsection-body--open" : ""}`}>
            <div className="sp-grid sp-grid--pusat">
              {PEMIMPIN_PUSAT.map((item) => (
                <KartuPemimpin
                  key={item.id}
                  item={item}
                  onClick={handleCardClick}
                  isPusat={true}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Sub-section: Ulu Punguan (Cabang) ── */}
        <div className="sp-subsection" style={{ marginTop: 20 }}>
          <div
            className="sp-subsection-header sp-subsection-header--cabang"
            onClick={() => setExpandCabang((v) => !v)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setExpandCabang((v) => !v)}
            aria-expanded={expandCabang}
          >
            <div className="sp-subsection-header-left">
              <span className="sp-subsection-icon">🌿</span>
              <div>
                <h3 className="sp-subsection-title">Ulu Punguan (Pemimpin Cabang)</h3>
                <span className="sp-subsection-count">
                  {ULU_PUNGUAN.length} punguan cabang
                </span>
              </div>
            </div>
            <span className={`sp-chevron ${expandCabang ? "sp-chevron--open" : ""}`}>
              ▼
            </span>
          </div>

          <div className={`sp-subsection-body ${expandCabang ? "sp-subsection-body--open" : ""}`}>
            <div className="sp-grid sp-grid--cabang">
              {ULU_PUNGUAN.map((item) => (
                <KartuPemimpin
                  key={item.id}
                  item={item}
                  onClick={handleCardClick}
                  isPusat={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      <Modal item={selectedItem} onClose={handleModalClose} />
    </section>
  );
};

export default SectionPemimpin;