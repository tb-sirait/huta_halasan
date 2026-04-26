// src/Knowledge/BalePartonggoanSection.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { balePartonggoanData } from "./balePartonggoan";
import "../../styles/bale-partonggoan.css";

const BalePartonggoanSection = () => {
  const navigate = useNavigate();

  const pasogit = balePartonggoanData.filter((b) => b.jenis === "Bale Pasogit");
  const parsantian = balePartonggoanData.filter(
    (b) => b.jenis === "Bale Parsantian",
  );

  const BaleCard = ({ item }) => (
    <div
      className="bp-card"
      onClick={() => navigate(item.route)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(item.route)}
    >
      <div className="bp-card-img-wrap">
        <img src={item.gambar} alt={item.nama} className="bp-card-img" />
        <span
          className={`bp-card-badge ${item.jenis === "Bale Pasogit" ? "bp-badge-pasogit" : "bp-badge-parsantian"}`}
        >
          {item.jenis}
        </span>
      </div>
      <div className="bp-card-body">
        <h3 className="bp-card-title">{item.nama}</h3>

        {/* Statistik Jemaat */}
        <div className="bp-jemaat-stats">
          <div className="bp-stat">
            <span className="bp-stat-val">{item.jemaat.kk}</span>
            <span className="bp-stat-label">KK</span>
          </div>
          <div className="bp-stat-divider" />
          <div className="bp-stat">
            <span className="bp-stat-val">{item.jemaat.orang}</span>
            <span className="bp-stat-label">Jemaat (orang)</span>
          </div>
        </div>

        <p className="bp-card-alamat">
          <span className="bp-icon">📍</span> {item.alamat}
        </p>
        <div className="bp-card-footer">
          <span className="bp-card-ulu">
            <span className="bp-icon">👤</span> {item.uluPunguan}
          </span>
          <span className="bp-card-cta">Lihat Detail →</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bp-section">
      <div className="k-section-label" style={{ marginBottom: 16 }}>
        ⛪ Bale Partonggoan – Tempat Ibadah
      </div>

      {pasogit.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="bp-sub-label">🏛 Bale Pasogit (Pusat)</div>
          <div className="bp-grid">
            {pasogit.map((item) => (
              <BaleCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {parsantian.length > 0 && (
        <div>
          <div className="bp-sub-label">🕌 Bale Parsantian (Cabang)</div>
          <div className="bp-grid">
            {parsantian.map((item) => (
              <BaleCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BalePartonggoanSection;
